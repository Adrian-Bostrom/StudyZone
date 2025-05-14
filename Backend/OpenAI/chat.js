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
