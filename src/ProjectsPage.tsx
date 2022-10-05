import React, { useEffect } from 'react';
import './Stylesheets/projects.css';
import PropTypes, {InferProps} from 'prop-types';
import { Pages, Projects } from './data';
import { Link, useHistory } from 'react-router-dom';

function Card({title, context, url, imgSource, handleClick}: InferProps<typeof Card.propTypes>) {
    const aURL = Pages.projects.url+'/'+url;
    return <div className='card cobalt'>
        <div className='img' style={{backgroundImage: `url('${imgSource}')`}} />
        <div className='content'>
            <p className='preTitle'>Project</p>
            <h2 className='title'>{title}</h2>
            <p className='brief'>{context+'...'}</p>
            <Link onClick={(e) => handleClick(e,aURL)} to={aURL} className='charcoalButton card'>VIEW</Link>
        </div>
    </div>;
}
Card.propTypes ={
    title: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    imgSource: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired
}
export default function ProjectsPage({setImposeSequence}: InferProps<typeof ProjectsPage.propTypes>) {
    const history = useHistory();
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, url: string) => {
        e.preventDefault();
        
        const callback = () => history.push(url);
        setImposeSequence( () => callback);
    }
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
                    handleClick = {handleClick}
                />
            })
        }
    </section>
</article>;
}
ProjectsPage.propTypes ={
    setImposeSequence: PropTypes.func.isRequired,
}