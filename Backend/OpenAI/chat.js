import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { MultiFileLoader } from "langchain/document_loaders/fs/multi_file";

import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";

import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { existsSync, mkdirSync } from "fs";
import { basename } from "path";

import dotenv from "dotenv/config"; 

//Variables for adding current year, month, day and hours and minutes locally 
//Used by the AI prompt
const date = new Date();

const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const hour = date.getHours();
const minutes = date.getMinutes();

// Set up model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  store: true,
  maxTokens: 16384
})

// Set up prompt template
const prompt = ChatPromptTemplate.fromTemplate(
  `The time now is ${year}-${month}-${day}, ${hour}:${minutes}. Answer the user's question, which are in two formats, 
  either a normal question about courses which are given in the context or 
  a question/help about scheduling an event, where you have to at the end give a
  json file with 3 categories... 1.Title (which describes what the name of the event is)
  2. Start (which describes time in a standard format) 3. End (which describes time in a standard format). If the question is a normal one, don't insert a JSON
  as an answer under any circumstances. Only when the question is about scheduling something: 
  {context}
  Question: {input}`
)

const chain = await createStuffDocumentsChain({
  llm : model,
  prompt
})

const filePaths = [
  "OpenAI/documents/Assignments.txt",
  "OpenAI/documents/Home.txt",
  "OpenAI/documents/Modules.txt",
  "OpenAI/documents/Seminar.txt",
  "OpenAI/documents/pdf.txt",
  "OpenAI/documents/Software.txt",
];

const loaders = {    ".txt": (path) => new TextLoader(path),
  ".pdf": (path) => new PDFLoader(path)}


mkdirSync("vector_store", {recursive: true});

const allStores = [];

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1500,
  chunkOverlap: 300,
});

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small"
});


for (const path of filePaths) {
  const extension = path.slice(path.lastIndexOf("."));
  const loaderFn = loaders[extension];
  if (!loaderFn) continue;

  const name = basename(path, extension);
  const storePath = `vector_store/${name}`

  let store;

  if(existsSync(storePath)) {
    store = await FaissStore.load(storePath, embeddings);
    console.log(`Loaded store for ${store}`);
  } else {
    const loader = loaderFn(path);
    const docs = await loader.load();

    const splitDocs = await splitter.splitDocuments(docs);
    store = await FaissStore.fromDocuments(splitDocs, embeddings);
    await store.save(storePath);
    console.log(`Created store for ${store}`);
  }

  allStores.push(store);
}
let allDocs = [];

for (const store of allStores) {
  const docs = await store.similaritySearch("", 50); // Get as many as possible
  allDocs = allDocs.concat(docs);
}
const globalVectorStore = await FaissStore.fromDocuments(allDocs, embeddings);
console.log("Merged and saved global vector store");

const retriever = globalVectorStore.asRetriever({k:7});

const retrievalChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever
})

export async function requestChat(question, chatlog) {
    
    chatlog.push({"role": "user", "content": question});

    const response = await retrievalChain.invoke({
      input : question
    })

    console.log(response);

    chatlog.push({"role": "assistant", "content": response.answer});
    return chatlog;
}
