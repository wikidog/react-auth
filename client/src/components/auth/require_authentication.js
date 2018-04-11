import React, { Component } from 'react';
import { connect } from 'react-redux';

//
// This is a Higher Order Component
//
//   This component is used in the main.js
//
//   We warp the protected resources inside this HOC
//
//   import requireAuth from './require_authentication';
//     ...
//     <Route path="/resources" component={requireAuth(Resources)} />
//
export default function(ComposedComponent) {

  class Authentication extends Component {

    // if user is not signed in, route user back to '/'
    //
    componentWillMount() {
      if (!this.props.authenticated) {
        this.props.history.push('/');
      }
    }

    // When user clicks "Sign Out", route user back to '/'
    //
    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.props.history.push('/');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps({ auth }) {
    return { authenticated: auth.authenticated };
  }

  return connect(mapStateToProps)(Authentication);
}
