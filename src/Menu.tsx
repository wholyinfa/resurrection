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
          itemList: PageData[] = [];
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
        let lastItem: PageData = itemList[itemList.length-1];
        itemList.pop();
        itemList.unshift(lastItem);
    }

    useEffect( () => {
        
    }, [location]);

    interface itemData extends PageData {
        ghost?: boolean | undefined;
    }
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
        let LeftyItems = items.slice();
        for (let i = 0; i < 5; i++){
            LeftyItems.map( item => {
                infiniteItems.current.push(item);
            })
        }
    }
    if( infiniteItems.current.length === 0 ) makeInfiniteItems(items);
    
    const [leftiesList, setLeftiesList] = useState<itemData[]>();
    const menuItemW = 160;

    useEffect(() => {
        const x = Draggable.get('#dialer') && Draggable.get('#dialer').x;
        
        gsap.set("#dialer", {width: menuItemW*items.length});
        gsap.set("#dialer a", {width: menuItemW, opacity: .4});
        
    }, [items]);


    useEffect(() => {
        gsap.set("#dialer a", {width: menuItemW});
        gsap.set("#dialer", {width: menuItemW*items.length});
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
        const doAfterAdjustment = (x: number) => {
            const excessLength = addAll(true).length / 2;
            setItems(prev => {
                let copy = prev.slice();
                copy.splice(0, excessLength - Math.round(x / menuItemW));
                copy.splice( (copy.length - excessLength) - Math.round(x / menuItemW) , copy.length - 1);
                newList.current = copy;
                makeInfiniteItems(copy);
                gsap.set('#dialer', {x: 0});
                return copy;
            });
            itemReset.current = true;
        }
        Draggable.create("#dialer", {
            type:"x",
            trigger: '#dialerHandle',
            edgeResistance: 0.65,
            onPress: function() {
                if( itemReset.current ) {
                    xMemory.current = 0;
                    setItems(prev => {
                        let copy = prev.slice();
                        newList.current = copy;
                        makeInfiniteItems(copy);
                        return addAll();
                    });
                    itemReset.current = false;
                }else xMemory.current = 1;
            },
            onDragStart: function() {
            },
            onDrag: function(endValue){
                let x = ( xMemory.current ) ? this.x : this.x - menuItemW * (addAll(true).length/2);
                gsap.set('#dialer', {x: x});
            },
            onRelease: function() {
                let dur = (this.x === this.endX) ? .2 : 0;
                let x = ( xMemory.current ) ? ( Math.round(this.x / menuItemW) * menuItemW ) : ( Math.round(this.x / menuItemW) * menuItemW ) - menuItemW * (addAll(true).length/2);
                let trueX = ( xMemory.current ) ? this.x + menuItemW * (addAll(true).length/2) : this.x;
                snapTo.to('#dialer', {ease: "power2.inOut", duration: dur, x: x, onComplete: doAfterAdjustment, onCompleteParams: [trueX] });
            }
            
        });
    },[])

    return <nav>
        <div id='dialerHandle'></div>
        <div id='dialerContainer'>
            <div id='dialer'>
            { items.map( (item, i) => {
                return <NavLink exact className={ item.ghost ? 'ghost' : '' } key={i} to={item.url}>
                    {item.text}
                </NavLink>;
            }) }
            </div>
        </div>
    </nav>;
}