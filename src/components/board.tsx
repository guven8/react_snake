import * as React from 'react';
import { Snake } from './snake';
import { random } from 'lodash';
import '../styles/snake.css';

type BoardState = {
  snakeHeadX: number;
  snakeHeadY: number;
  foodX: number;
  foodY: number;
  speed: number;
  movingDirection: 'right' | 'left' | 'up' | 'down';
  blockCount: number;
  gameRunning: boolean;
  gameOver: boolean;
};

export class Board extends React.Component<{}, BoardState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      snakeHeadX: 0,
      snakeHeadY: 7,
      foodX: random(0, 6) * 100,
      foodY: random(0, 6) * 100,
      speed: 6,
      movingDirection: 'right',
      blockCount: 4,
      gameRunning: true,
      gameOver: false
    };
  }

  componentWillMount() {
    window.addEventListener('keydown', this.arrowKeyListen);
    this.runGame();
  }

  private runGame = () => {
    window.setTimeout(this.setXYPos, 1000 / this.state.speed);
  }

  private gameOver = () => {
    this.setState({ gameRunning: false, gameOver: true });
  }

  private restartGame = () => {
    this.setState({
      snakeHeadX: 0,
      snakeHeadY: 7,
      foodX: random(0, 6) * 100,
      foodY: random(0, 6) * 100,
      speed: 6,
      movingDirection: 'right',
      blockCount: 4,
      gameRunning: true,
      gameOver: false
    });
    this.runGame();
  }

  private arrowKeyListen = () => {
    document.onkeydown = (e) => {
      if (e.code === 'ArrowRight' && this.state.movingDirection !== 'left') {
        this.setState({ movingDirection: 'right' });
      } else if (e.code === 'ArrowLeft' && this.state.movingDirection !== 'right') {
        this.setState({ movingDirection: 'left' });
      } else if (e.code === 'ArrowUp' && this.state.movingDirection !== 'down') {
        this.setState({ movingDirection: 'up' });
      } else if (e.code === 'ArrowDown' && this.state.movingDirection !== 'up') {
        this.setState({ movingDirection: 'down' });
      }
    };
  }

  private setXYPos = () => {
    switch (this.state.movingDirection) {
      case 'right':
        this.setState({ snakeHeadX: this.state.snakeHeadX === 15 ? 0 : this.state.snakeHeadX + 1 });
        break;
      case 'left':
        this.setState({ snakeHeadX: this.state.snakeHeadX === 0 ? 15 : this.state.snakeHeadX - 1 });
        break;
      case 'up':
        this.setState({ snakeHeadY: this.state.snakeHeadY === 0 ? 15 : this.state.snakeHeadY - 1 });
        break;
      case 'down':
        this.setState({ snakeHeadY: this.state.snakeHeadY === 15 ? 0 : this.state.snakeHeadY + 1 });
        break;
      default:
    }
    if (this.state.gameRunning) {
      this.runGame();
    }
  }

  private ateFood = (positions: string[]) => {
    // const snakeCoords = positions.map((position) =>
    //   position.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').map((i) => +i / 100)
    // );
    let foodX = random(0, 15);
    let foodY = random(0, 15);

    this.setState({
      speed: this.state.speed + 0.5,
      blockCount: this.state.blockCount + 1,
      foodX: foodX * 100,
      foodY: foodY * 100
    });
  }

  render() {
    let gridLines: JSX.Element[] = [];
    for (let i = 0; i < 256; i++) {
      gridLines.push(<span key={i} className="grid-line" />);
    }
    return (
      <div className="container">
        <div className="board">
          {gridLines}
          <Snake
            gameRunning={this.state.gameRunning}
            xPos={this.state.snakeHeadX}
            yPos={this.state.snakeHeadY}
            foodX={this.state.foodX}
            foodY={this.state.foodY}
            movingDirection={this.state.movingDirection}
            speed={this.state.speed}
            blockCount={this.state.blockCount}
            collisionDetected={this.gameOver}
            ateFood={this.ateFood}
          />
          <div
            className="food-container"
            style={{
              transform: `translate(${this.state.foodX}%, ${this.state.foodY}%)`
            }}
          >
            <div className="food" />
          </div>
          {this.state.gameOver && (
            <div className="game-over">
              <span>GAME OVER</span>
              <button onClick={this.restartGame}>Play again</button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
