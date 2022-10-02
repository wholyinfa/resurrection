import React, { useEffect } from 'react';
import './Stylesheets/projects.css';
import PropTypes, {InferProps} from 'prop-types';

const Card = () => {
    return <div className='Card'>
        <img src='' alt='' />
        <div className='content'>
            <p className='preTitle'>Project</p>
            <h2 className='title'>Project Title</h2>
            <p className='brief'>
                Brief description of this project...
            </p>
            <button className='charcoalButton'>VIEW</button>
        </div>
    </div>;
}
export default function ProjectsPage({}: InferProps<typeof ProjectsPage.propTypes>) {
    useEffect(() => {
        
    }, [])
    return <article id='projectsPage'>
    <div className='title'>
        <h1>PROJECTS</h1>
        <div>PROJECTS</div>
    </div>
    <section>
        <Card />
    </section>
</article>;
}
ProjectsPage.propTypes ={

}