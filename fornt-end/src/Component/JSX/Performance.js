import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SearchIcon from '@mui/icons-material/Search';
import '../CSS/Shop.css';


const Performance = () => {
    const [From, setFrom] = useState('');
    const [To, setTo] = useState('');
    const [showContent, setShowContent] = useState(false);
    const [SaleData, setSaleData] = useState([]);
    const [search, setsearch] = useState('');

    const handleClick = () => {
        setShowContent(true);
        getData()
    };

    const getData = async () => {
        const from = From;
        const to = To;

        const url = `/saledata1?from=${from}&to=${to}`;

        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            setSaleData(data);
          
        } catch (error) {
            console.log(error);
        }
    };


    const getSaleData = async () => {
        try {
            const searchQuery = search;
            const to = To;
            const from = From;
            const encodedSearchQuery = encodeURIComponent(searchQuery);

            const res = await fetch(`/searchSalesdata1?searchQuery=${encodedSearchQuery}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    to, from
                })
            });

            const data = await res.json();
            setSaleData(data);
        } catch (err) {
            window.alert("Error occurred while submitting the form");
        }
    };
    const totalcost = SaleData.reduce((acc, element) => {
        return acc + element.purchasing;
    }, 0);

    const totalsale = SaleData.reduce((acc, element) => {
        return acc + element.price;
    }, 0);

    const totalprofit = SaleData.reduce((acc, element) => {
        return acc + element.profit;
    }, 0);

    const totalCredit = SaleData.reduce((total, element) => {
        return total + element.credit;
    }, 0);
    return (
        <div className="main">
            <Sidebar />
            <div className="pagedata">
                <div className="title">
                    <h2>Performance</h2>
                </div>
                {/* <div className="card-row"> */}
                <div class="ag-courses_box">

                    <div class="ag-courses_item">
                        <div class="ag-courses-item_link">
                            <div class="ag-courses-item_bg"></div>

                            <div class="ag-courses-item_title">
                                <h1>Total Cost</h1>
                            </div>

                            <div class="ag-courses-item_date-box">
                                <h2 class="ag-courses-item_date">
                                    Rs.{totalcost}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div class="ag-courses_item">
                        <div class="ag-courses-item_link">
                            <div class="ag-courses-item_bg"></div>

                            <div class="ag-courses-item_title">
                                <h1>Total Sales</h1>
                            </div>

                            <div class="ag-courses-item_date-box">
                                <h2 class="ag-courses-item_date">
                                    Rs.{totalsale}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div class="ag-courses_item">
                        <div class="ag-courses-item_link">
                            <div class="ag-courses-item_bg" id></div>

                            <div class="ag-courses-item_title">
                                <h1>Total Profit</h1>
                            </div>

                            <div class="ag-courses-item_date-box">
                                <h2 class="ag-courses-item_date">
                                    Rs.{totalprofit}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div class="ag-courses_item">
                        <div class="ag-courses-item_link">
                            <div class="ag-courses-item_bg"></div>

                            <div class="ag-courses-item_title">
                                <h1>Total Loan</h1>
                            </div>

                            <div class="ag-courses-item_date-box">
                                <h2 class="ag-courses-item_date">
                                    Rs.{totalCredit}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-container">
                    <div className="content">
                        <div className="active1">
                            <div className="input-container">
                                <label htmlFor="From" className='label'>
                                    From date<span>*</span></label>
                                <input type="date" id='From' name='From' autoComplete='off' required placeholder='Enter customer id'
                                    className='text-input' value={From} onChange={(e) => setFrom(e.target.value)} />
                            </div>
                            <div className="input-container">
                                <label htmlFor="To" className='label'>To date<span>*</span></label>
                                <input type="date" id='To' name='To' autoComplete='off' required placeholder='Enter customer name'
                                    className='text-input' value={To} onChange={(e) => setTo(e.target.value)} />
                            </div>
                            <button type="submit" className='submit-btn' onClick={handleClick}>Get repot</button>
                            {showContent && (
                                <>
                                    <div className="search_bar">
                                        <input
                                            type="text"
                                            className="search"
                                            name="search"
                                            value={search}
                                            onChange={(e) => setsearch(e.target.value)}
                                            autoComplete="off"
                                            placeholder="Search.."
                                        />
                                        <button className="search_btn" onClick={getSaleData}>
                                            <SearchIcon />
                                        </button>
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
                                                {SaleData.map((element, index) => {
                                                    return (
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
                                                    );
                                                })}
                                            </tbody>

                                        </table>
                                    </div>

                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
};
export default Performance;
