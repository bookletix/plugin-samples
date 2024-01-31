-- main function
function main()
    local isCorrect = true
    local message = "You did a great job!"

    local options = bx_state.component.options
    local answer = bx_state.request.answer

    if not answer then
        return false, "Answer is required"
    end

    answer = answer + 1

    if options[answer] == nil then
        return false, "Answer is invalid"
    end

    if options[answer].isCorrect then
        isCorrect = true
        message = "You did a great job!"
    else
        isCorrect = false
        if not options[answer].explanation or options[answer].explanation == nil then
            message = "Sorry, you are wrong."
        else
            message = options[answer].explanation
        end
    end

    return isCorrect, message
end