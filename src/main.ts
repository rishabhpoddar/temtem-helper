import fs from "fs";

const attackToDefenceAffectiveness: { [key: string]: { [key: string]: number } } = JSON.parse(fs.readFileSync("./attackToDefenceAffectiveness.json", { encoding: 'utf8', flag: 'r' }));

const allTypes = Object.keys(attackToDefenceAffectiveness);

type Temtem = {
    type: string[],
    name: string
}

const opponentTemtem: Temtem[] = []

for (let i = 2; i < 4; i++) {
    if (process.argv[i] !== undefined) {
        let fileContent = JSON.parse(fs.readFileSync(process.argv[i], { encoding: 'utf8', flag: 'r' }));
        let slashSplitted = process.argv[i].split("/");
        fileContent.name = slashSplitted[slashSplitted.length - 1].split(".json")[0];
        opponentTemtem.push(fileContent);
    }
}

let attackTypeEffectivenessAgainstOpponents: {
    attackType: string, opponents: {
        name: string, effectiveness: number
    }[]
}[] = []
allTypes.forEach(currType => {
    let effectiveness: {
        name: string, effectiveness: number
    }[] = [{
        name: opponentTemtem[0].name,
        effectiveness: calculateAttackEffectiveness(currType, opponentTemtem[0])
    }]
    if (opponentTemtem.length > 1) {
        effectiveness.push({
            name: opponentTemtem[1].name,
            effectiveness: calculateAttackEffectiveness(currType, opponentTemtem[1])
        })
    }
    attackTypeEffectivenessAgainstOpponents.push({
        attackType: currType,
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
    let opponentStr = ""
    i.opponents.forEach(o => {
        opponentStr += (o.name + " " + o.effectiveness + " | ")
    })
    console.log(i.attackType + " => " + opponentStr);
})
console.log("\n")

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

let defendTypeEffectivenessAgainstOpponents: {
    defendType: string, opponents: {
        name: string, effectiveness: number
    }[]
}[] = []
allTypes.forEach(currType => {
    let effectiveness: {
        name: string, effectiveness: number
    }[] = [{
        name: opponentTemtem[0].name,
        effectiveness: calculateDefenceEffectiveness(currType, opponentTemtem[0])
    }]
    if (opponentTemtem.length > 1) {
        effectiveness.push({
            name: opponentTemtem[1].name,
            effectiveness: calculateDefenceEffectiveness(currType, opponentTemtem[1])
        })
    }
    defendTypeEffectivenessAgainstOpponents.push({
        defendType: currType,
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
    let opponentStr = ""
    i.opponents.forEach(o => {
        opponentStr += (o.name + " " + o.effectiveness + " | ")
    })
    console.log(i.defendType + " => " + opponentStr);
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
    typeToPositionForAttack[i.attackType] = prevPosition
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
    typeToPositionForDefend[i.defendType] = prevPosition
})

allTypes.sort((a, b) => {
    let maxA = Math.max(typeToPositionForAttack[a], typeToPositionForDefend[a])
    let minA = Math.min(typeToPositionForAttack[a], typeToPositionForDefend[a])
    let maxB = Math.max(typeToPositionForAttack[b], typeToPositionForDefend[b])
    let minB = Math.min(typeToPositionForAttack[b], typeToPositionForDefend[b])
    if (maxA != maxB) {
        return maxA - maxB
    }
    return minA - minB
})

console.log("TO ATTACK AND DEFEND")
allTypes.forEach(i => console.log(i))


function calculateAttackEffectiveness(attackType: string, temtem: Temtem): number {
    let result = 1;
    temtem.type.forEach(defenceType => {
        result = result * attackToDefenceAffectiveness[attackType][defenceType]
    })
    return result;
}

function calculateDefenceEffectiveness(defenceType: string, temtem: Temtem): number {
    let result = -1;
    temtem.type.forEach(attackType => {
        result = Math.max(result, attackToDefenceAffectiveness[attackType][defenceType])
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