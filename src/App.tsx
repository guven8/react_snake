import * as React from 'react';
import './App.css';
import { Board } from './components/board';

export class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header" />
        <Board />
      </div>
    );
  }
}
