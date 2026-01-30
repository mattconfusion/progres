```
┌─┐┬─┐╔═╗╔═╗╦═╗╔═╗┌─┐
├─┘├┬┘║ ║║ ╦╠╦╝║╣ └─┐
┴  ┴└─╚═╝╚═╝╩╚═╚═╝└─┘
```

# PROGRES - Ogre Solo Play Assistant

**[▶ Play Now on GitHub Pages](https://mattconfusion.github.io/progres/)**

A touch-friendly web tool for solo play of Steve Jackson's OGRE (6th Edition).

## How It Works

PROGRES implements the **Ogre Solo** card-based system. At each turn, draw a card to determine the Ogre's movement, then roll dice for target priority and attack ratio.

### Card Deck (10 cards, 1 removed at start)

| Card | Qty | Effect |
|------|-----|--------|
| ADVANCE FORWARD | 3 | Move straight ahead, max move. Deviate for terrain only. |
| ADVANCE & RAM | 2 | Move forward, deviate to ram enemies. |
| GO LEFT | 2 | Must move at least 1 hex left. |
| GO RIGHT | 2 | Must move at least 1 hex right. |
| ATTACK REAR | 1 | Stay stationary or move 1 hex backward. |

### Target Priority (d6)

| Roll | Priority Order |
|------|----------------|
| 1 | Infantry → Armor → GEV |
| 2 | Infantry → GEV → Armor |
| 3 | Armor → GEV → Infantry |
| 4 | Armor → Infantry → GEV |
| 5 | GEV → Armor → Infantry |
| 6 | GEV → Infantry → Armor |

**Note:** Command Post is ALWAYS the primary target.

### Attack Ratio (d6)

| Roll | Ratio |
|------|-------|
| 1-4 | 1:1 |
| 5 | 2:1 |
| 6 | 3:1 |

## Quick Start

1. Open `index.html` in a browser
2. Press **[NEW GAME]**
3. Select Ogre type (MK III or MK V)
4. Select deviation rule for terrain avoidance
5. Press **[START]**
6. Press **[DRAW CARD]** each turn

## Deviation Rules

When an ADVANCE card is drawn and the Ogre must deviate for terrain:

- **RIGHT** - Always deviate right
- **LEFT** - Always deviate left
- **SAME** - Same direction as last deviation
- **ALT** - Alternate directions

## Controls

| Action | Button | Keyboard |
|--------|--------|----------|
| New game | [NEW GAME] | N |
| Draw card | [DRAW CARD] | Enter / Space |
| Start game | [START] | Enter |

## Technical Details

- Pure vanilla JavaScript
- Single HTML file, no backend
- Touch-optimized (48px+ buttons)
- DOS-style phosphor CRT aesthetic
- Mobile responsive

## File Structure

```
index.html           - Main page
css/terminal.css     - CRT styling
js/dice.js           - RNG module
js/solo-engine.js    - Card deck & game logic
js/combat.js         - Combat helpers
js/game.js           - UI controller
specs/Ogre_solo.md   - Solo rules reference
```

## Credits

- **Ogre Solo Rules**: Original PDF system
- **OGRE**: Steve Jackson Games
- Conforms to [SJG Online Policy](https://www.sjgames.com/general/online_policy.html)

## License

Free for personal use by the OGRE community. Do not sell.
