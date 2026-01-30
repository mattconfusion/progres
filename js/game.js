/**
 * PROGRES Game Controller
 * Simplified button-based UI for Ogre Solo
 */

const Game = (function() {
    'use strict';
    
    // State
    let state = {
        initialized: false,
        ogreType: 'mk3',
        deviationRule: 'right'
    };
    
    // UI Elements
    let outputEl;
    let btnNew, btnDraw, btnStart;
    let setupPanel;
    
    /**
     * Initialize the game
     */
    function init() {
        // Get elements
        outputEl = document.getElementById('output');
        btnNew = document.getElementById('btn-new');
        btnDraw = document.getElementById('btn-draw');
        btnStart = document.getElementById('btn-start');
        setupPanel = document.getElementById('game-setup');
        
        // Button handlers
        btnNew.addEventListener('click', showSetup);
        btnDraw.addEventListener('click', drawCard);
        btnStart.addEventListener('click', startGame);
        
        // Color toggle
        const btnColor = document.getElementById('btn-color');
        btnColor.addEventListener('click', togglePhosphorColor);
        
        // Selection button handlers
        document.querySelectorAll('[data-ogre]').forEach(btn => {
            btn.addEventListener('click', () => selectOgre(btn));
        });
        
        document.querySelectorAll('[data-dev]').forEach(btn => {
            btn.addEventListener('click', () => selectDeviation(btn));
        });
        
        // Keyboard support
        document.addEventListener('keydown', handleKeyboard);
        
        // Load phosphor preference
        loadPhosphorPreference();
        
        // Welcome screen
        showWelcome();
    }
    
    /**
     * Toggle between orange and green phosphor
     */
    function togglePhosphorColor() {
        document.body.classList.toggle('green-phosphor');
        const isGreen = document.body.classList.contains('green-phosphor');
        localStorage.setItem('phosphor', isGreen ? 'green' : 'orange');
    }
    
    /**
     * Load saved phosphor preference
     */
    function loadPhosphorPreference() {
        const saved = localStorage.getItem('phosphor');
        if (saved === 'green') {
            document.body.classList.add('green-phosphor');
        }
    }
    
    /**
     * Handle keyboard input
     */
    function handleKeyboard(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            if (!btnDraw.disabled) {
                drawCard();
            } else if (!setupPanel.classList.contains('hidden')) {
                startGame();
            }
        }
        if (e.key === 'n' || e.key === 'N') {
            showSetup();
        }
    }
    
    /**
     * Show welcome screen
     */
    function showWelcome() {
        clear();
        printAscii();
        print('OGRE SOLO PLAY ASSISTANT', 'bright');
        print('');
        print('Press [NEW GAME] to begin', 'dim');
        addCaret();
    }
    
    /**
     * Print ASCII logo
     */
    function printAscii() {
        // Load logo from embedded data to preserve exact characters
        const ascii = [
            '┌─┐┬─┐╔═╗╔═╗╦═╗╔═╗┌─┐',
            '├─┘├┬┘║ ║║ ╦╠╦╝║╣ └─┐',
            '┴  ┴└─╚═╝╚═╝╩╚═╚═╝└─┘'
        ].join('\n');
        const div = document.createElement('div');
        div.className = 'ascii';
        div.textContent = ascii;
        outputEl.appendChild(div);
    }
    
    /**
     * Show game setup panel
     */
    function showSetup() {
        setupPanel.classList.remove('hidden');
        btnDraw.disabled = true;
    }
    
    /**
     * Select Ogre type
     */
    function selectOgre(btn) {
        document.querySelectorAll('[data-ogre]').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.ogreType = btn.dataset.ogre;
    }
    
    /**
     * Select deviation rule
     */
    function selectDeviation(btn) {
        document.querySelectorAll('[data-dev]').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.deviationRule = btn.dataset.dev;
    }
    
    /**
     * Start a new game
     */
    function startGame() {
        // Set deviation rule
        SoloEngine.setDeviationRule(state.deviationRule);
        
        // Initialize deck
        const result = SoloEngine.initGame();
        
        // Hide setup
        setupPanel.classList.add('hidden');
        
        // Clear and show game start
        clear();
        printAscii();
        
        const ogreName = state.ogreType === 'mk5' ? 'OGRE MK V' : 'OGRE MK III';
        print(`OGRE: ${ogreName}`, 'bright');
        print('');
        print(result.message, 'dim');
        
        const devNames = {
            'right': 'Always Right',
            'left': 'Always Left', 
            'same': 'Same as Last',
            'opposite': 'Alternate'
        };
        print(`Deviation rule: ${devNames[state.deviationRule]}`, 'dim');
        print('');
        print('Press [DRAW CARD] to begin turn', 'dim');
        addCaret();
        
        // Enable draw button
        btnDraw.disabled = false;
        state.initialized = true;
    }
    
    /**
     * Draw a card and show results
     */
    function drawCard() {
        if (!state.initialized) return;
        
        const result = SoloEngine.drawCard();
        
        if (result.error) {
            print(result.error, 'dim');
            return;
        }
        
        // Clear previous
        clear();
        
        // Turn header
        print(`TURN ${result.turn}`, 'header');
        
        // Card drawn - main display
        print(result.card.instruction, 'card');
        
        // Card explanation paragraph
        print(result.card.description, 'description');
        
        // Deviation note for forward cards
        if (result.deviation) {
            print(`Terrain deviation: ${result.deviation.toUpperCase()}`, 'dim');
        }
        
        // Combat rolls
        print('', '');
        print('COMBAT ORDERS', 'header');
        
        print(`TARGET PRIORITY [d6=${result.priorityRoll}]`, 'roll');
        print(result.priority, 'bright');
        print(`Attack enemies in this order. First type listed is highest priority. If no valid target of that type exists, move to the next type.`, 'combat-info');
        
        print('', '');
        print(`ATTACK RATIO [d6=${result.ratioRoll}]`, 'roll');
        print(result.ratio, 'bright');
        print(getAttackRatioExplanation(result.ratio), 'combat-info');
        
        print('', '');
        print('The Command Post is ALWAYS the primary target and takes precedence over all unit priorities listed above.', 'combat-info');
        
        // Deck status
        print('', '');
        print(`Cards remaining: ${result.deckRemaining}`, 'dim');
        
        // Add blinking caret
        addCaret();
    }
    
    /**
     * Clear output
     */
    function clear() {
        outputEl.innerHTML = '';
    }
    
    /**
     * Print a line
     */
    function print(text, className = '') {
        const div = document.createElement('div');
        div.className = `line ${className}`;
        div.textContent = text;
        outputEl.appendChild(div);
    }
    
    /**
     * Get explanation for attack ratio
     */
    function getAttackRatioExplanation(ratio) {
        switch (ratio) {
            case '3:1':
                return 'Strong attack. Combine firepower to achieve 3:1 odds or better against each target. Very effective - high chance of destruction.';
            case '2:1':
                return 'Favorable attack. Combine firepower to achieve 2:1 odds against each target. Good chance of disabling or destroying enemies.';
            case '1:1':
            default:
                return 'Standard attack. Use available weapons at 1:1 odds minimum. If you cannot achieve 1:1, use the best odds possible.';
        }
    }
    
    /**
     * Add blinking caret at end of output
     */
    function addCaret() {
        // Remove existing caret
        const existing = outputEl.querySelector('.caret');
        if (existing) existing.remove();
        
        const caret = document.createElement('span');
        caret.className = 'caret';
        caret.textContent = '█';
        outputEl.appendChild(caret);
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    return {
        drawCard,
        startGame
    };
})();
