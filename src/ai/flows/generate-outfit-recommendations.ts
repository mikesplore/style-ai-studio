'use server';

/**
 * @fileOverview Generates personalized outfit recommendations based on user uploads and preferences.
 *
 * - generateOutfitRecommendations - A function that generates outfit recommendations.
 * - GenerateOutfitRecommendationsInput - The input type for the generateOutfitRecommendations function.
 * - GenerateOutfitRecommendationsOutput - The return type for the generateOutfitRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOutfitRecommendationsInputSchema = z.object({
  fullBodyImageDataUri: z
    .string()
    .describe(
      "A full body image of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  faceImageDataUri: z
    .string()
    .describe(
      "A close-up image of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  wardrobeItemDataUris: z
    .array(z.string())
    .describe(
      "An array of wardrobe item images, as data URIs that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  stylePreferences: z.string().describe('The user\u2019s style preferences.'),
});
export type GenerateOutfitRecommendationsInput = z.infer<
  typeof GenerateOutfitRecommendationsInputSchema
>;

const OutfitRecommendationSchema = z.object({
  outfitDescription: z
    .string()
    .describe('A description of the recommended outfit.'),
  outfitImageDataUri: z
    .string()
    .describe(
      "An image of the recommended outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  confidenceScore: z
    .number()
    .describe(
      'A score indicating the confidence level of the recommendation.'
    ),
});

const GenerateOutfitRecommendationsOutputSchema = z.array(
  OutfitRecommendationSchema
);
export type GenerateOutfitRecommendationsOutput = z.infer<
  typeof GenerateOutfitRecommendationsOutputSchema
>;

export async function generateOutfitRecommendations(
  input: GenerateOutfitRecommendationsInput
): Promise<GenerateOutfitRecommendationsOutput> {
  return generateOutfitRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutfitRecommendationsPrompt',
  input: {schema: GenerateOutfitRecommendationsInputSchema},
  output: {schema: GenerateOutfitRecommendationsOutputSchema},
  prompt: `You are a personal stylist who provides outfit recommendations based on the user's appearance, wardrobe, and style preferences.

  Provide 3 outfit recommendations based on the following information:

  User's Full Body Image: {{media url=fullBodyImageDataUri}}
  User's Face Image: {{media url=faceImageDataUri}}
  Wardrobe Items: {{#each wardrobeItemDataUris}}{{media url=this}}{{#unless @last}}, {{/unless}}{{/each}}
  Style Preferences: {{{stylePreferences}}}

  Each recommendation should include:
  - A description of the outfit.
  - An image of the outfit.
  - A confidence score (0-1) indicating how well the outfit matches the user's style and appearance.

  Ensure that the outfits are visually appealing and suitable for the user's body type and coloring.
  `,
});

const generateOutfitRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateOutfitRecommendationsFlow',
    inputSchema: GenerateOutfitRecommendationsInputSchema,
    outputSchema: GenerateOutfitRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
      model: 'googleai/gemini-2.5-flash-image-preview',
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return output!;
  }
);
