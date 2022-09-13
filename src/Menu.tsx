import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { titleConversion } from "./App";
import { PageData, Pages } from "./data";
import './Stylesheets/menu.css';

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

    return <nav id='dialer'>
        <div>
        { items.map( (item, i) => {
            return <NavLink exact key={i} to={item.url}>
                {item.text}
            </NavLink>;
        }) }
        </div>
    </nav>;
}