const express = require('express');
const bodyParser = require('body-parser')

const PORT = 5000;
const app = express();

let history = []
let answer;
let memory = '0'

app.use(express.static('server/public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/calculate', (req, res) => {

    let firstInput = Number(req.body.numOne);
    let operator = req.body.operator;
    let secondInput = Number(req.body.numTwo);

    if (operator == '+') {
        answer = (firstInput + secondInput).toString()
    } else if (operator == '-') {
        answer = (firstInput - secondInput).toString()
    } else if (operator == '*') {
        answer = (firstInput * secondInput).toString()
    } else if (operator == '/') {
        answer = (firstInput / secondInput).toString()
    }
    history.push(`${firstInput} ${operator} ${secondInput} = ${answer}`);
    res.sendStatus(200)
})

app.post('/otherFunctions', (req, res) => {
    let firstInput = Number(req.body.numOne);
    let operator = req.body.operator;

    if (operator == 'sqrt') {
        answer = Math.sqrt(firstInput).toString()
        operator = '\u221A'
    } else if (operator == '%') {
        answer = (firstInput * .01).toString()
    }
    history.push(`${operator}${firstInput} = ${answer}`);
    res.sendStatus(200)
})

app.post('/memory', (req, res) => {
    let firstInput = Number(req.body.numOne);
    let operator = req.body.operator;
    let memoryNumber = Number(memory);

    if (operator == 'M+') {
        memoryNumber += firstInput
        memory = memoryNumber.toString()
    } else if (operator == 'M-') {
        memoryNumber -= firstInput
        memory = memoryNumber.toString()
    } else if (operator == 'MR') {
        if (firstInput == memory) {
            memory = '0'
        }
    }
    if (memory == 'NaN') {
        memory = '0'
    }
    console.log(memory)
    res.sendStatus(200)
})

app.get('/memory', (req, res) => {
    res.send(memory)
})

app.get('/calculate', (req, res) => {
    res.send(answer)
})

app.get('/history', (req, res) => {
    res.send(history)
})

app.delete('/history', (req, res) => {
    history = [];
    res.sendStatus(200)
})



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})