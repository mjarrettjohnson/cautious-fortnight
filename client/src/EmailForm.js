import React, { Component } from 'react';
import axios from 'axios';
import Validator from './utils/validation';
import BASE_URL from './utils/BaseUrl';
import Spinner from './Spinner';

export default class EmailForm extends Component {
  static FROM = 'from';
  static TO = 'to';
  static SUBJECT = 'subject';
  static TEXT = 'text';
  static ERROR_STATUS = 'error';

  constructor(props) {
    super(props);
    this.state = {
      email: {
        from: '',
        to: '',
        subject: '',
        text: '',
      },
      errors: {
        from: '',
        to: '',
        subject: '',
        text: '',
      },
      apiError: '',
      apiSuccess: '',
      isLoading: false,
    };
  }

  setStateOnChange(name, value, errorMessage) {
    const newState = {
      ...this.state,
      apiError: '',
      apiSuccess: '',
    };

    newState.email[name] = value;
    newState.errors[name] = errorMessage;
    this.setState(newState);
  }

  onChangeFrom(from) {
    this.setStateOnChange(EmailForm.FROM, from, Validator.validateFrom(from));
  }

  onChangeTo(to) {
    this.setStateOnChange(EmailForm.TO, to, Validator.validateTo(to));
  }

  onChangeSubject(subject) {
    this.setStateOnChange(
      EmailForm.SUBJECT,
      subject,
      Validator.validateSubject(subject)
    );
  }

  onChangeText(text) {
    this.setStateOnChange(EmailForm.TEXT, text, Validator.validateText(text));
  }

  setClass(name) {
    if (this.state.errors[name]) return 'form-group has-error';
    return 'form-group';
  }

  setSubmitDisabled() {
    const { from, to, subject, text } = this.state.errors;
    return from || to || subject || text;
  }

  handleResponseSuccess(response) {
    let newState;
    if (response.data.status === EmailForm.ERROR_STATUS) {
      newState = { ...this.state, apiError: response.data.message };
    } else {
      newState = {
        ...this.state,
        email: { from: '', to: '', subject: '', text: '' },
        apiSuccess: response.data.message,
        apiError: '',
        isLoading: false,
      };
    }
    this.setState(newState);
  }

  handleResponseFailure(response) {
    let newState;
    if (response && response.status === EmailForm.ERROR_STATUS) {
      newState = {
        ...this.state,
        apiError: response.message,
        isLoading: false,
      };
    } else {
      newState = {
        ...this.state,
        apiError: 'Something went wrong :(',
        isLoading: false,
      };
    }
    this.setState(newState);
  }

  sendRequest() {
    axios
      .post(`${BASE_URL}/api/email`, this.state.email)
      .then(this.handleResponseSuccess.bind(this))
      .catch(this.handleResponseFailure.bind(this));
  }

  failedFinalValidation() {
    this.setState({
      ...this.state,
      errors: {
        from: Validator.validateFrom(this.state.email.from),
        to: Validator.validateTo(this.state.email.to),
        subject: Validator.validateSubject(this.state.email.subject),
        text: Validator.validateText(this.state.email.text),
      },
      apiError: '',
      apiSuccess: '',
    });
  }

  submit(e) {
    e.preventDefault();
    const { from, to, subject, text } = this.state.email;
    if (!from || !to || !subject || !text) {
      this.failedFinalValidation();
    } else {
      this.setState({ ...this.state, isLoading: true }, () =>
        this.sendRequest()
      );
    }
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }
    return (
      <div>
        <div className="row">
          <div className="col-md-10 col-md-offset-1 text-center">
            <h1 className="title">Send an Email</h1>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <form className="col-md-10 col-md-offset-1">
              <div className={this.setClass(EmailForm.FROM)}>
                <label>From:</label>
                <input
                  onChange={e => this.onChangeFrom(e.target.value)}
                  value={this.state.email.from}
                  className="form-control"
                />
                <span className="help-block">{this.state.errors.from}</span>
              </div>
              <div className={this.setClass(EmailForm.TO)}>
                <label>To:</label>
                <input
                  onChange={e => this.onChangeTo(e.target.value)}
                  value={this.state.email.to}
                  className="form-control"
                />
                <span className="help-block">{this.state.errors.to}</span>
              </div>
              <div className={this.setClass(EmailForm.SUBJECT)}>
                <label>Subject:</label>
                <input
                  onChange={e => this.onChangeSubject(e.target.value)}
                  value={this.state.email.subject}
                  className="form-control"
                />
                <span className="help-block">{this.state.errors.subject}</span>
              </div>
              <div className={this.setClass(EmailForm.TEXT)}>
                <label>Content:</label>
                <textarea
                  onChange={e => this.onChangeText(e.target.value)}
                  value={this.state.email.text}
                  className="form-control"
                />
                <span className="help-block">{this.state.errors.text}</span>
              </div>
              <div className="form-group">
                <button
                  disabled={this.setSubmitDisabled()}
                  onClick={this.submit.bind(this)}
                  className="form-control"
                >
                  Send Email
                </button>
              </div>
              <div className="form-group has-error text-center">
                <p style={{ fontSize: '20px' }} className="help-block">
                  {this.state.apiError}
                </p>
              </div>
              <div className="form-group has-success text-center">
                <p style={{ fontSize: '20px' }} className="help-block">
                  {this.state.apiSuccess}
                </p>
              </div>
            </form>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}
