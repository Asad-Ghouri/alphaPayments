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

//------------------------------ADD SHOP--------------------------------------------
Routers.post("/addShop", async (req, res) => {
  const { id, name, address, phone_no, phone_no1 } = req.body;
  if (!id || !name || !address || !phone_no) {
    return res
      .status(422)
      .json({ error: "Please fill all the fields properly" });
  }
  try {
    const shopExist = await Shop.findOne({ id: id });
    if (shopExist) {
      return res.status(406).json({ error: "Shop id already exists" });
    }
    const shop = new Shop({ id, name, address, phone_no, phone_no1 });
    await shop.save();
    return res.status(201).json({ message: "Shop registered successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET SHOP DATA--------------------------------------------
Routers.get("/shopdata", async (req, res) => {
  try {
    const shop = await Shop.find().sort({ _id: -1 });
    res.json(shop);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET SHOP DATA ACCORDING TO SEARCH --------------------------------------------
Routers.get("/searchshopdata", async (req, res) => {
  const searchQuery = req.query.searchQuery;

  try {
    const shops = await Shop.find({
      $or: [
        { id: { $regex: searchQuery, $options: "i" } },
        { name: { $regex: searchQuery, $options: "i" } },
        { address: { $regex: searchQuery, $options: "i" } },
        { phone_no: { $regex: searchQuery, $options: "i" } },
        { phone_no1: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ _id: -1 });

    res.json(shops);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------UPDATE SHOP --------------------------------------------
Routers.post("/updateShop", async (req, res) => {
  const { option, old, Newdata } = req.body;
  if (!option || !Newdata) {
    return res
      .status(422)
      .json({ error: "Please fill all the fields properly" });
  }
  try {
    const shopExist = await Shop.findOne({ id: old });
    if (!shopExist) {
      return res.status(406).json({ error: "Shop not exists" });
    }
    const result = await Shop.updateOne(
      { id: old },
      {
        $set: {
          [option]: Newdata,
        },
      }
    );
    return res.status(201).json({ message: "Shop  updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------DELETE SHOP --------------------------------------------
Routers.post("/deleteShop", async (req, res) => {
  const { ShopID } = req.body;
  if (!ShopID) {
    return res.status(422).json({ error: "Please provide a valid ShopName" });
  }
  try {
    const query = { id: ShopID };
    const shopExist = await Shop.findOne({ id: ShopID });
    if (!shopExist) {
      return res.status(406).json({ error: "Shop not exists" });
    }
    const result = await Shop.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(400).json({ error: "Shop not found" });
    }
    return res.status(201).json({ message: "Shop deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

Routers.post("/addcustomer", async (req, res) => {
  const { id, name, location, credit, phone_no } = req.body;
  if (!id || !name || !location || !phone_no) {
    return res
      .status(422)
      .json({ error: "Please fill all the fields properly" });
  }
  try {
    const customerExist = await Customer.findOne({ id: id });
    if (customerExist) {
      return res.status(406).json({ error: "Customer id already exists" });
    }
    const customer = new Customer({ id, name, location, credit, phone_no });
    await customer.save();
    return res
      .status(200)
      .json({ message: "Customer registered successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
Routers.post("/addcustomer", async (req, res) => {
  const { id, name, location, credit, phone_no } = req.body;
  if (!id || !name || !location || !phone_no) {
    return res
      .status(422)
      .json({ error: "Please fill all the fields properly" });
  }
  try {
    const customerExist = await Customer.findOne({ id: id });
    if (customerExist) {
      return res.status(406).json({ error: "Customer id already exists" });
    }
    const customer = new Customer({ id, name, location, credit, phone_no });
    await customer.save();
    return res
      .status(201)
      .json({ message: "Customer registered successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------UPDATE CUSTOMER --------------------------------------------
Routers.post("/updateCustomer", async (req, res) => {
  const { option, id, Newdata } = req.body;
  if (!option || !Newdata) {
    return res
      .status(422)
      .json({ error: "Please fill all the fields properly" });
  }
  try {
    const CustomerExist = await Customer.findOne({ id: id });
    if (!CustomerExist) {
      return res.status(406).json({ error: "Shop not exists" });
    }
    const result = await Customer.updateOne(
      { id: id },
      {
        $set: {
          [option]: Newdata,
        },
      }
    );
    return res.status(201).json({ message: "Shop  updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------DELETE CUSTOMER --------------------------------------------
Routers.post("/deleteCustomer", async (req, res) => {
  const { CustomerID } = req.body;
  if (!CustomerID) {
    return res.status(422).json({ error: "Please provide a valid ShopName" });
  }
  try {
    const query = { id: CustomerID };
    const customerExist = await Customer.findOne({ id: CustomerID });
    if (!customerExist) {
      return res.status(406).json({ error: "Shop not exists" });
    }
    const result = await Customer.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(400).json({ error: "Shop not found" });
    }
    return res.status(201).json({ message: "Shop deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
//------------------------------REMOVE LOAN --------------------------------------------
Routers.post("/Removecredit", async (req, res) => {
  const { CustomerId, Credit } = req.body;

  if (!CustomerId || !Credit) {
    return res
      .status(422)
      .json({ error: "Please provide a valid CustomerID and credit" });
  }

  try {
    const customerExist = await Customer.updateOne(
      { id: CustomerId },
      { $inc: { credit: -Credit } }
    );
    return res.status(201).json({ message: "Loan removed successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET CUSTOMER DATA ACCORDING TO SEARCH --------------------------------------------
Routers.get("/searchCustomerdata", async (req, res) => {
  const searchQuery = req.query.searchQuery;

  try {
    const customer = await Customer.find({
      $or: [
        { id: { $regex: searchQuery, $options: "i" } },
        { name: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
        { phone_no: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ _id: -1 });

    res.json(customer);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET CUSTOMER DATA--------------------------------------------
Routers.get("/customerdata", async (req, res) => {
  try {
    const customer = await Customer.find().sort({ _id: -1 });
    res.json(customer);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
//------------------------------GET CUSTOMER COUMT DATA--------------------------------------------
Routers.get("/Customercount", async (req, res) => {
  try {
    const customer = await Customer.countDocuments({});
    res.json(customer);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
//------------------------------GET CREDIT DATA--------------------------------------------
Routers.get("/TotalCredit", async (req, res) => {
  try {
    const customer = await Customer.aggregate([
      { $group: { _id: null, totalcredit: { $sum: "$credit" } } },
    ]);

    const totalcredit = customer.length > 0 ? customer[0].totalcredit : 0;
    res.json(totalcredit);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET SALE COUNT DATA--------------------------------------------
Routers.get("/Salecount", async (req, res) => {
  try {
    const sales = await Sales.countDocuments({});
    res.json(sales);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
//------------------------------GET RETURN DATA--------------------------------------------
Routers.get("/TotalReturn", async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      { $group: { _id: null, totalcredit: { $sum: "$price" } } },
    ]);

    const totalcredit = sales.length > 0 ? sales[0].totalcredit : 0;
    res.json(totalcredit);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------ADD STOCK--------------------------------------------
Routers.post("/addstock", async (req, res) => {
  const {
    id,
    Sname,
    Bname,
    category,
    type,
    name,
    quantity,
    purchasing,
    price,
    date,
  } = req.body;
  const remaining = quantity;
  const totalcost = quantity * purchasing;
  if (
    !id ||
    !name ||
    !Sname ||
    !Bname ||
    !category ||
    !type ||
    !purchasing ||
    !price ||
    !quantity ||
    !date
  ) {
    return res
      .status(422)
      .json({ error: "Please fill all the fields properly" });
  }
  try {
    const stockExist = await Stocks.findOne({ id: id });
    if (stockExist) {
      return res.status(406).json({ error: "Stock id already exists" });
    }
    const stock = new Stocks({
      id,
      name,
      Sname,
      Bname,
      category,
      type,
      purchasing,
      price,
      quantity,
      remaining,
      totalcost,
      date,
    });
    await stock.save();
    return res.status(201).json({ message: "Stock added successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------EDIT STOCK --------------------------------------------
Routers.post("/editStock", async (req, res) => {
  let { id, quantity, purchasing, price, date } = req.body;
  // Convert to numbers
  quantity = Number(quantity);
  purchasing = Number(purchasing);
  price = Number(price);

  if (!id || !quantity || !purchasing || !date) {
    return res
      .status(422)
      .json({ error: "Please fill all the fields properly" });
  }

  try {
    const existingStock = await Stocks.findOne({ id: id });

    if (existingStock) {
      const remaining = existingStock.remaining + quantity;
      const totalcost = quantity * purchasing;

      const updatedPurchasing = existingStock.purchasing.concat(purchasing);
      const updatedQuantity = existingStock.quantity.concat(quantity);
      const updatedTotalCost = existingStock.totalcost.concat(totalcost);
      const updatedDate = existingStock.date.concat(date);
      const result1 = await Stocks.findOne({ id: id });
      if (!price) {
        price = result1.price;
      }
      const result = await Stocks.updateOne(
        { id: id },
        {
          $set: {
            remaining: remaining,
            price: price,
            purchasing: updatedPurchasing,
            quantity: updatedQuantity,
            totalcost: updatedTotalCost,
            date: updatedDate,
          },
        }
      );

      return res.status(200).json({ message: "Stock updated successfully" });
    } else {
      return res.status(404).json({ error: "Stock not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------UPDATE STOCK --------------------------------------------
Routers.post("/updateStock", async (req, res) => {
  const { option, id, Newdata } = req.body;
  if (!option || !Newdata) {
    return res
      .status(422)
      .json({ error: "Please fill all the fields properly" });
  }
  try {
    const StockExist = await Stocks.findOne({ id: id });
    if (!StockExist) {
      return res.status(406).json({ error: "Stock not exists" });
    }
    const result = await Stocks.updateOne(
      { id: id },
      {
        $set: {
          [option]: Newdata,
        },
      }
    );
    return res.status(201).json({ message: "Stock updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------DELETE STOCK --------------------------------------------
Routers.post("/deleteStock", async (req, res) => {
  const { StockID } = req.body;
  if (!StockID) {
    return res.status(422).json({ error: "Please provide a valid ShopName" });
  }
  try {
    const query = { id: StockID };
    const result = await Stocks.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(400).json({ error: "Stock not found" });
    }
    return res.status(201).json({ message: "Stock deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET SHOP DATA FOR STOCK--------------------------------------------
Routers.get("/getshopdata", async (req, res) => {
  try {
    const shop = await Shop.find({}, { name: 1, _id: 0 });
    res.json(shop);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET STOCK DATA --------------------------------------------
Routers.get("/Stockdata", async (req, res) => {
  try {
    const shop = await Stocks.find().sort({ _id: -1 });
    res.json(shop);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
//------------------------------GET NUMBER OF STOCKS DATA --------------------------------------------
Routers.get("/Stockcount", async (req, res) => {
  try {
    const result = await Stocks.aggregate([
      { $group: { _id: null, totalRemaining: { $sum: "$remaining" } } },
    ]);

    const totalRemaining = result.length > 0 ? result[0].totalRemaining : 0;
    res.json(totalRemaining);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET TOTAL INVESTMENT --------------------------------------------
Routers.get("/totalInvestment", async (req, res) => {
  try {
    const result = await Stocks.aggregate([
      { $unwind: "$totalcost" },
      { $group: { _id: null, total: { $sum: "$totalcost" } } },
    ]);

    const total = result.length > 0 ? result[0].total : 0;
    res.json(total);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET STOCK DATA ACCORDING TO SEARCH --------------------------------------------
Routers.get("/searchStockdata", async (req, res) => {
  const searchQuery = req.query.searchQuery;
  try {
    const stock = await Stocks.find({
      $or: [
        { id: { $regex: searchQuery, $options: "i" } },
        { name: { $regex: searchQuery, $options: "i" } },
        { Sname: { $regex: searchQuery, $options: "i" } },
        { Bname: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
        { type: { $regex: searchQuery, $options: "i" } },
        { date: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ _id: -1 });
    res.json(stock);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
//------------------------------GET STOCK DATA1--------------------------------------------
Routers.get("/Stockdata1", async (req, res) => {
  try {
    const shop = await Stocks.find({ remaining: { $gt: 0 } }).sort({ _id: -1 });
    res.json(shop);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET STOCK DATA ACCORDING TO SEARCH1--------------------------------------------
Routers.get("/searchStockdata1", async (req, res) => {
  const searchQuery = req.query.searchQuery;
  try {
    const stock = await Stocks.find({
      remaining: { $gt: 0 },
      $or: [
        { id: { $regex: searchQuery, $options: "i" } },
        { name: { $regex: searchQuery, $options: "i" } },
        { Sname: { $regex: searchQuery, $options: "i" } },
        { Bname: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
        { type: { $regex: searchQuery, $options: "i" } },
        { date: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ _id: -1 });
    res.json(stock);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------ADD SALE--------------------------------------------
Routers.post("/addsale", async (req, res) => {
  let { id, Cname, Sname, price, credit, date } = req.body;
  let profit;
  if (!id || !Cname || !Sname || !date) {
    return res
      .status(422)
      .json({ error: "Please fill all the fields properly" });
  }

  try {
    const stockExist = await Stocks.findOne({ name: Sname });
    const result = await Customer.updateOne(
      { name: Cname },
      {
        $inc: { credit: credit },
      }
    );

    if (stockExist) {
      const purchasing =
        stockExist.purchasing[stockExist.purchasing.length - 1];
      if (price === 0) {
        profit = credit - purchasing;
      } else {
        profit = price - purchasing;
      }

      await Stocks.updateOne({ name: Sname }, { $inc: { remaining: -1 } });

      const sale = new Sales({
        id,
        Cname,
        Sname,
        purchasing,
        price,
        credit,
        profit,
        date,
      });
      await sale.save();

      return res.status(201).json({ message: "Sale added successfully" });
    } else {
      return res.status(404).json({ error: "Stock not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------UPDATE SALE --------------------------------------------
Routers.post("/updateSale", async (req, res) => {
  const { option, id, Newdata } = req.body;
  if (!option || !Newdata) {
    return res
      .status(422)
      .json({ error: "Please fill all the fields properly" });
  }
  try {
    const saleExist = await Sales.findOne({ id: id });
    if (!saleExist) {
      return res.status(406).json({ error: "Stock does not exist" });
    }
    const result = await Sales.updateOne(
      { id: id },
      {
        $set: {
          [option]: Newdata,
        },
      }
    );
    if (option === "loan") {
      const customerExist = await Customer.findOne({ name: saleExist.Cname });
      if (customerExist.credit - saleExist.loan > 0) {
        const result = await Customer.updateOne(
          { name: saleExist.Cname },
          {
            $inc: {
              credit: -Newdata,
            },
          }
        );
      }
      const result1 = await Customer.updateOne(
        { name: saleExist.Cname },
        {
          $inc: {
            credit: Newdata,
          },
        }
      );
    }
    return res.status(201).json({ message: "Stock updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------DELETE SALE --------------------------------------------
Routers.post("/deleteSale", async (req, res) => {
  const { SaleID } = req.body;

  if (!SaleID) {
    return res.status(422).json({ error: "Please provide a valid SaleID" });
  }

  try {
    const saleExist = await Sales.findOne({ id: SaleID });

    if (saleExist) {
      const stockExist = await Stocks.findOne({ name: saleExist.Sname });

      if (stockExist) {
        await Stocks.updateOne(
          { name: saleExist.Sname },
          { $inc: { remaining: 1 } }
        );
      }
    }

    const query = { id: SaleID };
    const result = await Sales.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(400).json({ error: "Sale not found" });
    }

    return res.status(200).json({ message: "Sale deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET SALES DATA --------------------------------------------
Routers.get("/saledata", async (req, res) => {
  try {
    const sale = await Sales.find().sort({ _id: -1 });
    res.json(sale);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET SALES DATA ACCORDING TO SEARCH --------------------------------------------
Routers.get("/searchSalesdata", async (req, res) => {
  const searchQuery = req.query.searchQuery;
  try {
    const stock = await Sales.find({
      $or: [
        { id: { $regex: searchQuery, $options: "i" } },
        { Cname: { $regex: searchQuery, $options: "i" } },
        { Sname: { $regex: searchQuery, $options: "i" } },
        { date: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ _id: -1 });
    res.json(stock);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
//------------------------------GET SALES DATA1--------------------------------------------
Routers.get("/saledata1", async (req, res) => {
  const { to, from } = req.query;

  try {
    const sale = await Sales.find({ date: { $gte: from, $lte: to } }).sort({
      _id: -1,
    });
    res.json(sale);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------------------------------GET SALES DATA ACCORDING TO SEARCH1--------------------------------------------
Routers.get("/searchSalesdata1", async (req, res) => {
  const searchQuery = req.query.searchQuery;
  const { to, from } = req.body;

  try {
    const sale = await Sales.find({
      date: { $gte: from, $lte: to },
      $or: [
        { id: { $regex: searchQuery, $options: "i" } },
        { Cname: { $regex: searchQuery, $options: "i" } },
        { Sname: { $regex: searchQuery, $options: "i" } },
        { date: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ _id: -1 });
    res.json(sale);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
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
  console.log("Received userId:", userId);

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
Routers.get(`/PaymentLinkGenerator/gett/:id`, async (request, response) => {
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
    const paymentLink = {
      uniqueid: Math.random().toString(36).substring(7),
      address: wallet.getAddressString(),
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
