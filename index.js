import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [buyAmount, setbuyAmount] = useState('');
  const [sellAmount, setsellAmount] = useState('');

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  const deposit = async (amount) => {
    try {
      if (atm && amount > 0) {
        const parsedAmount = ethers.utils.parseEther(amount.toString());
        const tx = await atm.deposit(parsedAmount);
        await tx.wait();
        getBalance();
      } else {
        alert("Please enter a valid buying amount");
      }
    } catch (error) {
      console.error("Error during buying:", error);
      alert("Failed to buy. Please check your balance or try again later.");
    }
  };

  const withdraw = async (amount) => {
    try {
      if (atm && amount > 0) {
        const parsedAmount = ethers.utils.parseEther(amount.toString());
        const tx = await atm.withdraw(parsedAmount);
        await tx.wait();
        getBalance();
      } else {
        alert("Please enter a valid selling amount");
      }
    } catch (error) {
      console.error("Error during selling:", error);
      alert("Failed to sell. Insufficient balance, Please check your balance.");
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p className="message">Please install MetaMask in order to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount} className="btn connect-btn">Connect MetaMask Wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="account-info card">
        <h2>Account Information</h2>
        <p><strong>Account:</strong> {account}</p>
        <p><strong>Balance:</strong> {balance} ETH</p>
        <div className="transaction">
          <input
            type="number"
            value={buyAmount}
            onChange={(e) => setbuyAmount(e.target.value)}
            placeholder="Enter buy amount"
            className="input"
          />
          <button onClick={() => deposit(buyAmount)} className="btn deposit-btn">Buy ETH</button>
        </div>
        <div className="transaction">
          <input
            type="number"
            value={sellAmount}
            onChange={(e) => setsellAmount(e.target.value)}
            placeholder="Enter sell amount"
            className="input"
          />
          <button onClick={() => withdraw(sellAmount)} className="btn withdraw-btn">Sell ETH</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Aaron Galera's wallet</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: 'Roboto', sans-serif;
          background: linear-gradient(135deg, #e3f2fd, #bbdefb);
          color: #333;
          padding: 20px;
        }

        header {
          margin-bottom: 30px;
          text-align: center;
          color: #1e88e5;
        }

        .message {
          font-size: 1.2em;
          color: #d32f2f;
        }

        .card {
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          max-width: 400px;
          width: 100%;
          text-align: left;
        }

        h2 {
          margin-top: 0;
          color: #1e88e5;
        }

        .transaction {
          margin: 20px 0;
          display: flex;
          align-items: center;
        }

        .input {
          padding: 10px;
          font-size: 16px;
          width: calc(100% - 130px);
          margin-right: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          transition: border-color 0.3s;
        }

        .input:focus {
          border-color: #1e88e5;
        }

        .btn {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border: none;
          border-radius: 6px;
          transition: background-color 0.3s, box-shadow 0.3s;
        }

        .connect-btn {
          background-color: #1e88e5;
          color: white;
        }

        .deposit-btn {
          background-color: #43a047;
          color: white;
        }

        .withdraw-btn {
          background-color: #e53935;
          color: white;
        }

        .btn:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </main>
  );
}
