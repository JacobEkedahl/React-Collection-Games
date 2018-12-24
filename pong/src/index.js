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
        for (let i = 0; i < 20; i++) {
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
                    left: this.props.x,
                    top: this.props.y,
                    width: this.props.w,
                    height: this.props.h
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
            playerW: 200,
            playerH: 15,
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
        if (isCollisionX(this.state.ballX, this.state.ballW, 0, 595)) {
            console.log('collsiion x')
            this.setState({
                ballDirectionX: this.state.ballDirectionX * (-1)
            })
        }

        //collision wall y
        if (isCollisionY(this.state.ballY, this.state.ballH, -200, 600)) {
            this.setState({
                ballDirectionY: this.state.ballDirectionY * (-1)
            })
        }

        //collision player y
        if (isCollisionY(this.state.ballY, this.state.ballH,
            this.state.playerY, this.state.playerH + 10)) {

            //check if it is within the x-axis
            //get center pos of player

            if ((this.state.ballX < this.state.playerX + this.state.playerW) &&
                this.state.ballX + this.state.ballW > this.state.playerX) {
                    let fact = getFactorForXMovement(this.state.ballX, this.state.ballW,
                                        this.state.playerX, this.state.playerW)
                    
                    let negation = 0
                    if ((this.state.ballDirectionX > 0 && fact < 0) ||
                        (this.state.ballDirectionX < 0 && fact > 0)) {
                        negation = this.state.ballDirectionX
                    }
                this.setState({
                    ballDirectionY: this.state.ballDirectionY * (-1),
                    ballDirectionX: this.state.ballDirectionX + fact - negation
                })
            }
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
                    x={this.state.playerX}
                    y={this.state.playerY}
                    w={this.state.playerW}
                    h={this.state.playerH}
                ></Player>
            </div>
        );
    }
}

function isCollisionY(objectPos, objectSize, otherPos, otherSize) {
    //if colliding against something x-axis then change dir
    if (objectPos === otherPos || (objectPos + objectSize) === (otherPos + otherSize)) {
        return true
    }
    return false
}

function isCollisionX(objectPos, objectSize, otherPos, otherSize) {
    //if colliding against something x-axis then change dir
    if (objectPos <= otherPos || (objectPos + objectSize) >= (otherPos + otherSize)) {
        return true
    }
    return false
}

//called when ball is hitting player or brick
function getFactorForXMovement(objectPos, objectSize, 
                               otherPos, otherSize) {
    //hitting middle wont change speed
    const otherCenter = otherSize / 2
    const objectCenter = objectSize / 2
    const diff = (objectPos + objectCenter) - (otherPos + otherCenter)
    
    if (diff === 0) {
        return 1
    } else {
        const factor = diff / otherCenter
        return factor
    }   
}

ReactDOM.render(<Game />, document.getElementById("root"));