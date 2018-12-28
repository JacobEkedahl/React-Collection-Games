import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const words = ['polly', 'mom', 'cat', 'mouse', 'dog', 'lover', 'no', 'unthinkable']
var currentTick = 0

class Healthbar extends React.Component {
    renderHealth = (i) => {
        return (
            <div
                key={i}
                className={this.props.canStart ? "Health" : "Hidden"}

                style={{
                    width: this.props.width,
                }}>
            </div>
        )
    }

    createHealthbar = () => {
        let h = []
        for (let i = 0; i < this.props.lives; i++) {
            h.push(this.renderHealth(i))
        }

        return h
    }

    render() {
        return (
            <div className={this.props.canStart ? "Healthbar" : "Hidden"}
            >
                {this.createHealthbar()}
            </div>
        )
    }
}
class Words extends React.Component {
    renderWord = (word, i) => {
        return (
            <div
                className="Word"
                key={i}
                style={{
                    left: this.props.x[i],
                    top: this.props.y[i],
                }}>
                {word}
            </div>
        )
    }

    createWords = () => {
        let w = []
        for (let i = 0; i < this.props.words.length; i++) {
            w.push(this.renderWord(this.props.words[i], i))
        }

        return w
    }

    render() {
        return (
            <div>
                {this.createWords()}
            </div>
        )
    }
}
class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            value: 'Begin typing',
            allWords: [],
            currentWords: [],
            wordsX: [],
            wordsY: [],
            points: 0,
            generatewordInterval: 100,
            speed: 50,
            lives: 3,
            currentInterval: 100,
            widthHealth: 198,
            canStart: false,
            isStarted: false
        };
    }

    componentDidMount() {
        this.setState({
            allWords: words,
        })
        this.init()
    }

    init = () => {
        //cancel current thread, how?

        this.setState({
            value: 'Begin typing',
            canStart: true,
            isStarted: false,
            currentWords: [],
            wordsX: [],
            wordsY: [],
            points: 0,
            generatewordInterval: 100,
            speed: 50,
            lives: 3,
            currentInterval: 100,
        })
    }

    generateWords = () => {
        clearInterval(this.intervalId)
        this.intervalId = setInterval(this.genWords, this.state.generatewordInterval);
    }

    start = () => {
        this.setState({
            isStarted: true
        })

        clearInterval(this.intervalId)
        this.intervalId = setInterval(this.play, this.state.speed);
    }

    genWords = () => {
        //get a random word
        const randIndex = Math.floor(Math.random() * this.state.allWords.length);
        const newWord = this.state.allWords[randIndex]
        let newCurrent = this.state.currentWords.slice()
        newCurrent.push(newWord)

        //get random X position
        const width = newWord.length * 20
        const maxX = 600 - width
        const randX = Math.floor(Math.random() * maxX)
        let newX = this.state.wordsX.slice()
        newX.push(randX);

        //generate word outside of app
        let newY = this.state.wordsY.slice();
        newY.push(-50);

        this.setState({
            currentWords: newCurrent,
            wordsX: newX,
            wordsY: newY,
        })
    }

    getIndexOfWordsOutside = () => {
        let wordsOutside = []
        let newY = this.state.wordsY.slice()
        for (let i = 0; i < newY.length; i++) {
            if (newY[i] + 1 > 550) {
                wordsOutside.push(i)
            }
        }

        return wordsOutside;
    }

    removeWordsOutsideBounds = (indexes) => {
        indexes.forEach(element => {
            this.removeEntry(element);
        });

        this.setState({
            lives: this.state.lives - indexes.length,
        })
    }

    move = () => {
        let newY = this.state.wordsY.slice()
        for (let i = 0; i < newY.length; i++) {
            newY[i] += 1
        }

        this.setState({
            wordsY: newY,
        })
    }

    /*
    this.setState({
        currentInterval: getRandomInterval(this.state.generatewordInterval),
    })*/
    play = () => {
        //generate words at a certain interval
        currentTick += 1
        if (currentTick === this.state.currentInterval) {
            currentTick = 0
            this.genWords()
        }

        const indexes = this.getIndexOfWordsOutside()
        if (indexes.length > 0) {
            this.removeWordsOutsideBounds(indexes);
        }
        //if lost then go back to start state
        if (this.state.lives <= 0) {
            clearInterval(this.intervalId);
            this.init();
            return;
        }

        this.move();
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
        if (this.state.currentWords.includes(val)) {
            return true
        }
        return false
    }

    removeEntry = (index) => {
        const newCurrent = removeword(this.state.currentWords, index);
        const newX = removeword(this.state.wordsX, index);
        const newY = removeword(this.state.wordsY, index);

        this.setState({
            currentWords: newCurrent,
            wordsX: newX,
            wordsY: newY,
        })
    }

    handleStart = () => {
        if (this.state.canStart) {
            this.start()
        }
    }

    handleMatch = (val) => {
        //add point, remove word from current words
        this.removeEntry(this.state.currentWords.indexOf(val))

        this.setState({
            points: this.state.points + 1,
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

    handleFocused = () => {
        this.clear();
    }

    render() {
        return (
            <div
                className="Game"
                onClick={this.handleStart}
                onKeyPress={this.handleKey}
                style={{
                    width: 600,
                    height: 600,
                }}>

                <Healthbar
                    lives={this.state.lives}
                    width={this.state.widthHealth}
                    canStart={this.state.isStarted}
                ></Healthbar>

                <Words
                    x={this.state.wordsX}
                    y={this.state.wordsY}
                    words={this.state.currentWords}
                >
                </Words>

                <div className={this.state.isStarted ? "Hidden" : "Intro"}>
                    Click to start
                </div>

                <div className="WrapperWriteBar">
                    <input
                        className="WriteBar"
                        onChange={this.handleInput}
                        onClick={this.handleFocused}
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

function removeword(arr, indexOfWord) {
    let newCurrent = arr.slice(0, indexOfWord)
        .concat(arr.slice(indexOfWord + 1, arr.length))
    return newCurrent
}

function getRandomInterval(current) {
    let newInterval = Math.floor(Math.random() * current);
    return newInterval
}

ReactDOM.render(<Game />, document.getElementById('root'));