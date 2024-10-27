import { PromptTemplate } from "@langchain/core/prompts";
import { llm } from "./keys";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const generateHeadings = async (userInstructions: string) => {
  const blogHeadingTemplate = `Given the user instructions about a blog the user wants to write, generate a proper Blog Heading (only generate the blog heading and no extra information)
  user input : {userInstructions}
  Blog heading : 

  `;

  const BlogHeadingChain = PromptTemplate.fromTemplate(blogHeadingTemplate)
    .pipe(llm)
    .pipe(new StringOutputParser());

  const response = await BlogHeadingChain.invoke({
    userInstructions,
  });

  return response;
};

export const generateSubHeadings = async (
  userInstructions: string,
  header: string
) => {
  const blogSubHeadingTemplate = `Given the user instructions about a blog the user wants to write and a header of the same blog, generate all sub headings possible (only generate the sub headings and no extra information)
    user input : {userInstructions}
    Blog heading : {header}
    Sub headings : 

    `;

  const BlogSubHeadingChain = PromptTemplate.fromTemplate(
    blogSubHeadingTemplate
  )
    .pipe(llm)
    .pipe(new StringOutputParser());

  const response = await BlogSubHeadingChain.invoke({
    userInstructions,
    header,
  });

  return response.split("\n");
};

export const generateBlogContent = async (
  userInstructions: string,
  header: string,
  subHeading: string
) => {
  const blogContent = `Given the user instructions about a blog the user wants to write , header and the subheading for , generate content for the subheading within a minimum of 500 words (only generate the sub heading content and no extra information)
      user input : {userInstructions}
      Blog heading : {header}
      Sub heading : {subHeading}
      Content of the sub heading : 
  
      `;

  const BlogContent = PromptTemplate.fromTemplate(blogContent)
    .pipe(llm)
    .pipe(new StringOutputParser());

  const response = await BlogContent.invoke({
    userInstructions,
    header,
    subHeading,
  });

  return response;
};
