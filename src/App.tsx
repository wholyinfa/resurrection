import React, { useEffect, useRef, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { breakPoints, PageData, Pages } from './data';
import Menu from './Menu'
import AboutPage from './AboutPage';
import CharacterPage from './CharacterPage';
import ContactPage from './ContactPage';
import IndexPage from './IndexPage';
import NotFound from './NotFound';
import ProjectsPage from './ProjectsPage';
import SingleProjectPage from './SingleProjectPage';
import './Stylesheets/style.css';

export const titleConversion = (query: string) => {
  return query.toLowerCase().replaceAll(' ', '-');
}

interface paginationMap extends PageData {
  current?: boolean;
}
let paginationMap: paginationMap[] = [
  Pages.index,
  Pages.about,
  Pages.character,
  Pages.projects,
  Pages.contact,
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

export default function App() {
  
  interface upNdown{
    up: boolean;
    down: boolean;
  }
  const allowPagination = useRef<upNdown>({
    up: false,
    down: false
  });
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= breakPoints.dialer);
  const [resize, setResize] = useState<boolean>(false);
  const resizePurposes = () => {
      setIsMobile( window.innerWidth <= breakPoints.dialer );
  }
  useEffect( () => {

    resizePurposes();
    window.addEventListener('resize', (e) => {
      resizePurposes();
      setResize(p => !p);
    });

    addEventListener('wheel', (e) => {
      if( e.deltaY >= 0 && allowPagination.current.down === true ){
        // down
        
      }else if( allowPagination.current.up === true ){
        // up
        
      }
    });
  
    let touchStart: number;
    let touchEnd: number;
    addEventListener('touchstart', (e) => {
      touchStart = e.changedTouches[0].screenY;
    }, false); 
          
    addEventListener('touchend', (e) => {
      touchEnd = e.changedTouches[0].screenY;
      if (  touchEnd - touchStart >= 0 && allowPagination.current.down === true ){
        // down
        
      }else if( allowPagination.current.up === true ){
        // up
        
      }
    }, false);
          
    document.addEventListener('keyup', (e) => {
      if( ( e.code === 'ArrowDown' || e.code === 'Space' ) && allowPagination.current.down === true ){
        // down
        
      }else if( e.code === 'ArrowUp' && allowPagination.current.up === true ){
        // up
        
      }
    }, false);

    return( () => {
        window.removeEventListener('resize', resizePurposes)
    })

  }, []);

  return (
    <>
      <Menu
        isMobile= {isMobile}
        resize= {resize}
      />
      <Switch>
        <Route exact path={Pages.index.url}>
          <IndexPage
            isMobile = {isMobile}
          />
        </Route>
        <Route exact path={Pages.about.url}>
          <AboutPage />
        </Route>
        <Route exact path={Pages.contact.url}>
          <ContactPage />
        </Route>
        <Route exact path={Pages.projects.url}>
          <ProjectsPage />
        </Route>
        <Route exact path={Pages.projects.url+'/:projectName'}>
          <SingleProjectPage />
        </Route>
        <Route exact path={Pages.character.url}>
          <CharacterPage />
        </Route>
        <Route path="*">
            <NotFound />
        </Route>
      </Switch>
    </>
  );
}
