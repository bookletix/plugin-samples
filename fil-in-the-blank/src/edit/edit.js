import {Fragment, h, render, Component, createRef} from "preact";
import {debounce, buildID, clear, stripHtml, isNullOrUndefined} from '../helper';
import "../style.css";

class Edit extends Component {
    constructor(props) {
        super(props);
        this.bxState = $_bx.getState();
        this.ref = createRef();
        this.tRef = createRef();
        this.state = {
            tabs: ["Main", "Settings"],
            currentTab: 0,
            selected: "",
            enabled: true,
            doucleckicked: false,
            dismissMouseUp: 0,
            sel: null,
            showTags: this.bxState.showTags,
            answers: [],
            tmp: {},
            position: {
                top: 0,
                left: 0
            },
        };
    }

    componentDidUpdate() {
        // sync tmp with answers
        Object.keys(this.state.answers).map((id, i) => {
            if (isNullOrUndefined(this.state.tmp[id])) {
                this.state.tmp[id] = this.state.answers[id];
                this.setState({tmp: this.state.tmp});
            }
        });
    }

    componentDidMount() {
        if (!isNullOrUndefined(this.bxState.private)) {
            this.setState({answers: !isNullOrUndefined(this.bxState.private.items)? this.bxState.private.items: [] });
        }

        // sync local state with global component state
        $_bx.event().on("before_save_state", (v) => {
            v.state.template = this.ref.current.innerHTML;
            v.state.private.items = this.state.answers;
            v.state.showTags = this.state.showTags;

            // set tags
            if (this.state.showTags) {
                let tags = [];
                for (let aid in this.state.answers) {
                    tags.push(this.state.answers[aid] + "@" + aid)
                }

                let currentIndex = tags.length, randomIndex;
                while (currentIndex !== 0) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;
                    [tags[currentIndex], tags[randomIndex]] = [
                        tags[randomIndex], tags[currentIndex]];
                }

                v.state.tags = tags;
            } else {
                v.state.tags = [];
            }
        });
    }

    onPaste(event) {
        let paste = (event.clipboardData || window.clipboardData).getData('text/html');
        {
            const selection = window.getSelection();
            if (!selection.rangeCount) return false;
            selection.deleteFromDocument();

            let inText = document.createElement('div');
            inText.innerHTML = stripHtml(clear(paste));
            selection.getRangeAt(0).insertNode(inText);
        }

        event.preventDefault();
    }

    mouseEvent() {
        if (!this.state.enabled) {
            return false;
        }

        let t = '';

        if (window.getSelection) {
            t = window.getSelection().toString();
            this.setState({sel: window.getSelection()});
        } else if (document.selection && document.selection.type !== 'Control') {
            t = document.selection.createRange().text;
            this.setState({sel: document.selection});
        }

        if (!t || !t.trim().length) {
            return false;
        }

        const r = window.getSelection().getRangeAt(0);

        let gap = 8
        const {top: elTop, left: elLeft, height: elHeight, width: elWidth} = r.getBoundingClientRect();
        const {width: tooltipWidth, height: tooltipHeight} = this.tRef.current.getBoundingClientRect();

        let correctedLeft = elLeft + elWidth / 2 - tooltipWidth / 2;
        let correctedTop = elTop - gap - tooltipHeight;

        this.setState({position: {top: correctedTop, left: correctedLeft}});
        this.setState({selected: t});
    }

    clearSelection() {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.selection) {
            document.selection.empty();
        }
    }

    onScroll() {
        this.clearSelection();
        this.setState({selected: ""});
    }

    onMouseDown() {
        this.clearSelection();
        this.setState({selected: ""});
    }

    deleteTag(id) {
        let val = this.state.answers[id];
        let inputObj = document.getElementById(id);
        inputObj.replaceWith(document.createTextNode(val));

        delete this.state.answers[id];
        this.setState({answers: this.state.answers});
    }

    onMouseUp() {
        debounce(() => {
            if (this.state.doucleckicked) {
                this.setState({doucleckicked: false, dismissMouseUp: this.state.dismissMouseUp + 1});
            } else if (this.state.dismissMouseUp > 0) {
                this.setState({dismissMouseUp: this.state.dismissMouseUp - 1})
            } else {
                this.mouseEvent();
            }
        }, 100)();
    };

    onClickHandler() {
        let id = buildID();
        let range;

        if (this.state.sel !== null) {
            if (this.state.sel.rangeCount) {
                range = this.state.sel.getRangeAt(0);
                range.deleteContents();

                const input = document.createElement("input");
                {
                    input.id = id;
                    input.type = "text";
                    input.className = "blank-input";
                    input.style.width = this.state.selected.length + 2 + "ch";
                }
                range.insertNode(input);
                this.state.answers[id] = this.state.selected;
            }
        }
        this.clearSelection();
        this.setState({selected: ""});

        this.setState({answers: this.state.answers});
        this.setState({sel: null});
    }

    onDoubleClick(e) {
        e.stopPropagation();
        this.setState({doucleckicked: true});
        this.mouseEvent();
    }

    // sync text to answers
    syncContent() {
        let inputs = this.ref.current.getElementsByTagName("input");

        const existInputs = [];
        for (let i = 0; i < inputs.length; i++) {
            let id = inputs[i].getAttribute("id");
            existInputs[id] = true;
        }

        let answersCount = Object.keys(this.state.answers).length;
        let existInputsCount = Object.keys(existInputs).length;

        if (answersCount > existInputsCount) {
            Object.keys(this.state.answers).map((id, i) => {
                if (isNullOrUndefined(existInputs[id])) {
                    delete this.state.answers[id];
                    this.setState({answers: this.state.answers});
                }
            });
        } else if (existInputsCount > answersCount) {
            Object.keys(existInputs).map((id, i) => {
                if (isNullOrUndefined(this.state.answers[id])) {
                    this.state.answers[id] = this.state.tmp[id];
                    this.setState({answers: this.state.answers});
                }
            })
        }
    }

    render() {
        let selected = this.state.selected;
        let position = this.state.position;
        let answers = this.state.answers;

        return (
            <Fragment>
                <div className={"links"}>
                    {Array.apply(0, this.state.tabs).map( (name, i) => {
                        return <a className={"link-item" + (this.state.currentTab === i ? " active" : "") } onClick={() => this.setState({currentTab: i})} >{name}</a>
                    })}
                </div>

                <div className={"main"} style={ (this.state.currentTab !== 0?"display:none;":"") }>
                    <label className="bx-form-label">type text and highlight the desired word to set it as an addendum</label>
                    <div
                        ref={this.ref}
                        contentEditable={true}
                        role={"textbox"}
                        onMouseUp={this.onMouseUp.bind(this)}
                        onMouseDown={this.onMouseDown.bind(this)}
                        onKeyDown={this.syncContent.bind(this)}
                        onKeyUp={this.syncContent.bind(this)}
                        onScroll={this.onScroll.bind(this)}
                        onPaste={this.onPaste.bind(this)}
                        onDoubleClick={this.onDoubleClick}
                        className="bx-form-textarea sel max-h-80 h-80"
                        dangerouslySetInnerHTML={{__html: $_bx.get("template")}}>
                    </div>

                    <div ref={this.tRef} style={`transform: translate3d(${position.left}px, ${position.top}px, 0)`}
                         class={((selected.length) ? 'opacity-100 visible' : 'opacity-0 invisible') + ' has-tip-bottom absolute top-0 left-0 flex'}>
                        <div class={"wrap"}>
                            <button class="bx-btn-blue" onClick={this.onClickHandler.bind(this)}>Apply to blank</button>
                        </div>
                    </div>

                    <ul class={"tags"}>
                        {Object.keys(answers).map( (id, i) => {
                            return <li onClick={this.deleteTag.bind(this, id)} class={"tag"}>{answers[id]}</li>;
                        })}
                    </ul>
                </div>

                <div className={"main"} style={ (this.state.currentTab !== 1?"display:none;":"") }>

                    <div class="switch-container">
                        <div class="switch">
                            <label for="switch">
                                <input type="checkbox" id="switch" checked={this.state.showTags} onChange={() => this.setState({showTags: !this.state.showTags})} />
                                <span class="indicator"></span>
                                <span class="switch-label bx-form-label">Set the tagging mode to use</span>
                            </label>
                        </div>
                    </div>

                </div>

            </Fragment>
        );
    }
}

render(<Edit />, document.querySelector("#root"));