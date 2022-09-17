import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Stylesheets/index.css';

export default function IndexPage() {


    let workHover: gsap.core.Timeline;
    let lifeHover: gsap.core.Timeline;
    let workResurrection: gsap.core.Timeline;
    let lifeResurrection: gsap.core.Timeline;
    useEffect(() => {
        

        const animProps = {
            color: (t: 'work' | 'life') => (t === 'work') ? 'rgba(26,35,126,1)' : 'rgba(6,78,59,1)',
            deg: (t: 'work' | 'life') => (t === 'work') ? '45deg' : '-45deg',
        }
        const setHover = (type: 'work' | 'life') => {
            const timeline = gsap.timeline({paused: true});
            const color = animProps.color(type);
            const deg = animProps.deg(type);

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
        if( typeof workHover === 'undefined' ) setHover('work');
        if( typeof lifeHover === 'undefined' ) setHover('life');

        const setResurrection = (type: 'work' | 'life') => {
            const timeline = gsap.timeline({paused: true});
            const color = animProps.color(type);
            const opposite = (type === 'work') ? '.life' : '.work';
            const dur = .2;
            const ease = 'power4.in';

            timeline
            .set('#dialerContainer .shade', {
                autoAlpha: 0,
                background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${color} 100%)`,
            })
            .to('#division', {autoAlpha: 0, scale: .8, duration: dur, ease: ease})
            .to(`#overTakers ${opposite}`, {autoAlpha: 0, duration: dur, ease: ease}, '<')
            .to('body', {background: color, duration: dur, ease: ease}, `<`)
            .set('#dialerContainer .shade', {autoAlpha: 1})
            .to(`#overTakers .${type}`, {autoAlpha: 0, duration: dur, ease: ease});
            
            if( type === 'work' )
                workResurrection = timeline;
            else
                lifeResurrection = timeline;
        }
        if( typeof lifeResurrection === 'undefined' ) setResurrection('life');
        if( typeof workResurrection === 'undefined' ) setResurrection('work');
    }, []);

    const handleMouseEnter = (type?: 'life' | 'work') => {
        if (resurrecting.current) return; 
        if( type === 'work' ){
            workHover && workHover.play();
        }else{
            lifeHover && lifeHover.play();
        }
    }
    const handleMouseLeave = (type?: 'life' | 'work') => {
        if (resurrecting.current) return; 
        if( type === 'work' ){
            workHover && workHover.reverse();
        }else{
            lifeHover && lifeHover.reverse();
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
        <img src={require('./Assets/BreathingFragment.svg')} className='breathingFragment' alt='The main logo | Infa (infamousrocket)' />
        </div>
    </article>;
}