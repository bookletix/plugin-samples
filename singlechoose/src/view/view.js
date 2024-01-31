import { h, Component, render } from "preact";

import "./view.css";

class View extends Component {
    constructor() {
        super();
        this.state = {
            question: $_bx.get("question") || '',
            options: $_bx.get("options") || [],
            answer: $_bx.get("answer") || null,
        };
    }

    handleOptionSelect = (index) => {
        this.setState({ answer: index });
    };

    renderOptions() {
        return this.state.options.map((option, index) => (
            <div key={index} className="option-view">
                <input
                    type="radio"
                    name="answer"
                    className="option-radio"
                    checked={this.state.answer === index}
                    onChange={() => this.handleOptionSelect(index)}
                />
                <span
                    className="option-text"
                    onClick={() => this.handleOptionSelect(index)}
                >
                    {option.text}
                </span>
            </div>
        ));
    }

    componentDidMount() {
        // sync local state with global component state
        $_bx.event().on("before_submit", (v) => {
            v.state.answer = this.state.answer;
        });
    }

    render() {
        return (
            <div className="view-container" style={{ fontSize: '16px' }}>
                <h1 className="question-title">{this.state.question}</h1>
                <div className="options-container">
                    {this.renderOptions()}
                </div>
            </div>
        );
    }
}

render(<View />, document.querySelector("#root"));