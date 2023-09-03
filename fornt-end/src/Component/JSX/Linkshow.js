import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import QRCode from "qrcode.react";
import { useParams } from "react-router-dom";
const Linkshow = () => {
  const userId = useSelector((state) => state.UserId);
  const [data, setdata] = useState([]);
  const authToken = localStorage.getItem('token');
  console.log(authToken)
  // State to store QR code data for each payment
  const [qrCodes, setQrCodes] = useState([]);

  const {id,amd}=useParams();
  console.log("id==="+id)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/PaymentLinkGenerator/gett/${id}/${amd}`);
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const data = await response.json();
        console.log(data);
        setdata(data.paymentLinks);

        // Generate QR codes for each payment
        const qrCodeData = data.paymentLinks.map((payment) => payment.qrCode);
        setQrCodes(qrCodeData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, [userId]);

  return (
    // <div>
    //   <h1 style={{ textAlign: "center" }}>Payment Links</h1>
    //   <ul style={{ listStyle: "none", padding: 0 }}>
    //     {data.map((payment, index) => (
    //       <li
    //         key={index}
    //         style={{
    //           border: "1px solid #ccc",
    //           borderRadius: "5px",
    //           padding: "10px",
    //           marginBottom: "10px",
    //         }}
    //       >
    //         <strong>Amount:</strong> {payment.amount}
    //         <br />
    //         <strong>Currency:</strong> {payment.currency}
    //         <br />
    //         <strong>Note:</strong> {payment.note}
    //         <br />
    //         <strong>createdAt:</strong> {payment.createdat}
    //         <br />
    //         <strong>Status:</strong> {payment.status}
    //         <br />
    //         <div>
    //           <QRCode value={payment.address} />
    //         </div>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <>
    {data.map((payment, index) => (
     <div className="payment-page">
      <div className="payment-details">
        <h1 className="payment-title">Payment Details</h1>
        <div className="payment-amount">
          <span className="payment-amount-value">0.0130628</span>
          <span className="payment-currency">${payment.amount}</span>
        </div>
        <p className="payment-address">Send the funds to this address</p>
        <p className="payment-address-value">{payment.address}</p>
        <div>
               <QRCode value={payment.address} />
            </div>
      </div>

      <div className="payment-status">
        <h2 className="status-title">Payment Status</h2>
        <div className="status-list">
          <div className="status-item">
            <div className="status-icon waiting"></div>
            <p className="status-text">Waiting for payment</p>
          </div>
          <div className="status-item">
            <div className="status-icon expired"></div>
            <p className="status-text">Expired</p>
          </div>
          <div className="status-item">
            <div className="status-icon confirmed"></div>
            <p className="status-text">Confirmed on blockchain</p>
          </div>
          <div className="status-item">
            <div className="status-icon sending"></div>
            <p className="status-text">Sending to seller</p>
          </div>
          <div className="status-item">
            <div className="status-icon sent"></div>
            <p className="status-text">Sent to seller 🎉</p>
          </div>
        </div>
      </div>
    </div>
   ))}
   </>
  );
};

export default Linkshow;
