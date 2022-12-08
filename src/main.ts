import fs from "fs";

const attackToDefenceAffectiveness: { [key: string]: { [key: string]: number } } = JSON.parse(fs.readFileSync("./attackToDefenceAffectiveness.json", { encoding: 'utf8', flag: 'r' }));

type Temtem = {
    type: string[],
    name: string,
}

let mysquad: string[] = JSON.parse(fs.readFileSync("./mysquad.json", { encoding: 'utf8', flag: 'r' }));

const myTemtem: Temtem[] = []

mysquad.forEach(t => {
    let info = JSON.parse(fs.readFileSync("./temtem/" + t.toLowerCase() + ".json", { encoding: 'utf8', flag: 'r' }))

    myTemtem.push({
        ...info,
        name: t.toLowerCase()
    })
})

const opponentTemtem: Temtem[] = []

for (let i = 2; i < 4; i++) {
    if (process.argv[i] !== undefined) {
        let fileContent = JSON.parse(fs.readFileSync(process.argv[i], { encoding: 'utf8', flag: 'r' }));
        let slashSplitted = process.argv[i].split("/");
        fileContent.name = slashSplitted[slashSplitted.length - 1].split(".json")[0];
        opponentTemtem.push(fileContent);
    }
}

let defendTypeEffectivenessAgainstOpponents: {
    temtem: Temtem, opponents: {
        name: string, effectiveness: number, defenseTypeScores: { [key: string]: number }
    }[]
}[] = []
myTemtem.forEach(currTemtem => {
    let defenseTypeScores: { [key: string]: number } = {}
    opponentTemtem[0].type.forEach(i => {
        defenseTypeScores[i] = calculateAttackEffectiveness(i, currTemtem)
    })
    let effectiveness: {
        name: string, effectiveness: number, defenseTypeScores: { [key: string]: number }
    }[] = [{
        name: opponentTemtem[0].name,
        effectiveness: calculateAttackEffectivenessWithTemtem(opponentTemtem[0], currTemtem),
        defenseTypeScores
    }]
    if (opponentTemtem.length > 1) {
        defenseTypeScores = {}
        opponentTemtem[1].type.forEach(i => {
            defenseTypeScores[i] = calculateAttackEffectiveness(i, currTemtem)
        })
        effectiveness.push({
            name: opponentTemtem[1].name,
            effectiveness: calculateAttackEffectivenessWithTemtem(opponentTemtem[1], currTemtem),
            defenseTypeScores
        })
    }
    defendTypeEffectivenessAgainstOpponents.push({
        temtem: currTemtem,
        opponents: effectiveness
    })
})

// now we order the attack types. This will order based on most effective attack type against
// either component to least effective.
defendTypeEffectivenessAgainstOpponents.sort((a, b) => {
    let maxEffectivenessA = a.opponents[0].effectiveness
    let minEffectivenessA = a.opponents[0].effectiveness
    if (a.opponents.length > 1) {
        maxEffectivenessA = Math.max(maxEffectivenessA, a.opponents[1].effectiveness)
    }
    if (a.opponents.length > 1) {
        minEffectivenessA = Math.min(minEffectivenessA, a.opponents[1].effectiveness)
    }

    let maxEffectivenessB = b.opponents[0].effectiveness
    let minEffectivenessB = b.opponents[0].effectiveness
    if (b.opponents.length > 1) {
        maxEffectivenessB = Math.max(maxEffectivenessB, b.opponents[1].effectiveness)
    }
    if (b.opponents.length > 1) {
        minEffectivenessB = Math.min(minEffectivenessB, b.opponents[1].effectiveness)
    }

    if (maxEffectivenessA != maxEffectivenessB) {
        return maxEffectivenessA - maxEffectivenessB
    }
    return minEffectivenessA - minEffectivenessB
})

console.log("TO DEFEND:")
defendTypeEffectivenessAgainstOpponents.forEach(i => {
    console.log(i.temtem.name + " => ");
    i.opponents.forEach(o => {
        let opponentStr = o.name + " can do " + o.effectiveness + "x damage to " + i.temtem.name + " => "
        Object.keys(o.defenseTypeScores).forEach((k, i) => {
            opponentStr += k + "(" + o.defenseTypeScores[k] + "x) " + (Object.keys(o.defenseTypeScores).length === 2 && i === 0 ? " || " : "")
        })
        console.log("   " + opponentStr)
    })
})
console.log("\n")

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////


let attackTypeEffectivenessAgainstOpponents: {
    temtem: Temtem, opponents: {
        name: string, effectiveness: number, attackTypeScores: { [key: string]: number }
    }[]
}[] = []
myTemtem.forEach(currTemtem => {
    let attackTypeScores: { [key: string]: number } = {}
    currTemtem.type.forEach(i => {
        attackTypeScores[i] = calculateAttackEffectiveness(i, opponentTemtem[0])
    })
    let effectiveness: {
        name: string, effectiveness: number, attackTypeScores: { [key: string]: number }
    }[] = [{
        name: opponentTemtem[0].name,
        effectiveness: calculateAttackEffectivenessWithTemtem(currTemtem, opponentTemtem[0]),
        attackTypeScores
    }]
    if (opponentTemtem.length > 1) {
        attackTypeScores = {}
        currTemtem.type.forEach(i => {
            attackTypeScores[i] = calculateAttackEffectiveness(i, opponentTemtem[1])
        })
        effectiveness.push({
            name: opponentTemtem[1].name,
            effectiveness: calculateAttackEffectivenessWithTemtem(currTemtem, opponentTemtem[1]),
            attackTypeScores
        })
    }
    attackTypeEffectivenessAgainstOpponents.push({
        temtem: currTemtem,
        opponents: effectiveness
    })
})

// now we order the attack types. This will order based on most effective attack type against
// either component to least effective.
attackTypeEffectivenessAgainstOpponents.sort((a, b) => {
    let maxEffectivenessA = a.opponents[0].effectiveness
    let minEffectivenessA = a.opponents[0].effectiveness
    if (a.opponents.length > 1) {
        maxEffectivenessA = Math.max(maxEffectivenessA, a.opponents[1].effectiveness)
    }
    if (a.opponents.length > 1) {
        minEffectivenessA = Math.min(minEffectivenessA, a.opponents[1].effectiveness)
    }

    let maxEffectivenessB = b.opponents[0].effectiveness
    let minEffectivenessB = b.opponents[0].effectiveness
    if (b.opponents.length > 1) {
        maxEffectivenessB = Math.max(maxEffectivenessB, b.opponents[1].effectiveness)
    }
    if (b.opponents.length > 1) {
        minEffectivenessB = Math.min(minEffectivenessB, b.opponents[1].effectiveness)
    }

    if (maxEffectivenessA != maxEffectivenessB) {
        return maxEffectivenessB - maxEffectivenessA
    }
    return minEffectivenessB - minEffectivenessA
})

console.log("TO ATTACK:")
attackTypeEffectivenessAgainstOpponents.forEach(i => {
    console.log(i.temtem.name + " => ");
    i.opponents.forEach(o => {
        let opponentStr = o.name + " takes " + o.effectiveness + "x damage from " + i.temtem.name + " => "
        Object.keys(o.attackTypeScores).forEach((k, i) => {
            opponentStr += k + "(" + o.attackTypeScores[k] + "x) " + (Object.keys(o.attackTypeScores).length === 2 && i === 0 ? " || " : "")
        })
        console.log("   " + opponentStr)
    })
})
console.log("\n")

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////


let typeToPositionForAttack: { [key: string]: number } = {}

let prevPosition = -1;
let prevPositionMin = 100;
let prevPositionMax = -1;
attackTypeEffectivenessAgainstOpponents.forEach(i => {
    let currPositionMin = i.opponents[0].effectiveness;
    let currPositionMax = i.opponents[0].effectiveness;
    if (i.opponents.length > 1) {
        currPositionMin = Math.min(currPositionMin, i.opponents[1].effectiveness)
    }
    if (i.opponents.length > 1) {
        currPositionMax = Math.max(currPositionMax, i.opponents[1].effectiveness)
    }
    if (currPositionMax != prevPositionMax || currPositionMin != prevPositionMin) {
        prevPosition++;
        prevPositionMin = currPositionMin
        prevPositionMax = currPositionMax
    }
    typeToPositionForAttack[i.temtem.name] = prevPosition
})


let typeToPositionForDefend: { [key: string]: number } = {}

prevPosition = -1;
prevPositionMin = 100;
prevPositionMax = -1;
defendTypeEffectivenessAgainstOpponents.forEach(i => {
    let currPositionMin = i.opponents[0].effectiveness;
    let currPositionMax = i.opponents[0].effectiveness;
    if (i.opponents.length > 1) {
        currPositionMin = Math.min(currPositionMin, i.opponents[1].effectiveness)
    }
    if (i.opponents.length > 1) {
        currPositionMax = Math.max(currPositionMax, i.opponents[1].effectiveness)
    }
    if (currPositionMax != prevPositionMax || currPositionMin != prevPositionMin) {
        prevPosition++;
        prevPositionMin = currPositionMin
        prevPositionMax = currPositionMax
    }
    typeToPositionForDefend[i.temtem.name] = prevPosition
})

myTemtem.sort((a, b) => {
    let maxA = Math.max(typeToPositionForAttack[a.name], typeToPositionForDefend[a.name])
    let minA = Math.min(typeToPositionForAttack[a.name], typeToPositionForDefend[a.name])
    let maxB = Math.max(typeToPositionForAttack[b.name], typeToPositionForDefend[b.name])
    let minB = Math.min(typeToPositionForAttack[b.name], typeToPositionForDefend[b.name])
    if (maxA != maxB) {
        return maxA - maxB
    }
    return minA - minB
})

console.log("TO ATTACK AND DEFEND")
myTemtem.forEach(i => {
    let score = myTemtem.length - (typeToPositionForAttack[i.name] * typeToPositionForDefend[i.name])
    console.log(i.name + ". Overall score: " + score)
})


function calculateAttackEffectiveness(attackType: string, temtem: Temtem): number {
    let result = 1;
    temtem.type.forEach(defenceType => {
        result = result * attackToDefenceAffectiveness[attackType][defenceType]
    })
    return result;
}

function calculateAttackEffectivenessWithTemtem(temtemToAttack: Temtem, temtemToDefend: Temtem): number {
    let result = -1;
    temtemToAttack.type.forEach(attackType => {
        result = Math.max(result, calculateAttackEffectiveness(attackType, temtemToDefend))
    })
    return result;
}