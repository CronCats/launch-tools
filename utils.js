const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const path = require('path');
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { calculateFee, GasPrice } = require("@cosmjs/stargate");

// example:
// juno/accounts.json
// juno/alice_accounts.json
const getWalletFile = (config, label = '', onlyDir = false) => {
  if (onlyDir) return path.join(__dirname, 'env', `${config.bech32_prefix}`)
  else return path.join(__dirname, 'env', `${config.bech32_prefix}/${label ? label + '_' : ''}accounts.json`)
};

const generateAndStoreWallet = async (config, label = '') => {
  const accountFileDir = getWalletFile(config, label, true)
  const accountFile = getWalletFile(config, label)
  try {
    return JSON.parse(await readFileSync(accountFile, 'utf8'))
  } catch (e) { }

  const wallet = await DirectSecp256k1HdWallet.generate(24, { prefix: config.bech32_prefix });
  let accounts = await wallet.getAccounts();
  let mnemonic = wallet.mnemonic;
  // console.log(`New ${config.bech32_prefix} account:`, accounts[0].address);

  const accountsFile = {
    mnemonic,
    accounts,
  }

  if (!existsSync(accountFileDir)) await mkdirSync(accountFileDir)
  await writeFileSync(accountFile, JSON.stringify(accountsFile), 'utf8')

  return accountsFile
}

module.exports = {

  getChainConfig: async chain => {
    if (!chain) {
      return JSON.parse(await readFileSync(__dirname + '/env/local_chain.json', 'utf8'))
    } else {
      // return chainRegistry[chain].chain
      const p = path.join(__dirname, '/node_modules/chain-registry/', chain, 'chain.json')
      return JSON.parse(await readFileSync(p, 'utf8'))
    }
  },

  getChainCoinConfig: async config => {
    return {
      prefix: config.bech32_prefix,
      gas: `u${config.bech32_prefix}`,
      denom: `${config.bech32_prefix}`,
    }
  },

  getClient: async (mnemonic, config) => {
    const endpoint = config.apis.rpc[0].address;
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: config.bech32_prefix });
    return SigningCosmWasmClient.connectWithSigner(endpoint, wallet);
  },

  getWalletFile,

  getWallet: async (config, label = '') => {
    const accountFile = getWalletFile(config, label)
    try {
      const res = await readFileSync(accountFile, 'utf8')
      return res;
    } catch (e) { }
  },

  generateAndStoreWallet,

  generateWalletsFromLabelList: async (config, list = []) => {
    // return mapped accounts
    let accounts = {}
    for await (const l of list) {
      accounts[l] = await generateAndStoreWallet(config, l)
    }

    return accounts
  },
}