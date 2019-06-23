import React from 'react'
import { getCdp, getCdpValues, openCdp, cdpLockEth } from '../../utils/dai/'
import { getBalance, toWei, fromWei } from '../../utils/web3/'
import Button from '@material-ui/core/Button';
import LockEth from './LockEth'

const address = "0x997a9268E44d9d7ba7D863f34ecbA78B819F2680"

const EthBalance = ({balance}) => (
  balance === null ? 'Loading' : <div>Eth Balance: {balance}</div> 
)
const CDPInfo = ({cdp}) => (
  <div>
    <div>You have a CDP {cdp.id}</div>
    <div>Debt Value: {cdp.debtValue}</div>
    <div>Governance Fee: {cdp.governanceFee}</div>
    <div>Collateralization Ratio: {cdp.collateralizationRatio}</div>
    <div>Liquidation Price: {cdp.liquidationPrice}</div>
    <div>Collateral Value: {cdp.collateralValue}</div>
    <div>
      <div>DAI: {cdp.daiBalance}</div>
      <div>WETH: {cdp.wethBalance}</div>
      <div>PETH: {cdp.pethBalance}</div>
    </div>
  </div>
)

const CDP = ({cdp, create}) => {
  console.log('CDP comp: ', cdp)
  return cdp === null ? 'Loading CDP info' :
    cdp === false ? <Button onClick={create}>Create CDP</Button> :
  <CDPInfo cdp={cdp} />
}
export class CdpDashboard extends React.Component {
  constructor(props) {
    super()
    this.state = {
      cdp: false,
      cdpValues: {},
      ethBalance: null,
      ethToLock: "0"
    }
    this.getEthBalance()
    setInterval(this.fetchCdp(), 5000)
  }

  async getEthBalance() {
    const ethBalance = await getBalance(address)
    this.setState(Object.assign({}, {...this.state}, {ethBalance}))
  }

  async fetchCdp() {
    if (!this.state.cdp) return
    const cdpValues = await getCdpValues(this.state.cdp)
    console.log('cdp fetched: ', cdpValues)
    if (cdpValues) {
      this.setState(Object.assign({}, {...this.state}, {cdpValues}))
    } else {
      this.setState(Object.assign({}, {...this.state}, {cdp:false}))
    }
  }

  async createCdp() {
    const cdp = await openCdp()
    const cdpValues = await getCdpValues(cdp)
    console.log('cdp is: ', cdp, cdpValues)
    if (cdp) {
      this.setState(Object.assign({}, {...this.state}, {cdp, cdpValues}))
    }
  }

  async lockEth () {
    const {cdp, ethToLock} = this.state
    const wei = await toWei(ethToLock)
    const nwei = +wei
    console.log('locvking: ', wei, typeof nwei)
    const lock = await cdpLockEth(cdp, ethToLock)
    console.log('locked: ', lock)
    this.fetchCdp()
    this.getEthBalance()
  }

  updateState (key, e)  {
    console.log('us: ', key, e.target.value)
    this.setState(Object.assign({}, {...this.state}, {[key]:e.target.value}))
  }

  render () {
    
    const {cdp, cdpValues, ethBalance, ethToLock} = this.state
    console.log('rendering: ', this.state.cdp, cdp)
    return (
      <div>
        <h1>welcome to the cdp life</h1>
        <EthBalance balance={ethBalance} />
        <CDP cdp={cdp? cdpValues : false} create={()=> this.createCdp()} />
        {cdp ? <LockEth value={ethToLock} onChange={this.updateState.bind(this, 'ethToLock')} submit={this.lockEth.bind(this)} /> : null}
      </div>
    )
  }
}

export default CdpDashboard