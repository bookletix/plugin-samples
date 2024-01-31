-- main function
function main()
    local isCorrect = true
    local message = "You did a great job!"
    local items = bx_state.component["private"].items
    local answers = bx_state.request.answers

    if not answers or next(answers) == nil then
        return false, "Answer is required"
    end

    for key, value in pairs(answers) do
        if not value or value == "" then
            return false, "Answer is required"
        end

        local correctAnswer = items[key]
        if correctAnswer then
            correctAnswer = string.upper(correctAnswer)
            value = string.upper(value)

            if correctAnswer ~= value then
                return false, "Sorry but that's not the right answer, try again"
            end
        end
    end

    return isCorrect, message
end