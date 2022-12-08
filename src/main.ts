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

console.log("Opponent 1: " + opponentTemtem[0].name + " | " + opponentTemtem[0].type[0] + " " + (opponentTemtem[0].type[1] === undefined ? "" : opponentTemtem[0].type[1]))
if (opponentTemtem.length > 1) {
    console.log("Opponent 2: " + opponentTemtem[1].name + " | " + opponentTemtem[1].type[0] + " " + (opponentTemtem[1].type[1] === undefined ? "" : opponentTemtem[1].type[1]))
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
    let resultA = -1;
    a.opponents.forEach(o => {
        resultA = Math.max(resultA, o.effectiveness)
    })
    let resultB = -1;
    b.opponents.forEach(o => {
        resultB = Math.max(resultB, o.effectiveness)
    })

    return resultB - resultA
})

console.log(JSON.stringify(attackTypeEffectivenessAgainstOpponents, null, 2))


function calculateAttackEffectiveness(attackType: string, temtem: Temtem): number {
    let result = 1;
    temtem.type.forEach(defenceType => {
        result = result * attackToDefenceAffectiveness[attackType][defenceType]
    })
    return result;
}