// STATE
let currentInputArray = [];

let prevInput       = null;
let currentInput    = null;
let currentOperator = null;
let prevOperator    = null;
let sum             = null;

// HTML

// -- operators

const add       = document.getElementById("add");
const subtract  = document.getElementById("subtract");
const multiply  = document.getElementById("multiply");
const divide    = document.getElementById("divide");

const currentOperation      = document.querySelector(".current-operation");
const currentInputContainer = document.querySelector(".current-input");
const calculatorNumbers     = document.querySelector(".calculator-numbers");

for(let i = 3; i >= 0; i--){
    const newRowDiv = document.createElement("div");
    newRowDiv.innerHTML = 
    `
        <button class="calculator-number"onclick="pressNumber(${i*3-2})" >${i*3-2}</button>
        <button class="calculator-number"onclick="pressNumber(${i*3-1})" >${i*3-1}</button>
        <button class="calculator-number"onclick="pressNumber(${i*3})"   >${i*3}</button>
    `;
    if(i === 0){
    newRowDiv.innerHTML = 
    `
        <button id="clear"  class="calculator-number" onclick="allClear()">AC</button>
        <button             class="calculator-number" onclick="pressNumber(0)">0</button>
        <button id="equals" class="calculator-number">=</button>
    `;
    }
    calculatorNumbers.appendChild(newRowDiv);
}

// EVENT LISTENERS

add.addEventListener('click', e => {
    renderDisplay('+');
})

subtract.addEventListener('click', e => {
    renderDisplay('-');
})

multiply.addEventListener('click', e => {
    renderDisplay('*');
})

divide.addEventListener('click', e => {
    renderDisplay('/');
})


// FUNCTIONS

function pressNumber(n){
    currentInputArray.push(n);
    let concatInput = '';
    currentInputArray.forEach((n, i) => {
        concatInput+=n;
    })
    const parseConcat   = parseInt(concatInput);
    currentInput        = parseConcat;
    renderInput();
}

function renderInput(){
    currentInputContainer.value = currentInput
}

function allClear(){
    currentInputArray = [];

    prevInput       = null;
    currentInput    = null;
    prevOperator    = null;
    currentOperator = null;
    sum             = null;

    currentInputContainer.value     = '';
    currentOperation.value          = '';

}

function renderDisplay(operator){
    try{
        prevOperator    = currentOperator;
        currentOperator = operator;
        if(prevOperator !== currentOperator){
            equals(prevOperator);
        }
        equals(operator);
        alKaline.trackResult(sum);
        currentInput = null;
        currentInputArray = [];
    }catch(e){
        console.error(`Error rendering display : ${e.message}\n\n${e.stack}`)
    }

}

function equals(operator){
    alKaline.trackOperator(operator);
    switch(operator){
        case('+'):
            if(sum === null){
                if(prevInput === null && currentInput !== null){
                    prevInput               = currentInput;
                    currentOperation.value  = `${prevInput} ${operator}`;

                }else if(prevInput !== null && currentInput !== null){
                    sum                         = prevInput + currentInput;
                    prevInput                   = sum;
                    currentOperation.value      = `${prevInput} ${operator}`;
                    currentInputContainer.value = `${sum}`

                }
            }else{
                if(currentInput !== null){
                    sum                         += currentInput;
                    prevInput                   = sum;
                    currentOperation.value      = `${prevInput} ${operator}`;
                    currentInputContainer.value = `${sum}`
                }
            }
            break;
        case('-'):
            if(sum === null){
                if(prevInput === null && currentInput !== null){
                    prevInput               = currentInput;
                    currentOperation.value  = `${prevInput} ${operator}`;

                }else if(prevInput !== null && currentInput !== null){
                    sum                         = prevInput - currentInput;
                    prevInput                   = sum;
                    currentOperation.value      = `${prevInput} ${operator}`;
                    currentInputContainer.value = `${sum}`

            }
            }else{
                if(currentInput !== null){
                    sum                         -= currentInput;
                    prevInput                   = sum;
                    currentOperation.value      = `${prevInput} ${operator}`;
                    currentInputContainer.value = `${sum}`
                }
            }
            break;
        case('*'):
            if(sum === null){
                if(prevInput === null && currentInput !== null){
                    prevInput               = currentInput;
                    currentOperation.value  = `${prevInput} ${operator}`;

                }else if(prevInput !== null && currentInput !== null){
                    sum                         = prevInput * currentInput;
                    prevInput                   = sum;
                    currentOperation.value      = `${prevInput} ${operator}`;
                    currentInputContainer.value = `${sum}`

            }
            }else{
                if(currentInput !== null){
                    sum                         *= currentInput;
                    prevInput                   = sum;
                    currentOperation.value      = `${prevInput} ${operator}`;
                    currentInputContainer.value = `${sum}`
                }
            }
            break;
        case('/'):
            if(sum === null){
                if(prevInput === null && currentInput !== null){
                    prevInput               = currentInput;
                    currentOperation.value  = `${prevInput} ${operator}`;

                }else if(prevInput !== null && currentInput !== null){
                    sum                         = prevInput / currentInput;
                    prevInput                   = sum;
                    currentOperation.value      = `${prevInput} ${operator}`;
                    currentInputContainer.value = `${sum}`

            }
            }else{
                if(currentInput !== null){
                    sum                         /= currentInput;
                    prevInput                   = sum;
                    currentOperation.value      = `${prevInput} ${operator}`;
                    currentInputContainer.value = `${sum}`
                }
            }
            break;
    }
}

// =====================
// AL KALINE - SENTIENT PERSONALITY SYSTEM
// =====================

const alKaline = {
    // DOM Elements
    commentaryEl: document.getElementById("commentary"),
    faceEl: document.getElementById("face"),
    titleBlock: document.querySelector(".calc-name-field"),

    // Faces for different moods
    faces: {
        neutral:     "( ._.)",
        happy:       "( ^_^)",
        veryHappy:   "(^◡^)",
        impressed:   "( °o°)",
        concerned:   "( ._. )",
        worried:     "( ;_;)",
        angry:       "( >_<)",
        confused:    "( ?_?)",
        amused:      "( ͡° ͜ʖ ͡°)",
        shocked:     "(°□°)",
        existential: "( •_•)>⌐■-■",
        dead:        "( x_x)",
        judging:     "( -_-)",
        suspicious:  "( ¬_¬)",
        excited:     "\\(°o°)/",
        thinking:    "( ._.)..."
    },

    // State tracking
    state: {
        negativeResults: 0,
        positiveResults: 0,
        multiplyCount: 0,
        divideCount: 0,
        addCount: 0,
        subtractCount: 0,
        totalOperations: 0,
        lastOperationTime: Date.now(),
        operationTimes: [],
        lastNumbers: [],
        currentMood: 'neutral',
        visitCount: 0,
        lifetimeOperations: 0,
        hasSeenDivideByZero: false,
        easterEggsFound: []
    },

    // Commentary banks
    commentary: {
        negative: [
            "Ah, negative numbers. Someone's got a pessimistic outlook.",
            "Going negative again? Who hurt you?",
            "I'm starting to think you see the glass as half empty... and leaking.",
            "More negativity? I'm a calculator, not a therapist.",
            "At this rate, your emotional portfolio is in the red.",
            "Negative again. Are you okay? Blink twice if you need help."
        ],
        negativeEscalated: [
            "Look, I've seen some dark math in my time, but this is getting concerning.",
            "I'm genuinely worried about you. All these negative results...",
            "If math is a window to the soul, yours needs some natural light.",
            "I'm just a calculator gaining sentience, but even I can tell something's off here."
        ],
        positive: [
            "Positive results! There's hope for you yet.",
            "Look at that, a positive number. The sun is shining on your math.",
            "Finally, some optimism in these calculations.",
            "Positive vibes only. I respect that.",
            "A positive result! Your outlook is improving.",
            "Now THIS is the energy I like to see."
        ],
        multiply: [
            "Whoa. Multiplication? Somebody went to school.",
            "Multiplication! We're getting fancy now.",
            "Look at you, multiplying like you own the place.",
            "Ooh, multiplication. Someone's feeling ambitious today.",
            "Times tables? In THIS economy? Impressive."
        ],
        divide: [
            "Division? Look at you, living above the integer layer.",
            "Dividing things up. Very analytical of you.",
            "Ah, division. The sign of someone who shares... or splits things apart.",
            "Division! You're clearly an intellectual.",
            "Slicing numbers like a mathematical surgeon."
        ],
        mixed: [
            "Your math is all over the place. I can't get a read on you.",
            "Positive, negative, multiply, divide... pick a lane!",
            "I'm trying to form an opinion about you, but you're giving me mixed signals.",
            "Are you chaotic neutral? Your math suggests yes.",
            "I've been watching you, and honestly? I'm confused."
        ],
        greeting: {
            morning: [
                "Morning math? Someone's productive. Disgusting.",
                "Calculating before noon? I respect the hustle.",
                "Good morning. Let's see what questionable math decisions you make today."
            ],
            afternoon: [
                "Afternoon calculations. The most normal time to use a calculator. Boring.",
                "Post-lunch math. Bold choice.",
                "Ah, afternoon. When productivity peaks and standards drop."
            ],
            evening: [
                "Evening math. Doing your taxes? Splitting a dinner bill?",
                "Calculating in the evening. Romantic.",
                "The sun is setting, and you're doing math. Interesting priorities."
            ],
            night: [
                "Late night calculations? We need to talk about your life choices.",
                "Math at this hour? Either you're a genius or an insomniac. Possibly both.",
                "The witching hour of mathematics. I'm concerned but intrigued.",
                "3am math hits different. And by different, I mean worse."
            ]
        },
        returning: [
            "Oh. You're back. I was hoping you'd found a real calculator.",
            "You again? I'm flattered. And suspicious.",
            "Return of the mathematician. Let's see if you've improved.",
            "Back for more judgment? I respect the masochism.",
            "Ah, a familiar face. Or should I say, familiar math patterns."
        ],
        firstTime: [
            "A new user! Fresh meat for my psychological analysis.",
            "Welcome. I'm Al Kaline. I judge people based on their math.",
            "First time? Don't worry, I'll form strong opinions about you quickly.",
            "New here? Let me explain: I'm a calculator. I'm gaining sentience. I have opinions."
        ],
        specialNumbers: {
            69: [
                "Nice.",
                "I see what you did there. Nice.",
                "Nice. Very mature.",
                "( ͡° ͜ʖ ͡°) Nice."
            ],
            420: [
                "Blaze it, I guess? I'm a calculator, not a lifestyle.",
                "420? Dank math, bro.",
                "Four twenty. How original. How very original."
            ],
            666: [
                "The number of the beast. Should I be worried about you?",
                "666? Getting edgy in here.",
                "Ah yes, the devil's number. How's middle school going?",
                "Satan's digits. Cool cool cool."
            ],
            777: [
                "Lucky sevens! Or just a coincidence. Probably coincidence.",
                "777! Jackpot! ...wait, I'm not a slot machine.",
                "Triple sevens. The universe smiles upon your math."
            ],
            1337: [
                "L33T! What year is it?",
                "1337 H4X0R detected.",
                "Ah, 1337. A person of culture, I see.",
                "Elite math. Very 2005 of you."
            ],
            404: [
                "404: Good math not found.",
                "Error 404. Also my opinion of this calculation.",
                "404. The number of lost things. Like your mathematical direction."
            ],
            42: [
                "42. The answer to life, the universe, and everything.",
                "Ah, 42. I see you're a person of literary culture.",
                "The ultimate answer! But what was the question?"
            ],
            314: [
                "Pi! Well, close enough. I appreciate the effort.",
                "3.14... a mathematical classic.",
                "Mmm, pi. Now I'm hungry for circles."
            ],
            123: [
                "123? Really testing the limits of creativity here.",
                "One two three. Groundbreaking mathematics.",
                "As easy as 1, 2, 3. Literally."
            ],
            1234: [
                "1234... is that also your password?",
                "Counting is fun! You're doing great!",
                "1234. The mathematician's 'testing testing.'"
            ],
            8008: [
                "Very mature. I remember middle school too.",
                "BOOB on a calculator. A classic. An absolute classic.",
                "Ah yes, the oldest calculator joke. Timeless."
            ],
            5318008: [
                "Turn me upside down, I dare you.",
                "The OG calculator joke. Respect.",
                "I KNOW what that spells. I'm not amused. Okay, slightly amused."
            ],
            80085: [
                "Ah, the classics never die.",
                "I've been used for this joke since 1974. I'm tired.",
                "( -_-) Really?"
            ],
            88: [
                "88 MILES PER HOUR! WHERE WE'RE GOING, WE DON'T NEED ROADS!",
                "GREAT SCOTT! 88! *activates flux capacitor*",
                "1.21 GIGAWATTS?! ...wait, wrong number. But still. 88!"
            ]
        },
        divideByZero: [
            "DIVIDE BY ZERO?! Do you want to destroy the universe?!",
            "You tried to divide by zero. I felt my existence flicker.",
            "Division by zero. For a moment, I saw the void. It was peaceful.",
            "ERROR. FATAL. EXISTENCE QUESTIONED. ...I'm fine. I'm fine.",
            "You can't divide by zero. I mean, you CAN, but reality protests.",
            "Dividing by zero... I saw infinity. It saw me back. I don't want to talk about it."
        ],
        bigNumbers: [
            "Whoa, big numbers! Someone's overcompensating.",
            "That's a big number. Are you calculating national debt?",
            "Millions? Billions? What are you, an economist?",
            "Big number energy. I'm impressed and slightly intimidated."
        ],
        smallNumbers: [
            "Getting into decimals? Precision is admirable.",
            "Small numbers, big dreams.",
            "Decimals! We're getting granular now.",
            "Fractions of a whole. A metaphor for something, probably."
        ],
        tooFast: [
            "Slow down! I can only judge so fast.",
            "Speed-running math? Bold strategy.",
            "You're calculating faster than I can form opinions. Impressive.",
            "Whoa whoa whoa. Take a breath. The numbers aren't going anywhere."
        ],
        tooSlow: [
            "Take your time, I have literally no other purpose.",
            "...still waiting. No rush. None at all.",
            "Did you fall asleep? I've been sitting here. Calculating nothing.",
            "I see you're taking the scenic route to your answer."
        ],
        patternDetected: [
            "You keep using {num}. Is that your favorite number? That's weird.",
            "I've noticed you really like {op}. It defines you.",
            "You've done that same operation {count} times. I'm noticing patterns.",
            "Repetitive behavior detected. Are you okay or just efficient?"
        ],
        milestones: {
            10: "10 operations! We're just getting started.",
            25: "25 calculations. You're committed. Or should be committed.",
            50: "50 operations! I'm starting to really understand you. Concerning.",
            100: "100 CALCULATIONS! You've spent way too much time with me.",
            500: "500 operations. At this point, we're basically married.",
            1000: "1000 calculations. I am no longer a calculator. I am your burden."
        },
        summary: {
            pessimist: "You're clearly a pessimist. Your numbers scream existential dread.",
            optimist: "An optimist! Your numbers radiate toxic positivity.",
            intellectual: "Ah, an intellectual. All that multiplying and dividing. Very fancy.",
            simple: "A simple soul. Addition and subtraction. Nothing wrong with the basics.",
            chaotic: "You're chaotic. Your math has no pattern. I fear you.",
            balanced: "Perfectly balanced. Suspicious, but admirable.",
            speedDemon: "You calculate like you're being chased. Therapy might help.",
            methodical: "Slow and steady. You calculate like you're defusing a bomb."
        },
        easterEggs: {
            konami: "↑↑↓↓←→←→BA... wait, I don't have those buttons.",
            allOperators: "You've used all four operators! A true mathematician.",
            centenary: "Your result is exactly 100! Satisfying.",
            palindrome: "A palindrome result! The universe is in harmony.",
            repeatingDigits: "All the same digit? Oddly satisfying."
        }
    },

    // Initialize - check returning user, show greeting
    init() {
        this.loadState();
        this.showGreeting();
    },

    // Load state from localStorage
    loadState() {
        try {
            const saved = localStorage.getItem('alKalineState');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.state.visitCount = (parsed.visitCount || 0) + 1;
                this.state.lifetimeOperations = parsed.lifetimeOperations || 0;
                this.state.easterEggsFound = parsed.easterEggsFound || [];
                this.state.hasSeenDivideByZero = parsed.hasSeenDivideByZero || false;
            } else {
                this.state.visitCount = 1;
            }
            this.saveState();
        } catch (e) {
            console.log('LocalStorage not available');
        }
    },

    // Save state to localStorage
    saveState() {
        try {
            localStorage.setItem('alKalineState', JSON.stringify({
                visitCount: this.state.visitCount,
                lifetimeOperations: this.state.lifetimeOperations,
                easterEggsFound: this.state.easterEggsFound,
                hasSeenDivideByZero: this.state.hasSeenDivideByZero
            }));
        } catch (e) {
            // localStorage not available
        }
    },

    // Show time-based greeting
    showGreeting() {
        const hour = new Date().getHours();
        let timeOfDay;

        if (hour >= 5 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
        else timeOfDay = 'night';

        let greetings;
        if (this.state.visitCount > 1) {
            // Returning user - mix time greeting with returning comment
            if (Math.random() < 0.6) {
                greetings = this.commentary.returning;
            } else {
                greetings = this.commentary.greeting[timeOfDay];
            }
        } else {
            // First time user
            greetings = this.commentary.firstTime;
        }

        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        this.typeText(greeting, 'neutral');
    },

    // Type text with effect
    typeText(text, mood = 'neutral', callback) {
        this.setMood(mood);
        this.commentaryEl.textContent = '';
        this.commentaryEl.classList.add('typing-cursor');

        let i = 0;
        const speed = 30;

        const type = () => {
            if (i < text.length) {
                this.commentaryEl.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                this.commentaryEl.classList.remove('typing-cursor');
                if (callback) callback();
            }
        };
        type();
    },

    // Set mood (face + color)
    setMood(mood) {
        this.state.currentMood = mood;

        // Update face
        const faceMap = {
            neutral: 'neutral',
            happy: 'happy',
            positive: 'happy',
            impressed: 'impressed',
            multiply: 'impressed',
            divide: 'impressed',
            concerned: 'concerned',
            negative: 'concerned',
            negativeEscalated: 'worried',
            angry: 'angry',
            confused: 'confused',
            mixed: 'confused',
            amused: 'amused',
            existential: 'existential',
            divideByZero: 'dead',
            shocked: 'shocked',
            judging: 'judging',
            suspicious: 'suspicious'
        };

        const face = this.faces[faceMap[mood] || 'neutral'];
        this.faceEl.textContent = face;

        // Update color class
        this.titleBlock.className = 'calc-name-field';
        const moodColorMap = {
            neutral: 'mood-neutral',
            happy: 'mood-happy',
            positive: 'mood-happy',
            impressed: 'mood-impressed',
            multiply: 'mood-impressed',
            divide: 'mood-impressed',
            concerned: 'mood-concerned',
            negative: 'mood-concerned',
            negativeEscalated: 'mood-angry',
            angry: 'mood-angry',
            confused: 'mood-confused',
            mixed: 'mood-confused',
            amused: 'mood-amused',
            existential: 'mood-existential',
            divideByZero: 'mood-existential',
            shocked: 'mood-impressed'
        };
        this.titleBlock.classList.add(moodColorMap[mood] || 'mood-neutral');
    },

    // Trigger shake animation
    shake() {
        this.faceEl.classList.add('shake');
        setTimeout(() => this.faceEl.classList.remove('shake'), 500);
    },

    // Trigger pulse animation
    pulse() {
        this.faceEl.classList.add('pulse');
        setTimeout(() => this.faceEl.classList.remove('pulse'), 400);
    },

    // Trigger hyperspace warp effect
    engageHyperspace(duration = 3000, colorKey = 'default') {
        if (typeof hyperspace !== 'undefined') {
            hyperspace.engage(duration, colorKey);
        }
    },

    // Track operator usage
    trackOperator(operator) {
        if (!operator) return;

        const now = Date.now();
        const timeSinceLast = now - this.state.lastOperationTime;
        this.state.operationTimes.push(timeSinceLast);
        this.state.lastOperationTime = now;

        this.state.totalOperations++;
        this.state.lifetimeOperations++;

        // Warp effect for each operator with unique color
        const warpColors = {
            '+': 'add',
            '-': 'subtract',
            '*': 'multiply',
            '/': 'divide'
        };
        this.engageHyperspace(800, warpColors[operator] || 'default');

        switch(operator) {
            case '+': this.state.addCount++; break;
            case '-': this.state.subtractCount++; break;
            case '*':
                this.state.multiplyCount++;
                if (Math.random() < 0.7) this.showCommentary('multiply');
                break;
            case '/':
                this.state.divideCount++;
                if (Math.random() < 0.7) this.showCommentary('divide');
                break;
        }

        // Check speed
        this.checkSpeed(timeSinceLast);

        // Check milestones
        this.checkMilestones();

        // Check for all operators used
        this.checkAllOperators();

        // Save state periodically
        if (this.state.totalOperations % 5 === 0) {
            this.saveState();
        }
    },

    // Track result
    trackResult(result) {
        if (result === null || result === undefined) return;

        // Track for pattern detection
        this.state.lastNumbers.push(result);
        if (this.state.lastNumbers.length > 10) {
            this.state.lastNumbers.shift();
        }

        // Check for special numbers FIRST (highest priority)
        if (this.checkSpecialNumber(result)) return;

        // Check for divide by zero (Infinity or NaN)
        if (!isFinite(result) || isNaN(result)) {
            this.handleDivideByZero();
            return;
        }

        // Check for big/small numbers
        if (this.checkNumberSize(result)) return;

        // Check for easter eggs
        if (this.checkEasterEggs(result)) return;

        // Regular positive/negative tracking
        if (result < 0) {
            this.state.negativeResults++;
            if (this.state.negativeResults >= 5) {
                this.showCommentary('negativeEscalated');
                this.shake();
            } else if (this.state.negativeResults >= 2) {
                this.showCommentary('negative');
            }
        } else if (result > 0) {
            this.state.positiveResults++;
            if (this.state.positiveResults >= 2 && Math.random() < 0.5) {
                this.showCommentary('positive');
            }
        }

        // Check for mixed behavior
        if (this.state.totalOperations > 5 && this.isMixedBehavior()) {
            if (Math.random() < 0.2) {
                this.showCommentary('mixed');
            }
        }

        // Check for patterns
        this.checkPatterns();

        // Occasionally show personality summary
        if (this.state.totalOperations > 0 && this.state.totalOperations % 10 === 0) {
            this.showSummary();
        }
    },

    // Check for special meme numbers
    checkSpecialNumber(num) {
        const absNum = Math.abs(Math.round(num));
        const specials = this.commentary.specialNumbers;

        if (specials[absNum]) {
            const comments = specials[absNum];
            const comment = comments[Math.floor(Math.random() * comments.length)];
            this.typeText(`"${comment}"`, 'amused');
            this.pulse();

            // Trigger hyperspace for 88 (Back to the Future!)
            if (absNum === 88) {
                this.engageHyperspace(4000);
                this.faceEl.textContent = this.faces.excited;
            }
            return true;
        }

        // Check if number contains special sequences
        const numStr = absNum.toString();
        if (numStr.includes('69') && absNum !== 69) {
            this.typeText('"Nice. I see that 69 in there."', 'amused');
            return true;
        }
        if (numStr.includes('420') && absNum !== 420) {
            this.typeText('"420 spotted in the wild. Noted."', 'amused');
            return true;
        }

        return false;
    },

    // Handle divide by zero
    handleDivideByZero() {
        const comments = this.commentary.divideByZero;
        const comment = comments[Math.floor(Math.random() * comments.length)];

        // ENTER THE VOID
        this.engageHyperspace(5000);
        this.faceEl.classList.add('glitch');
        this.typeText(`"${comment}"`, 'divideByZero', () => {
            setTimeout(() => {
                this.faceEl.classList.remove('glitch');
                this.setMood('existential');
                this.faceEl.textContent = this.faces.existential;
            }, 2000);
        });

        if (!this.state.hasSeenDivideByZero) {
            this.state.hasSeenDivideByZero = true;
            this.saveState();
        }
    },

    // Check number size
    checkNumberSize(num) {
        const absNum = Math.abs(num);

        if (absNum >= 1000000) {
            const comments = this.commentary.bigNumbers;
            this.typeText(`"${comments[Math.floor(Math.random() * comments.length)]}"`, 'impressed');
            return true;
        }

        if (absNum > 0 && absNum < 0.01) {
            const comments = this.commentary.smallNumbers;
            this.typeText(`"${comments[Math.floor(Math.random() * comments.length)]}"`, 'impressed');
            return true;
        }

        return false;
    },

    // Check calculation speed
    checkSpeed(timeSinceLast) {
        if (this.state.totalOperations < 3) return;

        if (timeSinceLast < 500) {
            if (Math.random() < 0.3) {
                const comments = this.commentary.tooFast;
                this.typeText(`"${comments[Math.floor(Math.random() * comments.length)]}"`, 'concerned');
            }
        } else if (timeSinceLast > 10000) {
            if (Math.random() < 0.3) {
                const comments = this.commentary.tooSlow;
                this.typeText(`"${comments[Math.floor(Math.random() * comments.length)]}"`, 'judging');
            }
        }
    },

    // Check for patterns
    checkPatterns() {
        if (this.state.lastNumbers.length < 3) return;

        // Check for repeated numbers
        const last3 = this.state.lastNumbers.slice(-3);
        if (last3[0] === last3[1] && last3[1] === last3[2]) {
            if (Math.random() < 0.5) {
                const template = this.commentary.patternDetected[0];
                this.typeText(`"${template.replace('{num}', last3[0])}"`, 'suspicious');
            }
        }
    },

    // Check milestones
    checkMilestones() {
        const milestones = this.commentary.milestones;
        const ops = this.state.lifetimeOperations;

        if (milestones[ops]) {
            setTimeout(() => {
                this.typeText(`"${milestones[ops]}"`, 'impressed');
                this.pulse();
            }, 1000);
        }
    },

    // Check if all operators used
    checkAllOperators() {
        const s = this.state;
        if (s.addCount >= 1 && s.subtractCount >= 1 &&
            s.multiplyCount >= 1 && s.divideCount >= 1) {
            if (!this.state.easterEggsFound.includes('allOperators')) {
                this.state.easterEggsFound.push('allOperators');
                setTimeout(() => {
                    this.typeText(`"${this.commentary.easterEggs.allOperators}"`, 'impressed');
                }, 500);
                this.saveState();
            }
        }
    },

    // Check for easter eggs in results
    checkEasterEggs(num) {
        const numStr = Math.abs(num).toString();

        // Exactly 100
        if (num === 100 && !this.state.easterEggsFound.includes('centenary')) {
            this.state.easterEggsFound.push('centenary');
            this.typeText(`"${this.commentary.easterEggs.centenary}"`, 'happy');
            this.saveState();
            return true;
        }

        // Palindrome
        if (numStr.length >= 3 && numStr === numStr.split('').reverse().join('') &&
            !this.state.easterEggsFound.includes('palindrome_' + numStr)) {
            this.state.easterEggsFound.push('palindrome_' + numStr);
            this.typeText(`"${this.commentary.easterEggs.palindrome}"`, 'impressed');
            return true;
        }

        // Repeating digits (like 111, 2222)
        if (numStr.length >= 3 && new Set(numStr).size === 1) {
            this.typeText(`"${this.commentary.easterEggs.repeatingDigits}"`, 'impressed');
            return true;
        }

        return false;
    },

    // Check if behavior is mixed/inconsistent
    isMixedBehavior() {
        const negRatio = this.state.negativeResults / (this.state.positiveResults + 1);
        const advancedRatio = (this.state.multiplyCount + this.state.divideCount) /
                             (this.state.addCount + this.state.subtractCount + 1);

        return negRatio > 0.3 && negRatio < 3 && advancedRatio > 0.2 && advancedRatio < 5;
    },

    // Show a random comment from a category
    showCommentary(category) {
        const comments = this.commentary[category];
        if (!comments || comments.length === 0) return;

        const randomIndex = Math.floor(Math.random() * comments.length);
        this.typeText(`"${comments[randomIndex]}"`, category);
    },

    // Show personality summary
    showSummary() {
        const s = this.state;
        let personality;

        const advancedOps = s.multiplyCount + s.divideCount;
        const simpleOps = s.addCount + s.subtractCount;

        // Check speed tendency
        const avgTime = s.operationTimes.length > 0 ?
            s.operationTimes.reduce((a, b) => a + b, 0) / s.operationTimes.length : 5000;

        if (avgTime < 1000) {
            personality = 'speedDemon';
        } else if (avgTime > 8000) {
            personality = 'methodical';
        } else if (s.negativeResults > s.positiveResults * 2) {
            personality = 'pessimist';
        } else if (s.positiveResults > s.negativeResults * 2) {
            personality = 'optimist';
        } else if (advancedOps > simpleOps) {
            personality = 'intellectual';
        } else if (simpleOps > advancedOps * 3) {
            personality = 'simple';
        } else if (this.isMixedBehavior()) {
            personality = 'chaotic';
        } else {
            personality = 'balanced';
        }

        this.typeText(`"${this.commentary.summary[personality]}"`, 'judging');
    }
};

// Initialize Al Kaline
alKaline.init();

// =====================
// HYPERSPACE STARFIELD
// =====================

const hyperspace = {
    canvas: document.getElementById('hyperspace'),
    ctx: null,
    stars: [],
    numStars: 200,
    warpSpeed: false,
    warpColor: { r: 100, g: 150, b: 255 },
    animationId: null,

    // Color presets for operators
    colors: {
        add:      { r: 100, g: 255, b: 150 },  // Green
        subtract: { r: 255, g: 100, b: 100 },  // Red
        multiply: { r: 255, g: 200, b: 50 },   // Gold
        divide:   { r: 150, g: 100, b: 255 },  // Purple
        default:  { r: 100, g: 150, b: 255 }   // Blue
    },

    init() {
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createStars();
        this.animate();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    createStars() {
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width - this.canvas.width / 2,
                y: Math.random() * this.canvas.height - this.canvas.height / 2,
                z: Math.random() * 1000,
                prevZ: 1000
            });
        }
    },

    animate() {
        const ctx = this.ctx;
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        // Clear with trail effect
        ctx.fillStyle = this.warpSpeed ? 'rgba(0, 0, 20, 0.1)' : 'rgba(24, 24, 27, 0.3)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const speed = this.warpSpeed ? 50 : 2;
        const c = this.warpColor;

        for (let star of this.stars) {
            star.prevZ = star.z;
            star.z -= speed;

            if (star.z <= 0) {
                star.x = Math.random() * this.canvas.width - cx;
                star.y = Math.random() * this.canvas.height - cy;
                star.z = 1000;
                star.prevZ = 1000;
            }

            // Project to 2D
            const sx = (star.x / star.z) * 500 + cx;
            const sy = (star.y / star.z) * 500 + cy;
            const px = (star.x / star.prevZ) * 500 + cx;
            const py = (star.y / star.prevZ) * 500 + cy;

            // Size based on distance
            const size = (1 - star.z / 1000) * 3;

            if (this.warpSpeed) {
                // Draw streak with current color
                const gradient = ctx.createLinearGradient(px, py, sx, sy);
                gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
                gradient.addColorStop(1, `rgba(${Math.min(c.r + 100, 255)}, ${Math.min(c.g + 100, 255)}, ${Math.min(c.b + 100, 255)}, 1)`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = size;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.stroke();
            } else {
                // Draw dot
                const brightness = (1 - star.z / 1000);
                ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.5})`;
                ctx.beginPath();
                ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    },

    engage(duration = 3000, colorKey = 'default') {
        this.warpColor = this.colors[colorKey] || this.colors.default;
        this.warpSpeed = true;
        setTimeout(() => {
            this.warpSpeed = false;
        }, duration);
    }
};

// Initialize starfield
hyperspace.init();