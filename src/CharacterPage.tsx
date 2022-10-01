import React, { useEffect } from 'react';
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import PropTypes, {InferProps} from 'prop-types';
import { Character, CharacterData } from './data';
import './Stylesheets/character.css';
gsap.registerPlugin(Draggable);
export default function CharacterPage({}: InferProps<typeof CharacterPage.propTypes>) {

    useEffect(() => {
        Array.from(document.querySelectorAll('.characterDeck')).map(deck => {
            const maxX = Object(deck.querySelector('.card')).offsetLeft
            const totalCards = deck.querySelectorAll('.card').length;
            const theGap = (maxX / (totalCards-1));
            const slider = deck.querySelector('.slider');
            Draggable.create(slider, {
                type: 'x',
                trigger: [slider, ...deck.querySelectorAll('.card')],
                edgeResistance: 1,
                bounds: {minX: 0, maxX: maxX},
                liveSnap: (i) => Math.round(i / theGap) * theGap,
                zIndexBoost: false,
                onPress: function() {
                },
                onDrag: function() {
                },
                onDragEnd: function() {
                },
                onRelease: function() {
                }
            });
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