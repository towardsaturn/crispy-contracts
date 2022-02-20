const express = require('express');
const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar } = require("@hashgraph/sdk");
const hedera = require("./hedera")
const { Configuration, OpenAIApi } = require("openai");
const { transcribeAudio } = require('./assemblyai');
const app = express();
const port = 3000;
require("dotenv").config();

app.get('/', async(req, res) => {
    // hederaClient = await hedera.getClient();
    let audioData = await transcribeAudio("https://bit.ly/3yxKEIY");
    res.send(audioData);
});

app.post('/getBalance', async(req, res) => {
    hederaClient = await hedera.getClient();
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId("0.0.30771440")
        .execute(hederaClient);
    res.send("The account balance is: " + accountBalance.hbars.toTinybars() + " tinybar.");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})