import { h, Component, render } from "preact";

import "../style.css";

class View extends Component {
    constructor(props) {
        super(props);
        this.state = $_bx.getState();
    }
    render() {
        return (
            <article className="prose prose-lg prose-blue" dangerouslySetInnerHTML={{ __html: this.state.htmlStatement }} ></article>
        );
    }
}

render(<View />, document.querySelector("#root"));
