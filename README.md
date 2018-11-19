# ERC20Wizard
automatic contract creation and deployment

Open **https://icowizard.quanonblocks.com**

# Instructions to Run

Clone or download the repository by running the following command in terminal:
 ```
 git clone https://github.com/BlockchainDevs/ERC20Wizard.git
```
**Download nodejs from the link given below**
```
https://nodejs.org/en/download/package-manager/
```
Run the following command in terminal
```
npm install -g http-server
```
Now open terminal from the folder where the above repository is downloaded, and start http server by running the following command in terminal
```
:~$ http-server
```

You can open/run this on browser by writing the below given url
```
http://localhost:8080
```

Add [metamask extension](https://metamask.io/) on your browser and create your account.
Switch to any Test Network and get some ethers from <https://faucet.rinkeby.io/> or <http://faucet.ropsten.be:3001/> or any other test network's faucet which you want to use.
Now enter the details as per your token requirements in the form shown on browser(index.html). Now submit the form and wait for few seconds, a metamask popup would get displayed which requires you to submit the transaction. Press SUBMIT.
You can then note the changes in metamask and your tokens are generated as soon as the contract is deployed on blockchain.
