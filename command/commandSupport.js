const chalk = require('chalk');
const {exist, mkdirp} = require('../public/publicDir');
const path = require('path');
const fs = require('fs');

let htmlTemplate;
let routerTemplate;
const makeTemplate = (type, name, directory) => {
    mkdirp(directory);
    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if (exist(pathToFile)) {
            console.error(chalk.bold.red('이미 해당 파일이 존재 합니다.')); 
        } else {
            // 서버같은 경우 sync안쓰는게 좋다. 
            // 블록킹이기때문에 다른 요청들이 블록킹이 된다.
            // cli같은 경우는 한 번만 실행되는 경우에는 Sync 메서드를 써도 된다.
            // 여러 번 동시에 호출 될 것 같으면 쓰지 않는게 좋다.
            fs.readFile('./template/htmlTemplate', (err, data) => {
                if(err) throw err;
                htmlTemplate = data.toString();
                fs.writeFileSync(pathToFile, htmlTemplate);
            });
            console.log(chalk.green(pathToFile,pathToFile, '생성 완료'));
        }
    } else if (type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);
        if (exist(pathToFile)) {
            console.error('이미 해당 파일이 존재합니다.');
        } else {
            fs.readFile('./template/routerTemplate', (err, data) => {
                if(err) throw err;
                routerTemplate = data.toString();
                fs.writeFileSync(pathToFile, routerTemplate);
            });
            console.log(chalk.green(pathToFile, "생성 완료"));
        }
    }
    else {
        console.error(chalk.green('html 또는 express-router 둘 중 하나를 입력하세요.'));
    }
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

module.exports = {makeTemplate, copyFile, rimraf};