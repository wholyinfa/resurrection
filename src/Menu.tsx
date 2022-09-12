import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { titleConversion } from "./App";
import { PageData, Pages } from "./data";
import './Stylesheets/menu.css';

export const Menu = () => {

    const location = useLocation();
    const itemList: PageData[] = [];
    const activePage: PageData = Object.values(Pages).filter( entry => entry.url === titleConversion(location.pathname) )[0];
    Object.keys(Pages).map( item => {
        itemList.push(Pages[item as keyof Pages]);
    });

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