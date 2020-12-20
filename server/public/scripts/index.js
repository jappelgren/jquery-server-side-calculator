$(document).ready(handleReady);

function handleReady() {
    $(document).on('click', '.operator-btn', assignOperator);
    $(document).on('click', '.number-btn', numberInput);
    $(document).on('click', '#equals-btn', createMathObj);
    $(document).on('click', '#clear-btn', clearInput);
    $(document).on('click', '.func-btn', funcSubmit);
    $(document).on('click', '#plus-minus', negativeToggle);
    $(document).on('click', '.memory-btn', memorySubmit);
    $(document).on('mousedown', '#solar-panel', fingerOverPanel);
    historyUpdate()
}

let operatorIn;
let mathObj = {};

let beforeRe = /.+?(?=\+|\-|\/|\*)/g;               //
let includingOperatorRe = /.+?(?<=\+|\-|\/|\*)/g;   // I spent a lot of time before bootcamp started messing with regular expressions.
let operatorRe = /\+|\-|\/|\*/g;                    // Happy to put that knowledge to use.  Also a huge shout out to regex101.com
let superscriptNegativeRe = /⁻/g;                   // 
let negativeRe = /-/g;                              //


//Assigns operator to function.  Replaces operator if one already exists.
function assignOperator() {
    operatorIn = $(this).data('btn');

    if (operatorRe.test($('.screen').val())) {
        $('.screen').val($('.screen').val().replace(operatorRe, `${operatorIn}`));
    } else {
        $('.screen').val(function () {
            return this.value + operatorIn;
        })
    }

}; //end assignOperator

//Checks the data of number button pressed and outputs to screen on calculator
function numberInput() {
    operatorIn = $(this).data('btn');
    $('.screen').val(function () {
        return this.value + operatorIn;
    })
} //end NumberInput

//This is how I spent my Saturday. I decided it would be better if I put more buttons on the calculator than was required of the assignment
//Using more than one operator in and equation will send and alert saying , don't do that.
//This function uses a superscript minus in the place of a regular '-'.  This function checks what part of the equation you are currently
//entering and toggles a superscript minus in front of that number.
function negativeToggle() {
    let afterOperatorNeg = $('.screen').val().replace(beforeRe, '');
    let operatorNeg = $('.screen').val().match(operatorRe);
    if (!beforeRe.test($('.screen').val())) {
        if (superscriptNegativeRe.test($('.screen').val())) {
            $('.screen').val($('.screen').val().replace(superscriptNegativeRe, ``))
        } else {
            $('.screen').val(`⁻${$('.screen').val()}`)
        }
    } else {
        if (superscriptNegativeRe.test(afterOperatorNeg)) {
            $('.screen').val($('.screen').val().match(beforeRe) + afterOperatorNeg.replace(superscriptNegativeRe, ''))
        } else {
            $('.screen').val($('.screen').val().match(beforeRe) + operatorNeg + afterOperatorNeg.replace(operatorRe, '⁻'))
        }
    }
}//end negativeToggle

//converts superscript leading numbers to negative numbers.
function negativeCheck(num) {
    if (superscriptNegativeRe.test(num)) {
        return num.replace(superscriptNegativeRe, '-')
    } else {
        return num
    }
}//end negativeCheck

//creates the math object that will be sent to the server. Verifies that it is sending a real number. Clears input.
function createMathObj() {
    let beforeOperator = $('.screen').val().match(beforeRe).toString();
    let afterOperator = $('.screen').val().replace(includingOperatorRe, ' ');
    let atOperator = $('.screen').val().match(operatorRe).toString();
    beforeOperator = negativeCheck(beforeOperator)
    afterOperator = negativeCheck(afterOperator)

    mathObj = {
        numOne: beforeOperator,
        operator: atOperator,
        numTwo: afterOperator
    }

    console.log(mathObj)

    if (mathObj.numOne * 1 == mathObj.numOne && mathObj.numTwo * 1 == mathObj.numTwo && mathObj.numOne != null) {
        mathSubmit()
    } else {
        alert(`Input only accepts 2 valid numbers and one operator.  Please try again.`)
    }

    clearInput()
}; //end createMathObj

//clears input.  Pressing when input is already cleared will clear history.
function clearInput() {

    if ($('.screen').val() == '') {
        clearHistory()
    } else {
        $('input').val('')
    }
} //end clearInput

//AJAX post that sends mathObj to server.  Runs getAnswer get call for answer.
function mathSubmit() {
    $.ajax({
        url: '/calculate',
        type: 'POST',
        data: mathObj
    }).then(function (response) {
        console.log(response)
        getAnswer()
    })

}//end mathSubmit

//AJAX post for the function buttons --square root and percent.
function funcSubmit() {
    let number = Number($('.screen').val())
    let operator = $(this).data('btn')

    if (number) {
        mathObj = {
            numOne: number,
            operator: operator,
            numTwo: 0
        }
        $.ajax({
            url: '/otherFunctions',
            type: 'POST',
            data: mathObj
        }).then(function (response) {
            console.log(response)
            getAnswer()
        })
    } else {
        alert('Enter one number to get percent or square root.')
    }
};//end funcSubmit

//AJAX post for storing and changing the memorized number
function memorySubmit() {
    console.log($(this).data('btn'))
    let number = Number($('.screen').val())
    let operator = $(this).data('btn')

    mathObj = {
        numOne: number,
        operator: operator,
        numTwo: 0
    }

    $.ajax({
        url: '/memory',
        type: 'POST',
        data: mathObj
    }).then(function (response) {
        console.log(response)
        memoryCheck()
    })
};//end memorySubmit

//AJAX get that brings back the answer to the DOM.  Runs historyUpdate at the end.
function getAnswer() {
    $.ajax({
        url: '/calculate',
        type: 'GET'
    }).then(function (response) {
        let result;
        if (negativeRe.test(response)) {
            result = response.replace(negativeRe, '⁻')
        } else {
            result = response
        }
        $('.screen').val(result)
    })
    historyUpdate();
};//end getAnswer

//AJAX get for stored memory value on the server.
function memoryCheck() {
    $.ajax({
        url: '/memory',
        type: 'GET'
    }).then(function (response) {
        console.log(response)
        if (response == 0) {
            $('.screen').val('')
        } else {
            $('.screen').val(response)
        }
    })
};//end memoryCheck

//AJAX get which iterates over the entire history of equations run by the server
function historyUpdate() {
    $.ajax({
        url: '/history',
        type: 'GET'
    }).then(function (response) {
        $('#history-list').empty()
        for (item of response) {
            $('#history-list').prepend(`<div class="history-items">${item}</div>`)
        }
    })
}//end historyUpdate

//Delete AJAX call.  I'm n ot sure i did this entirely correctly.  It doesn't actually delete anything.  It just sets the history array to an empty array.
function clearHistory() {
    $.ajax({
        url: '/history',
        type: 'DELETE'
    }).then(function (response) {
        console.log(response)
        $('#result-display').empty()
        $('#result-display').append(0)
        historyUpdate()
    })
}//end clearHistory

//The best part about solar calculators
function fingerOverPanel() {
    $('.screen').addClass('fade')
    console.log('hi')
    $(document).on('mouseup', '#solar-panel', function () {
        $('.screen').removeClass('fade')
    })
}//end fingerOverPanel
