import * as React from "react";
import * as ReactDOM from "react-dom";
import "./edit.css";

declare function require(path: string): any;

function App() {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const onCreate = () => {
        const count = Number(inputRef.current?.value || 0);
    };

    const onCancel = () => {
    };

    return (
        <main>
            <header>
                <img src={require("../logo.svg")} />
                <h2>Edit Rectangle Creator</h2>
            </header>
            <section>
                <input id="input" type="number" min="0" ref={inputRef} />
                <label htmlFor="input">Rectangle Count</label>
            </section>
            <footer>
                <button className="brand" onClick={onCreate}>
                    Foo
                </button>
                <button onClick={onCancel}>Cancel</button>
            </footer>
        </main>
    );
}

ReactDOM.render(<App />, document.getElementById("react-page"));