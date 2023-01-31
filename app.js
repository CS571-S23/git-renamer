import fs from 'fs';

let dirName = process.argv[2];

const MAPPINGS = fs.readFileSync('includes/git.csv').toString();
const PAIRS = MAPPINGS.split('\r\n').map(a => a.split(','));

const GIT_TO_NAME = PAIRS.reduce((p, c) => {
    return {...p, [c[1]]: c[0]}
}, {});

// assumes unique names
const NAME_TO_GIT = PAIRS.reduce((p, c) => {
    return {...p, [c[0]]: c[1]}
}, {});

const GITS = Object.keys(GIT_TO_NAME);
const NAMES = Object.keys(NAME_TO_GIT);

if(!dirName) {
    console.error("Please specify the target directory as an argument.");
    process.exit(1);
}

dirName = dirName.replaceAll('\\', '/');

if(!dirName.endsWith('/')) {
    dirName += '/';
}

console.log(`Renaming directories within ${dirName}`)
fs.readdirSync(dirName).forEach(dir => {
    if(!GITS.includes(dir)) {
        console.log(`Found folder of unknown git user ${dir}`);
        if(!fs.existsSync(`${dirName}__UNKNOWN`)) {
            fs.mkdirSync(`${dirName}__UNKNOWN`);
        }
        fs.renameSync(`${dirName+dir}`, `${dirName+'__UNKNOWN/'+dir}`);
    } else {
        fs.renameSync(`${dirName+dir}`, `${dirName+GIT_TO_NAME[dir]}`);
    }
})

console.log("Done!");