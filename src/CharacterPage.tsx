import React, { useEffect, useRef } from 'react';
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import PropTypes, {InferProps} from 'prop-types';
import { Character, CharacterData } from './data';
import './Stylesheets/character.css';
gsap.registerPlugin(Draggable);
export default function CharacterPage({}: InferProps<typeof CharacterPage.propTypes>) {

    interface pressAttr {
        target: HTMLElement | null,
        x: number
    } 
    const pressElm = useRef<pressAttr>({
        target: null,
        x: -1
    });
    useEffect(() => {
        Array.from(document.querySelectorAll('.characterDeck')).map(deck => {
            const maxX = Object(deck.querySelector('.card')).offsetLeft
            const totalCards = deck.querySelectorAll('.card').length;
            const theGap = (maxX / (totalCards-1));
            const slider = deck.querySelector('.slider');
            const snapPoint = (i: number) => Math.round(i / theGap) * theGap;
            Draggable.create(slider, {
                type: 'x',
                trigger: [slider, ...deck.querySelectorAll('.card')],
                edgeResistance: 1,
                bounds: {minX: 0, maxX: -maxX},
                liveSnap: (i) => snapPoint(i),
                zIndexBoost: false,
                onPress: function() {
                    pressElm.current = {
                        target: findCard(this.pointerEvent.target),
                        x: this.x
                    };
                },
                onDrag: function(this) {
                    shuffle(this, this.x);
                },
                onRelease: function() {
                    if(
                        pressElm.current.x === this.x &&
                        pressElm.current !== null && pressElm.current.target === findCard(this.pointerEvent.target)
                        ){
                            const x = -Object(pressElm.current.target).offsetLeft;
                            gsap.set(slider, {x: x});
                            shuffle(this, x);
                        }
                }
            });
            const shuffle = (deckSlider: Draggable.Vars, x: number) => {
                const deck = deckSlider.target.parentElement;
                const type = (deck.classList.contains('life')) ? 'life' :
                             (deck.classList.contains('work')) ? 'work' : '';
                const cards: Element[] = deck.querySelectorAll('.card');
                const totalCards = cards.length;
                const i = (totalCards - 1) - Math.abs(x / theGap);
                const deadCards = Array.from(cards).splice(i+1, totalCards);
                const liveCards = Array.from(cards).splice(0, i+1);

                let freshDead: Element[] = [];
                if( deadCards.length > 0 ){
                    deadCards.map( card => {
                        if( !card.classList.contains('hidden') ){
                            card.classList.add('hidden');
                            freshDead.push(card);
                        }
                    });
                }

                let freshLife: Element[] = [];
                if( liveCards.length > 0 ){
                    liveCards.map( card => {
                        if( card.classList.contains('hidden') ){
                            card.classList.remove('hidden');
                            freshLife.push(card);
                        }
                    });
                }

                if( freshDead.length > 0 ){
                    freshDead.map(card => {
                        gsap.to(card, {autoAlpha: 0, scaleX: 0, duration: .2, transformOrigin: 'left'});
                    });
                }
                if( freshLife.length > 0 ){
                    freshLife.map(card => {
                        gsap.to(card, {autoAlpha: 1, scaleX: 1, duration: .2, transformOrigin: 'left'});
                    });
                }

                const visibleCards = Array.from(cards).filter(card => !card.classList.contains('hidden'));
                const topGap = ( type === 'life' ) ? Object(Array.from(cards)[1]).offsetTop: Object(Array.from(cards)[totalCards-1]).offsetTop;
                const y = ( type === 'life' ) ? (totalCards - i - 1) * topGap :
                          ( type === 'work' ) ? -((totalCards - i - 1) * topGap) : 0;
                visibleCards.map(card => {
                    gsap.to(card, {x: x, y: y});
                })

            }
            const findCard = (target: HTMLElement) => {
                let parent = target.parentElement;
                for( let i = 0; i < 10000; i++ ){
                    if( target.classList && target.classList.contains('card') ){
                        parent = target;
                        break;
                    }
                    if( parent && parent.classList.contains('card') ){
                        parent = parent;
                        break;
                    }else{
                        parent = parent && parent.parentElement;
                    }
                }
                return parent;
            }
        })
    }, []);

    return <article id='characterPage'>
        <div className='title'>
            <h1>CHARACTER</h1>
            <div>CHARACTER</div>
        </div>
        <section>
            {
                Object.entries(Character).map( ([deckType, deck], i) => {
                    return  <div key={i} className={`characterDeck ${deckType}`}>
                        <div className={`deck ${deckType}`}>
                        <div className='slider'></div>
                        <h2 className='title'>{deckType.toUpperCase()}</h2>
                            { [...deck].reverse().map( (item: CharacterData, i: number) => {
                                return <div key={i}
                                    className={`card ${(deckType === 'life') ? 'reverseLight': ''}`}
                                >
                                    <div className='icon'>
                                        <img src={item.imgSource} />
                                    </div>
                                    <div className='title'>
                                        THE
                                        <span>{item.title.toUpperCase()}</span>
                                        <h2>
                                            {item.title.toUpperCase()}
                                        </h2>
                                    </div>
                                    <div className='description'>
                                        {item.description}
                                    </div>
                                </div>;
                            })}
                        </div>
                    </div>
                })
            }
        </section>
    </article>;
}
CharacterPage.propTypes ={
    
}