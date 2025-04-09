import OpenAI from "openai";
import "dotenv/config";
const conversationlength = 10;
let index = 0;
const openai = new OpenAI({
  baseURL:"https://openrouter.ai/api/v1",
  apiKey:"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",
})

let messages = [
    {"role": "developer", "content": "You are a helpful assistant."},
    ];

export async function requestChat(question, chatlog) {
    chatlog.push({"role": "user", "content": question});
    const completion = await openai.chat.completions.create({
        model: "nvidia/llama-3.3-nemotron-super-49b-v1:free",
        messages: chatlog,
        store: true
    });
    //console.log(completion.choices[0]);
    chatlog.push({"role": "assistant", "content": completion.choices[0].message.content});
    return chatlog;
}

async function request(question) {
    messages.push({"role": "user", "content": question});
    const completion = await openai.chat.completions.create({
        model: "nvidia/llama-3.3-nemotron-super-49b-v1:free",
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
//main();


