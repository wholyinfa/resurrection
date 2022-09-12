import React from 'react';
import { useParams } from 'react-router-dom';
import { titleConversion } from './App';
import { Projects } from './data';
import NotFound from './NotFound';
import './Stylesheets/project.css';

export default function SingleProjectPage() {
    type Param = {projectName: string};
    const { projectName }: Param = useParams();

    const Project = Projects.filter( entry => titleConversion(entry.url) === projectName )[0];
    
    if( !Project ) return <NotFound />;
    return <h1>{Project.title}</h1>;
}