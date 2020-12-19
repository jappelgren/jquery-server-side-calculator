const express = require('express');
const bodyParser = require('body-parser')

const PORT = 5000;
const app = express();

let history = []
let answer;

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
    history.push(`${firstInput} ${operator} ${secondInput} = ${answer}`); //make this a string of numone operator numtwo = answer
    res.sendStatus(200)
})

app.get('/calculate', (req, res) => {
    res.send(answer)
})

app.get('/history', (req, res) => {
    res.send(history)
})



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})