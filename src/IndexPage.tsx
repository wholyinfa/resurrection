import React from 'react';
import './Stylesheets/index.css';
export default function IndexPage() {



    return <article id='homePage'>
        <div id='overTakers'>
            <div className='work'></div>
            <div className='life'></div>
        </div>
        <div id='division'>
            <div className='work'>
                <div className='treeBrain'></div>
                <button className='borderButton'>WORK</button>
            </div>
            <div className='life'>
                <div className='treeBrain'></div>
                <button className='borderButton'>LIFE</button>
            </div>
        </div>
        <div className='theBreathingFragment'></div>
    </article>;
}