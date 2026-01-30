/**
 * PROGRES Combat Module (Simplified for Ogre Solo)
 * Target priority and attack ratio from d6 rolls
 */

const Combat = (function() {
    'use strict';
    
    // Attack ratio display
    const RATIO_DISPLAY = {
        '1:1': '1:1 - Standard odds',
        '2:1': '2:1 - Favorable odds', 
        '3:1': '3:1 - Strong attack'
    };
    
    /**
     * Format the combat result for display
     * @param {object} drawResult - Result from SoloEngine.drawCard()
     * @returns {object} Formatted combat instructions
     */
    function formatCombatResult(drawResult) {
        if (!drawResult || !drawResult.success) {
            return { error: 'Invalid draw result' };
        }
        
        return {
            targetPriority: drawResult.priority,
            priorityOrder: drawResult.priorityOrder,
            attackRatio: drawResult.ratio,
            ratioDisplay: RATIO_DISPLAY[drawResult.ratio] || drawResult.ratio,
            note: 'Command Post is ALWAYS primary target'
        };
    }
    
    /**
     * Get attack strength needed for ratio
     * @param {number} defense - Target defense value
     * @param {string} ratio - Attack ratio ('1:1', '2:1', '3:1')
     * @returns {number} Required attack strength
     */
    function getRequiredAttack(defense, ratio) {
        switch (ratio) {
            case '3:1': return defense * 3;
            case '2:1': return defense * 2;
            case '1:1': 
            default: return defense;
        }
    }
    
    /**
     * Check if attack meets required ratio
     * @param {number} attack - Available attack strength
     * @param {number} defense - Target defense value
     * @param {string} targetRatio - Desired ratio
     * @returns {object} Result with actual ratio achieved
     */
    function checkRatio(attack, defense, targetRatio) {
        if (defense === 0) {
            return { 
                meetsTarget: true, 
                actualRatio: 'auto',
                note: 'D0 target - automatic destruction'
            };
        }
        
        const ratio = attack / defense;
        let actualRatio;
        
        if (ratio >= 3) actualRatio = '3:1';
        else if (ratio >= 2) actualRatio = '2:1';
        else if (ratio >= 1) actualRatio = '1:1';
        else if (ratio >= 0.5) actualRatio = '1:2';
        else actualRatio = 'none';
        
        const targetValue = targetRatio === '3:1' ? 3 : targetRatio === '2:1' ? 2 : 1;
        const meetsTarget = ratio >= targetValue;
        
        return {
            meetsTarget,
            actualRatio,
            note: meetsTarget ? 'Target ratio achieved' : `Only ${actualRatio} possible`
        };
    }
    
    // Public API
    return {
        RATIO_DISPLAY,
        formatCombatResult,
        getRequiredAttack,
        checkRatio
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Combat;
}
