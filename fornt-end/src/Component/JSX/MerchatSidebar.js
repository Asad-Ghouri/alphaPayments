import "../CSS/Sidebar.css";
import { AccountCircleRounded, AttachMoneyRounded, BarChartRounded, DashboardRounded } from '@mui/icons-material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import CategoryIcon from '@mui/icons-material/Category';
import logo from '../Images/IMG_3028.JPG'
import { NavLink } from "react-router-dom";


function MerchatSidebar() {

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
              <NavLink to='/MerchatDashboard' className='nav-links'>
                <DashboardRounded className="icon" style={{ color: 'white' }} /> <span>Dashboard
                </span>            </NavLink>
              <NavLink to='/GetApikey' className='nav-links'>
                <BarChartRounded className="icon" style={{ color: 'white' }} /> <span>Api Key</span>
              </NavLink>
              <NavLink to='/PaymentLinkGenerator' className='nav-links'>
                <InventoryIcon className="icon" style={{ color: 'white' }} /> <span> Payment Link </span>
              </NavLink>
              <NavLink to='/DonationLink' className='nav-links'>
                <HistoryIcon className="icon" style={{ color: 'white' }} /> <span>Donation Link</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default MerchatSidebar;