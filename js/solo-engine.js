/**
 * PROGRES Solo Engine
 * Card-based movement system for Ogre Solo play
 */

const SoloEngine = (function() {
    'use strict';
    
    // Card types
    const CARD_TYPE = {
        ADVANCE: 'ADVANCE',
        ADVANCE_RAM: 'ADVANCE_RAM',
        GO_LEFT: 'GO_LEFT',
        GO_RIGHT: 'GO_RIGHT',
        ATTACK_REAR: 'ATTACK_REAR'
    };
    
    // Deviation rules for terrain avoidance
    const DEVIATION_RULE = {
        ALWAYS_LEFT: 'left',
        ALWAYS_RIGHT: 'right',
        SAME_AS_LAST: 'same',
        OPPOSITE_OF_LAST: 'opposite'
    };
    
    // Card definitions
    const CARD_TEMPLATES = [
        {
            type: CARD_TYPE.ADVANCE,
            quantity: 3,
            name: 'ADVANCE FORWARD',
            description: 'The Ogre moves straight ahead using its maximum movement points. It may only deviate from a straight path to avoid impassable terrain such as craters or map edges. When deviating, use the selected deviation rule (left or right) consistently.',
            instruction: 'ADVANCE FORWARD'
        },
        {
            type: CARD_TYPE.ADVANCE_RAM,
            quantity: 2,
            name: 'ADVANCE & RAM',
            description: 'The Ogre moves forward but actively seeks to RAM enemy units. It may deviate from a straight path to overrun any adjacent armor or infantry units. Prioritize ramming targets based on the rolled target priority order.',
            instruction: 'ADVANCE & RAM'
        },
        {
            type: CARD_TYPE.GO_LEFT,
            quantity: 2,
            name: 'GO LEFT',
            description: 'The Ogre must move at least one hex to the left during this turn. It may move additional hexes to the left if doing so brings it closer to a priority target. The remaining movement can be used normally.',
            instruction: 'GO LEFT'
        },
        {
            type: CARD_TYPE.GO_RIGHT,
            quantity: 2,
            name: 'GO RIGHT',
            description: 'The Ogre must move at least one hex to the right during this turn. It may move additional hexes to the right if doing so brings it closer to a priority target. The remaining movement can be used normally.',
            instruction: 'GO RIGHT'
        },
        {
            type: CARD_TYPE.ATTACK_REAR,
            quantity: 1,
            name: 'ATTACK REAR',
            description: 'The Ogre focuses on threats behind it. It may remain stationary to fire at rear targets, or move one hex backward if enemies are positioned to the rear. Use this to address units that have flanked the Ogre.',
            instruction: 'ATTACK REAR'
        }
    ];
    
    // Target priority table (d6 roll)
    const TARGET_PRIORITY_TABLE = [
        { roll: 1, priority: ['Infantry', 'Armor', 'GEV'], display: 'INF → ARMOR → GEV' },
        { roll: 2, priority: ['Infantry', 'GEV', 'Armor'], display: 'INF → GEV → ARMOR' },
        { roll: 3, priority: ['Armor', 'GEV', 'Infantry'], display: 'ARMOR → GEV → INF' },
        { roll: 4, priority: ['Armor', 'Infantry', 'GEV'], display: 'ARMOR → INF → GEV' },
        { roll: 5, priority: ['GEV', 'Armor', 'Infantry'], display: 'GEV → ARMOR → INF' },
        { roll: 6, priority: ['GEV', 'Infantry', 'Armor'], display: 'GEV → INF → ARMOR' }
    ];
    
    // Attack ratio table (d6 roll)
    const ATTACK_RATIO_TABLE = [
        { roll: 1, ratio: '1:1' },
        { roll: 2, ratio: '1:1' },
        { roll: 3, ratio: '1:1' },
        { roll: 4, ratio: '1:1' },
        { roll: 5, ratio: '2:1' },
        { roll: 6, ratio: '3:1' }
    ];
    
    // Engine state
    let deck = [];
    let discardPile = [];
    let removedCard = null;
    let deviationRule = DEVIATION_RULE.ALWAYS_RIGHT;
    let lastDeviation = null; // 'left' or 'right'
    let turnCount = 0;
    
    /**
     * Build a fresh deck from templates
     * @returns {object[]} Array of card objects
     */
    function buildDeck() {
        const newDeck = [];
        let cardId = 1;
        
        for (const template of CARD_TEMPLATES) {
            for (let i = 0; i < template.quantity; i++) {
                newDeck.push({
                    id: cardId++,
                    type: template.type,
                    name: template.name,
                    description: template.description,
                    instruction: template.instruction
                });
            }
        }
        
        return newDeck;
    }
    
    /**
     * Fisher-Yates shuffle
     * @param {array} array - Array to shuffle
     * @returns {array} Shuffled array
     */
    function shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Dice.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    /**
     * Initialize a new game
     * Builds deck, shuffles, and removes one card
     * @returns {object} Initialization result
     */
    function initGame() {
        // Build and shuffle deck
        deck = shuffle(buildDeck());
        discardPile = [];
        turnCount = 0;
        lastDeviation = null;
        
        // Remove one random card (unknown to player)
        removedCard = deck.pop();
        
        return {
            success: true,
            deckSize: deck.length,
            message: `Deck ready: ${deck.length} cards (1 removed secretly)`
        };
    }
    
    /**
     * Draw a card from the deck
     * Reshuffles discard pile if deck is empty
     * @returns {object} Drawn card and rolls
     */
    function drawCard() {
        // Reshuffle if needed
        if (deck.length === 0) {
            if (discardPile.length === 0) {
                return { error: 'No cards available' };
            }
            deck = shuffle(discardPile);
            discardPile = [];
        }
        
        // Draw card
        const card = deck.pop();
        discardPile.push(card);
        turnCount++;
        
        // Roll for target priority
        const priorityRoll = Dice.roll(6);
        const priority = TARGET_PRIORITY_TABLE[priorityRoll - 1];
        
        // Roll for attack ratio
        const ratioRoll = Dice.roll(6);
        const ratio = ATTACK_RATIO_TABLE[ratioRoll - 1];
        
        // Determine deviation direction if needed
        let deviation = null;
        if (card.type === CARD_TYPE.ADVANCE || card.type === CARD_TYPE.ADVANCE_RAM) {
            deviation = getDeviationDirection();
        }
        
        return {
            success: true,
            turn: turnCount,
            card,
            priorityRoll,
            priority: priority.display,
            priorityOrder: priority.priority,
            ratioRoll,
            ratio: ratio.ratio,
            deviation,
            deckRemaining: deck.length
        };
    }
    
    /**
     * Get deviation direction based on current rule
     * @returns {string} 'left' or 'right'
     */
    function getDeviationDirection() {
        let direction;
        
        switch (deviationRule) {
            case DEVIATION_RULE.ALWAYS_LEFT:
                direction = 'left';
                break;
            case DEVIATION_RULE.ALWAYS_RIGHT:
                direction = 'right';
                break;
            case DEVIATION_RULE.SAME_AS_LAST:
                direction = lastDeviation || 'right';
                break;
            case DEVIATION_RULE.OPPOSITE_OF_LAST:
                direction = lastDeviation === 'left' ? 'right' : 'left';
                break;
            default:
                direction = 'right';
        }
        
        lastDeviation = direction;
        return direction;
    }
    
    /**
     * Set deviation rule
     * @param {string} rule - Deviation rule constant
     * @returns {object} Result
     */
    function setDeviationRule(rule) {
        if (Object.values(DEVIATION_RULE).includes(rule)) {
            deviationRule = rule;
            return { success: true, rule };
        }
        return { success: false, error: 'Invalid deviation rule' };
    }
    
    /**
     * Get current deviation rule
     * @returns {string} Current rule
     */
    function getDeviationRule() {
        return deviationRule;
    }
    
    /**
     * Get deck status
     * @returns {object} Deck state
     */
    function getDeckStatus() {
        return {
            deckSize: deck.length,
            discardSize: discardPile.length,
            turnCount,
            deviationRule,
            lastDeviation
        };
    }
    
    /**
     * Reset the engine
     */
    function reset() {
        deck = [];
        discardPile = [];
        removedCard = null;
        turnCount = 0;
        lastDeviation = null;
    }
    
    // Public API
    return {
        CARD_TYPE,
        DEVIATION_RULE,
        TARGET_PRIORITY_TABLE,
        ATTACK_RATIO_TABLE,
        initGame,
        drawCard,
        setDeviationRule,
        getDeviationRule,
        getDeckStatus,
        reset
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoloEngine;
}
