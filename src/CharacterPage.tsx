import React, { useEffect } from 'react';
import './Stylesheets/character.css';
import PropTypes, {InferProps} from 'prop-types';
export default function CharacterPage({paginating}: InferProps<typeof CharacterPage.propTypes>) {
    useEffect(() => {
        
    }, [])
    return <h1>I'm character</h1>;
}
CharacterPage.propTypes ={
    paginating: PropTypes.func.isRequired
}