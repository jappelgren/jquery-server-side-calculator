# Server Side Calculator

## Description

Built a functional basic calculator where all math is done on the server and sent back to the dom through AJAX gets and posts. I quickly built out the base function of the calculator and went on to making it a little more complicated. Calculator can do all things you'd expect a basic calculator to do, addition, subtraction, division, and multiplication.

After basic functionality was built and tested I moved on to a few more complicated tasks. Adding a plus/minus toggle button, a square root function, and a percent conversion button. Pressing the c/ch once will clear the numbers on screen. If you are at zero pressing it again will clear the calculation history on the right of the calculator. In addition to those functions, I added a fully functional memory function like you'd find on a scientific calculator. I had to read about how those systems work and do a little experimenting but its in there and does what it's supposed to do. Press the M+ or M- after entering a number and a positive or negative version of that number will be stored in the server. You can add and subtract to that number in the same manner. Pressing the MRC button once will recall the memory number. If the number on screen is the number is the number in memory pressing the MRC button again will reset that memory value back to 0 on the server.

The plus/minus toggle was the one of the more challenging tasks. Since both numbers are displayed on the "screen" at the same time I had to make conditionals to see where the user is at in their input journey. All of those variables are thrown in there, a few regular expressions figure out where a minus should go and then it's on the screen, or off depending how many times you press the button. Having both numbers on the screen at the same time was probably the largest challenge in this version of the calculator. I can see why regular calculators don't do this.

## Known Bugs

Entering a minus with the user's keyboard in the input field to make a number negative will cause an alert to request you only use one operator. If you need to make a number negative make sure to use the +/- button on the on screen calculator.

## Easter Egg

What happens when you hold your finger over the solar panel?
