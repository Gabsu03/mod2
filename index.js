import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

const App = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [owner, setOwner] = useState('0x5fbdb2315678afecb367f032d93f642f64180aa3');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;

        if (!ethereum) {
          console.log('Make sure you have MetaMask!');
          return;
        } else {
          console.log('We have the ethereum object', ethereum);
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setUser(account);
        } else {
          console.log('No authorized account found');
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      console.log('Connected', accounts[0]);
      setUser(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const listItem = () => {
    if (itemPrice <= 0) {
      alert("Price must be greater than zero");
      return;
    }

    const newItem = {
      id: items.length + 1,
      name: itemName,
      price: itemPrice,
      seller: owner,
      buyer: null,
      sold: false
    };

    setItems([...items, newItem]);
    setItemName('');
    setItemPrice('');
  };

  const buyItem = (id) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        if (item.sold) {
          alert("Item already sold");
          return item;
        }
        if (item.seller === user) {
          alert("Seller cannot buy their own item");
          return item;
        }
        return {
          ...item,
          buyer: user,
          sold: true
        };
      }
      return item;
    });
    setItems(newItems);
  };

  const removeItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  };

  const getItem = (id) => {
    const item = items.find(item => item.id === id);
    if (!item) {
      alert("Item does not exist");
      return;
    }
    return item;
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f2f5;
            margin: 0;
            padding: 0;
          }
          .list-item {
            background-color: white;
            border: 1px solid #ddd;
            padding: 10px;
            margin: 5px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .list-item p {
            margin: 0;
          }
          .list-item button {
            margin-left: 10px;
          }
        `}
      </style>
      <h1 style={styles.header}>Marketplace</h1>
      {!user ? (
        <button style={styles.button} onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected as: {user}</p>
        </div>
      )}
      <div>
        <h2>List Item</h2>
        <input 
          type="text" 
          placeholder="Item Name" 
          value={itemName} 
          onChange={(e) => setItemName(e.target.value)} 
          style={styles.input}
        />
        <input 
          type="number" 
          placeholder="Item Price" 
          value={itemPrice} 
          onChange={(e) => setItemPrice(e.target.value)} 
          style={styles.input}
        />
        <button style={styles.button} onClick={listItem} disabled={!user}>List Item</button>
      </div>
      <div>
        <h2>Items</h2>
        <ul style={styles.list}>
          {items.map(item => (
            <li key={item.id} className="list-item">
              <div>
                <p>{item.name} - {item.price} ETH</p>
                <p>Seller: {item.seller}</p>
                <p>Buyer: {item.buyer ? item.buyer : 'None'}</p>
                <p>{item.sold ? 'Sold' : 'Available'}</p>
              </div>
              <div>
                {!item.sold && <button style={styles.button} onClick={() => buyItem(item.id)} disabled={!user}>Buy</button>}
                <button style={styles.button} onClick={() => removeItem(item.id)} disabled={!user}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    margin: '5px 0',
  },
  input: {
    padding: '10px',
    margin: '5px 0',
    width: '100%',
    boxSizing: 'border-box',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
};

export default App;