import React, { useEffect } from 'react';
import './Stylesheets/about.css';
import PropTypes, {InferProps} from 'prop-types';

const BrandContent = () => {
    return <>
    <img src={require('./Assets/BreathingFragment.svg')} className='breathingFragment' alt='The main logo | Infa (infamousrocket)' />
    <div id='myName'>INFA</div>
    </>;
}
export default function AboutPage({isMobile}: InferProps<typeof AboutPage.propTypes>) {

    useEffect(() => {
        
    }, [])
    return <article id='aboutPage'>
        <div className='title'>
            <h1>ABOUT</h1>
            <div>ABOUT</div>
        </div>
        <section>
            {
                (!isMobile) ? <div id='brand'><BrandContent /></div> :
                <BrandContent />
            }
            <h2>The INFAmous Rocket ...</h2>
            <p>is a character I've created at the age of 18 and it was for a long time used as my nickname; Now it's my name!</p>
            <p>
            The main attribute of this character is to always improve towards the better and believe in his capabilities regardless of recognition or appreciation from outside, hence the name, The Infamous Rocket.
            </p>
            <h2>Frontend Web Developer</h2>
            <p>As a web enthusiast, I started familiarizing myself with the web design technologies at the age of 13 and since then I constantly actualize my knowledge as a frontend web developer.</p>
            <p>I already can work fluently with JavaScript libraries such as ReactJS and am highly specialized with the matured and beloved jQuery. ECMAScript 2015 or ES6 itself is also one of my strong suits.</p>
            <p>It's to be note that CSS 3 and it's powerful pre-processors like Sass, are also second nature to me. That's why all of my projects naturally support responsive web design.</p>
            <p>Since I understand the importance of motion design in attracting user's attention and impacting the interest rate of a webpage, I can also work with powerful animation platforms such as GSAP.</p>
            <h2>UI / UX Designer</h2>
            <p>Although my main focus is towards being a web developer, I'm also interested in designing user-friendly components.</p>
            <p>I started out with Adobe Photoshop and progressed my way towards the vector world using Adobe Illustrator and finally have been baptized with the blessing of Adobe Xd which is what I currently use to make mockups, prototypes, wireframes and adaptive, agile UI/UX designs.</p>
        </section>
    </article>;
}
AboutPage.propTypes ={
    isMobile: PropTypes.bool.isRequired
}