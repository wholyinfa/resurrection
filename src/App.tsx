import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Pages } from './data';
import { Menu } from './Menu'
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

export default function App() {
  
  return (
    <>
      <Menu />
      <Switch>
        <Route exact path={Pages.index.url}>
          <IndexPage />
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
