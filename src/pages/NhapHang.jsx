import React from 'react';
import Header from '../components/Header';
import './NhapHang.css';

// Placeholder images mimicking the design
const CATEGORIES = [
  { id: 1, name: 'Bia & Nước các loại', icon: '🍺' },
  { id: 2, name: 'Sữa & Sản phẩm từ sữa', icon: '🥛' },
  { id: 3, name: 'Thực phẩm ăn liền', icon: '🍜' },
  { id: 4, name: 'Gia vị', icon: '🧂' },
];

const FILTERS = [
  { id: 1, name: 'Nhập hàng theo Nhà phân phối', color: '#ffb703' },
  { id: 2, name: 'Nhập hàng theo Thương hiệu', color: '#fb8500' },
  { id: 3, name: 'Combo sản phẩm ưu đãi', color: '#ffb703' },
];

const HOT_PRODUCTS = [
  { id: 1, name: 'Mì ly Hảo Hảo Handy Tôm...', origin: 'Thùng 24 ly', price: '193,000đ', img: '🍜' },
  { id: 2, name: 'Mì Hảo Hảo Tôm chua...', origin: 'Thùng 30 gói', price: '114,000đ', img: '🍜' },
  { id: 3, name: 'Mì SiuKay Hải sản 128g', origin: 'Thùng 24 gói', price: '261,000đ', img: '🍜' },
];

const SUGGESTIONS = [
  { id: 1, name: 'Bia Saigon Lager 330ml', origin: 'Thùng 24 lon', price: '320,000đ', img: '🍺', badge: 'GIÁ SỈ' },
  { id: 2, name: 'Bia Tiger bạc 330ml', origin: 'Thùng 24 lon', price: '380,000đ', img: '🐯' },
];

const NhapHang = () => {
  return (
    <div className="nhap-hang-page">
      <Header />
      {/* Top Banner Area (Under Header) */}
      <section className="top-categories-section">
        <div className="section-header">
          <h2 className="section-title white">NGÀNH HÀNG NỔI BẬT</h2>
          <a href="#" className="view-all white">
            Xem tất cả
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        </div>
        
        <div className="categories-grid scroll-x">
          {CATEGORIES.map(cat => (
             <div key={cat.id} className="category-item">
               <div className="category-icon-wrapper">
                 <span className="emoji-icon">{cat.icon}</span>
               </div>
               <span className="category-name">{cat.name}</span>
             </div>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="filter-pills scroll-x">
          {FILTERS.map(filter => (
            <div key={filter.id} className="filter-pill" style={{backgroundColor: filter.color}}>
              {filter.name}
            </div>
          ))}
        </div>
      </section>

      {/* Main Banner */}
      <section className="banner-section">
        <div className="promo-banner">
           <div className="banner-content">
             <h3>BỘ GIẢI PHÁP</h3>
             <p className="highlight">ECO Tiệm Số Hóa tích hợp POS</p>
             <p className="price">Chỉ từ <span>3.000đ</span>/NGÀY</p>
             <ul className="features">
               <li>✓ Phần mềm POS</li>
               <li>✓ Chữ ký số</li>
               <li>✓ Xuất hóa đơn</li>
             </ul>
             <button className="register-btn">ĐĂNG KÝ NGAY</button>
           </div>
        </div>
      </section>

      {/* Hot Products */}
      <section className="product-section">
        <div className="section-header">
          <h2 className="section-title">SẢN PHẨM HOT</h2>
          <a href="#" className="view-all">
            Xem tất cả
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        </div>
        
        <div className="product-list scroll-x">
           {HOT_PRODUCTS.map(product => (
             <div key={product.id} className="product-card">
               <div className="product-image-placeholder">{product.img}</div>
               <div className="product-info">
                 <h4 className="product-name line-clamp-2">{product.name}</h4>
                 <p className="product-origin">{product.origin}</p>
                 <p className="product-price">{product.price}</p>
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* Suggestions */}
      <section className="product-section">
        <div className="section-header">
          <h2 className="section-title">GỢI Ý CHO BẠN</h2>
          <a href="#" className="view-all">
            Xem tất cả
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        </div>
        
        <div className="product-list scroll-x">
           {SUGGESTIONS.map(product => (
             <div key={product.id} className="product-card">
               {product.badge && <div className="product-badge">{product.badge}</div>}
               <div className="product-image-placeholder">{product.img}</div>
               <div className="product-info">
                 <h4 className="product-name line-clamp-2">{product.name}</h4>
                 <p className="product-origin">{product.origin}</p>
                 {product.price && <p className="product-price">{product.price}</p>}
               </div>
             </div>
           ))}
        </div>
      </section>
      
      {/* Bottom Padding for scroll space */}
      <div style={{height: '20px'}}></div>
    </div>
  );
};

export default NhapHang;
