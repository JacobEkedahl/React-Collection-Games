import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



class Game extends React.Component {
    doSomething() {
        
    }

    render() {
        return (
            <div>
                <h1>
                    Jacob
                </h1>
                <p>
                    Hej hur är lagets
                </p>
            </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById("root"));