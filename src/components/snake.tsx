import * as React from 'react';
import '../styles/snake.css';

type SnakeProps = {
  gameRunning: boolean;
  xPos: number;
  yPos: number;
  foodX: number;
  foodY: number;
  movingDirection: string;
  speed: number;
  blockCount: number;
  collisionDetected: () => void;
  ateFood: (positions: string[]) => void;
};

type SnakeState = {
  positions: string[];
};

export class Snake extends React.Component<SnakeProps, SnakeState> {
  constructor(props: SnakeProps) {
    super(props);
    this.state = {
      positions: [`${100 * props.xPos}%, ${100 * props.yPos}%`]
    };
  }

  componentWillReceiveProps(nextProps: SnakeProps) {
    if (nextProps.xPos !== this.props.xPos || nextProps.yPos !== this.props.yPos) {
      this.updatePositions();
    }
  }

  updatePositions = () => {
    const { gameRunning, xPos, yPos } = this.props;
    if (!gameRunning) {
      return;
    }
    let positions = this.state.positions.slice();
    positions.push(`${100 * xPos}%, ${100 * yPos}%`);
    if (positions.length > this.props.blockCount) {
      positions = positions.slice(positions.length - this.props.blockCount, positions.length);
    }

    this.checkIfAteFood(positions);

    if (!this.checkForCollision(positions)) {
      this.setState({ positions });
    } else {
      this.props.collisionDetected();
      // this.setState({ positions: [`${100 * this.props.xPos}%, ${100 * this.props.yPos}%`]});
    }
  }

  checkIfAteFood = (positions: string[]) => {
    const leadBlock = positions[positions.length - 1];
    if (leadBlock === `${this.props.foodX}%, ${this.props.foodY}%`) {
      this.props.ateFood(positions);
    }
  }

  checkForCollision = (positions: string[]) => {
    const leadBlock = positions[positions.length - 1];
    const notLead = positions.slice(0, positions.length - 1).filter((p) => !!p);
    const collisionDetected = notLead.length > 1 && notLead.includes(leadBlock);
    return collisionDetected;
  }

  render() {
    let blocks: JSX.Element[] = [];
    for (let i = 0; i < this.props.blockCount; i++) {
      blocks.push(
        <div
          key={i}
          className="snake-block"
          style={{
            display: !!this.state.positions[i] ? 'block' : 'none',
            transform: `translate(${this.state.positions[i]})`
          }}
        />
      );
    }
    return blocks;
  }
}
