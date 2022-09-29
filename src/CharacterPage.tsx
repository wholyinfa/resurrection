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

        </section>
    </article>;
}
CharacterPage.propTypes ={
    
}