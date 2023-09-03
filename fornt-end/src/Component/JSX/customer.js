import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import SearchIcon from '@mui/icons-material/Search';
import '../CSS/Shop.css'

const Customer = () => {
    //------------------------------ DECLARATION OF USESTATES --------------------------------
    const [CustomerData, setCustomerData] = useState([]);
    const [search, setsearch] = useState('');
    const [customerId, setcustomerId] = useState('');
    const [credit, setcredit] = useState(0);
    const [toggleState, setToggleState] = useState(1);
    const [customer, setcustomer] = useState({
        id: "", name: "", location: "",credit:0, phone_no: ""
    });
    const [updatecustomer, setupdatecustomer] = useState({
        option: "", id: "", Newdata: ""
    });

    useEffect(() => {
        getData();
    }, []);

    //---------------------------------------HANDLE INPUT CHANGES-----------------------------------
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        setcustomer({ ...customer, [name]: value });
    }
    const handleInput = (e) => {
        name = e.target.name;
        value = e.target.value;

        setupdatecustomer({ ...updatecustomer, [name]: value });
    }
    const toggleTab = (index) => {
        setToggleState(index);
    };

    //-------------------------------------------ADD CUSTOMER---------------------------------------------
    const postData = async (e) => {
        e.preventDefault();
        const { id, name, location,credit, phone_no } = customer;
        const res = await fetch('/addcustomer', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id, name, location,credit, phone_no
            })
        });

        try {
            const data = await res.json();
            if (res.status === 422 || !data) {
                window.alert("Please fill all the fields properly");
            }else if (res.status === 406){
                window.alert("Customer id already exists");
                setcustomer({
                    id: "",
                    name: name,
                    location: location,
                    phone_no: phone_no,
                });
            }
             else if (res.status === 200) {
                window.alert("Added Successfully");
                setcustomer({
                    id: "",
                    name: "",
                    location: "",
                    phone_no: "",
                });
            }
        } catch (err) {
            window.alert("Error occurred while submitting the form");
        }
    };

    //---------------------------------------------GET DATA FROM DATABASE-------------------------------------------
    const getData = async (e) => {
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
    const getcustomerData = async () => {
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

    //----------------------------------------------UPDATE CUSTOMER------------------------------------  
    const UpdateData = async (e) => {

        e.preventDefault();
        const { option, id, Newdata } = updatecustomer;

        const res = await fetch('/updateCustomer', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                option, id, Newdata
            })

        });
        const data = await res.json();
        try{
            if (res.status === 422 || !data) {
                window.alert("Please fill all the fields properly");
                setupdatecustomer({
                    option: option, id: id, Newdata: Newdata
                });
            } else if(res.status === 406) {
                window.alert("Shop not exists");
                setupdatecustomer({
                    option: option, id: "", Newdata: Newdata
                });
            }else if(res.status === 201){
                window.alert("Updated Successfully");
                setupdatecustomer({
                    option: "", id: "", Newdata: ""
                });
                getData();
            }
        }catch(err){
            window.alert("Error occurred while submitting the form");
        }
        
    }

    //----------------------------------------------DELETE CUSTOMER------------------------------------  
    const DeleteData = async (e) => {

        e.preventDefault();
        const CustomerID = customerId;

        const res = await fetch('/deleteCustomer', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              CustomerID
            })

        });
        const data = await res.json();
        try{
            if (res.status === 422 || !data) {
                window.alert("Please fill all the fields properly");
            } else if(res.status === 406) {
                window.alert("Customer not exists");
                setcustomerId("");
            }else if(res.status === 201){
                window.alert("Deleted Successfully");
                setcustomerId("");
                getData();
            }
        }catch(err){
            window.alert("Error occurred while submitting the form");
        }
       
    }
     //----------------------------------------------REMOVE CREDIT------------------------------------  
     const Removecredit = async (e) => {
        e.preventDefault();
        const CustomerId = customerId;
        const Credit = credit;
        
        try {
            const res = await fetch('/Removecredit', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    CustomerId,Credit
                })
            });
            
            const data = await res.json();
            
            if (res.status === 422 || !data) {
                window.alert("Please fill all the fields properly");
            } else if (res.status === 406) {
                window.alert("Customer does not exist");
                setcustomerId("");
            } else if (res.status === 200) {
                window.alert("Removed Successfully");
                setcustomerId("");
                setcredit(0);
                getData();
            } else {
                throw new Error();
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
                        <h2>customer</h2>
                    </div>
                    <div className="navlinks">
                        <button className={toggleState === 1 ? "active-tabs" : "Tab-btn"} onClick={() => {toggleTab(1);}}>  Add</button>
                        <button className={toggleState === 2 ? "active-tabs" : "Tab-btn"} onClick={() => {toggleTab(2); getData();}}>Update</button>
                        <button className={toggleState === 3 ? "active-tabs" : "Tab-btn"} onClick={() => {toggleTab(3); getData();}}>Remove</button>
                        <button className={toggleState === 4 ? "active-tabs" : "Tab-btn"} onClick={() => {toggleTab(4); getData();}}> Delete</button>
                    </div>
                    <div className="content-container">
                        <div className="content">
                            <div className={toggleState === 1 ? "active1" : "non-active1"}>
                                <div className="input-container">
                                    <label htmlFor="id" className='label'>
                                    Customer id<span>*</span></label>
                                    <input type="text" id='id' name='id' autoComplete='off' required placeholder='Enter customer id'
                                        className='text-input' value={customer.id} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="name" className='label'>Customer name<span>*</span></label>
                                    <input type="text" id='name' name='name' autoComplete='off' required placeholder='Enter customer name'
                                        className='text-input' value={customer.name} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="location" className='label'>Customer location<span>*</span></label>
                                    <input type="text" id='location' name='location' autoComplete='off' required placeholder='Enter location'
                                        className='text-input' value={customer.location} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="phone" className='label'>Phone No<span>*</span></label>
                                    <input type="text" id='phone' name='phone_no' autoComplete='off' required placeholder='Enter Phone-no'
                                        className='text-input' value={customer.phone_no} onChange={handleInputs} />
                                </div>
                                <button type="submit" className='submit-btn' onClick={postData}>Add customer</button>
                            </div>
                            <div className={toggleState === 2 ? "active2" : "non-active1"}>
                                <div className="search_bar">
                                    <input type="text" className='search' name='search' value={search} onChange={(e) => setsearch(e.target.value)} autoComplete='off' placeholder='Search..' />
                                    <button className='search_btn' onClick={getcustomerData}  ><SearchIcon /> </button>

                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Loation</th>
                                                <th>Loan</th>
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

                                <div className="input-container">
                                    <label htmlFor="id" className='label'>Customer id<span>*</span></label>
                                    <input type="text" id='id' name='id' autoComplete='off' placeholder='Enter customer id'
                                        className='text-input' value={updatecustomer.id} onChange={handleInput} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="option" className='label'>Option<span>*</span></label>
                                    <input list='CustomerUpdate' className='text-input' id='option' name='option' value={updatecustomer.option} onChange={handleInput} placeholder='--Chose one--' />
                                    <datalist id='CustomerUpdate'>
                                        <option value="name" />
                                        <option value="location" />
                                        <option value="phone_no" />
                                    </datalist>
                                </div>
                                <div className="input-container">
                                    <label htmlFor="new" className='label'>Updated text<span>*</span></label>
                                    <input type="text" id='new' name='Newdata' autoComplete='off' placeholder='Enter updated text'
                                        className='text-input' value={updatecustomer.Newdata} onChange={handleInput} />
                                </div>
                                <button type="submit" className='submit-btn' onClick={UpdateData}>Update customer</button>
                            </div>
                            <div className={toggleState === 3 ? "active3" : "non-active1"}>
                                <div className="search_bar">
                                    <input type="text" className='search' name='search' value={search} onChange={(e) => setsearch(e.target.value)} autoComplete='off' placeholder='Search..' />
                                    <button className='search_btn' onClick={getcustomerData}  ><SearchIcon /> </button>

                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                        <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Loation</th>
                                                <th>Loan</th>
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

                            <div className="input-container">
                                <label htmlFor="id" className='label'>Customer id<span>*</span></label>
                                <input type="text" id='id' name='id' autoComplete='off' placeholder='Enter customer id'
                                    className='text-input' value={customerId} onChange={(e) => setcustomerId(e.target.value)} />
                            </div>
                            <div className="input-container">
                                <label htmlFor="id" className='label'>Amount<span>*</span></label>
                                <input type="text" id='id' name='id' autoComplete='off' placeholder='Enter amount'
                                    className='text-input' value={credit===0?'':credit} onChange={(e) => setcredit(e.target.value)} />
                            </div>
                            <button type="submit" className='submit-btn' onClick={Removecredit}>Remove credit</button>
                        </div>

                            <div className={toggleState === 4 ? "active4" : "non-active1"}>
                                <div className="search_bar">
                                    <input type="text" className='search' name='search' value={search} onChange={(e) => setsearch(e.target.value)} autoComplete='off' placeholder='Search..' />
                                    <button className='search_btn' onClick={getcustomerData}  ><SearchIcon /> </button>

                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                        <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Loation</th>
                                                <th>Loan</th>
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
                                <div className="input-container">
                                    <label htmlFor="shopName" className='label'>Customer id<span>*</span></label>
                                    <input type="text" id='shopName' name='shopName' autoComplete='off' placeholder='Enter customer id'
                                        className='text-input' value={customerId} onChange={(e) => setcustomerId(e.target.value)} />
                                </div>
                                <button type="submit" className='submit-btn' onClick={DeleteData}>Delete customer</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
  )
}

export default Customer
