import React, { Component } from 'react';
import axios from 'axios';
import Spinner from './Spinner';

export default class EmailForm extends Component {
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

  validateFrom(from) {
    if (!from || from.split(' ').length !== 3) {
      return 'A from email address must be in the format: Display name <email@address.com>.';
    } else {
      const split = from.split(' ');
      const email = split[2];
      if (email[0] !== '<' || email[email.length - 1] !== '>') {
        return 'A from email address must be in the format: Display name <email@address.com>.';
      } else {
        const stripped = email.slice(1, email.length - 1);
        if (!this.validEmail(stripped)) {
          return 'Please enter a valid email.';
        } else {
          return '';
        }
      }
    }
  }

  validateTo(to) {
    if (!to || !this.validEmail(to)) {
      return 'Please enter a valid email.';
    } else {
      return '';
    }
  }

  validEmail(email) {
    return email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }

  validateSubject(subject) {
    if (!subject || subject.trim().length == 0) {
      return 'An email subject line cannot be empty.';
    } else {
      return '';
    }
  }

  validateText(text) {
    if (!text || text.trim().length == 0) {
      return 'An email body must contain text';
    } else {
      return '';
    }
  }

  onChangeFrom(e) {
    const from = e.target.value;

    const errorMessage = this.validateFrom(from);

    this.setState({
      ...this.state,
      email: {
        ...this.state.email,
        from,
      },
      errors: { ...this.state.errors, from: errorMessage },
      apiError: '',
      apiSuccess: '',
    });
  }

  onChangeTo(e) {
    const to = e.target.value;

    const errorMessage = this.validateTo(to);

    this.setState({
      ...this.state,
      email: {
        ...this.state.email,
        to,
      },
      errors: { ...this.state.errors, to: errorMessage },
      apiError: '',
      apiSuccess: '',
    });
  }

  onChangeSubject(e) {
    const subject = e.target.value;
    const errorMessage = this.validateSubject(subject);
    this.setState({
      ...this.state,
      email: {
        ...this.state.email,
        subject,
      },
      errors: { ...this.state.errors, subject: errorMessage },
      apiError: '',
      apiSuccess: '',
    });
  }

  onChangeText(e) {
    const text = e.target.value;
    const errorMessage = this.validateText(text);
    this.setState({
      ...this.state,
      email: {
        ...this.state.email,
        text,
      },
      errors: { ...this.state.errors, text: errorMessage },
      apiError: '',
      apiSuccess: '',
    });
  }

  setClass(name) {
    if (this.state.errors[name]) return 'form-group has-error';
    return 'form-group';
  }

  setSubmitDisabled() {
    const { from, to, subject, text } = this.state.errors;
    return from || to || subject || text;
  }

  sendRequest() {
    axios
      .post('http://localhost:4567/api/email', this.state.email)
      .then(response => {
        if (response.data.status === 'error') {
          this.setState({ ...this.state, apiError: response.data.message });
        } else {
          this.setState({
            ...this.state,
            email: { from: '', to: '', subject: '', text: '' },
            apiSuccess: response.data.message,
            isLoading: false,
          });
        }
      })
      .catch(response => {
        if (response && response.status === 'error') {
          this.setState({
            ...this.state,
            apiError: response.message,
            isLoading: false,
          });
        } else {
          this.setState({
            ...this.state,
            apiError: 'Something went wrong :(',
            isLoading: false,
          });
        }
      });
  }

  submit(e) {
    e.preventDefault();
    const { from, to, subject, text } = this.state.email;
    if (!from || !to || !subject || !text) {
      this.setState({
        ...this.state,
        errors: {
          from: this.validateFrom(),
          to: this.validateTo(),
          subject: this.validateSubject(),
          text: this.validateText(),
        },
        apiError: '',
        apiSuccess: '',
      });
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
            <h1 className="title">Send an Email!</h1>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <form className="col-md-10 col-md-offset-1">
              <div className={this.setClass('from')}>
                <label>From:</label>
                <input
                  onChange={e => this.onChangeFrom(e)}
                  value={this.state.email.from}
                  className="form-control"
                />
                <span className="help-block">{this.state.errors.from}</span>
              </div>
              <div className={this.setClass('to')}>
                <label>To:</label>
                <input
                  onChange={e => this.onChangeTo(e)}
                  value={this.state.email.to}
                  className="form-control"
                />
                <span className="help-block">{this.state.errors.to}</span>
              </div>
              <div className={this.setClass('subject')}>
                <label>Subject:</label>
                <input
                  onChange={e => this.onChangeSubject(e)}
                  value={this.state.email.subject}
                  className="form-control"
                />
                <span className="help-block">{this.state.errors.subject}</span>
              </div>
              <div className={this.setClass('text')}>
                <label>Content:</label>
                <textarea
                  onChange={e => this.onChangeText(e)}
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
                  Send Email!
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
