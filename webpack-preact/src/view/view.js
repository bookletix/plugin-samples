import { h, render } from "preact";

import "./view.css";

const View = () => {
    return <h1 className={"title"}>View -- {$_bx.get("title")}</h1>;
};

render(<View />, document.querySelector("#root"));