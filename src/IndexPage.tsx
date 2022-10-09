import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Stylesheets/index.css';
import { breakPoints } from './data';
import PropTypes, {InferProps} from 'prop-types';
import { animProps } from './Menu';
import { useHistory } from 'react-router-dom';


let workHover: gsap.core.Timeline;
let lifeHover: gsap.core.Timeline;
export default function IndexPage({isMobile}: InferProps<typeof IndexPage.propTypes>) {

    type Type = 'work' | 'life';
    const gradientDeg = {
        default: (t: Type) : string => (t === 'work') ? '45deg' : '-45deg',
        mobile: (t: Type) : string => (t === 'work') ? '180deg' : '0deg',
    }
    const hoverTimeline = (type: Type) => {
        const timeline = gsap.timeline({paused: true});
        const color = animProps.color(type);
        const deg = ( trueMobile.current ) ? gradientDeg.mobile(type) : gradientDeg.default(type);

        timeline.fromTo(`#overTakers .${type}`,
        {background: `linear-gradient(${deg}, ${color} 0%, rgba(0,0,0,0) 23%)`},
        {background: `linear-gradient(${deg}, ${color} 0%, rgba(0,0,0,0) 33%)`,
         ease: 'circ.inOut',
         duration: .5});

         return timeline;
    }
    const trueMobile = useRef<boolean>(isMobile);
    useEffect(() => {
        trueMobile.current = isMobile;
        workHover = hoverTimeline('work');
        lifeHover = hoverTimeline('life');
    }, [isMobile])

    const hover = (type: Type, reverse?: boolean) => {
        if (resurrecting.current || trueMobile.current) return; 
        const targetTimeline = ( type === 'work' ) ? workHover : lifeHover;  
        if ( reverse ) targetTimeline.reverse();
        else {
            targetTimeline.reversed(!targetTimeline.reversed());
            targetTimeline.play();
        }
    }
    const handleMouseEnter = (type: Type) => hover(type);
    const handleMouseLeave = (type: Type) => hover(type, true);

    const history = useHistory();
    const setResurrection = (type: Type) => {
        const timeline = gsap.timeline();
        const opposite = (type === 'work') ? '.life' : '.work';
        const dur = .2;
        const ease = 'power4.in';

        timeline
        .to('#division', {autoAlpha: 0, scale: 0, duration: dur, ease: ease})
        .to(`#overTakers ${opposite}`, {autoAlpha: 0, duration: dur, ease: ease}, '<')
        .eventCallback('onComplete', () => {
            history.replace(( type === 'life' ) ? '/about' : '/projects');
        });
    }
    const resurrecting = useRef<boolean>(false);
    const handleClick = (type: Type) => {
        resurrecting.current = true;
        setResurrection(type);
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