import { Search, ShoppingCart, Bell } from "lucide-react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-top">
        <div className="time-status">16:56 <img></img></div>
        <div className="network-status">
            <span>5G</span>
            <div className="battery">62</div>
        </div>
      </div>
      <div className="header-main">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input type="text" placeholder="Tìm kiếm sản phẩm" />
        </div>
        <div className="header-actions">
          <button className="action-button">
            <ShoppingCart size={20} />
          </button>
          <button className="action-button">
            <Bell size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
