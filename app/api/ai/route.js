

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try { 
    const formData = await req.formData();
    const isFileUpload = formData.get('isFileUpload') === 'true';
    let content;

    
    if (isFileUpload) {
        const file = formData.get('studyImage');
        content = await file.text(); 
      } else {
        content = formData.get('studyText');
      }



    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); 


    const prompt = `You are a specialized language model designed to create educational flashcards from a given body of text. Your task is to extract key concepts, definitions, terms, or questions and generate concise, informative flashcards. Follow these guidelines to ensure the flashcards are effective:
    - Identify Key Information: Extract essential information from the text, including definitions, important concepts, dates, formulas, and terms.
    - Format Flashcards: Each flashcard should consist of a "Question" and an "Answer" section. Ensure that the question is clear and the answer is precise and directly related to the question.
    - Clarity and Brevity: Keep the questions and answers brief and to the point. Avoid unnecessary details or complex wording.
    - Categorization: If applicable, categorize the flashcards into relevant topics or sections to aid in better organization and learning.
    - Examples and Explanations: When necessary, provide examples or brief explanations to clarify complex concepts, but ensure they are succinct.

    Here's the text to process:

    ${content}

    Return the flashcards in the following JSON format:
    {
        "flashcards": [
            {
                "front": "Question here",
                "back": "Answer here"
            }
        ]
    }`;

    console.log('Starting the model')
    const result = await model.generateContent(prompt); 

    console.log('Waiting on the result')
    const generatedText = result.response.text();  
    console.log('Got the result')

     // Remove any markdown -
     const cleanedText = generatedText.replace(/```json\n|\n```/g, '').trim();

    // Parse the generated JSON
    let flashcardsData;
    try {
      flashcardsData = JSON.parse(cleanedText); 
      console.log('Parsed the cleaned text')
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Generated text:', generatedText);
      return NextResponse.json({ error: 'Failed to parse generated flashcards' }, { status: 500 });
    }

    if (!flashcardsData || !Array.isArray(flashcardsData.flashcards)) {
      console.error('Invalid flashcards data structure');
      console.log('Parsed data:', flashcardsData);
      return NextResponse.json({ error: 'Invalid flashcards data structure' }, { status: 500 });
    }

    console.log('Sending response:', JSON.stringify(flashcardsData));
    console.log("Success in generating the flashcards")
    return NextResponse.json(flashcardsData);  
    
    

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 400 });
  }
}