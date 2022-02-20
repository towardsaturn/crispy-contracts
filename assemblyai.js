const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
    },
});

async function transcribeAudio(filepath) {
    try {
        let file = await fs.promises.readFile(filepath);
        let uploadResult = await assembly.post("/upload", file);
        // console.log(uploadResult);
        let result = await assembly.post("/transcript", {
            audio_url: uploadResult.data.upload_url
        });



        while (result.data.status !== "completed" && result.data.status !== "error") {
            result = await assembly.get(`/transcript/${result.data.id}`);
        }

        return result.data;

    } catch (err) {
        console.error(err);
    }
}

async function uploadFile(filepath) {
    fs.readFile(filepath, (err, data) => {
        if (err) return console.error(err);

        assembly
            .post("/upload", data)
            .then((res) => console.log(res.data))
            .catch((err) => console.error(err));
    });
}

module.exports = { transcribeAudio, uploadFile }