import React, { useState, useEffect, useRef } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { changePagination, titleConversion } from "./App";
import { PageData, Pages } from "./data";
import './Stylesheets/menu.css';
gsap.registerPlugin(Draggable);

let expansionAnimation: gsap.core.Timeline;
export const Menu = () => {

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
    const [checkItems, setCheckItems] = useState<boolean>();

    
    useEffect(() => {

    }, [checkItems]);

    const newList = useRef<itemData[]>(items);
    const infiniteItems = useRef<itemData[]>([]);
    const itemReset = useRef<boolean>(true);
    const xMemory = useRef<boolean>(false);
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

    const makeVisible = ( theItems: Element[], immediate?: boolean) => {
        let set = (immediate) ? 0 : .2;
        gsap.to([theItems[0], theItems[theItems.length-1]], {duration: set, autoAlpha: .4, scale: 1});
        gsap.to([theItems[1], theItems[theItems.length-2]], {duration: set, autoAlpha: .6, scale: 1});
        gsap.to(theItems[2], {duration: set, autoAlpha: 1, scale: 1.2});  
    }
    useEffect(() => {
        gsap.set("#dialer a", {width: menuItemW});
        document.querySelector("#dialer a.ghost") && gsap.set("#dialer a.ghost", {opacity: 0});

        gsap.set("#dialer", {width: menuItemW*items.filter(item => typeof item.ghost === 'undefined' || item.ghost === true).length});
        items.filter(item => item.ghost === false ).length > 0 && gsap.set('#dialer', {x: 0});

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

    const trueX = useRef<number>(0);
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
        trueX.current = Number(gsap.getProperty("#dialer", "x"));

        isSnapping.current = false;
        itemReset.current = true;
        xMemory.current = false;
    }

    const applyInfinity = (theX: number) => {
        if( itemReset.current ) {
            let copy = addAll().slice();
            let visibles = copy.filter( item => typeof item.ghost === 'undefined' );
            makeInfiniteItems(visibles);
            newList.current = visibles;
            copy = addAll();
            setItems(copy);

            let x = ( xMemory.current ) ? theX : theX - menuItemW * (addAll(true).length/2);
            gsap.set('#dialer', {x: x});
            trueX.current = x;
            itemReset.current = false;
            xMemory.current = false;
        }else xMemory.current = true;
    }

    const updateX = () => {
        trueX.current = Number(gsap.getProperty("#dialer", "x"));
    }
    const isSnapping = useRef<false | gsap.core.Tween>(false);
    const restoreFromInfinity = (theX: number, endX: number) => {
        let dur = (theX === endX) ? .3 : 0,
        xAlgo = ( Math.round(theX / menuItemW) * menuItemW ),
        x = ( xMemory.current ) ? xAlgo : xAlgo - menuItemW * (addAll(true).length/2);

        let currentX;
        if ( manualDrag.current !== false ){
            currentX = x;
            x = manualDrag.current;
        }
        let firstVis = Math.abs(Math.round(x / menuItemW)),
            aElements = Array.from(document.querySelectorAll('#dialer a')),
            visibleItems = aElements.splice(firstVis, 5),
            relativeDuration = currentX ? (Math.abs(x - currentX) / menuItemW) * dur : dur;

        isSnapping.current = gsap.to('#dialer', {id: 'Dialer',ease: 'power2.inOut', duration: relativeDuration, x: x, onUpdate: updateX, onComplete: doAfterAdjustment, onCompleteParams: [firstVis] });
        makeVisible(visibleItems);

        manualDrag.current = false;
    }

    useEffect(() => {
        gsap.set("#dialerContainer", {width: menuItemW*5});

        let snapTo = gsap.timeline();
        let xOnPress: number;
        Draggable.create("#dialer", {
            type:"x",
            trigger: '#dialerHandle, #dialer',
            edgeResistance: 0.65,
            onPress: function() {
                applyInfinity(this.x);
                xOnPress = trueX.current;
            },
            onDrag: function() {
                let x = ( xMemory.current ) ? this.x : this.x - menuItemW * (addAll(true).length/2),
                    aElements = Array.from(document.querySelectorAll('#dialer a')),
                    firstVis = Math.abs( Math.round( x / menuItemW ) ),
                    visibleItems = aElements.splice(firstVis, 5),
                    hiddenItems = aElements;

                makeVisible(visibleItems);
                gsap.set('#dialer', {x: x});
                trueX.current = x;
                gsap.to(hiddenItems, {duration: .2, autoAlpha: 0});
            },
            onDragEnd: function() {
                restoreFromInfinity(this.x, this.endX);
            },
            onRelease: function() {
                if( xOnPress === trueX.current &&
                    isSnapping.current &&
                    this.pointerEvent.target.localName !== 'a'
                    ){
                        const oldVars: gsap.TweenVars = isSnapping.current.vars;
                        isSnapping.current = gsap.to('#dialer', {id: 'Dialer',ease: 'power2.inOut', duration: oldVars.duration, x: oldVars.x, onUpdate: oldVars.onUpdate, onComplete: oldVars.onComplete, onCompleteParams: oldVars.onCompleteParams });
                }
            }
        });
    },[])

    const manualDrag = useRef<number | false>(false);
    const handleClick = (e:React.MouseEvent<HTMLAnchorElement, MouseEvent>, i: number) => {
        e.preventDefault();
       
        const x = Draggable.get('#dialer').x;
        manualDrag.current = -1 * ( ( trueX.current + menuItemW * i ) - ( trueX.current + menuItemW * Math.floor( newList.current.length / 2 ) ) );

        restoreFromInfinity(x, x);
        xMemory.current = false;
    }
    const handleKeyDownClick = (e:React.KeyboardEvent<HTMLAnchorElement>) => {
        e.code !== 'Tab' && e.preventDefault();
    }

    const [dialerExpansion, setDialerExpansion] = useState<boolean>(false);
    useEffect( () => {
        if( typeof expansionAnimation === 'undefined' ){
            expansionAnimation = gsap.timeline();
            const properties = {
                ease: 'sine.inOut',
                duration: .3,
            }
            expansionAnimation.fromTo('#dialerContainer, #dialerHandle', {y: '-100%'}, {y: '0%', ...properties}, 0)
            .fromTo('#expansionArrow', {y: -30}, {y: 0, ...properties}, '<')
            .fromTo('#expansionArrow div:first-child', {rotate: '45deg', y: 0}, {rotate: '-45deg', y: -20, ...properties}, '<')
            .fromTo('#expansionArrow div:last-child', {rotate: '-45deg', y: 0}, {rotate: '45deg', y: -20, ...properties}, '<');
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
            expand
            <div></div>
            <div></div>
        </button>
    </nav>;
}