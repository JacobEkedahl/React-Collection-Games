import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const POS_X = 0
const POS_Y = 1

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
        for (let i = 0; i < 44; i++) {
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
            noBricks: 44,
            brickW: 49,
            brickH: 20,
            posBrick: Array(44).fill(Array(2).fill(null)),
            field: Array(44).fill(true),
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
            speed: 10
        }
    };

    componentDidMount() {
        this.setState({
            posBrick: initBricks(this.state.noBricks, this.state.brickW,
                this.state.brickH, 595)
        })
        this.playButton()
    }

    playButton = () => {
        clearInterval(this.intervalId)
        this.intervalId = setInterval(this.play, this.state.speed);
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

        //check if ball collides with brick
        for (let i = 0; i < this.state.posBrick.length; i++) {
            //check if brick exist first

            if (this.state.field[i]) {
                if (isCollisionY(this.state.ballY, this.state.ballH,
                    this.state.posBrick[i][POS_Y], this.state.brickH)) {

                    if ((this.state.ballX < this.state.posBrick[i][POS_X] + this.state.brickW) &&
                        this.state.ballX + this.state.ballW > this.state.posBrick[i][POS_X]) {
                        let fact = getFactorForXMovement(this.state.ballX, this.state.ballW,
                            this.state.posBrick[i][POS_X], this.state.brickW)

                        let negation = 0
                        if ((this.state.ballDirectionX > 0 && fact < 0) ||
                            (this.state.ballDirectionX < 0 && fact > 0)) {
                            negation = this.state.ballDirectionX
                        }

                        const newField = this.state.field.slice()
                        newField[i] = false
                        let newDir = this.state.ballDirectionY

                        if (newDir < 0) {
                            newDir = newDir * (-1)
                        }

                        this.setState({
                            field: newField,
                            ballDirectionY: newDir,
                            ballDirectionX: this.state.ballDirectionX + fact - negation
                        })
                    }
                }
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

function initBricks(noBricks, width, height, widthGame) {
    const marginBot = -4
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
        vars[POS_Y] = (removalFactor * height) + marginTop - 160 + border

        field[i] = vars
    }
    return field
}

ReactDOM.render(<Game />, document.getElementById("root"));