# MOOSE: Mechanical Ogre Opponent Simulation Engine

## *A System for Solo Play in [Steve Jackson's Ogre](http://www.sjgames.com/ogre/)™[^1]*

Document Admin/Contact: stephan beal [sgbeal@googlemail.com](mailto:sgbeal@googlemail.com)  
See also: [a one-page summary of these rules](https://docs.google.com/spreadsheets/d/1IPFxQ7oKoUCVrQ2TnSHqxyrOyhq3GH37oMwjminBVw4/view) by Ian Argent

MOOSE describes a mechanism for solo play of [Steve Jackson Games' Ogre](http://www.sjgames.com/ogre/) game, specifically the "Basic Scenario" and "Advanced Scenarios" of the game. It does not work with the G.E.V. rules, nor does it work with non-Ogre units. It is intended for players who want a more fulfilling solo experience than "left hand vs. right hand" tends to provide. MOOSE is partially derived from rules described in [The Ogre Book](http://www.sjgames.com/ogre/products/ogrebook/), second edition, pages 79 and 80, written by George Collins, but is somewhat more detailed and more flexible (e.g. its movement system is trivial to tweak without completely hosing it). Nonetheless, it plays relatively quickly (possibly more quickly than most human opponents) once one learns the small handful of rules.

In MOOSE, the human player always plays the defensive team and the attacking Ogre is controlled by MOOSE. The Ogre's movement is determined by a combination of dice and prioritized rules, and its attacks are controlled via a series of simple rules based on target priorities. This document is relatively long, but its rules are easy to learn and most of them can be memorized quickly. Generally only the movement table needs to be referred to on a regular basis, but using chits instead of dice can eliminate references to the movement table altogether.

**Status**: the rules in this document are ready to use as-is. There may be "TODO" markers strewn throughout it, but they all mark refinements or new/in-progress material, as opposed to still-missing required components. These rules have, in their current state, been used to crush many a command post.

**License:** this document is made available for free use by all members of the Ogre player community. It has no explicit license but is believed to conform to the Steve Jackson Games Online Policy ([https://www.sjgames.com/general/online\_policy.html](https://www.sjgames.com/general/online_policy.html)). Any use of this material which conforms to that policy is considered fair game by its author. In short: don't sell it. Feel free to create derivative works, e.g. customized versions of it, provided they conform to the SJG Online Policy.

[Regarding Play Balance](#regarding-play-balance)

[Terms and Definitions](#terms-and-definitions)

[Scenario Setup](#scenario-setup)

[Ogre Movement](#ogre-movement)

[Default Movement Table](#default-movement-table)

[Rule-based Movement](#rule-based-movement)

[Limitation: Low Tread Count](#limitation:-low-tread-count)

[Optional: Human Override](#optional:-human-override)

[Movement: Charge the CP](#movement:-charge-the-cp)

[Movement: HWZ Umbrella](#movement:-hwz-umbrella)

[Movement: Ramming](#movement:-ramming)

[Infantry and Ramming](#infantry-and-ramming)

[Movement: Behind It](#movement:-behind-it)

[Priority Goal Movement](#priority-goal-movement)

[Combat](#combat)

[Targeting Priorities](#targeting-priorities)

[Missiles](#missiles)

[Using GEV Maps](#using-gev-maps)

[Swamps](#swamps)

[Faster/Shorter Routes](#faster/shorter-routes)

[Submerged Ogres](#submerged-ogres)

[Notes and TODOs](#notes-and-todos)

[Known Weaknesses](#known-weaknesses)

[Alternate Acronyms/Names for these Rules](#alternate-acronyms/names-for-these-rules)

# Regarding Play Balance {#regarding-play-balance}

MOOSE is geared towards games using only the units available in the [*Ogre Pocket Edition*](http://www.sjgames.com/ogre/products/pocketogre/) or the 1987 *Deluxe Edition[^2]*. Specifically, that means only the following armor units: GEV, MSLT, HVY, HWZ. Players may need to tweak it when using units introduced in other editions of the game (MHWZ, LT-TNK, LT-GEV, SHVY, etc.).

In testing, Ogres controlled by this system have been shown to beat[^3] the Basic Scenario roughly half of the time without having to handicap the defenders, provided the defenders do not use the G.E.V. Fuzzy Wuzzy defense nor blatantly "game" the MOOSE rules to the defender's benefit. Most play testing is done using the conventional "tutorial force" with an even mix of HVY, MSLT, and GEV units. *That said*, with regards to balance, the *Pocket Edition*, section 1.06 (labeled *Play Balance*), has the following to say:

In particular, the basic scenario assumes that both players are new to the game. If both sides use optimum tactics, the defender should be able to win the basic (Mark III) scenario with the forces given; removing two armor units will make the sides about even for an experienced defender.

Indeed, MOOSE play testing has shown that to be quite true. Namely, many games have ended with the defenders winning, but having only 2-3 armor units remaining. Obviously, the MOOSE-controlled Ogre is incapable of using "optimum tactics," where the defending player is. *Thus it is recommended that experienced players remove 2 armor units from the defender's setup.* One recommended approach is to pick a "full" normal force, then *randomly* remove two of the armor units.

# Terms and Definitions {#terms-and-definitions}

First off, a few terms MOOSE uses which need to be concretely defined…

Sidebar: while the Ogre rules explicitly have no "unit facings" or "firing arcs," MOOSE-automated decision making often requires classifying relative positions as being "in front of," "behind," "beside," etc. To that end, such distinctions are defined here.

* **North, South**: in Ogre, north specifically refers to the "top" of the Ogre map, south to the bottom. MOOSE refers to only six cardinal directions: north, south, northwest, northeast, southwest, and southeast.  
* **Forward**: unless otherwise noted, specifically means "toward the Ogre's current goal." Generally this means "towards the CP" or (after destroying the CP) "towards the southern edge of the map." "Forward" always refers to *one* of the 6 hex-sides of the Ogre's current hex, but *which* hex-side that is may change during play (potentially quite often).  
  TODO: while which hex-side "forward" is will "normally" be self-explanatory, there are potentially cases where it is necessary to calculate which of two "competing" hex-sides is the "forward" one. Normally the hex-side from which the shortest range can be counted to the current goal/target can be considered to be the forward-most hex-side, but there are configurations where that range is the same for two adjacent hex-sides, so we need some way of disambiguating it (for the few cases where doing so may be significant). When in doubt, choose the first such route, starting at the northernmost edge and counting clockwise around the hex.  
* **Back/Rear/Backwards**: refers to the direction/hex-facing opposite of the "forward" hex-side.  
* **Left** and **Right**:  
  * In the context of movement, these refer to the two hex-sides immediately adjacent to the current "forward" direction. i.e. when "forward" is north, left is the NW side and right is the NE side. When "forward" is south, left is the SE edge and right is the SW. When "forward" is NW, left becomes north and right is SW.  
  * These terms can also refer to something "beside" the Ogre (see below).  
* **In Front of** and **Behind**: something is "in front of" the Ogre if it falls in the arc covered by the current forward, left, and right hexes. Something is "behind" the Ogre if it falls in the arc of the three non-front hexes. These arcs radiate in straight lines from their respective hex-sides, and thus cover 120 degrees (not 180\!) each.  
* **Beside**: The "side" hex-sides are the 4 hex-sides which are neither the "forward" nor the "back" hex-sides. something is "beside" an Ogre if it falls in the arc of the two left-side hexes (front/left and rear/left) or right-side (front/right and rear/right) hexes. These arcs go out in straight lines from their respective hex-side, and thus cover a 60-degree arc. When something is covered by both the forward and side arcs, consider it to be in the *front* of the Ogre. *Contrariwise*, if something falls in both the side and rear arcs (see *behind*, above) then consider it to be *beside* the Ogre's.  
* **Battery Range (BR)**: the maximum range of any remaining "battery" weapons on an Ogre, i.e. Main Battery or Secondary Battery. An Ogre with no remaining batteries has a BR of 0\.  
* **Effective Basic Range (EBR)**: a combination of the Ogre's *current* movement points plus the maximum range of any *non-missile* weapons it still has. e.g. an Ogre with 2 MP and at least one Main Battery (range of 3\) has an EBR of 5\. Likewise, an Ogre with 3 MP and no main batteries, but with at least one secondary battery (range of 2), also has an EBR of 5\. For *non-Ogre units*, the EBR is the unit's first-phase movement score plus their range (e.g. 6 for a GEV and 8 for an HWZ).  
  TODO: figure out whether or not we should include AP weapons in this definition, or whether we need a separate distinction for APs. APs play such a small role in basic Ogre that it hardly seems worth counting them.  
* **Effective Missile Range (EMR)**: if an Ogre has any missiles remaining, this is a combination of the Ogre's *current* movement points plus 5 (the range of missiles). If it has no missiles remaining, its EMR is 0 (*zero*). If the Ogre has only internal missiles fired via missile racks, but all racks are destroyed, it is treated as if it has no missiles, i.e., it has an EMR of 0\.

  Design note: the BR, EBR, EMR definitions are intended to eventually be used in certain decision-making rules.

# Scenario Setup {#scenario-setup}

As in the core rules, the defending team sets up first, as per the rules for Basic or Advanced scenario. The entry point for the Ogre is determined randomly: roll 2d6. If the result is a 7, the Ogre enters in the center-most hex (0822). For each point less than 7, the Ogre enters one hex to the left of that. For each point greater than 7, the Ogre enters one hex to the right of that. e.g. on a roll of 10, the Ogre enters in hex 1122\. On a roll of 2 it enters in hex 0322\. Note that the Ogre will (with this mechanism) never enter from hexes 0122, 0222, 1422, or 1522\. When entering the map, the initial hex counts as its first hex of movement.

*Optional first-turn Ogre movement*: in practice, play is sped up a small bit if the Ogre simply moves forward three hexes in its first turn (possibly also its second). There is, in general, little to be gained by checking for sideways movement on the Ogre's first turn, as there will never be an opponent in its EBR (though possibly one or two within its EMR).

# Ogre Movement {#ogre-movement}

For each hex of (potential) movement, the player must examine the Ogre's surroundings and determine (based on rules described below) whether the Ogre will move according to a built-in rule or according to a "movement table" (as described below). Players may wish to determine Ogre movement based solely on a movement table (i.e. random), but the Ogre will then often fail to make some otherwise "obvious" moves, such as ramming a unit directly in front of it. Thus it is recommended that players use a hybrid rule/dice mechanism.

The Ogre's movement is, *for the most part*, determined by rolling two dice and consulting a so-called movement table. A movement table is a two-dimensional grid with six rows and six columns, offering a total of 36 potential movement options[^4]. This model allows players to easily modify an Ogre's basic movement behaviour by swapping out different tables. e.g. the "core" table emphasizes forward movement, but a table which emphasizes more sideways movement is easy to create.

Each cell of the movement table describes not a direction, but a *list of direction preferences/priorities*. For the most part, the first-listed preference will determine an Ogre's direction of movement, but terrain and other rules may force the Ogre to choose a different (2nd- or 3rd-priority) direction. For example, if its first priority is Forward, but that's blocked by a crater, it will choose the 2nd priority, then fall back to the 3rd if necessary.

*Each hex* of movement is determined either by rules (based on surrounding units or terrain) or by rolling on the currently-active movement table.

Let's start with the movement table…

## **Default Movement Table** {#default-movement-table}

|  | 1 | 2 | 3 | 4 | 5 | 6 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | REVERSE | LFR | LFR | LFR | FLR | FLR |
| **2** | LFR | LFR | LFR | FLR | FLR | FLR |
| **3** | LFR | LFR | FLR | FLR | FLR | FLR |
| **4** | RFL | RFL | FRL | FRL | FRL | FRL |
| **5** | RFL | RFL | RFL | FRL | FRL | FRL |
| **6** | FRL | FRL | RFL | RFL | RFL | REVERSE  |

Each cell in this table lists the priorities of an Ogre's movement choices *for the next single hex*, with "L", "R", and "F" meaning left, right, and forwards, respectively. The priorities are read from left to right, with the Ogre moving only the first of those which it can. e.g. if a result indicates "LFR" but the "left" hex (the first in the list of LFR) is blocked by a crater, then the Ogre will take its second choice, namely "F", and will (if possible) move forward (relative to its current goal). After moving one hex, if the Ogre still has MP, the movement choices are then *evaluated anew for the next hex* (which might be controlled by either a movement rule or another roll).

An Ogre will not move both left and right in the same turn unless it has no other choice or unless movement *rules* (not the movement *table*) compel it to (e.g. by ramming two neighboring units). If either L or R are rolled after the other direction has already been traversed this turn, use the 2nd (or 3rd) priority direction for that roll instead.

Example: an Ogre moves left on its first hex. The second hex's roll indicates RFL. Because the Ogre has already moved *left* this turn, it will disregard the movement table's suggestion to move *right*. Thus it must take the 2nd-priority direction ("F") if it can, or the 3rd-priority ("L") if it cannot traverse the 2nd direction. It may choose to go *right* in this case only if it has no other option.

Design Note: it might sound tedious to roll for each hex, but (A) in wide open terrain it goes quickly and (B) when enemies are nearby, movement is more often controlled by rules instead of dice. In practice this approach is no slower than waiting on a human opponent (or a solo player's "left hand") to think through available movement options.

**Tip: Chits instead of Dice.** A movement table need not use dice. Another option is to use chits, each one marked with one movement table entry. To save on chits, each side may represent a different table entry, so the number required drops from 36 to 18\. Place the chits in a cup or small bag, draw one for each move, then place it back in the container. Drawing and reading chits is, in practice, faster than rolling dice and looking up an entry in the movement table. By using 2-3 sets of identical chits one can reduce their re-shuffling, speeding up play slightly. In practice, two sets of chits works well. (MOOSE's maintainer uses 36 double-sided chits instead of dice, and this has proven to speed up play notably compared to using dice and a table.)

**Option: drop-table instead of dice.** Another dice-roll-reduction technique is to create a "drop table." (As a starting point, simply print out a large (half-page or so) copy of the above table.) Instead of rolling 2 dice, drop something on the movement table (a coin or a die), and use the cell the item lands on. It might be a good idea to rearrange the cells such that the center-most area tends towards forward movement. It also might be useful to add raised edges to the movement table to help keep the dropped item in its boundaries. It might also be interesting (but more work) to create a circular table.

An Ogre's movement choices can be affected by terrain which blocks its movement (i.e. craters), limitations imposed by (e.g.) a low tread unit count, or the edge of the map (which it may not cross unless escaping after destruction of the CP).

*Optional* tweak for "off-the-map" results: if a roll indicates moving off the edge of the map, reverse the meanings of the directions for that hex's roll, such that left becomes right and right becomes left (note the "forward" cannot lead off-map except in the case of exiting the map after destroying the CP). That moves the Ogre *away* from the edge, which ensures that the *next* hex of movement will not once again try to move the Ogre off the map.

The "**REVERSE**" entry is a special case: when activated, the Ogre will reverse its direction for the *remainder of the turn*, effectively swapping its current forward/backward directions. Roll again to determine its movement priority for that hex, applying the result to the new forward direction. Apply that direction change to each hex of movement for the remainder of the turn. Be sure to interpret "R" and "L" results as relative to the new (reversed) forward direction.

Exceptions to the REVERSE result:

* An Ogre will never reverse while under the influence of [priority goal movement](#priority-goal-movement).  
* After destroying the CP, the Ogre will never reverse directions on its way back off the map. i.e. it will never travel north if its goal is to escape off the southern edge of the map.  
* The Ogre will never reverse direction when traveling north *and* is within five hexes of the southern edge. i.e. just after it has entered the battle, it won't move backwards.  
* *Optionally*: only honor the REVERSE condition on the Ogre's *first hex of movement on any given turn*.

In any of these cases, re-roll any REVERSE result.

If an Ogre destroys its target CP then its next goal is to escape, in which case movement is modified as follows:

1. The south end of the map (as a whole) becomes the "forward" direction.  
2. Re-roll any REVERSE results.

Optionally, players may wish to simply dictate forward-only movement (insofar as terrain allows for it) when escaping from the map, taking the shortest route towards the nearest exit point.

The default movement chart is weighted for more forward movement than sideways movement. Players are free to create tables with more left/right movement, but should take care to give each of left/right the same weight (i.e. the same number of cells/appearances in the table), otherwise the Ogre has a higher chance (on average) of hugging one particular side of the map.

## **Rule-based Movement** {#rule-based-movement}

An Ogre's movement is not (unless the player wants a "dumb" Ogre) determined entirely by dice. It may also, based on the units around it and its current condition, "decide" to move in a specific manner.

The list of movement determination rules is given below, in the order of their priority, from highest to lowest. If the conditions of any one rule is met, that rule determines the Ogre's *next hex* of movement. The Ogre processes (at most) only a single movement determination rule per hex. The rules are listed by name and are described in detail in a subsection with a heading matching that name.

1. *OPTIONAL:* [Human Override](#optional:-human-override)  
2. [Charge the CP](#movement:-charge-the-cp)  
3. [HWZ Umbrella](#movement:-hwz-umbrella)  
4. [Ramming](#movement:-ramming)  
5. [Behind It](#movement:-behind-it)  
6. Use the Movement Table

If none of the above rules determines how the Ogre will move, the Ogre will move according to the currently active movement table.

The individual movement modifiers and rules are described in detail in the following subsections. The ordering of these subsections is arbitrary \- the ordering of their priority is determined by the above list.

### **Limitation: Low Tread Count** {#limitation:-low-tread-count}

When **treads are reduced to (Starting Treads / (2 x Starting MP), rounded down)**[^5], the Ogre (which will necessarily already be under the influence of the [Charge the CP](#movement:-charge-the-cp) rule at this point) immediately gets the following movement limitations imposed on it *for the remainder of its mission*…

* Will no longer ram armor units unless it *must* do so to get within firing range of the CP. It may continue to freely overrun infantry units or scenario-specific units which do not cause tread loss when rammed.  
  * EXCEPTION: if ramming would destroy the Ogre's last tread unit but leave the Ogre within firing range of the CP, the Ogre *will* ram unless there is another path of the same distance which does not require tread loss (or requires less of it).  
* Will never reverse direction unless moving forward/sideways requires ramming an armor unit *and* ramming that armor unit would cause the Ogre to lose the last of its treads. Re-roll any REVERSE results on the movement table.

### **Optional: Human Override** {#optional:-human-override}

*This rule is strictly optional, per the player's discretion\!*

Occasionally the scene around an Ogre suggests a particularly optimal way to act, but which a set of rules like MOOSE cannot be made to react optimally to. For example, three targets sitting adjacent to one another three hexes away from an Ogre might cause a *human* player to move two hexes towards them, forgo further movement, and blast them to pieces with its secondary guns.

Using this "override" rule, the player may wish to "take control" of the Ogre for such situations, tossing all MOOSE rules out the window in order to give the Ogre a chance to take tactical advantage of the current situation.

Using this rule every turn is equivalent to playing without MOOSE, however, so this rule is only intended to be used for situations where the current situation just screams "a human player would take full advantage of this." i.e. an override is intended mainly for situations where *not* taking a particular action would be "just plain stupid" on the part of the Ogre. Alternatively, one may simply justify a "stupid Ogre" as being an early model, from before they became self-aware (or maybe it's just buggy).

### **Movement: Charge the CP** {#movement:-charge-the-cp}

If the Ogre **has only 1 MP *or* is in the same map region[^6] as the CP**, the CP becomes the highest priority target of the Ogre, at which point it starts moving as described in the [Priority Goal Movement](#priority-goal-movement) section.

### **Movement: HWZ Umbrella** {#movement:-hwz-umbrella}

If the Ogre **is within a HWZ's firing range**…

If the Ogre is out of EMR/EBR range of the CP, then the HWZ becomes the current primary goal. The Ogre's movement then falls under the [Priority Goal Movement](#priority-goal-movement) rules, with the HWZ being the priority goal. If multiple HWZ are encountered at different ranges, the closest one gets priority. If multiple HWZs are encountered at the same range, the one which is nearest the CP will be chosen (determine randomly which if there are still multiple options). After its destruction, another HWZ may, depending on the then-current game conditions, become the next priority goal.

*EXCEPTION*: if the CP is the current priority goal *and* the Ogre's movement for the turn would, with certainty[^7], move the Ogre out from under the HWZs umbrella, the Ogre ignores the HWZ, going for the CP instead.

Players may wish to devise other exceptions where an Ogre will simply leave or avoid the umbrella rather than approach the HWZ. e.g. if it has 1 MP and no missiles, it possibly makes more sense for the Ogre to treat the umbrella as a no-go zone, skirting around it instead of through it, if possible, or traveling such that it must spend as little time as possible under the umbrella. Unfortunately, the subtleties of such decisions must account for other battlefield conditions which are difficult to codify, and require some degree of decision-making on the player's part. (e.g. if the HWZ is the last unit on the field, the decision to avoid it becomes easy, but if there are still other threats on the field, the HWZ might be the lesser of all risks.)

### **Movement: Ramming** {#movement:-ramming}

**If one or more enemy *armor units* are adjacent to, or in the same hex as, the Ogre**[^8], it *may* ram/overrun one of them, subject to the two-ram limit of the core Ogre rules. A unit in the same hex or one of the three front hexes will be the first choice for ramming, and the Ogre will do so if another rule does not prohibit it. If no units are adjacent in a front hex, but are in a side- or rear hex, roll a die: on a roll equal to or less than the Ogre's *current* remaining MP for this turn, the Ogre will move to ram one of those units (those on the side take priority over those in the rear). If units are on both sides, the Ogre will ram the side which takes it closest to the CP (or roll a die to determine which if both paths are equidistant from the CP).

If multiple armor units are adjacent, use the [targeting priorities](#targeting-priorities) described for weapons fire, but giving a higher priority to units in front of the Ogre *and ignoring infantry* (see the next subsection for rare exceptions regarding infantry). If an *armor* unit is *disabled* by ramming, it is *ignored for further movement rule determination this turn*. i.e. an Ogre with 3 MP will *not* ram a unit, move away, and then return to re-ram the same (now disabled) unit to finish it off in the same turn (it might come back on the next turn, though).

If the Ogre has MP remaining after disabling a unit via ramming, determine its next course of action:

* If the disabled unit will (for certain) be within firing range of the Ogre at the end of its current movement phase *and* the Ogre has a weapon which can get 1:1 or better odds against the disabled unit at that range, the Ogre continues its movement[^9], otherwise…  
* If the Ogre still has movement points remaining then roll a die: on a roll of its current *per-turn* MP (*not* MP *remaining* for the turn)[^10] or less it remains in the hex and rams the unit again to finish it off, otherwise it continues its movement.  
  Is there any case, other than an unarmed Ogre, where rule (a) does not activate but rule (b) does? If not, re-think (a) so that there's always some chance the Ogre will re-ram. OTOH, why waste another 1-2 treads when a gun might do the trick?

#### Infantry and Ramming {#infantry-and-ramming}

Ogres normally ignore infantry for purposes of ramming/overrunning, treating them as if they were not there for all movement decision purposes. Notes regarding and exceptions to this…

* The Ogre will *never* consider INF behind/beside it for ramming if any of the following apply:  
  * It has 3 MP (because it can outrun them).  
  * There are armor units within its own forward-arc EBR or EMR.  
* It will *always* back up to overrun adjacent infantry in the rear or side arcs if the Ogre has *exactly* 2 MP, has *no* main batteries, *and* either of the following apply:  
  * The defender has *only* INF remaining or  
  * No defending units in the Ogre's forward arc have the Ogre in their own EBR.  
    (Justification: it is otherwise possible for the infantry to attack from the rear without fear of return fire, so long as it has 2 MP and continues moving away from them.)

### **Movement: Behind It** {#movement:-behind-it}

(Reminder: this rule has a lower priority than [Ramming](#movement:-ramming), meaning that there will be no enemy armor units *directly adjacent* to the Ogre if this rule triggers. Note also that a [HWZ Umbrella](#movement:-hwz-umbrella) trumps this, so an Ogre will not backtrack while under fire from a HWZ.)

Background: one glaring weakness of a dice-controlled Ogre is that units which stay 2+ hexes behind the Ogre can essentially remain unmolested. The intention of this rule is to make the areas behind and to the side of the Ogre riskier to hang out in. As the short story in the Ogre rules says...

*"Behind," it thought. "They have made a mistake."*

*Only check for this rule at the start of an Ogre's movement for the turn, not for each hex.*

If there are *armor units* *behind or beside* the Ogre *within the Ogre's battery range or movement range*, and *no* armor units within its *EBR* *in front* of it then…

Roll one die. If the result is less than or equal to the Ogre's current per-turn MP, then it will choose one of the units behind/beside it to move towards this turn (with a higher priority given to the *sides*, and more priority to the side closest to the CP). If there is more than one armor unit, use [combat targeting priorities](#targeting-priorities) to determine which one it approaches.

Treat the armor unit which is approached as a result of this rule as the Ogre's [priority destination](#priority-goal-movement) for the remainder of this turn or until that unit is destroyed via ramming, whichever comes first. The Ogre will move exclusively towards that unit unless a higher-priority rule is triggered during its movement. If two paths have equal distance to the unit, the Ogre will prefer a path which approaches the *most* enemies, using targeting priorities if necessary to choose between multiple enemies and rolling randomly if there is a tie for both distance and targeting priorities.

Design note: because of how "in front of" and "beside" are defined, it is possible for a unit to switch from being "in front of" to "beside" the Ogre during movement in a given turn. To avoid that the Ogre continually "veers off" in such cases, this rule is only checked for at the start of an Ogre's movement each turn.

Play test notes:

* If the defense has only INF remaining and the Ogre has 2 MP and no main battery, it is possible for the INF to trail the Ogre unmolested, getting in one attack each turn, without risk of return fire, until the Ogre is dropped to 1 MP (at which point its SBs can fire into the rear), a REVERSE movement is rolled, or [Human Override](#optional:-human-override) is invoked to clean up the INF in the rear.

## **Priority Goal Movement** {#priority-goal-movement}

At certain points, specific targets become an Ogre's "immediate-priority target," forcing the Ogre to move to engage that target. This happens when, e.g., an Ogre gets close enough to a CP or HWZ. The rule-level priority of this movement mode is the same as the rule which triggers it. A rule with a priority higher than the rule which initiates this movement mode may trump it, causing the Ogre to switch to a different movement mode or switch priority targets.

Example: if an Ogre currently has a nearby HWZ as its priority target, but it is reduced to 1 MP while approaching the HWZ, the [Charge the CP](#movement:-charge-the-cp) rule will activate because it has a higher priority than the [HWZ Umbrella](#movement:-hwz-umbrella) rule.

When an Ogre has a priority goal, it moves along the *most direct course* towards that goal: no more rolls are made on the movement table until the goal is reached, destroyed, or otherwise trumped. The "forward" direction is based on the goal's hex[^11]. If two paths to that goal are of equal distance to the goal…

1. If one contains an enemy unit and one does not, the Ogre will ram/overrun the enemy, provided doing so does not violate a higher-priority rule, otherwise it will take the clear path.  
2. If both paths contain an armor unit or both contain infantry, use [weapon targeting priorities](#targeting-priorities) to determine which path it will take, falling back to a die roll if the units have the same targeting priority.  
3. If one path contains an armor unit and one contains infantry, the Ogre will ram the armor unless a higher-priority rule disallows it, in which case it will overrun the infantry.

# Combat {#combat}

The Ogre fires at targets using a simple weapon ordering and priority mechanism. During its attack phase, an Ogre fires its weapons in the following order:

1. Anti-personnel: split the AP guns as evenly as possible amongst any infantry units in range, but never "wasting" any. e.g. a 3:1 attack is an automatic kill against a lone infantry unit, so the Ogre will never fire more than 3 AP at it.  
   1. AP guns will *always* prefer to target a D0 target (a CP or scenario-specific unit/building with D0) over infantry.  
2. Secondary batteries  
3. Main batteries  
4. Missiles (potentially \- see below)

Resolve all attacks of one weapon type before resolving the next type. The Ogre never combines fire from its weapons unless it *must* do so to get at least 1:1 odds, in which case it will combine the fewest weapons necessary to achieve 1:1 odds. In such a case, it may combine weapons from different tiers, e.g. main and secondary batteries[^12].

## **Targeting Priorities** {#targeting-priorities}

Targeting priorities for secondary batteries, main batteries, and missiles are (from highest to lowest priority):

1. CP  
2. MHWZ/HWZ: for gun batteries, MHWZ has a higher priority; for Missiles, HWZ has a higher priority.  
3. GEV  
4. MSLT  
5. Any other armor unit  
6. Infantry: groups against which it can get the best CRT odds take priority over tougher groups. e.g. an INF1 unit will have targeting priority over an INF3 unit. Infantry are essentially never targeted by missiles: see the [Missiles](#missiles) section.

Notes:

* A disabled unit always has a priority higher than other units of the same classification, but a lower priority than the next-higher classification. e.g. a *disabled* GEV has a *higher* priority than an active GEV, but has a *lower* priority than a HWZ.  
* When there is a tie for priority, break the tie with the *first* of the following rules which applies:  
  1. When multiple targets of the same priority are in firing range, the one(s) furthest away get priority.  
  2. A target in a rear arc has priority over those in the side or front.  
  3. A target in a side arc has a higher priority than those in front.  
  4. Else roll randomly to determine which target is selected.  
* On occasion, Targeting Priorities are used to determine movement/ramming direction instead of a combat target. In such cases, change the *first choice* in the list above to:  
  1. When multiple targets of the same priority are in firing range, the one(s) closest to the CP get priority.

  Sidebar: the GEV and MSLT have higher targeting priorities than other armor units because they can eventually become "immune" to attacks from an Ogre unless it has missiles. An Ogre with 2 MP and no main batteries is open game for GEVs unless they get knotted up in terrain. Likewise, MSLTs are immune to an Ogre with 1 MP and no main batteries. Contrariwise, other mobile armor units (except for MHWZ) can be subject to attacks from a mobile Ogre so long as it has any secondary batteries remaining.

## **Missiles** {#missiles}

Each MOOSE-controlled Ogre has a "missile aggression" (MAG) rating (defaulting to 2\) which determines how likely the Ogre is to fire a missile in any given round. If any targets are *outside of battery range* but inside missile range, roll 1d6. If the result is equal to or less than the MAG, the Ogre will fire one missile at the target. If there is more than one potential target, use the [targeting priorities](#targeting-priorities). If there are multiple targets of the same (highest) priority, the Ogre will target the one *furthest away*. If there are *still* multiple legal targets, roll a die to determine which one gets targeted.

A MAG of 6 means the Ogre will fire a missile each turn, provided the missile targeting rules allow for it. A MAG of 0 indicates that the Ogre will fire *only* upon CP and \[M\]HWZ units, and will always do so, without making a MAG roll, as soon as one is in range. An Ogre with MAG 0 and no CP or HWZs to fire upon will fire its missiles freely at remaining targets, as if it has a MAG of 6\.

Notes and Exceptions:

* Ogres never fire missiles at targets inside their battery range (but an Ogre with no batteries remaining has a battery range of 0, making any range legal for missiles).  
* Ogres will always fire a missile at a \[M\]HWZ or CP in range, regardless of their MAG rating, unless those targets are within MB/SB range, in which case it will attack with those weapons.  
* Ogres never fire more than one missile per turn unless there are multiple CPs and/or HWZs in range, or the player tweaks their programming. In the case of CPs/HWZs, the Ogre may fire any number of missiles (one per target) at them, preferring CPs over HWZs.  
* Ogres never fire missiles at Heavy Tanks unless they have no batteries remaining. Justification: HVYs have to get within SB range in order to shoot at the Ogre.  
* Ogres never fire missiles at infantry unless they have *no* other weaponry. (It is, however, *highly unlikely* that an Ogre gets stripped of all guns yet has missiles remaining. (Unless it has a MAG of 0, in which case it's quite possible, but MAG 0 Ogres will only ever target CPs and HWZs with missiles.))

# Using GEV Maps {#using-gev-maps}

Suggestions for using these rules on the GEV-style maps…

## **Swamps** {#swamps}

An Ogre will never move into a swamp unless doing so will bring it within effective attack (or ramming) range of its single (or last) primary target. An Ogre which has no option but to pass through a swamp in order to reach a primary target will do so, but only as a last resort. e.g. a gunless Ogre would move into a swamp to try to ram a Command Post in that swamp, but even such a desperate Ogre will choose the path which covers the fewest swamp hexes.

For all non-last-resort purposes, treat swamps as impassable terrain.

## **Faster/Shorter Routes** {#faster/shorter-routes}

When multiple routes are of equal distance to the Ogre's destination, it will generally choose the faster route. e.g. a route with a road would be preferred, if available, and any non-swamp terrain would be preferred over traveling underwater. An exception should be made when the faster route is far better defended than the slower route, especially if the slower route is completely unguarded and not covered by a HWZ.

Players may want to come up with a formula for calculating movement distances which takes into account defensive units along a route, where such units add to the effective traveling distance. With such an algorithm, an unprotected route may be rated as "shorter", even if it covers more hexes than a more direct, but better-defended, route. For example, calculate the range, in movement points, to the desired hex, then add 1 MP for each point of ATT which "could" be applied to the Ogre along that route (counting only the current positions of units, not any movement they may take during that time). Alternatively, add 1 MP for every 2 or 3 or 5 ATT points which "could" be applied along that route.

Reminder to self: there's a BGG thread about this topic: [https://www.boardgamegeek.com/thread/2139991](https://www.boardgamegeek.com/thread/2139991)

## **Submerged Ogres** {#submerged-ogres}

When traveling underwater, optionally increase the Ogre's MAG by one or two to increase the chance of it firing missiles (as it is unable to use any other weapons while submerged).

# Notes and TODOs {#notes-and-todos}

## **Known Weaknesses** {#known-weaknesses}

* G.E.V. Fuzzy Wuzzy tactics are likely to succeed against a MOOSE-driven Ogre. It is recommended that players use some discretion in selecting a "well-balanced" force when playing MOOSE. On the other hand, the random nature of Ogre movement in MOOSE makes it difficult for a player to choose optimal 2nd-movement-phase retreat tactics, as they cannot be certain which direction the Ogre will move on its next turn unless they set up units to bait it into following specific rules. Such baiting will, more often than not, result in the loss of the "bait" unit(s) but may buy the player more time.  
* The "Behind It" rules need tweaking. It is currently possible to use them to bait the Ogre into ping-ponging back and forth or side-to-side, buying the defender time to amass slower-moving units within range. e.g. if an initial force of GEVs or HVYs can get behind or beside it, the player may get time to move more HVYs and/or MSLs into range before the Ogre cleans up its flanks. In some tests this has allowed the player to get up to 7 armor units in range at a time, and thereby quickly bring it to its knees.

## **Alternate Acronyms/Names for these Rules** {#alternate-acronyms/names-for-these-rules}

* Solo Ogre (something with L) Opponent ⇒ SOLO  
  * Single \[Combine|Paneuropean|Black|White\] Ogre Looking for Opponent  
    * A shame that PC'ness calls for *not* using: *Single Black Ogre Looking for Opponent* ⇒ S'BOLO, as that'd be a sort-of reference to Ogre's primary initial inspiration.  
  * Single Ogre Seeks Opponent ⇒ SOSO  
* ~~\[Solo\] Ogre Opponent Machine~~  
* ~~Ogre Automation System~~  
* ~~Automated Ogre for Solo Play (AOSP ⇒ Android Open Source Project)~~  
* ~~Opponent Simulation System for Ogre~~  
* Ogre: Yet Another Solo System ⇒ OYASS  
* ~~Better Ogre Raid Simulator: BORiS (from Fritz Freiheit)~~  
* ~~Automated Opponents for Lone\[ly\] Ogre Players~~  
* Cybertrank Rushing Upwards to Stomp your House ⇒ CRUSH  
* ~~Solo Automation for that Cybertank Game~~  
* ~~Solo Ogre Automation Kit ⇒ SOAK~~  
* ~~The Decent Ogre Opponent Kit ⇒ The Dook~~  
* Single-Player Ogre Opponent Kit ⇒ SPOOK or SPOOKi  
* Better Ogre Simulator System ⇒ BOSS  
* Solo Ogre Game: General Enjoyment Deployment  ⇒ SOGGED  
* ~~My Other Car is an Ogre ⇒ MOCO (okay, that's stretching it)~~  
* Single Automated Cybertank Seeks Enemy: SACSE (as in "too SACSE for this game…")  
* ~~Combine Ogre: Will (Shoot | Succeed) ⇒ COWS~~  
* You, Yourself, and Ogre ⇒ YoYO (i like that, as well as…)  
* Me, Myself, and Ogre ⇒ MeMO  
* Me, Ogre, and Myself ⇒ MOM or MOMy  
* still thinking...

[^1]:  Ogre is a registered trademark of Steve Jackson Games Incorporated.

[^2]:  Not to be confused with the Y2K Deluxe Edition.

[^3]:  i.e. destroy the defending CP.

[^4]:  Players are of course free to use other dice/dimensions. We use d6 because those are the only dice used in Ogre.

[^5]:  That value is 7 for a Mark III, 10 for a Mark V.

[^6]:  "Region" being one of northern, central, or southern, as defined by the Ogre scenario setup rules.

[^7]:  When accounting for potential upcoming ramming which might reduce the Ogre's MP, one may have to make a judgment call or roll a die to decide.

[^8]:  It might be interesting (but potentially complex and full of corner cases) to expand the definition of "adjacent" to include units within the Ogre's current movement range. That would likely eliminate the current "blind spot" behind it.

[^9]:  This does not guaranty that the Ogre *will* fire upon the unit, only that it *could* potentially do so.

[^10]:  TODO: add a formal term/definition distinguishing these two MP values. Maybe MPPT ("per turn") and MPRT ("remaining \[this\] turn").

[^11]:  Not that that matters much because the movement table is not used while an Ogre's movement is influenced by a high-priority goal.

[^12]:  Only units with DEF 4+ will trigger such a case, and only when the Ogre has only one remaining SB and at least one remaining MB.