import * as React from 'react';
import '../styles/snake.css';
import { coordsType } from './SnakeGame';
import { isEqual, last } from 'lodash';

type SnakeProps = {
  gameRunning: boolean;
  coords: coordsType;
  foodCoords: coordsType;
  blockCount: number;
  collisionDetected: () => void;
  ateFood: (coords: coordsType[]) => void;
};

type SnakeState = {
  coordsList: coordsType[];
};

export class Snake extends React.Component<SnakeProps, SnakeState> {
  constructor(props: SnakeProps) {
    super(props);
    const { x, y } = props.coords;
    this.state = {
      coordsList: [{ x, y }]
    };
  }

  shouldComponentUpdate(nextProps: SnakeProps) {
    return !isEqual(this.props.coords, nextProps.coords);
  }

  componentWillReceiveProps(nextProps: SnakeProps) {
    if (!isEqual(this.props.coords, nextProps.coords)) {
      this.updateCoordsList(nextProps);
    }
  }

  private updateCoordsList = (props: SnakeProps) => {
    const { gameRunning, blockCount, coords } = props;
    if (!gameRunning) {
      return;
    }
    let coordsList = this.state.coordsList.slice();
    coordsList.push(coords);
    if (coordsList.length > this.props.blockCount) {
      coordsList = coordsList.slice(coordsList.length - blockCount, coordsList.length);
    }
    this.setState({ coordsList });
    this.checkIfAteFood(coordsList);
    this.checkForCollision(coordsList);
  }

  private checkIfAteFood = (coords: coordsType[]) => {
    if (isEqual(last(coords), this.props.foodCoords)) {
      this.props.ateFood(coords);
    }
  }

  private checkForCollision = (coords: coordsType[]) => {
    const headCoords = last(coords);
    const bodyCoords = coords.slice(0, coords.length - 1);
    const collisionDetected = bodyCoords.find((bodyCoord) => isEqual(bodyCoord, headCoords));
    if (collisionDetected) {
      this.props.collisionDetected();
    }
  }

  render() {
    let blocks: JSX.Element[] = [];
    for (let i = 0; i < this.props.blockCount; i++) {
      if (this.state.coordsList[i]) {
        const { x, y } = this.state.coordsList[i];
        blocks.push(
          <div
            key={i}
            className="snake-block"
            style={{ transform: `translate(${x * 100}%, ${y * 100}%)` }}
          />
        );
      }
    }
    return blocks;
  }
}
