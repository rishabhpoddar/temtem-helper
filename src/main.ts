import fs from "fs";

const opponentTemtem: {
    type: string[],
    name: string
}[] = []

for (let i = 2; i < 4; i++) {
    if (process.argv[i] !== undefined) {
        let fileContent = JSON.parse(fs.readFileSync(process.argv[i], { encoding: 'utf8', flag: 'r' }));
        let slashSplitted = process.argv[i].split("/");
        fileContent.name = slashSplitted[slashSplitted.length - 1].split(".json")[0];
        opponentTemtem.push(fileContent);
    }
}

console.log("Opponent 1: " + opponentTemtem[0].name)
if (opponentTemtem.length > 1) {
    console.log("Opponent 2: " + opponentTemtem[1].name)
}