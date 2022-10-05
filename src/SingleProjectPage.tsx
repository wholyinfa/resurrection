import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { titleConversion } from './App';
import { builtWith, Projects } from './data';
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
    
    const tools = (tool: builtWith, alt?: boolean) => {
        const addAlt = (title: string) => (alt) ? `Icon of ${title} as a tool that was used to make this project` : title;

        if ( tool === 'ai' ) return addAlt('Adobe Illustrator');
        if ( tool === 'ps' ) return addAlt('Adobe Photoshop');
        if ( tool === 'xd' ) return addAlt('Adobe Xd');
        if ( tool === 'html' ) return addAlt('HTML5');
        if ( tool === 'css' ) return addAlt('CSS3');
        if ( tool === 'js' ) return addAlt('JS ES6');
        if ( tool === 'jq' ) return addAlt('jQuery');
        if ( tool === 'ts' ) return addAlt('TypeScript');
        if ( tool === 'react' ) return addAlt('ReactJS');
        if ( tool === 'sass' ) return addAlt('Sass');
        if ( tool === 'gsap' ) return addAlt('GSAP');
    }
    const alt = (device: 'Desktop' | 'Tablet' | 'Mobile') => `${device} sample of the ${Project.title} project`;
    return <article id='singleProjectPage'>
        <section className='post'>
            <h1 className='title'>{Project.title}</h1>
            <p className='content'>{Project.context}</p>
            <Link to={Project.url} >VISIT PROJECT</Link>
        </section>
        <section className='samples'>
            <img id='desktop' src={Project.imgSource.desktop} alt={alt('Desktop')} />
            <img id='tablet' src={Project.imgSource.tablet} alt={alt('Tablet')} />
            <img id='mobile' src={Project.imgSource.mobile} alt={alt('Mobile')} />
        </section>
        <section className='builtWith'>
            <h2>BUILT WITH</h2>
                {
                    Project.builtWith.map( (tool, i) => {
                        return <div key={i}>
                            <img src={require(`./Assets/Projects/BuiltWith/${tool}.svg`)} alt={tools(tool, true)} />
                            <h3>{tools(tool)}</h3>
                            </div>
                    })
                }
        </section>
</article>;
}
SingleProjectPage.propTypes ={
    
}