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

let beforeRe = /.+?(?=\+|\-|\/|\*)/g;
let includingOperatorRe = /.+?(?<=\+|\-|\/|\*)/g;
let operatorRe = /\+|\-|\/|\*/g;
let superscriptNegativeRe = /⁻/g;
let negativeRe = /-/g;

function assignOperator() {
    operatorIn = $(this).data('btn');

    if (operatorRe.test($('.screen').val())) {
        $('.screen').val($('.screen').val().replace(operatorRe, `${operatorIn}`));
    } else {
        $('.screen').val(function () {
            return this.value + operatorIn;
        })
    }

};

function numberInput() {
    operatorIn = $(this).data('btn');
    $('.screen').val(function () {
        return this.value + operatorIn;
    })
}

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
}

function negativeCheck(num) {
    if (superscriptNegativeRe.test(num)) {
        return num.replace(superscriptNegativeRe, '-')
    } else {
        return num
    }
}

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
};

function clearInput() {

    if ($('.screen').val() == '') {
        clearHistory()
    } else {
        $('input').val('')
    }
}

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


}

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
}

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
}

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

}

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
}

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
}

function fingerOverPanel() {
    $('.screen').addClass('fade')
    console.log('hi')
    $(document).on('mouseup', '#solar-panel', function () {
        $('.screen').removeClass('fade')
    })
}
