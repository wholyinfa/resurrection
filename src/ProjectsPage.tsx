import React, { useEffect } from 'react';
import './Stylesheets/projects.css';
import PropTypes, {InferProps} from 'prop-types';

export default function ProjectsPage({paginating}: InferProps<typeof ProjectsPage.propTypes>) {
    useEffect(() => {
        
    }, [])
    return <h1>I'm projects</h1>;
}
ProjectsPage.propTypes ={
    paginating: PropTypes.func.isRequired
}