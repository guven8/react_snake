import * as React from 'react';
import './App.css';
import { SnakeGame } from './components/SnakeGame';

export class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header" />
        <SnakeGame />
      </div>
    );
  }
}
