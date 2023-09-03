import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import SearchIcon from '@mui/icons-material/Search';
import '../CSS/Shop.css'
import '../CSS/Stock.css'





const Stocks = () => {
    //------------------------------ DECLARATION OF USESTATES AND USEEFFECT --------------------------------

    const [toggleState, setToggleState] = useState(1);
    const [shopData, setshopData] = useState([]);
    const [StockData, setStockData] = useState([]);
    const [search, setsearch] = useState('');
    const [stockId, setstockId] = useState('');
    const [stock, setstock] = useState({
        id: "", Sname: "", Bname: "", category: "", type: "", name: "", quantity: 0, purchasing: 0, price: 0, date: ""
    });
    const [editstock, seteditstock] = useState({
        id: "",  quantity: 0, purchasing: 0, price: 0, date: ""
    });
    const [updateStock, setUpdatedstock] = useState({
        option: "", id: "", Newdata: ""
    });

    useEffect(() => {
        getshopData();
        getData();
    }, []);
    //---------------------------------------HANDLE INPUT CHANGES-----------------------------------
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        setstock({ ...stock, [name]: value });
    }
    const handleInput = (e) => {
        name = e.target.name;
        value = e.target.value;

        seteditstock({ ...editstock, [name]: value });
    }
    const HandleInput = (e) => {
        name = e.target.name;
        value = e.target.value;

        setUpdatedstock({ ...updateStock, [name]: value });
    }
    const toggleTab = (index) => {
        setToggleState(index);
    };

    //-------------------------------------------GET SHOP DATA---------------------------------------------
    const getshopData = async (e) => {
        const res = await fetch('/getshopdata', {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
        });
        const Data = await res.json();
        setshopData(Data);

    }
    //----------------------------------------------GET DATA ACCORDING TO SEARCH------------------------------------  
    const  getstockData = async () => {
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
            console.log(data);
        } catch (err) {
            window.alert("Error occurred while submitting the form");
        }
    };

    //---------------------------------------------GET DATA FROM DATABASE-------------------------------------------
    const getData = async (e) => {
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

    //-------------------------------------------ADD STOCK---------------------------------------------
    const postData = async (e) => {
        e.preventDefault();
        console.log(stock);
        const { id, Sname, Bname, category, type, name, quantity, purchasing, price, date } = stock;
        const res = await fetch('/addstock', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id, Sname, Bname, category, type, name, quantity, purchasing, price, date
            })
        });

        try {
            const data = await res.json();
            if (res.status === 422 || !data) {
                window.alert("Please fill all the fields properly");
            } else if (res.status === 406) {
                window.alert("Stock id already exists");
                setstock({
                    id: "",
                    Sname: Sname,
                    Bname: Bname,
                    category: category,
                    type: type,
                    name: name,
                    quantity: quantity,
                    purchasing: purchasing,
                    price: price,
                    date: data
                });
            }
            else if (res.status === 201) {
                window.alert("Added Successfully");
                setstock({
                    id: "", Sname: "", Bname: "", category: "", type: "", name: "", quantity: 0, purchasing: 0, price: 0, date: ""
                });
            }
        } catch (err) {
            window.alert("Error occurred while submitting the form");
        }
    };

    //----------------------------------------------EDIT STOCK------------------------------------  
    const EditData = async (e) => {
        e.preventDefault();
        const { id,  quantity, purchasing, price, date } = editstock;

        const res = await fetch('/editStock', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,  quantity, purchasing, price, date
            })

        });
        const data = await res.json();
        try{
            if (res.status === 422 || !data) {
                window.alert("Please fill all the fields properly");
                seteditstock({
                    id: id,  quantity: quantity , purchasing: purchasing, price: price, date: date 
                });
            } else if(res.status === 406) {
                window.alert("Stock not exists");
                seteditstock({
                    id: "",  quantity: quantity , purchasing: purchasing, price: price, date: date 
                });
            }else if(res.status === 200){
                window.alert("Updated Successfully");
                seteditstock({
                    id: "",  quantity: 0, purchasing: 0, price: 0, date: ""
                });
                getData();
            }
        }catch(err){
            window.alert("Error occurred while submitting the form");
        }
        
    }

    //----------------------------------------------UPDATE STOCK------------------------------------  
    const UpdateData = async (e) => {

        e.preventDefault();
        const { option, id, Newdata } = updateStock;

        const res = await fetch('/updateStock', {
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
                setUpdatedstock({
                    option: option, id: id, Newdata: Newdata
                });
            } else if(res.status === 406) {
                window.alert("Shop not exists");
                setUpdatedstock({
                    option: option, id: "", Newdata: Newdata
                });
            }else if(res.status === 201){
                window.alert("Updated Successfully");
                setUpdatedstock({
                    option: "", id: "", Newdata: ""
                });
                getData();
            }
        }catch(err){
            window.alert("Error occurred while submitting the form");
        }
        
    }
        //----------------------------------------------DELETE STOCK------------------------------------  
        const DeleteData = async (e) => {

            e.preventDefault();
            const StockID = stockId;
    
            const res = await fetch('/deleteStock', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    StockID
                })
    
            });
            const data = await res.json();
            try{
                if (res.status === 422 || !data) {
                    window.alert("Please fill all the fields properly");
                } else if(res.status === 406) {
                    window.alert("Stock not exists");
                    setstockId("");
                }else if(res.status === 201){
                    window.alert("Deleted Successfully");
                    setstockId("");
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
                        <h2>stock</h2>
                    </div>
                    <div className="navlinks">
                        <button className={toggleState === 1 ? "active-tabs" : "Tab-btn"} onClick={() => { toggleTab(1); }}>  Add</button>
                        <button className={toggleState === 2 ? "active-tabs" : "Tab-btn"} onClick={() => { toggleTab(2); getData(); }}> Update</button>
                        <button className={toggleState === 3 ? "active-tabs" : "Tab-btn"} onClick={() => { toggleTab(3); getData(); }}>Edit</button>
                        <button className={toggleState === 4 ? "active-tabs" : "Tab-btn"} onClick={() => { toggleTab(4); getData(); }}> Delete</button>
                    </div>
                    <div className="content-container">
                        <div className="content">
                            <div className={toggleState === 1 ? "active1" : "non-active1"}>
                                <div className="input-container">
                                    <label htmlFor="id" className='label'>
                                        Stock id<span>*</span></label>
                                    <input type="text" id='id' name='id' autoComplete='off' required placeholder='Enter stock id'
                                        className='text-input' value={stock.id} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="Sname" className='label'>
                                        Shop name<span>*</span></label>
                                    <input list='Shopname' id='Sname' name='Sname' autoComplete='off' required placeholder='Enter shop name'
                                        className='text-input' value={stock.Sname} onChange={handleInputs} />
                                    <datalist id='Shopname'>
                                        {shopData.map((element, index) => (
                                            <option value={element.name} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="input-container">
                                    <label htmlFor="Bname" className='label'>
                                        Brand name<span>*</span></label>
                                    <input list='Brandname' id='Bname' name='Bname' autoComplete='off' required placeholder='Enter brand name'
                                        className='text-input' value={stock.Bname} onChange={handleInputs} />
                                    <datalist id='Brandname'>
                                        <option value="Bin Saeed" />
                                        <option value="Alkaram" />
                                        <option value="Khaadi" />
                                        <option value="Limelight" />
                                        <option value="Bonanza satrangi" />
                                        <option value="Nishat linen" />
                                        <option value="Sana safinaz" />
                                        <option value="Gul Ahmad" />
                                    </datalist>
                                </div>
                                <div className="input-container">
                                    <label htmlFor="category" className='label'>
                                        Category<span>*</span></label>
                                    <input list='categoryname' id='category' name='category' autoComplete='off' required placeholder='Enter category'
                                        className='text-input' value={stock.category} onChange={handleInputs} />
                                    <datalist id='categoryname'>
                                        <option value="Men" />
                                        <option value="Woman" />
                                    </datalist>
                                </div>
                                <div className="input-container">
                                    <label htmlFor="type" className='label'>
                                        Type<span>*</span></label>
                                    <input list='typename' id='type' name='type' autoComplete='off' required placeholder='Enter type'
                                        className='text-input' value={stock.type} onChange={handleInputs} />
                                    <datalist id='typename'>
                                        <option value="Suit" />
                                        <option value="3pc-suit" />
                                        <option value="2pc-suit" />
                                        <option value="Shirt" />
                                        <option value="Trouser" />
                                        <option value="Kurta" />
                                    </datalist>
                                </div>
                                <div className="input-container">
                                    <label htmlFor="id" className='label'>
                                        Stock name<span>*</span></label>
                                    <input type="text" id='name' name='name' autoComplete='off' required placeholder='Enter stock name'
                                        className='text-input' value={stock.name} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="quantity" className='label'>Quantity<span>*</span></label>
                                    <input type="number" id='quantity' name='quantity' autoComplete='off' required placeholder='Enter quantity'
                                        className='text-input' value={stock.quantity === 0 ? '' : stock.quantity} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="purchasing:" className='label'>Purchasing rate<span>*</span></label>
                                    <input type="number" id='purchasing' name='purchasing' autoComplete='off' required placeholder='Enter purchasing rate'
                                        className='text-input' value={stock.purchasing === 0 ? '' : stock.purchasing} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="price" className='label'>Price<span>*</span></label>
                                    <input type="number" id='price' name='price' autoComplete='off' required placeholder='Enter price'
                                        className='text-input' value={stock.price === 0 ? '' : stock.price} onChange={handleInputs} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="date" className='label'>Date<span>*</span></label>
                                    <input type="date" id='date' name='date'
                                        className='text-input' value={stock.date} onChange={handleInputs} />
                                </div>
                                <button type="submit" className='submit-btn' onClick={postData}>Add stock</button>
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

                                <div className="input-container">
                                    <label htmlFor="id" className='label'>Stock id<span>*</span></label>
                                    <input type="text" id='id' name='id' autoComplete='off' placeholder='Enter stock id'
                                        className='text-input' value={updateStock.id} onChange={HandleInput} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="option" className='label'>Option<span>*</span></label>
                                    <input list='StockUpdate' className='text-input' id='option' name='option' value={updateStock.option} onChange={HandleInput} placeholder='--Chose one--' />
                                    <datalist id='StockUpdate'>
                                        <option value="name" />
                                        <option value="Sname" />
                                        <option value="Bname" />
                                        <option value="category" />
                                        <option value="type" />
                                    </datalist>
                                </div>
                                <div className="input-container">
                                    <label htmlFor="new" className='label'>Updated text<span>*</span></label>
                                    <input type="text" id='new' name='Newdata' autoComplete='off' placeholder='Enter updated text'
                                        className='text-input' value={editstock.Newdata} onChange={HandleInput} />
                                </div>
                                <button type="submit" className='submit-btn' onClick={UpdateData}>Update stock</button>
                            </div>
                            <div className={toggleState === 3 ? "active3" : "non-active1"}>
                                <div className="search_bar">
                                    <input type="text" className='search' name='search' value={search} onChange={(e) => setsearch(e.target.value)} autoComplete='off' placeholder='Search..' />
                                    <button className='search_btn' onClick={getstockData}  ><SearchIcon /> </button>

                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Brand</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {StockData.map((element, index) => (
                                                <tr key={index}>
                                                    <td>{element.id}</td>
                                                    <td>{element.name}</td>
                                                    <td>{element.Bname}</td>
                                                    <td>{element.price}</td>
                                                    <td>
                                                        {element.quantity.map((qty, qtyIndex) => (
                                                            <span key={qtyIndex}>{qty}<br /></span>
                                                        ))}
                                                    </td>
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

                                <div className="input-container">
                                    <label htmlFor="id" className='label'>Stock id<span>*</span></label>
                                    <input type="text" id='id' name='id' autoComplete='off' placeholder='Enter stock id'
                                        className='text-input' value={editstock.id} onChange={handleInput} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="quantity" className='label'>Quantity<span>*</span></label>
                                    <input type="number" id='quantity' name='quantity' autoComplete='off' required placeholder='Enter quantity'
                                        className='text-input' value={editstock.quantity === 0 ? '' : editstock.quantity} onChange={handleInput} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="purchasing:" className='label'>Purchasing rate<span>*</span></label>
                                    <input type="number" id='purchasing' name='purchasing' autoComplete='off' required placeholder='Enter purchasing rate'
                                        className='text-input' value={editstock.purchasing === 0 ? '' : editstock.purchasing} onChange={handleInput} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="price" className='label'>Price</label>
                                    <input type="number" id='price' name='price' autoComplete='off' required placeholder='Enter price'
                                        className='text-input' value={editstock.price === 0 ? '' : editstock.price} onChange={handleInput} />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="date" className='label'>Date<span>*</span></label>
                                    <input type="date" id='date' name='date'
                                        className='text-input' value={editstock.date} onChange={handleInput} />
                                </div>
                                <button type="submit" className='submit-btn' onClick={EditData}>Edit stock</button>
                            </div>
                            <div className={toggleState === 4 ? "active4" : "non-active1"}>
                                <div className="search_bar">
                                    <input type="text" className='search' name='search' value={search} onChange={(e) => setsearch(e.target.value)} autoComplete='off' placeholder='Search..' />
                                    <button className='search_btn' onClick={getstockData}  ><SearchIcon /> </button>

                                </div>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Brand</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {StockData.map((element, index) => (
                                                <tr key={index}>
                                                    <td>{element.id}</td>
                                                    <td>{element.name}</td>
                                                    <td>{element.Bname}</td>
                                                    <td>{element.price}</td>
                                                    <td>
                                                        {element.quantity.map((qty, qtyIndex) => (
                                                            <span key={qtyIndex}>{qty}<br /></span>
                                                        ))}
                                                    </td>
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

                                <div className="input-container">
                                    <label htmlFor="id" className='label'>Stock id<span>*</span></label>
                                    <input type="text" id='id' name='id' autoComplete='off' placeholder='Enter stock id'
                                        className='text-input' value={stockId} onChange={(e) => setstockId(e.target.value)} />
                                </div>
                                <button type="submit" className='submit-btn' onClick={DeleteData}>Delete stock</button>
                            </div>
                            

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Stocks