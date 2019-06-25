import Maker from '@makerdao/dai'
import BigNumber from 'big-number'
import ethjs from 'ethjs'
import bitcoin from 'bitcoin'
import { ethNodeEndpoint } from '../'

const bip39 = require('bip39')
const bip32 = require('bip32')


const mnemonic = "hill law jazz limb penalty escape public dish stand bracket blue jar"
const localChain = "http://localhost:2000"

const privKey = "fe62e858a48dbdd566d7b5cc519deed0095330c0811db9114251d952a1a87f70"
const address = "0x997a9268E44d9d7ba7D863f34ecbA78B819F2680"
const daiClient = function() {
  let client = null
  console.log(mnemonic, bip39)
  const initClient = async () => {
    /*
    const seed = bip39.mnemonicToSeed(mnemonic)
    const node = bip32.fromSeed(seed)
    const xpub = node.neutered().toBase58()
    const xpriv = node.toBase58()

    
    const wallet =  ethjs.fromExtendedPrivateKey(xpriv)
    
    const zeroWallet = wallet.derivePath("m/44'/60'/0'/0/0").getWallet()
    const privKey = zeroWallet.getAddressString()
    const address = zeroWallet.getPrivateKeyString()
    */
    const maker = await Maker.create("http", {
      privateKey: privKey,
      url: ethNodeEndpoint()
    })

    await maker.authenticate()
    return {
      maker,
      address,
      privKey
    }
  }
  return {
    get: async () => {
      if (!client) {
        client = await initClient()
      }
      return client
    }
  }
}()

export const getCdp = async (id) => {
  try {
    const client = await daiClient.get()
    return await client.maker.getCdp(id)
  } catch (e) {
    return null
  }
}


export const openCdp = async () => {
  const client = await daiClient.get()
  return await client.maker.openCdp()
}

export const getCdpValues = async (cdp) => {
  const debtValue = await getCdpDebtValue(cdp)
  const governanceFee = await getCdpGovernanceFee(cdp)
  const collateralizationRatio = await getCdpCollateralizationRatio(cdp)
  const liquidationPrice = await getCdpLiquidationPrice(cdp)
  const collateralValue = await getCdpCollateralValue(cdp)
  const daiBalance = await getDaiBalance()
  const wethBalance = await getWethBalance()
  const pethBalance = await getPethBalance()
  console.log('balances ', daiBalance._amount.toFixed(), wethBalance, pethBalance) 

  const cdpValues = {
    debtValue,
    governanceFee,
    collateralizationRatio,
    liquidationPrice,
    collateralValue,
    daiBalance,
    wethBalance,
    pethBalance
  }

  const renderValues = Object.keys(cdpValues).reduce((acc, k)=>{
    acc[k] = cdpValues[k].toFixed ?
      cdpValues[k].toFixed() :  cdpValues[k]._amount ?
        cdpValues[k]._amount.toFixed() : cdpValues[k]
    return acc
  }, {})

  return renderValues
}

console.log('Maker.ETH', Maker.ETH)
console.log('Maker.ETH.wei', Maker.ETH.wei)
const getCdpDebtValue = async (cdp) => await cdp.getDebtValue()

const getCdpGovernanceFee = async (cdp) => await cdp.getGovernanceFee()

const getCdpCollateralizationRatio = async (cdp) => await cdp.getCollateralizationRatio()

const getCdpLiquidationPrice = async (cdp) => await cdp.getLiquidationPrice()

const getCdpCollateralValue = async (cdp) => await cdp.getCollateralValue()

export const cdpLockEth = async (cdp, eth) => await cdp.lockEth(+eth, Maker.ETH)

export const cdpDrawDai = async (cdp, dai) => await cdp.drawDai(dai)

export const cdpWipeDai = async (cdp, dai) => await cdp.wipeDai(dai)

const getTokenService = async () => {
  const client = await daiClient.get()
  return await client.maker.service('token');
}

export const getDaiBalance = async () => (await getTokenService()).getToken('DAI').balanceOf(address);
export const getWethBalance = async () => (await getTokenService()).getToken('WETH').balanceOf(address);
export const getPethBalance = async () => (await getTokenService()).getToken('PETH').balanceOf(address);
