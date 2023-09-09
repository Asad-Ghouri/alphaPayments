import React, { useState , useEffect} from 'react';

import { useSelector , useDispatch } from "react-redux"

import { NavLink , useNavigate } from "react-router-dom";

import "../../App.css"

import MerchatSidebar from './MerchatSidebar';

function GetApikey() {

    const [apiKey, setApiKey] = useState('');
    const navigate = useNavigate();
    const [Infetchkey, setInfetchkey] = useState('');
    const [paymentCount, setpaymentCount] = useState();
    const authToken = localStorage.getItem('token');
           
  const generateApiKey = async () => {
    
   const data = await fetch(`/generateApiKey/${authToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setInfetchkey(key=>!key)
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key); // Copy key to clipboard

    //toast.success('API key copied to clipboard'); // Show toast notification
  };

  useEffect(() => {
    if(!authToken)
    {
        navigate("/");
    }
}, []);

     
   function paymentNavigation(){
    navigate("/PaymentLinkGenerator");
   }

  useEffect(() => {
    async function fetchData() {
        try {
          const response = await fetch(`getUserdata/${authToken}`); // Replace with your API URL
          if (!response.ok) {
            throw new Error("Request failed");
          }
          const data = await response.json();
          console.log("in useEffect data is ",data.apiKeys); // Process the fetched data
          setApiKey(data.apiKeys)
          const totalPaymentLinks = data.paymentLinks.length;
          setpaymentCount(totalPaymentLinks)
        } catch (error) {
          console.error("Error:", error);
        }
      }
      
      fetchData();
  }, [Infetchkey]);

  return (
    <div className="main">
    
    <MerchatSidebar />
    <div className="pagedata">
      <br />
      <br />
      
      <div className="keyflex">
        <div className="text">
             Get Api Keys
        </div>
        <div className="btn">
        <button onClick={generateApiKey}>Generate API Key</button>
        </div>
      </div>
      
      

        <h2 className='yourapitext'>Your API Keys</h2>
        {apiKey.length > 0 ? (
        <ul className="api-key-list">
          {apiKey.map((item, index) => (
            <li key={index} className="api-key-item"
            onClick={() => handleCopyKey(item.apiKey)}>
            {index + 1}.  {item.apiKey}
            </li>
          ))}
        </ul>
      ) : (
        <p>No API keys available.</p>
      )}
      
    </div>
    </div>
  );
}

export default GetApikey;
