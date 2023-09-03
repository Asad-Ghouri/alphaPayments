import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import QRCode from "qrcode.react";

const Linkshow = () => {
  const userId = useSelector((state) => state.UserId);
  const [data, setdata] = useState([]);
  const authToken = localStorage.getItem('token');
  console.log(authToken)
  // State to store QR code data for each payment
  const [qrCodes, setQrCodes] = useState([]);

  useEffect(() => {
  
    const currentPath = window.location.pathname;

    // Split the path using '/' as the delimiter and get the last part (the dynamic part)
    const parts = currentPath.split('/');
    const dynamicId = parts[parts.length - 1];
    const trimmedDynamicId = dynamicId.trim();
    console.log("dynamic id is ",trimmedDynamicId)
}, []);

  useEffect(() => {

    const currentPath = window.location.pathname;

    // Split the path using '/' as the delimiter and get the last part (the dynamic part)
    const parts = currentPath.split('/');
    const dynamicId = parts[parts.length - 1];
    const trimmedDynamicId = dynamicId.trim();
    console.log("dynamic id is ",trimmedDynamicId)
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:5000/PaymentLinkGenerator/gett/${trimmedDynamicId}`);
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
    <div>
      <h1 style={{ textAlign: "center" }}>Payment Links</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {data.map((payment, index) => (
          <li
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <strong>Amount:</strong> {payment.amount}
            <br />
            <strong>Currency:</strong> {payment.currency}
            <br />
            <strong>Note:</strong> {payment.note}
            <br />
            <div>
              <QRCode value={payment.address} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Linkshow;
