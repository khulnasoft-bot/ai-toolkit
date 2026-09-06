import { createSource } from "@ai-toolkit/ai-docs/source";
import { docs } from "@/.source/server";
import { config } from "./config";

export const aiDocsSource = createSource({
  docs,
  config,
});

export const source = aiDocsSource.source;
export const getPageImage = aiDocsSource.getPageImage;
export const getLLMText = aiDocsSource.getPageMarkdown;
