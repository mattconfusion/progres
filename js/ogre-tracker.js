/**
 * PROGRES Ogre Tracker Module
 * Manages Ogre unit status (weapons and treads)
 */

const OgreTracker = (function() {
    'use strict';
    
    // Storage key
    const STORAGE_KEY = 'progres_ogre_state';
    
    // State
    let state = {
        initialized: false,
        ogreType: null,
        weapons: {
            missiles: { current: 0, max: 0 },
            main: { current: 0, max: 0 },
            secondary: { current: 0, max: 0 },
            ap: { current: 0, max: 0 }
        },
        treads: { current: 0, max: 0 },
        movement: 0
    };
    
    // Ogre templates based on ogre-model.js
    const TEMPLATES = {
        mk3: {
            name: 'OGRE MK III',
            weapons: {
                missiles: 2,
                main: 1,
                secondary: 4,
                ap: 8
            },
            treads: 45,
            // Movement thresholds: [min treads for move 3, min for move 2, min for move 1]
            movementThresholds: [31, 16, 1]
        },
        mk5: {
            name: 'OGRE MK V',
            weapons: {
                missiles: 6,
                main: 2,
                secondary: 6,
                ap: 12
            },
            treads: 60,
            movementThresholds: [41, 21, 1]
        }
    };
    
    /**
     * Initialize tracker with an Ogre type
     */
    function init(ogreType) {
        const template = TEMPLATES[ogreType];
        if (!template) {
            console.error('Unknown Ogre type:', ogreType);
            return;
        }
        
        state.ogreType = ogreType;
        state.weapons.missiles = { current: template.weapons.missiles, max: template.weapons.missiles };
        state.weapons.main = { current: template.weapons.main, max: template.weapons.main };
        state.weapons.secondary = { current: template.weapons.secondary, max: template.weapons.secondary };
        state.weapons.ap = { current: template.weapons.ap, max: template.weapons.ap };
        state.treads = { current: template.treads, max: template.treads };
        state.initialized = true;
        
        calculateMovement();
        saveState();
        render();
    }
    
    /**
     * Calculate current movement based on treads
     */
    function calculateMovement() {
        if (!state.ogreType) {
            state.movement = 0;
            return;
        }
        
        const template = TEMPLATES[state.ogreType];
        const treads = state.treads.current;
        
        if (treads >= template.movementThresholds[0]) {
            state.movement = 3;
        } else if (treads >= template.movementThresholds[1]) {
            state.movement = 2;
        } else if (treads >= template.movementThresholds[2]) {
            state.movement = 1;
        } else {
            state.movement = 0;
        }
    }
    
    /**
     * Increment a weapon or treads
     */
    function increment(type) {
        if (type === 'treads') {
            if (state.treads.current < state.treads.max) {
                state.treads.current++;
                calculateMovement();
            }
        } else if (state.weapons[type]) {
            if (state.weapons[type].current < state.weapons[type].max) {
                state.weapons[type].current++;
            }
        }
        saveState();
        render();
    }
    
    /**
     * Decrement a weapon or treads
     */
    function decrement(type) {
        if (type === 'treads') {
            if (state.treads.current > 0) {
                state.treads.current--;
                calculateMovement();
            }
        } else if (state.weapons[type]) {
            if (state.weapons[type].current > 0) {
                state.weapons[type].current--;
            }
        }
        saveState();
        render();
    }
    
    /**
     * Reset tracker to initial state
     */
    function reset() {
        state = {
            initialized: false,
            ogreType: null,
            weapons: {
                missiles: { current: 0, max: 0 },
                main: { current: 0, max: 0 },
                secondary: { current: 0, max: 0 },
                ap: { current: 0, max: 0 }
            },
            treads: { current: 0, max: 0 },
            movement: 0
        };
        localStorage.removeItem(STORAGE_KEY);
        render();
    }
    
    /**
     * Save state to localStorage
     */
    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save tracker state:', e);
        }
    }
    
    /**
     * Load state from localStorage
     */
    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.initialized && parsed.ogreType) {
                    state = parsed;
                    render();
                    return true;
                }
            }
        } catch (e) {
            console.warn('Could not load tracker state:', e);
        }
        return false;
    }
    
    /**
     * Render the tracker UI
     */
    function render() {
        const titleEl = document.getElementById('ogre-title');
        const contentEl = document.getElementById('tracker-content');
        const emptyEl = document.getElementById('tracker-empty');
        
        if (!state.initialized) {
            titleEl.textContent = 'SELECT OGRE TYPE';
            contentEl.classList.add('hidden');
            emptyEl.classList.remove('hidden');
            return;
        }
        
        // Show content, hide empty state
        contentEl.classList.remove('hidden');
        emptyEl.classList.add('hidden');
        
        // Update title
        const template = TEMPLATES[state.ogreType];
        titleEl.textContent = template.name + ' STATUS';
        
        // Update weapon rows
        updateRow('missiles', state.weapons.missiles);
        updateRow('main', state.weapons.main);
        updateRow('secondary', state.weapons.secondary);
        updateRow('ap', state.weapons.ap);
        updateRow('treads', state.treads);
        
        // Update movement display
        const movementEl = document.getElementById('movement-value');
        if (movementEl) {
            movementEl.textContent = state.movement;
        }
    }
    
    /**
     * Update a single tracker row
     */
    function updateRow(type, data) {
        const row = document.querySelector(`[data-weapon="${type}"]`);
        if (!row) return;
        
        // Update count
        const countEl = row.querySelector('.tracker-count');
        if (countEl) {
            countEl.textContent = `${data.current}/${data.max}`;
        }
        
        // Update bar fill
        const fillEl = row.querySelector('.bar-fill');
        if (fillEl) {
            const percent = data.max > 0 ? (data.current / data.max) * 100 : 0;
            fillEl.style.width = `${percent}%`;
        }
        
        // Update button states
        const decBtn = row.querySelector('[data-action="dec"]');
        const incBtn = row.querySelector('[data-action="inc"]');
        if (decBtn) decBtn.disabled = data.current <= 0;
        if (incBtn) incBtn.disabled = data.current >= data.max;
    }
    
    /**
     * Set up event listeners
     */
    function setupListeners() {
        document.querySelectorAll('.tracker-row').forEach(row => {
            const weapon = row.dataset.weapon;
            
            row.querySelectorAll('.pm-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.dataset.action === 'inc') {
                        increment(weapon);
                    } else if (btn.dataset.action === 'dec') {
                        decrement(weapon);
                    }
                });
            });
        });
    }
    
    /**
     * Get current state (for external use)
     */
    function getState() {
        return { ...state };
    }
    
    /**
     * Check if tracker is initialized
     */
    function isInitialized() {
        return state.initialized;
    }
    
    // Setup on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupListeners();
            loadState();
        });
    } else {
        setupListeners();
        loadState();
    }
    
    return {
        init,
        reset,
        increment,
        decrement,
        getState,
        isInitialized,
        loadState,
        render
    };
})();
