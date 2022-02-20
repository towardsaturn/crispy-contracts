const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

async function parseLoanDetails(loanRequest) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    let prompt =
        `Convert sentence about loans into json

Lend Aaron 10 each bar for one week:{"name":"Aaron", "amount": 10, "duration": 7, "interest": 0}
Let Joe borrow 100 each bar for 31 days at 2 percent interest:{"name":"Joe", "amount": 100, "duration": 31, "interest":2.0}
Samantha can borrow 2000 each bar for a year at 2.45% interest:{"name":"Samantha", "amount": 2000, "duration": 365, "interest":2.45}
I am letting Brian borrow 200 each bar if he pay me back with 10% interest by next week:{"name":"Brian", "amount":200, "duration":7, "interest":10}
Crystal is borrowing 10 each bar from me and she's going to return my money in 2 days:{"name":"Crystal", "amount":10, "duration":2, "interest":0}`;

    const response = await openai.createCompletion("text-davinci-001", {
        prompt: prompt + loanRequest + ":",
        temperature: 0.8,
        max_tokens: 60,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["\n"],
    });
    return response.data.choices[0].text;
}

module.exports = { parseLoanDetails }