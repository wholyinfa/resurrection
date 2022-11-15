import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { titleConversion } from './App';
import { builtWith, Projects } from './data';
import NotFound from './NotFound';
import './Stylesheets/singleproject.css';

export default function SingleProjectPage() {
    type Param = {projectName: string};
    const { projectName }: Param = useParams();

    const Project = Projects.filter( entry => titleConversion(entry.url) === projectName )[0];
    if( !Project ) return <NotFound />;
    
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
        if ( tool === 'semantic' ) return addAlt('Semantic UI');
    }
    return <article id='singleProjectPage'>
        <section className='post'>
            <h1 className='title'>{Project.title.toUpperCase()}</h1>
            <div className='content'>{Project.context}</div>
            { (Project.src) ?
                <div><Link target={'_blank'} className='charcoalButton card' to={Project.src} >VISIT PROJECT</Link></div>:
                ''
            }
        </section>
        <section className='builtWith'>
            <h2>BUILT WITH</h2>
            <div className='tools'>
                {
                    Project.builtWith.map( (tool, i) => {
                        return <div key={i}>
                            <img src={require(`./Assets/Projects/BuiltWith/${tool}.svg`)} alt={tools(tool, true)} />
                            <h3>{tools(tool)}</h3>
                            </div>
                    })
                }
            </div>
        </section>
        <section className='samples'>
            <div id='desktop' style={{backgroundImage: `url('${Project.imgSource.desktop}')`}}></div>
            <div id='tablet' style={{backgroundImage: `url('${Project.imgSource.tablet}')`}}></div>
            <div id='mobile' style={{backgroundImage: `url('${Project.imgSource.mobile}')`}}></div>
        </section>
</article>;
}