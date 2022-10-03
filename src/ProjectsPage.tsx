import React, { useEffect } from 'react';
import './Stylesheets/projects.css';
import PropTypes, {InferProps} from 'prop-types';
import { Pages, Projects } from './data';
import { Link } from 'react-router-dom';

function Card({title, context, url, imgSource}: InferProps<typeof Card.propTypes>) {
    return <div className='card cobalt'>
        <div className='img' style={{backgroundImage: `url('${imgSource}')`}} />
        <div className='content'>
            <p className='preTitle'>Project</p>
            <h2 className='title'>{title}</h2>
            <p className='brief'>{context+'...'}</p>
            <Link to={Pages.projects.url+'/'+url} className='charcoalButton card'>VIEW</Link>
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
    <section className='previewCards'>
        {
            Projects.map( (project, i) => {
                let brief = project.context.slice(0, 100);
                brief = brief.slice(0, brief.lastIndexOf(' '));
                return <Card
                    key = {i}
                    title = {project.title}
                    context = {brief}
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