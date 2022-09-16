import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Stylesheets/index.css';

export default function IndexPage() {


    let workHover: gsap.core.Timeline;
    let lifeHover: gsap.core.Timeline;
    let workResurrection: gsap.core.Timeline;
    let lifeResurrection: gsap.core.Timeline;
    useEffect(() => {
        
        const setHover = (type: 'work' | 'life') => {
            let timeline = gsap.timeline({paused: true});
            let color = (type === 'work') ? 'rgba(26,35,126,1)' : 'rgba(6,78,59,1)';
            let deg = (type === 'work') ? '45deg' : '-45deg';

            timeline.fromTo(`#overTakers .${type}`,
            {background: `linear-gradient(${deg}, ${color} 0%, rgba(0,0,0,0) 23%)`},
            {background: `linear-gradient(${deg}, ${color} 0%, rgba(0,0,0,0) 33%)`,
             ease: 'circ.inOut',
             duration: .5});
            
            if( type === 'work' )
                workHover = timeline;
            else
                lifeHover = timeline;
        }
        if( typeof workHover === 'undefined' ){
            setHover('work');
        }
        if( typeof lifeHover === 'undefined' ){
            setHover('life');
        }

        const setResurrection = (type: 'work' | 'life') => {
            let timeline = gsap.timeline({paused: true});
            let color = (type === 'work') ? 'rgba(26,35,126,1)' : 'rgba(6,78,59,1)';
            let deg = (type === 'work') ? '45deg' : '-45deg';
            let opposite = (type === 'work') ? '.life' : '.work';

            timeline
            .to('#division button, #division .treeBrain, #homePage .breathingFragment', {autoAlpha: 0})
            .to(`#overTakers ${opposite}`, {autoAlpha: 0}, '<')
            .fromTo(`#overTakers .${type}`,
                {background: `linear-gradient(${deg}, ${color} 0%, rgba(0,0,0,0) 23%)`},
                {background: `linear-gradient(${deg}, ${color} 0%, rgba(0,0,0,0) 200%)`}, '<')
            .to('body', {background: color}, '.1<')
            .to(`#overTakers .${type}`, {autoAlpha: 0});
            
            if( type === 'work' )
                workResurrection = timeline;
            else
                lifeResurrection = timeline;
        }
        if( typeof lifeResurrection === 'undefined' ){
            setResurrection('life');
        }
        if( typeof workResurrection === 'undefined' ){
            setResurrection('work');
        }
    }, []);

    const handleMouseEnter = (type?: 'life' | 'work') => {
        if (resurrecting.current) return; 
        if( type === 'work' ){
            workHover.play();
        }else{
            lifeHover.play();
        }
    }
    const handleMouseLeave = (type?: 'life' | 'work') => {
        if (resurrecting.current) return; 
        if( type === 'work' ){
            workHover.reverse();
        }else{
            lifeHover.reverse();
        }
    }

    const applyResurrection = () => {

    }
    const resurrecting = useRef<boolean>(false);
    const handleClick = (type?: 'life' | 'work') => {
        resurrecting.current = true;
        if( type === 'work' ){
            workResurrection.play();
        }else{
            lifeResurrection.play();
        }
    }

    return <article id='homePage'>
        <div id='overTakers'>
            <div className='work'></div>
            <div className='life'></div>
        </div>
        <div id='division'>
            <div className='work'>
                <div className='treeBrain'></div>
                <button className='borderButton'
                onClick={() => handleClick('work')}
                onMouseEnter={() => handleMouseEnter('work')}
                onMouseLeave={() => handleMouseLeave('work')}><span>WORK</span></button>
            </div>
            <div className='life'>
                <div className='treeBrain'></div>
                <button className='borderButton'
                onClick={() => handleClick('life')}
                onMouseEnter={() => handleMouseEnter('life')}
                onMouseLeave={() => handleMouseLeave('life')}><span>LIFE</span></button>
            </div>
        </div>
        <img src={require('./Assets/BreathingFragment.svg')} className='breathingFragment' />
    </article>;
}