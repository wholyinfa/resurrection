import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { titleConversion } from "./App";
import { PageData, Pages } from "./data";
import './Stylesheets/menu.css';
gsap.registerPlugin(Draggable);

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
    const xMemory = useRef<number>(0);
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
        gsap.to([theItems[0], theItems[theItems.length-1]], {duration: set, autoAlpha: .1});
        gsap.to([theItems[1], theItems[theItems.length-2]], {duration: set, autoAlpha: .3});
        gsap.to(theItems[2], {duration: set, autoAlpha: 1});  
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

    useEffect(() => {
        gsap.set("#dialerContainer", {width: menuItemW*5});

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

        let snapTo = gsap.timeline();
        const doAfterAdjustment = (firstVis: number) => {
                let copy = addAll().slice();
                let nullItem: itemData = {
                    text: '',
                    title: '',
                    url: '',
                    ghost: false
                };
                copy = copy.map( (item, i) => {
                    let newItem = {...item};
                    if ( i < firstVis || i >= firstVis+5 )
                        newItem = nullItem;
                    else
                        delete newItem.ghost;
                    return newItem;
                });
                newList.current = copy;
                makeInfiniteItems(copy);
            setItems(copy);
            itemReset.current = true;
        }
        Draggable.create("#dialer", {
            type:"x",
            trigger: '#dialerHandle',
            edgeResistance: 0.65,
            onPress: function() {
                if( itemReset.current ) {
                    xMemory.current = 0;

                    let copy = addAll().slice();
                    let visibles = copy.filter( item => typeof item.ghost === 'undefined' );
                    makeInfiniteItems(visibles);
                    newList.current = visibles;
                    copy = addAll();
                    setItems(copy);

                    let x = ( xMemory.current ) ? this.x : this.x - menuItemW * (addAll(true).length/2);
                    gsap.set('#dialer', {x: x});
                    itemReset.current = false;
                }else xMemory.current = 1;
            },
            onDrag: function(endValue){
                let x = ( xMemory.current ) ? this.x : this.x - menuItemW * (addAll(true).length/2),
                    aElements = Array.from(document.querySelectorAll('#dialer a')),
                    firstVis = Math.abs( Math.round( x / menuItemW ) ),
                    visibleItems = aElements.splice(firstVis, 5),
                    hiddenItems = aElements;

                makeVisible(visibleItems);
                gsap.set('#dialer', {x: x});
                gsap.to(hiddenItems, {duration: .2, autoAlpha: 0});
            },
            onRelease: function() {
                let dur = (this.x === this.endX) ? .2 : 0,
                    xAlgo = ( Math.round(this.x / menuItemW) * menuItemW ),
                    x = ( xMemory.current ) ? xAlgo : xAlgo - menuItemW * (addAll(true).length/2),
                    firstVis = Math.abs(Math.round(x / menuItemW)),
                    aElements = Array.from(document.querySelectorAll('#dialer a')),
                    visibleItems = aElements.splice(firstVis, 5);

                snapTo.to('#dialer', {ease: "power2.inOut", duration: dur, x: x, onComplete: doAfterAdjustment, onCompleteParams: [firstVis] });
                makeVisible(visibleItems);
            }
            
        });
    },[])

    return <nav>
        <div id='dialerHandle'></div>
        <div id='dialerContainer'>
            <div id='dialer'>
            { items.map( (item, i) => {
                return item.url !== '' && <NavLink exact className={ item.ghost ? 'ghost' : '' } key={i} to={item.url}>
                    {item.text}
                </NavLink>;
            }) }
            </div>
        </div>
    </nav>;
}