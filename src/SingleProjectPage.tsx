import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { titleConversion } from './App';
import { Projects } from './data';
import NotFound from './NotFound';
import './Stylesheets/projects.css';
import PropTypes, {InferProps} from 'prop-types';

export default function SingleProjectPage({}: InferProps<typeof SingleProjectPage.propTypes>) {
    type Param = {projectName: string};
    const { projectName }: Param = useParams();

    const Project = Projects.filter( entry => titleConversion(entry.url) === projectName )[0];
    if( !Project ) return <NotFound />;

    useEffect(() => {
        
    }, []);
    
    return <article id='singleProjectPage'>
        <section className='post'>
            <h1 className='title'></h1>
            <p className='content'></p>
            <Link to={''} >VISIT PROJECT</Link>
        </section>
        <section className='samples'>
            <img id='desktop' src={''} alt={''} />
            <img id='tablet' src={''} alt={''} />
            <img id='mobile' src={''} alt={''} />
        </section>
        <section className='builtWith'>
            <h2>BUILT WITH</h2>
            <div>
                <img src={''} alt={''} />
                <h3>TOOL'S NAME</h3>
            </div>
        </section>
</article>;
}
SingleProjectPage.propTypes ={
    
}