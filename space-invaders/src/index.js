import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//alien
//aliens
//game
//spaceship
//bullet

class Player extends React.Component {

}
class Game extends React.Component {
    constructor() {
        super()
        this.state = {
            playerX: 300,
            width: window.innerWidth * 0.35,
        }
    }

    handleMovement = (e) => {
        let realPos = Math.floor(e.clientX - this.state.width);

        //constraining player inside the game window, playerwidth = 50, gamewidth = 600
        if (realPos <= 1) {
            realPos = 1;
        } else if (realPos + 50 >= 583) {
            realPos = 583 - 50;
        }

        this.setState({
            playerX: realPos,
        })
    }

    handleClick = () => {
        console.log("Hi")
    }

    handleResize = () => {
        this.setState({
            width: window.innerWidth * 0.35,
        })
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    render() {
        return (
            <div className="Wrapper"
                onMouseMove={this.handleMovement}>
                <div
                    className="Game"
                    onClick={this.handleClick}>
                    <div className="Aliens">
                        <div className="Alien">
                            Hi
                </div>
                    </div>

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

ReactDOM.render(<Game />, document.getElementById('root'));
