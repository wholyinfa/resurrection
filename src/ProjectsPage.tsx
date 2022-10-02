import React, { useEffect } from 'react';
import './Stylesheets/projects.css';
import PropTypes, {InferProps} from 'prop-types';
import { Projects } from './data';
import { Link } from 'react-router-dom';

function Card({title, context, url, imgSource}: InferProps<typeof Card.propTypes>) {
    return <div className='Card'>
        <img src={imgSource} alt={`Preview sample of ${title} project`} />
        <div className='content'>
            <p className='preTitle'>Project</p>
            <h2 className='title'>{title}</h2>
            <p className='brief'>{context}</p>
            <Link to={url} className='charcoalButton'>VIEW</Link>
        </div>
    </div>;
}
Card.propTypes ={
    title: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    imgSource: PropTypes.string.isRequired,
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
        {
            Projects.map(project => {
                return <Card
                    title = {project.title}
                    context = {project.context}
                    url = {project.url}
                    imgSource = {project.imgSource.preview}
                />
            })
        }
    </section>
</article>;
}
ProjectsPage.propTypes ={

}