import React, { useEffect } from 'react';
import './Stylesheets/character.css';
import PropTypes, {InferProps} from 'prop-types';
export default function CharacterPage({}: InferProps<typeof CharacterPage.propTypes>) {
    useEffect(() => {
        
    }, [])
    return <article id='characterPage'>
        <div className='title'>
            <h1>CHARACTER</h1>
            <div>CHARACTER</div>
        </div>
        <section>
            <div className='characterDeck life'>
                <h2 className='title'>LIFE</h2>
                <div className='deck'>
                    <div className='card'>
                        <img src='' />
                        <div className='title'>
                            THE
                            <h2>TITLE</h2>
                        </div>
                        <div className='description'>
                            Some text
                        </div>
                    </div>
                </div>
            </div>
            <div className='characterDeck work'>
                <h2 className='title'>WORK</h2>
                <div className='deck'>
                    <div className='card'>
                        <img src='' />
                        <div className='title'>
                            THE
                            <h2>TITLE</h2>
                        </div>
                        <div className='description'>
                            Some text
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </article>;
}
CharacterPage.propTypes ={
    
}