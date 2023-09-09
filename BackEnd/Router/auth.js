const express = require("express");
const Routers = express.Router();
const User = require("../Modles/User");
// const Shop = require("../Modles/Shop");
// const Customer = require("../Modles/Customer");
// const Stocks = require("../Modles/Stocks");
// const Sales = require("../Modles/Sales");

const { v4: uuidv4 } = require("uuid"); // For generating unique IDs
const bodyParser = require("body-parser");
const Wallet = require("ethereumjs-wallet");
const Tx = require("ethereumjs-tx");
const Web3 = require("web3");
const ethereumjsutil = require("ethereumjs-util");
const qrcode = require("qrcode");
// const ethers =  require('ethers');
// import { ethers } from "ethers";


Routers.post("/Registration", async (req, res) => {
  try {
    const { Name, email, password } = req.body;
    if (!Name || !email || !password) {
      return res
        .status(422)
        .json({ error: "Please fill all the fields properly" });
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exists" });
    }
    const user = new User({ Name, email, password });
    await user.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

Routers.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please fill all the fields properly" });
    }
    const userLogin = await User.findOne({ email: email });
    if (
      userLogin &&
      userLogin.email === email &&
      userLogin.password === password
    ) {
      return res.status(201).json({
        message: "User logged in successfully",
        userId: userLogin._id,
      });
    } else {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

Routers.post(`/generateApiKey/:userId`, async (req, res) => {
  const userId = req.params.userId;
  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newApiKey = uuidv4();
    user.apiKeys.push({ apiKey: newApiKey });
    await user.save();

    res.status(200).json({ apiKey: user.apiKeys });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

Routers.get(`/getUserdata/:id`, async (request, response) => {
  console.log("id is ", request.params.id);
  try {
    const user = await User.findById(request.params.id);
    response.status(200).json(user);
  } catch (err) {
    console.error(err);
    return response
      .status(500)
      .json({ msg: "error while reading a single user" });
  }
});

Routers.get(`/PaymentLinkGenerator/gett/:id/:amd`, async (request, response) => {
  try {
    console.log(request.params.amd)
   
    const user = await User.findOne({
      _id: request.params.id, // Match the ObjectId
      "paymentLinks.uniqueid": request.params.amd, // Match the paymentLink with the specified uniqueid
    },{
      "paymentLinks.$": 1, // Projection to retrieve only the matching paymentLink
    });
    console.log(user)
    response.status(200).json(user);
  } catch (err) {
    console.error(err);
    return response
      .status(500)
      .json({ msg: "error while reading a single user" });
  }
});


async function withdrawFunds(idss,address,amount,privateKeys) {
  const  id = idss;
   
  console.log("withdrawFunds ",address,amount,privateKeys);
     console.log("withdrawFunds");

    //  const quicknodeUrl = "https://alpha-quaint-night.bsc-testnet.discover.quiknode.pro/3bae5ff989475ed8f9507d97c304b336e837119e/";
    //  const web3 = new Web3(quicknodeUrl);
     
    //  const senderAddress = "0xd6f000c3ef92fe33aca05038003f2d51ca66ca06";
    //  const recipientAddress = "0xF24D9E7C825d00A756d542cBE8199c5f14bA1575";
    //  const privateKey = "0xa2e659efddc2bde9e615e9cdaa7d8e011d7c38696afde6243c3d8c32e307fe81";
     
    //  web3.eth.getBalance(senderAddress)
    //    .then(balance => {
    //      // Convert the balance to a BigNumber
    //      const maxAmount = web3.utils.toBN(balance);
     
    //      console.log("Balance is ", balance);
    //      const etherBalance = web3.utils.fromWei(maxAmount, "ether");
    //      console.log("etherBalance", etherBalance);
     
    //      // Calculate the gas price you want to use (in Wei)
    //      const gasPriceWei = web3.utils.toWei("10", "gwei"); // Adjust this as needed
     
    //      // Calculate the maximum gas you can afford based on the balance and gas price
    //      const maxGas = maxAmount.div(web3.utils.toBN(gasPriceWei));
    //      const gasLimit = maxGas.toNumber(); // Convert to a number
     
    //      // Calculate the amount to send after deducting gas fees
    //      const gasFee = maxGas.mul(web3.utils.toBN(gasPriceWei));
    //      const amountToSend = maxAmount.sub(gasFee);
     
    //      // Construct the transaction object
    //      const transactionObject = {
    //        to: recipientAddress,
    //        value: amountToSend, // Subtract gas fee from the total amount
    //        gas: gasLimit, // Set the gas limit based on available balance and gas price
    //        gasPrice: gasPriceWei,
    //      };
     
    //      console.log("transactionObject ", transactionObject);
     
    //      // Check if the transaction is already pending or included in a block
    //      web3.eth.getTransactionCount(senderAddress)
    //        .then(nonce => {
    //          transactionObject.nonce = nonce;
     
    //          // Sign and send the transaction
    //          web3.eth.accounts.signTransaction(transactionObject, privateKey)
    //            .then(signedTx => {
    //              web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    //                .on('transactionHash', txHash => {
    //                  console.log(`Transaction Hash: ${txHash}`);
    //                })
    //                .on('confirmation', (confirmationNumber, receipt) => {
    //                  console.log(`Confirmation Number: ${confirmationNumber}`);
    //                  console.log(`Receipt:`, receipt);
    //                })
    //                .on('error', err => {
    //                  console.error('Transaction Error:', err);
    //                });
    //            })
    //            .catch(err => {
    //              console.error('Error signing the transaction:', err);
    //            });
    //        })
    //        .catch(err => {
    //          console.error('Error getting nonce:', err);
    //        });
    //    })
    //    .catch(err => {
    //      console.error('Error getting balance:', err);
    //    });
     
    const quicknodeUrl = "https://alpha-quaint-night.bsc-testnet.discover.quiknode.pro/3bae5ff989475ed8f9507d97c304b336e837119e/";
    const web3 = new Web3(quicknodeUrl);

     const senderAddress = address;
    const recipientAddress = "0xF24D9E7C825d00A756d542cBE8199c5f14bA1575";
    const privateKey = privateKeys;

web3.eth.getBalance(senderAddress)
  .then(balance => {
    // Convert the balance to a BigNumber
    const maxAmount = web3.utils.toBN(balance);

    console.log("Balance is ", balance);
    const etherBalance = web3.utils.fromWei(maxAmount, "ether");
    console.log("etherBalance", etherBalance);

    // Calculate the gas price you want to use (in Wei)
    const gasPriceWei = web3.utils.toWei("10", "gwei"); // Adjust this as needed

    // Calculate the maximum gas you can afford based on the balance and gas price
    const gasLimit = 21000; // Gas limit (typical value for a simple ETH transfer)
    const gasLimitBN = web3.utils.toBN(gasLimit);
    const gasFeeWei = gasLimitBN.mul(web3.utils.toBN(gasPriceWei));

    // Calculate the amount to send after deducting gas fees
    const amountToSend = maxAmount.sub(gasFeeWei);

    console.log("Gas Fee is ", web3.utils.fromWei(gasFeeWei, "ether"), "BNB");
    console.log("Amount to Send is ", web3.utils.fromWei(amountToSend, "ether"), "BNB");

    // Construct the transaction object
    const transactionObject = {
      to: recipientAddress,
      value: amountToSend, // Subtract gas fee from the total amount
      gas: gasLimit, // Set the gas limit
      gasPrice: gasPriceWei, // Gas price in Wei
    };

    console.log("transactionObject ", transactionObject);

    // Check if the transaction is already pending or included in a block
    web3.eth.getTransactionCount(senderAddress)
      .then(nonce => {
        transactionObject.nonce = nonce;

        // Sign and send the transaction
        web3.eth.accounts.signTransaction(transactionObject, privateKey)
          .then(signedTx => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
              .on('transactionHash', txHash => {
                console.log(`Transaction Hash: ${txHash}`);
              })
              .on('confirmation', (confirmationNumber, receipt) => {
                console.log(`Confirmation Number: ${confirmationNumber}`);
                console.log(`Receipt:`, receipt);
              })
              .on('error', err => {
                console.error('Transaction Error:', err);
              });
          })
          .catch(err => {
            console.error('Error signing the transaction:', err);
          });
      })
      .catch(err => {
        console.error('Error getting nonce:', err);
      });
  })
  .catch(err => {
    console.error('Error getting balance:', err);
  });

    
}

Routers.get('/changedetails/gett/:id/:amd/:address/:amount/:privateKey', async (request, response) => {
  try {
    const userId = request.params.id;
    const uniqueId = request.params.amd;
    // const param1 = request.query.param1;
    const address = request.params.address;
    const amount = request.params.amount;
    const privateKey = request.params.privateKey;
    console.log("check in bankend values ",address,amount,privateKey);
    const quicknodeUrl = "https://alpha-quaint-night.bsc-testnet.discover.quiknode.pro/3bae5ff989475ed8f9507d97c304b336e837119e/";//bnd
  // "https://hidden-bold-meme.matic-testnet.discover.quiknode.pro/ef3fee18bef4db390dc779a7334b017972338177/";//matic

    // const web31 = new Web3(quicknodeUrl);
    // const param1 = "0x9074cac923ac38656c40d0a77aa41153b2587efa";
    // Connect to a local Ethereum node (replace with your node URL)
    const web3 = new Web3(quicknodeUrl);

// Check if Web3 is connected to a node
    web3.eth.net.isListening()
    .then(() => console.log('Web3 is connected'))
    .catch((err) => console.error('Error connecting to Web3:', err));
        
    //getBalance("0x9074cac923ac38656c40d0a77aa41153b2587efa") userbalnce fix
    const balance = await web3.eth.getBalance(address);
    const etherBalance = web3.utils.fromWei(balance, "ether");
    console.log("etherBalance",etherBalance,"balance",balance);
    
       //parseFloat(0.001) user amount fix
        if (parseFloat(etherBalance) >= parseFloat(amount)) {
          // paymentLink.status = "Paid";
          // console.log("Funds Received:", etherBalance);
          const user = await User.findOneAndUpdate(
            {
              _id: userId, // Match the ObjectId
              "paymentLinks.uniqueid": uniqueId, // Match the paymentLink with the specified uniqueid
            },
            {
              $set: {
                "paymentLinks.$.status": "done", // Update the status of the matching paymentLink to "done"
              },
            },
            { new: true } // Return the updated user document
          );
            
          withdrawFunds(userId,address,amount,privateKey)
            response.status(200).json({msg:"Its-Done"});   
        }
        else{
    console.log("false condition");
        }
  } catch (err) {
    console.error("err is ",err);
    return response.status(500).json({ msg: "Error while updating payment link status" });
  }
});
// const { QRCode } = qrcode;

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files from the 'public' directory

// QuickNode Ethereum URL (Replace with your QuickNode Mumbai endpoint)


// web3.eth.getBlockNumber().then((result) => {
//   console.log("Latest Ethereum Block is ", result);
// });

// Function to check if funds are received and update status
// async function checkFundsReceived(paymentLink) {
//   try {
//     const balance = await web3.eth.getBalance(paymentLink.address);
//     const etherBalance = web3.utils.fromWei(balance, "ether");

//     if (parseFloat(etherBalance) >= parseFloat(paymentLink.amount)) {
//       paymentLink.status = "Paid";
//       console.log("Funds Received:", etherBalance);
//     }
//   } catch (error) {
//     console.error("Error checking funds:", error);
//   }
// }

// Generate an Ethereum address and payment link
Routers.post(`/api/generate-payment-link/:id`, async (req, res) => {
  const { amount, currency, note } = req.body;
  try {
    const user = await User.findById(req.params.id);
    var wallet = Wallet["default"].generate();
    console.log("InPaymentLink:")
    const paymentLink = {
      uniqueid: Math.random().toString(36).substring(7),
      address: wallet.getAddressString(),
      createdat:new Date(),
      privateKey: wallet.getPrivateKeyString(),
      amount,
      currency,
      note,
    };
    const randomEndpoint =
      "/endpoint" + Math.random().toString(36).substring(7);
    user.paymentLinks.push(paymentLink);
    console.log("Generated Payment Link:", paymentLink);

    // Generate QR code with wallet address
    qrcode.toDataURL(paymentLink.address, (err, qrCodeData) => {
      if (err) {
        console.error("Error generating QR code:", err);
        res.status(500).json({ error: "Error generating QR code." });
      } else {
        // Store the QR code URL in the user's paymentLinks.qrCode field
        paymentLink.qrCode = qrCodeData;
        user
          .save()
          .then(() => {
            res.status(200).json(user);
          })
          .catch((error) => {
            console.error("Error saving user:", error);
            res.status(500).json({ msg: "Error saving user." });
          });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "error while reading a single user" });
  }
});

Routers.get("/api/v1/getpaymentid/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id, // Match the ObjectId
    });
    if (user && user.paymentLinks.length > 0) {
      const uniqueids = user.paymentLinks.map((link) => link);
      console.log({uniqueids});
      res.status(200).json(uniqueids);
    } else {
      // User not found or no payment links
      res.status(404).json({ msg: "User not found or no payment links available" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Error while reading a single user" });
  }
});


// Withdraw funds from a payment link to a specified address
// app.post("/api/withdraw-funds/:id", async (req, res) => {
//   const { id } = req.params;
//   const { toAddress } = req.body;

//   const paymentLink = paymentLinks.find((link) => link.id === id);

//   if (!paymentLink) {
//     console.log("Payment Link not found.");
//     return res.status(404).json({ error: "Payment link not found." });
//   }

//   try {
//     const fromAddress = paymentLink.address;
//     const privateKey = Buffer.from(paymentLink.privateKey, "hex");
//     const amountToSend = Web3.utils.toWei(
//       paymentLink.amount.toString(),
//       "ether"
//     ); // Convert amount to wei

//     // Create a raw transaction
//     const txCount = await Web3.eth.getTransactionCount(fromAddress);
//     const txObject = {
//       nonce: Web3.utils.toHex(txCount),
//       to: toAddress,
//       value: Web3.utils.toHex(amountToSend),
//       gasLimit: Web3.utils.toHex(21000),
//       gasPrice: Web3.utils.toHex(Web3.utils.toWei("10", "gwei")),
//     };

//     const tx = new Tx(txObject, { chain: "mumbai" });
//     tx.sign(privateKey);

//     const serializedTx = tx.serialize();
//     const raw = "0x" + serializedTx.toString("hex");

//     // Send the transaction
//     const receipt = await web3.eth.sendSignedTransaction(raw);

//     paymentLink.status = "Paid";

//     console.log("Funds Withdrawn:", receipt);
//     console.log("Updated Payment Link:", paymentLink);

//     res.json({ receipt, paymentLink });
//   } catch (error) {
//     console.error("Error withdrawing funds:", error);
//     res.status(500).json({ error: "Error withdrawing funds." });
//   }
// });

// Serve static HTML file with QR code for payment link
app.get("/payment/:id", (req, res) => {
  const { id } = req.params;
  const paymentLink = paymentLinks.find((link) => link.id === id);

  if (!paymentLink) {
    console.log("Payment Link not found.");
    return res.status(404).json({ error: "Payment link not found." });
  }

  // Here, you can use a QR code generation library (e.g., qr-image) to generate a QR code with the payment link.
  // Then, serve the HTML page with the QR code.
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    paymentLink.paymentLink
  )}`;
  const qrCodeHtml = `<html><body><img src="${qrCodeUrl}" alt="Payment QR Code"></body></html>`;

  console.log("Served Payment QR Code:", paymentLink);
  res.send(qrCodeHtml);
});

module.exports = Routers;
