import { h, render, Component, createRef} from "preact";
import hljs from 'highlight.js/lib/core';

import javascript from 'highlight.js/lib/languages/javascript';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import basic from 'highlight.js/lib/languages/basic';
import typescript from 'highlight.js/lib/languages/typescript';
import sql from 'highlight.js/lib/languages/sql';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import bash from 'highlight.js/lib/languages/bash';
import html from 'highlight.js/lib/languages/bash';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/xml';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import java from 'highlight.js/lib/languages/java';
import python from 'highlight.js/lib/languages/python';
import lua from 'highlight.js/lib/languages/lua';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c', c);
hljs.registerLanguage('basic', basic);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('sql', typescript);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('php', php);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('html', html);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('java', java);
hljs.registerLanguage('python', python);
hljs.registerLanguage('lua', lua);

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
            <div ref={this.nodeRef} ><pre><code>{this.props.children}</code></pre></div>
        );
    }
}

export default Highlight;