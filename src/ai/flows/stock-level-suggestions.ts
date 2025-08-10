'use server';

/**
 * @fileOverview AI-driven stock level suggestions based on historical movement data.
 *
 * - suggestStockLevels - A function that suggests optimal stock levels for each location.
 * - SuggestStockLevelsInput - The input type for the suggestStockLevels function.
 * - SuggestStockLevelsOutput - The return type for the suggestStockLevels function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStockLevelsInputSchema = z.object({
  location: z.string().describe('The location for which to suggest stock levels.'),
  objectType: z.string().describe('The type of object (e.g., part, accessory, SIM, equipment).'),
  historicalData: z.string().describe('Historical data of stock movements, as a string.'),
});
export type SuggestStockLevelsInput = z.infer<typeof SuggestStockLevelsInputSchema>;

const SuggestStockLevelsOutputSchema = z.object({
  suggestedLevel: z
    .number()
    .describe('The suggested optimal stock level for the location.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested stock level.'),
});
export type SuggestStockLevelsOutput = z.infer<typeof SuggestStockLevelsOutputSchema>;

export async function suggestStockLevels(
  input: SuggestStockLevelsInput
): Promise<SuggestStockLevelsOutput> {
  return suggestStockLevelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStockLevelsPrompt',
  input: {schema: SuggestStockLevelsInputSchema},
  output: {schema: SuggestStockLevelsOutputSchema},
  prompt: `You are an expert inventory manager. Analyze the historical stock movement data for the following location and object type to suggest an optimal stock level.

Location: {{location}}
Object Type: {{objectType}}
Historical Data: {{historicalData}}

Based on this data, what is the optimal stock level to minimize shortages and overstocking? Explain your reasoning.
`,
});

const suggestStockLevelsFlow = ai.defineFlow(
  {
    name: 'suggestStockLevelsFlow',
    inputSchema: SuggestStockLevelsInputSchema,
    outputSchema: SuggestStockLevelsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
