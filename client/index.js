const axios = require('axios');
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')


const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

const optionDefinitions = [
    {"name": 'name', "alias" : "n", "type": String, "description": "Name of person who wants gift from Santa" },
    {"name": "help", "alias": "h", "type": Boolean, "description":" Display this message"}
]

const options = commandLineArgs(optionDefinitions);

async function request_gift(name) {
  // TODO: how do we prove to the server we're on the nice list? 
    const merkleTree = new MerkleTree(niceList);
    const index = niceList.findIndex(n => n === name);
    const proof = merkleTree.getProof(index);

     const { data: gift } = await axios.post(`${serverUrl}/gift`, {
         "name": name,
         "proof": proof
    // TODO: add request body parameters here!

    });

  console.log({ gift });
}

if (options.name){
    request_gift(options.name);
} else {
    const usage = commandLineUsage({
            header: 'Options',
            optionList: optionDefinitions
        },
    );

    console.log(usage);
}

