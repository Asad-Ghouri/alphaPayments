import "../CSS/Sidebar.css";
import { AccountCircleRounded, AttachMoneyRounded, BarChartRounded, DashboardRounded } from '@mui/icons-material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import CategoryIcon from '@mui/icons-material/Category';
import logo from '../Images/IMG_3028.JPG'
import { NavLink } from "react-router-dom";


function App() {

  return (
    <div className="App">
      <div className="sidebar_container">
        {/* sidebar div */}
        <div className="sidebar">
          {/* profile */}
          <div className="profile">
          <NavLink to='/'>
            <img className="Logo"
              src={logo}
              alt="profile_img"
            />
            </NavLink>
          </div>
          {/* groups */}
          <div className="groups">
            {/* group 1 */}
            <div className="group">
              <NavLink to='/dashboard' className='nav-links'>
                <DashboardRounded className="icon" style={{ color: 'white' }} /> <span>Dashboard
                </span>            </NavLink>
              <NavLink to='/performance' className='nav-links'>
                <BarChartRounded className="icon" style={{ color: 'white' }} /> <span>Performance</span>
              </NavLink>
              <NavLink to='/inventory' className='nav-links'>
                <InventoryIcon className="icon" style={{ color: 'white' }} /> <span> Inventory </span>
              </NavLink>
              <NavLink to='/detailed-history' className='nav-links'>
                <HistoryIcon className="icon" style={{ color: 'white' }} /> <span>Detailed History</span>
              </NavLink>
            </div>
          </div>
          {/* group 2 */}
          <div className="group">
            <NavLink to='/sales' className='nav-links'>
              <AttachMoneyRounded className="icon" style={{ color: 'white' }} /><span>Sales</span>
            </NavLink>
            <NavLink to='/stock' className='nav-links'>
              <CategoryIcon className="icon" style={{ color: 'white' }} /> <span>Stocks</span>
            </NavLink>
            <NavLink to='/Customer' className='nav-links'>
              <AccountCircleRounded className="icon" style={{ color: 'white' }} /> <span>Customer</span>
            </NavLink>
            <NavLink to='/shop' className='nav-links'>
              <StorefrontIcon className="icon" style={{ color: 'white' }} /> <span>Shop</span>
            </NavLink>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;