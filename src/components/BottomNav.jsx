import { Home, LayoutGrid, ScanLine, Monitor, MoreHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./BottomNav.css";

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/", label: "Nhập hàng", icon: Home },
    { path: "/dich-vu", label: "Dịch vụ", icon: LayoutGrid },
    { path: "/thanh-toan", label: "Thanh toán", icon: ScanLine },
    { path: "/ban-hang", label: "Bán hàng", icon: Monitor },
    { path: "/khac", label: "Khác", icon: MoreHorizontal }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? "active" : ""}`}
          >
            <Icon className="nav-icon" size={24} />
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
