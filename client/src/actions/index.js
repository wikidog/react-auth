import axios from 'axios';

import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, FETCH_MESSAGE } from './types';

const ROOT_URL = 'http://localhost:3090';

// in Redux Thunk, action creator returns a function instead of an object
// Redux Thunk gives us access to Redux dispatch function directly
//
export function signinUser({ email, password }, callback) {

  return function(dispatch) {
    // Submit username and password to the server
    axios.post(`${ROOT_URL}/signin`, { email, password })
      .then(response => {
        // if request is good...
        // - update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });

        // - save the JWT token to local storage
        localStorage.setItem('token', response.data.token);

        // - redirect user to the route '/feature'
        //   this callback function calls Redux form history function
        //     to navigate user back to /feature
        callback();
      })
      .catch(() => {
        // if request is bad...
        // - show an error to the user
        dispatch(authError('Bad Login Info'));  // dispatch an action creator

      });
  };
};

// signup logic is very similar with signin logic
//
export function signupUser({ email, password }, callback) {

  return function(dispatch) {
    // Submit username and password to the server
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        // if request is good...
        // - update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });

        // - save the JWT token to local storage
        localStorage.setItem('token', response.data.token);

        // - redirect user to the route '/feature'
        //   this callback function calls Redux form history function
        //     to navigate user back to /feature
        callback();
      })
      .catch(error => {
        //
        // when there is an error, the response sent back from the server
        // is in error.response object
        //
        // if request is bad...
        // - show an error to the user
        dispatch(authError(error.response.data.error));  // dispatch an action creator

      });
  };
};

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error,
  };
};

export function signoutUser() {
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
};

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') },
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message,
        })
      })
      .catch(error => {

      });
  }
}
