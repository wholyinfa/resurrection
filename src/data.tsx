import React, { ReactElement } from 'react';

export const defaultTitlePrefix = 'Frontend Web Developer & UI/UX Designer | INFA';

export interface PageData {
    title: string;
    url: string;
    text: string;
}
export interface Pages {
    projects: PageData;
    contact: PageData;
    index: PageData;
    about: PageData;
    character: PageData;
};
export const Pages: Pages = {
    projects: {
        title: 'Projects - '+defaultTitlePrefix,
        url: '/projects',
        text: 'PROJECTS',
    },
    contact: {
        title: 'Contact - '+defaultTitlePrefix,
        url: '/contact',
        text: 'CONTACT',
    },
    index: {
        title: defaultTitlePrefix,
        url: '/',
        text: 'HOME PAGE',
    },
    about: {
        title: 'About - '+defaultTitlePrefix,
        url: '/about',
        text: 'ABOUT',
    },
    character: {
        title: 'Character - '+defaultTitlePrefix,
        url: '/character',
        text: 'CHARACTER',
    },
}

export type builtWith = 'ps' | 'xd' | 'ai' | 'jq' | 'html' | 'react' | 'css' | 'sass' | 'gsap' | 'js' | 'ts';
export interface ProjectType {
    title: string;
    context: ReactElement;
    brief: string;
    url: string;
    src: string;
    imgSource: {
        preview: string;
        desktop: string;
        tablet: string;
        mobile: string;
    };
    builtWith: ('ps' | 'xd' | 'ai' | 'jq' | 'html' | 'react' | 'css' | 'sass' | 'gsap' | 'js' | 'ts')[];
};
export const Projects: ProjectType[] = [
    {
        title: 'Project End',
        brief: '',
        context: <>
        <p>Holding the flag as my first portfolio, this project might seem like a try-too-hard attempt to show off some skills as it sacrified normal UX design to give the user the experience of 'FLYING'...! At that, it delivers flawlessly.</p>
        <p>At that point I haven't seen a website that have achieved what I've achieved in this project without using any engines or libraries other than what could at that time be used to create usual websites without making the website too heavy.</p>
        <p>It's safe to say that this project not only pushed me and my knowledge to the edge and beyond, it applies the same approach to the tools that were used to create it, making it a bit laggy and heavy on low-end devices; Hence one of the reasons of it being my last portfolio and not the current!</p>
        <p>When it comes to the World Wide Web and making website, I'm a strong believer in using tools and programming languages, libraries and frameworks that do more by writing less cumbersome chunks of code and are as reusable and efficient, if not more.</p>
        <p>For this reason I could no longer accept Project End as the first representative of my skills and abilities even thought it's a tank of a showcase!</p>
        </>,
        url: 'end',
        src: '/end',
        imgSource: {
            preview: require('./Assets/Projects/end/Mobile.jpg'),
            desktop: require('./Assets/Projects/end/Desktop.jpg'),
            tablet: require('./Assets/Projects/end/Tablet.jpg'),
            mobile: require('./Assets/Projects/end/Mobile.jpg')
        },
        builtWith: ['ps', 'ai', 'jq', 'html', 'css', 'gsap', 'js'],
    },
    {
        title: 'Golden Vibes, Golden Life',
        brief: '',
        context: <>
        <p>This personal website starts the journey to both a magnificent portfolio and personal blog, along with the start of a new era in front-end development and the User Experience and User Interface design.</p>
        <p>The initial approach to the making of this project came from the motivation of ending some React and Sass courses along with learning how to properly design webpages using a tool that is meant to be used for this purpose, Adobe Xd.</p>
        <p>Despite the challenges of working with new skills and tools, the satisfaction of the fluent flow of content and how the simplicity is preserved throughout the most complex parts of the website is what makes this website unique in it's own league.</p>
        </>,
        url: 'gvgl',
        src: '/gvgl',
        imgSource: {
            preview: require('./Assets/Projects/gvgl/Preview.jpg'),
            desktop: require('./Assets/Projects/gvgl/Desktop.jpg'),
            tablet: require('./Assets/Projects/gvgl/Tablet.jpg'),
            mobile: require('./Assets/Projects/gvgl/Mobile.jpg')
        },
        builtWith: ['xd', 'ps', 'react','html', 'css', 'sass', 'gsap', 'js', 'ts'],
    },
]
Projects.map( (p, i) => {
    const content = Projects[i].context.props.children;
    if( content )
        Projects[i].brief = content[0].props.children.slice(0, 100)
})


export interface CharacterData {
    imgSource: string;
    title: string;
    description: string;
}
interface Character {
    work: CharacterData[],
    life: CharacterData[],
}

export const Character: Character = {
    life: [
        {
            imgSource: require('./Assets/Character/Athlete.svg'),
            title: 'athlete',
            description: 'Feeling the hard cold ground as it reflects "POWER!" for each Push-up, hearing the sky yell "HIGHER!" on every Pull-up, fighting the wind, the rain, the snow and the dust while running towards a superior shape of body and mind is worth hustling for repeatedly.',
        },
        {
            imgSource: require('./Assets/Character/Gamer.svg'),
            title: 'gamer',
            description: 'Being a mutant hunting monsters, a soldier in an apocalyptic world, an eagle flying over the ancient greece, a survivor in a future with dinosaurs, these are all unknown scenarios to our form of world and games can visualize them making exploring these worlds an amusing yet informative hobby.',
        },
        {
            imgSource: require('./Assets/Character/Dreamer.svg'),
            title: 'dreamer',
            description: 'Dreams that are visualized to be real eventually become part of reality, it\'s a matter of how bad one wants it and how hard he is willing to work for it, one should never stop dreaming, this life we know would not expand to this extent without our ancestors\' dreams supporting their hard work.',
        },
        {
            imgSource: require('./Assets/Character/Chef.svg'),
            title: 'chef',
            description: 'The process of making good food comes to how passionately it\'s being made, along with passion, patience is key when preparing the hearty meal; In the end the relief of a tasty self-made food after a cooking session washes all the fatigue away, specially if it\' shared with loved ones.',
        },
        {
            imgSource: require('./Assets/Character/Boss.svg'),
            title: 'boss',
            description: 'The mentality and the attitude which we choose towards life will have an impact on how our reality is formed. That means that if we believe that we\'re the ones ultimately in control of our life, we\'ll be urged to be more conscious on the thoughts that we have cause they might just be manifested...!',
        },
    ],
    work: [
        {
            imgSource: require('./Assets/Character/Coder.svg'),
            title: 'coder',
            description: 'In a universe where every life form is structured to get something done it\'s empowering to be the one who defines the structure; Today, many every-day items that operate the simplest reactions contain the most complex code either in them, or in the process of making them.',
        },
        {
            imgSource: require('./Assets/Character/Singer.svg'),
            title: 'singer',
            description: 'Words offer the ability to interact with people, when combined with music, interaction with souls is made possible; To sing from the deepest note of the heart and relate to someone far in the world and fill their heart with compassion and inform them of not being alone in their journey, makes one pick up the mic...',
        },
        {
            imgSource: require('./Assets/Character/TechSavvy.svg'),
            title: 'techsavvy',
            description: 'Computers can do what humans are unable to do, they grant us extra abilities making our lives easier and more efficient; Harnessing a tiny bit of the power of this digital ocean of information ensures entrance to the future era in a ready state.',
        },
        {
            imgSource: require('./Assets/Character/Student.svg'),
            title: 'student',
            description: 'To be fearless in learning new skills and experience the unkown is to be free, free from lack and leaning towards abundance. Also each character has a different perspective, as the main character, it\'s foolish to refuse to learn other character\'s perspectives and experiences, as they may offer an insight that prevents one from falling where they fell before.',
        },
        {
            imgSource: require('./Assets/Character/Fixer.svg'),
            title: 'fixer',
            description: 'It\'s different to pose as a know-it-all than having the mindset or belief that you are capable of doing it yourself, it\'s just a matter of whether it\'s worth your time and effort to do it yourself. This mindset pushes you to at least research to see whether you can get it done without help or not, and this process, you learn a lot! There are others who are more experienced after all, we may also give them a call;)',
        },
        {
            imgSource: require('./Assets/Character/Designer.svg'),
            title: 'designer',
            description: 'I could be considered as an artistic person but I let them shine elsewhere, meaning that I\'m into designing webpages and even enjoy it as I do it, but I long for getting into programming phase, everytime I start designing. That should say a lot:)',
        },
    ],
}

export const breakPoints = {
    larger: 1920,
    large: 1366,
    dialer: 900,
    medium: 768,
    small: 428,
    smaller: 375
};