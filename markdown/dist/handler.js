/**
 * The main function of processing a student's answer.
 *
 * @param plugin
 * @returns {{isCorrect: boolean, message: string}}
 */
function AnswerHandler(plugin) {
    // current state of the plugin with access to hidden fields (ex. plugin.component.private)
    let currentState = plugin.component;

    // state changed by the user
    let userRequestState = plugin.request;

    let isCorrect = true;
    let message = "";

    // do login ... and set isCorrect variable

    return {isCorrect: isCorrect, message: message}
}