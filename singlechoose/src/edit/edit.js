import {h, Component, render, createRef} from "preact";
import {Trash2} from "preact-feather/dist/icons/trash-2";

import "./edit.css";

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: $_bx.get("question") || '',
            options: $_bx.get("options") || []
        };

        this.optionsBlockRef = createRef();
        this.lastOptionRef = createRef();
    }

    handleQuestionChange = (event) => {
        this.setState({question: event.target.value});
    };

    handleOptionChange = (index, event) => {
        const options = [...this.state.options];
        options[index].text = event.target.value;
        this.setState({options});
    };

    handleCorrectChange = (index) => {
        const options = this.state.options.map((option, idx) => ({
            ...option,
            isCorrect: idx === index
        }));
        this.setState({options});
    };

    handleExplanationChange = (index, event) => {
        const options = [...this.state.options];
        options[index].explanation = event.target.value;
        this.setState({options});
    };

    addOption = () => {
        this.setState(
            {
                options: [...this.state.options, {text: '', isCorrect: false}]
            },
            () => {
                if (this.lastOptionRef.current) {
                    this.lastOptionRef.current.scrollIntoView({behavior: 'smooth'});
                }
            }
        );
    };

    deleteOption = (index) => {
        this.setState({
            options: this.state.options.filter((_, idx) => idx !== index)
        });
    };

    renderOption = (option, index) => {
        const isLastOption = index === this.state.options.length - 1;
        return (
            <div
                key={index}
                className="option-container"
                ref={isLastOption ? this.lastOptionRef : null}
            >
                <input
                    type="radio"
                    name="correctOption"
                    checked={option.isCorrect}
                    onChange={() => this.handleCorrectChange(index)}
                    className="option-radio"
                />
                <input
                    type="text"
                    value={option.text}
                    onChange={(event) => this.handleOptionChange(index, event)}
                    className="bx-form-input option-text"
                    placeholder="Enter option text"
                    style={{width: 'auto', maxWidth: '600px'}} // Adjust width here
                />
                {!option.isCorrect && (
                    <input
                        type="text"
                        placeholder="Explanation"
                        value={option.explanation || ''}
                        onChange={(event) => this.handleExplanationChange(index, event)}
                        className="bx-form-input option-explanation"
                        style={{width: 'auto', maxWidth: '900px'}} // Adjust width here
                    />
                )}
                <button className="delete-option" onClick={() => this.deleteOption(index)}>
                    <Trash2 size={16}/>
                </button>
            </div>
        );
    };

    validateOptions() {
        const { options } = this.state;
        return options.every(option => option.text && option.text.trim().length > 0);
    }

    componentDidMount() {
        $_bx.event().on("before_save_state", (v) => {
            if (this.state.options.length === 0) {
                $_bx.showErrorMessage("Please add at least one option");
                return;
            }

            if (this.state.options.filter((option) => option.isCorrect).length === 0) {
                $_bx.showErrorMessage("Please select a correct option");
                return;
            }

            if (this.state.options.filter((option) => option.isCorrect).length > 1) {
                $_bx.showErrorMessage("Please select only one correct option");
                return;
            }

            if (this.state.options.length > 10) {
                $_bx.showErrorMessage("Please add at most 10 options");
                return;
            }

            if (!this.validateOptions()) {
                $_bx.showErrorMessage("Please enter option text in all options");
                return;
            }

            if (this.state.options.length === 1) {
                $_bx.showErrorMessage("Please add at least two options");
                return;
            }

            v.state = this.state;
        });
    }

    render() {
        return (
            <div>
                <label className="bx-form-label">Enter the question</label>
                <input
                    type="text"
                    className="bx-form-input"
                    value={this.state.question}
                    onChange={this.handleQuestionChange}
                />
                <div className="options-block-mr">
                    <label className="bx-form-label">Options ({this.state.options.length})</label>
                    <div className="options-block" ref={this.optionsBlockRef}>
                        {this.state.options.map(this.renderOption)}
                    </div>
                    <div className="add-option">
                        {this.state.options.length < 10 && (
                            <button className="bx-btn-blue" onClick={this.addOption}>Add Option</button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

render(<Edit/>, document.querySelector("#root"));