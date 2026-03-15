import React from 'react';
import './DichVu.css';
import { 
  Grid, 
  ShoppingCart, 
  ChevronRight, 
  AlertCircle,
  Smartphone,
  Receipt,
  CreditCard,
  Gamepad2,
  Wifi,
  User
} from 'lucide-react';

const DV_ACTIONS = [
  { id: 1, name: 'Nạp tiền', icon: '↗️' },
  { id: 2, name: 'Chuyển tiền', icon: '🔁' },
  { id: 3, name: 'Rút tiền', icon: '↖️' },
  { id: 4, name: 'Liên kết NH', icon: '🏦' },
];

const VIEN_THONG_SERVICES = [
  { id: 1, name: 'Nạp tiền điện thoại', icon: <Smartphone className="service-icon text-blue" /> },
  { id: 2, name: 'Thanh toán trả sau', icon: <Receipt className="service-icon text-blue" /> },
  { id: 3, name: 'Mã thẻ cào điện thoại', icon: <CreditCard className="service-icon text-blue" /> },
  { id: 4, name: 'Mã thẻ Game', icon: <Gamepad2 className="service-icon text-red" /> },
  { id: 5, name: 'Mua mã thẻ 3G/4G', icon: <Wifi className="service-icon text-blue" /> },
  { id: 6, name: 'Nạp tiền tài khoản Game', icon: <User className="service-icon text-blue" /> },
];

const DichVu = () => {
  return (
    <div className="dich-vu-page">
      {/* Custom Header for Dich Vu */}
      <div className="dv-header">
        <div className="status-bar flex-between white-text">
          <span className="time text-bold">16:56</span>
          <div className="status-icons flex-center">
            <span className="icon-placeholder text-xs">📶 5G</span>
            <span className="icon-placeholder text-xs">🔋 60</span>
          </div>
        </div>

        <div className="dv-user-info flex-between">
          <div className="user-profile flex-center">
            <div className="user-avatar">
              <span className="avatar-icon">E</span>
            </div>
            <div className="user-details">
              <h3 className="user-name">GreenLow</h3>
              <div className="user-exu flex-center">
                <span className="exu-icon">E</span>
                <span className="exu-balance">0 EXu</span>
              </div>
            </div>
          </div>
          <div className="header-actions flex-center">
            <button className="icon-btn"><Grid size={24} color="white" /></button>
            <button className="icon-btn"><ShoppingCart size={24} color="white" /></button>
          </div>
        </div>

        <div className="dv-quick-actions flex-between">
          {DV_ACTIONS.map(action => (
            <div key={action.id} className="quick-action-item">
              <div className="action-icon-wrapper">
                {action.icon}
              </div>
              <span className="action-name">{action.name}</span>
            </div>
          ))}
        </div>

        {/* Overlapping Card */}
        <div className="dv-balance-card flex-between">
          <div className="balance-left flex-center">
            <div className="eco-logo-small">
              <div className="cube-icon"></div>
            </div>
            <span className="balance-label">Số dư ECO</span>
          </div>
          <div className="balance-right flex-center">
            <span className="balance-amount">0 đ</span>
            <AlertCircle size={16} color="#F97316" className="alert-icon" />
            <ChevronRight size={20} color="#9CA3AF" />
          </div>
        </div>
      </div>
      
      {/* Identity verification notice */}
      <div className="identity-notice flex-between">
        <div className="notice-left flex-center">
          <span className="shield-icon">🛡️</span>
          <span className="notice-text">Định danh người dùng theo quy định.</span>
        </div>
        <ChevronRight size={16} color="#6B7280" />
      </div>

      {/* Main Content Area */}
      <div className="dv-content">
        {/* Banner */}
        <div className="dv-banner">
          <div className="banner-text">
            <h2>DÙNG EXU</h2>
            <h2>ĐỔI VOUCHER</h2>
            <p>MAY TÚI BA GANG</p>
            <p>MANG THEO MÀ ĐỰNG</p>
            <button className="btn-doi-ngay">ĐỔI NGAY</button>
          </div>
        </div>

        {/* Services Section */}
        <div className="services-section">
          <h3 className="section-title">Dịch vụ viễn thông</h3>
          <div className="services-grid">
            {VIEN_THONG_SERVICES.map(service => (
              <div key={service.id} className="service-item">
                <div className="service-icon-container">
                  {service.icon}
                </div>
                <span className="service-name">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DichVu;
