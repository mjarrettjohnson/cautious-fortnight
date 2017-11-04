import React, { Component } from 'react';
import EmailForm from './EmailForm';
import Header from './Header';
import Spinner from './Spinner';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container main">
          <EmailForm />
        </div>
      </div>
    );
  }
}

export default App;
