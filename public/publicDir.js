const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const exist = (dir) => {
    try {
        fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch (e) {
        return false;
    }
};

const mkdirp = (dir) => {
    const dirname = path.relative('.', path.normalize(dir)).split(path.sep).filter(p => !!p);
    dirname.forEach((d, idx) => {
        const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
        if (!exist(pathBuilder)) {
            fs.mkdirSync(pathBuilder);
        }
    });
};

const copyFile = (name , directory) => {
    if(exist(name)) {
        mkdirp(directory);
        fs.copyFile(name , path.join(directory, name), (err) =>{
            if(err) throw err;
        });
        console.log(chalk.green(`${name} 파일이 복사되었습니다.`));
    }else {
        console.log(chalk.bold.red('파일이 존재하지 않습니다.'));
    }
};

const rimraf = (p) => {
    if(exist(p)){
        try{
            const dir =fs.readdirSync(p);
            dir.forEach((d) => {
                rimraf(path.join(p, d));
            });
            fs.rmdirSync(p);
            console.log(chalk.green(`${p} 폴더를 삭제했습니다.`));
        }catch(e){
            fs.unlinkSync(p);
            console.log(chalk.green(`${p} 파일을 삭제했습니다.`));
        }
    }else {
        console.log(chalk.bold.red('파일이 존재하지 않습나다.'));
    }
};
module.exports = {exist, mkdirp, copyFile, rimraf};