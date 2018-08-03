import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import home from './routes/home';
import registerUser from './routes/registerUser';

export default class App extends Component {
  render() {
    return (
     <div>
        <Route exact path="/" component={home} />
        <Route  path="/register" component={registerUser} />
     </div>
    )
  }
}

