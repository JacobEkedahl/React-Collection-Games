import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const POS_X = 0
const POS_Y = 1
const MAX_SPEED = 8

class Brick extends React.Component {
    render() {
        return (
            <div
                className={
                    this.props.exist ? "Brick" : "Empty"
                }
                style={{
                    width: this.props.w,
                    height: this.props.h,
                }}
            >
            </div>
        );
    }
}

class Bricks extends React.Component {
    renderBrick = (i) => {
        return (
            <Brick
                key={i}
                exist={this.props.field[i]}
                w={this.props.w}
                h={this.props.h}>
            </Brick>
        )
    }

    createField = () => {
        let f = []
        for (let i = 0; i < this.props.field.length; i++) {
            f.push(this.renderBrick(i))
        }

        return f
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
            noBricks: 22,
            brickW: 49,
            brickH: 20,
            posBrick: Array(22).fill(Array(2).fill(null)),
            field: Array(22).fill(true),
            playerX: (600 - 200) / 2,
            playerY: 350,
            playerW: 200,
            playerH: 15,
            ballW: 20,
            ballH: 20,
            ballX: 290,
            ballY: 300,
            ballDirectionY: -5,
            ballDirectionX: 0,
            speed: 10,
        }
    };

    componentDidMount() {
        this.setState({
            posBrick: initBricks(this.state.noBricks, this.state.brickW,
                this.state.brickH, 595)
        })
        this.playButton()
    }

    initGame = () => {
        this.setState({
            ballX: 290,
            ballY: 300,
            ballDirectionY: -5,
            ballDirectionX: 0,
            speed: 10,
            field: Array(this.state.noBricks).fill(true)
        })
    }

    playButton = () => {
        clearInterval(this.intervalId)
        this.intervalId = setInterval(this.play, this.state.speed);
    }

    removeSquare = (i) => {
        const newField = this.state.field.slice()
        newField[i] = false

        this.setState({
            field: newField
        })
    }

    changeDirection = (goBack, goSide) => {
        let newDirY = this.state.ballDirectionY
        let newDirX = this.state.ballDirectionX

        switch (goBack) {
            case 1:
                newDirY = Math.abs(newDirY)
                break;
            default:
                newDirY = Math.abs(newDirY) * (-1)
        }

        switch (goSide) {
            case 1:
                newDirX = 2
                break;
            case 2:
                newDirX = -2
                break;
            default: break;
        }

        this.setState({
            ballDirectionY: newDirY,
            ballDirectionX: newDirX
        })
    }

    play = () => {
        //collision wall X
        if (isCollisionX(this.state.ballX, this.state.ballW, 0, 595)) {
            this.setState({
                ballDirectionX: this.state.ballDirectionX * (-1)
            })
        }

        //collision wall y
        if (isCollisionY(this.state.ballY, this.state.ballH, -200, 600)) {
            this.setState({
                ballDirectionY: this.state.ballDirectionY * (-1)
            })

            //ball hit back = game over
            if (this.state.ballDirectionY < 0) {
                this.initGame()
            }
        }

        //collision player y
        if (isCollisionY(this.state.ballY, this.state.ballH,
            this.state.playerY, this.state.playerH + 10)) {

            //check if it is within the x-axis
            if ((this.state.ballX < this.state.playerX + this.state.playerW) &&
                this.state.ballX + this.state.ballW > this.state.playerX) {
                let fact = (getFactorForXMovement(this.state.ballX, this.state.ballW,
                    this.state.playerX, this.state.playerW))

                //Ball hits center or reach max speed
                if (fact === 1 || Math.abs(this.state.ballDirectionX + (fact * MAX_SPEED)) > MAX_SPEED) {
                    fact = 0
                } else {
                    fact *= MAX_SPEED
                }

                this.setState({
                    ballDirectionY: this.state.ballDirectionY * (-1),
                    ballDirectionX: this.state.ballDirectionX + fact
                })
            }
        }

        //check if ball collides with brick
        let noHitBricks = 0
        for (let i = 0; i < this.state.posBrick.length; i++) {
            //check if brick exist first

            if (this.state.field[i]) {
                let goBack = 0 //do nothing

                //hitting bottom part of brick
                if (this.state.ballY <= (this.state.posBrick[i][POS_Y] + this.state.brickH) &&
                    this.state.ballY >= this.state.posBrick[i][POS_Y]) {
                    goBack = 1
                }

                //hitting top part of brick
                if ((this.state.ballY + this.state.ballH) >= this.state.posBrick[i][POS_Y] &&
                    (this.state.ballY + this.state.ballH) <= (this.state.posBrick[i][POS_Y] + this.state.brickH)) {
                    goBack = 2 //go back
                }

                if (goBack) {
                    let goSide = 0
                    //hitting side of tile - GO RIGHT
                    if (this.state.ballX <= this.state.brickW + this.state.posBrick[i][POS_X] &&
                        this.state.ballX >= this.state.brickW + this.state.posBrick[i][POS_X]) {
                        goSide = 1
                        //GO LEFT
                    } else if (this.state.ballX + this.state.ballW >= this.state.posBrick[i][POS_X] &&
                        this.state.ballX + this.state.ballW <= this.state.posBrick[i][POS_X]) {
                        goSide = 2
                    } else if (this.state.ballX < this.state.posBrick[i][POS_X] + this.state.brickW &&
                        this.state.ballX + this.state.ballW > this.state.posBrick[i][POS_X]) {
                        goSide = 3
                    }

                    if (goSide) {
                        this.changeDirection(goBack, goSide)
                        this.removeSquare(i)
                    }
                }
            } else {
                noHitBricks += 1
            }
        }

        //check if won
        if (noHitBricks === this.state.noBricks) {
            this.initGame()
        }

        this.setState({
            ballY: this.state.ballY + this.state.ballDirectionY,
            ballX: this.state.ballX + this.state.ballDirectionX
        })
    }

    move = (event) => {
        this.setState({
            //adjusting for center
            playerX: event.clientX - 100
        });
    }

    render() {
        return (
            <div className="Game"
                onMouseMove={(event) => this.move(event)}>
                <Bricks
                    field={this.state.field}
                    w={this.state.brickW}
                    h={this.state.brickH}
                ></Bricks>
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

//called when ball is hitting player
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

function initBricks(noBricks, width, height, widthGame) {
    const marginLeft = 1
    const marginTop = 1
    const border = 4

    const totalWidthBrick = width + marginLeft + border
    const bricksPerRow = Math.floor(widthGame / totalWidthBrick)
    let field = Array(noBricks).fill(Array(3).fill(null))

    for (let i = 0; i < noBricks; i++) {
        const removalFactor = Math.floor(i / bricksPerRow)
        const vars = Array(3).fill(null)

        vars[POS_X] = (i - (removalFactor * bricksPerRow)) *
            totalWidthBrick
        vars[POS_Y] = (removalFactor * (height + border + marginTop)) + marginTop - 195

        field[i] = vars
    }
    return field
}

ReactDOM.render(<Game />, document.getElementById("root"));