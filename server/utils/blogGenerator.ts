import { PromptTemplate } from "@langchain/core/prompts";
import { llm } from "./keys";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  blackForestGenerations,
  stabilityAiGenerations,
} from "./imageGenerations";

export const generateHeadings = async (
  userInstructions: string,
  context: string
) => {
  const blogHeadingTemplate = `
    Generate a compelling and relevant blog heading based on the user's instructions and the provided context. 
    Use only the information in the user's instructions and the context (if provided), which may include details about the topic, website, data, or transcript, to craft an engaging heading for the blog. 
    
    User Instructions: {userInstructions}
    Context : {context}
    
    Generated Blog Heading: 
    `;

  const BlogHeadingChain = PromptTemplate.fromTemplate(blogHeadingTemplate)
    .pipe(llm)
    .pipe(new StringOutputParser());

  const response = await BlogHeadingChain.invoke({
    userInstructions,
    context,
  });

  return response;
};

export const generateSubHeadingInfo = async (
  userInstructions: string,
  header: string,
  subHeading: string,
  context: string
) => {
  const blogSubHeadingImgTemplate = `Given a subheading of a blog, generate a prompt for generating an appropriate image based on the subheading (only generate the appropriate prompt suitable for image generation within 10 words and no extra information)
  Sub heading : {subHeading}
  Image Prompt : 

  `;

  const BlogSubHeadingImgChain = PromptTemplate.fromTemplate(
    blogSubHeadingImgTemplate
  )
    .pipe(llm)
    .pipe(new StringOutputParser());

  const subHeadingImage = await BlogSubHeadingImgChain.invoke({
    subHeading,
  });
  const image = await blackForestGenerations(
    JSON.stringify({ inputs: `${subHeadingImage}` })
  );
  const subHeadingContent = await generateBlogContent(
    userInstructions,
    header,
    subHeading,
    context
  );
  return {
    subHeading,
    image,
    subHeadingContent,
  };
};

export const generateSubHeadings = async (
  userInstructions: string,
  context: string,
  header: string
) => {
  const blogSubHeadingTemplate = `
    Generate a list of clear and informative subheadings for a blog based on the user’s instructions and the main blog heading provided. 
    Use only the user’s input and the context (if provided) which may include details about the topic, website, data, or transcript, to create relevant and engaging subheadings for the blog.
    
    User Instructions: {userInstructions}
    Context : {context}
    Blog Heading: {header}
    
    Generated Subheadings:
    `;

  const BlogSubHeadingChain = PromptTemplate.fromTemplate(
    blogSubHeadingTemplate
  )
    .pipe(llm)
    .pipe(new StringOutputParser());

  const subHeadingsString = await BlogSubHeadingChain.invoke({
    userInstructions,
    context,
    header,
  });

  const subHeadingsArray = subHeadingsString.split("\n");
  const subHeadingsWithImages = await Promise.all(
    subHeadingsArray.map(async (subHeading) => {
      const subHeadingInfo = await generateSubHeadingInfo(
        userInstructions,
        header,
        subHeading,
        context
      );
      return subHeadingInfo;
    })
  );
  return subHeadingsWithImages;
};

export const generateBlogContent = async (
  userInstructions: string,
  header: string,
  subHeading: string,
  context: string
) => {
  const blogContent = `
Generate detailed, informative content (minimum of 500 words) for a specific subheading in a blog based on the user’s instructions, blog heading, and subheading provided. 
Use only the user's input and the context (if provided), which may include details about the topic, website, data, or transcript, to create focused and relevant content for the subheading.

User Instructions: {userInstructions}
Context : {context}
Blog Heading: {header}
Subheading: {subHeading}

Generated Content for Subheading:
`;

  const BlogContent = PromptTemplate.fromTemplate(blogContent)
    .pipe(llm)
    .pipe(new StringOutputParser());

  const response = await BlogContent.invoke({
    userInstructions,
    context,
    header,
    subHeading,
  });

  return response;
};
