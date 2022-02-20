const axios = require("axios");
require("dotenv").config();

const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
    },
});

async function transcribeAudio(urlToAudio) {
    try {
        let result = await assembly.post("/transcript", {
            audio_url: urlToAudio
        });



        while (result.data.status !== "completed" && result.data.status !== "error") {
            result = await assembly.get(`/transcript/${result.data.id}`);
        }

        return result.data;

    } catch (err) {
        console.error(err);
    }


}

module.exports = { transcribeAudio }