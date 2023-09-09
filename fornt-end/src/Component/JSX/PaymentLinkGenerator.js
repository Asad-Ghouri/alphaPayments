import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import qrcode from "qrcode";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import MerchatSidebar from './MerchatSidebar';

function PaymentLinkGenerator() {
  const navigate=useNavigate();
  const [amount, setamount] = useState();
  const [currency, setcurrency] = useState();
  const [note, setnote] = useState();
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [dynamic,setdynamic]=useState();
  const userId = useSelector((state) => state.UserId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const authToken = localStorage.getItem('token');
  async function createPaymentLink() {
    console.log("HERE");
    console.log(amount, currency, note);
    if(amount && currency && note){
    await fetch(`/api/generate-payment-link/${authToken}`, {
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
        setIsFormOpen(false)
        document.getElementById("walletAddress").innerText = data.paymentLink;

        // Generate and display the QR code
        const qrCode = new qrcode(document.getElementById("qrcode"), {
          text: data.qrCode,
          width: 128,
          height: 128,
        });
      })
      .catch((error) => console.error(error));
    }
    else{
      return 1;
    }
      // navigate('/PaymentLinkGenerator/gett')
  }
  useEffect(() => {
    // Fetch all payment links when the component mounts
    fetch(`/api/v1/getpaymentid/${authToken}`)
    .then((response) => {
      if (response.status === 404) {
        throw new Error("User not found or no payment links available");
      }
      return response.json();
    })
    .then((data) => {
      setPaymentLinks(data); // Store the payment links in state
    })
    .catch((error) => {
      if (error.message === "User not found or no payment links available") {
        console.log(error.message); // Handle the 404 error message here
        // You can set an appropriate state or display an error message to the user
      } else {
        console.error(error); // Handle other errors
      }
    });
  
  },[dynamic]);
  function isFormtrue(){
    setIsFormOpen(true)
  }
  const closePopup = () => {
    setIsFormOpen(false);
  };
  
  return (
    <div className="main">
    <MerchatSidebar />
    <div className="f-page">
      <div className="f-page">
      <h1 className="pl"> Payment Link</h1>
     <div className="btn">
      <button className="payment-button" onClick={isFormtrue}>Create Payment Link</button>
     </div>
      </div>
     {isFormOpen && (
  <div className="popup-form">
    <button className="close-button" onClick={closePopup}>
    &times;
  </button>
     <form>
          <label htmlFor="amount">Amount:</label>
          <input
            type="text"
            id="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setamount(e.target.value)}
            required
          />
          <br />
          <label htmlFor="currency">Currency:</label>
          <input
            type="text"
            id="currency"
            placeholder="Enter currency"
            value={currency}
            onChange={(e) => setcurrency(e.target.value)}
            required
          />
          <br />
          <label htmlFor="note">Note:</label>
          <input
            type="text"
            id="note"
            placeholder="Enter note"
            value={note}
            onChange={(e) => setnote(e.target.value)}
          />
          <br />
          <button onClick={createPaymentLink}>Create Payment Link</button>
        </form>
  </div>
)}
     
      <div id="qrcode" />
   
    
    <div className="payment-table">
      <table>
        <thead>
          <tr>
            <th>Payment link ID</th>
            <th>Price</th>
            <th>Currency</th>
            <th>Status</th>
            <th>Invoice URL</th>
            <th>Created at</th>
          </tr>
        </thead>
        { paymentLinks.map((walletAddress, index) => (
        <tbody>
          <tr>
            <td>{walletAddress._id}</td>
            <td>{walletAddress.amount}</td>
            <td>{walletAddress.currency}</td>
            <td>{walletAddress.status}</td>
            <td><a href={`http://localhost:3000/PaymentLinkGenerator/gett/${authToken}/${walletAddress.uniqueid}`}>{`http://localhost:3000/PaymentLinkGenerator/gett/${authToken}/${walletAddress.uniqueid}`}</a></td>
            <td>{walletAddress.createdat}</td>
          </tr>
        </tbody>
        ))
          }
      </table>
    </div>
    
    </div>

    </div>
  );
}

export default PaymentLinkGenerator;