const { ethers } = require("ethers");
const cliqueSignor = (block) => {
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

// web3 output from the blocks eth_getBlockByNumber
const block = {
    baseFeePerGas: 7,
    difficulty: 2,
    extraData: "0xd883010a11846765746888676f312e31372e36856c696e75780000000000000042bc5273624489d846ba7bb9723ec9ea9af0c306b7993912a1e3b4d5aa1f73510c5c62e92542b8c28fedb34ca5263919edaf06a603f92a9883612c144e01c67f01",
    gasLimit: 8000000,
    gasUsed: 21000,
    hash: "0x9523ded8fc6ae6fcf9e84940e3eec7e15a796f44674720379dfb4d9a6b506c53",
    logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    miner: "0x0000000000000000000000000000000000000000",
    mixHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    nonce: "0x0000000000000000",
    number: 2196789,
    parentHash: "0x10a4bc4b1643bd39ec859126d1197281da9f65eca6cb189a68877edeea563afc",
    receiptsRoot: "0xf78dfb743fbd92ade140711c8bbc542b5e307f0ab7984eff35d751969fe57efa",
    sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    size: 734,
    stateRoot: "0xcdad7c1c03a62aa22c19c281a39cb9541de2f1140f21c45d170936b5f2a1153d",
    timestamp: 1654685641,
    totalDifficulty: 3835521,
    transactions: ["0x05f105de8024f605e50df7010c033b8d0bd54d241a622ded96f7b69e7ad5d6d3"],
    transactionsRoot: "0xbad9c8c528ee6ae544cb85a7b9a4ba818e0f576f445a85c741df05b76af7c5ee",
    uncles: []
};

console.log("Signor: "+cliqueSignor(block)); // for this example 0x1B355B8e90159a23e1685Ae582C81bb3bF80E795
