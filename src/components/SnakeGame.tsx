import * as React from 'react';
import { Snake } from './Snake';
import { random, isEqual } from 'lodash';
import '../styles/snake.css';

const eCodes = {
  right: {
    direction: 'right',
    opposite: 'left',
    coords: (x, y) => ({ x: x === 15 ? 0 : x + 1, y: y })
  },
  left: {
    direction: 'left',
    opposite: 'right',
    coords: (x, y) => ({ x: x === 0 ? 15 : x - 1, y: y })
  },
  up: {
    direction: 'up',
    opposite: 'down',
    coords: (x, y) => ({ y: y === 0 ? 15 : y - 1, x: x })
  },
  down: {
    direction: 'down',
    opposite: 'up',
    coords: (x, y) => ({ y: y === 15 ? 0 : y + 1, x: x })
  },
  restart: 'restart',
  pausePlay: 'pausePlay'
};

const keyMappings = {
  KeyD: eCodes.right,
  ArrowRight: eCodes.right,
  KeyA: eCodes.left,
  ArrowLeft: eCodes.left,
  KeyW: eCodes.up,
  ArrowUp: eCodes.up,
  KeyS: eCodes.down,
  ArrowDown: eCodes.down,
  Enter: eCodes.restart,
  Space: eCodes.pausePlay
};

export type coordsType = { x: number; y: number };

type BoardState = {
  snakeCoords: coordsType;
  foodCoords: coordsType;
  coordsUpdateCount: number;
  moveUpdateCount: number;
  speed: number;
  movingDirection: 'right' | 'left' | 'up' | 'down';
  blockCount: number;
  gameOver: boolean;
};

const getRandomCoords = () => ({ x: random(0, 15), y: random(0, 15) });

const initialState: BoardState = {
  snakeCoords: { x: 0, y: 7 },
  foodCoords: getRandomCoords(),
  coordsUpdateCount: 0,
  moveUpdateCount: 0,
  speed: 6,
  movingDirection: 'right',
  blockCount: 4,
  gameOver: false
};

export class SnakeGame extends React.Component<{}, BoardState> {
  constructor(props: {}) {
    super(props);
    this.state = { ...initialState };
  }

  componentWillMount() {
    window.addEventListener('keydown', this.setMovingDirection);
    this.runGame();
  }

  private runGame = () => {
    window.setTimeout(this.setSnakeCoords, 1000 / this.state.speed);
  }

  private gameOver = () => {
    this.setState({ gameOver: true });
  }

  private restartGame = () => {
    this.setState({ ...initialState });
    this.runGame();
  }

  private setMovingDirection = () => {
    return (document.onkeydown = e => {
      if (!keyMappings[e.code]) {
        return;
      }
      const { coordsUpdateCount, moveUpdateCount } = this.state;
      const { direction: newMovingDirection, opposite: newOppositeDirection } = keyMappings[e.code];
      if (
        this.state.movingDirection !== newOppositeDirection &&
        moveUpdateCount !== coordsUpdateCount
      ) {
        this.setState({ movingDirection: newMovingDirection, moveUpdateCount: coordsUpdateCount });
      }
      if (this.state.gameOver && keyMappings[e.code] === 'restart') {
        this.restartGame();
      }
    });
  }

  private setSnakeCoords = () => {
    if (!this.state.gameOver) {
      const { coordsUpdateCount } = this.state;
      const { x, y } = Object.keys(keyMappings)
        .map(key => keyMappings[key])
        .find(value => value.direction === this.state.movingDirection)
        .coords(this.state.snakeCoords.x, this.state.snakeCoords.y);
      this.setState({ snakeCoords: { x, y }, coordsUpdateCount: coordsUpdateCount + 1 });
      this.runGame();
    }
  }

  private ateFood = (snakeCoords: coordsType[]) => {
    const foodCoords = (function getNewFoodCoords(coords: coordsType[]) {
      const newFoodCoords = getRandomCoords();
      if (coords.find(coord => isEqual(coord, newFoodCoords))) {
        return getNewFoodCoords(coords);
      } else {
        return newFoodCoords;
      }
    })(snakeCoords);

    this.setState({
      speed: this.state.speed + 0.5,
      blockCount: this.state.blockCount + 1,
      foodCoords
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
            gameRunning={!this.state.gameOver}
            coords={this.state.snakeCoords}
            foodCoords={this.state.foodCoords}
            blockCount={this.state.blockCount}
            collisionDetected={this.gameOver}
            ateFood={this.ateFood}
          />
          <div
            className="food-container"
            style={{
              transform: `translate(${this.state.foodCoords.x * 100}%, ${this.state.foodCoords.y *
                100}%)`
            }}
          >
            <div className="food" />
          </div>
          {this.state.gameOver && (
            <div className="game-over">
              <span className="game-over-text">GAME OVER</span>
              <span>Press enter to restart</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
