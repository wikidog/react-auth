import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './home';
import requireAuth from './auth/require_authentication';

import Signin from './auth/signin';
import Signout from './auth/signout';
import Signup from './auth/signup';
import Feature from './feature';


          // <Route path="/resources" component={requireAuth(Resources)} />
class Main extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signin" component={Signin} />
          <Route path="/signout" component={Signout} />
          <Route path="/signup" component={Signup} />
          <Route path="/feature" component={requireAuth(Feature)} />
        </Switch>
      </div>
    );
  }
}

export default Main;
