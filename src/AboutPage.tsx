import React, { useEffect } from 'react';
import './Stylesheets/about.css';
import PropTypes, {InferProps} from 'prop-types';
export default function AboutPage({paginating}: InferProps<typeof AboutPage.propTypes>) {

    useEffect(() => {
        
    }, [])
    return <h1>I'm about</h1>;
}
AboutPage.propTypes ={
    paginating: PropTypes.func.isRequired
}