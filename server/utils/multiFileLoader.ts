import { MultiFileLoader } from "langchain/document_loaders/fs/multi_file";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { uploadDocsToDatabase } from "./uploadOrGetVectorDb";

const multiFileDataExtractor = async (filepathsArray: string[]) => {
  const loader = new MultiFileLoader(filepathsArray, {
    ".json": (path) => new JSONLoader(path, "/texts"),
    ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
    ".txt": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path),
    ".pdf": (path) => new PDFLoader(path),
  });
  const docs = await loader.load();
  return docs;
};

export const extractMultiFileData = async (
  filepathsArray: string[],
  collectionName: string
) => {
  console.log(filepathsArray);
  const docs = (await multiFileDataExtractor(filepathsArray)) as unknown as {
    pageContent: string;
  }[];
  const docsToStringArray = docs?.map(
    (doc: { pageContent: string }) => doc.pageContent
  );
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ["\n\n", "\n", " ", ""],
    chunkOverlap: 50,
  });
  const splittedTextOutput = await splitter.createDocuments(docsToStringArray);
  //   const outputArray = splittedTextOutput?.map(
  //     (doc: { pageContent: string }) => doc.pageContent
  //   );
  await uploadDocsToDatabase(
    splittedTextOutput as unknown as [],
    collectionName
  );
  console.log("data successfully uploaded");
};
