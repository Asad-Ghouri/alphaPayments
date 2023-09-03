import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import SearchIcon from '@mui/icons-material/Search';
import '../CSS/Shop.css'

const Sales = () => {
    //------------------------------ DECLARATION OF USESTATES AND USEEFFECT --------------------------------

    const [toggleState, setToggleState] = useState(1);
    const [Customer, setCustomer] = useState([]);
    const [StockData, setStockData] = useState([]);
    const [SaleData, setSaleData] = useState([]);
    const [search, setsearch] = useState('');
    const [saleId, setsaleId] = useState('');
    const [sales, setsales] = useState({
        id: "", Cname: "", Sname: "", price: 0,credit: 0, date: ""
    });
    const [updateSale, setUpdatesale] = useState({
        option: "", id: "", Newdata: ""
    });

    useEffect(() => {

        getCustomerData();
        getStockData();
    }, []);
    //---------------------------------------HANDLE INPUT CHANGES-----------------------------------
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        setsales({ ...sales, [name]: value });
    }
    const handleInput = (e) => {
        name = e.target.name;
        value = e.target.value;

        setUpdatesale({ ...updateSale, [name]: value });
    }
    const toggleTab = (index) => {
        setToggleState(index);
    };

    //-------------------------------------------GET SALES DATA---------------------------------------------
    const getData = async (e) => {
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
    //-------------------------------------------GET CUSTOMER DATA---------------------------------------------
    const getCustomerData = async (e) => {
        const res = await fetch('/customerdata', {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
        });
        const Data = await res.json();
        setCustomer(Data);

    }
    //----------------------------------------------GET DATA ACCORDING TO SEARCH------------------------------------  
    const getSalesData = async () => {
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

    //---------------------------------------------GET STOCK DATA FROM DATABASE-------------------------------------------
    const getStockData = async (e) => {
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

    //-------------------------------------------ADD SALE---------------------------------------------
    const postData = async (e) => {
        e.preventDefault();
        const { id, Cname, Sname, price, credit, date } = sales;
        const res = await fetch('/addsale', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id, Cname, Sname, credit, price, date
            })
        });

        try {
            const data = await res.json();
            if (res.status === 422 || !data) {
                window.alert("Please fill all the fields properly");
            } else if (res.status === 406) {
                window.alert("Stock id already exists");
                setsales({
                    id: "",
                    Sname: Sname,
                    Cname: Cname,
                    price: price,
                    date: data,
                    credit:credit
                });
            }
            else if (res.status === 201) {
                window.alert("Added Successfully");
                setsales({
                    id: "", Sname: "", Cname: "", price: 0, credit: 0, date: ""
                });
            }
        } catch (err) {
            window.alert("Error occurred while submitting the form");
        }
    };

    //----------------------------------------------UPDATE SALE------------------------------------  
    const UpdateData = async (e) => {

        e.preventDefault();
        const { option, id, Newdata } = updateSale;

        const res = await fetch('/updateSale', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                option, id, Newdata
            })

        });
        const data = await res.json();
        try {
            if (res.status === 422 || !data) {
                window.alert("Please fill all the fields properly");
                setUpdatesale({
                    option: option, id: id, Newdata: Newdata
                });
            } else if (res.status === 406) {
                window.alert("Shop not exists");
                setUpdatesale({
                    option: option, id: "", Newdata: Newdata
                });
            } else if (res.status === 201) {
                window.alert("Updated Successfully");
                setUpdatesale({
                    option: "", id: "", Newdata: ""
                });
                getData();
            }
        } catch (err) {
            window.alert("Error occurred while submitting the form");
        }

    }
    //----------------------------------------------DELETE SALE------------------------------------  
    const DeleteData = async (e) => {

        e.preventDefault();
        const SaleID = saleId;

        const res = await fetch('/deleteSale', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                SaleID
            })

        });
        const data = await res.json();
        try {
            if (res.status === 422 || !data) {
                window.alert("Please fill all the fields properly");
            } else if (res.status === 400) {
                window.alert("sale not exists");
                setsaleId("");
            } else if (res.status === 200) {
                window.alert("Deleted Successfully");
                setsaleId("");
                getData();
            }
        } catch (err) {
            window.alert("Error occurred while submitting the form");
        }

    }
   
    
    return (
        <>
            <div className="main">
                <Sidebar />
                <div className="pagedata">
                    <div className="title">
                        <h2>sale</h2>
                    </div>
                    <div className="navlinks">
                        <button className={toggleState === 1 ? "active-tabs" : "Tab-btn"} onClick={() => { toggleTab(1); }}>  Add</button>
                        <button className={toggleState === 2 ? "active-tabs" : "Tab-btn"} onClick={() => { toggleTab(2); getData(); }}> Update</button>
                        <button className={toggleState === 3 ? "active-tabs" : "Tab-btn"} onClick={() => { toggleTab(3); getData(); }}> Delete</button>
                    </div>
                    <div className="content-container">
                        <div className="content">
                            <div className={toggleState === 1 ? "active1" : "non-active1"}>
                                <div className="input-container">
                                    <label htmlFor="id" className='label'>
                                        Sale id<span>*</span></label>
                                    <input type="text" id='id' name='id' autoComplete='off' required placeholder='Enter sale id'
                                        className='text-input' value={sales.id} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="Cname" className='label'>
                                        Customer name<span>*</span></label>
                                    <input list='Customername' id='Cname' name='Cname' autoComplete='off' required placeholder='Enter customer name'
                                        className='text-input' value={sales.Cname} onChange={handleInputs} />
                                    <datalist id='Customername'>
                                        {Customer.map((element, index) => (
                                            <option value={element.name} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="input-container">
                                    <label htmlFor="Sname" className='label'>
                                        Stock name<span>*</span></label>
                                    <input list='Stockname' id='Sname' name='Sname' autoComplete='off' required placeholder='Enter stock name'
                                        className='text-input' value={sales.Sname} onChange={handleInputs} />
                                    <datalist id='Stockname'>
                                        {StockData.map((element, index) => (
                                            <option value={element.name} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="input-container">
                                    <label htmlFor="price" className='label'>
                                        Price</label>
                                    <input type='number' id='price' name='price' autoComplete='off' required placeholder='Enter price'
                                        className='text-input' value={sales.price === 0 ? '' : sales.price} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="credit" className='label'>
                                    Loan</label>
                                    <input type='number' id='credit' name='credit' autoComplete='off' required placeholder='Enter credit'
                                        className='text-input' value={sales.credit === 0 ? '' : sales.credit} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="date" className='label'>Date<span>*</span></label>
                                    <input type="date" id='date' name='date'
                                        className='text-input' value={sales.date} onChange={handleInputs} />
                                </div>
                                <button type="submit" className='submit-btn' onClick={postData}>Add Sale</button>
                            </div>
                            <div className={toggleState === 2 ? "active2" : "non-active1"}>
                                <div className="search_bar">
                                    <input type="text" className='search' name='search' value={search} onChange={(e) => setsearch(e.target.value)} autoComplete='off' placeholder='Search..' />
                                    <button className='search_btn' onClick={getSalesData}  ><SearchIcon /> </button>

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
                                                <th>Loan</th>
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

                                <div className="input-container">
                                    <label htmlFor="id" className='label'>Sale id<span>*</span></label>
                                    <input type="text" id='id' name='id' autoComplete='off' placeholder='Enter sale id'
                                        className='text-input' value={updateSale.id} onChange={handleInput} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="option" className='label'>Option<span>*</span></label>
                                    <input list='SaleUpdate' className='text-input' id='option' name='option' value={updateSale.option} onChange={handleInput} placeholder='--Chose one--' />
                                    <datalist id='SaleUpdate'>
                                        <option value="Cname" />
                                        <option value="Sname" />
                                        <option value="price" />
                                        <option value="date" />
                                        <option value="loan" />
                                    </datalist>
                                </div>
                                <div className="input-container">
                                    <label htmlFor="new" className='label'>Updated text<span>*</span></label>
                                    <input type="text" id='new' name='Newdata' autoComplete='off' placeholder='Enter updated text'
                                        className='text-input' value={updateSale.Newdata} onChange={handleInput} />
                                </div>
                                <button type="submit" className='submit-btn' onClick={UpdateData}>Update sale</button>
                            </div>
                        <div className={toggleState === 3 ? "active3" : "non-active1"}>
                                <div className="search_bar">
                                    <input type="text" className='search' name='search' value={search} onChange={(e) => setsearch(e.target.value)} autoComplete='off' placeholder='Search..' />
                                    <button className='search_btn' onClick={getSalesData}  ><SearchIcon /> </button>

                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Customer</th>
                                                <th>Stock</th>
                                                <th>Price</th>
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
                                                    <td>{element.price}</td>
                                                    <td>{element.profit}</td>
                                                    <td>{element.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            <div className="input-container">
                                <label htmlFor="id" className='label'>Sale id<span>*</span></label>
                                <input type="text" id='id' name='id' autoComplete='off' placeholder='Enter sale id'
                                    className='text-input' value={saleId} onChange={(e) => setsaleId(e.target.value)} />
                            </div>
                            <button type="submit" className='submit-btn' onClick={DeleteData}>Delete sale</button>
                        </div>
                            </div>



                    </div>

                </div>
            </div>

        </>
    )
}

export default Sales
