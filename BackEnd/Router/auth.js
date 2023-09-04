const express = require("express");
const Routers = express.Router();
const User = require("../Modles/User");
const Shop = require("../Modles/Shop");
const Customer = require("../Modles/Customer");
const Stocks = require("../Modles/Stocks");
const Sales = require("../Modles/Sales");

const { v4: uuidv4 } = require("uuid"); // For generating unique IDs
const bodyParser = require("body-parser");
const Wallet = require("ethereumjs-wallet");
const Tx = require("ethereumjs-tx");
const Web3 = require("web3");
const ethereumjsutil = require("ethereumjs-util");
const qrcode = require("qrcode");

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

Routers.get('/changedetails/gett/:id/:amd', async (request, response) => {
  try {
    const userId = request.params.id;
    const uniqueId = request.params.amd;

    // Find the user and the matching payment link
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

    if (!user) {
      return response.status(404).json({ msg: "User or payment link not found" });
    }

    console.log(user);
    response.status(200).json({msg:"Its-Done"});
  } catch (err) {
    console.error(err);
    return response.status(500).json({ msg: "Error while updating payment link status" });
  }
});
// const { QRCode } = qrcode;

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files from the 'public' directory

// QuickNode Ethereum URL (Replace with your QuickNode Mumbai endpoint)
const quicknodeUrl =
  "https://hidden-bold-meme.matic-testnet.discover.quiknode.pro/ef3fee18bef4db390dc779a7334b017972338177/";

// // In-memory storage for payment links (You should use a database in production)
// const paymentLinks = [];

// const web3 = new Web3(quicknodeUrl);

// web3.eth.getBlockNumber().then((result) => {
//   console.log("Latest Ethereum Block is ", result);
// });

// Function to check if funds are received and update status
async function checkFundsReceived(paymentLink) {
  try {
    const balance = await web3.eth.getBalance(paymentLink.address);
    const etherBalance = web3.utils.fromWei(balance, "ether");

    if (parseFloat(etherBalance) >= parseFloat(paymentLink.amount)) {
      paymentLink.status = "Paid";
      console.log("Funds Received:", etherBalance);
    }
  } catch (error) {
    console.error("Error checking funds:", error);
  }
}

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
app.post("/api/withdraw-funds/:id", async (req, res) => {
  const { id } = req.params;
  const { toAddress } = req.body;

  const paymentLink = paymentLinks.find((link) => link.id === id);

  if (!paymentLink) {
    console.log("Payment Link not found.");
    return res.status(404).json({ error: "Payment link not found." });
  }

  try {
    const fromAddress = paymentLink.address;
    const privateKey = Buffer.from(paymentLink.privateKey, "hex");
    const amountToSend = web3.utils.toWei(
      paymentLink.amount.toString(),
      "ether"
    ); // Convert amount to wei

    // Create a raw transaction
    const txCount = await web3.eth.getTransactionCount(fromAddress);
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      to: toAddress,
      value: web3.utils.toHex(amountToSend),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
    };

    const tx = new Tx(txObject, { chain: "mumbai" });
    tx.sign(privateKey);

    const serializedTx = tx.serialize();
    const raw = "0x" + serializedTx.toString("hex");

    // Send the transaction
    const receipt = await web3.eth.sendSignedTransaction(raw);

    paymentLink.status = "Paid";

    console.log("Funds Withdrawn:", receipt);
    console.log("Updated Payment Link:", paymentLink);

    res.json({ receipt, paymentLink });
  } catch (error) {
    console.error("Error withdrawing funds:", error);
    res.status(500).json({ error: "Error withdrawing funds." });
  }
});

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
