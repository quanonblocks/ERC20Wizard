
function networkAndBalanceCheck() {
    
    web3.version.getNetwork((err, netId) => {

        switch (netId) {
            case "1":
                console.log('This is mainnet');
                var check = confirm("You are on Main Ethereum Network, we recommend you to first to try on testnetwork. Press OK to stop and change network OR Cancel to continue with main network");              
                    if (check==true){}
                    else{
                        web3.eth.getBalance(web3.eth.accounts[0], function(error, result) {
                            console.log(web3.fromWei(result.toNumber())); 
                            if(web3.fromWei(result.toNumber()) == 0){
                                alert("You dont have ethers to deploy the contract");
                            }
                            else{
                                newToken();
                            }
                        })
                    }
                break;

            case "2":
                console.log('This is the deprecated Morden test network.')
                break
            case "3":
                console.log('This is the ropsten test network.')
                break
            case "4":
                console.log('This is the Rinkeby test network.')
                break
            case "42":
                console.log('This is the Kovan test network.')
                break
            default:
                console.log('This is an unknown network.')
        }

        if(netId!=1){
            web3.eth.getBalance(web3.eth.accounts[0], function(error, result) {
                console.log(web3.fromWei(result.toNumber())); 
                if(web3.fromWei(result.toNumber()) == 0){
                    alert("It seems that you have insufficient amount of ether. PLease visit\nhttps://faucet.rinkeby.io/\rhttp://faucet.ropsten.be:3001/\n or any other faucet to get test ethers.");
                    
                }
                else{
                    newToken();
                }
            })
        }
    })
}

function newToken() {
    
    var tokenName = document.getElementById('tokenName').value;
    var symbol = document.getElementById('symbol').value;
    var symbolUpperCase = symbol.toUpperCase();
    var totalTokenSupply = document.getElementById('totalTokenSupply').value;
    var decimalPlaces = document.getElementById('decimalPlaces').value;
    
    var preSeed = document.getElementById('preSeed').checked;
    var preIco = document.getElementById('preIco').checked;
    var Ico = document.getElementById('Ico').checked;
    //var network = document.getElementById('network').value;


    var newContract = "" +
    "pragma solidity ^0.4.18;\n" +
    "\n" +
    "// ----------------------------------------------------------------------------\n" +
    "// Safe maths\n" +
    "// ----------------------------------------------------------------------------\n" +
    "library SafeMath {\n" +
    "    function add(uint a, uint b) internal pure returns (uint c) {\n" +
    "        c = a + b;\n" +
    "        require(c >= a);\n" +
    "    }\n" +
    "    function sub(uint a, uint b) internal pure returns (uint c) {\n" +
    "        require(b <= a);\n" +
    "        c = a - b;\n" +
    "    }\n" +
    "    function mul(uint a, uint b) internal pure returns (uint c) {\n" +
    "        c = a * b;\n" +
    "        require(a == 0 || c / a == b);\n" +
    "    }\n" +
    "    function div(uint a, uint b) internal pure returns (uint c) {\n" +
    "        require(b > 0);\n" +
    "        c = a / b;\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "\n" +
    "// ----------------------------------------------------------------------------\n" +
    "// ERC Token Standard #20 Interface\n" +
    "// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md\n" +
    "// ----------------------------------------------------------------------------\n" +
    "contract ERC20Interface {\n" +
    "    function totalSupply() public constant returns (uint);\n" +
    "    function balanceOf(address tokenOwner) public constant returns (uint balance);\n" +
    "    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);\n" +
    "    function transfer(address to, uint tokens) public returns (bool success);\n" +
    "    function approve(address spender, uint tokens) public returns (bool success);\n" +
    "    function transferFrom(address from, address to, uint tokens) public returns (bool success);\n" +
    "\n" +
    "    event Transfer(address indexed from, address indexed to, uint tokens);\n" +
    "    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);\n" +
    "}\n" +
    "\n" +
    "\n" +
    "// ----------------------------------------------------------------------------\n" +
    "// Contract function to receive approval and execute function in one call\n" +
    "//\n" +
    "// Borrowed from MiniMeToken\n" +
    "// ----------------------------------------------------------------------------\n" +
    "contract ApproveAndCallFallBack {\n" +
    "    function receiveApproval(address from, uint256 tokens, address token, bytes data) public;\n" +
    "}\n" +
    "\n" +
    "\n" +
    "// ----------------------------------------------------------------------------\n" +
    "// Owned contract\n" +
    "// ----------------------------------------------------------------------------\n" +
    "contract Owned {\n" +
    "    address public owner;\n" +
    "    address public newOwner;\n" +
    "\n" +
    "    event OwnershipTransferred(address indexed _from, address indexed _to);\n" +
    "\n" +
    "    function Owned() public {\n" +
    "        owner = msg.sender;\n" +
    "    }\n" +
    "\n" +
    "    modifier onlyOwner {\n" +
    "        require(msg.sender == owner);\n" +
    "        _;\n" +
    "    }\n" +
    "\n" +
    "    function transferOwnership(address _newOwner) public onlyOwner {\n" +
    "        newOwner = _newOwner;\n" +
    "    }\n" +
    "    function acceptOwnership() public {\n" +
    "        require(msg.sender == newOwner);\n" +
    "        OwnershipTransferred(owner, newOwner);\n" +
    "        owner = newOwner;\n" +
    "        newOwner = address(0);\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "\n" +
    "// ----------------------------------------------------------------------------\n" +
    "// ERC20 Token, with the addition of symbol, name and decimals and an\n" +
    "// initial fixed supply\n" +
    "// ----------------------------------------------------------------------------\n" +
    "contract FixedSupplyToken is ERC20Interface, Owned {\n" +
    "    using SafeMath for uint;\n" +
    "\n" +
    "    string public symbol;\n" +
    "    string public  name;\n" +
    "    uint8 public decimals;\n" +
    "    uint public _totalSupply;\n" +
    "\n" +
    "    mapping(address => uint) balances;\n" +
    "    mapping(address => mapping(address => uint)) allowed;\n" +
    "\n" +
    "\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    // Constructor\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    function FixedSupplyToken() public {\n" +
    "        symbol = \""+symbolUpperCase+"\";\n" +
    "        name = \""+tokenName+"\";\n" +
    "        decimals = "+decimalPlaces+";\n" +
    "        _totalSupply = "+totalTokenSupply+" * 10**uint(decimals);\n" +
    "        balances[owner] = _totalSupply;\n" +
    "        Transfer(address(0), owner, _totalSupply);\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    // Total supply\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    function totalSupply() public constant returns (uint) {\n" +
    "        return _totalSupply  - balances[address(0)];\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    // Get the token balance for account `tokenOwner`\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    function balanceOf(address tokenOwner) public constant returns (uint balance) {\n" +
    "        return balances[tokenOwner];\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    // Transfer the balance from token owner's account to `to` account\n" +
    "    // - Owner's account must have sufficient balance to transfer\n" +
    "    // - 0 value transfers are allowed\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    function transfer(address to, uint tokens) public returns (bool success) {\n" +
    "        balances[msg.sender] = balances[msg.sender].sub(tokens);\n" +
    "        balances[to] = balances[to].add(tokens);\n" +
    "        Transfer(msg.sender, to, tokens);\n" +
    "        return true;\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    // Token owner can approve for `spender` to transferFrom(...) `tokens`\n" +
    "    // from the token owner's account\n" +
    "    //\n" +
    "    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md\n" +
    "    // recommends that there are no checks for the approval double-spend attack\n" +
    "    // as this should be implemented in user interfaces \n" +
    "    // ------------------------------------------------------------------------\n" +
    "    function approve(address spender, uint tokens) public returns (bool success) {\n" +
    "        allowed[msg.sender][spender] = tokens;\n" +
    "        Approval(msg.sender, spender, tokens);\n" +
    "        return true;\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    // Transfer `tokens` from the `from` account to the `to` account\n" +
    "    // \n" +
    "    // The calling account must already have sufficient tokens approve(...)-d\n" +
    "    // for spending from the `from` account and\n" +
    "    // - From account must have sufficient balance to transfer\n" +
    "    // - Spender must have sufficient allowance to transfer\n" +
    "    // - 0 value transfers are allowed\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    function transferFrom(address from, address to, uint tokens) public returns (bool success) {\n" +
    "        balances[from] = balances[from].sub(tokens);\n" +
    "        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);\n" +
    "        balances[to] = balances[to].add(tokens);\n" +
    "        Transfer(from, to, tokens);\n" +
    "        return true;\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    // Returns the amount of tokens approved by the owner that can be\n" +
    "    // transferred to the spender's account\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {\n" +
    "        return allowed[tokenOwner][spender];\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    // Token owner can approve for `spender` to transferFrom(...) `tokens`\n" +
    "    // from the token owner's account. The `spender` contract function\n" +
    "    // `receiveApproval(...)` is then executed\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    function approveAndCall(address spender, uint tokens, bytes data) public returns (bool success) {\n" +
    "        allowed[msg.sender][spender] = tokens;\n" +
    "        Approval(msg.sender, spender, tokens);\n" +
    "        ApproveAndCallFallBack(spender).receiveApproval(msg.sender, tokens, this, data);\n" +
    "        return true;\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    // Don't accept ETH\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    function () public payable {\n" +
    "        revert();\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    // Owner can transfer out any accidentally sent ERC20 tokens\n" +
    "    // ------------------------------------------------------------------------\n" +
    "    function transferAnyERC20Token(address tokenAddress, uint tokens) public onlyOwner returns (bool success) {\n" +
    "        return ERC20Interface(tokenAddress).transfer(owner, tokens);\n" +
    "    }\n" +
    "}\n";
     
    //console.log(newContract);
 

    web3js = '';
    if (typeof web3 !== 'undefined') {
        web3js = new Web3(web3.currentProvider);
    } else {
        alert("Please install Metamask and then try again");
        // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }  

    BrowserSolc.getVersions(function(soljsonSources, soljsonReleases) {
      console.log(soljsonSources);
      console.log(soljsonReleases);
    });

    //Load a specific compiler version
    BrowserSolc.loadVersion("soljson-v0.4.18+commit.9cf6e910.js", function(compiler) {
        optimize = 1;
        result = compiler.compile(newContract, optimize);
        var object = result.contracts[":FixedSupplyToken"].bytecode;
        // var opcode = result.contracts[":FixedSupplyToken"].opcodes;
        // var sourceMap = result.contracts[":FixedSupplyToken"].srcmap;
        var abi = JSON.parse(result.contracts[":FixedSupplyToken"].interface);
        var bytecode ="0x" + object;
        //console.log(abi);
        //console.log(bytecode);

        var outerThis = this;
        
        var myContract = web3.eth.contract(abi);
      
        web3.eth.getGasPrice((err,gasPrice) => {
            if(err){
                console.log("deployment web3.eth.getGasPrice error: " + err);
                return null;
            } else {
                console.log("current gasPrice (gas / ether): " + gasPrice);
                web3.eth.estimateGas({data: bytecode},function(err,gasEstimate){
                    if(err) {
                        console.log("deployment web3.eth.estimateGas error: " + err);
                        return null;
                    } else {
                        console.log("deployment web3.eth.estimateGas amount: " + gasEstimate);
                        var inflatedGasCost = Math.round(1.2*gasEstimate);
                        var ethCost = gasPrice * inflatedGasCost / 10000000000 / 100000000;
                        var warnings = ""
                        if(result.errors){
                            warnings = JSON.stringify(result.errors) + ", " // show warnings if they exist
                        }
                        myContract.new({from:web3.eth.accounts[0],data:bytecode,gas:inflatedGasCost},function(err, res){
                            //console.log("newContract: " + res);
                            if(res){
                                console.log(res);
                                console.log(res.address);
                            }
                            if(err) {
                                console.log("deployment err: " + err);
                                return null;
                            } 
                        });
                    }
                });
            }
        });
    });
    
}