import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SearchIcon from '@mui/icons-material/Search';
import '../CSS/Shop.css';

const Inventory = () => {
  const [StockData, setStockData] = useState([]);
  const [search, setsearch] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await fetch('/Stockdata1', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      setStockData(data);
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
      // Handle the error
    }
  };

  const getstockData = async () => {
    try {
      const searchQuery = search;
      const encodedSearchQuery = encodeURIComponent(searchQuery);

      const res = await fetch(`/searchStockdata1?searchQuery=${encodedSearchQuery}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      setStockData(data);
    } catch (err) {
      console.error('Error occurred while searching data:', err);
      // Handle the error
    }
  };

  const total = StockData.reduce((acc, element) => {
    const elementTotal = element.totalcost.reduce((sum, cost) => sum + cost, 0);
    return acc + elementTotal;
  }, 0);

  const items = StockData.reduce((total, element) => {
    return total + element.remaining;
  }, 0);


  return (
    <div className="main">
      <Sidebar />
      <div className="pagedata">
        <div className="title">
          <h2>Inventory</h2>
        </div>
        <div class="ag-courses_box">

          <div class="ag-courses_item">
            <div class="ag-courses-item_link">
              <div class="ag-courses-item_bg"></div>

              <div class="ag-courses-item_title">
                <h1>Total Cost</h1>
              </div>

              <div class="ag-courses-item_date-box">
                <h2 class="ag-courses-item_date">
                  Rs.{total}
                </h2>
              </div>
            </div>
          </div>
          <div class="ag-courses_item">
            <div class="ag-courses-item_link">
              <div class="ag-courses-item_bg"></div>

              <div class="ag-courses-item_title">
                <h1>Total Items</h1>
              </div>

              <div class="ag-courses-item_date-box">
                <h2 class="ag-courses-item_date">
                  {items}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="content-container">
          <div className="content">
            <div className="active1">
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
                <button className="search_btn" onClick={getstockData}>
                  <SearchIcon />
                </button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Shop</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Brand</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Remaining</th>
                      <th>Cost</th>
                      <th>Price</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {StockData.map((element, index) => (
                      <tr key={index}>
                        <td>{element.id}</td>
                        <td>{element.Sname}</td>
                        <td>{element.category}</td>
                        <td>{element.type}</td>
                        <td>{element.Bname}</td>
                        <td>{element.name}</td>
                        <td>
                          {element.quantity.map((qty, qtyIndex) => (
                            <span key={qtyIndex}>{qty}<br /></span>
                          ))}
                        </td>
                        <td>{element.remaining}</td>
                        <td>
                          {element.purchasing.map((purchasing, purchasingIndex) => (
                            <span key={purchasingIndex}>{purchasing}<br /></span>
                          ))}
                        </td>
                        <td>{element.price}</td>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
