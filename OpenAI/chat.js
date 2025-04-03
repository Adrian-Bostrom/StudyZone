import OpenAI from "openai";
import "dotenv/config";
const conversationlength = 10;
let index = 0;
const openai = new OpenAI({ apiKey: `${process.env.OPENAI_API_KEY}` });

let messages = [
    {"role": "developer", "content": "You are a helpful assistant."},
    ];

async function request(question) {
    messages.push({"role": "user", "content": question});
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        store: true
    });
    //console.log(completion.choices[0]);
    messages.push({"role": "assistant", "content": completion.choices[0].message.content});
}

// Replace require with import for readline
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Wrap rl.question in a Promise
function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
    while(1){
        const question = await askQuestion("What do you need help with?\n");
        if(question == "quit") break;
        await request(question);
        console.log(messages[messages.length - 1].content);
        sleep(1000);
        index++;
        if(index == 10) break;
    }
    rl.close();
}
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
/*
while loop
gör fråga, ha index och modulu för var i array man ska lägga till*/
main();


