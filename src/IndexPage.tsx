import React, { useEffect } from 'react';
import gsap from 'gsap';
import './Stylesheets/index.css';

export default function IndexPage() {


    let workHover: gsap.core.Timeline;
    let lifeHover: gsap.core.Timeline;
    useEffect(() => {
        if( typeof workHover === 'undefined' ){
            workHover = gsap.timeline({paused: true});
            workHover.fromTo('#overTakers .work',
            {background: 'linear-gradient(45deg, rgba(26,35,126,1) 0%, rgba(0,0,0,0) 23%)'},
            {background: 'linear-gradient(45deg, rgba(26,35,126,1) 0%, rgba(0,0,0,0) 33%)',
             ease: 'circ.inOut',
            duration: .2});
        }
        if( typeof lifeHover === 'undefined' ){
            lifeHover = gsap.timeline({paused: true});
            lifeHover.fromTo('#overTakers .life',
            {background: 'linear-gradient(-45deg, rgba(6,78,59,1) 0%, rgba(0,0,0,0) 23%)'},
            {background: 'linear-gradient(-45deg, rgba(6,78,59,1) 0%, rgba(0,0,0,0) 33%)',
             ease: 'circ.inOut',
            duration: .2});
        }
    }, [])

    const handleMouseEnter = (type?: 'life' | 'work') => {
        if( type === 'work' ){
            workHover.play();
        }else{
            lifeHover.play();
        }
    }
    const handleMouseLeave = (type?: 'life' | 'work') => {
        if( type === 'work' ){
            workHover.reverse();
        }else{
            lifeHover.reverse();
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
                onMouseEnter={() => handleMouseEnter('work')}
                onMouseLeave={() => handleMouseLeave('work')}><span>WORK</span></button>
            </div>
            <div className='life'>
                <div className='treeBrain'></div>
                <button className='borderButton'
                onMouseEnter={() => handleMouseEnter('life')}
                onMouseLeave={() => handleMouseLeave('life')}><span>LIFE</span></button>
            </div>
        </div>
        <img src={require('./Assets/BreathingFragment.svg')} className='breathingFragment' />
    </article>;
}