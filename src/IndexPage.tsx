import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Stylesheets/index.css';
import { breakPoints } from './data';
import PropTypes, {InferProps} from 'prop-types';
import { animProps } from './Menu';
import { useHistory } from 'react-router-dom';


export default function IndexPage({isMobile}: InferProps<typeof IndexPage.propTypes>) {
    let workHover: gsap.core.Timeline = gsap.timeline({paused: true});
    let lifeHover: gsap.core.Timeline = gsap.timeline({paused: true});
    let workResurrection: gsap.core.Timeline = gsap.timeline({paused: true});
    let lifeResurrection: gsap.core.Timeline = gsap.timeline({paused: true});

    useEffect(() => {
        
    }, [])

    const gradientDeg = {
        default: (t: 'work' | 'life') : string => (t === 'work') ? '45deg' : '-45deg',
        mobile: (t: 'work' | 'life') : string => (t === 'work') ? '180deg' : '0deg',
    }
    const setHover = (type: 'work' | 'life') => {
        const timeline = gsap.timeline({paused: true});
        const color = animProps.color(type);
        const deg = ( window.innerWidth <= breakPoints.dialer ) ? gradientDeg.mobile(type) : gradientDeg.default(type);

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
    const history = useHistory();
    useEffect(() => {
  
        setHover('work');
        setHover('life');

        const setResurrection = (type: 'work' | 'life') => {
            const timeline = gsap.timeline({paused: true});
            const opposite = (type === 'work') ? '.life' : '.work';
            const dur = .2;
            const ease = 'power4.in';

            timeline
            .to('#division', {autoAlpha: 0, scale: 0, duration: dur, ease: ease})
            .to(`#overTakers ${opposite}`, {autoAlpha: 0, duration: dur, ease: ease}, '<')
            .eventCallback('onComplete', () => {
                history.replace(( type === 'life' ) ? '/about' : '/projects');
            });
            
            if( type === 'work' )
                workResurrection = timeline;
            else
                lifeResurrection = timeline;
        }
        setResurrection('life');
        setResurrection('work');

    }, [isMobile]);

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
IndexPage.propTypes ={
    isMobile: PropTypes.bool.isRequired,
    isPaginating: PropTypes.any.isRequired,
    newPage: PropTypes.any.isRequired
}