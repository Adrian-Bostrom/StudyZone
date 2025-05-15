import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import path from 'path';
import { OpenAIEmbeddings } from "@langchain/openai";
import { createRetrievalChain } from "langchain/chains/retrieval";

import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { existsSync, readdirSync, mkdirSync } from "fs";


import * as dotenv from "dotenv";
import { error } from 'console';
dotenv.config();

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

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small"
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1500,
  chunkOverlap: 300,
});

const vectorStoreCache = new Map();

const loaders = {   
  ".txt": (path) => new TextLoader(path),
  ".pdf": (path) => new PDFLoader(path)
}

async function loadUserVectorStore(userId, storeName) {
  const allStores = [];

  const filePath = `database/${userId}/${storeName}/context/files/`
  const storePath = `database/${userId}/${storeName}/context/vector_store/`

  let files = readdirSync(filePath);

  for (const _path of files) {

    await loadFile(filePath + _path, storePath + _path).then((store) => {
      allStores.push(store);
    });
  }

  let allDocs = [];

  for (const store of allStores) {
    const docs = await store.similaritySearch("", 50); // Get as many as possible
    allDocs = allDocs.concat(docs);
  }
  const globalVectorStore = await FaissStore.fromDocuments(allDocs, embeddings);

  return globalVectorStore;
}

function getCachedVectorStore(userID) {
  if(vectorStoreCache.has(userID)) {
    return vectorStoreCache.get(userID);
  } else {
    return undefined;
  }
}

function cacheVectorStore(userID, vectorStore) {
  vectorStoreCache.set(userID, vectorStore);
}

async function loadFile(filePath, storePath) {
  console.log(filePath)
  console.log(storePath)
  const extension = filePath.slice(filePath.lastIndexOf("."));
  const loaderFn = loaders[extension];
  if (!loaderFn) {
    throw new error(`Loader doenst support : ${extension}`);
  };

  let store;

  if(existsSync(storePath)) {
    store = await FaissStore.load(storePath, embeddings);
    console.log(`Loaded store for ${store}`);
  } else {
    const loader = loaderFn(filePath);
    const docs = await loader.load();

    const splitDocs = await splitter.splitDocuments(docs);
    store = await FaissStore.fromDocuments(splitDocs, embeddings);
    await store.save(storePath);
    console.log(`Created store for ${store}`);
  }

  return store;
}

export async function requestChat(question, courseID, userID) {

  let globalVectorStore = getCachedVectorStore(userID);

  if(!globalVectorStore) {
    globalVectorStore = await loadUserVectorStore(userID, courseID);
    cacheVectorStore(userID, globalVectorStore);
  }

  const retriever = globalVectorStore.asRetriever({k:7});

  const retrievalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever
  })

  console.log("Ready!")

  try {
    const response = await retrievalChain.invoke({
      input : question
    })

    return response.answer; 
  } catch(error) {
    console.error('Error during chat request:', error);
    return 'Sorry, there was an error processing your request.';
  }

}
