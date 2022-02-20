const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    TransferTransaction,
    Hbar,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function getClient() {
    const hederaAccountId = process.env.HEDERA_ACCOUNT_ID;
    const hederaPrivateKey = process.env.HEDERA_PRIVATE_KEY;

    if (hederaAccountId == null || hederaPrivateKey == null) {
        throw new Error("Environment Variables Unable to Be Loaded");
    }

    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(hederaAccountId, hederaPrivateKey);
    return client;
    // generateAccount(client);
}

let generateAccount = async(client, initalBalance) => {
    //const client = Client.forTestnet();
    //client.setOperator(myAccountId, myPrivateKey);
    //-----------------------<enter code below>--------------------------------------

    //Create new keys
    const newAccountPrivateKey = await PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
    console.log("private key", newAccountPrivateKey.toStringRaw());
    // console.log("public key", newAccountPublicKey);
    //Create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(initalBalance))
        .execute(client);

    // Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    //Log the account ID
    console.log("The new account ID is: " + newAccountId);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log(
        "The new account balance is: " +
        accountBalance.hbars.toTinybars() +
        " tinybar."
    );

    return newAccountId;
};

async function transferHbar(amount, creditId, debitId) {
    const client = await getClient();
    // const newAccountId = await generateAccount(client, 10000);

    const sendHbar = await new TransferTransaction()
        .addHbarTransfer(creditId, Hbar.fromTinybars(-amount))
        .addHbarTransfer(debitId, Hbar.fromTinybars(amount))
        .execute(client);

    //Verify the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log(
        "The transfer transaction from my account to the new account was: " +
        transactionReceipt.status.toString()
    );

    //Request the cost of the query
    const queryCost = await new AccountBalanceQuery()
        .setAccountId(debitId)
        .getCost(client);

    console.log("The cost of query is: " + queryCost);

    //Check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
        .setAccountId(debitId)
        .execute(client);

    console.log(
        "The account balance after the transfer is: " +
        getNewBalance.hbars.toTinybars() +
        " tinybar."
    );
}

let paybackLoan = async(
    lenderAccountId,
    borrowerAccountId,
    amount,
    interestRate
) => {
    let db = require("./people.json");
    console.log(lenderAccountId);
    let borrowerId = db[borrowerAccountId];
    let lenderId = db[lenderAccountId];
    let value = amount.replace(/\D/g, "");
    let interest = parseFloat(interestRate.replace(/\D.\D/g, "")) / 100;

    console.log(borrowerId, lenderId, value, interest);
    // super simple interest
    let total = value * (1 + interest);
    await transferHbar(value, lenderId, total);
}

let generateLoan = async(
    // client,
    lenderAccountId,
    borrowerAccountId,
    amount,
    interestRate,
    duration
) => {
    // generate a Solidity contract, compile it, and return a json
    let db = require("./people.json");
    console.log(lenderAccountId);
    let borrowerId = db[borrowerAccountId];
    let lenderId = db[lenderAccountId];
    let value = amount.replace(/\D/g, "");
    let interest = parseFloat(interestRate.replace(/\D.\D/g, "")) / 100;

    console.log(borrowerId, lenderId, value, interest);
    // super simple interest
    // let total = value * (1 + interest);
    // return;

    // initial loan
    await transferHbar(value, lenderId, borrowerId);

    // const returnTransaction = new TransferTransaction()
    //     .addHbarTransfer(borrowerId, Hbar.fromTinybars(-total))
    //     .addHbarTransfer(lenderId, Hbar.fromTinybars(total));

    // const scheduleTransaction = await new ScheduleCreateTransaction()
    //     .setScheduledTransaction(returnTransaction)
    //     .execute(client);

    // const receipt = await scheduleTransaction.getReceipt(client);

    // const scheduleId = receipt.scheduleId;
    // console.log("The schedule ID is " + scheduleId);

    // const scheduledTxId = receipt.scheduledTransactionId;
    // console.log("The scheduled transaction ID is " + scheduledTxId);

    // const signature1 = await (
    //     await new ScheduleSignTransaction()
    //     .setScheduleId(scheduleId)
    //     .freezeWith(client)
    //     .sign(signerKey1)
    // ).execute(client);

    // //Verify the transaction was successful and submit a schedule info request
    // const receipt1 = await signature1.getReceipt(client);
    // console.log("The transaction status is " + receipt1.status.toString());

    // const query1 = await new ScheduleInfoQuery()
    //     .setScheduleId(scheduleId)
    //     .execute(client);

    // //Confirm the signature was added to the schedule
    // console.log(query1);

    // const signature2 = await (
    //     await new ScheduleSignTransaction()
    //     .setScheduleId(scheduleId)
    //     .freezeWith(client)
    //     .sign(signerKey2)
    // ).execute(client);

    // //Verify the transaction was successful
    // const receipt2 = await signature2.getReceipt(client);
    // console.log("The transaction status " + receipt2.status.toString());

    // //Get the schedule info
    // const query2 = await new ScheduleInfoQuery()
    //     .setScheduleId(scheduleId)
    //     .execute(client);

    // console.log(query2);

    // //Get the scheduled transaction record
    // const scheduledTxRecord = await TransactionId.fromString(
    //     scheduledTxId.toString()
    // ).getRecord(client);
    // console.log("The scheduled transaction record is: " + scheduledTxRecord);
};

// main(process);
// testTransfer();

module.exports = { getClient, generateAccount, generateLoan, paybackLoan };