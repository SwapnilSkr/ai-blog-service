import {
  createMatchFunction,
  createTable,
  dropMatchFunction,
  dropTable,
  getAstraConfig,
  getSupabaseVectorStore,
  openAIApiKey,
  sbClient,
} from "./keys";
import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

export const uploadDocsToDatabase = async (
  splittedTextOutput: [],
  collectionName: string
) => {
  await dropTable(collectionName);
  await dropMatchFunction(collectionName);
  await createTable(collectionName);
  await createMatchFunction(collectionName);

  const vectorStore = await SupabaseVectorStore.fromDocuments(
    splittedTextOutput,
    new OpenAIEmbeddings({ openAIApiKey }),
    {
      client: sbClient,
      tableName: collectionName.toLocaleLowerCase(),
      queryName: "match_dynamic",
    }
  );

  console.log("checkpoint 2");

  const retriever = vectorStore.asRetriever();
  return retriever;
};

export const obtainRetrieverOfExistingVectorDb = async (
  collectionName: string
) => {
  const vectorStore = getSupabaseVectorStore(
    collectionName.toLocaleLowerCase()
  );
  const retriever = vectorStore.asRetriever();
  return retriever;
};
