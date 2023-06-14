import React from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";
function App() {
  const typeCoin = "ether"; // = ETH
  const [web3API, setWeb3Api] = React.useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [balanceAnother, setBalanceAnother] = React.useState(null);
  const [accountAddressCurrent, setAccountAddressCurrent] =
    React.useState(null);
  const connectWallet = async () => {
    const provider = await detectEthereumProvider();
    // check login
    provider.request({
      method: "eth_requestAccounts",
    });
  };
  const loadProvider = async () => {
    // provider có data khi browser đã cài metamask, !provider khi browser chưa cài metamask
    const provider = await detectEthereumProvider();
    const contract = await loadContract("Faucet", provider);
    console.log(contract);
    if (provider) {
      setWeb3Api({
        web3: new Web3(provider),
        provider,
        contract,
      });
    } else {
      console.error("Please, Install Metamas");
    }
  };
  const getAccount = async () => {
    // accounts là mảng string
    const accounts = await web3API.web3.eth.getAccounts();
    accounts && accounts.length > 0 && setAccountAddressCurrent(accounts[0]);
  };
  const getBalance = async () => {
    const { web3, contract } = web3API;
    const balanceAnotherTemp = await web3.eth.getBalance(contract.address);
    balanceAnotherTemp &&
      setBalanceAnother(web3.utils.fromWei(balanceAnotherTemp, "ether")); // là chuyển balance sang ether (ETH)
  };
  // chuyển tiền từ ví A sang ví B
  const addFunds = React.useCallback(async () => {
    const { web3, contract } = web3API;
    const sendOneETH = "1";
    await contract.addFunds({
      from: accountAddressCurrent,
      value: web3.utils.toWei(sendOneETH, typeCoin),
    });
    await getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3API, accountAddressCurrent]);
  // rút tiền khỏi ví A
  const withDraw = async () => {
    const { contract, web3 } = web3API;
    const withDrawOneETH = "1";
    const withDrawAmount = web3.utils.toWei(withDrawOneETH, typeCoin);
    await contract.withdraw(withDrawAmount, {
      from: accountAddressCurrent,
    });
    await getBalance();
  };
  React.useEffect(() => {
    loadProvider();
  }, []);
  React.useEffect(() => {
    web3API?.web3 && getAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3API?.web3]);
  React.useEffect(() => {
    web3API?.contract && getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3API]);
  return (
    <>
      <p>
        Another Wallet Balance
        <strong>{` ${balanceAnother || 0} ETH with Accounts Address: ${
          web3API?.contract?.address
        }`}</strong>
      </p>
      <div>
        <button
          onClick={addFunds}
        >{`Donate From ${accountAddressCurrent} from ${web3API?.contract?.address} with value 1 ETH`}</button>
        <button onClick={withDraw}>Withdraw</button>
        <button onClick={connectWallet}>Connect Wallets</button>
      </div>
      <p>
        Accounts Current Address:
        <strong>{accountAddressCurrent || "Accounts Denined"}</strong>
      </p>
    </>
  );
}

export default App;
