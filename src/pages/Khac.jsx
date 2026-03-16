import React from 'react';
import './Khac.css';
import { 
  ChevronRight,
  User,
  Hourglass,
  Package,
  ShoppingCart,
  AlertTriangle,
  ClipboardList,
  Store,
  RefreshCw,
  LayoutTemplate
} from 'lucide-react';

// Custom icons simulating the design
const EcoCoinIcon = () => (
  <div className="menu-icon-custom border-circle">
    <span className="font-bold">E</span>
  </div>
);

const EcoLogoSmall = () => (
  <div className="eco-brand-small">
    <div className="cube-mini"></div>
    <span className="eco-text font-bold text-blue">ECO</span>
  </div>
);

const Khac = () => {
  return (
    <div className="khac-page">
      {/* Header with background curves */}
      <div className="kh-header-bg">
        <div className="status-bar flex-between text-dark">
          {/* <span className="time text-bold">4:26</span>
          <div className="status-icons flex-center">
            <span className="icon-placeholder text-xs">📶 5G</span>
            <span className="icon-placeholder text-xs">🔋 100</span>
          </div> */}
        </div>

        <div className="kh-profile-info flex-between">
          <div className="profile-details">
            <h2 className="user-name">Trái cây nhập Tuyết Nhung</h2>
            <p className="user-phone">038 696 8950</p>
          </div>
          <div className="profile-avatar-large flex-center">
            <User size={32} color="#6B7280" />
          </div>
        </div>
      </div>

      <div className="kh-content-area">
        {/* Order tracking card */}
        <div className="order-tracking-card">
          <div className="tracking-steps flex-between">
            <div className="step-item relative-overlap">
              <Hourglass size={24} color="#374151" strokeWidth={1.5} />
              <span className="step-label">Chờ xác nhận</span>
            </div>
            <div className="step-item">
              <Package size={24} color="#374151" strokeWidth={1.5} />
              <span className="step-label">Đang chuẩn bị</span>
            </div>
            <div className="step-item">
              <ShoppingCart size={24} color="#374151" strokeWidth={1.5} />
              <span className="step-label">Đang giao</span>
            </div>
          </div>
          <div className="tracking-footer flex-between">
            <span className="footer-link">Quản lý đơn hàng</span>
            <ChevronRight size={18} color="#9CA3AF" />
          </div>
        </div>

        {/* Invalid Info Alert */}
        <div className="invalid-info-alert">
          <div className="alert-content flex-center">
            <ClipboardList size={24} color="#EF4444" className="alert-icon" />
            <p className="alert-text">
              Thông tin đăng ký tài khoản không hợp lệ. Vui lòng chỉnh sửa lại thông tin.
            </p>
          </div>
          <AlertTriangle size={48} color="rgba(239, 68, 68, 0.1)" className="watermark-icon" />
        </div>

        {/* Nguồn tiền */}
        <section className="funds-section">
          <h3 className="section-title">Nguồn tiền</h3>
          <div className="wallet-card flex-between align-end">
            <div className="wallet-left">
              <EcoLogoSmall />
              <p className="wallet-label mt-4">Số dư Ví ECO</p>
            </div>
            <div className="wallet-right flex-center">
              <span className="wallet-amount">0 đ</span>
              <div className="exclamation-circle flex-center bg-orange">
                <span className="exclamation-mark white">!</span>
              </div>
            </div>
          </div>
        </section>

        {/* Menu List */}
        <div className="settings-menu">
          
          <div className="menu-item flex-between">
            <div className="menu-left flex-center">
              <Store size={24} color="#374151" strokeWidth={1.5} className="menu-icon" />
              <span className="menu-label text-bold-menu">Kênh bán hàng</span>
            </div>
            <ChevronRight size={20} color="#9CA3AF" />
          </div>

          <div className="menu-item flex-between">
            <div className="menu-left flex-center">
              <EcoCoinIcon />
              <span className="menu-label text-bold-menu">EXu của tôi</span>
            </div>
            <ChevronRight size={20} color="#9CA3AF" />
          </div>

          <div className="menu-item flex-between">
            <div className="menu-left flex-center">
              <RefreshCw size={24} color="#374151" strokeWidth={1.5} className="menu-icon" />
              <span className="menu-label text-bold-menu">Chương trình Tích Luỹ</span>
            </div>
            <ChevronRight size={20} color="#9CA3AF" />
          </div>

          <div className="menu-item flex-between no-border">
            <div className="menu-left flex-center">
              <LayoutTemplate size={24} color="#374151" strokeWidth={1.5} className="menu-icon" />
              <div className="flex-center">
                 <span className="menu-label text-bold-menu">Chương trình trưng bày</span>
                 <span className="badge-new-small">Mới</span>
              </div>
            </div>
            <ChevronRight size={20} color="#9CA3AF" />
          </div>

        </div>

        {/* Bottom padding for scroll */}
        <div style={{height: '40px'}}></div>
      </div>
    </div>
  );
};

export default Khac;
