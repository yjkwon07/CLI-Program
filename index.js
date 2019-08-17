#!/usr/bin/env node
// process.argv는 사용자가 입력한 내용을 배열로 출력한다.
// process.argv[0]: 노드 설치 경로
// process.argv[1]: 파일 위치 경로
console.log("Hello", process.argv);

const readline = require('readline');

const rl = readline.createInterface( {
    input : process.stdin,
    output : process.stdout
});

console.clear();
const answerCallback = (answer) => {
    if(answer === 'y'){
        console.log('thank you!!');
    }else if(answer === 'n') {
        console.log("sorry...");
    }else {
        console.clear();
        console.log('only y or n!!');
        rl.question("예제가 재미있습니까? (y/n)", answerCallback);
    }
    rl.close();
};
rl.question("예제 재미있습니까? (y/n)", answerCallback);