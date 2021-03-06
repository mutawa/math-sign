let currentQuestion;
let totalAnswers = 0;
let rightAnswers = 0;
let wrongAnswers = 0;
let correctInARow = 0;
let level = 1;
let MAX_RIGHT_ANSWERS = 10;

document.addEventListener("load", loadData);


class Question {
    operand1;
    operand2;
    operator;
    answer;
    answers;

    constructor() {
        this.operator = new Operator("-+".substr(getRandomInt(0, 2), 1));
        const numberFrom = level * 10;
        this.operand1 = new Operand(getRandomInt(-numberFrom, numberFrom),{operation: this.operator.value, order: 1});    
        this.operand2 = new Operand(getRandomInt(-numberFrom, numberFrom),{operation: this.operator.value, order: 2});    
        //this.operand1 = new Operand(-8, {bracket: 0, sign: 1, absolute: 1});    
        //this.operand2 = new Operand(9, {bracket: 0, sign: 0, absolute: 0});    
        this.answers = new Set();
    }

    


    show = () => {
        
        const operand1 = $('#operand1');
        const operand2 = $('#operand2');
        const operator = $('.operator');
        const answer = $('#answer');
        operator.innerHTML = this.operator.render();
        operand1.innerHTML  = this.operand1.render(); 
        operand2.innerHTML =  this.operand2.render();
        
        let a1 = this.operand1.origin + this.operand2.origin;
        let a2 = this.operand1.origin - this.operand2.origin;
        let a3 = this.operand1.value + this.operand2.value;
        let a4 = this.operand1.value - this.operand2.value;


        this.answer = 0;

        this.answer += this.operand1.value;
        this.answer += this.operator.value ==="+" ? this.operand2.value : -this.operand2.value;

        this.answers.add(this.answer);
        this.answers.add(-this.answer);
        this.answers.add(this.operand1.origin);
        this.answers.add(-this.operand1.origin);
        this.answers.add(this.operand2.origin);
        this.answers.add(-this.operand2.origin);

        this.answers.add(a1);
        this.answers.add(a2);
        this.answers.add(a3);
        this.answers.add(a4);
        this.answers.add(-a1);
        this.answers.add(-a2);
        this.answers.add(-a3);
        this.answers.add(-a4);

        this.answers = new Set([...this.answers].sort(() => Math.random() - 0.5));
        function removeListener() {

            document.querySelectorAll('.choice').forEach(choice => choice.removeEventListener('click', checkAnswer));
        }

        removeListener();
        

        const choices = $('.choices');
                            
        choices.innerHTML = "";
        this.answers.forEach(answer => {
            const c = new Operand(answer, {bracket: 0, sign: 0, absolute: 0});
            choices.innerHTML += "<div v=\"" + answer + "\" class='choice'>" + c.render() + "</div>";
        });
        document.querySelectorAll('.choice').forEach(choice => choice.addEventListener('click', checkAnswer));
        const that = this;

        function checkAnswer(e) {
            
            if(+e.target.getAttribute('v') === that.answer) {
                removeListener();
                rightAnswers++;
                totalAnswers++;
                if(rightAnswers>MAX_RIGHT_ANSWERS) {
                    MAX_RIGHT_ANSWERS += level * 5;
                    level++;
                    rightAnswers = 0;
                }
                wrongAnswers>0 && correctInARow++;
                if(correctInARow > 3) {
                    correctInARow = -1;
                    if(wrongAnswers > 0) {
                        wrongAnswers--;
                    }
                }
                e.target.classList.add('correct');
                setTimeout(() => {
                    ask();
                }, 1000);
            } else {
                wrongAnswers++;
                correctInARow = -1;
                e.target.classList.add('wrong');
            }
            updateScore();
        }

        

        //answer.innerHTML = this.answer;
        //console.table(this.answers);
    }

}

function updateScore() {
    storeData();
    $('#progress-bar').style.width = (rightAnswers / (MAX_RIGHT_ANSWERS)) * 100 + "%";
    $('#level').innerText = level.arb();
    $('#correct').innerText = totalAnswers.arb();
    $('#wrong').innerText = wrongAnswers.arb();
    $('#row').innerText = "";
    for(let i = 0; i < correctInARow; i++) {
        $('#row').innerText += "????";
    }
}

class Operator {
    value;
    constructor(value) {
        this.value = value;
    }
    render = () => {
        let result = "";
        switch(this.value) {
            case "+":
                result = "<div class=\"plus\"></div>";
                break;
            case "-":
                result = "<div class=\"minus\"></div>";
                break;
            case "*":
                result = "<div class=\"multiply\"></div>";
                break;
            case "/":
                result = "<div class=\"divide\"></div>";
                break;
            default:
        }
                return result;
    }
}

class Operand {
    
    isAbsolute;
    isBrackets;
    isSign;
    sign;
    value;
    origin;
    order;
    operation;

    constructor(value, {bracket=true, absolute=true, sign=true, operation, order} = {}) {
        this.value = value;
        this.origin = value;
        this.operation = operation;
        this.order = order;


        if(this.origin < 0) {
            this.sign = "minus";
        } else {
            this.sign = "plus";
        }


        if(absolute && Math.random() < 0.3) {
            this.isAbsolute = true;
            this.value = Math.abs(value);

        } else if(bracket && Math.random() < 0.4) {
            this.putBrackets();
        }

        if(sign && this.origin !== 0) {
            if(order===1 && Math.random() < 0.5) { this.putSign(); }
            else if(order===2 ) { 
                if(operation === "+" && this.origin > 0) { return; }
                this.putSign(); this.putBrackets(); 
                    
            }

            
        }

        
    }

    putBrackets() {
        this.isBrackets = true;
    }

    putSign() {
        this.isSign = true;

    }
    render () {
        let result = "";
        if(this.isBrackets) {
            result += "<div class='open bracket'></div>";
        }
        
        if(this.isAbsolute) {
            result += "<div class='bar'></div>";
        }

        if(this.isSign || this.origin < 0) {
            result += `<div class="${this.sign}"></div>`;
            
        }

        

        result += Math.abs(this.value).arb();
        
        if(this.isAbsolute) {
            result += "<div class='bar'></div>";
        }

        if(this.isBrackets) {
            result += "<div class='closed bracket'></div>";
        }
        return result;
    }

}

Number.prototype.arb = function() {
    const arabicNumerals = "????????????????????";
    return this.toString().replace(/[0-9]/g, function(w) {
        return arabicNumerals[+w];
    });

}

const $ = selector => document.querySelector(selector);





function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function ask() {
    currentQuestion = new Question();
    currentQuestion.show();


}

document.addEventListener('keydown', (e) => {
    if(e.keyCode === 13) {
        ask();
    }
});



function loadData() {
    
    const data = localStorage.getItem("data");
    if(data) {
        const d = JSON.parse(data);
        rightAnswers = d.rightAnswers;
        wrongAnswers = d.wrongAnswers;
        totalAnswers = d.totalAnswers;
        level = d.level;
        correctInARow = d.correctInARow;
        MAX_RIGHT_ANSWERS = d.MAX_RIGHT_ANSWERS;
        currentQuestion = d.currentQuestion;
    
        updateScore();
        
    }
    ask();
}

function storeData() {
    
    const data = {
        rightAnswers,
        wrongAnswers,
        totalAnswers,
        level,
        correctInARow,
        MAX_RIGHT_ANSWERS,
        
        
    };
    localStorage.setItem("data", JSON.stringify(data));
}


