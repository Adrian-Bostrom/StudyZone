import OpenAI from "openai";
import "dotenv/config";

/******
@description Gets time estimate using openAI
@param course Course name
@param assignments An array of strings giving assignment names
@param descriptions An array of strings for descriptions for the same
assignments, and in the same order as assignments
******/
export async function getEstimate(course, assignments, descriptions) {
    let messages = [
        { "role": "developer", "content": "Give an estimated time in days (just a number, nothing else) to complete the assignment in the course " },
    ];
    const openai = new OpenAI({ apiKey: `${process.env.OPENAI_API_KEY}` });
    
    // Add course name to context
    messages[0].content += course + ".";
    let responses = [];
    for (let i = 0; i < assignments.length; i++) { // Fixed loop condition
        messages[1] = { "role": "user", "content": assignments[i] + ":\n" + descriptions[i] };
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            store: true,
        });
        // Store number from response in an array of numbers
        responses[i] = completion.choices[0].message.content;
        console.log(assignments[i] + ":\n");
        console.log(descriptions[i] + ":\n");
        console.log(responses[i]);
    }
    return responses;
}

export async function testTimeEstimations() {
    let course = "One variable calculus";
    let assignments = ["exponential derivative", "partial derivative"];
    let descriptions = [
        "Given 20 problems which are exponential derivatives, increasing in difficulty for each one",
        "10 partial derivatives to be done at varying difficulties",
    ];
    let responses = await getEstimate(course, assignments, descriptions); // Use await here
    console.log(responses); // Log the resolved responses
}

