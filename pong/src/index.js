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
                <Brick className="Brick"></Brick>
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
            <div className="Ball"></div>
        );
    }
}

class Player extends React.Component {
    render() {
        return (
            <div className="Player"></div>
        );
    }
}


class Game extends React.Component {
    render() {
        return (
            <div className="Game">
                <Bricks></Bricks>
                <Ball></Ball>
            </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById("root"));