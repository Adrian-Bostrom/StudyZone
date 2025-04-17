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

import * as dotenv from "dotenv";
import { error } from 'console';
dotenv.config();

// Set up model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  store: true,
  maxTokens: 16384
})

// Set up prompt template
const prompt = ChatPromptTemplate.fromTemplate(
  `Answer the user's question from the following context: 
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


async function loadFile(path) {
  const extension = path.slice(path.lastIndexOf("."));
  const loaderFn = loaders[extension];
  if (!loaderFn) {
    throw new error(`Loader doenst support : ${extension}`);
  };

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

for (const path of filePaths) {
  await loadFile(path);
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
