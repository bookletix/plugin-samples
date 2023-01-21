import "../style.css"

import Edit from './edit.svelte';

const app = new Edit({
    target: document.getElementById("root"),
    props: {
        name: 'world'
    }
});

export default app;