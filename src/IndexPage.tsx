import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Stylesheets/index.css';
import { breakPoints } from './data';

export default function IndexPage() {

    let workHover: gsap.core.Timeline;
    let lifeHover: gsap.core.Timeline;
    let workResurrection: gsap.core.Timeline;
    let lifeResurrection: gsap.core.Timeline;
        
    const [isMobile, setIsMobile] = useState<boolean>();
    const resizePurposes = () => {
        setIsMobile( window.innerWidth <= breakPoints.dialer );
    }

    const gradientDeg = {
        default: (t: 'work' | 'life') : string => (t === 'work') ? '45deg' : '-45deg',
        mobile: (t: 'work' | 'life') : string => (t === 'work') ? '180deg' : '0deg',
    }
    const animProps = {
        color: (t: 'work' | 'life') : string => (t === 'work') ? 'rgba(26,35,126,1)' : 'rgba(6,78,59,1)',
        deg: gradientDeg.default,
    }
    useEffect(() => {
    
        if( window.innerWidth <= breakPoints.dialer ) animProps.deg = gradientDeg.mobile;
        else animProps.deg = gradientDeg.default;

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
        setHover('work');
        setHover('life');

        const setResurrection = (type: 'work' | 'life') => {
            const timeline = gsap.timeline({paused: true});
            const color = animProps.color(type);
            const opposite = (type === 'work') ? '.life' : '.work';
            const dur = .2;
            const ease = 'power4.in';
            const shadeBg = (deg: 90 | -90) => `linear-gradient(${deg}deg, rgba(0,0,0,0) 0%, ${color} 100%)`;

            timeline
            .set('#dialerContainer .shade', {autoAlpha: 0})
            .set('#dialerContainer .shade.R', {background: shadeBg(90)})
            .set('#dialerContainer .shade.L', {background: shadeBg(-90)})
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
        setResurrection('life');
        setResurrection('work');

    }, [isMobile]);


    useEffect(() => {
        resizePurposes();
        window.addEventListener('resize', resizePurposes);

        return( () => {
            window.removeEventListener('resize', resizePurposes)
        })
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