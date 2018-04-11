import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import * as actions from '../../actions';

class Signin extends Component {

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group${touched && error ? ' has-danger' : ''}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input
          type={field.type}
          className="form-control"
          {...field.input}
        />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  // 'values' is an object, which contains the name-value pairs from the form
  // in this case, we have { email, password }
  //
  // onSubmit(values) ====ES6====> onSubmit({ email, password })
  onSubmit({ email, password }) {

    this.props.signinUser({ email, password }, () => {
      //
      // navigate the user back to index page
      // but we have to wait for the post request to complete
      // before we go back to index page
      //
      // we pass this navigation function ask a callback function
      // of this action creator; the callback function will be called
      // after the promise is resolved.
      //
      this.props.history.push('/feature'); // when this function is executed,
                                    // we are back to "/", which is one of
                                    // the route strings.
    });
  }

  render() {
    // handleSubmit is provided by redux-form
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <fieldset className="form-group">
          <Field
            label="Email"
            name="email"
            type="text"
            component={this.renderField}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            component={this.renderField}
          />
        </fieldset>
        {this.renderAlert()}
        <button type="submit" className="btn btn-primary">Sign in</button>
      </form>
    );

  }
}

// values is an object: { email: 'ada', password: 'ada' }
function validate(values) {
  const errors = {};

  // validate the inputs from 'values;
  if (!values.email) {
    errors.email = "Enter email!";
  }
  if (!values.password) {
    errors.password = "Enter password!";
  }

  // if errors is empty, the form is fine to submit
  // if errors has any properties, redux form assumes form is invalid
  return errors;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
  };
}

export default reduxForm({
  form: 'signin',       // unique name for the form
  validate,
})(
  connect(mapStateToProps, actions)(Signin)
);
