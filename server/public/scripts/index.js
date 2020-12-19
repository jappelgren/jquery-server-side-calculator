$(document).ready(handleReady);

function handleReady() {
    $(document).on('click', '.operator-btn', assignOperator);
    $(document).on('click', '#equals-btn', createMathObj);
    $(document).on('click', '#clear-btn', clearInputs);
    historyUpdate()
}

let operatorIn;

let mathObj = {};

function assignOperator() {
    operatorIn = $(this).data('btn');
};

function createMathObj() {
    mathObj = {
        numOne: $('#first-number').val(),
        operator: operatorIn,
        numTwo: $('#second-number').val()
    }
    console.log(mathObj)
    mathSubmit()
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

function clearInputs() {
    $('input').val('')
}