export const defaultTitlePrefix = 'Frontend Web Developer & UI/UX Designer | INFA';

interface PageData {
    title: string;
    url: string;
    text: string;
}
interface Pages {
    index: PageData;
    about: PageData;
    character: PageData;
    projects: PageData;
    contact: PageData;
};
export const Pages: Pages = {
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
}

interface ProjectType {
    title: string;
    context: string;
    url: string;
    imgSource: {
        desktop: string;
        tablet: string;
        mobile: string;
    };
    builtWith: ('ps' | 'xd' | 'ai' | 'jq' | 'html' | 'react' | 'css' | 'sass' | 'gsap' | 'js' | 'ts')[];
};
export const Projects: ProjectType[] = [
    {
        title: 'Project End',
        context: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna molestie at elementum eu facilisis. Tempus imperdiet nulla malesuada pellentesque elit eget. Senectus et netus et malesuada fames ac turpis egestas sed. Consectetur purus ut faucibus pulvinar elementum integer. Rhoncus aenean vel elit scelerisque. Aliquam sem fringilla ut morbi tincidunt augue. Convallis tellus id interdum velit. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed. Nunc pulvinar sapien et ligula. Vitae congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Consequat pulvinar elementum integer. Rhoncus aeneaus mauris. Consequat mauris nunc cfasffongue nisi vitae sus asdfcipit tel',
        url: 'end',
        imgSource: {
            desktop: require('./Assets/Desktop.jpg'),
            tablet: require('./Assets/Tablet.jpg'),
            mobile: require('./Assets/Mobile.jpg')
        },
        builtWith: ['ps', 'ai', 'jq', 'html', 'css', 'gsap', 'js'],
    },
    {
        title: 'Golden Vibes, Golden Life',
        context: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna molestie at elementum eu facilisis. Tempus imperdiet nulla malesuada pellentesque elit eget. Senectus et netus et malesuada fames ac turpis egestas sed. Consectetur purus ut faucibus pulvinar elementum integer. Rhoncus aenean vel elit scelerisque. Aliquam sem fringilla ut morbi tincidunt augue. Convallis tellus id interdum velit. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed. Nunc pulvinar sapien et ligula. Vitae congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Consequat pulvinar elementum integer. Rhoncus aeneaus mauris. Consequat mauris nunc cfasffongue nisi vitae sus asdfcipit tel',
        url: 'gvgl',
        imgSource: {
            desktop: require('./Assets/Desktop.jpg'),
            tablet: require('./Assets/Tablet.jpg'),
            mobile: require('./Assets/Mobile.jpg')
        },
        builtWith: ['xd', 'react','html', 'css', 'sass', 'gsap', 'js', 'ts'],
    },
]

interface CharacterData {
    imgSource: string;
    title: string;
    description: string;
}
interface Character {
    work: CharacterData[],
    life: CharacterData[],
}

const Character: Character = {
    work: [
        {
            imgSource: require('./Assets/Chatacter/Coder.jpg'),
            title: 'coder',
            description: '',
        },
    ],
    life: [
        {
            imgSource: require('./Assets/Chatacter/Athlete.jpg'),
            title: 'athlete',
            description: 'Feeling the hard cold ground as it reflects "power" for each Push-up, hearing the sky yell “higher” on every Pull-up, fighting the wind, the rain, the snow and the dust while running towards a superior shape of body and mind is worth hustling for repeatedly.',
        },
        {
            imgSource: require('./Assets/Chatacter/Gamer.jpg'),
            title: 'gamer',
            description: 'Being a mutant hunting monsters, a soldier in an apocalyptic world, an eagle flying over the ancient greece, a survivor in a future with dinosaurs, these are all unknown scenarios to our form of world and games can visualize them making exploring these worlds an amusing yet informative hobby.',
        },
        {
            imgSource: require('./Assets/Chatacter/Dreamer.jpg'),
            title: 'dreamer',
            description: 'Dreams that are visualized to be real eventually become part of reality, it\'s a matter of how bad one wants it and how hard he is willing to work for it, one should never stop dreaming, this life we know would not expand to this extent without our ancestors\' dreams supporting their hard work.',
        },
        {
            imgSource: require('./Assets/Chatacter/Chef.jpg'),
            title: 'chef',
            description: 'The process of making good food comes to how passionately it\'s being made, along with passion, patience is key when preparing the hearty meal; In the end the relief of a tasty self-made food after a cooking session washes all the fatigue away, specially if it\' shared with loved ones.',
        },
        {
            imgSource: require('./Assets/Chatacter/Boss.jpg'),
            title: 'boss',
            description: 'The mentality and the attitude which we choose towards life will have an impact on how our reality is formed. That means that if we believe that we\'re the ones ultimately in control of our life, we\'ll be urged to be more conscious on the thoughts that we have cause they might just be manifested...!',
        },
    ]
}