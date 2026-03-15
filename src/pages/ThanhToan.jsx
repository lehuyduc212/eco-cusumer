import React from 'react';
import './ThanhToan.css';
import { 
  Grid, 
  ShoppingCart, 
  ChevronRight, 
  AlertCircle,
  Zap,
  Droplet,
  Tv,
  GraduationCap,
  Wifi,
  CreditCard,
  PhoneCall
} from 'lucide-react';

const DV_ACTIONS = [
  { id: 1, name: 'Nạp tiền', icon: '↗️' },
  { id: 2, name: 'Chuyển tiền', icon: '🔁' },
  { id: 3, name: 'Rút tiền', icon: '↖️' },
  { id: 4, name: 'Liên kết NH', icon: '🏦' },
];

const HOA_DON_SERVICES = [
  { id: 1, name: 'Hóa đơn tiền điện', icon: <Zap className="service-icon text-blue" /> },
  { id: 2, name: 'Hóa đơn tiền nước', icon: <Droplet className="service-icon text-blue" /> },
  { id: 3, name: 'Hóa đơn truyền hình', icon: <Tv className="service-icon text-blue" /> },
  { id: 4, name: 'Thanh Toán Học Phí', icon: <GraduationCap className="service-icon text-blue" /> },
  { id: 5, name: 'Hóa đơn Internet', icon: <Wifi className="service-icon text-blue" /> },
  { id: 6, name: 'Thanh toán thẻ tín dụng', icon: <CreditCard className="service-icon text-blue" /> },
  { id: 7, name: 'Thanh toán điện thoại cố định', icon: <PhoneCall className="service-icon text-blue" /> },
];

const THU_HO_SERVICES = [
  { id: 1, name: 'FE Credit', icon: <div className="partner-logo text-green text-bold">FE CREDIT</div> },
  { id: 2, name: 'Home Credit', icon: <div className="partner-logo text-red text-bold">HOME CREDIT</div> },
  { id: 3, name: 'Shinhan Finance', icon: <div className="partner-logo text-blue text-bold">Shinhan</div> },
];

const ThanhToan = () => {
  return (
    <div className="thanh-toan-page">
      {/* Same Header as Dich Vu */}
      <div className="tt-header">
        <div className="status-bar flex-between white-text">
          <span className="time text-bold">16:56</span>
          <div className="status-icons flex-center">
            <span className="icon-placeholder text-xs">📶 5G</span>
            <span className="icon-placeholder text-xs">🔋 60</span>
          </div>
        </div>

        <div className="tt-user-info flex-between">
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

        <div className="tt-quick-actions flex-between">
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
        <div className="tt-balance-card flex-between">
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
      
      {/* Main Content Area */}
      <div className="tt-content">
        {/* Hóa đơn section */}
        <div className="services-section">
          <h3 className="section-title">Thanh toán hoá đơn</h3>
          <div className="services-grid">
            {HOA_DON_SERVICES.map(service => (
              <div key={service.id} className="service-item">
                <div className="service-icon-container">
                  {service.icon}
                </div>
                <span className="service-name">{service.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Thu hộ section */}
        <div className="services-section mt-4">
          <h3 className="section-title">Thu hộ tài chính</h3>
          <div className="services-grid">
            {THU_HO_SERVICES.map(service => (
              <div key={service.id} className="service-item flex-center-col">
                <div className="thu-ho-icon-container">
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

export default ThanhToan;
