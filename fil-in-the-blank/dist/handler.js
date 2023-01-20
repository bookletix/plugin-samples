/**
 * The main function of processing a student's answer.
 *
 * @param state
 * @returns {{isCorrect: boolean, message: string}}
 */
function AnswerHandler(state) {
    var isCorrect = true
    var message = "You did a great job!"
    var items = state.component.private.items
    var answ = state.request.answers

    var size = function(obj) {
        var size = 0,
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    // check exist items state
    if (answ !== undefined) {
        if (size(answ) === 0)  {
            isCorrect = false
            message = "Answer is required"
        }
        for ( var key in answ ) {
            if (answ[key] === undefined || answ[key] == null) {
                isCorrect = false
                message = "Answer is required"
                break;
            }

            if (answ[key].length === 0) {
                isCorrect = false
                message = "Answer is required"
                break;
            }
            if (key in items) {
                if (items[key].toUpperCase().trim() !== answ[key].toUpperCase().trim()) {
                    isCorrect = false
                    message = "Sorry but that's not the right answer, try again"
                }
            }
        }
    } else {
        return {isCorrect: false, message: "Sorry but component is not correct"}
    }

    return {isCorrect: isCorrect, message: message}
}
