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

    const [items, setItems] = useState<PageData[]>(itemList);
    const [checkItems, setCheckItems] = useState<boolean>();

    
    useEffect(() => {

    }, [checkItems]);

    const infiniteItemsL = useRef<PageData[]>([]);
    if( infiniteItemsL.current.length === 0 ){
        let LeftyItems = items.slice().reverse();
        for (let i = 0; i < 20; i++){
            LeftyItems.map( item => {
                infiniteItemsL.current.push(item);
            })
        }
    }
    const lefties = useRef<PageData[]>([]);
    const [leftiesList, setLeftiesList] = useState<PageData[]>();
    const menuItemW = 160;

    useEffect(() => {
        if( leftiesList ){
            gsap.set(".lefties", {width: menuItemW*leftiesList.length, x: -menuItemW*leftiesList.length});
            gsap.set(".lefties a", {width: menuItemW});
        }
    }, [leftiesList]);


    useEffect(() => {
        gsap.set("#dialer a", {width: menuItemW});
        gsap.set("#dialer", {width: menuItemW*items.length});
        gsap.set("#dialerContainer", {width: menuItemW*5});
        Draggable.create("#dialer", {
            type:"x",
            inertia: true,
            onClick: function() {
                
            },
            onDrag: function(endValue){
                if ( this.x > 0 &&
                    (Math.round(this.x / menuItemW) * menuItemW) / menuItemW >= lefties.current.length
                    ){
                    let item: PageData = infiniteItemsL.current.shift()!;
                    lefties.current.unshift(item);
                    setLeftiesList(lefties.current.slice());
                }else if( this.x > 0  &&
                    ( lefties.current.length - (Math.round(this.x / menuItemW) * menuItemW) / menuItemW ) > 1
                    ){
                    let item: PageData = lefties.current.shift()!;
                    infiniteItemsL.current.unshift(item);
                    setLeftiesList(lefties.current.slice());
                }
            },
            onDragEnd: function() {
                console.log("drag ended");
            }
        });
    },[])

    return <nav>
        <div id='dialerContainer'>
            <div id='dialer'>
            {
                leftiesList && <div className='lefties'>
                    { leftiesList.map( (item, i) => {
                        return <NavLink exact key={i} to={item.url}>
                            {item.text}
                        </NavLink>;
                    }) }
                </div>
            }
            { items.map( (item, i) => {
                return <NavLink exact key={i} to={item.url}>
                    {item.text}
                </NavLink>;
            }) }
            </div>
        </div>
    </nav>;
}