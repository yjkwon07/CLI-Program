#!/usr/bin/env node 
const fs = require('fs');
const path = require('path');

const type = process.argv[2];
const name = process.argv[3];
const directory = process.argv[4] || '.';

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
`;

const routerTemplate = `
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.send('ok');
    } catch(error) {
        console.error(error);
        next(error);
    }
});
module.exports = router;
`;

const exist = (dir) => {
    try{
        fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch(e) {
        return false;
    }
};

const mkdirp = (dir) => {
    const dirname = path.relative('.', path.normalize(dir)).split(path.sep).filter(p => !!p);
    dirname.forEach( (d, idx) => {
        const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
        if(!exist(pathBuilder)){
            fs.mkdirSync(pathBuilder);
        }
    });
};

const makeTemplate = () => {
    mkdirp(directory);
    if(type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if(exist(pathToFile)){
            console.error('이미 해당 파일이 존재 합니다.');
        } else {
            // 서버같은 경우 sync안쓰는게 좋다. 
            // 블록킹이기때문에 다른 요청들이 블록킹이 된다.
            // cli같은 경우는 한 번만 실행되는 경우에는 Sync 메서드를 써도 된다.
            // 여러 번 동시에 호출 될 것 같으면 쓰지 않는게 좋다.
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(pathToFile, '생성 완료');
        }
    } else if(type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);
        if(exist(pathToFile)){
            console.error('이미 해당 파일이 존재합니다.');
        } else{
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(pathToFile, "생성 완료");
        }
    }
    else {
        console.error('html 또는 express-router 둘 중 하나를 입력하세요.');
    }
};

const program = () => {
    if(!type || !name) {
        console.error("사용방법: cli html|express-router 파일명 [생성경로]");
    } else{
        makeTemplate();
    }
};
program();
