const soloCards = [{
    quantity: 3,
    command: "Advance Forward - May deviate for terrain",
    rolls: [
         {
             roll: 1,
             target_priority: "Infantry -> Armor -> GEV",
             attack_ratio: "1:1"
         },
         {
             roll: 2,
             target_priority: "Infantry -> GEV -> Armo",
             attack_ratio: "1:1"
         },
         {
             roll: 3,
             target_priority: "Armor -> GEV -> Infantry",
             attack_ratio: "1:1"
         },
         {
             roll: 4,
             target_priority: "Armor -> Infantry -> GEV",
             attack_ratio: "1:1"
         },
         {
             roll: 5,
             target_priority: "GEV -> Armor -> Infantry",
             attack_ratio: "2:1"
         },
         {
             roll: 6,
             target_priority: "GEV -> Infantry -> Armor 3:1",
             attack_ratio: "3:1"
         }
    ]
},
{
    quantity: 2,
    command: "Advance, deviate and RAM!",
    rolls: [
         {
             roll: 1,
             target_priority: "Infantry -> Armor -> GEV",
             attack_ratio: "1:1"
         },
         {
             roll: 2,
             target_priority: "Infantry -> GEV -> Armo",
             attack_ratio: "1:1"
         },
         {
             roll: 3,
             target_priority: "Armor -> GEV -> Infantry",
             attack_ratio: "1:1"
         },
         {
             roll: 4,
             target_priority: "Armor -> Infantry -> GEV",
             attack_ratio: "1:1"
         },
         {
             roll: 5,
             target_priority: "GEV -> Armor -> Infantry",
             attack_ratio: "2:1"
         },
         {
             roll: 6,
             target_priority: "GEV -> Infantry -> Armor 3:1",
             attack_ratio: "3:1"
         }
    ]
},
{
    quantity: 2,
    command: "Go Left - Must move 1 Hex left",
    rolls: [
         {
             roll: 1,
             target_priority: "Infantry -> Armor -> GEV",
             attack_ratio: "1:1"
         },
         {
             roll: 2,
             target_priority: "Infantry -> GEV -> Armo",
             attack_ratio: "1:1"
         },
         {
             roll: 3,
             target_priority: "Armor -> GEV -> Infantry",
             attack_ratio: "1:1"
         },
         {
             roll: 4,
             target_priority: "Armor -> Infantry -> GEV",
             attack_ratio: "1:1"
         },
         {
             roll: 5,
             target_priority: "GEV -> Armor -> Infantry",
             attack_ratio: "2:1"
         },
         {
             roll: 6,
             target_priority: "GEV -> Infantry -> Armor 3:1",
             attack_ratio: "3:1"
         }
    ]
},
{
    quantity: 2,
    command: "Go Right - Must move 1 Hex right",
    rolls: [
         {
             roll: 1,
             target_priority: "Infantry -> Armor -> GEV",
             attack_ratio: "1:1"
         },
         {
             roll: 2,
             target_priority: "Infantry -> GEV -> Armo",
             attack_ratio: "1:1"
         },
         {
             roll: 3,
             target_priority: "Armor -> GEV -> Infantry",
             attack_ratio: "1:1"
         },
         {
             roll: 4,
             target_priority: "Armor -> Infantry -> GEV",
             attack_ratio: "1:1"
         },
         {
             roll: 5,
             target_priority: "GEV -> Armor -> Infantry",
             attack_ratio: "2:1"
         },
         {
             roll: 6,
             target_priority: "GEV -> Infantry -> Armor 3:1",
             attack_ratio: "3:1"
         }
    ]
},
{
    quantity: 1,
    command: "Attack Rear - Move backwards or remain Stationary",
    rolls: [
         {
             roll: 1,
             target_priority: "Infantry -> Armor -> GEV",
             attack_ratio: "1:1"
         },
         {
             roll: 2,
             target_priority: "Infantry -> GEV -> Armo",
             attack_ratio: "1:1"
         },
         {
             roll: 3,
             target_priority: "Armor -> GEV -> Infantry",
             attack_ratio: "1:1"
         },
         {
             roll: 4,
             target_priority: "Armor -> Infantry -> GEV",
             attack_ratio: "1:1"
         },
         {
             roll: 5,
             target_priority: "GEV -> Armor -> Infantry",
             attack_ratio: "2:1"
         },
         {
             roll: 6,
             target_priority: "GEV -> Infantry -> Armor 3:1",
             attack_ratio: "3:1"
         }
    ]
},
]



let cardPicked = diceRoll(10)
let diceRolled = diceRoll(6)
console.log(cardPicked, diceRolled)
var deck = []

soloCards.forEach( card => {
    for (let i = 0; i < card.quantity; i++) {
        deck.push(card);
    }
});

console.log("OGRE movement: " + deck[cardPicked - 1]["command"])
console.log("OGRE target priority: " +deck[cardPicked -1].rolls[diceRolled -1]["target_priority"])
console.log("OGRE desired attack ratio: " +deck[cardPicked -1].rolls[diceRolled -1]["attack_ratio"])


function diceRoll(sides) {
    return Math.ceil(Math.random() * sides);
}