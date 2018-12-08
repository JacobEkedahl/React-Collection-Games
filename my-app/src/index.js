import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Toggle from 'react-toggle';
import "react-toggle/style.css"

function Square(props) {
    return (
        <button
            className={
                props.winning ? "winning-square" : "square"}
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}
class Board extends React.Component {
    renderSquare(i) {
        const winning = this.props.winning[0] === i || this.props.winning[1] === i || this.props.winning[2] === i;
        return (
            <Square
                winning={winning}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    createBoard = () => {
        let board = []

        for (let i = 0; i < 3; i++) {
            let children = []

            for (let j = 0; j < 3; j++) {
                const index = (i * 3) + j
                children.push(this.renderSquare(index))
            }

            board.push(<div className="board-row">{children}</div>)
        }

        return board
    }

    render() {
        return (
            <div>
                {this.createBoard()}
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
        this.toggleChanged = this.toggleChanged.bind(this);
        this.state = {
            history: [
                {
                    move: 0,
                    colAndRow: [null, null],
                    squares: Array(9).fill(null)
                }
            ],
            winningSquares: [null, null, null],
            stepNumber: 0,
            isNext: true,
            activeIndex: null,
            sortAsc: true,
        };
    }

    markupWinningSquares = (winner) => {
        this.setState({
            winningSquares: winner.slice(0, 3),
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const colAndRow = getColAndRow(i);

        //do not give option to press already pressed squares or press when game is over
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.isNext ? 'X' : 'O';
        this.setState({
            history: history.concat([
                {
                    move: this.state.stepNumber,
                    colAndRow: colAndRow,
                    squares: squares
                }
            ]),
            activeIndex: null,
            stepNumber: history.length,
            isNext: !this.state.isNext
        });

        //markup the squares if won
        const winner = calculateWinner(squares);
        if (winner) {
            this.markupWinningSquares(winner);
        }
    }

    jumpTo(step) {
        this.setState({
            winningSquares: (step < this.state.history.length - 1) ? //are we clicking the last one
                [null, null, null] : //yes, reset markup
                this.state.winningSquares, //no, keep state
            activeIndex: step,
            stepNumber: step,
            isNext: (step % 2) === 0,
            history: this.state.history.slice(0, step + 1)
        })
    }

    toggleChanged(checked) {
        this.setState({
            sortAsc: !this.state.sortAsc,
        });
        this.render()
    }

    render() {
        const history = this.state.history.slice();
        const current = history[this.state.stepNumber];
        const squares = current.squares;
        const winner = calculateWinner(squares);

        const sorted = history.slice();
        if (!this.state.sortAsc) {
            sorted.reverse();
        }

        const moves = sorted.map((step, move) => {
            let index = move;
            const len = history.length;
            if (!this.state.sortAsc) {
                index = getReversedIndex(move, len);
            }
            const col = step.colAndRow[0];
            const row = step.colAndRow[1];
            const desc = index ?
                'Go to move #' + index + ' (' + col + ":" + row + ')' :
                'Go to game start';

            return (
                <li key={index}>
                    <Move
                        name={desc}
                        index={index}
                        isActive={this.state.activeIndex === index}
                        onClick={(step) => this.jumpTo(index)} />
                </li>
            )
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner[3];
        } else {
            status = 'Next player: ' + (this.state.isNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="gameBoard">
                    <Board
                        squares={squares}
                        onClick={i => this.handleClick(i)}
                        winning={this.state.winningSquares}
                    >
                    </Board>
                </div>

                <div className="game-info">
                    <div>{status}</div>
                    <Toggle
                        checked={this.state.sortAsc}
                        onChange={this.toggleChanged}
                    />
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
            return lines[i].concat(squares[a]);
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

function getReversedIndex(index, length) {
    return length - index - 1;
}

ReactDOM.render(<Game />, document.getElementById("root"));