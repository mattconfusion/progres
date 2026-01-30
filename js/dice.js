/**
 * MOOSE Dice Module
 * Provides cryptographic and seeded PRNG for quality randomness
 */

const Dice = (function() {
    'use strict';
    
    // Current RNG mode: 'crypto' or 'seeded'
    let mode = 'crypto';
    
    // Mulberry32 seeded PRNG state
    let seed = 0;
    let seededState = 0;
    
    /**
     * Mulberry32 - Fast, quality 32-bit seeded PRNG
     * @returns {number} Float between 0 and 1
     */
    function mulberry32() {
        seededState += 0x6D2B79F5;
        let t = seededState;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    
    /**
     * Cryptographic random float between 0 and 1
     * @returns {number} Float between 0 and 1
     */
    function cryptoRandom() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0] / 4294967296;
    }
    
    /**
     * Get random float based on current mode
     * @returns {number} Float between 0 and 1
     */
    function random() {
        return mode === 'crypto' ? cryptoRandom() : mulberry32();
    }
    
    /**
     * Roll a single die with specified sides
     * @param {number} sides - Number of sides (default 6)
     * @returns {number} Roll result (1 to sides)
     */
    function roll(sides = 6) {
        return Math.floor(random() * sides) + 1;
    }
    
    /**
     * Roll multiple dice
     * @param {number} count - Number of dice to roll
     * @param {number} sides - Number of sides per die
     * @returns {object} { rolls: number[], total: number }
     */
    function rollMultiple(count, sides = 6) {
        const rolls = [];
        let total = 0;
        for (let i = 0; i < count; i++) {
            const r = roll(sides);
            rolls.push(r);
            total += r;
        }
        return { rolls, total };
    }
    
    /**
     * Roll 2d6 - common in MOOSE for movement table lookup
     * @returns {object} { die1: number, die2: number, total: number }
     */
    function roll2d6() {
        const die1 = roll(6);
        const die2 = roll(6);
        return { die1, die2, total: die1 + die2 };
    }
    
    /**
     * Roll for Ogre entry hex (2d6, determines column 03-11)
     * Per MOOSE: 7 = center (0822), each point +/- shifts hex
     * @returns {object} { roll: number, hexColumn: string }
     */
    function rollEntryHex() {
        const { total } = roll2d6();
        // Base hex is column 08, roll of 7 = no change
        // Roll 2 = column 03, Roll 12 = column 11
        const column = 3 + (total - 2);
        const hexColumn = String(column).padStart(2, '0');
        return { roll: total, hexColumn, entryHex: `${hexColumn}22` };
    }
    
    /**
     * Roll for missile aggression check
     * @param {number} mag - Missile Aggression rating (0-6)
     * @returns {object} { roll: number, fires: boolean }
     */
    function rollMissileAggression(mag) {
        if (mag === 0) {
            return { roll: 0, fires: false, reason: 'MAG 0 - Only fires at CP/HWZ' };
        }
        if (mag >= 6) {
            return { roll: 6, fires: true, reason: 'MAG 6 - Always fires' };
        }
        const r = roll(6);
        return { roll: r, fires: r <= mag, reason: r <= mag ? 'Fires!' : 'Holds fire' };
    }
    
    /**
     * Roll for ramming decision (side/rear units)
     * @param {number} currentMP - Ogre's current MP this turn
     * @returns {object} { roll: number, rams: boolean }
     */
    function rollRamDecision(currentMP) {
        const r = roll(6);
        return { roll: r, rams: r <= currentMP, reason: r <= currentMP ? 'Rams!' : 'Ignores' };
    }
    
    /**
     * Roll for "Behind It" rule activation
     * @param {number} perTurnMP - Ogre's per-turn MP (not remaining)
     * @returns {object} { roll: number, activates: boolean }
     */
    function rollBehindIt(perTurnMP) {
        const r = roll(6);
        return { roll: r, activates: r <= perTurnMP, reason: r <= perTurnMP ? 'Pursues!' : 'Ignores' };
    }
    
    /**
     * Roll for re-ram decision after first ram
     * @param {number} perTurnMP - Ogre's per-turn MP
     * @returns {object} { roll: number, rerams: boolean }
     */
    function rollReRam(perTurnMP) {
        const r = roll(6);
        return { roll: r, rerams: r <= perTurnMP, reason: r <= perTurnMP ? 'Re-rams!' : 'Continues' };
    }
    
    /**
     * Set RNG mode
     * @param {string} newMode - 'crypto' or 'seeded'
     */
    function setMode(newMode) {
        if (newMode === 'crypto' || newMode === 'seeded') {
            mode = newMode;
            return true;
        }
        return false;
    }
    
    /**
     * Get current RNG mode
     * @returns {string} Current mode
     */
    function getMode() {
        return mode;
    }
    
    /**
     * Set seed for seeded PRNG
     * @param {number|string} newSeed - Seed value (string will be hashed)
     */
    function setSeed(newSeed) {
        if (typeof newSeed === 'string') {
            // Hash string to number
            seed = hashString(newSeed);
        } else {
            seed = Math.floor(newSeed);
        }
        seededState = seed;
        return seed;
    }
    
    /**
     * Get current seed
     * @returns {number} Current seed
     */
    function getSeed() {
        return seed;
    }
    
    /**
     * Reset seeded PRNG to initial seed state
     */
    function resetSeed() {
        seededState = seed;
    }
    
    /**
     * Simple string hash function (djb2)
     * @param {string} str - String to hash
     * @returns {number} Hash value
     */
    function hashString(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
            hash = hash >>> 0; // Convert to unsigned 32-bit
        }
        return hash;
    }
    
    /**
     * Generate random seed for seeded mode
     * @returns {number} Random seed
     */
    function generateRandomSeed() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0];
    }
    
    // Public API
    return {
        roll,
        rollMultiple,
        roll2d6,
        rollEntryHex,
        rollMissileAggression,
        rollRamDecision,
        rollBehindIt,
        rollReRam,
        random,
        setMode,
        getMode,
        setSeed,
        getSeed,
        resetSeed,
        generateRandomSeed
    };
})();

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dice;
}
