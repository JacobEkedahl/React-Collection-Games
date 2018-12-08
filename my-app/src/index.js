import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square"
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>

                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>

                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Move extends React.Component {
    handleClick = () => this.props.onClick(this.props.index)

    render() {
        return <button
            type='button'
            className={
                this.props.isActive ? 'active' : 'album'
            }
            onClick={this.handleClick}
        >
            <span>{this.props.name}</span>
        </button>
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    colAndRow: [null, null],
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            isNext: true,
            activeIndex: null,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const colAndRow = getColAndRow(i);

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.isNext ? 'X' : 'O';
        this.setState({
            history: history.concat([
                {
                    colAndRow: colAndRow,
                    squares: squares
                }
            ]),
            activeIndex: null,
            stepNumber: history.length,
            isNext: !this.state.isNext
        });
    }

    jumpTo(step) {
        this.setState({
            activeIndex: step,
            stepNumber: step,
            isNext: (step % 2) === 0
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares;
        const winner = calculateWinner(squares);

        const moves = history.map((step, move) => {
            const col = step.colAndRow[0];
            const row = step.colAndRow[1];
            const desc = move ?
                'Go to move #' + move + ' (' + col + ":" + row + ')' :
                'Got to game start';
            return (
                <li key={move}>
                    <Move
                        name={desc}
                        index={move}
                        isActive={this.state.activeIndex === move}
                        onClick={(step) => this.jumpTo(move)} />
                </li>
            )
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.isNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="gameBoard">
                    <Board
                        squares={squares}
                        onClick={i => this.handleClick(i)}
                    >
                    </Board>
                </div>

                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>

        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];


        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}

function getColAndRow(index) {
    const result = [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 2],
        [1, 2],
        [2, 2],
    ];

    return result[index];
}

ReactDOM.render(<Game />, document.getElementById("root"));