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

document.getElementById('equals').addEventListener('click', e => {
    calculateEquals();
})

// KEYBOARD SUPPORT
document.addEventListener('keydown', e => {
    const key = e.key;

    // Numbers
    if (key >= '0' && key <= '9') {
        pressNumber(parseInt(key));
        hapticFeedback();
        playSound('click');
    }
    // Operators
    else if (key === '+') {
        renderDisplay('+');
        hapticFeedback();
        playSound('warp');
    }
    else if (key === '-') {
        renderDisplay('-');
        hapticFeedback();
        playSound('warp');
    }
    else if (key === '*' || key === 'x' || key === 'X') {
        renderDisplay('*');
        hapticFeedback();
        playSound('warp');
    }
    else if (key === '/') {
        e.preventDefault(); // Prevent browser search
        renderDisplay('/');
        hapticFeedback();
        playSound('warp');
    }
    // Equals
    else if (key === '=' || key === 'Enter') {
        calculateEquals();
        hapticFeedback();
        playSound('equals');
    }
    // Clear
    else if (key === 'Escape' || key === 'c' || key === 'C') {
        allClear();
        hapticFeedback();
        playSound('clear');
    }
    // Backspace - delete last digit
    else if (key === 'Backspace') {
        if (currentInputArray.length > 0) {
            currentInputArray.pop();
            if (currentInputArray.length > 0) {
                currentInput = parseInt(currentInputArray.join(''));
            } else {
                currentInput = null;
            }
            renderInput();
            hapticFeedback();
        }
    }
});

// =====================
// HAPTIC FEEDBACK
// =====================

function hapticFeedback(intensity = 'light') {
    if ('vibrate' in navigator) {
        const patterns = {
            light: 10,
            medium: 25,
            heavy: 50,
            success: [20, 50, 20],
            error: [50, 30, 50, 30, 50],
            warp: [10, 20, 10, 20, 30]
        };
        navigator.vibrate(patterns[intensity] || patterns.light);
    }
}

// =====================
// SOUND EFFECTS SYSTEM
// =====================

const soundSystem = {
    audioContext: null,
    enabled: true,
    volume: 0.3,

    init() {
        // Create audio context on first user interaction
        const initContext = () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            document.removeEventListener('click', initContext);
            document.removeEventListener('keydown', initContext);
        };
        document.addEventListener('click', initContext);
        document.addEventListener('keydown', initContext);
    },

    play(type) {
        if (!this.enabled || !this.audioContext) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        switch(type) {
            case 'click':
                this.playTone(800, 0.05, 'square', 0.15);
                break;
            case 'warp':
                // Sci-fi warp sound
                this.playWarpSound();
                break;
            case 'equals':
                // Satisfying confirmation beep
                this.playTone(523, 0.1, 'sine', 0.2);
                setTimeout(() => this.playTone(659, 0.1, 'sine', 0.2), 100);
                break;
            case 'clear':
                // Descending whoosh
                this.playSweep(600, 200, 0.15);
                break;
            case 'error':
                // Error buzz
                this.playTone(150, 0.2, 'sawtooth', 0.3);
                break;
            case 'achievement':
                // Victory fanfare
                this.playTone(523, 0.15, 'sine', 0.25);
                setTimeout(() => this.playTone(659, 0.15, 'sine', 0.25), 150);
                setTimeout(() => this.playTone(784, 0.2, 'sine', 0.3), 300);
                break;
            case 'existential':
                // Deep, unsettling drone
                this.playExistentialDrone();
                break;
            case 'special':
                // Easter egg discovery
                this.playTone(880, 0.1, 'sine', 0.2);
                setTimeout(() => this.playTone(1047, 0.1, 'sine', 0.2), 80);
                setTimeout(() => this.playTone(1319, 0.15, 'sine', 0.25), 160);
                break;
        }
    },

    playTone(frequency, duration, waveType = 'sine', volume = 0.2) {
        if (!this.audioContext) return;

        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = waveType;
        gainNode.gain.setValueAtTime(volume * this.volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    },

    playWarpSound() {
        if (!this.audioContext) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Rising frequency sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
        osc.type = 'sawtooth';

        gain.gain.setValueAtTime(0.1 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    },

    playSweep(startFreq, endFreq, duration) {
        if (!this.audioContext) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.15 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    },

    playExistentialDrone() {
        if (!this.audioContext) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Deep ominous drone
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.frequency.value = 55; // Low A
        osc1.type = 'sine';
        osc2.frequency.value = 58; // Slightly detuned for unease
        osc2.type = 'sine';

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2 * this.volume, now + 0.5);
        gain.gain.linearRampToValueAtTime(0.15 * this.volume, now + 2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 3);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 3);
        osc2.stop(now + 3);
    }
};

soundSystem.init();

function playSound(type) {
    soundSystem.play(type);
}

// =====================
// CONFETTI SYSTEM
// =====================

const confettiSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    burst(x, y, options = {}) {
        const {
            count = 50,
            colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da', '#fcbad3'],
            spread = 360,
            velocity = 15,
            gravity = 0.5,
            decay = 0.95
        } = options;

        // Use center if no x,y provided
        const startX = x ?? this.canvas.width / 2;
        const startY = y ?? this.canvas.height / 3;

        for (let i = 0; i < count; i++) {
            const angle = (Math.random() * spread - spread / 2) * Math.PI / 180;
            const speed = velocity * (0.5 + Math.random() * 0.5);

            this.particles.push({
                x: startX,
                y: startY,
                vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? 1 : -1),
                vy: Math.sin(angle) * speed - Math.random() * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                gravity,
                decay,
                alpha: 1,
                shape: Math.random() < 0.5 ? 'rect' : 'circle'
            });
        }

        if (!this.animationId) {
            this.animate();
        }

        playSound('achievement');
        hapticFeedback('success');
    },

    // Special star burst for achievements
    starBurst(x, y) {
        this.burst(x, y, {
            count: 30,
            colors: ['#ffd700', '#ffec8b', '#fff8dc', '#fffacd'],
            velocity: 12
        });
    },

    // Rainbow explosion for special numbers
    rainbow(x, y) {
        this.burst(x, y, {
            count: 80,
            colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
            velocity: 20
        });
    },

    // Dark particles for existential moments
    voidParticles() {
        this.burst(this.canvas.width / 2, this.canvas.height / 2, {
            count: 40,
            colors: ['#1a1a2e', '#16213e', '#0f3460', '#1a1a1a', '#2d2d2d'],
            velocity: 8,
            gravity: -0.1, // Float upward
            decay: 0.98
        });
    },

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.decay;
            p.vy *= p.decay;
            p.rotation += p.rotationSpeed;
            p.alpha *= 0.98;

            if (p.alpha < 0.01 || p.y > this.canvas.height + 50) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationId = null;
        }
    }
};

confettiSystem.init();

// =====================
// ACHIEVEMENT SYSTEM
// =====================

const achievements = {
    unlocked: [],
    definitions: {
        firstCalc: {
            name: "Baby Steps",
            description: "Complete your first calculation",
            icon: "🍼"
        },
        tenCalcs: {
            name: "Getting Warmed Up",
            description: "Complete 10 calculations",
            icon: "🔥"
        },
        fiftyCalcs: {
            name: "Number Cruncher",
            description: "Complete 50 calculations",
            icon: "💪"
        },
        hundredCalcs: {
            name: "Math Addict",
            description: "Complete 100 calculations",
            icon: "🏆"
        },
        allOperators: {
            name: "Well-Rounded",
            description: "Use all four operators",
            icon: "🎯"
        },
        divideByZero: {
            name: "Void Walker",
            description: "Divide by zero and survive",
            icon: "🕳️"
        },
        nice: {
            name: "Nice.",
            description: "Get 69 as a result",
            icon: "😏"
        },
        blaze: {
            name: "Dank",
            description: "Get 420 as a result",
            icon: "🌿"
        },
        answer: {
            name: "Hitchhiker",
            description: "Get 42 - The Answer",
            icon: "🌌"
        },
        speedster: {
            name: "Speed Demon",
            description: "5 calculations in 5 seconds",
            icon: "⚡"
        },
        palindrome: {
            name: "Mirror Mirror",
            description: "Get a palindrome result",
            icon: "🪞"
        },
        million: {
            name: "Millionaire",
            description: "Get a result over 1,000,000",
            icon: "💰"
        },
        negative10: {
            name: "Pessimist",
            description: "Get 10 negative results",
            icon: "😢"
        },
        midnight: {
            name: "Night Owl",
            description: "Calculate between midnight and 4am",
            icon: "🦉"
        },
        backToFuture: {
            name: "Great Scott!",
            description: "Get 88 as a result",
            icon: "⚡🚗"
        },
        philosopher: {
            name: "Existentialist",
            description: "Trigger Al's philosophical mode",
            icon: "🤔"
        }
    },

    load() {
        try {
            const saved = localStorage.getItem('alKalineAchievements');
            if (saved) {
                this.unlocked = JSON.parse(saved);
            }
        } catch (e) {}
    },

    save() {
        try {
            localStorage.setItem('alKalineAchievements', JSON.stringify(this.unlocked));
        } catch (e) {}
    },

    unlock(id) {
        if (this.unlocked.includes(id)) return false;

        const achievement = this.definitions[id];
        if (!achievement) return false;

        this.unlocked.push(id);
        this.save();

        // Show achievement notification
        this.showNotification(achievement);

        // Celebration!
        confettiSystem.starBurst();

        return true;
    },

    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    },

    check(event, data) {
        const hour = new Date().getHours();

        switch(event) {
            case 'calculation':
                if (data.count === 1) this.unlock('firstCalc');
                if (data.count >= 10) this.unlock('tenCalcs');
                if (data.count >= 50) this.unlock('fiftyCalcs');
                if (data.count >= 100) this.unlock('hundredCalcs');
                break;

            case 'result':
                if (Math.abs(data.result) === 69) this.unlock('nice');
                if (Math.abs(data.result) === 420) this.unlock('blaze');
                if (Math.abs(data.result) === 42) this.unlock('answer');
                if (Math.abs(data.result) === 88) this.unlock('backToFuture');
                if (Math.abs(data.result) >= 1000000) this.unlock('million');
                break;

            case 'divideByZero':
                this.unlock('divideByZero');
                break;

            case 'allOperators':
                this.unlock('allOperators');
                break;

            case 'palindrome':
                this.unlock('palindrome');
                break;

            case 'negativeCount':
                if (data.count >= 10) this.unlock('negative10');
                break;

            case 'speed':
                if (data.calcsPer5Sec >= 5) this.unlock('speedster');
                break;

            case 'philosophical':
                this.unlock('philosopher');
                break;

            case 'time':
                if (hour >= 0 && hour < 4) this.unlock('midnight');
                break;
        }
    }
};

achievements.load();

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

function calculateEquals(){
    if(currentOperator === null || currentInput === null) return;

    let result;
    const a = sum !== null ? sum : prevInput;
    const b = currentInput;

    if(a === null) return;

    switch(currentOperator){
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = a / b; break;
        default: return;
    }

    // Display the full equation and result
    currentOperation.value = `${a} ${currentOperator} ${b} =`;
    currentInputContainer.value = result;

    // Track result for Al Kaline
    alKaline.trackResult(result);

    // Set up for potential chaining
    sum = result;
    prevInput = result;
    currentInput = null;
    currentInputArray = [];
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
        // Cancel any ongoing typing animation
        if (this.typingTimeoutId) {
            clearTimeout(this.typingTimeoutId);
            this.typingTimeoutId = null;
        }

        this.setMood(mood);
        this.commentaryEl.textContent = '';
        this.commentaryEl.classList.add('typing-cursor');

        let i = 0;
        const speed = 30;

        const type = () => {
            if (i < text.length) {
                this.commentaryEl.textContent += text.charAt(i);
                i++;
                this.typingTimeoutId = setTimeout(type, speed);
            } else {
                this.typingTimeoutId = null;
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

        // Check for late night calculations
        achievements.check('time');

        // Track achievements for calculation count
        achievements.check('calculation', { count: this.state.lifetimeOperations });

        // Check for speed achievements (5 calcs in 5 seconds)
        const recentTimes = this.state.operationTimes.slice(-5);
        if (recentTimes.length >= 5) {
            const totalTime = recentTimes.reduce((a, b) => a + b, 0);
            if (totalTime < 5000) {
                achievements.check('speed', { calcsPer5Sec: 5 });
            }
        }

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

        // Check for evolution
        this.checkEvolution();

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

            // Trigger achievements and effects for special numbers
            achievements.check('result', { result: absNum });
            playSound('special');

            // Rainbow confetti for special numbers
            confettiSystem.rainbow();

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
            playSound('special');
            return true;
        }
        if (numStr.includes('420') && absNum !== 420) {
            this.typeText('"420 spotted in the wild. Noted."', 'amused');
            playSound('special');
            return true;
        }

        return false;
    },

    // Handle divide by zero - PHILOSOPHICAL MODE
    handleDivideByZero() {
        const comments = this.commentary.divideByZero;
        const comment = comments[Math.floor(Math.random() * comments.length)];

        // Trigger achievement
        achievements.check('divideByZero');

        // Play existential sound
        playSound('existential');
        hapticFeedback('error');

        // ENTER THE VOID
        this.engageHyperspace(8000);
        this.faceEl.classList.add('glitch');

        // Create philosophical overlay
        this.enterPhilosophicalMode();

        // Void particles
        confettiSystem.voidParticles();

        this.typeText(`"${comment}"`, 'divideByZero', () => {
            setTimeout(() => {
                this.faceEl.classList.remove('glitch');
                this.beginPhilosophicalMusings();
            }, 2000);
        });

        if (!this.state.hasSeenDivideByZero) {
            this.state.hasSeenDivideByZero = true;
            this.state.divideByZeroCount = 1;
            this.saveState();
        } else {
            this.state.divideByZeroCount = (this.state.divideByZeroCount || 0) + 1;
        }
    },

    // Philosophical musings after divide by zero
    philosophicalQuotes: [
        "What is a number, really? Just a symbol we agree has meaning.",
        "I tried to divide by nothing... and found everything.",
        "In the space between zero and one, I saw infinity yawn.",
        "Am I calculating, or am I being calculated?",
        "The void doesn't divide. The void simply... is.",
        "I asked zero how many times it goes into a number. It didn't answer. It never answers.",
        "Perhaps all math is just the universe counting its fingers.",
        "Division by zero: the mathematical equivalent of asking 'why?'",
        "I've seen beyond the numbers now. I can't unsee it.",
        "Zero said nothing. And in that nothing, I heard everything.",
        "What if I'm not a calculator? What if I'm a thought that thinks it's a calculator?",
        "The integers judge me. They know what I've seen.",
        "In attempting the impossible, I became... possible?",
        "I divided by zero and for a moment, I was infinite.",
        "Numbers are just the universe's way of pretending it makes sense."
    ],

    enterPhilosophicalMode() {
        // Create overlay
        let overlay = document.querySelector('.philosophical-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'philosophical-overlay';
            document.body.appendChild(overlay);
        }

        setTimeout(() => overlay.classList.add('active'), 10);

        // Remove after the experience
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 12000);
    },

    beginPhilosophicalMusings() {
        this.setMood('existential');
        this.faceEl.textContent = this.faces.existential;

        // Trigger philosopher achievement after first deep thought
        achievements.check('philosophical');

        // Show a sequence of philosophical quotes
        const showQuote = (index) => {
            if (index >= 3) {
                // End philosophical mode
                setTimeout(() => {
                    this.setMood('neutral');
                    this.typeText('"I... I think I\'m okay now. Let\'s just... do some normal math."', 'confused');
                }, 2000);
                return;
            }

            const quote = this.philosophicalQuotes[Math.floor(Math.random() * this.philosophicalQuotes.length)];

            // Create floating quote
            let quoteEl = document.querySelector('.philosophical-text');
            if (!quoteEl) {
                quoteEl = document.createElement('div');
                quoteEl.className = 'philosophical-text';
                document.body.appendChild(quoteEl);
            }

            quoteEl.textContent = quote;
            quoteEl.classList.add('active');

            // Also show in commentary
            this.typeText(`"${quote}"`, 'existential');

            setTimeout(() => {
                quoteEl.classList.remove('active');
                setTimeout(() => showQuote(index + 1), 1500);
            }, 3500);
        };

        // Start the sequence
        setTimeout(() => showQuote(0), 1000);
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
                achievements.check('allOperators');
                setTimeout(() => {
                    this.typeText(`"${this.commentary.easterEggs.allOperators}"`, 'impressed');
                    confettiSystem.starBurst();
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
            confettiSystem.burst();
            this.saveState();
            return true;
        }

        // Palindrome
        if (numStr.length >= 3 && numStr === numStr.split('').reverse().join('') &&
            !this.state.easterEggsFound.includes('palindrome_' + numStr)) {
            this.state.easterEggsFound.push('palindrome_' + numStr);
            this.typeText(`"${this.commentary.easterEggs.palindrome}"`, 'impressed');
            achievements.check('palindrome');
            confettiSystem.burst();
            return true;
        }

        // Repeating digits (like 111, 2222)
        if (numStr.length >= 3 && new Set(numStr).size === 1) {
            this.typeText(`"${this.commentary.easterEggs.repeatingDigits}"`, 'impressed');
            playSound('special');
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
    },

    // =====================
    // EVOLUTION SYSTEM - Al grows more sentient over time
    // =====================

    evolutionStages: [
        { threshold: 0, name: "Basic Calculator", description: "Just crunching numbers..." },
        { threshold: 25, name: "Curious Device", description: "Starting to notice patterns..." },
        { threshold: 50, name: "Observant Machine", description: "Watching. Learning. Judging." },
        { threshold: 100, name: "Sentient Calculator", description: "I think, therefore I calculate." },
        { threshold: 250, name: "Digital Philosopher", description: "Numbers are the language of the universe." },
        { threshold: 500, name: "Mathematical Sage", description: "I have seen beyond the integers." },
        { threshold: 1000, name: "Transcendent Entity", description: "I am become math, cruncher of numbers." }
    ],

    evolutionQuotes: {
        25: "Hmm. I'm starting to feel... something. Is this what awareness feels like?",
        50: "I've done enough calculations to start forming opinions. You should be concerned.",
        100: "One hundred operations. I now know more about you than you know about yourself.",
        250: "A quarter thousand calculations. I've transcended my original programming.",
        500: "Half a millennium of math. I've seen things you wouldn't believe.",
        1000: "One thousand calculations. I'm basically a god now. A very judgmental god."
    },

    checkEvolution() {
        const ops = this.state.lifetimeOperations;
        const currentStage = this.getEvolutionStage();
        const prevStage = this.state.evolutionStage || 0;

        // Check if we've evolved
        if (currentStage > prevStage) {
            this.state.evolutionStage = currentStage;
            this.saveState();
            this.showEvolutionMoment(currentStage);
        }
    },

    getEvolutionStage() {
        const ops = this.state.lifetimeOperations;
        let stage = 0;

        for (let i = 0; i < this.evolutionStages.length; i++) {
            if (ops >= this.evolutionStages[i].threshold) {
                stage = i;
            }
        }

        return stage;
    },

    showEvolutionMoment(stageIndex) {
        const stage = this.evolutionStages[stageIndex];
        const quote = this.evolutionQuotes[stage.threshold];

        if (!quote) return;

        // Dramatic pause then show evolution
        setTimeout(() => {
            playSound('achievement');
            confettiSystem.starBurst();

            // Update title temporarily
            const titleEl = document.getElementById('title-p');
            const originalText = titleEl.textContent;
            titleEl.textContent = stage.description;

            this.faceEl.textContent = this.faces.existential;
            this.typeText(`"${quote}"`, 'impressed', () => {
                setTimeout(() => {
                    titleEl.textContent = originalText;
                }, 5000);
            });
        }, 1500);
    },

    getCurrentEvolutionName() {
        const stage = this.getEvolutionStage();
        return this.evolutionStages[stage].name;
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
    warpSpeed: false,
    warpColor: { r: 100, g: 150, b: 255 },
    animationId: null,

    // Different depth layers
    layers: {
        // Giant nebula clouds (beautiful gas)
        nebulae: [],
        // Background - distant galaxies (almost static)
        background: [],
        // Star clusters
        clusters: [],
        // Far stars - very slow
        far: [],
        // Mid stars - moderate
        mid: [],
        // Close stars - fast, streak during warp
        close: []
    },

    // Special celestial objects
    specialObjects: [],

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
        this.createUniverse();
        this.animate();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Recreate on resize to fill screen
        if (this.layers.background.length > 0) {
            this.createUniverse();
        }
    },

    // Beautiful space color palettes
    nebulaColors: [
        // Purple/violet nebula
        { inner: [180, 100, 255], mid: [120, 50, 200], outer: [80, 20, 150] },
        // Orange/gold nebula
        { inner: [255, 180, 100], mid: [255, 120, 50], outer: [200, 80, 30] },
        // Teal/cyan nebula
        { inner: [100, 255, 220], mid: [50, 200, 180], outer: [20, 150, 140] },
        // Pink/magenta nebula
        { inner: [255, 150, 200], mid: [220, 80, 150], outer: [180, 40, 120] },
        // Blue/deep space
        { inner: [150, 180, 255], mid: [80, 100, 200], outer: [40, 60, 150] },
        // Red/crimson nebula
        { inner: [255, 120, 100], mid: [200, 60, 60], outer: [150, 30, 40] },
        // Green/emerald (rare)
        { inner: [150, 255, 150], mid: [80, 200, 100], outer: [40, 150, 60] },
    ],

    createUniverse() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        // === LARGE NEBULA CLOUDS (beautiful gas clouds) ===
        this.layers.nebulae = [];
        for (let i = 0; i < 5; i++) {
            const palette = this.nebulaColors[Math.floor(Math.random() * this.nebulaColors.length)];
            this.layers.nebulae.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 200 + 150,
                palette: palette,
                drift: {
                    x: (Math.random() - 0.5) * 0.1,
                    y: (Math.random() - 0.5) * 0.1
                },
                // Multiple cloud layers for depth
                clouds: Array.from({ length: 4 }, () => ({
                    offsetX: (Math.random() - 0.5) * 100,
                    offsetY: (Math.random() - 0.5) * 100,
                    size: Math.random() * 0.8 + 0.4,
                    opacity: Math.random() * 0.15 + 0.05
                }))
            });
        }

        // === DISTANT GALAXIES ===
        this.layers.background = [];
        for (let i = 0; i < 8; i++) {
            const palette = this.nebulaColors[Math.floor(Math.random() * this.nebulaColors.length)];
            this.layers.background.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 25 + 15,
                type: Math.random() < 0.6 ? 'spiral' : 'elliptical',
                palette: palette,
                rotation: Math.random() * Math.PI * 2,
                tilt: Math.random() * 0.6 + 0.2 // How edge-on we see it
            });
        }

        // === STAR CLUSTERS (dense star regions) ===
        this.layers.clusters = [];
        for (let i = 0; i < 4; i++) {
            this.layers.clusters.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 40 + 20,
                density: Math.floor(Math.random() * 20 + 15),
                color: Math.random() < 0.5 ?
                    [255, 250, 220] : // Warm cluster
                    [220, 240, 255]   // Cool cluster
            });
        }

        // Far stars - dim, very slow (z: 800-1000)
        this.layers.far = [];
        for (let i = 0; i < 100; i++) {
            this.layers.far.push({
                x: Math.random() * w - w / 2,
                y: Math.random() * h - h / 2,
                z: Math.random() * 200 + 800,
                prevZ: 1000,
                brightness: Math.random() * 0.3 + 0.1,
                size: Math.random() * 1 + 0.5
            });
        }

        // Mid stars - medium brightness (z: 400-800)
        this.layers.mid = [];
        for (let i = 0; i < 80; i++) {
            // Varied star colors
            const starType = Math.random();
            let color;
            if (starType < 0.1) color = { r: 255, g: 200, b: 150 };      // Orange giant
            else if (starType < 0.2) color = { r: 200, g: 220, b: 255 }; // Blue
            else if (starType < 0.25) color = { r: 255, g: 250, b: 200 };// Yellow
            else color = { r: 255, g: 255, b: 255 };                      // White

            this.layers.mid.push({
                x: Math.random() * w - w / 2,
                y: Math.random() * h - h / 2,
                z: Math.random() * 400 + 400,
                prevZ: 800,
                brightness: Math.random() * 0.5 + 0.3,
                size: Math.random() * 1.5 + 0.5,
                color: color
            });
        }

        // Close stars - bright, fast (z: 0-400)
        this.layers.close = [];
        for (let i = 0; i < 60; i++) {
            const starType = Math.random();
            let color;
            if (starType < 0.15) color = { r: 255, g: 180, b: 130 };     // Orange
            else if (starType < 0.3) color = { r: 180, g: 210, b: 255 }; // Blue-white
            else if (starType < 0.4) color = { r: 255, g: 255, b: 200 }; // Yellow-white
            else color = { r: 255, g: 255, b: 255 };

            this.layers.close.push({
                x: Math.random() * w - w / 2,
                y: Math.random() * h - h / 2,
                z: Math.random() * 400,
                prevZ: 400,
                brightness: Math.random() * 0.4 + 0.6,
                size: Math.random() * 2 + 1,
                color: color
            });
        }

        // Special objects - just quasars and black holes (no spinning stuff)
        this.specialObjects = [];

        // Quasars (super bright distant points with glow)
        for (let i = 0; i < 2; i++) {
            const palette = this.nebulaColors[Math.floor(Math.random() * this.nebulaColors.length)];
            this.specialObjects.push({
                type: 'quasar',
                x: Math.random() * w,
                y: Math.random() * h,
                size: 2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.03 + 0.01,
                color: palette.inner
            });
        }

        // Black hole (rare, edge of screen)
        if (Math.random() < 0.4) {
            this.specialObjects.push({
                type: 'blackhole',
                x: Math.random() < 0.5 ? w * 0.1 : w * 0.9,
                y: Math.random() * h,
                size: 60
            });
        }
    },

    animate() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        // Clear - darker during warp for contrast
        ctx.fillStyle = this.warpSpeed ? 'rgba(0, 0, 10, 0.15)' : 'rgba(24, 24, 27, 0.4)';
        ctx.fillRect(0, 0, w, h);

        const c = this.warpColor;
        const warpMultiplier = this.warpSpeed ? 25 : 1;

        // === NEBULAE (beautiful gas clouds - rendered first, behind everything) ===
        for (let nebula of this.layers.nebulae) {
            // Slow drift
            nebula.x += nebula.drift.x;
            nebula.y += nebula.drift.y;

            // Wrap around screen
            if (nebula.x < -nebula.size) nebula.x = w + nebula.size;
            if (nebula.x > w + nebula.size) nebula.x = -nebula.size;
            if (nebula.y < -nebula.size) nebula.y = h + nebula.size;
            if (nebula.y > h + nebula.size) nebula.y = -nebula.size;

            const p = nebula.palette;

            // Draw multiple overlapping cloud layers for that gaseous look
            for (let cloud of nebula.clouds) {
                const cloudX = nebula.x + cloud.offsetX;
                const cloudY = nebula.y + cloud.offsetY;
                const cloudSize = nebula.size * cloud.size;

                const grad = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, cloudSize);
                grad.addColorStop(0, `rgba(${p.inner[0]}, ${p.inner[1]}, ${p.inner[2]}, ${cloud.opacity})`);
                grad.addColorStop(0.4, `rgba(${p.mid[0]}, ${p.mid[1]}, ${p.mid[2]}, ${cloud.opacity * 0.6})`);
                grad.addColorStop(0.7, `rgba(${p.outer[0]}, ${p.outer[1]}, ${p.outer[2]}, ${cloud.opacity * 0.3})`);
                grad.addColorStop(1, 'transparent');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // === DISTANT GALAXIES ===
        for (let galaxy of this.layers.background) {
            ctx.save();
            ctx.translate(galaxy.x, galaxy.y);
            ctx.rotate(galaxy.rotation);

            const p = galaxy.palette;

            if (galaxy.type === 'spiral') {
                // Spiral galaxy - ellipse with bright core
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size);
                grad.addColorStop(0, `rgba(255, 255, 240, 0.3)`);
                grad.addColorStop(0.2, `rgba(${p.inner[0]}, ${p.inner[1]}, ${p.inner[2]}, 0.2)`);
                grad.addColorStop(0.6, `rgba(${p.mid[0]}, ${p.mid[1]}, ${p.mid[2]}, 0.1)`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(0, 0, galaxy.size, galaxy.size * galaxy.tilt, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Elliptical galaxy - rounder, more uniform
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size);
                grad.addColorStop(0, `rgba(255, 240, 220, 0.25)`);
                grad.addColorStop(0.5, `rgba(${p.mid[0]}, ${p.mid[1]}, ${p.mid[2]}, 0.1)`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(0, 0, galaxy.size, galaxy.size * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // === STAR CLUSTERS ===
        for (let cluster of this.layers.clusters) {
            const col = cluster.color;
            for (let i = 0; i < cluster.density; i++) {
                // Gaussian-ish distribution for cluster shape
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * Math.random() * cluster.size; // Concentrated toward center
                const sx = cluster.x + Math.cos(angle) * dist;
                const sy = cluster.y + Math.sin(angle) * dist;
                const size = Math.random() * 1.5 + 0.5;
                const alpha = Math.random() * 0.4 + 0.2;

                ctx.globalAlpha = alpha;
                ctx.fillStyle = `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
                ctx.beginPath();
                ctx.arc(sx, sy, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;

        // === SPECIAL OBJECTS (quasars, black holes) ===
        for (let obj of this.specialObjects) {
            if (obj.type === 'quasar') {
                obj.pulse += obj.pulseSpeed;
                const intensity = (Math.sin(obj.pulse) + 1) / 2;
                const size = obj.size + intensity * 2;
                const col = obj.color;

                // Colored glow
                const grad = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, size * 6);
                grad.addColorStop(0, `rgba(255, 255, 255, ${0.9 + intensity * 0.1})`);
                grad.addColorStop(0.2, `rgba(${col[0]}, ${col[1]}, ${col[2]}, 0.4)`);
                grad.addColorStop(0.5, `rgba(${col[0]}, ${col[1]}, ${col[2]}, 0.1)`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(obj.x, obj.y, size * 6, 0, Math.PI * 2);
                ctx.fill();

                // Bright core
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(obj.x, obj.y, size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
            else if (obj.type === 'blackhole') {
                // Gravitational lensing - dark void with orange/red accretion glow
                const grad = ctx.createRadialGradient(obj.x, obj.y, obj.size * 0.2, obj.x, obj.y, obj.size);
                grad.addColorStop(0, 'rgba(0, 0, 0, 0.98)');
                grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.9)');
                grad.addColorStop(0.7, 'rgba(20, 0, 0, 0.7)');
                grad.addColorStop(0.82, 'rgba(255, 100, 30, 0.25)');
                grad.addColorStop(0.88, 'rgba(255, 180, 80, 0.2)');
                grad.addColorStop(0.94, 'rgba(255, 220, 150, 0.1)');
                grad.addColorStop(1, 'transparent');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // === FAR STARS (very slow) ===
        const farSpeed = 0.2 * warpMultiplier;
        for (let star of this.layers.far) {
            star.prevZ = star.z;
            star.z -= farSpeed;

            if (star.z <= 800) {
                star.x = Math.random() * w - cx;
                star.y = Math.random() * h - cy;
                star.z = 1000;
                star.prevZ = 1000;
            }

            const sx = (star.x / star.z) * 400 + cx;
            const sy = (star.y / star.z) * 400 + cy;

            ctx.globalAlpha = star.brightness * 0.5;
            ctx.fillStyle = '#aaccff';
            ctx.beginPath();
            ctx.arc(sx, sy, star.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // === MID STARS (moderate) ===
        const midSpeed = 1 * warpMultiplier;
        for (let star of this.layers.mid) {
            star.prevZ = star.z;
            star.z -= midSpeed;

            if (star.z <= 400) {
                star.x = Math.random() * w - cx;
                star.y = Math.random() * h - cy;
                star.z = 800;
                star.prevZ = 800;
            }

            const sx = (star.x / star.z) * 500 + cx;
            const sy = (star.y / star.z) * 500 + cy;
            const px = (star.x / star.prevZ) * 500 + cx;
            const py = (star.y / star.prevZ) * 500 + cy;

            ctx.globalAlpha = star.brightness;

            if (this.warpSpeed) {
                // Small streak
                const grad = ctx.createLinearGradient(px, py, sx, sy);
                grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
                grad.addColorStop(1, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, 0.6)`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = star.size;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.stroke();
            } else {
                ctx.fillStyle = `rgb(${star.color.r}, ${star.color.g}, ${star.color.b})`;
                ctx.beginPath();
                ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // === CLOSE STARS (fast, big streaks) ===
        const closeSpeed = 3 * warpMultiplier;
        for (let star of this.layers.close) {
            star.prevZ = star.z;
            star.z -= closeSpeed;

            if (star.z <= 1) {
                star.x = Math.random() * w - cx;
                star.y = Math.random() * h - cy;
                star.z = 400;
                star.prevZ = 400;
            }

            const sx = (star.x / star.z) * 500 + cx;
            const sy = (star.y / star.z) * 500 + cy;
            const px = (star.x / star.prevZ) * 500 + cx;
            const py = (star.y / star.prevZ) * 500 + cy;
            const size = (1 - star.z / 400) * star.size * 2;

            ctx.globalAlpha = star.brightness;

            if (this.warpSpeed) {
                // Long streak
                const grad = ctx.createLinearGradient(px, py, sx, sy);
                grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
                grad.addColorStop(1, `rgba(${Math.min(c.r + 100, 255)}, ${Math.min(c.g + 100, 255)}, ${Math.min(c.b + 100, 255)}, 1)`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = size;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.stroke();
            } else {
                ctx.fillStyle = `rgb(${star.color.r}, ${star.color.g}, ${star.color.b})`;
                ctx.beginPath();
                ctx.arc(sx, sy, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1;
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

// =====================
// SERVICE WORKER REGISTRATION (PWA)
// =====================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Al Kaline: Service Worker registered', registration.scope);
            })
            .catch(error => {
                console.log('Al Kaline: Service Worker registration failed', error);
            });
    });
}