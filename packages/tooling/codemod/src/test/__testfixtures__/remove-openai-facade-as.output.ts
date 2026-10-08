// @ts-nocheck
import OpenAI from 'openai';
import { createOpenAI } from '@ai-toolkit/openai';

const client1 = new OpenAI();
const client2 = createOpenAI();
