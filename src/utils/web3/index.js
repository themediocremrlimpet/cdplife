import Web3 from 'web3';

const options = {
    defaultAccount: "0x997a9268E44d9d7ba7D863f34ecbA78B819F2680",
    defaultBlock: 'latest',
    defaultGas: 1,
    defaultGasPrice: 0,
    transactionBlockTimeout: 50,
    transactionConfirmationBlocks: 24,
    transactionPollingTimeout: 480,
    //transactionSigner: new CustomTransactionSigner()
}

export const web3Client = function () {
  let client = null
  const init = function () {
    return new Web3('http://localhost:2000', null, options)
  }
  return {
    get: () => {
      if (!client) {
        client = init()
      }
      return client
    }
  }
}()

export const getBalance = async address => {
  const client = await web3Client.get()
  const balance = await client.eth.getBalance(address)
  return await fromWei(balance)
}

export const toWei = async amt => {
  const client = await web3Client.get()
  return await client.utils.toWei(amt)
}

export const fromWei = async amt => {
  const client = await web3Client.get()
  return await client.utils.fromWei(amt)
}