import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { ChatOpenAI } from "@langchain/openai";
import { AstraLibArgs } from "@langchain/community/vectorstores/astradb";
import { TogetherAI } from "@langchain/community/llms/togetherai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoClient } from "mongodb";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Client } from "pg";
import postgres from "postgres";

dotenv.config();

const connectionString = process.env.DATABASE_URL as string;
const sql = postgres(connectionString!, {
  ssl: {
    rejectUnauthorized: false, // Allows self-signed certificates
  },
  prepare: false,
});
export default sql;
export const getMongoVectorStore = (collectionName: string) => {
  const mongoClient = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
  const collection = mongoClient
    .db(process.env.MONGODB_ATLAS_DB_NAME)
    .collection(collectionName || "");

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const mongodVectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection: collection,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding",
  });
  return mongodVectorStore;
};
export const sbApiKey = process.env.SUPABASE_API_KEY as string;
export const sbUrl = process.env.SUPABASE_PROJECT_URL as string;
export const openAIApiKey = process.env.OPENAI_API_KEY as string;
export const sbClient = createClient(sbUrl, sbApiKey);
const nativeSupabaseClient = new Client({
  connectionString:
    "postgresql://postgres.eojvbyorcbukxnswockh:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
});
export const llm = new ChatOpenAI({ openAIApiKey, modelName: "gpt-4o-mini" });
export const getAstraConfig = (collectionName: string) => {
  const astraConfig: AstraLibArgs = {
    token: process.env.ASTRA_DB_APPLICATION_TOKEN as string,
    endpoint: process.env.ASTRA_DB_ENDPOINT as string,
    collection: collectionName,
    collectionOptions: {
      vector: {
        dimension: process.env.MODEL_DIMENSIONS as unknown as number,
        metric: "cosine",
      },
    },
  };
  return astraConfig;
};
export const astraConfig: AstraLibArgs = {
  token: process.env.ASTRA_DB_APPLICATION_TOKEN as string,
  endpoint: process.env.ASTRA_DB_ENDPOINT as string,
  collection: process.env.ASTRA_DB_COLLECTION as string,
  collectionOptions: {
    vector: {
      dimension: process.env.MODEL_DIMENSIONS as unknown as number,
      metric: "cosine",
    },
  },
};
export const togetherAIModel = process.env.TOGETHER_AI_EMBEDDED_MODEL as string;

export const togetherLlm = new TogetherAI({
  model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
  maxTokens: 256,
});
export const getSupabaseVectorStore = (tableName: string) => {
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: sbClient,
    tableName,
    queryName: `match_${tableName}`,
  });

  return vectorStore;
};
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  const checkTableSQL = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = '${tableName}'
    );
  `;

  try {
    const result = await sql.unsafe(checkTableSQL);
    return result[0].exists;
  } catch (error) {
    console.error("Error checking table existence:", error);
    throw error;
  }
};

export const createTable = async (tableName: string) => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id BIGSERIAL PRIMARY KEY,
      content TEXT,
      metadata JSONB,
      embedding VECTOR(1536)
    );
  `;

  try {
    await sql.unsafe(createTableSQL);
    console.log(`Table "${tableName}" created successfully.`);
  } catch (error) {
    console.error("Error creating table:", error);
  }
};
export const renameTable = async (
  oldTableName: string,
  newTableName: string
) => {
  const renameTableSQL = `
    ALTER TABLE ${oldTableName}
    RENAME TO ${newTableName};
  `;

  try {
    await sql.unsafe(renameTableSQL);
    console.log(
      `Table "${oldTableName}" renamed to "${newTableName}" successfully.`
    );
  } catch (error) {
    console.error(`Error renaming table "${oldTableName}":`, error);
  }
};
export const dropTable = async (tableName: string) => {
  const dropTableSQL = `
    DROP TABLE IF EXISTS ${tableName};
  `;

  try {
    await sql.unsafe(dropTableSQL);
    console.log(`Table "${tableName}" deleted successfully.`);
  } catch (error) {
    console.error("Error deleting table:", error);
  }
};

export const createMatchFunction = async (tableName: string) => {
  const matchFunctionSQL = `
    CREATE FUNCTION match_${tableName} (
  query_embedding VECTOR(1536),
  match_count INT DEFAULT NULL,
  filter JSONB DEFAULT '{}'
) RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  embedding JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,                         -- Qualify "id" with the table alias "t"
    t.content,
    t.metadata,
    (t.embedding::TEXT)::JSONB AS embedding,
    1 - (t.embedding <=> query_embedding) AS similarity
  FROM ${tableName} t              -- Alias the table as "t"
  WHERE t.metadata @> filter
  ORDER BY t.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
`;

  try {
    await sql.unsafe(matchFunctionSQL);
    console.log(`Match function "match_${tableName}" created successfully.`);
  } catch (error) {
    console.error("Error creating match function:", error);
  }
};
export const dropMatchFunction = async (tableName: string) => {
  const dropFunctionSQL = `
    DROP FUNCTION IF EXISTS match_${tableName}(VECTOR(1536), INT, JSONB);
  `;

  try {
    await sql.unsafe(dropFunctionSQL);
    console.log(`Match function "match_${tableName}" deleted successfully.`);
  } catch (error) {
    console.error("Error deleting match function:", error);
  }
};
