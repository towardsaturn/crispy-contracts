const hedera = require("./hedera")

async function main() {
    let client = await hedera.getClient();

    let balances = [100000, 2000000, 400000, 3000000, 2222222, 3333333, 4444444];

    for (let i = 0; i < balances.length; i++) {
        await hedera.generateAccount(client, balances[i]);
    }
}

main();