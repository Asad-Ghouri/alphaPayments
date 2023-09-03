import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import qrcode from "qrcode";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function PaymentLinkGenerator() {
  const authToken = localStorage.getItem('token');
  console.log(authToken)
  const navigate=useNavigate();
  const [amount, setamount] = useState();
  const [currency, setcurrency] = useState();
  const [note, setnote] = useState();
  const [dynamic,setdynamic]=useState();
  const userId = useSelector((state) => state.UserId);
  async function createPaymentLink() {
    console.log("HERE");
    console.log(amount, currency, note);
    await fetch(`http://localhost:5000/api/generate-payment-link/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency, note }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Display the wallet address
        console.log(data.user._id);
        setdynamic(data.user._id)
        document.getElementById("walletAddress").innerText = data.paymentLink;

        // Generate and display the QR code
        const qrCode = new qrcode(document.getElementById("qrcode"), {
          text: data.qrCode,
          width: 128,
          height: 128,
        });
      })
      .catch((error) => console.error(error));
      // navigate('/PaymentLinkGenerator/gett')
  }

  
  const currentPath = window.location.pathname;

  // Split the path using '/' as the delimiter and get the last part (the dynamic part)
  const parts = currentPath.split('/');
  const dynamicId = parts[parts.length - 1];

  return (
    <div>
      <h1>Create Payment Link</h1>
      <label htmlFor="amount">Amount:</label>
      <input
        type="text"
        id="amount"
        placeholder="Enter amount"
        onChange={(e) => {
          setamount(e.target.value);
        }}
      />
      <br />
      <label htmlFor="currency">Currency:</label>
      <input
        type="text"
        id="currency"
        placeholder="Enter currency"
        onChange={(e) => {
          setcurrency(e.target.value);
        }}
      />
      <br />
      <label htmlFor="note">Note:</label>
      <input
        type="text"
        id="note"
        placeholder="Enter note"
        onChange={(e) => {
          setnote(e.target.value);
        }}
      />
      <br />
      <button onClick={createPaymentLink}>Create Payment Link</button>
      <p>
        Wallet Address: "http://localhost:3000/PaymentLinkGenerator/gett/{authToken}"
      </p>
      <Link to={`/PaymentLinkGenerator/gett/${authToken}`}>Link Text</Link>

      <div id="qrcode" />
    </div>
  );
}

export default PaymentLinkGenerator;
