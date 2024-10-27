import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

export const ytTranscriptLoader = async (url: string) => {
  const loader = YoutubeLoader.createFromUrl(url, {
    language: "en",
    addVideoInfo: true,
  });

  const docs = await loader.load();

  return docs;
};
