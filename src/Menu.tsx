import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { PageData, Pages } from "./data";

export const Menu = () => {

    const itemList: PageData[] = [];
    Object.keys(Pages).map( item => {
        itemList.push(Pages[item as keyof Pages]);
    });
    const [items, setItems] = useState<PageData[]>(itemList);
    const [checkItems, setCheckItems] = useState<boolean>();

    
    useEffect(() => {

    }, [checkItems]);

    return <nav>
        { items.map( (item, i) => {
            return <NavLink key={i} to={item.url}>
                {item.text}
            </NavLink>;
        }) }
    </nav>;
}