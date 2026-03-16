import React, { useState } from 'react';
import './BanHang.css';
import { 
  Bell, 
  Settings, 
  ChevronRight,
  FileText,
  Package,
  Receipt,
  UserPlus,
  History,
  Smartphone,
  Folder,
  ShoppingBag,
  Calendar,
  BarChart2,
  User,
  Calculator,
  Banknote
} from 'lucide-react';

const NGHIEP_VU_ITEMS = [
  { id: 1, name: 'Quản lý\nđơn hàng', icon: <FileText size={24} color="white" /> },
  { id: 2, name: 'Quản lý\nsản phẩm', icon: <Package size={24} color="white" /> },
  { id: 3, name: 'Quản lý\nhóa đơn\nđiện tử', icon: <Receipt size={24} color="white" /> },
  { id: 4, name: 'Mời khách\nhàng', icon: <UserPlus size={24} color="white" /> },
  { id: 5, name: 'Lịch sử\nchi trả', icon: <History size={24} color="white" /> },
  { id: 6, name: 'Xử lý\nđơn online', icon: <Smartphone size={24} color="white" /> },
  { id: 7, name: 'Gói\nphần mềm', icon: <Folder size={24} color="white" /> },
  { id: 8, name: 'Lịch sử\nmua hàng', icon: <ShoppingBag size={24} color="white" /> },
  { id: 9, name: 'Tờ khai\nthuế', icon: <Calendar size={24} color="white" /> },
  { id: 10, name: 'Quản lý\nthuế', icon: <Calculator size={24} color="white" /> },
  { id: 11, name: 'Quản lý\nkét', icon: <Banknote size={24} color="white" /> },
];

const BAO_CAO_ITEMS = [
  { id: 1, name: 'Báo cáo\nbán hàng', icon: <BarChart2 size={24} color="white" /> },
  { id: 2, name: 'Báo cáo\ntồn kho', icon: <BarChart2 size={24} color="white" /> },
];

const BanHang = () => {
  return (
    <div className="ban-hang-page">
      <div className="bh-header-bg">
        <div className="status-bar flex-between text-dark">
          {/* Status bar icons hidden as per design */}
        </div>

        <div className="bh-shop-info flex-between">
          <div className="shop-identity flex-center">
            <div className="shop-avatar"><User size={36} color="#3B82F6" strokeWidth={1.5} /></div>
            <div className="shop-details">
              <h2 className="shop-name">Trái cây nhập Tuyết Nhung</h2>
              <p className="shop-phone">038 696 8950</p>
            </div>
          </div>
          <div className="shop-actions flex-center">
            <button className="round-icon-btn"><Settings size={20} color="#6B7280" /></button>
            <button className="round-icon-btn"><Bell size={20} color="#6B7280" /></button>
          </div>
        </div>

        <div className="revenue-card">
          <div className="revenue-cols flex-between">
            <div className="rev-col">
              <p className="rev-label">Doanh thu hôm nay</p>
              <p className="rev-value">Chưa có đơn hàng</p>
            </div>
            <div className="rev-divider"></div>
            <div className="rev-col pl-4">
              <p className="rev-label">Đơn hàng trong ngày</p>
              <p className="rev-value">Chưa có đơn hàng</p>
            </div>
          </div>
          <div className="rev-footer flex-between">
            <span>Truy cập nhanh</span>
            <ChevronRight size={18} />
          </div>
        </div>
      </div>

      <div className="bh-content-area">
        <div className="bh-banners">
          <div className="trial-banner flex-between">
            <span>Bản dùng thử (Trial)</span>
            <div className="upgrade-link">
              <span className="trial-days">Còn 8 ngày</span>
              <span className="ml-2">Nâng cấp ngay</span>
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="pos-banner">
            <div className="new-badge">MỚI</div>
            <div className="pos-content">
              <div className="pos-text">
                <h3>Bán hàng tại quầy</h3>
                <p>Nền tảng quản lý bán hàng đa kênh chuyên nghiệp cho cửa hàng.</p>
                <button className="btn-create-order">TẠO ĐƠN NGAY</button>
              </div>
              <div className="pos-image-placeholder">
                <span className="pos-emoji">🏪</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section mt-6">
          <h3 className="section-title">Nghiệp vụ cửa hàng</h3>
          <div className="dashboard-grid">
            {NGHIEP_VU_ITEMS.map(item => (
              <div key={item.id} className="dash-item">
                <div className="dash-icon-container">
                  {item.icon}
                </div>
                <span className="dash-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section mt-6">
          <h3 className="section-title">Báo cáo</h3>
          <div className="dashboard-grid report-grid">
            {BAO_CAO_ITEMS.map(item => (
              <div key={item.id} className="dash-item">
                <div className="dash-icon-container">
                  {item.icon}
                </div>
                <span className="dash-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanHang;
