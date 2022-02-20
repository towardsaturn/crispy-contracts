const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar } = require("@hashgraph/sdk");
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

    console.log("The new account balance is: " + accountBalance.hbars.toTinybars() + " tinybar.");
    return newAccountId
}

let generateLoan = async(lenderAccountId,
    borrowerAccountId,
    amount,
    interestRate,
    duration) => {
    // generate a Solidity contract, compile it, and return a json

    // Instantiate the contract instance
    const contractTx = await new ContractCreateTransaction()
        //Set the file ID of the Hedera file storing the bytecode
        .setBytecodeFileId(bytecodeFileId)
        //Set the gas to instantiate the contract
        .setGas(100000)
        //Provide the constructor parameters for the contract
        .setConstructorParameters(new ContractFunctionParameters()
        .addAddress(lenderAccountId)
        .addAddress(borrowerAccountId)
        .addUint256(0) // no collateral for now
        .addUint256(amount)
        .addUint256(duration));
}


// main(process);

module.exports = { getClient, generateAccount, generateLoan }