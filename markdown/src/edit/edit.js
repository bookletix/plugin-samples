import {Fragment, h, render, Component, createRef} from "preact";
import createDOMPurify from 'dompurify';
import {marked} from 'marked';
import * as EasyMDE from 'easymde';

import "./easymde.min.css"
import "../style.css";

class Edit extends Component {

    constructor(props) {
        super(props);

        this.state = $_bx.getState();
        this.ref = createRef();
    }

    componentDidMount() {
        const editor = new EasyMDE({
            autofocus: true,
            element: this.ref.current,
            //hideIcons: ["guide", "heading", "image"],
            hideIcons: ["side-by-side", "image", "fullscreen", "guide", "link"],
            lineWrapping: false,
            maxHeight: "200px",
            tabSize: 2,
            placeholder: "Type here...",
            renderingConfig: {
                singleLineBreaks: false,
                codeSyntaxHighlighting: true,
            },
            showIcons: ["code", "table", "preview"]
        });

        editor.value(this.state.mdStatement);
        const sanitize = this.sanitize

        /**
         * register event before save
         */
        $_bx.event().on("before_save_state", (v) => {
            v.state.mdStatement = editor.value()
            v.state.htmlStatement = sanitize(v.state.mdStatement)
        });
    }

    sanitize(mdStatement) {
        const DOMPurify = createDOMPurify(window);
        return DOMPurify.sanitize(marked.parse(mdStatement), {
            ALLOWED_TAGS: ['b', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'mark', 'hr', 'i', 'ul', 'li', 'p',
                'br', 'pre', 'code', 'blockquote', 'table', 'tr', 'td', 'th', 'thead', 'tbody'],
            KEEP_CONTENT: true
        });
    }

    render() {
        return (
            <Fragment>
                <label class="bx-form-label">Markdown code</label>
                <div class="control">
                    <textarea ref={this.ref} class="bx-form-textarea" placeholder="Enter some text."></textarea>
                </div>
            </Fragment>
        )
    }
}

render(<Edit />, document.querySelector("#root"));