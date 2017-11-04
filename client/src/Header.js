import React, { Component } from 'react';

export default class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-inverse navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              Simple Mail Service
            </a>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav" />
          </div>
        </div>
      </nav>
    );
  }
}
