import React, { useState, useEffect, useRef, ReactComponentElement } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { titleConversion } from "./App";
import { PageData, Pages } from "./data";
import PropTypes, {InferProps} from 'prop-types';
import './Stylesheets/menu.css';
gsap.registerPlugin(Draggable);

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
let repulsionAnimation: gsap.core.Timeline;
interface paginationMap extends PageData {
  launchList: string,
  current?: boolean;
}
let paginationMap: paginationMap[] = [
  {
    ...Pages.index,
    launchList: '#overTakers, .breathingFragment, .work > *, .life > *'
    },
  {
    ...Pages.about,
    launchList: ''
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
export default function Menu({isMobile, resize} : InferProps<typeof Menu.propTypes>) {

    const location = useLocation(),
          itemList: itemData[] = [];
    interface activePage {
        pageID: number;
        pageData: PageData ;
    }
    let activePage: activePage = {
        pageID: 0,
        pageData: Pages.index
    };
    Object.values(Pages).filter( (entry, i) => {
        if( entry.url === titleConversion(location.pathname) )
        activePage = {
            pageID: i,
            pageData: entry
        };
    } );
    Object.keys(Pages).map( item => {
        itemList.push(Pages[item as keyof Pages]);
    });
    const theMiddle: number = Math.floor(itemList.length / 2);
    let roadToCenter: number = ( activePage.pageID < theMiddle ) ? theMiddle - activePage.pageID :
                               ( activePage.pageID > theMiddle ) ? theMiddle - activePage.pageID + itemList.length  :
                       0 ;
    for( let i = 0; i < roadToCenter; i++ ){
        let lastItem: itemData = itemList[itemList.length-1];
        itemList.pop();
        itemList.unshift(lastItem);
    }
    const [items, setItems] = useState<itemData[]>(itemList);
    const newList = useRef<itemData[]>(items);
    /* useEffect( () => {
        // if( isPaginating ) applyInfinity();
    }, [isPaginating]); */
    useEffect( () => {
        changePagination(activePage.pageData);
        assemble();
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
        if( toggle ){
            repulsion();
            expansionAnimation.reversed(!expansionAnimation.reversed());
            if( instant ){
                expansionAnimation.progress(1);
                repulsionAnimation.progress(1);
            }
            else{
                expansionAnimation.play();
                repulsionAnimation.play();
            }
        }else{
            if( instant ){
                expansionAnimation.progress(0);
                repulsionAnimation && repulsionAnimation.progress(0);
            }
            else{
                expansionAnimation.reverse();
                repulsionAnimation && repulsionAnimation.reverse();

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
        const ignore: string[] = ['.treeBrain'];
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
    const repulsion = (): Repel[] => {
        let targetReps: Repel[] = [];

        repellents.map(t => {
            gsap.set(t.target, {clearProps: 'all'})
        })

        if( isMobile ){
            targetReps = undergo() as Repel[];
            setRepellents(targetReps);
        }else{
            setRepellents([]);
        }
        
        const dur = expansionAnimation._dur;
        const ease = expansionAnimation._first._ease;
        repulsionAnimation = gsap.timeline({paused: true});
        targetReps.length && targetReps.map(t => {
            repulsionAnimation.fromTo( t.target,
                {x: 0}, {x: t.gap, duration: dur, ease: ease}
            , '<');
        })
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
            .fromTo('#expansionArrow', {x: expW(20)}, {x: expW(menuItemW-10), ...properties}, '<');
        
        expandDialer(dialerExpansion, true);
        repulsion();
    }, [isMobile]);
    useEffect(() => {
        repulsion();
        expandDialer(dialerExpansion, true);
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
            let Dialer = Draggable.get('#dialer');
            let theXY = getXY(Dialer);
            xy = - menuItemD() * (addAll(true).length/2);
            gsap.set('#dialer', setXOrY(xy));
            trueXY.current = xy;
        }
        
        if( infinityApplied.current && isPaginating.current ){
            isPaginating.current = false;
            let aElements = document.querySelector('#dialer');
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
    const [dialerExpansion, setDialerExpansion] = useState<boolean>(false);
    const handleExpansion = () => {
        const toggle = !dialerExpansion;
        setDialerExpansion(toggle);
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
            allowPagination.current = {
                up: false,
                down: false
            }
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

        !isPaginating.current && history.push(newList.current[2].url);
        trueXY.current = Number(gsap.getProperty('#dialer', xOrYString()));

        isSnapping.current = false;
        infinityApplied.current = false;
        xyMemory.current = false;
        allowPagination.current = {
            up: true,
            down: true
        }
    }
    interface upNdown{
      up: boolean;
      down: boolean;
    }
    const allowPagination = useRef<upNdown>({
      up: true,
      down: true
    });
    const newPage = useRef<PageData>();
    const isPaginating = useRef<boolean>(false);
    const portal = (direction: 'up' | 'down') => {
        const i = paginationMap.findIndex(t => typeof t.current !== 'undefined' );
        let targetI;
        if( direction === 'up' ){
        targetI = ( paginationMap[i-1] ) ? i-1 : paginationMap.length-1;
        }else{
        targetI = ( paginationMap[i+1] ) ? i+1 : 0;
        }
        newPage.current = paginationMap[targetI];
        isPaginating.current = true;
        applyInfinity();
    };
    useEffect(() => {

        let xyOnPress: number;
        Draggable.create("#dialer", {
            type: 'x,y',
            trigger: '#dialerHandle, #dialer',
            edgeResistance: 0.65,
            onPress: function() {
                applyInfinity();
                xyOnPress = trueXY.current;
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
        addEventListener('wheel', (e) => {
            if( e.deltaY >= 0 && allowPagination.current.down === true ){
            // down
            !isPaginating.current && portal('down');
            }else if( allowPagination.current.up === true ){
            // up
            !isPaginating.current && portal('up');
            }
        });
    },[])

    const paginationSequence = (dissipate?: true) => {
        const launchList = paginationMap.filter(t => t.current )[0].launchList;
        const targets = (launchList === '') ? document.querySelectorAll('main > *:not(nav)') : document.querySelectorAll(launchList);
        gsap.fromTo(targets, {autoAlpha: (dissipate) ? 1 : 0}, {autoAlpha: (dissipate) ? 0 : 1, duration: .2, stagger: .05});
    }

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
    isMobile: PropTypes.bool.isRequired,
    resize: PropTypes.bool.isRequired,
    isPaginating: PropTypes.bool.isRequired,
    paginating: PropTypes.func.isRequired,
    newPage: PropTypes.any
}