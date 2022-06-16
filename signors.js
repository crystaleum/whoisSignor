const { ethers } = require("ethers");
const Web3 = require('web3');
// change the RPC if you want to switch networks / providers
const web3 = new Web3('https://evm.cryptocurrencydevs.org');
const cliqueMiner = (block) => {
  try {
    const keys = ["parentHash", "sha3Uncles", "miner", "stateRoot", "transactionsRoot", "receiptsRoot", "logsBloom", "difficulty", "number", "gasLimit", "gasUsed", "timestamp", "extraData", "mixHash", "nonce", "baseFeePerGas"];
    const datas = [];
    for (const key of keys) {
      let data = block[key];
      if (key == "baseFeePerGas" && !data) {
        continue;
      }
      if (key == "extraData") {
        data = data.substr(0, 66);
      } else if (key == "difficulty") {
        data = parseInt(data);
      }

      if (typeof data == "number") {
        data = ethers.BigNumber.from(data).toHexString();
      }
      if (data.length % 2 == 1) {
        data = "0x0" + data.substr(2); // RLP object must be BytesLike
      }
      datas.push(data);
    }
    console.log("Block Raw: "+"\n");
    console.log(datas);
    const digest = ethers.utils.keccak256(ethers.utils.RLP.encode(datas));
    const signature = "0x" + block["extraData"].substr(66);
    const signor = ethers.utils.recoverAddress(digest, signature);
    return signor;
  } catch (error) {
    console.log("error", error);
    return block.miner;
  }
};
// we establish there would soon be a block...
let block;
// web3 outputs top blocks eth call to eth_getBlockByNumber
async function getBlock(block) {
    let getBlockNumber = await web3.eth.getBlockNumber();
    console.log("Block Number: "+getBlockNumber);
    block = await web3.eth.getBlock(getBlockNumber);
    console.log("Signor: "+cliqueMiner(block));
}
getBlock(block);