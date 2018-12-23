import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Brick extends React.Component {
    render() {
        return (
            <div className="Brick"></div>
        );
    }
}
class Bricks extends React.Component {
    createField = () => {
        let field = []
        for (let i = 0; i < 22; i++) {
            field.push(
                <Brick className="Brick" key={i}></Brick>
            )
        }

        return field
    }

    render() {
        return (
            <div className="Bricks">
                {this.createField()}
            </div>

        );
    }
}

class Ball extends React.Component {
    render() {
        return (
            <div
                className="Ball"
                style={{
                    position: 'relative',
                    left: this.props.x,
                    top: this.props.y,
                    width: this.props.w,
                    height: this.props.h
                }}
            ></div>
        );
    }
}

class Player extends React.Component {
    render() {
        return (
            <div
                className="Player"
                style={{
                    position: 'relative',
                    left: this.props.playerX,
                    top: this.props.playerY
                }}
            ></div>
        );
    }
}


class Game extends React.Component {
    constructor() {
        super()
        this.state = {
            playerX: (600 - 200) / 2,
            playerY: 350,
            ballW: 20,
            ballH: 20,
            ballX: 300,
            ballY: 200,
            ballDirectionY: 5,
            ballDirectionX: 0,
            speed: 150
        }
    };

    playButton = () => {
        clearInterval(this.intervalId)
        this.intervalId = setInterval(this.play, this.speed);
    }

    play = () => {
        //collision wall X
        if (isCollision1D(this.state.ballX, this.state.ballW, 0, 600)) {
            this.setState({
                ballDirectionX: this.state.ballDirectionX * (-1)
            })
        }

        //collision wall y
        if (isCollision1D(this.state.ballY, this.state.ballH, -200, 600)) {
            this.setState({
                ballDirectionY: this.state.ballDirectionY * (-1)
            })
        }

        this.setState({
            ballY: this.state.ballY + this.state.ballDirectionY,
            ballX: this.state.ballX + this.state.ballDirectionX
        })
    }

    move = (event) => {
        this.setState({
            playerX: event.clientX - 100
        });
    }

    componentDidMount() {
        this.playButton()
    }

    render() {
        return (
            <div className="Game"
                onMouseMove={(event) => this.move(event)}>
                <Bricks></Bricks>
                <Ball
                    x={this.state.ballX}
                    y={this.state.ballY}
                    w={this.state.ballW}
                    h={this.state.ballH}
                ></Ball>
                <Player
                    playerX={this.state.playerX}
                    playerY={this.state.playerY}
                ></Player>
            </div>
        );
    }
}

function isCollision1D(objectPos, objectSize, otherPos, otherY) {
    //if colliding against something x-axis then change dir
    if (objectPos === otherPos || (objectPos + objectSize) === (otherPos + otherY)) {
        return true
    }
    return false
}

ReactDOM.render(<Game />, document.getElementById("root"));