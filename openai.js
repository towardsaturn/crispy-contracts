const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

async function parseLoanDetails(loanRequest) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    let prompt = "Convert sentence about loans into json\n\nLend Aaron $10 for one week: {amount: 10, duration:7, interest: 0}\nLet Joe borrow $100 for 31 days at 2 percent interest: {amount: 100, duration:31, interest:2.0}\nSamantha can borrow $2000 for a year at 2.45% interest: {amount: 2000, duration: 365, interest:2.45}\n";

    const response = await openai.createCompletion("text-davinci-001", {
        prompt: prompt + loanRequest,
        temperature: 0.8,
        max_tokens: 60,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["\n"],
    });
    return JSON.parse(response.data.choices[0].text);
}

module.exports = { parseLoanDetails }