import React, { useEffect, useRef, useState } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
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
    up: true,
    down: true
  });
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= breakPoints.dialer);
  const [resize, setResize] = useState<boolean>(false);
  const resizePurposes = () => {
      setIsMobile( window.innerWidth <= breakPoints.dialer );
  }
  const history = useHistory();
  const newPage = useRef<PageData>();
  const [isPaginating, paginating] = useState<boolean>(false);
  useEffect( () => {

    resizePurposes();
    window.addEventListener('resize', (e) => {
      resizePurposes();
      setResize(p => !p);
    });

    const portal = (direction: 'up' | 'down') => {
      const i = paginationMap.findIndex(t => typeof t.current !== 'undefined' );
      let targetI;
      if( direction === 'up' ){
        targetI = ( paginationMap[i-1] ) ? i-1 : paginationMap.length-1;
      }else{
        targetI = ( paginationMap[i+1] ) ? i+1 : 0;
      }
      newPage.current = paginationMap[targetI];
      // history.push(paginationMap[targetI].url);
    };

    /* addEventListener('wheel', (e) => {
      if( e.deltaY >= 0 && allowPagination.current.down === true ){
        paginating(true);
        // down
        portal('down');
      }else if( allowPagination.current.up === true ){
        paginating(true);
        // up
        portal('up');
      }
    }); */
  
    let touchStart: number;
    let touchEnd: number;
    addEventListener('touchstart', (e) => {
      touchStart = e.changedTouches[0].screenY;
    }, false); 
          
    addEventListener('touchend', (e) => {
      touchEnd = e.changedTouches[0].screenY;
      if (  touchEnd - touchStart >= 0 && allowPagination.current.down === true ){
        paginating(true);
        // down
        portal('down');
      }else if( allowPagination.current.up === true ){
        paginating(true);
        // up
        portal('up');
      }
    }, false);
          
    document.addEventListener('keyup', (e) => {
      if( ( e.code === 'ArrowDown' || e.code === 'Space' ) && allowPagination.current.down === true ){
        paginating(true);
        // down
        portal('down');
      }else if( e.code === 'ArrowUp' && allowPagination.current.up === true ){
        paginating(true);
        // up
        portal('up');
      }
    }, false);

    return( () => {
        window.removeEventListener('resize', resizePurposes)
    })

  }, []);

  const location = useLocation();
  useEffect(() => {
    newPage.current && changePagination(newPage.current);
    // paginating(false);
  }, [location])

  return (
    <>
      <Menu
        paginating = {paginating}
        isPaginating = {isPaginating}
        newPage = {newPage.current}
        isMobile= {isMobile}
        resize= {resize}
        
      />
      <Switch>
        <Route exact path={Pages.index.url}>
          <IndexPage
          paginating = {paginating}
            isMobile = {isMobile}
          />
        </Route>
        <Route exact path={Pages.about.url}>
          <AboutPage
            paginating = {paginating}
          />
        </Route>
        <Route exact path={Pages.contact.url}>
          <ContactPage
            paginating = {paginating}
          />
        </Route>
        <Route exact path={Pages.projects.url}>
          <ProjectsPage
            paginating = {paginating}
          />
        </Route>
        <Route exact path={Pages.projects.url+'/:projectName'}>
          <SingleProjectPage
            paginating = {paginating}
          />
        </Route>
        <Route exact path={Pages.character.url}>
          <CharacterPage
            paginating = {paginating}
          />
        </Route>
        <Route path="*">
            <NotFound
              paginating = {paginating}
            />
        </Route>
      </Switch>
    </>
  );
}
