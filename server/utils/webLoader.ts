import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

export const webLoader = async (url: string) => {
  const loaderWithSelector = new CheerioWebBaseLoader(url, {
    selector: "main",
  });

  const docsWithSelector = await loaderWithSelector.load();
  return docsWithSelector[0].pageContent;
};
