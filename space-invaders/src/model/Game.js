import React from 'react';
import Bullets from './Bullets';

var total_bullets = 0;
class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            playerX: props.width / 2 - (props.playerW / 2),
            xPos: window.innerWidth,
            shots: [],
            dist_to_move: 10,
            isStarted: false,
            speed: 10,
        }
    }

    start = () => {
        this.setState({
            isStarted: true
        })

        clearInterval(this.intervalId)
        this.intervalId = setInterval(this.play, this.state.speed);
    }

    moveBullets = () => {
        let newShots = this.state.shots.slice();
        
        newShots.forEach(element => {
            element.move();
        });

        this.setState({
            shots: newShots,
        })
    }

    play = () => {
        this.moveBullets();
    }

    handleMovement = (e) => {
        let realPos = Math.floor(e.clientX - this.state.xPos) - (this.props.playerW / 2);

        //constraining player inside the game window
        if (realPos <= 1) {
            realPos = 1;
        } else if (realPos + this.props.playerW >= (this.props.width - 1)) {
            realPos = ((this.props.width - 1) - this.props.playerW);
        }

        this.setState({
            playerX: realPos,
        })
    }

    handleClick = () => {

        //shooting
        const xPos_bullet = this.state.playerX + (this.props.playerW / 2)
        const yPos_bullet = this.props.height - (this.props.playerH + 25);

        let newShots = this.state.shots.slice();
        const id = total_bullets;
        total_bullets += 1;
        newShots.push(
            {
                i: id, x: xPos_bullet, y: yPos_bullet, w: 5, h: 10, speed: this.state.dist_to_move,
                move: function () {
                    this.y -= this.speed;
                }
            }
        )

        this.setState({
            shots: newShots,
        })


    }

    setSize = () => {
        const center = (window.innerWidth - this.props.width) / 2
        this.setState({
            xPos: center,
        })
    }

    handleResize = () => {
        this.setSize();
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
        this.setSize();
        this.start();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    render() {
        return (
            <div className="Wrapper"
                onMouseMove={this.handleMovement}
                onClick={this.handleClick}>
                <div
                    className="Game"
                    style={{
                        width: this.props.width,
                        height: this.props.height,
                        left: this.state.xPos,
                    }}
                >
                    <div className="Aliens">
                        <div className="Alien">

                        </div>
                    </div>

                    <Bullets bullets={this.state.shots} />

                    <div className="Player"
                        style={{
                            left: this.state.playerX,
                        }}>
                    </div>
                </div>
            </div>
        )
    }
}

export default Game;