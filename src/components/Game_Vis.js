import { Loop, Stage, World, Body } from 'react-game-kit';
import React from 'react';

export default class Game_Vis extends React.Component {



  render() {
    return (
      <Loop>
        <Stage>
        <World>
        <Body args={[0,0,75,75]} ref={(b) => this.body = b.body }>

          </Body>
        </World>
        </Stage>
      </Loop>
    );
  }
}
