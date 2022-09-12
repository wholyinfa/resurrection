import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import { Pages } from './data';
import { Menu } from './Menu'



export default function App() {
  
  return (
    <>
      <Menu />
      <Route exact path={Pages.index.url}>
        I'm index
      </Route>
      <Route exact path={Pages.about.url}>
        I'm about
      </Route>
      <Route exact path={Pages.contact.url}>
        I'm contact
      </Route>
      <Route exact path={Pages.projects.url}>
        I'm projects
      </Route>
      <Route exact path={Pages.projects.url+':title'}>
        I'm projects child
      </Route>
      <Route exact path={Pages.character.url}>
        I'm character
      </Route>
    </>
  );
}
