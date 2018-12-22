import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Textfit } from 'react-textfit';

class AutoShrinkingText extends React.Component {
    render() {
        return (
            <Textfit mode="single" className={"calculator-display"}>
                {this.props.displayValue}
            </Textfit>
        );
    }
}

class Calculator extends React.Component {
    state = {
        value: null,
        displayValue: '0',
        waitingForOperand: true,
        operator: null
    }

    inputPercent() {
        const { displayValue } = this.state
        const value = parseFloat(displayValue)

        this.setState({
            displayValue: String(value / 100)
        })
    }

    toggleSign() {
        const { displayValue } = this.state

        this.setState({
            displayValue: displayValue.charAt(0) === '-' ? displayValue.substr(1) : '-' + displayValue
        })
    }

    clearDisplay() {
        const { displayValue } = this.state

        this.setState({
            displayValue: '0'
        })
    }

    inputDigit(digit) {
        const { displayValue, waitingForOperand } = this.state

        if (waitingForOperand) {
            this.setState({
                displayValue: String(digit),
                waitingForOperand: false
            })
        } else {
            this.setState({
                displayValue: displayValue === '0' ? String(digit) : displayValue + digit
            })
        }
    }

    inputDot() {
        const { displayValue, waitingForOperand } = this.state

        if (waitingForOperand) {
            this.setState({
                displayValue: '.',
                waitingForOperand: false
            })
        } else {
            if (displayValue.indexOf('.') === -1) {
                this.setState({
                    displayValue: displayValue + '.',
                    waitingForOperand: false
                })
            }
        }
    }

    performOperation(nextOperator) {
        const { displayValue, operator, value } = this.state
        const inputValue = parseFloat(displayValue)

        const operations = {
            '/': (prevValue, inputValue) => prevValue / inputValue,
            '*': (prevValue, inputValue) => prevValue * inputValue,
            '+': (prevValue, inputValue) => prevValue + inputValue,
            '-': (prevValue, inputValue) => prevValue - inputValue,
            '=': (prevValue, inputValue) => inputValue
        }

        if (value == null) {
            this.setState({
                value: inputValue
            })
        } else if (operator) {
            const currentValue = value
            const computedValue = operations[operator](currentValue, inputValue)

            this.setState({
                value: computedValue,
                displayValue: String(computedValue)
            })
        }

        this.setState({
            waitingForOperand: true,
            operator: nextOperator
        })
    }

    render() {
        return (
            <div className="calculator">
                <AutoShrinkingText 
                    displayValue = {this.state.displayValue}
                />
                <div className="calculator-keypad">
                    <div className="input-keys">
                        <div className="function-keys">
                            <button className="calculator-key key-clear" onClick={() => this.clearDisplay()}>AC</button>
                            <button className="calculator-key key-sign" onClick={() => this.toggleSign()}>±</button>
                            <button className="calculator-key key-percent" onClick={() => this.inputPercent()}>%</button>
                        </div>
                        <div className="digit-keys">
                            <button className="calculator-key key-0" onClick={() => this.inputDigit(0)}>0</button>
                            <button className="calculator-key key-dot" onClick={() => this.inputDot()}>.</button>
                            <button className="calculator-key key-1" onClick={() => this.inputDigit(1)}>1</button>
                            <button className="calculator-key key-2" onClick={() => this.inputDigit(2)}>2</button>
                            <button className="calculator-key key-3" onClick={() => this.inputDigit(3)}>3</button>
                            <button className="calculator-key key-4" onClick={() => this.inputDigit(4)}>4</button>
                            <button className="calculator-key key-5" onClick={() => this.inputDigit(5)}>5</button>
                            <button className="calculator-key key-6" onClick={() => this.inputDigit(6)}>6</button>
                            <button className="calculator-key key-7" onClick={() => this.inputDigit(7)}>7</button>
                            <button className="calculator-key key-8" onClick={() => this.inputDigit(8)}>8</button>
                            <button className="calculator-key key-9" onClick={() => this.inputDigit(9)}>9</button>
                        </div>
                    </div>
                    <div className="operator-keys">
                        <button className="calculator-key key-divide" onClick={() => this.performOperation('/')}>/</button>
                        <button className="calculator-key key-multiply" onClick={() => this.performOperation('*')}>*</button>
                        <button className="calculator-key key-subtract" onClick={() => this.performOperation('-')}>-</button>
                        <button className="calculator-key key-add" onClick={() => this.performOperation('+')}>+</button>
                        <button className="calculator-key key-equals" onClick={() => this.performOperation('=')}>=</button>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Calculator />,
    document.getElementById('root')
)