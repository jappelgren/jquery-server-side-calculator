$(document).ready(handleReady);

function handleReady() {
    $(document).on('click', '.operator-btn', assignOperator);
    $(document).on('click', '.number-btn', numberInput);
    $(document).on('click', '#equals-btn', createMathObj);
    $(document).on('click', '#clear-btn', clearInput);
    historyUpdate()
}

let operatorIn;
let mathObj = {};

let beforeRe = /.+?(?=\+|\-|\/|\*)/g;
let includingOperatorRe = /.+?(?<=\+|\-|\/|\*)/g;
let operatorRe = /\+|\-|\/|\*/g;

function assignOperator() {
    operatorIn = $(this).data('btn');

    if (operatorRe.test($('#screen').val())) {
        $('#screen').val($('#screen').val().replace(operatorRe, `${operatorIn}`));
    } else {
        $('#screen').val(function () {
            return this.value + operatorIn;
        })
    }

};

function numberInput() {
    operatorIn = $(this).data('btn');
    $('#screen').val(function () {
        return this.value + operatorIn;
    })
}

function createMathObj() {
    let beforeOperator = $('#screen').val().match(beforeRe).toString();
    let afterOperator = $('#screen').val().replace(includingOperatorRe, ' ');
    let atOperator = $('#screen').val().match(operatorRe).toString();
    console.log(beforeOperator)

    mathObj = {
        numOne: beforeOperator,
        operator: atOperator,
        numTwo: afterOperator
    }
    console.log(mathObj)

    if (mathObj.numOne * 1 == mathObj.numOne && mathObj.numTwo * 1 == mathObj.numTwo) {
        mathSubmit()
    } else {
        alert(`Input only accepts 2 valid numbers and one operator.  Please try again.`)
    }


    clearInput()
};

function mathSubmit() {
    $.ajax({
        url: '/calculate',
        type: 'POST',
        data: mathObj
    }).then(function (response) {
        console.log(response)
        getAnswer()
    })

}

function getAnswer() {
    $.ajax({
        url: '/calculate',
        type: 'GET'
    }).then(function (response) {
        $('#result-display').empty()
        $('#result-display').append(response)
    })
    historyUpdate();
}

function historyUpdate() {
    $.ajax({
        url: '/history',
        type: 'GET'
    }).then(function (response) {
        $('#history-list').empty()
        for (item of response) {
            $('#history-list').prepend(`<li>${item}</li>`)
        }
    })
}

function clearInput() {
    $('input').val('')
}