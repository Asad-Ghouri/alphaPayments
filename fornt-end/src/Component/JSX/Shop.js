import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import SearchIcon from '@mui/icons-material/Search';
import '../CSS/Shop.css'


const Shop = () => {
    
    //------------------------------ DECLARATION OF USESTATES --------------------------------
    const [shopData, setShopData] = useState([]);
    const [search, setsearch] = useState('');
    const [ShopId, setshopId] = useState('');
    const [toggleState, setToggleState] = useState(1);
    const [shop, setshop] = useState({
        id: "", name: "", address: "", phone_no: "", phone_no1: ""
    });
    const [updateshop, setupdateshop] = useState({
        option: "", old: "", Newdata: ""
    });

    useEffect(() => {
        getData();
    }, []);

    //---------------------------------------HANDLE INPUT CHANGES-----------------------------------
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        setshop({ ...shop, [name]: value });
    }
    const handleInput = (e) => {
        name = e.target.name;
        value = e.target.value;

        setupdateshop({ ...updateshop, [name]: value });
        console.log(updateshop);
    }
    const toggleTab = (index) => {
        setToggleState(index);
    };

    //-------------------------------------------ADD SHOP---------------------------------------------
    const postData = async (e) => {
        e.preventDefault();
        const { id, name, address, phone_no, phone_no1 } = shop;
        console.log(shop);
        const res = await fetch('/addShop', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id, name, address, phone_no, phone_no1
            })
        });

        try {
            const data = await res.json();
            console.log(data.status);
            if (res.status === 422 || !data) {
                window.alert("Please fill all the fields properly");
            }else if (res.status === 406){
                window.alert("Shop id already exists");
                setshop({
                    id: "",
                    name: name,
                    address: address,
                    phone_no: phone_no,
                    phone_no1: phone_no1
                });
            }
             else if (res.status === 201) {
                window.alert("Added Successfully");
                setshop({
                    id: "",
                    name: "",
                    address: "",
                    phone_no: "",
                    phone_no1: ""
                });
            }
        } catch (err) {
            window.alert("Error occurred while submitting the form");
        }
    };

    //---------------------------------------------GET DATA FROM DATABASE-------------------------------------------
    const getData = async (e) => {
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
            console.log(searchQuery);
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

    //----------------------------------------------UPDATE SHOP------------------------------------  
    const UpdateData = async (e) => {

        e.preventDefault();
        const { option, old, Newdata } = updateshop;

        const res = await fetch('/updateShop', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                option, old, Newdata
            })

        });
        const data = await res.json();
        try{
            if (res.status === 422 || !data) {
                window.alert("Please fill all the fields properly");
                setupdateshop({
                    option: option, old: old, Newdata: Newdata
                });
            } else if(res.status === 406) {
                window.alert("Shop not exists");
                setupdateshop({
                    option: option, old: "", Newdata: Newdata
                });
            }else if(res.status === 201){
                window.alert("Updated Successfully");
                setupdateshop({
                    option: "", old: "", Newdata: ""
                });
                getData();
            }
        }catch(err){
            window.alert("Error occurred while submitting the form");
        }
        
    }

    //----------------------------------------------DELETE SHOP------------------------------------  
    const DeleteData = async (e) => {

        e.preventDefault();
        const ShopID = ShopId;

        const res = await fetch('/deleteShop', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ShopID
            })

        });
        const data = await res.json();
        try{
            if (res.status === 422 || !data) {
                window.alert("Please fill all the fields properly");
            } else if(res.status === 406) {
                window.alert("Shop not exists");
                setshopId("");
            }else if(res.status === 201){
                window.alert("Deleted Successfully");
                setshopId("");
                getData();
            }
        }catch(err){
            window.alert("Error occurred while submitting the form");
        }
       
    }

  

    return (
        <>
            <div className="main">
                <Sidebar />
                <div className="pagedata">
                    <div className="title">
                        <h2>Shop</h2>
                    </div>
                    <div className="navlinks">
                        <button className={toggleState === 1 ? "active-tabs" : "Tab-btn"} onClick={() => {toggleTab(1);}}>  Add</button>
                        <button className={toggleState === 2 ? "active-tabs" : "Tab-btn"} onClick={() => {toggleTab(2); getData();}}>Update</button>
                        <button className={toggleState === 3 ? "active-tabs" : "Tab-btn"} onClick={() => {toggleTab(3); getData();}}> Delete</button>
                    </div>
                    <div className="content-container">
                        <div className="content">
                            <div className={toggleState === 1 ? "active1" : "non-active1"}>
                                <div className="input-container">
                                    <label htmlFor="id" className='label'>Shop id<span>*</span></label>
                                    <input type="text" id='id' name='id' autoComplete='off' required placeholder='Enter shop id'
                                        className='text-input' value={shop.id} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="name" className='label'>Shop name<span>*</span></label>
                                    <input type="text" id='name' name='name' autoComplete='off' required placeholder='Enter shop name'
                                        className='text-input' value={shop.name} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="address" className='label'>Shop address<span>*</span></label>
                                    <input type="text" id='address' name='address' autoComplete='off' required placeholder='Enter address'
                                        className='text-input' value={shop.address} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="phone" className='label'>Phone No<span>*</span></label>
                                    <input type="text" id='phone' name='phone_no' autoComplete='off' required placeholder='Enter Phone-no'
                                        className='text-input' value={shop.phone_no} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="phone1" className='label'>Second Phone No</label>
                                    <input type="text" id='phone1' name='phone_no1' autoComplete='off' placeholder='Optional'
                                        className='text-input' value={shop.phone_no1} onChange={handleInputs} />
                                </div>
                                <button type="submit" className='submit-btn' onClick={postData}>Add Shop</button>
                            </div>
                            <div className={toggleState === 2 ? "active2" : "non-active1"}>
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

                                <div className="input-container">
                                    <label htmlFor="old" className='label'>Shop id<span>*</span></label>
                                    <input type="text" id='old' name='old' autoComplete='off' placeholder='Enter shop id'
                                        className='text-input' value={updateshop.old} onChange={handleInput} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="option" className='label'>Option<span>*</span></label>
                                    <input list='ShopeUpdate' className='text-input' id='option' name='option' value={updateshop.option} onChange={handleInput} placeholder='--Chose one--' />
                                    <datalist id='ShopeUpdate'>
                                        <option value="name" />
                                        <option value="address" />
                                        <option value="phone_no" />
                                        <option value="phone_no1" />
                                    </datalist>
                                </div>
                                <div className="input-container">
                                    <label htmlFor="new" className='label'>Updated text<span>*</span></label>
                                    <input type="text" id='new' name='Newdata' autoComplete='off' placeholder='Enter updated text'
                                        className='text-input' value={updateshop.Newdata} onChange={handleInput} />
                                </div>
                                <button type="submit" className='submit-btn' onClick={UpdateData}>Update Shop</button>
                            </div>
                            <div className={toggleState === 3 ? "active3" : "non-active1"}>
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

                                <div className="input-container">
                                    <label htmlFor="shopName" className='label'>Shop id<span>*</span></label>
                                    <input type="text" id='shopName' name='shopName' autoComplete='off' placeholder='Enter shop id'
                                        className='text-input' value={ShopId} onChange={(e) => setshopId(e.target.value)} />
                                </div>
                                <button type="submit" className='submit-btn' onClick={DeleteData}>Delete Shop</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default Shop