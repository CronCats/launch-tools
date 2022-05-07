const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const path = require('path');
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
// const { calculateFee, GasPrice } = require("@cosmjs/stargate");
const { coins } = require("@cosmjs/amino");
const {
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  calculateFee,
} = require("@cosmjs/stargate");

// example:
// juno/accounts.json
// juno/alice_accounts.json
const getWalletFile = (config, label = '', onlyDir = false) => {
  if (onlyDir) return path.join(__dirname, 'env', `${config.bech32_prefix}`)
  else return path.join(__dirname, 'env', `${config.bech32_prefix}/${label ? label + '_' : ''}accounts.json`)
};

const getWallet = async (config, label = '') => {
  const accountFile = getWalletFile(config, label)
  try {
    const res = await readFileSync(accountFile, 'utf8')
    return res;
  } catch (e) { }
}

const getClient = async (mnemonic, config) => {
  const endpoint = config.apis.rpc[0].address;
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: config.bech32_prefix });
  return SigningCosmWasmClient.connectWithSigner(endpoint, wallet);
}

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

const getChainCoinConfig = config => {
  const prefix = config.bech32_prefix;
  if (prefix === 'wasm') return { prefix, gas: `ucosm`, denom: `cosm` }
  return { prefix, gas: `u${prefix}`, denom: `${prefix}` }
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

  getChainCoinConfig,

  getClient,

  faucetSendCoins: async (config, recipient, amount) => {
    const { prefix, gas, denom } = getChainCoinConfig(config)
    const endpoint = config.apis.rpc[0].address;
    const walletFile = path.join(__dirname, 'env', `faucet_account.json`)
    const walletData = JSON.parse(await readFileSync(walletFile, 'utf8'))
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(walletData.mnemonic, { prefix });
    const faucet_address = (await wallet.getAccounts())[0].address;
    const client = await SigningCosmWasmClient.connectWithSigner(endpoint, wallet);
    const amt = coins(amount, gas);
    const fee = calculateFee(100_000, `0.025u${denom}`);
    const memo = "Faucet Send";
    const sendResult = await client.sendTokens(faucet_address, recipient, amt, fee, memo);
    console.log(`${memo} :: ${recipient} got ${amount}u${denom}`);
    return assertIsDeliverTxSuccess(sendResult)
  },

  getWalletFile,

  getWallet,

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