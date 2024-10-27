// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { uploadDocsToDatabase } from "./uploadOrGetVectorDb";

// export const pdfLoaderFunc = async (path: string) => {
//   const nike10kPdfPath = `${path}`;
//   const loader = new PDFLoader(nike10kPdfPath);
//   const docs = await loader.load();
//   return docs;
// };

// export const extractPfData = async (collectionName: string) => {
//   const docs = (await pdfLoaderFunc(
//     "./training-data/The-Jungle-Books.pdf"
//   )) as unknown as {
//     pageContent: string;
//   }[];
//   const docsToStringArray = docs.map(
//     (doc: { pageContent: string }) => doc.pageContent
//   );
//   const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 3000,
//     separators: ["\n\n", "\n", " ", ""],
//     chunkOverlap: 300,
//   });
//   const splittedTextOutput = await splitter.createDocuments(docsToStringArray);
//   const outputArray = splittedTextOutput.map(
//     (doc: { pageContent: string }) => doc.pageContent
//   );
//   const retriever = await uploadDocsToDatabase(
//     outputArray as unknown as [],
//     collectionName
//   );
//   console.log("data successfully uploaded");
//   return retriever;
// };
