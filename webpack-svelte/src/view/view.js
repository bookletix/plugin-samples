import "../style.css"

import View from './view.svelte';

const app = new View({
    target: document.getElementById("root"),
    props: {
        name: 'world'
    }
});

export default app;