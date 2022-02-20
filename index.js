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
const port = process.env.PORT || 3000;
require("dotenv").config();

// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.get('/', async(req, res) => {
    res.render('pages/index');
});
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

// app.get("/loading", async (req, res) => {
//   res.render("pages/loading");
// });

app.get("/contract", async(req, res) => {
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    let interest = parseFloat(req.query.interest).toFixed(2) + "%";
    let amount = "ℏ" + parseFloat(req.query.amount).toFixed(2);
    let dueDate = (addDays(new Date().getTime(), parseInt(req.query.duration))).toISOString().substring(0, 10);
    console.log(interest, amount, dueDate);
    res.render("pages/contract", { borrower: req.query.name, interest: interest, amount: amount, dueDate: dueDate });
});

app.post('/getBalance', async(req, res) => {
    hederaClient = await hedera.getClient();
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(req.body.id)
        .execute(hederaClient);
    res.send("The account balance is: " + accountBalance.hbars.toTinybars() + " tinybar.");
});

// app.post('/generateAccount', async(req, res) => {
//     hederaClient = await hedera.getClient();
//     let accountId = await hedera.generateAccount(hederaClient, 100000);
//     res.send(accountId);
// })

app.post('/uploadVoiceClip', upload.single("audio_data"), async(req, res) => {
    // adapted from https://stackoverflow.com/questions/67229656/how-to-record-mic-from-client-then-send-to-server
    let result = await transcribeAudio(req.file.path);
    console.log(result);
    let parsedData = await parseLoanDetails(result.text);
    console.log(parsedData);
    // const sleep = time => new Promise(resolve => setTimeout(resolve, time));
    // await sleep(5);

    // let parsedData = "{\"name\":\"Johann\",\"amount\": 50, \"duration\": 9, \"interest\": 5.0}";
    parsedData = JSON.parse(parsedData);
    console.log(parsedData);
    // res.redirect(200, "/contract?=" + parsedData);
    // res.send(parsedData);
    res.send({ redirect: url.format({ pathname: "/contract", query: parsedData }) });
    // console.log("here");
});

app.post("/submitLoan", async(req, res) => {
    console.log(req.body);
    // hedera
    await hedera.generateLoan(req.body.lender, req.body.borrower,
        req.body.amount, req.body.interest, req.body.dueDate);
    res.redirect("/success");
});

app.get("/success", (req, res) => {
    res.render("pages/thankyou");
    // res.send("yey");
})

app.post("/paybackLoan", async(req, res) => {
    await paybackLoan(req.body.lender, req.body.borrower, req.body.amount, req.body.interestRate);
    res.send("ok");
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})