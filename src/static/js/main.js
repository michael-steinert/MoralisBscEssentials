Moralis.initialize("ofOsXFAdm6GCstgOOtKEjZdIX7JisZsrDJfrqPmB");
Moralis.serverURL = "https://5jrt2kzuacbt.moralisweb3.com:2053/server";

const login = async () => {
    Moralis.Web3.authenticate().then((user) => {
        user.set("name", document.getElementById("username").value);
        user.set("email", document.getElementById("email").value);
        user.save();
        document.getElementById("login").setAttribute("disable", null);
        document.getElementById("username").setAttribute("disable", null);
        document.getElementById("email").setAttribute("disable", null);
        init();
    });
}

const init = async () => {
    const chainToQuery = "bsc testnet";
    const balances = await Moralis.Web3API.account.getTokenBalances({
        chain: chainToQuery
    }).then((data) => {
        buildBalancesTable(data);
    });
    const nfts = await Moralis.Web3API.account.getNFTs({
        chain: chainToQuery
    }).then((data) => {
        buildNFTsTable(data);
    });
    const transactions = await Moralis.Web3API.account.getTransactions({
        chain: chainToQuery
    }).then((data) => {
        buildTransactionsTable(data);
    });
}

const buildBalancesTable = (data) => {
    const balancesTable = `<table class="table table-primary -table-striped" id="balancesTable"/>`;
    document.getElementById("resultBalances").innerHTML = balancesTable;
    const table = document.getElementById("balancesTable");
    const rowHeader = `<thead>
                            <tr>
                                <th>Token</th>
                                <th>Symbol</th>
                                <th>Balance</th>
                            </tr>
                        </thead>`;
    table.innerHTML += rowHeader;
    for (let i = 0; i < data.length; i++) {
        let row = `<tr>
                        <td>${data[i].name}</td>
                        <td>${data[i].symbol}</td>
                        <td>${data[i].balance / (10 ** 18)} BNB</td>
                   </tr>`;
        table.innerHTML += row;
    }
}

const buildNFTsTable = (_data) => {
    let data = _data;
    const nftsTable = `<table class="table table-primary -table-striped" id="nftsTable"/>`;
    document.getElementById("resultNFTs").innerHTML = nftsTable;
    const table = document.getElementById("nftsTable");
    const rowHeader = `<thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Address</th>
                            </tr>
                        </thead>`;
    table.innerHTML += rowHeader;
    for (let i = 0; i < data.length; i++) {
        let row = `<tr>
                        <td>${data[i].id}</td>
                        <td>${data[i].type}</td>
                        <td>${data[i].address}</td>
                   </tr>`;
        table.innerHTML += row;
    }
}

const buildTransactionsTable = (_data) => {
    let data = _data;
    const currentAddress = ethereum.selectedAddress;
    const transactionsTable = `<table class="table table-primary -table-striped" id="transactionsTable"/>`;
    document.getElementById("resultTransactions").innerHTML = transactionsTable;
    const table = document.getElementById("transactionsTable");
    const rowHeader = `<thead>
                            <tr>
                                <th>Type</th>
                                <th>From/To</th>
                                <th>Value</th>
                            </tr>
                        </thead>`;
    table.innerHTML += rowHeader;
    for (let i = 0; i < data.length; i++) {
        let type = "";
        let fromTo = "";
        /* If the Address of the Transaction is equal to the current Address, the Transaction is outgoing to another Receiver */
        if (data[i].from_address === currentAddress) {
            type = "Outgoing Transaction";
            fromTo = data[i].to_address;
        } else {
            type = "Incoming Transaction";
            fromTo = data[i].from_address;
        }
        let row = `<tr>
                        <td>${type}</td>
                        <td>${fromTo}</td>
                        <td>${data[i].value / (10 ** 18)} BNB</td>
                   </tr>`;
        table.innerHTML += row;
    }
}
