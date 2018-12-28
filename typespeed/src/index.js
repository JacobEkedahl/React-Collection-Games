import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const words = ['polly', 'mom', 'cat', 'mouse', 'dog', 'lover', 'no', 'unthinkable']
class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            value: 'Test',
            currentWords: {},
            points: 0,
        };
    }

    componentDidMount() {
        let firstCurrent = {}
        
        for (let i = 0; i < words.length ; i++) {
            firstCurrent[words[i]] = true
        }

        this.setState({
            currentWords: firstCurrent,
        })
    }

    handleInput = (e) => {
        this.setState({
            value: e.target.value,              
        })
    }

    clear = () => {
        this.setState({
            value: '',
        })
    }

    isMatch = (val) => {
        if (this.state.currentWords[val] === true) {
            return true
        } 
        return false
    }

    handleMatch = (val) => {
        //add point, remove word from current words

        /** TODO: COPY MAP AND REMOVE ELEMENT THEN RESET CURRENTWORDS */
        console.log('handle match')
        let newCurrent = this.state.currentWords
        newCurrent[val] =false

        this.setState({
            currentWords: newCurrent,
            points: this.state.points +1,
        })
    }

    handleKey = (e) => {
        if (e.key === 'Enter') {
            const val = this.state.value
            if (this.isMatch(val)) {
                this.handleMatch(val)
            }
            
            this.clear();
        }
    }

    render() {
        return (

            <div
                className="Game"
                onKeyPress={this.handleKey}
                style={{
                    width: 600,
                    height: 600,
                }}>

                <div className="WrapperWriteBar">
                    <input 
                        className="WriteBar"
                        onChange={this.handleInput}
                        value={this.state.value}
                    />  

                    <div className="Score">
                        {this.state.points}
                    </div>                      
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Game />, document.getElementById('root'));