#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const {makeTemplate, copyFile, rimraf} = require('./command/commandSupport');
/*
    --옵션 -단축옵션
    <필수> [선택]

    command: 명령어
    usage : 설명서 
    descripton: 메시지
    alias: 단축키
    option: 옵션
    action: 수행 
*/
let triggered = false;
program
    .version('0.0.1', '-v, --version')
    .usage('[options]');

program
    .command('template <type>')
    .usage('--name<name> --path [path]')
    .description("탬플릿을 생성합니다.")
    .alias('tmpl')
    .option('-n , --name <name>', '파일명을 입력하세요', 'index')
    .option('-d , --directory [path]', '생성 경로를 입력하세요.', '.')
    .action((type, options) => {
        // console.log(type, options.name , options.directory);
        makeTemplate(type, options.name, options.directory);
        triggered = true;
    });

program
    .command('copy <name> <directory>')
    .usage('<name> <directory>')
    .description('파일을 복사합니다.')
    .action((name, directory) => {
        copyFile(name, directory);
        triggered = true;
    });

// 경로를 지정하면 하위 모든 폴더와 파일을 지우는 명령어
program
    .command('rimraf <path>')
    .usage('<path>')
    .description('지정한 경로와 그 아래 파일/폴더를 지웁니다.')
    .action( (path) => {
        rimraf(path);
        triggered=true;
    })

// noHelp가 true면 도움말에 해당 명령어 설명이 뜨지 않는다.
program
    .command("*", { noHelp: true })
    .action(() => {
        console.log('해당 명령어를 찾을 수 없습니다.');
        program.help();
        triggered = true;
    });
program.parse(process.argv);

// inquirer 만들기
/*
    type:프롬프트 종률
    name: 질문명
    message:메시지
    choices:선택지
    default:기본값
*/
if (!triggered) {
    inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: '템플릿 종류를 선택하세요.',
        choices: ['html', 'express-router'],
    }, {
        type: 'input',
        name: 'name',
        message: '파일의 이름을 입력하세요.',
        default: 'index',
    }, {
        type: 'input',
        name: 'directory',
        message: '파일이 위치할 폴더의 경로를 입력하세요.',
        default: '.',
    }, {
        type: 'confirm',
        name: 'confirm',
        message: "생성하시겠습니까?",
    }])
        .then((answer) => {
            if (answer.confirm) {
                makeTemplate(answer.type, answer.name, answer.directory);
                console.log(chalk.rgb(128, 128,128)(`터미널을 종료합니다.`));
            }
        });
}