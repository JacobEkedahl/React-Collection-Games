import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



class Game extends React.Component {
    doSomething() {

    }

    render() {
        return (
            <div className="Game">

                <div className="Bricks">
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                    <div className="Brick"></div>
                </div>

                <div className="Ball">
                    
                </div>

                <div className="Player">
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById("root"));