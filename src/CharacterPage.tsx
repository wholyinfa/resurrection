import React, { useEffect } from 'react';
import './Stylesheets/character.css';
import PropTypes, {InferProps} from 'prop-types';
import { Character, CharacterData } from './data';
export default function CharacterPage({}: InferProps<typeof CharacterPage.propTypes>) {
    useEffect(() => {
        
    }, [])
    return <article id='characterPage'>
        <div className='title'>
            <h1>CHARACTER</h1>
            <div>CHARACTER</div>
        </div>
        <section>
            {
                Object.entries(Character).map( ([deckType, deck], i) => {
                    return  <div key={i} className={`characterDeck ${deckType}`}>
                        <h2 className='title'>{deckType.toUpperCase()}</h2>
                        <div className={`deck ${deckType}`}>
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