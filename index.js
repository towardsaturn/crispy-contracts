const express = require('express');
const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar } = require("@hashgraph/sdk");
const hedera = require("./hedera")
const { Configuration, OpenAIApi } = require("openai");
const { transcribeAudio } = require('./assemblyai');
const { parseLoanDetails } = require('./openai');
const app = express();
const port = 3000;
require("dotenv").config();

// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.get('/', async(req, res) => {
    // hederaClient = await hedera.getClient();
    // let audioData = await transcribeAudio("https://00f74ba44b079f7836f3578e32317633d6003b1953-apidata.googleusercontent.com/download/storage/v1/b/crispy_contracts_audio_storage/o/Recording.mp4?jk=AFshE3UJTFCrypvnU5DsMCEvEIY0Ws6A32O_koLNRAbuq9ZVZTTqx_w0Ipp5Jl41kakPzezGd1HJhnL-JVREPy7QWdQ02Wp3xocxOKwZjHOO3J0lXrfDiU0QUiwD5ya9_JfUfHBmHHGRKp-iozoZExX1w_7LnX2y6GviF8IJA3k5b0HqJ7fi_6H5i1eNSpw9vNVennERei_GbsvEpJtA2HXryv12xrCBPEQdiSrXtXCul9xUyd6nJBGxqVnYNvRUZpfidI-TqSZTXGZ30eXpNYdxtOhlPKmD6M5iI7Z1fLCJtdzLQ7n8TpMbVOBnu2kjb91HgHgPX20-02fMW-h__UZX7XlrslAwpHo-JIh9XUOlxzgfQcBu5upD3pMrYS-u8n4yKaPwnpv9JQfk7Ot2rGPLxe6IdR1JnOZzgq7xVn5RaOgNWJm2gDWBJHphMv-DHUR23zPd7AIZ3Bg7FOLf_bEZ1Fui9EldU6U1f6vS34TDC3zEhUtj4j-PJjfa2BBlRuZrVE_-5f-Yysfc9d8uFRMvxBclryas8-ajXcvjVVe1H7e2GeqovchBbYMb40El2jcfFSA4OKC3x6E8KlIKU1KGBFL5zN-kYNjMTO3z4Ah0pRcDXhTskYHbf3A5NrTtLcXgEHVhLoxA8xcCOhihWzzYVY17X9l8soT5WxTaGmQJ8eMWLZAY-hR1fAXZLAZB7zpi3wTtqJJgY7_Ev2qc25sWEJpHvymEOQcevih1oMv0UDn61_kSxv_qUsBUzYrfR3KXWex7zrhQ8zQ9SJVFYmTkY_Jm7OCiKvw9IgLYsjGE-86D-cc9dOcYjDNVuP8p00r7mBHt9yEVjrfTs3OrbO7-Dk0GXQkat576cVZ3uObF_oyzintOoJr5gZXTKrBJKhZ1DSPubUZTrMIa3Nl9FPTbXpx9eaNFjfYbDIzpAIqodJ8jeMPkEwPwk3tvqMxGIhev_JlnB9ydQsYaaAQB6Fp-bLye&isca=1");
    // console.log(audioData);
    // let parsedData = await parseLoanDetails(audioData.text);
    // console.log(parsedData);
    // res.send(parsedData);
    res.render('pages/index');
});

app.post('/getBalance', async(req, res) => {
    hederaClient = await hedera.getClient();
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId("0.0.30771440")
        .execute(hederaClient);
    res.send("The account balance is: " + accountBalance.hbars.toTinybars() + " tinybar.");
});

app.post('/uploadVoiceClip', async(req, res) => {
    console.log(req.body);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
