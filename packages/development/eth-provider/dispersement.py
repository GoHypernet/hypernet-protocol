from web3 import Web3
from erc20abi import erc20abi

# URL of your hardhat 
chain = "https://eth-provider-dev.hypernetlabs.io"

# the private key of the account that will fund the other accounts
bank_pk = "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"

# the wallet address of the funding account
bank_wallet = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"

# list of account you want to fund
addresses = ["0x04b6C23e9c767028562ae737bC364e612e80401F",
             "0x48B8f268f354eCf018584640DA4D110E1e7C8a19"]

# set the deployment address of the ERC20 you want to transfer
Hypertoken_address = "0x9FBDa871d559710256a2502A2517b794B482Db40"
Hypertoken_abi = erc20abi

# how much ETH you want to send each account
# 100000000000000000000 wei = 100 ETH
funding_amount_in_wei = 100000000000000000000

# how much hypertoken you want to send each account
funding_amount_in_Hypertoken = funding_amount_in_wei = 10000000000000000000

w3 = Web3(Web3.HTTPProvider(chain))

if w3.isConnected():
    print("Successfully connected to hardhat")
else:
    print("Did not connect to hardhat")
    exit()

Hypertoken_instance = w3.eth.contract(address=Hypertoken_address, abi=Hypertoken_abi)
symbol = Hypertoken_instance.functions.symbol().call()
totalSupply = Hypertoken_instance.functions.totalSupply().call()

print("Connected to ", symbol, "contract")
print("Total supply is:", totalSupply)

for address in addresses:

    print("sending", funding_amount_in_wei, "wei to ", address)

    price = w3.eth.gas_price
    nonce = w3.eth.get_transaction_count(bank_wallet)
    tx = {'to': address, 'value': funding_amount_in_wei, 'gas': 21000, 'gasPrice': price, 'nonce': nonce, 'chainId': 1369}

    signed_txn = w3.eth.account.sign_transaction(tx, bank_pk)
    txhash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(txhash)

    print("transaction receipt:", tx_receipt)
    
    print("Sending ", symbol, "from", bank_wallet, "to", address)
    tx = Hypertoken_instance.functions.transfer(address,10).transact()
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx)
    print("transaction receipt:", tx_receipt)