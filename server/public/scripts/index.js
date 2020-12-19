$(document).ready(handleReady);

function handleReady() {
    $(document).on('click', '.operator-btn', assignOperator);
    $(document).on('click', '#equals-btn', createMathObj)
}

let operatorIn;

let mathObj = {};

function assignOperator() {
    operatorIn = $(this).data('btn');
};

function createMathObj() {
    mathObj = {
        numOne: Number($('#first-number').val()),
        operator: operatorIn,
        numTwo: Number($('#second-number').val())
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
        console.log(response)
    })
}