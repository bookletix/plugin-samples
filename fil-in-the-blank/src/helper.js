export function debounce(func, wait, immediate) {
    let timeout;

    return function () {
        const context = this, args = arguments;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export const isNullOrUndefined = value => {
    return value === null || value === undefined
}

export function buildID() {
    return '_item' + Math.random().toString(36).substr(2, 9);
}

export function clear(html) {
    let textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
}

export function stripHtml(html) {
    html = html.replace(/<br>/g, "$br$");
    html = html.replace(/(?:\r\n|\r|\n)/g, '$br$');
    html = html.replace(" ", '$space$');
    html = html.replace(/ /g, '$space$');
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    html = tmp.textContent || tmp.innerText;
    html = html.replace(/\$br\$/g, "<br>");
    html = html.replace(/\$space\$/g, "&nbsp;");
    return html;
}