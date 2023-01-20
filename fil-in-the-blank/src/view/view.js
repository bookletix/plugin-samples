import {Fragment, h, render, Component, createRef}  from "preact";
import {PreactHTMLConverter} from 'preact-html-converter';
import {isNullOrUndefined} from "../helper";
import { remove, isNil } from 'lodash-es';

import "../style.css";

class View extends Component {
    constructor(props) {
        super(props);
        this.bxState = $_bx.getState();

        this.state = {
            showTags: this.bxState.showTags,
            answers: this.bxState.answers,
            jsx: null,
            tags: this.bxState.tags
        };
    }

    componentDidMount() {
        let jsx = PreactHTMLConverter().convert($_bx.get("template"))
        {
            this.prepareBuildJSX(jsx);
        }
        this.setState({jsx: jsx});

        // sync local state with global component state
        $_bx.event().on("before_submit", (v) => {
            v.state.answers = this.state.answers;
            v.state.tags = this.state.tags;
        });
    }

    onInputHandler(id, e) {
        let answers = {...this.state.answers}
        answers[id] = e.target.value;

        this.setState({answers: answers})
    }

    clickOnInputHandler(id, e) {
        let val = this.state.answers[id];
        if (!isNil(val) && val.length > 0) {
            {
                let tags = [...this.state.tags]
                tags.push(val + "@" + id)

                this.setState({tags: tags})
            }

            {
                let answers = {...this.state.answers}
                answers[id] = null;

                this.setState({answers: answers})
            }

            document.getElementById(id).value = ""
        }
    }

    getTagName(tag) {
        if (!isNullOrUndefined(tag)) {
            let arr = tag.split('@');
            if (arr.length > 0) {
                return arr[0];
            }
            return tag
        }
        return ""
    }

    stageInput() {
        let curInp = null
        let inps = document.getElementsByTagName("input");
        for (let i = 0; i < inps.length; i++) {
            let inp = inps[i];
            if (inp.value === "") {
                curInp = inp
                break
            }
        }
        return curInp
    }

    onTagHandler(tag) {
        let tags = this.state.tags
        for (let i = 0; i < this.state.tags.length; i++) {
            remove(tags, function(n) {
                return n === tag;
            });
        }
        this.setState({tags: tags});

        let stageInput = this.stageInput();
        if (!isNullOrUndefined(stageInput)) {
            let id = stageInput.getAttribute("id");
            let tagName = this.getTagName(tag);

            let answers = {...this.state.answers}
            answers[id] = tagName;

            this.setState({answers: answers})

            stageInput.value = tagName;
            stageInput.style.width = tagName.length + "ch";
        }
    }

    prepareBuildJSX(nodes) {
        let answers = {}

        const findNode = (nodes) => {
            if (nodes.length > 0) {
                for (let i = 0; i < nodes.length; i++) {
                    let el = nodes[i];

                    if (!isNullOrUndefined(el.type) && el.type === "input") {
                        if (!isNullOrUndefined(el.props)) {
                            if (typeof el.props === 'object' &&
                                !Array.isArray(el.props)) {
                                if (!isNullOrUndefined(el.props.id)) {
                                    let val = "";
                                    if (!isNullOrUndefined(this.state.answers) && !isNullOrUndefined(this.state.answers[el.props.id])) {
                                        val = this.state.answers[el.props.id];
                                    }

                                    let jsxInput = h('input', {
                                        id: el.props.id,
                                        className: el.props.class,
                                        disabled: $_bx.isCorrect() || this.state.showTags,
                                        value: val,
                                        style: el.props.style,
                                        onInput: this.onInputHandler.bind(this, el.props.id)
                                    });
                                    if (this.state.showTags) {
                                        nodes[i] = h('div',
                                            {style: "display:inline-block; position:relative;"},
                                            jsxInput,
                                            h('div',
                                                {
                                                    style: "position:absolute; left:0; right:0; top:0; bottom:0; cursor:pointer;",
                                                    onclick: this.clickOnInputHandler.bind(this, el.props.id)
                                                }
                                            )
                                        )
                                    } else {
                                        nodes[i] = jsxInput
                                    }

                                    answers[el.props.id] = "";
                                }
                            }
                        }
                    }
                    if (!isNullOrUndefined(el.props)) {
                        if (Array.isArray(el.props.children)) {
                            findNode(el.props.children);
                        }
                    }
                }
            }
        }
        {
            findNode(nodes);
        }

        if (isNil(this.state.answers)) {
            this.setState({answers: answers})
        }
    }

    render() {
        let showTags = this.bxState.showTags;

        return (
            <Fragment>
                <div className={"box"}>
                    {this.state.jsx}
                </div>
                <ul className={(!showTags) ? "display-none" : "" + " tags-view"}>
                    {Array.apply(0, this.state.tags).map((tag, i) => {
                        return <li className={"tag-view"}
                                   onClick={this.onTagHandler.bind(this, tag)}>{this.getTagName(tag)}</li>;
                    })}
                </ul>
            </Fragment>
        );
    }
}

render(<View />, document.querySelector("#root"));