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

allTypes.forEach(currType => {
    console.log("\nFor type: " + currType)
    console.log(opponentTemtem[0].name + ": " + calculateAttackEffectiveness(currType, opponentTemtem[0]));
    if (opponentTemtem.length > 1) {
        console.log(opponentTemtem[1].name + ": " + calculateAttackEffectiveness(currType, opponentTemtem[1]));
    }
})


function calculateAttackEffectiveness(type: string, temtem: Temtem): number {
    let result = 1;
    temtem.type.forEach(temtemType => {
        result = result * attackToDefenceAffectiveness[type][temtemType]
    })
    return result;
}