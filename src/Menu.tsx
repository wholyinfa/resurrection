import React, { useState, useEffect, useRef, ReactComponentElement } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { changePagination, titleConversion } from "./App";
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
export default function Menu({isMobile} : InferProps<typeof Menu.propTypes>) {

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
    useEffect( () => {
        changePagination(newList.current[2]);
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
            expansionAnimation.reversed(!expansionAnimation.reversed());
            if( instant ) expansionAnimation.progress(1);
            else expansionAnimation.play();
        }else{
            if( instant ) expansionAnimation.progress(0);
            else expansionAnimation.reverse()
        }
    }
    const [repellents, setRepellents] = useState<Element[]>([]);
    const repulsion = () => {
        const windowW = window.innerWidth;
        const ignore: string[] = ['.treeBrain'];
        let targets: Element[] = Array.from(document.querySelectorAll(`main *:not(nav, nav *,${ignore.join(',')})`));
        //if( isMobile && dialerExpansion ){
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
            console.log(phase2);
        /* }else{
            console.log('RESET');
            setRepellents([]);
        } */
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
        items.filter(item => item.ghost === false ).length > 0 && gsap.set('#dialer', setXOrY(0));

        let aElements = Array.from(document.querySelectorAll('#dialer a'));
        let firstVis = items.findIndex( item => typeof item.ghost === 'undefined');
        let visibleItems = aElements.splice(firstVis, 5);
        if( visibleItems.length > 0 ){
            makeVisible(visibleItems, true);
        }
    }, [items]);

    const manualDrag = useRef<number | false>(false);
    const handleClick = (e:React.MouseEvent<HTMLAnchorElement, MouseEvent>, i: number) => {
        e.preventDefault();
       
        const xy = getXY(Draggable.get('#dialer'));
        manualDrag.current = -1 * ( ( trueXY.current + menuItemD() * i ) - ( trueXY.current + menuItemD() * Math.floor( newList.current.length / 2 ) ) );

        restoreFromInfinity(xy, xy);
        xyMemory.current = false;
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
    const itemReset = useRef<boolean>(true);
    const xyMemory = useRef<boolean>(false);
    const isSnapping = useRef<false | gsap.core.Tween>(false);
    const addAll = ( excess?: boolean ) => {
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
    const doAfterAdjustment = (firstVis: number) => {
        let copy = addAll().slice();
        let nullItem: itemData = {
            text: '',
            title: '',
            url: '',
            ghost: false
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
        setItems(copy);

        history.push(newList.current[2].url);
        trueXY.current = Number(gsap.getProperty('#dialer', xOrYString()));

        isSnapping.current = false;
        itemReset.current = true;
        xyMemory.current = false;
    }
    const restoreFromInfinity = (theXY: number, endXY: number) => {
        let dur = (theXY === endXY) ? .3 : 0,
        xyAlgo = ( Math.round(theXY / menuItemD()) * menuItemD() ),
        xy = ( xyMemory.current ) ? xyAlgo : xyAlgo - menuItemD() * (addAll(true).length/2);
        const updateXY = () => {
            trueXY.current = Number(gsap.getProperty('#dialer', xOrYString()));
        }

        let currentXY;
        if ( manualDrag.current !== false ){
            currentXY = xy;
            xy = manualDrag.current;
        }
        let firstVis = Math.abs(Math.round(xy / menuItemD())),
            aElements = Array.from(document.querySelectorAll('#dialer a')),
            visibleItems = aElements.splice(firstVis, 5),
            relativeDuration = currentXY ? (Math.abs(xy - currentXY) / menuItemD()) * dur : dur;

        isSnapping.current = gsap.to('#dialer', {id: 'Dialer',ease: 'power2.inOut', duration: relativeDuration, ...setXOrY(xy), onUpdate: updateXY, onComplete: doAfterAdjustment, onCompleteParams: [firstVis] });
        makeVisible(visibleItems);

        manualDrag.current = false;
    }
    const applyInfinity = (theXY: number) => {
        if( itemReset.current ) {
            let copy = addAll().slice();
            let visibles = copy.filter( item => typeof item.ghost === 'undefined' );
            makeInfiniteItems(visibles);
            newList.current = visibles;
            copy = addAll();
            setItems(copy);

            let xy = ( xyMemory.current ) ? theXY : theXY - menuItemD() * (addAll(true).length/2);
            gsap.set('#dialer', setXOrY(xy));
            trueXY.current = xy;
            itemReset.current = false;
            xyMemory.current = false;
        }else xyMemory.current = true;
    }
    useEffect(() => {

        let xyOnPress: number;
        Draggable.create("#dialer", {
            type: 'x,y',
            trigger: '#dialerHandle, #dialer',
            edgeResistance: 0.65,
            onPress: function() {
                applyInfinity( getXY(this) );
                xyOnPress = trueXY.current;
            },
            onDrag: function() {
                let xy = ( xyMemory.current ) ? getXY(this) : getXY(this) - menuItemD() * (addAll(true).length/2),
                    aElements = Array.from(document.querySelectorAll('#dialer a')),
                    firstVis = Math.abs( Math.round( xy / menuItemD() ) ),
                    visibleItems = aElements.splice(firstVis, 5),
                    hiddenItems = aElements;

                makeVisible(visibleItems);
                gsap.set('#dialer', {...setXOrY(xy), ...(trueMobile.current) ? {x: 0} : {y: 0} });
                trueXY.current = xy;
                gsap.to(hiddenItems, {duration: .2, autoAlpha: 0});
            },
            onDragEnd: function() {
                restoreFromInfinity(getXY(this), ( trueMobile.current ) ? this.endY : this.endX);
            },
            onRelease: function() {
                if( xyOnPress === trueXY.current &&
                    isSnapping.current &&
                    this.pointerEvent.target.localName !== 'a'
                    ){
                        const oldVars: gsap.TweenVars = isSnapping.current.vars;
                        isSnapping.current = gsap.to('#dialer', {id: 'Dialer',ease: 'power2.inOut', duration: oldVars.duration, ...setXOrY(Number(oldVars.x)), onUpdate: oldVars.onUpdate, onComplete: oldVars.onComplete, onCompleteParams: oldVars.onCompleteParams });
                }
            }
        });
    },[])

    return <MenuDOM
        items= {items}
        handleClick= {handleClick}
        handleKeyDownClick= {handleKeyDownClick}
        handleExpansion= {handleExpansion}
    />;
}

Menu.propTypes = {
    isMobile: PropTypes.bool.isRequired
}