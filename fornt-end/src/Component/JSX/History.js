import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import SearchIcon from '@mui/icons-material/Search';
import '../CSS/Shop.css'
import '../CSS/Stock.css'





const History = () => {
    //------------------------------ DECLARATION OF USESTATES AND USEEFFECT --------------------------------

    const [toggleState, setToggleState] = useState(1);
    const [shopData, setShopData] = useState([]);
    const [StockData, setStockData] = useState([]);
    const [SaleData, setSaleData] = useState([]);
    const [CustomerData, setCustomerData] = useState([]);
    const [search, setsearch] = useState('');



    useEffect(() => {
        getsale();
        getStock();
        getCustomer();
        getShop();
    }, []);
    //---------------------------------------HANDLE INPUT CHANGES-----------------------------------
    const toggleTab = (index) => {
        setToggleState(index);
    };

    //---------------------------------------------GET SHOP DATA FROM DATABASE-------------------------------------------
    const getShop = async (e) => {
        const res = await fetch('/shopdata', {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
        });
        const Data = await res.json();
        setShopData(Data);

    }

    //----------------------------------------------GET DATA ACCORDING TO SEARCH------------------------------------  
    const getShopData = async () => {
        try {
            const searchQuery = search;
            const encodedSearchQuery = encodeURIComponent(searchQuery);

            const res = await fetch(`/searchshopdata?searchQuery=${encodedSearchQuery}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();
            setShopData(data);
        } catch (err) {
            console.error(err);
        }
    };

    //---------------------------------------------GET STOCK DATA FROM DATABASE-------------------------------------------
    const getStock = async (e) => {
        const res = await fetch('/Stockdata', {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
        });
        const Data = await res.json();
        setStockData(Data);

    }
    //----------------------------------------------GET DATA ACCORDING TO SEARCH------------------------------------  
    const getstockData = async () => {
        try {
            const searchQuery = search;
            const encodedSearchQuery = encodeURIComponent(searchQuery);

            const res = await fetch(`/searchStockdata?searchQuery=${encodedSearchQuery}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();
            setStockData(data);
        } catch (err) {
            window.alert("Error occurred while submitting the form");
        }
    };
    //-------------------------------------------GET SALES DATA---------------------------------------------
    const getsale = async (e) => {
        const res = await fetch('/saledata', {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
        });
        const Data = await res.json();
        setSaleData(Data);

    }

    //----------------------------------------------GET DATA ACCORDING TO SEARCH------------------------------------  
    const getsaleData = async () => {
        try {
            const searchQuery = search;
            const encodedSearchQuery = encodeURIComponent(searchQuery);

            const res = await fetch(`/searchSalesdata?searchQuery=${encodedSearchQuery}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();
            setSaleData(data);
        } catch (err) {
            window.alert("Error occurred while submitting the form");
        }
    };
    //---------------------------------------------GET CUSTOMER DATA FROM DATABASE-------------------------------------------
    const getCustomer = async (e) => {
        const res = await fetch('/customerdata', {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
        });
        const Data = await res.json();
        setCustomerData(Data);

    }

    //----------------------------------------------GET DATA ACCORDING TO SEARCH------------------------------------  
    const getCustomerData = async () => {
        try {
            const searchQuery = search;
            const encodedSearchQuery = encodeURIComponent(searchQuery);

            const res = await fetch(`/searchCustomerdata?searchQuery=${encodedSearchQuery}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();
            setCustomerData(data);
        } catch (err) {
            window.alert("Error occurred while submitting the form");
        }
    };


    return (
        <>
            <div className="main">
                <Sidebar />
                <div className="pagedata">
                    <div className="title">
                        <h2>History</h2>
                    </div>
                    <div className="navlinks">
                        <button className={toggleState === 1 ? "active-tabs" : "Tab-btn"} onClick={() => { toggleTab(1); }}>Sales</button>
                        <button className={toggleState === 2 ? "active-tabs" : "Tab-btn"} onClick={() => { toggleTab(2); }}>Skocks</button>
                        <button className={toggleState === 3 ? "active-tabs" : "Tab-btn"} onClick={() => { toggleTab(3); }}>Customer</button>
                        <button className={toggleState === 4 ? "active-tabs" : "Tab-btn"} onClick={() => { toggleTab(4); }}>Shop</button>
                    </div>
                    <div className="content-container">
                        <div className="content">
                            <div className={toggleState === 1 ? "active1" : "non-active1"}>
                                <div className="search_bar">
                                    <input type="text" className='search' name='search' value={search} onChange={(e) => setsearch(e.target.value)} autoComplete='off' placeholder='Search..' />
                                    <button className='search_btn' onClick={getsaleData}  ><SearchIcon /> </button>

                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Customer</th>
                                                <th>Stock</th>
                                                <th>Cost</th>
                                                <th>Price</th>
                                                <th>Credit</th>
                                                <th>Profit</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {SaleData.map((element, index) => (
                                                <tr key={index}>
                                                    <td>{element.id}</td>
                                                    <td>{element.Cname}</td>
                                                    <td>{element.Sname}</td>
                                                    <td>{element.purchasing}</td>
                                                    <td>{element.price}</td>
                                                    <td>{element.credit}</td>
                                                    <td>{element.profit}</td>
                                                    <td>{element.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <div className={toggleState === 2 ? "active2" : "non-active1"}>
                                <div className="search_bar">
                                    <input type="text" className='search' name='search' value={search} onChange={(e) => setsearch(e.target.value)} autoComplete='off' placeholder='Search..' />
                                    <button className='search_btn' onClick={getstockData}  ><SearchIcon /> </button>

                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Shop</th>
                                                <th>Brand</th>
                                                <th>Category</th>
                                                <th>Type</th>
                                                <th>Name</th>
                                                <th>Quantity</th>
                                                <th>Cost</th>
                                                <th>Price</th>
                                                <th>Available</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {StockData.map((element, index) => (
                                                <tr key={index}>
                                                    <td>{element.id}</td>
                                                    <td>{element.Sname}</td>
                                                    <td>{element.Bname}</td>
                                                    <td>{element.category}</td>
                                                    <td>{element.type}</td>
                                                    <td>{element.name}</td>
                                                    <td>
                                                        {element.quantity.map((qty, qtyIndex) => (
                                                            <span key={qtyIndex}>{qty}<br /></span>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        {element.purchasing.map((purchasing, purchasingindex) => (
                                                            <span key={purchasingindex}>{purchasing}<br /></span>
                                                        ))}
                                                    </td>
                                                    <td>{element.price}</td>
                                                    <td>{element.remaining}</td>
                                                    <td>
                                                        {element.date.map((dateVal, dateIndex) => (
                                                            <span key={dateIndex}>{dateVal}<br /></span>
                                                        ))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={toggleState === 3 ? "active3" : "non-active1"}>
                                <div className="search_bar">
                                    <input type="text" className='search' name='search' value={search} onChange={(e) => setsearch(e.target.value)} autoComplete='off' placeholder='Search..' />
                                    <button className='search_btn' onClick={getCustomerData}  ><SearchIcon /> </button>

                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Loation</th>
                                                <th>Credit</th>
                                                <th>Phone-no</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {CustomerData.map((element, index) => (
                                                <tr key={index}>
                                                    <td>{element.id}</td>
                                                    <td>{element.name}</td>
                                                    <td>{element.location}</td>
                                                    <td>{element.credit}</td>
                                                    <td>{element.phone_no}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className={toggleState === 4 ? "active4" : "non-active1"}>
                                <div className="search_bar">
                                    <input type="text" className='search' name='search' value={search} onChange={(e) => setsearch(e.target.value)} autoComplete='off' placeholder='Search..' />
                                    <button className='search_btn' onClick={getShopData}  ><SearchIcon /> </button>

                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Address</th>
                                                <th>Phone-no</th>
                                                <th>Phone-no1</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shopData.map((element, index) => (
                                                <tr key={index}>
                                                    <td>{element.id}</td>
                                                    <td>{element.name}</td>
                                                    <td>{element.address}</td>
                                                    <td>{element.phone_no}</td>
                                                    <td>{element.phone_no1}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>


                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default History