import React from 'react';
import './Stylesheets/contact.css';
import PropTypes, {InferProps} from 'prop-types';
export default function ContactPage({paginating}: InferProps<typeof ContactPage.propTypes>) {
    return <h1>I'm contact</h1>;
}
ContactPage.propTypes ={
    paginating: PropTypes.func.isRequired
}