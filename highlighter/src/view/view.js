import { h, render, Component } from "preact";
import Highlight from './highlight';
import { Light } from './light';
import { Dark } from './dark';

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: $_bx.get("code"),
        };
    }

    componentDidMount() {
        setTimeout(() => {
            const css = $_bx.mode() === 'dark' ? Dark : Light;
            const styleEl = document.createElement("style");
            styleEl.textContent = css;
            document.head.appendChild(styleEl);
        }, 100); // Delay of 100 milliseconds
    }

    render() {
        return (
            <Highlight>{this.state.value}</Highlight>
        );
    }
}

render(<View />, document.querySelector("#root"));
