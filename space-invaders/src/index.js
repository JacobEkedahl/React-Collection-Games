import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './model/Game.js'

//alien
//aliens
//game
//spaceship
//bullet

//settings
const width = 600
const height = 600
const playerWidth = 50
const playerHeight = 50

ReactDOM.render(
    <Game
        width={width}
        height={height}
        playerW={playerWidth}
        playerH={playerHeight}
    />, document.getElementById('root'));
