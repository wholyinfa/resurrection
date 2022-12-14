import React, { useEffect, useRef, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { breakPoints, PageData, Pages } from './data';
import Menu, { paginationMap } from './Menu'
import AboutPage from './AboutPage';
import CharacterPage from './CharacterPage';
import ContactPage from './ContactPage';
import IndexPage from './IndexPage';
import NotFound from './NotFound';
import ProjectsPage from './ProjectsPage';
import SingleProjectPage from './SingleProjectPage';
import './Stylesheets/style.css';

export const titleConversion = (query: string) => {
  const qLength = query.length;
  if (qLength > 1 && Array.from(query)[qLength-1] === '/') query = query.substring(0, qLength-1);
  return query.toLowerCase().replaceAll(' ', '-');
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
  const newPage = useRef<PageData>();
  const isPaginating = useRef<boolean>(false);
  const portal = (direction: 'up' | 'down', applyInfinity: any) => {
    const i = paginationMap.findIndex(t => typeof t.current !== 'undefined' );
    let targetI;
    if( direction === 'up' ){
    targetI = ( paginationMap[i-1] ) ? i-1 : paginationMap.length-1;
    }else{
    targetI = ( paginationMap[i+1] ) ? i+1 : 0;
    }
    newPage.current = paginationMap[targetI];
    isPaginating.current = true;
    applyInfinity();
  };
  useEffect( () => {

    resizePurposes();
    window.addEventListener('resize', (e) => {
      resizePurposes();
      setResize(p => !p);
    });

    return( () => {
        window.removeEventListener('resize', resizePurposes)
    })

  }, []);

  const [imposeSequence, setImposeSequence] = useState<gsap.Callback | undefined>();

  return (
    <>
      <Menu
        portal = {portal}
        isPaginating = {isPaginating}
        newPage = {newPage}
        isMobile = {isMobile}
        resize = {resize}
        imposeSequence = {imposeSequence}
      />
      <Switch>
        <Route exact path={Pages.index.url}>
          <IndexPage
            isPaginating = {isPaginating}
            newPage = {newPage}
            isMobile = {isMobile}
          />
        </Route>
        <Route exact path={Pages.about.url}>
          <AboutPage
            isMobile = {isMobile}
          />
        </Route>
        <Route exact path={Pages.contact.url}>
          <ContactPage />
        </Route>
        <Route exact path={Pages.projects.url}>
          <ProjectsPage
          setImposeSequence = {setImposeSequence}
          />
        </Route>
        <Route exact path={Pages.projects.url+'/:projectName'}>
          <SingleProjectPage />
        </Route>
        <Route exact path={Pages.character.url}>
          <CharacterPage
            resize = {resize}
          />
        </Route>
        <Route path="*">
            <NotFound />
        </Route>
      </Switch>
    </>
  );
}
