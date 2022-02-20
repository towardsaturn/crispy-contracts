const express = require('express');
const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar } = require("@hashgraph/sdk");
const hedera = require("./hedera")
const { transcribeAudio } = require('./assemblyai');
const { parseLoanDetails } = require('./openai');
const multer = require('multer');
const url = require('url');

const storage = multer.diskStorage({
    destination: './sound_files/',
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
const app = express();
const port = 3000;
require("dotenv").config();

// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.get('/', async(req, res) => {
    res.render('pages/index');
});

app.post('/getBalance', async(req, res) => {
    hederaClient = await hedera.getClient();
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId("0.0.30771440")
        .execute(hederaClient);
    res.send("The account balance is: " + accountBalance.hbars.toTinybars() + " tinybar.");
});

app.post('/uploadVoiceClip', upload.single("audio_data"), async(req, res) => {
    // adapted from https://stackoverflow.com/questions/67229656/how-to-record-mic-from-client-then-send-to-server
    // let result = await transcribeAudio(req.file.path);
    // console.log(result);
    // let parsedData = await parseLoanDetails(result.text);
    // console.log(parsedData);
    // const sleep = time => new Promise(resolve => setTimeout(resolve, time));
    // await sleep(5);

    let parsedData = "{\"amount\": 50, \"duration\": 9, \"interest\": 5.0}";
    parsedData = JSON.parse(parsedData);
    // res.redirect(200, "/contract?=" + parsedData);
    // res.send(parsedData);
    res.send({ redirect: url.format({ pathname: "/contract", query: parsedData }) });
    // console.log("here");
});

app.get('/contract', async(req, res) => {
    res.send(req.query);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})