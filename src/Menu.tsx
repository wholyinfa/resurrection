import React, { useState, useEffect, useRef } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { titleConversion } from "./App";
import { PageData, Pages, Projects } from "./data";
import PropTypes, {InferProps} from 'prop-types';
import './Stylesheets/menu.css';
gsap.registerPlugin(Draggable);

export const animProps = {
    color: (t: 'work' | 'life' | 'index') : string => (t === 'work') ? 'rgba(26,35,126,1)' :  (t === 'life') ? 'rgba(6,78,59,1)' : 'rgba(0,0,0,1)',
    shadeBg: (deg: number, type: 'life' | 'work' | 'index') => `linear-gradient(${deg}deg, rgba(0,0,0,0) 0%, ${animProps.color(type)} 100%)`,
}
function MenuDOM({items, handleClick, handleKeyDownClick, handleExpansion}: InferProps<typeof MenuDOM.propTypes>) {
    return <nav>
        <div id='dialerHandle'></div>
        <div id='dialerContainer'>
            <div className='shade L'></div>
            <div className='shade R'></div>
            <div id='dialer'>
            { items.map( (item, i) => {
                return item.url !== '' &&
                <NavLink exact
                className={ item.ghost ? 'ghost' : '' }
                key={i}
                to={item.url}
                onClick={(e) => handleClick(e, i)}
                onKeyDown={(e) => handleKeyDownClick(e)}
                >
                    {item.text}
                </NavLink>;
            }) }
            </div>
        </div>
        <button id="expansionArrow" onClick={handleExpansion}>
            <span className='noPeaky'>Open main menu</span>
            <div className='L'></div>
            <div className='R'></div>
        </button>
    </nav>
}
MenuDOM.propTypes = {
    items: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired,
    handleKeyDownClick: PropTypes.func.isRequired,
    handleExpansion: PropTypes.func.isRequired,
}

interface itemData extends PageData {
    ghost?: boolean | undefined;
};
let expansionAnimation: gsap.core.Timeline;
interface paginationMap extends PageData {
  launchList: string,
  current?: boolean;
}
export let paginationMap: paginationMap[] = [
  {
    ...Pages.index,
    launchList: '#overTakers, .breathingFragment, .work > *, .life > *'
    },
  {
    ...Pages.about,
    launchList: '.title, section'
    },
  {
    ...Pages.character,
    launchList: ''
    },
  {
    ...Pages.projects,
    launchList: ''
    },
  {
    ...Pages.contact,
    launchList: ''
    },
];
export const changePagination = (newPage: PageData) => {
  paginationMap = paginationMap.map( item => {
    let newItem = item;
    
    if( item.text === newPage.text ){
      newItem = {
        ...newItem,
        current: true
      }
    }else if( typeof item.current !== 'undefined' ){
      delete newItem.current;
    }
    return newItem;
  });
}
export default function Menu({isMobile, resize, portal, isPaginating, newPage, imposeSequence} : InferProps<typeof Menu.propTypes>) {

    const location = useLocation(),
          itemList: itemData[] = [];
    interface activePage {
        pageID: number;
        pageData: PageData ;
    }
    const activePage = useRef<activePage>({
        pageID: 0,
        pageData: Pages.index
    });
    let isMain = useRef<boolean>(true);
    const mainStreamCheck = (loc: string) => {
        let mainStream = false;
        Object.values(Pages).filter( (entry, i) => {
            if( entry.url === titleConversion(loc) ){
                activePage.current = {
                    pageID: i,
                    pageData: entry
                };
                mainStream = true;
            }
        } );
        return mainStream;
    }
    const sideStreamCheck = (loc: string) => {
        let mainStream = mainStreamCheck(loc);
        if( !mainStream ){
            Object.values(Projects).filter( entry => {
                if( Pages.projects.url+'/'+entry.url === loc ){
                    activePage.current = {
                        pageID: Object.keys(Pages).findIndex(t => t === 'projects'),
                        pageData: Pages.projects
                    };
                }
            } );
        }
        return mainStream;
    }
    sideStreamCheck(location.pathname);
    Object.keys(Pages).map( item => {
        itemList.push(Pages[item as keyof Pages]);
    });
    const theMiddle: number = Math.floor(itemList.length / 2);
    let roadToCenter: number = ( activePage.current.pageID < theMiddle ) ? theMiddle - activePage.current.pageID :
                               ( activePage.current.pageID > theMiddle ) ? theMiddle - activePage.current.pageID + itemList.length  :
                       0 ;
    for( let i = 0; i < roadToCenter; i++ ){
        let lastItem: itemData = itemList[itemList.length-1];
        itemList.pop();
        itemList.unshift(lastItem);
    }
    const [items, setItems] = useState<itemData[]>(itemList);
    const newList = useRef<itemData[]>(items);
    useEffect( () => {
            changePagination(activePage.current.pageData);
            assemble();
            dialerExpansion.current && expandDialer(true, true);
    }, [location]);

    const infiniteItems = useRef<itemData[]>([]);
    const makeInfiniteItems = ( items :itemData[] ) => {
        infiniteItems.current.splice(0, infiniteItems.current.length);
        for (let i = 0; i < 20; i++){
            items.map( item => {
                let newItem = {...item};
                newItem.ghost = true;
                infiniteItems.current.push(newItem);
            })
        }
        return infiniteItems.current;
    }
    
    const menuItemW = 160;
    const menuItemH = 52;
    const trueMobile = useRef<boolean>();
    const setXOrY = (t: number | string):
    { y: number | string; x?: undefined; } |
    { x: number | string; y?: undefined; } =>
    ( (trueMobile.current) ? {y: t} : {x: t} );
    const getXY = (t: Draggable.Vars): number =>
    (trueMobile.current) ? t.y : t.x;
    const xOrYString = (): 'y' | 'x' =>
    (trueMobile.current) ? 'y' : 'x';
    const menuItemD = (): number =>
    (trueMobile.current) ? menuItemH : menuItemW;
    const ghostItems = items.filter(item => typeof item.ghost === 'undefined' || item.ghost === true).length;
    const dialerProps = () : {
        width: number,
        height: number
    } =>
    (trueMobile.current) ?
    { width: menuItemW,
        height: menuItemH*ghostItems
    } :
    { width: menuItemW*ghostItems,
        height: menuItemH
    };
    const expandDialer = (toggle: boolean, instant?: boolean) => {
        const dispelled = Array.from(document.getElementsByClassName('dispelled'));
        gsap.getTweensOf(dispelled).map(t => {
            const target = Object(t)._targets[0];

            if( !t.reversed() ){
                t.progress(1).reverse().resume();
                t.eventCallback('onReverseComplete', () => {
                    t.kill();
                    target.classList.remove('dispelled');
                    target.classList.remove('repelled');
                    gsap.set(target, {clearProps: 'x'});
                });
            }
        });
        const magnetize = (reverse?: boolean, instant?: true) => {
            let repelled = repAnimations.current;
            repelled.map( (t, i) => {
                if ( t.data && typeof t.data.easy !== undefined ) {
                    const newL = repAnimations.current;
                    if( !reverse ) t.reversed(!t.reversed()).play().eventCallback('onComplete', () => {
                        newL[i].data = undefined;
                        repAnimations.current = newL;
                    });
                    
                }else{
                    if( instant ){
                        if( !reverse ) t.progress(1);
                        else t.progress(0);
                    }else{
                        if( !reverse ) t.reversed(!t.reversed()).play();
                        else t.progress(1).reverse();
                    }
                }
            });
        }


        if( toggle ){
            repulsion();
            expansionAnimation.reversed(!expansionAnimation.reversed());
            if( instant ){
                expansionAnimation.progress(1).pause();
                magnetize(false, true);
            }
            else{
                expansionAnimation.play();
                magnetize();
            }
        }else{
            if( instant ){
                expansionAnimation.progress(0).pause();
                magnetize(true, true);
                if( !trueMobile.current ) cleanRepulsion();
            }
            else{
                expansionAnimation.reverse();
                magnetize(true);

            }
        }
    }
    interface Repel {
        gap: number;
        left: number;
        target: Element;
    }
    const [repellents, setRepellents] = useState<Repel[]>([]);
    const undergo = () => {
        const windowW = window.innerWidth;
        const ignore: string[] = ['.treeBrain', '.title div'];
        let targets: Element[] = Array.from(document.querySelectorAll(`main *:not(nav, nav *,${ignore.length > 0 && ignore.join(',')})`)),
            phase3: Repel[] = [];
        let phase1: Element[] = [], phase2: Element[] = [];
        targets.map(t => {
            if( t.clientWidth !== windowW ) phase1.push(t);
        });
        
        phase1.map(t => {
            let trueParent = t.parentElement;
            
            if( trueParent && trueParent.scrollWidth < windowW ){
                let grandParent = trueParent.parentElement;
                for( let i = 0; i <= 100000; i++ ){
                    if( grandParent )
                    if( grandParent.scrollWidth >= windowW ){
                        phase2.push(trueParent);
                        break;
                    }else{
                        grandParent = grandParent.parentElement;
                    }
                }
            }else phase2.push(t);
        });
        
        phase2.map( (t, i) => {
            let match = phase2.filter( tt => t === tt );
            if( match.length !== 1 ) phase2.splice(i, 1);
        });

        const dialer = Object(document.querySelector('#dialer'));
        const dialerW = dialer.clientWidth;
        const dialerH = dialer.clientHeight;
        const arrowsW = Object(document.querySelector('#expansionArrow')).clientWidth;
        const gapL = dialerW + arrowsW;
        const dialerT = dialer.getBoundingClientRect().top;
        const freeG = 50;

        phase2.map(t => {
            const bound = Object(t).getBoundingClientRect();
            if( bound.left <= gapL + freeG &&
                ( bound.top + bound.height >= dialerT - freeG && bound.top <= dialerT + dialerH + freeG )
            ){
                phase3.push({
                    gap: gapL + freeG - bound.left,
                    left: bound.left,
                    target: t
                });
            }
        });

        return phase3;
    }
    const repAnimations = useRef<gsap.core.Tween[]>([]);
    const cleanRepulsion = () => {
        if( !trueMobile.current ) {
            const repelled = Array.from(document.getElementsByClassName('repelled'));
            if( repelled.length > 0 ){
                repelled.map(r => {
                    gsap.killTweensOf(r);
                    r.classList.remove('repelled');
                    r.classList.remove('dispelled');
                    gsap.set(r, {clearProps: 'x'});
                    setRepellents([]);
                    repAnimations.current = [];
                });
            }
        }
    }
    const repulsion = () => {
        if( !trueMobile.current ) return cleanRepulsion();
        let targetReps: Repel[] = [];

        repellents.map(t => {
            gsap.set(t.target, {clearProps: 'x'})
        })

        const repelledd = Array.from(document.getElementsByClassName('repelled'));
        repelledd.map(r => gsap.set(r, {clearProps: 'x'}))
        targetReps = undergo() as Repel[];
        setRepellents(targetReps);
        
        const dur = expansionAnimation._dur;
        const ease = expansionAnimation._first._ease;
        const animationArray:gsap.core.Tween[] = [];
        targetReps.length && targetReps.map((t, i) => {
            if( Array.from(t.target.classList).filter(c => c === 'dispelled').length !== 0 ){
                t.target.classList.remove('repelled');
                t.target.classList.remove('dispelled');
                gsap.killTweensOf(t.target);
            }
            animationArray.push(gsap.fromTo( t.target,
                {x: 0}, {x: t.gap, duration: dur, ease: ease, paused: true, id: 'r'+i,
            onReverseComplete: () => {
                gsap.set(t.target, {clearProps: 'x'});
            }}
            ));
            if( Array.from(t.target.classList).filter(c => c === 'repelled').length === 0 ){
                t.target.classList.add('repelled');
                animationArray[animationArray.length-1].data = {easy: true};
            }
        });
        const repelled = Array.from(document.getElementsByClassName('repelled'));
        repelled.map(t => {
            let matchExists = false;
            for (let i = 0; i < targetReps.length; i++) {
                if (Object(t)._gsap.id === Object(targetReps[i].target)._gsap.id) {
                    matchExists = true;
                    break;
                }
            }

            if( !matchExists ) t.classList.add('dispelled');
        });

        repAnimations.current = animationArray;
        return targetReps;
    }
    useEffect(() => {
        trueMobile.current = isMobile;

        expansionAnimation = gsap.timeline({paused: true});
        const properties = {
            ease: 'sine.inOut',
            duration: .3,
        }
        const daWidth = 33;
        const expW = (t: number) => (t * 100) / daWidth + '%';
        const setYOrX = (t: number | string) => (trueMobile.current) ? ({x: t}) : ({y: t});
        const setP = (mobileVal: any, defaultVal: any) => {
            return trueMobile.current ? mobileVal : defaultVal;
        }

        gsap.set("#dialerContainer", {width: (trueMobile.current) ? menuItemW : menuItemW*5, height: (trueMobile.current) ? menuItemH*5 : menuItemH});
        gsap.set("#dialer", dialerProps());
        gsap.set('#dialerContainer, #dialerHandle', setXOrY(0));
        gsap.set('#expansionArrow', setP({y: '-50%'}, {x: '-50%', y: ''}));
        gsap.set('#expansionArrow div', {y: '', x: ''});
        expansionAnimation
        .fromTo('#dialerContainer, #dialerHandle', setYOrX('-100%'), {...setYOrX('0%'), ...properties}, '<')
        .fromTo('#expansionArrow .L', {rotate: setP('-45deg', '45deg')}, {rotate: setP('45deg', '-45deg'), ...setP({x: -daWidth}, {y: -daWidth/2}), ...properties}, '<')
        .fromTo('#expansionArrow .R', {rotate: setP('45deg', '-45deg')}, {rotate: setP('-45deg', '45deg'), ...setP({x: -daWidth}, {y: -daWidth/2}), ...properties}, '<');
        if( trueMobile.current )
            expansionAnimation
            .fromTo('#expansionArrow', {x: expW(0)}, {x: expW(menuItemW-10), ...properties}, '<');
        
        expandDialer(dialerExpansion.current, true);
    }, [isMobile]);
    useEffect(() => {
        expandDialer(dialerExpansion.current, true);
        dialerSequence(Type.current);
    }, [resize])

    const makeVisible = ( theItems: Element[], immediate?: boolean) => {
        let set = (immediate) ? 0 : .2;
        gsap.to([theItems[0], theItems[theItems.length-1]], {duration: set, autoAlpha: .4, scale: 1});
        gsap.to([theItems[1], theItems[theItems.length-2]], {duration: set, autoAlpha: .6, scale: 1});
        gsap.to(theItems[2], {duration: set, autoAlpha: 1, scale: 1.2});  
    }
    useEffect(() => {
        gsap.set("#dialer a", {width: menuItemW});
        gsap.set("#dialer", dialerProps());
        document.querySelector("#dialer a.ghost") && gsap.set("#dialer a.ghost", {opacity: 0});
        !infinityApplied.current && gsap.set('#dialer', setXOrY(0));

        let aElements = Array.from(document.querySelectorAll('#dialer a'));
        let firstVis = items.findIndex( item => typeof item.ghost === 'undefined');
        let visibleItems = aElements.splice(firstVis, 5);
        if( visibleItems.length > 0 ){
            makeVisible(visibleItems, true);
        }
    
        let xy;
        if( items.length === addAll().length ){
            xy = - menuItemD() * (addAll(true).length/2);
            gsap.set('#dialer', setXOrY(xy));
            trueXY.current = xy;
        }
        
        if( infinityApplied.current && isPaginating.current ){
            isPaginating.current = false;
            let i = addAll().findIndex(t => typeof t.ghost === 'undefined' && t.url === newPage.current!.url);
            if ( typeof xy === 'undefined' ) xy = trueXY.current;
            restoreFromInfinity(xy, xy, i); 
        }
    }, [items]);

    const handleClick = (e:React.MouseEvent<HTMLAnchorElement, MouseEvent>, i: number) => {
        e.preventDefault();

        const xy = getXY(Draggable.get('#dialer'));
        restoreFromInfinity(xy, xy, i);
    }
    const handleKeyDownClick = (e:React.KeyboardEvent<HTMLAnchorElement>) => {
        e.code !== 'Tab' && e.preventDefault();
    }
    const dialerExpansion = useRef<boolean>(false);
    const handleExpansion = () => {
        const toggle = !dialerExpansion.current;
        dialerExpansion.current = toggle;
        expandDialer(toggle, false);
    }

    const history = useHistory();
    const trueXY = useRef<number>(0);
    const infinityApplied = useRef<boolean>();
    const xyMemory = useRef<boolean>(false);
    const isSnapping = useRef<false | gsap.core.Tween>(false);
    const addAll = ( excess?: boolean ) => {
        makeInfiniteItems(newList.current);
        interface arg{
            left: itemData[];
            main: itemData[];
            right: itemData[];
        } 
        const endItems: arg ={
            left: infiniteItems.current.slice(),
            main: newList.current.slice(),
            right: infiniteItems.current.slice(),
        }
        return ( excess ) ?
        [...endItems.left, ...endItems.right] :
        [...endItems.left, ...endItems.main, ...endItems.right];
    }
    const applyInfinity = () => {
        if( !infinityApplied.current ) {
            dissipate();
            let copy = addAll().slice();
            let visibles = copy.filter( item => typeof item.ghost === 'undefined' );
            newList.current = visibles;
            copy = addAll();
            setItems(copy);

            infinityApplied.current = true;
            xyMemory.current = ( isPaginating.current ) ? true : false;
        }else xyMemory.current = true;
    }
    const updateInfinity = (theXY: number) => {
        let aElements = Array.from(document.querySelectorAll('#dialer a')),
            firstVis = Math.abs( Math.round( theXY / menuItemD() ) ),
            visibleItems = aElements.splice(firstVis, 5),
            hiddenItems = aElements;

        makeVisible(visibleItems);
        gsap.set('#dialer', {...setXOrY(theXY), ...(trueMobile.current) ? {x: 0} : {y: 0} });
        trueXY.current = theXY;
        gsap.to(hiddenItems, {duration: .2, autoAlpha: 0});
    }
    const restoreFromInfinity = (theXY: number, endXY: number, manual?: number) => {
        let dur = (theXY === endXY) ? .3 : 0,
        xyAlgo = ( Math.round(theXY / menuItemD()) * menuItemD() ),
        xy = ( xyMemory.current ) ? xyAlgo : xyAlgo - menuItemD() * (addAll(true).length/2);
        const updateXY = () => {
            trueXY.current = Number(gsap.getProperty('#dialer', xOrYString()));
        }
        let currentXY;
        if ( manual ){
            currentXY = xy;
            xy = -1 * ( ( trueXY.current + menuItemD() * manual ) - ( trueXY.current + menuItemD() * Math.floor( newList.current.length / 2 ) ) );
        }
        let firstVis = Math.abs(Math.round(xy / menuItemD())),
            aElements = Array.from(document.querySelectorAll('#dialer a')),
            visibleItems = aElements.splice(firstVis, 5),
            relativeDuration = currentXY ? (Math.abs(xy - currentXY) / menuItemD()) * dur : dur;

        isMain.current = !(isMain.current === false && sideStreamCheck(location.pathname) === false);
        isSnapping.current = gsap.to('#dialer', {ease: 'power2.inOut', duration: relativeDuration, ...setXOrY(xy), onUpdate: updateXY, onComplete: doAfterAdjustment, onCompleteParams: [firstVis] });
        makeVisible(visibleItems);
    }
    const doAfterAdjustment = (firstVis: number) => {
        let copy = addAll().slice();
        let nullItem: itemData = {
            text: '',
            title: '',
            url: '',
            ghost: true
        };
        copy = copy.map( (item, i) => {
            let newItem: itemData = {...item};
            if ( i < firstVis || i >= firstVis+5 )
                newItem = nullItem;
            else
                delete newItem.ghost;
            return newItem;
        });
        newList.current = copy.filter( item => typeof item.ghost === 'undefined' );
        setItems(newList.current);

        if ( history.location.pathname !== newList.current[2].url && !isPaginating.current && isMain.current )
        history.push(newList.current[2].url); else if (pageOnPress.current && pageOnPress.current.url === newList.current[2].url) assemble();
        trueXY.current = Number(gsap.getProperty('#dialer', xOrYString()));

        isSnapping.current = false;
        infinityApplied.current = false;
        xyMemory.current = false;
        isMain.current = true;
        pageOnPress.current = null;
    }
    interface upNdown{
      up: boolean;
      down: boolean;
    }
    const allowPagination = useRef<upNdown>({
      up: true,
      down: true
    });
    const pageOnPress = useRef<PageData | null>(null);
    useEffect(() => {

        let xyOnPress: number;
        Draggable.create("#dialer", {
            type: 'x,y',
            trigger: '#dialerHandle, #dialer',
            edgeResistance: 0.65,
            onPress: function() {
                applyInfinity();
                xyOnPress = - menuItemD() * (addAll(true).length/2);
                pageOnPress.current = activePage.current.pageData;
            },
            onDrag: function() {
                let xy = ( xyMemory.current ) ? getXY(this) : getXY(this) - menuItemD() * (addAll(true).length/2);
                updateInfinity(xy);
            },
            onDragEnd: function() {
                restoreFromInfinity(getXY(this), ( trueMobile.current ) ? this.endY : this.endX);
            },
            onRelease: function() {
                if( xyOnPress === trueXY.current && this.pointerEvent.target.localName !== 'a' ){
                    if( isSnapping.current ){
                        const oldVars: gsap.TweenVars = isSnapping.current.vars;
                        isSnapping.current = gsap.to('#dialer', {id: 'Dialer',ease: 'power2.inOut', duration: oldVars.duration, ...setXOrY(Number(oldVars.x)), onUpdate: oldVars.onUpdate, onComplete: oldVars.onComplete, onCompleteParams: oldVars.onCompleteParams });
                    }else{
                        restoreFromInfinity(getXY(this), ( trueMobile.current ) ? this.endY : this.endX);
                    }
                }
            }
        });

        const stream = (direction: 'up' | 'down') => {
            const scrollY = Math.round(window.scrollY);
            const maxY = document.getElementsByTagName('html')[0].scrollHeight - window.innerHeight;

            if( direction === 'up' )
            scrollY === 0  &&
            !infinityApplied.current &&
            !isPaginating.current &&
            allowPagination.current.up === true &&
                portal('up', applyInfinity);
            else
            ( scrollY === maxY || Math.abs(scrollY - maxY) <= 1 ) &&
            !infinityApplied.current &&
            !isPaginating.current &&
            allowPagination.current.down === true &&
                portal('down', applyInfinity);
        }
        addEventListener('wheel', (e) => {
            if( e.deltaY >= 0 )
                stream('down');
            else
                stream('up');
        });
        let touchStart: number;
        let touchEnd: number;
        addEventListener('touchstart', (e) => {
          touchStart = e.changedTouches[0].screenY;
        }, false); 
              
        addEventListener('touchend', (e) => {
          touchEnd = e.changedTouches[0].screenY;
          if ( touchEnd - touchStart <= 0 )
            stream('down');
          else
            stream('up');
          
        }, false);
              
        document.addEventListener('keyup', (e) => {
          if( e.code === 'ArrowDown' || e.code === 'Space' )
            stream('down');
          else if( e.code === 'ArrowUp' )
            stream('up');
        }, false);

        addEventListener('scroll', (e) => expandDialer(dialerExpansion.current, true));

        history.listen((newLocation, action) => {
            if( action === 'POP' || action === 'REPLACE' ){
                const current = paginationMap.filter(t => typeof t.current !== 'undefined' )[0];
                const pathname = titleConversion(newLocation.pathname);
                if ( current.url !== pathname ){
                    isMain.current = sideStreamCheck(pathname);
                    const targetI = paginationMap.findIndex(t => t.url === pathname );
                    newPage.current = ( isMain.current ) ? paginationMap[targetI] : 
                        paginationMap.find(t => t.url === activePage.current.pageData.url );
                    isPaginating.current = true;
                    applyInfinity();
                }
            }

        });
    },[])

    type SectionType = 'work' | 'life' | 'index';
    const Type = useRef<SectionType>('index');
    const dialerSequence = (oldType: SectionType) => {
        if ( !trueMobile.current ) gsap.to('#dialerContainer', {duration: .2,background: animProps.color(oldType)});
        else gsap.set('#dialerContainer', {background: 'transparent'});

        const shadeRDeg =  (trueMobile.current) ? 180 : 90;
        const shadeLDeg =  (trueMobile.current) ? 0 : -90;
        gsap.to('#dialerContainer .shade.R', {duration: .2,background: animProps.shadeBg(shadeRDeg, oldType)})
        gsap.to('#dialerContainer .shade.L', {duration: .2,background: animProps.shadeBg(shadeLDeg, oldType)});
    
    }
    const paginationSequence = (dissipate?: true, callback?: gsap.Callback | undefined) => {
        const launchList = paginationMap.filter(t => t.current )[0].launchList;
        const targets = (launchList === '') ? document.querySelectorAll('main > *:not(nav)') : document.querySelectorAll(launchList);
        if ( !callback ) callback = () => {};
        gsap.set(targets, {autoAlpha: (dissipate) ? 1 : 0});
        gsap.to(targets, {autoAlpha: (dissipate) ? 0 : 1, duration: .2, stagger: .05, onComplete: callback});
        
        if( !dissipate ){
            const activePageName = activePage.current.pageData.text.toLowerCase();
            const type = ( activePageName === 'about' || activePageName === 'character' ) ? 'life' :
            ( activePageName === 'projects' || activePageName === 'contact' ) ? 'work' : 'index';
            const bg = ( type === 'life' ) ? animProps.color('life') :
            ( type === 'work' ) ? animProps.color('work') : animProps.color('index');

            gsap.to('body', {duration: .2, background: bg});
            dialerSequence(type);
            Type.current = type;
            allowPagination.current = {
                up: true,
                down: true
            }
        }
        else
        allowPagination.current = {
            up: false,
            down: false
        }
    }
    useEffect(()=> {
        if ( imposeSequence !== undefined )
            paginationSequence(true, imposeSequence)
    }, [imposeSequence])

    const dissipate = () => paginationSequence(true);
    const assemble = () =>  paginationSequence();


    return <MenuDOM
        items= {items}
        handleClick= {handleClick}
        handleKeyDownClick= {handleKeyDownClick}
        handleExpansion= {handleExpansion}
    />;
}

Menu.propTypes = {
    portal: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    resize: PropTypes.bool.isRequired,
    isPaginating: PropTypes.any.isRequired,
    newPage: PropTypes.any.isRequired,
    imposeSequence: PropTypes.any
}