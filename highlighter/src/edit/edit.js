import {Fragment, h, render, Component} from "preact";

class Edit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: $_bx.get("code")
        };
    }

    onChange = (e) => {
        this.setState({ value: e.target.value });
    };

    componentDidMount() {
        /**
         * register event before save
         */
        $_bx.event().on("before_save_state", (v) => {
            v.state.code = this.state.value;
        });
    }

    render() {
        return (
            <Fragment>
                <label className={"bx-form-label"}>code</label>
                <div className={"control"}>
                    <textarea rows={12} className={"bx-form-textarea"} placeholder="Enter some code." value={this.state.value}
                              onChange={this.onChange}></textarea>
                </div>
            </Fragment>
        )
    }
}

render(<Edit />, document.querySelector("#root"));