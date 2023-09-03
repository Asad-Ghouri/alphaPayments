import React, { useState , useEffect} from 'react';

import { useSelector , useDispatch } from "react-redux"

import { NavLink , useNavigate } from "react-router-dom";

import "../../App.css"

//import { toast } from 'react-toastify'; // Import toast from react-toastify
//import 'react-toastify/dist/ReactToastify.css';
function GetApikey() {

    const [apiKey, setApiKey] = useState('');
    const userId = useSelector(state=>state.UserId)
    // const isAuth = useSelector(state=>state.isAuth)
    const navigate = useNavigate();
    const [Infetchkey, setInfetchkey] = useState('');
    const [paymentCount, setpaymentCount] = useState();
    const authToken = localStorage.getItem('token');
    // const authToken = localStorage.getItem('token');
           
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
    <div className="">
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
      
        <div class="ag-courses_box">

                    <div class="ag-courses_item">
                        <div class="ag-courses-item_link">
                            <div class="ag-courses-item_bg"></div>

                            <div class="ag-courses-item_title">
                                <h1>Total Api Keys</h1>
                            </div>

                            <div class="ag-courses-item_date-box">
                                <h2 class="ag-courses-item_date">
                                   {apiKey.length}
                                </h2>
                            </div>
                        </div>
                    </div>
         
                    <div class="ag-courses_item" onClick={paymentNavigation}>
                        <div class="ag-courses-item_link">
                            <div class="ag-courses-item_bg"></div>

                            <div class="ag-courses-item_title">
                                <h1>Payment links</h1>
                            </div>

                            <div class="ag-courses-item_date-box">
                                <h2 class="ag-courses-item_date">
                                    {paymentCount?paymentCount:0}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div class="ag-courses_item">
                        <div class="ag-courses-item_link">
                            <div class="ag-courses-item_bg" id></div>

                            <div class="ag-courses-item_title">
                                <h1>Donation links</h1>
                            </div>

                            <div class="ag-courses-item_date-box">
                                <h2 class="ag-courses-item_date">
                                    0
                                </h2>
                            </div>
                        </div>
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
       {/* <ToastContainer /> */}
      {/* </header> */}
    </div>
  );
}

export default GetApikey;
