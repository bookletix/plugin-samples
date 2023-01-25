import { h, render, Component, createRef} from "preact";
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import go from 'highlight.js/lib/languages/go';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('go', go);

class Highlight extends Component {
    constructor(props) {
        super(props);
        this.nodeRef = createRef();
    }

    componentDidMount() {
        this.highlight();
    }

    componentDidUpdate() {
        this.highlight();
    }

    highlight = () => {
        if (this.nodeRef) {
            const nodes = this.nodeRef.current.querySelectorAll('pre code');
            nodes.forEach((node) => {
                hljs.highlightElement(node);
            });
        }
    }

    render() {
        return (
            <div ref={this.nodeRef} ><pre><code className={'language-' + (this.props.language)? this.props.language:'javascript'}>{this.props.children}</code></pre></div>
        );
    }
}

export default Highlight;