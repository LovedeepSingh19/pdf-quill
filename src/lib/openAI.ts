import OpenAI from "openai"
export const opneai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})