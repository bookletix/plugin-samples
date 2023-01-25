import { h, render, Component} from "preact";
import Highlight from './highlight'

import 'highlight.js/styles/github.css';

class View extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: $_bx.get("code")
        };
    }

    render() {
        return (
            <Highlight language={"go"}>{this.state.value}</Highlight>
        )
    }
}

render(<View />, document.querySelector("#root"));