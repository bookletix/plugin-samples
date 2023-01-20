import { h, render } from "preact";
import "./edit.css";

const Edit = () => {
    return <h1 className={"title"}>{$_bx.get("title")}</h1>;
};

render(<Edit />, document.querySelector("#root"));