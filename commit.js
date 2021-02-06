var readline = require('readline');
const {green, red, blue, yellow} = require("chalk")
const {exec} = require("child_process");
const {exit} = require('process');
var rl = readline.createInterface({input: process.stdin, output: process.stdout});

rl.question(green("What is the commit message?:  "), function (answer) {

    exec(`git add --all`, async (error, stdout, stderr) => {
        await console.log(await error || await stdout || await stderr)
    })
    exec(`git commit -m "${answer}"`, async (error, stdout, stderr) => {
        await console.log(await error || await stdout || await stderr)
    })
    rl.question(green("DO you want to push?:  "), function (answer) {
        if (answer == 'yes' || answer == 'y') {
            exec(`git push`, async (error, stdout, stderr) => {
                await console.log(await error || await stdout || await stderr)
            })
            console.log(blue("Pushed the commit")) && exit(69)

        } else if (answer == 'no' || answer == 'n') 
            return console.log(blue("Done")) && exit(69)


         else 
            return console.log(yellow("I assume you dont want to push")) && exit(69)


        


    })
})
