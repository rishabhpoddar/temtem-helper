# Temtem battle helper

This CLI suggests you which Temtem to pick from your squad given the Temtems that you are currently battling.

## 1) Installing
```bash
git clone https://github.com/rishabhpoddar/temtem-helper.git
cd temtem-helper
npm i
```

## 2) Adding your squad

- Open the `mysquad.json` file
- Add your squad temtem names to the list
- Save the file

## 3) Run the program

### If fighting against one Temtem

```bash
npm start ./temtem/bunbun.json
```
- Change the `bunbun.json` to whichever Temtem you are currently fighting

### If fighting against two Temtems
```bash
npm start ./temtem/bunbun.json ./temtem/crystle.json
```
- Change the `bunbun.json` and `crystle.json` to whichever Temtem you are currently fighting.

## 4) Understanding the output

```bash
npm start ./temtem/bunbun.json ./temtem/crystle.json

> temtem-helper@0.0.1 start
> npx ts-node --project ./tsconfig.json ./src/main.ts "./temtem/bunbun.json" "./temtem/crystle.json"

TO DEFEND:
skunch =>
   bunbun can do 1x damage to skunch => earth(1x)  || crystal(1x)
   crystle can do 1x damage to skunch => crystal(1x)
zephyruff =>
   bunbun can do 1x damage to zephyruff => earth(0.5x)  || crystal(1x)
   crystle can do 1x damage to zephyruff => crystal(1x)
saku =>
   bunbun can do 1x damage to saku => earth(0.25x)  || crystal(1x)
   crystle can do 1x damage to saku => crystal(1x)
gyalis =>
   bunbun can do 2x damage to gyalis => earth(2x)  || crystal(1x)
   crystle can do 1x damage to gyalis => crystal(1x)
nessla =>
   bunbun can do 2x damage to nessla => earth(1x)  || crystal(2x)
   crystle can do 2x damage to nessla => crystal(2x)
anahir =>
   bunbun can do 4x damage to anahir => earth(4x)  || crystal(0.5x)
   crystle can do 0.5x damage to anahir => crystal(0.5x)


TO ATTACK:
skunch =>
   skunch can do 4x damage to bunbun => neutral(1x)  || melee(4x)
   skunch can do 2x damage to crystle => neutral(1x)  || melee(2x)
gyalis =>
   gyalis can do 4x damage to bunbun => crystal(0.5x)  || melee(4x)
   gyalis can do 2x damage to crystle => crystal(1x)  || melee(2x)
anahir =>
   anahir can do 1x damage to bunbun => crystal(0.5x)  || fire(1x)
   anahir can do 2x damage to crystle => crystal(1x)  || fire(2x)
nessla =>
   nessla can do 2x damage to bunbun => water(2x)  || electric(0.25x)
   nessla can do 1x damage to crystle => water(1x)  || electric(0.5x)
saku =>
   saku can do 2x damage to bunbun => nature(2x)  || wind(1x)
   saku can do 1x damage to crystle => nature(1x)  || wind(1x)
zephyruff =>
   zephyruff can do 1x damage to bunbun => toxic(0.25x)  || wind(1x)
   zephyruff can do 1x damage to crystle => toxic(0.5x)  || wind(1x)


TO ATTACK AND DEFEND
skunch. Overall score: 5
saku. Overall score: 4
gyalis. Overall score: 4
zephyruff. Overall score: 3
nessla. Overall score: 2
anahir. Overall score: 1
```

There are three sections to the output:
- `TO DEFEND`: Represents the amount of damage that Temtem on your squad can take from the ones you are fighting. For example, from the above output, we can see that `skunch` (which is in our `mysquad.json` file) can take a max of `1x` damage from `bunbun` and also a max of `1x` damage from `crystle`, whereas `gyalis` can take a max of `2x` damage from `bunbun` (cause `bunbun` is `earth` type which is strong against crystal type]).  
- `TO ATTACK`: This represents how much damage your squad can do to the two Temtems that are current being fought. We see that `skunch` can do a `4x` damage to `bunbun` and `2x` to `crystle` whereas `zephyruff` can do a max of `1x` to both.
- `TO ATTACK AND DEFEND`: This list represents which Temtem would be best to choose based on the above two lists. It takes into account both - ability to attack and defend.

So based on this output, `skunch` and (`saku` or `gyalis`) would be our top picks from our squad. The reason we say "`saku` or `gyalis`" is cause they both have the same overall score - `saku` is stronger at defence and `gyalis` is stronger at attack given the two Temtems we are fighting.


## 5) Limitations
This program only does a type comparison based on the types of the Temtems. There are still a lot of factors one needs to consider which this program does not take into account. Some are:
- Attack types of Temtems could be different than the Temtem type
- Temtem levels are not considered
- Synergy between Temtem is not considered.
- Items held by Temtems is ignored.

## 6) Updating Temtem list
If some Temtem have been missed, you will see an error when you run the program with them. To add a new Temtem, create a PR for this repo with that Temtem's JSON file in the `temtem` folder. See other Temtem files for reference.