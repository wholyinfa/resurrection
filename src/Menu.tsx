import React, { useState, useEffect, useRef } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { changePagination, titleConversion } from "./App";
import { PageData, Pages } from "./data";
import PropTypes, {InferProps} from 'prop-types';
import './Stylesheets/menu.css';
import exp from "constants";
gsap.registerPlugin(Draggable);

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

    useEffect( () => {
        changePagination(newList.current[2]);
    }, [location]);

    interface itemData extends PageData {
        ghost?: boolean | undefined;
    };
    const [items, setItems] = useState<itemData[]>(itemList);

    const newList = useRef<itemData[]>(items);
    const infiniteItems = useRef<itemData[]>([]);
    const itemReset = useRef<boolean>(true);
    const xyMemory = useRef<boolean>(false);
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
    
    const resizePurposes = () => {
        const ghostItems = items.filter(item => typeof item.ghost === 'undefined' || item.ghost === true).length;
        if( isMobile ){
            setXOrY = (t: number | string) => ({y: t});
            xOrYString = 'y';
            menuItemD = menuItemH;
            getXY = (t: Draggable.Vars) => t.y;
            dialerProps = { width: menuItemW,
                height: menuItemH*ghostItems
            };
        }else{
            setXOrY = (t: number | string) => ({x: t});
            xOrYString = 'x';
            menuItemD = menuItemW;
            getXY = (t: Draggable.Vars) => t.x;
            dialerProps = { width: menuItemW*ghostItems,
                height: menuItemH
            }
        }
    }

    const menuItemW = 160;
    const menuItemH = 52;
    let dialerProps: any, setXOrY: any, xOrYString: any, menuItemD: number, getXY: any;
    resizePurposes();
    useEffect(() => {
        resizePurposes();
    }, [isMobile]);

    const makeVisible = ( theItems: Element[], immediate?: boolean) => {
        let set = (immediate) ? 0 : .2;
        gsap.to([theItems[0], theItems[theItems.length-1]], {duration: set, autoAlpha: .4, scale: 1});
        gsap.to([theItems[1], theItems[theItems.length-2]], {duration: set, autoAlpha: .6, scale: 1});
        gsap.to(theItems[2], {duration: set, autoAlpha: 1, scale: 1.2});  
    }
    useEffect(() => {
        gsap.set("#dialer a", {width: menuItemW});
        document.querySelector("#dialer a.ghost") && gsap.set("#dialer a.ghost", {opacity: 0});
        gsap.set("#dialer", dialerProps);
        items.filter(item => item.ghost === false ).length > 0 && gsap.set('#dialer', setXOrY(0));

        let aElements = Array.from(document.querySelectorAll('#dialer a'));
        let firstVis = items.findIndex( item => typeof item.ghost === 'undefined');
        let visibleItems = aElements.splice(firstVis, 5);
        if( visibleItems.length > 0 ){
            makeVisible(visibleItems, true);
        }
    }, [items]);


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

    const trueXY = useRef<number>(0);
    const history = useHistory();
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
        trueXY.current = Number(gsap.getProperty('#dialer', xOrYString));

        isSnapping.current = false;
        itemReset.current = true;
        xyMemory.current = false;
    }

    const applyInfinity = (theXY: number) => {
        if( itemReset.current ) {
            let copy = addAll().slice();
            let visibles = copy.filter( item => typeof item.ghost === 'undefined' );
            makeInfiniteItems(visibles);
            newList.current = visibles;
            copy = addAll();
            setItems(copy);

            let xy = ( xyMemory.current ) ? theXY : theXY - menuItemD * (addAll(true).length/2);
            gsap.set('#dialer', setXOrY(xy));
            trueXY.current = xy;
            itemReset.current = false;
            xyMemory.current = false;
        }else xyMemory.current = true;
    }

    const updateXY = () => {
        trueXY.current = Number(gsap.getProperty('#dialer', xOrYString));
    }
    const isSnapping = useRef<false | gsap.core.Tween>(false);
    const restoreFromInfinity = (theXY: number, endXY: number) => {
        let dur = (theXY === endXY) ? .3 : 0,
        xyAlgo = ( Math.round(theXY / menuItemD) * menuItemD ),
        xy = ( xyMemory.current ) ? xyAlgo : xyAlgo - menuItemD * (addAll(true).length/2);

        let currentXY;
        if ( manualDrag.current !== false ){
            currentXY = xy;
            xy = manualDrag.current;
        }
        let firstVis = Math.abs(Math.round(xy / menuItemD)),
            aElements = Array.from(document.querySelectorAll('#dialer a')),
            visibleItems = aElements.splice(firstVis, 5),
            relativeDuration = currentXY ? (Math.abs(xy - currentXY) / menuItemD) * dur : dur;

        isSnapping.current = gsap.to('#dialer', {id: 'Dialer',ease: 'power2.inOut', duration: relativeDuration, ...setXOrY(xy), onUpdate: updateXY, onComplete: doAfterAdjustment, onCompleteParams: [firstVis] });
        makeVisible(visibleItems);

        manualDrag.current = false;
    }

    useEffect(() => {
        gsap.set("#dialerContainer", {width: (isMobile) ? menuItemW : menuItemW*5, height: (isMobile) ? menuItemH*5 : menuItemH});

        let xyOnPress: number;
        Draggable.create("#dialer", {
            type: xOrYString,
            trigger: '#dialerHandle, #dialer',
            edgeResistance: 0.65,
            onPress: function() {
                applyInfinity( getXY(this) );
                xyOnPress = trueXY.current;
            },
            onDrag: function() {
                let xy = ( xyMemory.current ) ? getXY(this) : getXY(this) - menuItemD * (addAll(true).length/2),
                    aElements = Array.from(document.querySelectorAll('#dialer a')),
                    firstVis = Math.abs( Math.round( xy / menuItemD ) ),
                    visibleItems = aElements.splice(firstVis, 5),
                    hiddenItems = aElements;

                makeVisible(visibleItems);
                gsap.set('#dialer', setXOrY(xy));
                trueXY.current = xy;
                gsap.to(hiddenItems, {duration: .2, autoAlpha: 0});
            },
            onDragEnd: function() {
                restoreFromInfinity(getXY(this), ( isMobile ) ? this.endY : this.endX);
            },
            onRelease: function() {
                if( xyOnPress === trueXY.current &&
                    isSnapping.current &&
                    this.pointerEvent.target.localName !== 'a'
                    ){
                        const oldVars: gsap.TweenVars = isSnapping.current.vars;
                        isSnapping.current = gsap.to('#dialer', {id: 'Dialer',ease: 'power2.inOut', duration: oldVars.duration, ...setXOrY(oldVars.x), onUpdate: oldVars.onUpdate, onComplete: oldVars.onComplete, onCompleteParams: oldVars.onCompleteParams });
                }
            }
        });
    },[])

    const manualDrag = useRef<number | false>(false);
    const handleClick = (e:React.MouseEvent<HTMLAnchorElement, MouseEvent>, i: number) => {
        e.preventDefault();
       
        const xy = getXY(Draggable.get('#dialer'));
        manualDrag.current = -1 * ( ( trueXY.current + menuItemD * i ) - ( trueXY.current + menuItemD * Math.floor( newList.current.length / 2 ) ) );

        restoreFromInfinity(xy, xy);
        xyMemory.current = false;
    }
    const handleKeyDownClick = (e:React.KeyboardEvent<HTMLAnchorElement>) => {
        e.code !== 'Tab' && e.preventDefault();
    }

    const [dialerExpansion, setDialerExpansion] = useState<boolean>(false);
    useEffect( () => {
        const expW = document.querySelector('#expansionArrow');
        if( typeof expansionAnimation === 'undefined' ){
            expansionAnimation = gsap.timeline();
            const properties = {
                ease: 'sine.inOut',
                duration: .3,
            }
            const daWidth = 33;
            const expW = (t: number) => (t * 100) / daWidth + '%';
            const setY = () => (isMobile) ? 0 : -20;
            const setXOrY = (t: number | string) => (isMobile) ? ({x: t}) : ({y: t});
            const setP = (mobileVal: number | string, defaultVal: number | string) => {
                return isMobile ? mobileVal : defaultVal;
            }

            console.log(setP(expW(20), '-50%'));
            expansionAnimation
            .fromTo('#dialerContainer, #dialerHandle', setXOrY('-100%'), {...setXOrY('0%'), ...properties}, '<')
            .fromTo('#expansionArrow', {x: setP(expW(20), '')}, {x: setP(expW(menuItemW-10), '') , ...properties}, '<');
            if( isMobile ){
                expansionAnimation
                .fromTo('#expansionArrow .L', {rotate: '-45deg',x: 0}, {rotate: '45deg', x: -daWidth, ...properties}, '<')
                .fromTo('#expansionArrow .R', {rotate: '45deg',x: 0}, {rotate: '-45deg', x: -daWidth, ...properties}, '<');
            }else{
                expansionAnimation
                .fromTo('#expansionArrow .L', {rotate: setP('45deg', '45deg'), y: 0}, {rotate: '-45deg', y: -daWidth/2, ...properties}, '<')
                .fromTo('#expansionArrow .R', {rotate: '-45deg', y: 0}, {rotate: '45deg', y: -daWidth/2, ...properties}, '<');
            }
        }
        
        if( expansionAnimation.progress() > 0 ){
            expansionAnimation.reverse();
        }else{
            expansionAnimation.reversed(!expansionAnimation.reversed());
            expansionAnimation.play();
        }

    }, [dialerExpansion])
    const handleExpansion = () => {
        setDialerExpansion(!dialerExpansion);
    }

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
    </nav>;
}

Menu.propTypes = {
    isMobile: PropTypes.bool.isRequired
}