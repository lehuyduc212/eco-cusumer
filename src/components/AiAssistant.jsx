import React, { useState, useRef, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './AiAssistant.css';
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
  MessageSquare,
  Calendar,
  BarChart2,
  User,
  Mic,
  Send,
  Sparkles,
  ShoppingCart,
  FileCheck,
  CheckCircle2,
  Loader2,
  X,
  CreditCard,
  Printer,
  XCircle,
  Plus,
  AlertTriangle,
  Truck,
  Database,
  Keyboard,
  Calculator,
  Banknote,
  Library,
  ShieldCheck,
  CheckSquare,
  ArrowRight,
  Hash,
  Minus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Info,
  Clock,
  Zap,
  Target,
  ChevronLeft,
  BarChart3,
  FileBarChart,
  Gift,
  RotateCcw,
  Percent,
  Layout,
  AlertCircle,
  FileSearch,
  FileSearch as FileSearchIcon,
  Search,
  Check
} from 'lucide-react';

import { MOCK_DB, INPUT_INVOICES, SALES_HISTORY_AGGREGATE, TAX_RATES } from '../data/mockData';

// AI States
export const AI_STATE = {
  IDLE: 'IDLE',
  LISTENING: 'LISTENING',
  PROCESSING: 'PROCESSING',
  DONE: 'DONE',
  SUCCESS: 'SUCCESS',
  STOCK_ENTRY: 'STOCK_ENTRY',
  STOCK_TRANSFER: 'STOCK_TRANSFER',
  REPORTING: 'REPORTING'
};

const AiAssistant = () => {
  const [aiState, setAiState] = useState(AI_STATE.IDLE);
  const [isExpanded, setIsExpanded] = useState(false);
  const [processSteps, setProcessSteps] = useState([]);
  const [activeCart, setActiveCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [oosProduct, setOosProduct] = useState(null);
  const [oosQueue, setOosQueue] = useState([]);
  const [pendingOrder, setPendingOrder] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showNudge, setShowNudge] = useState(true);
  const [showReportNudge, setShowReportNudge] = useState(true);
  const [popupHeight, setPopupHeight] = useState(550);
  const [isMini, setIsMini] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingCart, setIsEditingCart] = useState(false);
  const [selectedAlt, setSelectedAlt] = useState(null);
  const [lastActionType, setLastActionType] = useState('NONE');

  // Stock Transfer States
  const [transferProduct, setTransferProduct] = useState(null);
  const [transferQty, setTransferQty] = useState(0);
  const [sourceBranch, setSourceBranch] = useState("Chi nhánh 1");
  const [targetBranch, setTargetBranch] = useState("Chi nhánh 2");

  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const chatEndRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Background scroll lock
  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add('ai-expanded');
    } else {
      document.body.classList.remove('ai-expanded');
    }
  }, [isExpanded]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [processSteps, aiState]);

  // Vertical Resize
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    dragStartHeight.current = popupHeight;
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleDragMove = (e) => {
      if (!isDragging) return;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - dragStartY.current;
      const newHeight = Math.max(160, Math.min(window.innerHeight - 100, dragStartHeight.current - deltaY));
      setPopupHeight(newHeight);
      setIsMini(newHeight < 220);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      document.body.style.userSelect = 'auto';
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  // Auto-trigger processing
  const [silenceTimer, setSilenceTimer] = useState(null);
  useEffect(() => {
    if (listening && transcript) {
      if (silenceTimer) clearTimeout(silenceTimer);
      const timer = setTimeout(() => {
        if (aiState === AI_STATE.LISTENING) {
          handleAction();
        }
      }, 2000); // Tăng tốc độ phản hồi: đợi 2s sau khi ngừng nói
      setSilenceTimer(timer);
    }
    return () => {
      if (silenceTimer) clearTimeout(silenceTimer);
    };
  }, [transcript, listening]);

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const addStep = (content, status = 'loading', type = 'text') => {
    setProcessSteps(prev => [...prev.filter(p => p.status === 'done' || p.status === 'result'), { content, status, type }]);
  };

  const updateLastStep = (status) => {
    setProcessSteps(prev => {
      const newArr = [...prev];
      if (newArr.length > 0) newArr[newArr.length - 1].status = status;
      return newArr;
    });
  };

  const parseVietnameseQuantity = (text) => {
    const lower = text.toLowerCase();
    const unitMatch = lower.match(/([\d.,]+)\s*(kg|cân|g|l|hộp|quả|trứng|chai|vỉ|thùng|két)/i);
    if (unitMatch) {
       return parseFloat(unitMatch[1].replace(',', '.'));
    }
    const digitMatch = lower.match(/[\d.,]+/);
    if (digitMatch && digitMatch[0].length > 0) {
       const val = digitMatch[0].replace(',', '.');
       const parsed = parseFloat(val);
       if (!isNaN(parsed)) return parsed;
    }
    const wordMap = {
      'không': 0, 'một': 1, 'hai': 2, 'ba': 3, 'bốn': 4, 'năm': 5, 
      'sáu': 6, 'bảy': 7, 'tám': 8, 'chín': 9, 'mười': 10,
      'chục': 10, 'tá': 12, 'nửa': 0.5
    };
    for (const [word, val] of Object.entries(wordMap)) {
      const regex = new RegExp(`(^|\\s)${word}(\\s|$)`, 'i');
      if (regex.test(lower)) return val;
    }
    return null;
  };

  const finalizeOrderFlow = async (items) => {
    try {
      addStep("Đang cập nhật giỏ hàng session...");
      await delay(800);
      updateLastStep('done');

      const newCart = [...activeCart];
      items.forEach(newItem => {
        const existingItem = newCart.find(item => item.id === newItem.id);
        const qtyToAdd = newItem.detectedQty || 1;
        if (existingItem) {
          existingItem.quantity = (existingItem.quantity || 1) + qtyToAdd;
        } else {
          newCart.push({ ...newItem, quantity: qtyToAdd });
        }
      });
      
      setActiveCart(newCart);
      setCartCount(newCart.reduce((sum, i) => sum + (i.quantity || 1), 0));

      const logEntry = {
        timestamp: new Date().toLocaleTimeString(),
        action: "Thêm sản phẩm",
        details: items.map(i => `${i.detectedQty || 1} ${i.name}`).join(", ")
      };
      setSessionHistory(prev => [...prev, logEntry]);

      // Proactive Optimization Check
      const comboInOrder = items.find(i => i.comboItems);
      if (comboInOrder) {
        addStep(
          <div className="tax-optimization-card premium-glass fade-in">
             <div className="opt-header"><Sparkles size={16} className="text-amber-500" /><span>Gợi ý Tối ưu Thuế</span></div>
             <div className="opt-content mt-2">
                <p>Phát hiện <b>{comboInOrder.name}</b> có thể tách dòng để giảm thuế xuống <b>1.5%</b>.</p>
             </div>
             <button className="opt-apply-btn mt-4" onClick={() => handleOptimizeTax(comboInOrder.id)}>
                <CheckCircle2 size={14} /> Tối ưu ngay
             </button>
          </div>, 'result'
        );
      }

      const totalAmount = newCart.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
      const retailItems = newCart.filter(i => i.taxCategory === 'RETAIL');
      const serviceItems = newCart.filter(i => i.taxCategory === 'SERVICE');

      addStep(
        <div className="receipt-card">
          <div className="rc-header"><FileText size={16} /> Hoá đơn phiên làm việc</div>
          <div className="rc-body">
             {retailItems.length > 0 && (
                <div className="rc-tax-group">
                  <div className="group-header retail">HÀNG HÓA (Thuế lẻ 1.5%)</div>
                  {retailItems.map((item, idx) => (
                    <div className="rc-line-group" key={`retail-${idx}`}>
                      <div className="rc-line">
                        <span>{item.name} <strong>x{item.quantity || 1}</strong></span>
                        <span>{(item.price * (item.quantity || 1)).toLocaleString()}₫</span>
                      </div>
                    </div>
                  ))}
                </div>
             )}
             {serviceItems.length > 0 && (
                <div className="rc-tax-group mt-3">
                  <div className="group-header service">DỊCH VỤ (Thuế 7.5%)</div>
                  {serviceItems.map((item, idx) => (
                    <div className="rc-line-group" key={`service-${idx}`}>
                      <div className="rc-line">
                        <span>{item.name} <strong>x{item.quantity || 1}</strong></span>
                        <span>{(item.price * (item.quantity || 1)).toLocaleString()}₫</span>
                      </div>
                    </div>
                  ))}
                </div>
             )}
             <div className="rc-divider mt-4"></div>
             <div className="rc-total">
                <span>Tổng cộng</span>
                <span className="total-val">{totalAmount.toLocaleString()}₫</span>
             </div>
              <div className="rc-actions mt-4 flex gap-2">
                 <button className="rc-btn-secondary" onClick={() => resetSession()}>Hủy đơn</button>
                 <button className="rc-btn-primary" onClick={() => handleCheckoutIntent(newCart)}>Thanh toán</button>
              </div>
           </div>
        </div>, 'result', 'dashboard'
      );
      
      setLastActionType('SALE_SUCCESS');
      setAiState(AI_STATE.DONE);
    } catch (error) {
      console.error(error);
      setAiState(AI_STATE.DONE);
    }
  };

  // --- Intent Handlers (Extracted from BanHang.jsx) ---
  const resetSession = () => {
    setActiveCart([]);
    setCartCount(0);
    setPendingOrder([]);
    setTransferProduct(null);
    setLastActionType('NONE');
    setProcessSteps([]);
  };

  const handleCheckoutIntent = async (currentCart = activeCart) => {
    setAiState(AI_STATE.PROCESSING);
    addStep("Đang chốt đơn và lên hoá đơn...");
    await delay(1200);
    updateLastStep('done');
    const totalAmount = currentCart.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
    addStep(
      <div className="success-card">
         <div className="sc-icon"><CheckCircle2 size={32} color="#10B981" /></div>
         <h4 className="sc-title">Chốt đơn thành công!</h4>
         <p className="sc-desc">Hoá đơn đã được lưu vào hệ thống.</p>
         <div className="sc-amount">Tổng thu: {totalAmount.toLocaleString()}₫</div>
      </div>, 'result', 'success'
    );
    setAiState(AI_STATE.SUCCESS);
    await delay(1000);
    handleLedgerFlow();
  };

  const handleLedgerFlow = async () => {
    addStep("Đang tự động ghi sổ kế toán (Theo Thông tư 88)...");
    await delay(1500);
    updateLastStep('done');
    addStep(
      <div className="ledger-compliance-card fade-in">
        <div className="ledger-header"><ShieldCheck size={18} color="#10B981" /><span>Ghi sổ hoàn tất</span></div>
        <div className="ledger-body">
           <div className="ledger-row"><span>Mã:</span><span className="font-mono">NK156093</span></div>
           <div className="ledger-row"><span>Thuế GTGT:</span><span>8%</span></div>
        </div>
         <div className="ledger-footer mt-4">
            <button className="finish-session-btn" onClick={() => startNewSession()}>
               Hoàn tất phiên & Sang đơn mới <RotateCcw size={14} />
            </button>
         </div>
      </div>, 'result', 'ledger'
    );
  };

  const handleQRIntent = async () => {
    setAiState(AI_STATE.PROCESSING);
    addStep("Đang tạo mã QR thanh toán động...");
    await delay(1000);
    updateLastStep('done');
    addStep(
      <div className="qr-card fade-in">
         <div className="qr-header">Quét mã VietQR</div>
         <div className="qr-container">
            <img src="https://img.vietqr.io/image/vcb-1023456789-compact2.jpg?amount=75000" alt="QR" className="qr-real-image" />
         </div>
         <div className="qr-footer">Vietcombank - THE FRESH GARDEN</div>
      </div>, 'result', 'qr'
    );
    setAiState(AI_STATE.SUCCESS);
    handleLedgerFlow();
  };

  const handleQuickStockEntry = async () => {
    setAiState(AI_STATE.PROCESSING);
    addStep(`Đang chuẩn bị hệ thống nhập tồn nhanh...`);
    await delay(800);
    updateLastStep('done');
    
    const recommendations = MOCK_DB.filter(i => i.stock < 15).slice(0, 3);
    
    if (oosProduct) {
      addStep(
        <div className="agent-question premium-restock-card fade-in">
          <div className="pr-badge">YÊU CẦU NHẬP KHO</div>
          <p className="pr-title">Sẵn sàng nhập <strong>{oosProduct}</strong></p>
          <p className="pr-subtitle">Gợi ý nhập <strong>100 đơn vị</strong>.</p>
        </div>, 'result', 'question'
      );
    } else {
      addStep(
        <div className="stock-entry-flow-v2 fade-in">
          <div className="agent-question mb-4">
             <p className="font-bold text-slate-800">Anh/Chị muốn nhập kho sản phẩm nào ạ?</p>
          </div>
          <div className="stock-suggestions-grid">
            {recommendations.map(item => (
              <div key={item.id} className="stock-suggest-item-premium" onClick={() => { setOosProduct(item.name); handleQuickStockEntry(); }}>
                <span className="name">{item.emoji} {item.name}</span>
                <span className="stock-val">Tồn: {item.stock}</span>
              </div>
            ))}
          </div>
        </div>, 'result', 'restock_form'
      );
    }
    setAiState(AI_STATE.STOCK_ENTRY);
  };

  const handleStockConfirm = async (qty, forcedProductName = null) => {
    setAiState(AI_STATE.PROCESSING);
    const productName = forcedProductName || oosProduct || "Sản phẩm";
    addStep(`Đang ghi nhận nhập thêm ${qty} ${productName}...`);
    await delay(1200);
    updateLastStep('done');
    addStep(
      <div className="success-card stock-success">
         <div className="sc-icon"><Database size={32} color="#8B5CF6" /></div>
         <h4 className="sc-title">Đã cập nhật tồn kho!</h4>
         <p className="sc-desc">Sản phẩm <strong>{productName}</strong> hiện có tồn: <strong>{qty}</strong></p>
      </div>, 'result', 'success'
    );
    
    const remainingQueue = [...oosQueue];
    if (remainingQueue.length > 0) {
      const nextProduct = remainingQueue.shift();
      setOosQueue(remainingQueue);
      setOosProduct(nextProduct.name);
      addStep(`Đã xong ${productName}. Đang xử lý sản phẩm tiếp theo...`, 'done');
      await delay(800);
      return handleQuickStockEntry();
    } else {
      setAiState(AI_STATE.DONE);
      setOosProduct(null);
      if (pendingOrder.length > 0) {
        addStep("Tất cả sản phẩm đã sẵn sàng. Đang quay lại đơn hàng...", 'done');
        await delay(1000);
        return finalizeOrderFlow(pendingOrder);
      }
    }
  };

  const handleInventoryReport = async () => {
    setAiState(AI_STATE.PROCESSING);
    addStep("Đang trích xuất dữ liệu tồn kho đa kênh...");
    await delay(1500);
    updateLastStep('done');
    const lowStock = MOCK_DB.filter(i => i.stock < 15);
    const overStock = MOCK_DB.filter(i => i.stock > 100);
    
    addStep(
      <div className="inventory-report-elite fade-in">
        <div className="ir-header">
           <div className="ir-icon"><BarChart2 size={18} /></div>
           <div className="ir-title">
              <h4>Báo cáo Tồn kho Thông minh</h4>
              <span>Cập nhật lúc {new Date().toLocaleTimeString()}</span>
           </div>
        </div>
        
        <div className="ir-section mt-4">
          <div className="ir-section-heading alert-red"><AlertTriangle size={14}/> Sắp hết hàng (Cần nhập gấp)</div>
          <div className="ir-grid mt-2">
             {lowStock.map(i => (
                <div key={'low-'+i.id} className="ir-card critical">
                   <div className="irc-name">{i.emoji} {i.name}</div>
                   <div className="irc-stock">{i.stock} {i.unit}</div>
                </div>
             ))}
          </div>
        </div>

        <div className="ir-section mt-4">
          <div className="ir-section-heading alert-blue"><Info size={14}/> Tồn kho cao (Gợi ý đẩy bán)</div>
          <div className="ir-grid mt-2">
             {overStock.slice(0,3).map(i => (
                <div key={'over-'+i.id} className="ir-card warning">
                   <div className="irc-name">{i.emoji} {i.name}</div>
                   <div className="irc-stock">{i.stock} {i.unit}</div>
                </div>
             ))}
          </div>
        </div>
        
        <div className="ir-actions mt-4">
           <button className="rc-btn-primary w-full" onClick={() => handleReconciliationDashboard()}>Kiểm kê & Đối soát</button>
        </div>
      </div>, 'result', 'dashboard'
    );
    setLastActionType('INVENTORY_REPORT');
    setAiState(AI_STATE.DONE);
  };

  const handleSessionHistory = async () => {
    setAiState(AI_STATE.PROCESSING);
    addStep("Đang tải nhật ký lịch sử bán hàng...");
    await delay(1200);
    updateLastStep('done');
    
    addStep(
      <div className="history-hub-elite fade-in">
         <div className="hh-header">
            <History size={18} className="text-blue-500" />
            <h4>Lịch sử Phiên làm việc</h4>
         </div>
         {sessionHistory.length === 0 ? (
            <div className="hh-empty">
               <div className="cloud-icon"><CloudOff size={32}/></div>
               <p>Chưa có giao dịch nào trong phiên này.</p>
            </div>
         ) : (
            <div className="hh-timeline">
               {sessionHistory.map((log, index) => (
                  <div className="hh-item" key={'hist-'+index}>
                     <div className="hh-time">{log.timestamp}</div>
                     <div className="hh-dot"></div>
                     <div className="hh-content">
                        <strong>{log.action}</strong>
                        <p>{log.details}</p>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>, 'result', 'dashboard'
    );
    setAiState(AI_STATE.DONE);
  };

  const startNewSession = () => {
    resetSession();
    setAiState(AI_STATE.DONE);
    setProcessSteps([]);
  };

  const handlePrintStrategicLabels = async (productName) => {
    setAiState(AI_STATE.PROCESSING);
    addStep(`Đang kết nối máy in Bluetooth "ECO-PRINTER"...`);
    await delay(1000);
    updateLastStep('done');
    addStep(
      <div className="label-preview-box fade-in">
        <Printer size={20} className="text-yellow-600 mb-2" />
        <small className="text-yellow-700 font-bold uppercase">Bản xem trước Tem Xả kho</small>
        <div className="label-mockup mt-2">
          <b>{productName}</b>
          <div className="mock-old-price">Giá cũ: 15.000đ</div>
          <div className="mock-price">12.750đ</div>
          <small>Hạn dùng: 30/03/2026</small>
        </div>
        <div className="printing-status-bar"><div className="status-progress-bar"></div></div>
        <p className="text-xs text-slate-500 mt-2">Đang in 150 tem...</p>
      </div>, 'result', 'dashboard'
    );
    await delay(2500);
    setAiState(AI_STATE.DONE);
  };

  const handleProformaInvoice = async (productName) => {
    setAiState(AI_STATE.PROCESSING);
    addStep(`Đang trích xuất dữ liệu tồn kho & giá trị pro-forma...`);
    await delay(1200);
    updateLastStep('done');
    addStep(
      <div className="proforma-invoice fade-in">
        <div className="invoice-stub-header"><b>PHIẾU TẠM TÍNH XẢ KHO</b><br/><small>Dự toán Giải phóng vốn</small></div>
        <div className="invoice-body">
           <div className="invoice-item-line"><span>{productName} x 150</span><span>1.912.500</span></div>
           <div className="invoice-item-line"><span>Thuế (1.5%)</span><span>28.687</span></div>
           <div className="invoice-total-line"><span>TỔNG THU DỰ KIẾN</span><span>1.941.187đ</span></div>
        </div>
        <p className="mt-4 text-[10px] text-slate-400 italic text-center">* Phiếu dùng cho báo cáo nội bộ</p>
      </div>, 'result', 'dashboard'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleClearanceStrategy = async (productName, stockCount) => {
    setAiState(AI_STATE.PROCESSING);
    addStep(`Đang phân tích dữ liệu tồn kho cho ${productName}...`);
    await delay(1000);
    updateLastStep('done');
    addStep(
      <div className="strategic-consultant-card fade-in">
        <div className="consultant-glow"></div>
        <div className="consultant-badge"><Zap size={12} /> Chiến lược Xả kho</div>
        <h4>Giải phóng vốn cho <b>{productName}</b></h4>
        <div className="strategy-advice">
          <p>Dữ liệu cho thấy tồn kho <b>{stockCount} đơn vị</b> đang chiếm dụng 12% dòng vốn lưu động.</p>
        </div>
        <div className="strategy-actions">
          <button className="strategy-btn primary" onClick={() => handleApplyStrategicDiscount(productName, 15)}><Percent size={16} /> Áp dụng Giảm giá 15%</button>
          <button className="strategy-btn secondary" onClick={() => handlePrintStrategicLabels(productName)}><Printer size={16} /> In tem "Xả kho"</button>
          <button className="strategy-btn secondary" onClick={() => handleProformaInvoice(productName)}><FileText size={16} /> In Tạm tính</button>
          <button className="strategy-btn secondary" onClick={() => setAiState(AI_STATE.DONE)}><X size={16} /> Để sau</button>
        </div>
      </div>, 'result', 'consultant'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleUpsellStrategy = async (productName, context) => {
    setAiState(AI_STATE.PROCESSING);
    addStep(`Đang nghiên cứu xu hướng thị trường cho ${productName}...`);
    await delay(1000);
    updateLastStep('done');
    addStep(
      <div className="strategic-consultant-card fade-in">
        <div className="consultant-glow"></div>
        <div className="consultant-badge"><TrendingUp size={12} /> Tăng trưởng doanh thu</div>
        <h4>Đẩy mạnh bán lẻ <b>{productName}</b></h4>
        <div className="strategy-advice">
          <p>Sản phẩm này {context}. Em gợi ý Anh/Chị trưng bày ngay tại quầy thanh toán.</p>
        </div>
        <div className="strategy-actions">
          <button className="strategy-btn primary" onClick={() => handleCreateComboStrategy(productName)}><Gift size={16} /> Tạo Combo Quà tặng</button>
          <button className="strategy-btn secondary" onClick={() => setAiState(AI_STATE.DONE)}><Layout size={16} /> Đánh dấu Vị trí</button>
          <button className="strategy-btn secondary" onClick={() => setAiState(AI_STATE.DONE)}>Bỏ qua</button>
        </div>
      </div>, 'result', 'consultant'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleApplyStrategicDiscount = async (productName, discount) => {
    setAiState(AI_STATE.PROCESSING);
    addStep(`Đang kích hoạt khuyến mãi ${discount}% cho ${productName}...`);
    await delay(1200);
    updateLastStep('done');
    addStep(
      <div className="tax-optimization-success premium-glass fade-in">
         <CheckCircle2 size={24} className="text-green-500" />
         <h4>Đã kích hoạt khuyến mãi!</h4>
      </div>, 'result', 'dashboard'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleCreateComboStrategy = async (productName) => {
    setAiState(AI_STATE.PROCESSING);
    addStep(`Đang tạo Combo Chiến lược...`);
    await delay(1000);
    updateLastStep('done');
    addStep(
      <div className="tax-optimization-success premium-glass fade-in">
         <Sparkles size={24} className="text-blue-500" />
         <h4>Đã tạo Combo Chiến lược!</h4>
      </div>, 'result', 'dashboard'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleProductCostAudit = async (productId, filterMonth = null) => {
    setAiState(AI_STATE.PROCESSING);
    const product = MOCK_DB.find(p => p.id === productId);
    addStep(`Đang trích lục hồ sơ nhập hàng cho ${product?.name}...`);
    await delay(1000);
    updateLastStep('done');
    let invoices = INPUT_INVOICES.filter(inv => inv.productId === productId);
    if (filterMonth) {
      invoices = invoices.filter(inv => {
        const invMonth = new Date(inv.date).getMonth() + 1;
        return invMonth === parseInt(filterMonth);
      });
    }
    const avgPrice = invoices.reduce((acc, inv) => acc + inv.price, 0) / (invoices.length || 1);
    const totalInput = invoices.reduce((acc, inv) => acc + inv.qty, 0);
    addStep(
      <div className="accounting-audit-card elite-glass fade-in">
        <div className="audit-header-main"><h3>HỒ SƠ GIÁ NHẬP & TỒN KHO</h3><span>{product?.name}</span></div>
        <div className="audit-stats-row">
           <div className="audit-stat-box primary">
              <label>Giá nhập TB</label>
              <div className="audit-value">{Math.round(avgPrice).toLocaleString()}₫</div>
           </div>
           <div className="audit-stat-box">
              <label>Tổng nhập</label>
              <div className="audit-value">{totalInput} {product?.unit}</div>
           </div>
        </div>
        <div className="audit-actions-elite mt-4">
            <button className='elite-btn-outline' onClick={() => handleReconciliationDashboard(productId)}><BarChart3 size={14} /> Đối soát</button>
            <button className='elite-btn-primary'><Target size={14} /> Tối ưu</button>
         </div>
      </div>, 'result', 'dashboard'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleReconciliationDashboard = async (productId = null) => {
    setAiState(AI_STATE.PROCESSING);
    addStep('Đang đối soát số liệu đa kênh...');
    await delay(1200);
    updateLastStep('done');
    const productsToRecon = productId ? MOCK_DB.filter(p => p.id === productId) : MOCK_DB.slice(0, 5);
    
    // Calculate summary
    let alertCount = 0;
    let safeCount = 0;
    
    const processedData = productsToRecon.map(p => {
       const sales = SALES_HISTORY_AGGREGATE.find(s => s.productId === p.id);
       const inputs = INPUT_INVOICES.filter(i => i.productId === p.id);
       const totalIn = inputs.reduce((a, b) => a + b.qty, 0);
       const totalOut = sales?.totalSold || 0;
       const diff = totalIn - totalOut;
       const isAlert = diff < 0;
       if (isAlert) alertCount++;
       else safeCount++;
       return { ...p, totalIn, totalOut, diff, isAlert };
    });

    addStep(
      <div className='reconciliation-hub-elite fade-in'>
         <div className="recon-hub-header">
            <div className="icon-wrap"><ShieldCheck size={20} className='text-emerald-500' /></div>
            <div className="title-wrap">
               <h4>Đối soát Kho Thông minh</h4>
               <span>Phát hiện {alertCount} rủi ro / {safeCount} an toàn</span>
            </div>
         </div>
         
         <div className='recon-body mt-4'>
            {processedData.map((data, idx) => (
               <div className={`recon-pro-card ${data.isAlert ? 'critical' : 'safe'}`} key={'recon-pro-' + data.id + idx}>
                  <div className='rpc-header'>
                     <span className='rpc-name'>{data.emoji} {data.name}</span>
                     {data.isAlert ? <span className='rpc-badge red'>Thiếu hụt</span> : <span className='rpc-badge green'>Khớp</span>}
                  </div>
                  
                  <div className="rpc-stats-grid">
                     <div className="rpc-stat-box">
                        <small>Tổng Nhập</small>
                        <strong>{data.totalIn.toLocaleString()}</strong>
                     </div>
                     <div className="rpc-stat-box">
                        <small>Đã Bán</small>
                        <strong>{data.totalOut.toLocaleString()}</strong>
                     </div>
                     <div className={`rpc-stat-box ${data.isAlert ? 'text-red-600' : 'text-emerald-600'}`}>
                        <small>Tồn Thực</small>
                        <strong>{data.diff > 0 ? '+' : ''}{data.diff.toLocaleString()}</strong>
                     </div>
                  </div>
                  
                  {data.isAlert && (
                     <div className="rpc-warning-bar">
                        <AlertTriangle size={14} /> Hệ thống bán lố {Math.abs(data.diff)} đơn vị. Cần kiểm tra bill xuất hoặc phiếu kiểm kê.
                     </div>
                  )}
               </div>
            ))}
         </div>
         
         <div className="rc-actions mt-5 flex gap-2 w-full">
            <button className="rc-btn-secondary" onClick={() => setAiState(AI_STATE.DONE)}>Để sau</button>
            <button className="rc-btn-primary" onClick={() => {
              addStep('Đã gửi yêu cầu kiểm kê lại kho và tạo phiếu bù trừ.', 'result');
              setAiState(AI_STATE.DONE);
            }}>Xử lý chênh lệch</button>
         </div>
      </div>, 'result', 'dashboard'
    );
    setAiState(AI_STATE.DONE);
  };

  const handlePrintIntent = async () => {
    setAiState(AI_STATE.PROCESSING);
    addStep("Đang kết nối máy in Bluetooth...");
    await delay(1200);
    updateLastStep('done');
    addStep(
      <div className="success-card print-success">
         <div className="sc-icon"><Printer size={32} color="#3B82F6" /></div>
         <h4 className="sc-title">Đã gửi lệnh in!</h4>
         <p className="sc-desc">Hoá đơn đang được in ra từ máy in quầy PT-210.</p>
      </div>, 'result', 'success'
    );
    setAiState(AI_STATE.SUCCESS);
  };

  const handleEditOrder = async () => {
    setAiState(AI_STATE.PROCESSING);
    addStep("Đang mở chế độ chỉnh sửa đơn hàng...");
    await delay(800);
    updateLastStep('done');
    setIsEditingCart(true);
    setLastActionType('EDIT_MODE');
    setAiState(AI_STATE.DONE);
  };

  const processVoiceStockEntry = async (text) => {
    const lowerText = text.toLowerCase();
    const qty = parseVietnameseQuantity(text) || 100;
    
    const match = MOCK_DB.find(item => 
       item.keywords.some(k => lowerText.includes(k.toLowerCase())) || 
       lowerText.includes(item.name.toLowerCase())
    );

    if (match) {
        setOosProduct(match.name);
        return handleStockConfirm(qty, match.name);
    } else {
        addStep(`Dạ em chưa nghe rõ tên sản phẩm ạ. Anh/Chị muốn nhập kho mã nào?`, 'result');
        setAiState(AI_STATE.STOCK_ENTRY);
    }
  };

  const handleAction = async (forcedText = null) => {
    const textToProcess = forcedText || transcript;
    if (!textToProcess && aiState !== AI_STATE.LISTENING && aiState !== AI_STATE.STOCK_ENTRY) return;

    const previousState = aiState;

    if (aiState === AI_STATE.LISTENING || aiState === AI_STATE.STOCK_ENTRY) {
      SpeechRecognition.stopListening();
    }

    setAiState(AI_STATE.PROCESSING);
    addStep(textToProcess, 'done', 'user');
    resetTranscript();

    await delay(1000);

    if (previousState === AI_STATE.STOCK_ENTRY) {
      return processVoiceStockEntry(textToProcess);
    }

    simulateProcessing(textToProcess);
  };

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      // 1. Cập nhật giao diện lập tức
      resetTranscript();
      setAiState(AI_STATE.LISTENING);
      
      // 2. Bắt buộc kích hoạt Nhận diện giọng nói ĐỒNG BỘ NGAY LẬP TỨC để giữ Token User Gesture của iOS
      SpeechRecognition.startListening({ continuous: true, language: 'vi-VN' });

      // 3. Chạy ngầm Hack mở luồng Audio PWA WKWebView (Để cứu lỗi Mic câm do Safari ngủ đông AudioContext)
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') ctx.resume();
        }
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            stream.getTracks().forEach(t => t.stop());
          }).catch(e => console.warn("Background audio hack bypassed:", e));
        }
      } catch (err) {
        console.warn("AudioContext init error:", err);
      }

      setIsExpanded(true);
    }
  };

  const simulateProcessing = async (text, additive = false) => {
    const lowerText = text.toLowerCase();
    
    // --- INTENT DETECTION (High Priority) ---
    // Clean input
    const cleanText = lowerText.replace(/[?.,!]/g, '').trim();

    const isHistoryIntent = ['lịch sử', 'nhật ký', 'xem lại', 'đơn cũ', 'hôm nay bán', 'vừa bán', 'vừa xong', 'mới bán'].some(k => cleanText.includes(k));
    const isInventoryReport = ['kiểm kho', 'kiểm tra kho', 'kiểm tra tồn kho', 'kiểm tồn kho', 'báo cáo tồn', 'còn bao nhiêu', 'xem tồn', 'kho hàng', 'số lượng tồn', 'tổng tồn', 'tồn kho'].some(k => cleanText.includes(k));
    const isAccountingAudit = ['giá nhập', 'giá mua', 'truy xuất', 'hóa đơn nhập', 'hóa đơn đầu vào'].some(k => cleanText.includes(k));
    const isReconDashboard = ['đối soát', 'so khớp', 'kiểm kê lệch', 'so sánh kho', 'đối chiếu'].some(k => cleanText.includes(k));
    const isTransferIntent = ['điều chuyển', 'chuyển kho', 'chuyển hàng', 'xuất nội bộ', 'chuyển qua'].some(k => cleanText.includes(k));
    const isGeneralReport = ['báo cáo tổng hợp', 'báo cáo hôm nay', 'tổng kết', 'doanh thu', 'báo cáo doanh thu', 'báo cáo', 'xem báo cáo'].some(k => cleanText.includes(k));
    const isCheckoutIntent = ['thanh toán', 'chốt đơn', 'tính tiền', 'mã qr'].some(k => cleanText.includes(k));

    if (isHistoryIntent) return handleSessionHistory();
    if (isReconDashboard) return handleReconciliationDashboard();
    if (isGeneralReport) return handleDashboardHome();
    if (isInventoryReport) return handleInventoryReport();
    if (isTransferIntent) return handleStockTransfer();
    if (isCheckoutIntent && (activeCart.length > 0 || lastActionType === 'SALE_SUCCESS')) return handleCheckoutIntent();
    
    if (isAccountingAudit) {
      let monthMatch = null;
      if (lowerText.includes('tháng này')) monthMatch = (new Date().getMonth() + 1).toString();
      else {
        const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        months.forEach(m => { if (lowerText.includes(`tháng ${m}`)) monthMatch = m; });
      }

      const matches = MOCK_DB.filter(item => 
         item.keywords.some(k => lowerText.includes(k.toLowerCase())) || 
         lowerText.includes(item.name.toLowerCase())
      );
      
      const bestMatch = matches.length > 0 ? matches.reduce((prev, curr) => {
        return (lowerText.includes(curr.name.toLowerCase()) && curr.name.length > prev.name.length) ? curr : prev;
      }) : null;

      if (bestMatch) return handleProductCostAudit(bestMatch.id, monthMatch);
      return handleReconciliationDashboard();
    }

    // --- Order flow ---
    addStep("Đang phân tích ngôn ngữ tự nhiên...");
    await delay(1000);
    updateLastStep('done');

    const segments = lowerText.split(/,| và |\. | rồi /);
    const detected = [];
    segments.forEach(segment => {
      const segQty = parseVietnameseQuantity(segment);
      const match = MOCK_DB.find(item => 
         item.keywords.some(k => segment.includes(k.toLowerCase())) || 
         segment.includes(item.name.toLowerCase())
      );
      if (match) detected.push({ ...match, detectedQty: segQty || 1 });
    });

    if (detected.length > 0) {
      const outOfStock = detected.filter(i => i.stock === 0);
      if (outOfStock.length > 0) {
        addStep(`Phát hiện ${outOfStock[0].name} đã hết hàng.`, 'done');
        setOosProduct(outOfStock[0].name);
        return handleQuickStockEntry();
      }
      
      // Chặn luồng nếu có từ khóa giỏ quà sau khi đã nhận diện được mặt hàng
      if (lowerText.includes('giỏ quà') || lowerText.includes('đóng gói')) {
         // Chuyển đối tượng detected (item + detectedQty) thành activeCart format (item + quantity) để truyền cho giỏ quà
         const formattedCart = detected.map(d => ({ ...d, quantity: d.detectedQty }));
         return handleDynamicWrapping(formattedCart);
      }
      return finalizeOrderFlow(detected);
    }
    
    // Nếu không có sản phẩm nào được detect nhưng hỏi giỏ quà
    if (lowerText.includes('giỏ quà') || lowerText.includes('đóng gói')) {
      return handleDynamicWrapping();
    }

    addStep(
      <div className="strategic-consultant-card fade-in">
        <div className="consultant-glow"></div>
        <div className="consultant-badge bg-slate-100 text-slate-600 border border-slate-200"><MessageSquare size={12} /> Chưa rõ ý lệnh</div>
        <h4 className="text-slate-800">Dữ liệu hội thoại: <i>"{text}"</i></h4>
        <div className="strategy-advice">
          <p>Dạ, em chưa nhận diện được yêu cầu này. Anh/Chị có thể dùng các câu lệnh chuẩn dưới đây để em xử lý nhanh gọn ạ:</p>
        </div>
        <div className="strategy-actions flex flex-wrap gap-2 mt-3">
          <button className="rc-btn-secondary text-[12px] py-1 px-3" onClick={() => simulateProcessing("Bán 1 hộp sữa")}>Bán 1 hộp sữa</button>
          <button className="rc-btn-secondary text-[12px] py-1 px-3" onClick={() => handleInventoryReport()}>Kiểm tra tồn kho</button>
          <button className="rc-btn-secondary text-[12px] py-1 px-3" onClick={() => handleStockTransfer()}>Chuyển 50 táo</button>
        </div>
      </div>, 'result', 'consultant'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleStockTransfer = (product = transferProduct, qty = transferQty) => {
    setAiState(AI_STATE.STOCK_TRANSFER);
    setLastActionType('TRANSFER');
    addStep(
      <div className="ai-transfer-elite fade-in">
        <div className="te-header">
           <div className="te-icon"><Truck size={20} className="text-blue-500" /></div>
           <div className="te-title">
              <h4>Lệnh Điều chuyển Thông minh</h4>
              <span>Chi nhánh A ➔ Cửa hàng Chính</span>
           </div>
        </div>
        
        <div className="te-body mt-4">
           {product ? (
             <div className="te-selected-item">
                <div className="te-emoji-box">{product.emoji}</div>
                <div className="te-item-info">
                   <p className="te-name">{product.name}</p>
                   <p className="te-stock">Tồn hiện tại: <strong>{product.stock} {product.unit}</strong></p>
                </div>
                <div className="te-qty">x{qty || '?'}</div>
             </div>
           ) : (
             <div className="te-suggestions">
                <p className="te-label"><Sparkles size={14} className="text-amber-500"/> Gợi ý mặt hàng tồn cao cần đẩy:</p>
                <div className="te-pill-grid mt-2">
                   {MOCK_DB.filter(i => i.stock > 100).slice(0, 4).map(item => (
                     <div key={item.id} className="te-pill" onClick={() => handleStockTransfer(item, transferQty)}>
                        <span>{item.emoji}</span> {item.name}
                     </div>
                   ))}
                </div>
             </div>
           )}

           <div className="te-path-visual mt-5">
              <div className="te-node source">
                 <div className="te-node-ring"><User size={16} className="text-slate-500"/></div>
                 <span>Chi nhánh A</span>
              </div>
              <div className="te-arrow-track">
                 <div className="te-track-line"></div>
                 <ChevronRight size={18} className="te-track-head" />
              </div>
              <div className="te-node target active">
                 <div className="te-node-ring pulse-border"><Smartphone size={16} className="text-blue-600"/></div>
                 <span>Cửa hàng (Đích)</span>
              </div>
           </div>
        </div>

        <div className="te-actions mt-5 flex gap-2 w-full">
           <button className="rc-btn-secondary" onClick={() => setAiState(AI_STATE.DONE)}>Thoát</button>
           <button className="rc-btn-primary" onClick={() => {
              addStep('Đã tạo siêu tốc lệnh điều chuyển. Mã phiếu: TR-99812', 'result', 'success');
              setAiState(AI_STATE.DONE);
           }}>Xác nhận chuyển</button>
        </div>
      </div>, 'result', 'dashboard'
    );
  };

  const confirmTransfer = async (product, qty) => {
    addStep(`Đang thực hiện lệnh chuyển ${qty} ${product.name}...`);
    setAiState(AI_STATE.PROCESSING);
    await delay(1500);
    
    // Simulate update
    product.stock -= qty;
    
    setSessionHistory(prev => [{
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: 'ĐIỀU CHUYỂN',
      details: `${product.name} x${qty} -> ${targetBranch}`
    }, ...prev]);

    updateLastStep('done');
    addStep(`Dạ, em đã hoàn tất lệnh điều chuyển ${qty} ${product.name} sang ${targetBranch} thành công!`, 'done');
    setAiState(AI_STATE.SUCCESS);
  };

  const handleGlobalReporting = (step = 0) => {
    setAiState(AI_STATE.REPORTING);
    setLastActionType('REPORTING');
    
    // Mapping for easier step management
    // 0: Dashboard
    // 1-5: Stats Flow
    // 11-15: Tax Flow
    
    if (step === 0) return handleDashboardHome();
    if (step >= 1 && step <= 5) {
       switch(step) {
         case 1: return handleStatsOverview();
         case 2: return handleCategoryBreakdown();
         case 3: return handleTimeAnalysis();
         case 4: return handleAIInsights();
         case 5: return handleStrategicExecution();
       }
    }
    if (step >= 11 && step <= 15) {
       switch(step) {
         case 11: return handleTaxSummaryFlow();
         case 12: return handleVATBreakdownFlow();
         case 13: return handleTaxDeductionFlow();
         case 14: return handleTaxRiskFlow();
         case 15: return handleTaxSubmissionFlow();
       }
    }
    if (step >= 21 && step <= 25) {
       switch(step) {
         case 21: return handleCashSummaryFlow();
         case 22: return handleCashShiftFlow();
         case 23: return handleCashHistoryFlow();
         case 24: return handleCashAuditRiskFlow();
         case 25: return handleCashFinalCloseFlow();
       }
    }
    return handleDashboardHome();
  };

  const handleDashboardHome = () => {
    addStep(
      <div className="ai-reporting-dashboard premium-glass fade-in">
        <div className="report-dashboard-header">
           <FileBarChart size={20} className="text-purple-500" />
           <h3>Trung tâm Báo cáo & Thuế</h3>
        </div>
        
        <div className="report-grid mt-4">
           <div className="report-card-mini" onClick={() => handleGlobalReporting(11)}>
              <div className="card-icon bg-red-50 text-red-600"><ShieldCheck size={18} /></div>
              <p>Báo cáo Thuế</p>
              <span>Phân tích 5 bước</span>
           </div>
           <div className="report-card-mini" onClick={() => handleGlobalReporting(1)}>
              <div className="card-icon bg-blue-50 text-blue-600"><TrendingUp size={18} /></div>
              <p>Thống kê Ngày</p>
              <span>Phân tích 5 bước</span>
           </div>
           <div className="report-card-mini" onClick={() => handleGlobalReporting(21)}>
              <div className="card-icon bg-green-50 text-green-600"><Banknote size={18} /></div>
              <p>Kiểm Két</p>
              <span>Phân tích 5 bước</span>
           </div>
           <div className="report-card-mini" onClick={() => handleInventoryReport()}>
              <div className="card-icon bg-orange-50 text-orange-600"><Package size={18} /></div>
              <p>Kiểm kê Kho</p>
              <span>Hàng tồn sâu</span>
           </div>
        </div>
        
        <div className="report-footer-hint mt-4">
           <Info size={14} />
           <span>Chọn một mục để bắt đầu phân tích chuyên sâu.</span>
        </div>
      </div>,
      'result',
      'dashboard'
    );
  };

  /* --- CASH FLOW STEPS (21-25) --- */

  const handleCashSummaryFlow = () => {
    addStep(
      <div className="cash-step-card premium-glass fade-in">
         <div className="step-indicator">BƯỚC 1/5: TỔNG QUAN TIỀN MẶT</div>
         <div className="cash-main-total mt-4">
            <small>Số dư khả dụng hiện tại</small>
            <h3>12.450.000₫</h3>
         </div>
         <div className="cash-mini-stats mt-4">
            <div className="mini-stat"><span>Đầu ca:</span> <strong>2.000.000₫</strong></div>
            <div className="mini-stat"><span>Doanh thu mặt:</span> <strong>10.450.000₫</strong></div>
         </div>
         <div className="step-actions mt-6">
            <button className="step-next-btn" onClick={() => handleGlobalReporting(22)}>
               Xem cơ cấu dòng tiền <ChevronRight size={14} />
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleCashShiftFlow = () => {
    addStep(
      <div className="cash-step-card premium-glass fade-in">
         <div className="step-indicator">BƯỚC 2/5: BIẾN ĐỘNG TRONG CA</div>
         <div className="shift-flow-list mt-4">
            <div className="flow-item">
               <div className="flow-icon in"><TrendingUp size={14} /></div>
               <div className="flow-info">
                  <span>Tiền thu từ bán hàng</span>
                  <strong>+10.500.000₫</strong>
               </div>
            </div>
            <div className="flow-item">
               <div className="flow-icon out"><TrendingDown size={14} /></div>
               <div className="flow-info">
                  <span>Tiền trả lại khách</span>
                  <strong>-50.000₫</strong>
               </div>
            </div>
            <div className="flow-item">
               <div className="flow-icon mid"><History size={14} /></div>
               <div className="flow-info">
                  <span>Rút tiền chi phí</span>
                  <strong>0₫</strong>
               </div>
            </div>
         </div>
         <div className="step-actions mt-6">
            <button className="step-back-btn" onClick={() => handleGlobalReporting(21)}><ChevronLeft size={14} /></button>
            <button className="step-next-btn" onClick={() => handleGlobalReporting(23)}>Lịch sử giao dịch két <ChevronRight size={14} /></button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleCashHistoryFlow = () => {
    addStep(
      <div className="cash-step-card premium-glass fade-in">
         <div className="step-indicator">BƯỚC 3/5: NHẬT KÝ CHI TIẾT</div>
         <div className="cash-history-timeline mt-4">
            <div className="timeline-entry">
               <span className="time">10:15</span>
               <span className="desc">Bán đơn HD0042</span>
               <span className="amt text-green-600">+450k</span>
            </div>
            <div className="timeline-entry">
               <span className="time">09:45</span>
               <span className="desc">Bán đơn HD0041</span>
               <span className="amt text-green-600">+120k</span>
            </div>
            <div className="timeline-entry">
               <span className="time">08:00</span>
               <span className="desc">Bàn giao đầu ca</span>
               <span className="amt text-blue-600">+2M</span>
            </div>
         </div>
         <div className="step-actions mt-6">
            <button className="step-next-btn full" onClick={() => handleGlobalReporting(24)}>
               AI Đối soát & Phát hiện lệch <Sparkles size={14} />
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleCashAuditRiskFlow = () => {
    addStep(
      <div className="cash-step-card ai-audit-theme fade-in">
         <div className="step-indicator opacity-60">BƯỚC 4/5: AI ĐỐI SOÁT TỰ ĐỘNG</div>
         <div className="audit-result-circle">
            <CheckSquare size={32} className="text-green-400" />
            <h3 className="mt-2">KHỚP 100%</h3>
         </div>
         <div className="audit-details mt-4">
            <p>Hệ thống ghi nhận: <strong>12.450k</strong></p>
            <p>Tiền mặt thực tế: <strong>12.450k</strong></p>
         </div>
         <p className="audit-note mt-3">
            AI không phát hiện bất kỳ giao dịch treo hoặc sai lệch tiền lẻ nào trong ca làm việc này.
         </p>
         <div className="step-actions mt-6">
            <button className="step-next-btn full gold" onClick={() => handleGlobalReporting(25)}>
               Chốt ca & In biên bản <Printer size={14} />
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleCashFinalCloseFlow = () => {
    addStep(
      <div className="cash-step-card premium-glass fade-in">
         <div className="step-indicator">BƯỚC 5/5: CHỐT KÉT & IN</div>
         <div className="final-confirm-view mt-4">
            <div className="success-pulse"></div>
            <h4>Xác nhận chốt két?</h4>
            <p>Toàn bộ dữ liệu sẽ được gửi về quản lý.</p>
         </div>
         <div className="step-actions mt-6">
            <button className="confirm-strategy-btn" onClick={() => { addStep("Đang đóng ca và kết xuất dữ liệu...", 'done'); setAiState(AI_STATE.SUCCESS); }}>
               Xác nhận Chốt Ca
            </button>
            <button className="export-report-btn mt-2" onClick={() => addStep("Đã gửi file báo cáo két qua Zalo quản lý.", 'done')}>
               In Biên Bản Két (PDF)
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  /* --- TAX FLOW STEPS (11-15) --- */
  
  const handleTaxSummaryFlow = () => {
    addStep(
      <div className="tax-step-card premium-glass fade-in">
         <div className="step-indicator">BƯỚC 1/5: TỔNG QUAN THUẾ Q2</div>
         <div className="tax-main-summary mt-4">
            <div className="summary-item">
               <p>Doanh thu tính thuế</p>
               <h3>152.400.000đ</h3>
            </div>
            <div className="summary-item">
               <p>Thuế tạm tính</p>
               <h3 className="text-red-500">15.240.000đ</h3>
            </div>
         </div>
         <div className="step-actions mt-6">
            <button className="step-next-btn" onClick={() => handleGlobalReporting(12)}>
               Xem chi tiết thuế GTGT <ChevronRight size={14} />
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleVATBreakdownFlow = () => {
    addStep(
      <div className="tax-step-card premium-glass fade-in">
         <div className="step-indicator">BƯỚC 2/5: CHI TIẾT THUẾ GTGT</div>
         <div className="vat-grid mt-4">
            <div className="vat-row">
               <span>Nhóm hàng 10% (Gia vị, Nước)</span>
               <strong>8.500.000đ</strong>
            </div>
            <div className="vat-row">
               <span>Nhóm hàng 8% (Thực phẩm thiết yếu)</span>
               <strong>4.200.000đ</strong>
            </div>
            <div className="vat-row">
               <span>Nhóm hàng 0% (Hàng nông sản)</span>
               <strong>0đ</strong>
            </div>
         </div>
         <div className="step-actions mt-6">
            <button className="step-back-btn" onClick={() => handleGlobalReporting(11)}><ChevronLeft size={14} /></button>
            <button className="step-next-btn" onClick={() => handleGlobalReporting(13)}>Đối soát chi phí khấu trừ <ChevronRight size={14} /></button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleTaxDeductionFlow = () => {
    addStep(
      <div className="tax-step-card premium-glass fade-in">
         <div className="step-indicator">BƯỚC 3/5: CHI PHÍ & KHẤU TRỪ</div>
         <div className="deduction-analysis mt-4">
            <div className="deduction-chart-mini">
               <div className="chart-label">Thuế đầu vào (Khấu trừ)</div>
               <div className="progress-bar-premium"><div className="fill" style={{width: '65%', background: '#10B981'}}></div></div>
               <div className="price-tag">8.400.000đ</div>
            </div>
            <div className="deduction-chart-mini mt-4">
               <div className="chart-label">Thuế đầu ra (Phải nộp)</div>
               <div className="progress-bar-premium"><div className="fill" style={{width: '100%', background: '#EF4444'}}></div></div>
               <div className="price-tag">15.240.000đ</div>
            </div>
         </div>
         <div className="step-actions mt-6">
            <button className="step-next-btn full" onClick={() => handleGlobalReporting(14)}>
               Kiểm tra rủi ro tuân thủ bởi AI <ShieldCheck size={14} />
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleTaxRiskFlow = () => {
    addStep(
      <div className="tax-step-card ai-risk-theme fade-in">
         <div className="step-indicator text-white-50">BƯỚC 4/5: KIỂM TRA TUÂN THỦ AI</div>
         <div className="risk-status">
            <CheckCircle2 size={32} className="text-green-400" />
            <h3>An toàn 98.5%</h3>
         </div>
         <p className="risk-desc mt-3">
            AI ghi nhận dữ liệu khớp 100% với hoá đơn điện tử. Không phát hiện sai lệch doanh thu so với lịch sử thanh toán QR.
         </p>
         <div className="risk-tip mt-4">
            <Zap size={14} /> Mẹo: Bạn có thể giảm thêm 2% thuế bằng cách bổ sung chi phí vận hành hợp lệ.
         </div>
         <div className="step-actions mt-6">
            <button className="step-next-btn full gold" onClick={() => handleGlobalReporting(15)}>
               Tiến hành kết xuất & Nộp hồ sơ <FileText size={14} />
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleTaxSubmissionFlow = () => {
    addStep(
      <div className="tax-step-card premium-glass fade-in">
         <div className="step-indicator">BƯỚC 5/5: KẾT XUẤT & NỘP THUẾ</div>
         <div className="submission-ready mt-4">
            <div className="ready-orb"></div>
            <h4>Tờ khai thuế đã sẵn sàng!</h4>
            <p>Niên độ: Quý 2/2024</p>
         </div>
         <div className="step-actions mt-6">
            <button className="confirm-strategy-btn" onClick={() => { addStep("Đang chuẩn bị hồ sơ điện tử...", 'done'); setAiState(AI_STATE.SUCCESS); }}>
               Gửi Tờ khai điện tử ngay
            </button>
            <button className="export-report-btn mt-2" onClick={() => addStep("Đã tải xuống bộ hồ sơ PDF chi tiết.", 'done')}>
               Tải Xuống Tờ Khai (PDF)
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleStatsOverview = () => {
    addStep(
      <div className="stats-dashboard-deep premium-glass fade-in">
         <div className="step-indicator">BƯỚC 1/5: TỔNG QUAN</div>
         <div className="stats-header-row">
            <div className="stats-main-val">
               <p>Doanh thu hôm nay</p>
               <h3>8.420.000đ</h3>
               <span className="growth-indicator positive pulsating">
                  <TrendingUp size={12} /> +12% cực tốt
               </span>
            </div>
            <div className="stats-orders-pill">
               <strong>42</strong> đơn hàng
            </div>
         </div>
         
         <div className="stats-chart-animated mt-6">
            <div className="chart-bars-elite">
               {[35, 50, 75, 45, 90, 65, 85, 70, 95, 60, 40, 55].map((h, i) => (
                  <div key={i} className="bar-wrapper" style={{"--delay": `${i * 0.1}s`, "--h": `${h}%`}}>
                     <div className="bar-glow"></div>
                     <div className="bar-main"></div>
                  </div>
               ))}
            </div>
            <div className="chart-labels">
               <span>08:00</span>
               <span>12:00</span>
               <span>16:00</span>
               <span>20:00</span>
            </div>
         </div>

         <div className="step-actions mt-6">
            <button className="step-next-btn" onClick={() => handleGlobalReporting(2)}>
               Phân tích chuyên sâu (Bước 2) <ChevronRight size={14} />
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleCategoryBreakdown = () => {
    addStep(
      <div className="category-breakdown-card premium-glass fade-in">
         <div className="step-indicator">BƯỚC 2/5: CƠ CẤU DOANH THU</div>
         <h4 className="card-title">Tỷ trọng ngành hàng</h4>
         <div className="category-list mt-3">
            <div className="cat-item">
               <div className="cat-info">
                  <span>Trứng & Sữa</span>
                  <small>45%</small>
               </div>
               <div className="cat-progress"><div className="cat-fill" style={{width: '45%', background: '#3B82F6'}}></div></div>
            </div>
            <div className="cat-item">
               <div className="cat-info">
                  <span>Gia vị & Đồ khô</span>
                  <small>30%</small>
               </div>
               <div className="cat-progress"><div className="cat-fill" style={{width: '30%', background: '#10B981'}}></div></div>
            </div>
            <div className="cat-item">
               <div className="cat-info">
                  <span>Nước giải khát</span>
                  <small>25%</small>
               </div>
               <div className="cat-progress"><div className="cat-fill" style={{width: '25%', background: '#F59E0B'}}></div></div>
            </div>
         </div>
         <div className="step-actions mt-6">
            <button className="step-back-btn" onClick={() => handleGlobalReporting(1)}><ChevronLeft size={14} /> Quay lại</button>
            <button className="step-next-btn" onClick={() => handleGlobalReporting(3)}>Phân tích giờ cao điểm <ChevronRight size={14} /></button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleTimeAnalysis = () => {
    addStep(
      <div className="time-analysis-card premium-glass fade-in">
         <div className="step-indicator">BƯỚC 3/5: GIỜ CAO ĐIỂM</div>
         <div className="peak-hour-highlight">
            <Clock size={24} className="text-orange-500" />
            <div className="peak-info">
               <p>Giờ vàng mua sắm</p>
               <h3>17:00 - 19:00</h3>
            </div>
         </div>
         <p className="peak-description mt-3">
            Lượng khách hàng tăng đột biến <strong>2.5x</strong> so với trung bình ngày. Cần bổ sung nhân sự trực tại quầy.
         </p>
         <div className="step-actions mt-6">
            <button className="step-next-btn full" onClick={() => handleGlobalReporting(4)}>
               Xem nhận diện AI & Rủi ro <Sparkles size={14} />
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleAIInsights = () => {
    addStep(
      <div className="ai-insight-deep-card premium-glass fade-in">
         <div className="step-indicator">BƯỚC 4/5: TRÍ TUỆ AI</div>
         <div className="insight-pulse-glow"></div>
         <div className="insight-header">
            <Zap size={20} className="text-yellow-400" />
            <span>PHÁT HIỆN BẤT THƯỜNG</span>
         </div>
         <ul className="insight-list mt-4">
            <li>
               <TrendingDown size={14} className="text-red-500" />
               Mặt hàng <strong>Nước mắm Nam Ngư</strong> đang hụt doanh thu so với tuần trước (-15%).
            </li>
            <li>
               <Info size={14} className="text-blue-500" />
               Tồn kho <strong>Trứng gà ta</strong> đang cao, có nguy cơ quá hạn nếu không đẩy bán sớm.
            </li>
         </ul>
         <div className="step-actions mt-6">
            <button className="step-next-btn full gold" onClick={() => handleGlobalReporting(5)}>
               Nhận chiến lược đẩy hàng <Target size={14} />
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleStrategicExecution = () => {
    addStep(
      <div className="strategic-execution-card premium-glass fade-in">
         <div className="step-indicator">BƯỚC 5/5: CHIẾN LƯỢC HÀNH ĐỘNG</div>
         <h3 className="strategy-title">Chương trình khuyến mãi đề xuất</h3>
         <div className="promo-preview mt-4">
            <div className="promo-label">COMBO TIẾT KIỆM</div>
            <h4>Giảm 10% khi mua Trứng gà + Nước mắm</h4>
            <p>Thời gian: 17:00 - 19:00 hôm nay</p>
         </div>
         <div className="step-actions mt-6">
            <button className="confirm-strategy-btn" onClick={() => { addStep("Đang cấu hình chương trình khuyến mãi...", 'done'); setAiState(AI_STATE.SUCCESS); }}>
               Áp dụng chiến lược ngay
            </button>
            <button className="export-report-btn mt-2" onClick={() => addStep("Đã xuất báo cáo chi tiết 5 bước gửi quản lý.", 'done')}>
               Kết xuất báo cáo chi tiết
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
  };

  const handleConfirmFinalReset = async () => {
    setAiState(AI_STATE.PROCESSING);
    addStep("Đang đóng phiên giao diện và lưu trữ hồ sơ...");
    await delay(1200);
    
    resetSession();
    setProcessSteps([]); // Clear all previous steps for the new session
    setAiState(AI_STATE.DONE);
    
    addStep(renderStrategicDashboard(), 'result', 'dashboard');
  };

  const handleManualReset = async () => {
    addStep("Đang hủy giỏ hàng hiện tại...");
    await delay(800);
    resetSession();
    updateLastStep('done');
    addStep("Dạ, em đã làm mới session. Giỏ hàng hiện đã trống.", 'result', 'success');
    setAiState(AI_STATE.DONE);
  };



  const updateCartItemQty = (id, delta) => {
    setActiveCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleOptimizeTax = async (comboId) => {
    setAiState(AI_STATE.PROCESSING);
    addStep("Đang phân tách combo và tái cơ cấu danh mục thuế...");
    await delay(1000);
    
    setActiveCart(prev => {
      const comboItem = prev.find(i => i.id === comboId);
      if (!comboItem || !comboItem.comboItems) return prev;
      
      const otherItems = prev.filter(i => i.id !== comboId);
      const splitItems = comboItem.comboItems.map(ci => ({
        ...ci,
        id: `split-${comboId}-${ci.id}`,
        quantity: comboItem.quantity || 1,
        keywords: [ci.name.toLowerCase()]
      }));
      
      return [...otherItems, ...splitItems];
    });
    
    updateLastStep('done');
    addStep(
      <div className="tax-optimization-success premium-glass fade-in">
         <CheckCircle2 size={24} className="text-green-500" />
         <h4>Đã tối ưu thuế thành công!</h4>
         <p>Đơn hàng đã được liệt kê theo từng item để hưởng mức thuế <b>Bán lẻ (1.5%)</b>.</p>
      </div>, 'result', 'dashboard'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleDynamicWrapping = async (cartSnapshot = null) => {
    const cartToWrap = cartSnapshot || activeCart;
    if (cartToWrap.length === 0) {
      addStep("Dạ, giỏ hàng đang trống. Anh/Chị vui lòng chọn sản phẩm trước khi yêu cầu đóng giỏ quà nhé!", 'result', 'info');
      return setAiState(AI_STATE.DONE);
    }

    setAiState(AI_STATE.PROCESSING);
    addStep("Đang phân tích giỏ hàng để tối ưu quy cách đóng gói...");
    await delay(1200);
    updateLastStep('done');

    const fruitItems = cartToWrap.filter(item => item.category === "Thực phẩm tươi" || item.category === "Lương thực");
    const giftItems = cartToWrap.filter(item => item.category === "Bánh kẹo" || item.category === "Gia vị");
    
    addStep(
      <div className="dynamic-wrap-card premium-glass fade-in">
         <div className="opt-header">
            <Sparkles size={16} className="text-amber-500" />
            <span>Trí tuệ Bán hàng AI: Tối ưu Giỏ quà</span>
         </div>
         <div className="opt-content mt-2">
            <p>Dạ em nhận lệnh! Em sẽ giúp mình đóng <b>{cartToWrap.length} mặt hàng</b> này thành giỏ quà chuyên nghiệp.</p>
            <div className="opt-advice bg-blue-50/50 p-3 rounded-xl mt-3 border border-blue-100">
               <p className="text-[12px] text-blue-800 leading-normal">
                 💡 <b>Mẹo tối ưu:</b> Nếu lên đơn là "Dịch vụ giỏ quà", mình sẽ chịu <b>7.5% thuế</b> trên toàn bộ giá trị. 
                 Em sẽ tách riêng: <b>Hàng hóa (1.5%)</b> + <b>Phí đóng gói (7.5%)</b> để mình đóng thuế ít nhất nha!
               </p>
            </div>
            <div className="opt-compare mt-3">
               <div className="compare-item">
                  <small>Thuế cũ (7.5%)</small>
                  <strong className="text-red-500">{(cartToWrap.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.075).toLocaleString()}₫</strong>
               </div>
               <ArrowRight size={14} className="opacity-40" />
               <div className="compare-item">
                  <small>Thuế sau Tối ưu</small>
                  <strong className="text-green-600">{(cartToWrap.reduce((sum, item) => sum + (item.price * item.quantity * 0.015), 0) + (50000 * 0.015) + (30000 * 0.075)).toLocaleString()}₫</strong>
               </div>
            </div>
         </div>
         <div className="opt-actions-row mt-4">
            <button className="opt-secondary-btn" onClick={() => setAiState(AI_STATE.DONE)}>Để sau</button>
            <button className="opt-apply-btn flex-1" onClick={() => executeDynamicWrap(cartToWrap)}>
               <Gift size={14} /> Chốt Giỏ quà Tối ưu
            </button>
         </div>
      </div>, 'result', 'dashboard'
    );
    setAiState(AI_STATE.DONE);
  };

  const executeDynamicWrap = async (cartToWrap = activeCart) => {
    setAiState(AI_STATE.PROCESSING);
    addStep("Đang tạo nghiệp vụ đóng gói & áp mã thuế lẻ...");
    await delay(1000);
    
    // REDESIGNED: Split 80k into 50k Material (1.5%) and 30k Labor (7.5%)
    const basketMaterial = {
      id: `basket-${Date.now()}`,
      name: "Giỏ tre mây & Phụ kiện (Vật tư)",
      price: 50000,
      quantity: 1,
      taxCategory: 'RETAIL'
    };
    const laborFee = {
      id: `labor-${Date.now()}`,
      name: "Công đóng gói & Tạo hình AI",
      price: 30000,
      quantity: 1,
      taxCategory: 'SERVICE'
    };
    
    const updatedCart = [...cartToWrap, basketMaterial, laborFee];
    setActiveCart(updatedCart);
    
    setSessionHistory(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      action: 'TỐI ƯU GIỎ QUÀ',
      details: 'Chuyển đổi -> Hàng lẻ (1.5%) + Phí đóng gói (7.5%)'
    }, ...prev]);

    const totalAmount = updatedCart.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
    const totalTax = updatedCart.reduce((sum, i) => sum + (i.price * i.quantity * TAX_RATES[i.taxCategory]), 0);

    const retailItems = updatedCart.filter(i => i.taxCategory === 'RETAIL');
    const serviceItems = updatedCart.filter(i => i.taxCategory === 'SERVICE');

    updateLastStep('done');
    addStep(
      <div className="tax-optimization-success premium-glass fade-in text-left">
         <div className="flex items-center gap-2">
            {/* <CheckCircle2 size={24} className="text-green-500 animate-bounce" /> */}
            <h4 className="m-0 text-left">Tối ưu Thành công!</h4>
         </div>
         <p className="mt-2 mb-4 text-left">Hoá đơn đã được tách dòng để áp thuế <b>1.5%</b>.</p>
         
         <div className="receipt-card mini-receipt">
            <div className="rc-body">
               {retailItems.length > 0 && (
                  <div className="rc-tax-group">
                    <div className="group-header retail">HÀNG HÓA (Thuế lẻ 1.5%)</div>
                    {retailItems.map((item, idx) => (
                      <div className="rc-line-group" key={`opt-retail-${item.id}-${idx}`}>
                        <div className="rc-line">
                          <span>{item.name} <strong>x{item.quantity || 1}</strong></span>
                          <span>{(item.price * (item.quantity || 1)).toLocaleString()}₫</span>
                        </div>
                      </div>
                    ))}
                  </div>
               )}

               {serviceItems.length > 0 && (
                  <div className="rc-tax-group mt-3">
                    <div className="group-header service">DỊCH VỤ / ĐÓNG GÓI (Thuế 7.5%)</div>
                    {serviceItems.map((item, idx) => (
                      <div className="rc-line-group" key={`opt-service-${item.id}-${idx}`}>
                        <div className="rc-line">
                          <span>{item.name} <strong>x{item.quantity || 1}</strong></span>
                          <span>{(item.price * (item.quantity || 1)).toLocaleString()}₫</span>
                        </div>
                      </div>
                    ))}
                  </div>
               )}

               <div className="rc-divider mt-4"></div>
               <div className="rc-tax-summary tax-success-anim">
                  <span>Ước tính thuế tối ưu:</span>
                  <strong className="text-green-600">-{totalTax.toLocaleString()}₫</strong>
               </div>
               <div className="rc-total mt-1">
                  <span>Tổng thanh toán</span>
                  <span className="total-val">{totalAmount.toLocaleString()}₫</span>
               </div>
            </div>
         </div>
      </div>, 'result', 'dashboard'
    );
    setLastActionType('SALE_SUCCESS');
    setAiState(AI_STATE.DONE);
  };

  // --- Rendering Functions ---
  const renderStrategicDashboard = () => {
    return (
      <div className="strategic-dashboard fade-in">
        <div className="dashboard-title-area">
          <small className="text-blue-600 font-bold uppercase tracking-widest">Định hướng chiến lược</small>
          <h3>Gợi ý hành động hôm nay</h3>
          {/* <p>Dựa trên tồn kho & xu hướng thị trường</p> */}
        </div>

        <div className="strategic-grid">
          <div className="strategic-tile tile-warning" onClick={() => handleClearanceStrategy("Mì Hảo Hảo", 150)}>
            <div className="tile-icon bg-red-50 text-red-600"><TrendingDown size={18} /></div>
            <div className="tile-label">Clear tồn kho</div>
            <div className="tile-value">Mì Hảo Hảo (Còn 150 thùng)</div>
            <div className="tile-action"><Zap size={10} /> Chạy khuyến mãi 15%</div>
          </div>

          <div className="strategic-tile tile-success" onClick={() => handleUpsellStrategy("Táo Envy", "Đang là xu hướng")}>
            <div className="tile-icon bg-green-50 text-green-600"><TrendingUp size={18} /></div>
            <div className="tile-label">Bán thêm</div>
            <div className="tile-value">Táo Envy đang HOT</div>
            <div className="tile-action"><Plus size={10} /> Đặt ở kệ trung tâm</div>
          </div>

          <div className="strategic-tile tile-info" onClick={() => handleQuickStockEntry()}>
            <div className="tile-icon bg-blue-50 text-blue-600"><Calendar size={18} /></div>
            <div className="tile-label">Dự đoán nhập</div>
            <div className="tile-value">Nho mẫu đơn (Sắp hết)</div>
            <div className="tile-action"><Truck size={10} /> Gợi ý nhập: +20kg</div>
          </div>

          <div className="strategic-tile tile-amber" onClick={() => handleInventoryReport()}>
            <div className="tile-icon bg-amber-50 text-amber-600"><AlertTriangle size={18} /></div>
            <div className="tile-label">Cảnh báo</div>
            <div className="tile-value">Sản phẩm sắp hết</div>
            <div className="tile-action"><Settings size={10} /> Xử lý ngay</div>
          </div>
        </div>

        <div className="voucher-card-premium" onClick={() => simulateProcessing("Dùng voucher nhập hàng sữa")}>
          <div className="voucher-glow"></div>
          <div className="v-label">Ưu đãi nhà phân phối</div>
          <div className="v-title">Voucher GIẢM 20%</div>
          <div className="v-desc">Áp dụng cho đơn nhập Sữa TH True Milk.</div>
          <button className="v-btn">Xem chi tiết & Dùng ngay</button>
        </div>

        <div className="strategic-timeline-box">
          <div className="timeline-header"><Clock size={16} className="text-blue-500" /><span>Timeline chiến lược</span></div>
          <div className="timeline-v-list">
            <div className="timeline-v-item">
              <div className="tm-marker active"></div>
              <div className="tm-content"><b>08:00 - Kiểm kho & Nhập hàng</b><span>Ưu tiên hàng dự báo hết.</span></div>
            </div>
            <div className="timeline-v-item">
              <div className="tm-marker"></div>
              <div className="tm-content"><b>16:00 - Tối ưu tồn cuối ngày</b><span>Cân nhắc giảm giá 10% hàng tươi sống.</span></div>
            </div>
          </div>
        </div>

        {/* Legacy Quick CTAs */}
        <div className="onboarding-suggestions">
          <p className="suggestion-label mb-3"></p>
          <div className="suggestion-grid">
            <div className="suggest-card-premium" onClick={() => simulateProcessing("Bán cho khách 2 vỉ trứng gà")}>
              <div className="suggest-icon bg-blue-50 text-blue-600"><ShoppingBag size={18} /></div>
              <div className="suggest-info">
                <p>Bán hàng</p>
                <span>"Bán 2 vỉ trứng"</span>
              </div>
            </div>
            <div className="suggest-card-premium" onClick={() => handleInventoryReport()}>
              <div className="suggest-icon bg-orange-50 text-orange-600"><BarChart2 size={18} /></div>
              <div className="suggest-info">
                <p>Tồn kho</p>
                <span>"Kiểm tra kho"</span>
              </div>
            </div>
            <div className="suggest-card-premium" onClick={() => simulateProcessing("Cho tôi xem lịch sử")}>
              <div className="suggest-icon bg-green-50 text-green-600"><Clock size={18} /></div>
              <div className="suggest-info">
                <p>Lịch sử</p>
                <span>"Lịch sử đơn"</span>
              </div>
            </div>
            <div className="suggest-card-premium" onClick={() => handleStockTransfer()}>
              <div className="suggest-icon bg-indigo-50 text-indigo-600"><Truck size={18} /></div>
              <div className="suggest-info">
                <p>Điều chuyển</p>
                <span>"Chuyển kho 20 táo"</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <>
      {isExpanded && <div className="ai-backdrop" onClick={() => setIsExpanded(false)} />}
      
      <div className={`ai-assistant-wrapper ${isExpanded ? 'expanded' : ''} ${listening ? 'listening-mode' : ''}`} 
           style={isExpanded ? { height: popupHeight, borderRadius: isMini ? '40px' : '32px' } : {}}>
        
        {isExpanded && (
          <>
            <div className="ai-drag-handle" onMouseDown={handleDragStart} onTouchStart={handleDragStart}></div>
            <div className="ai-chat-header flex-between">
               <div className="flex-center">
                  <div className="ai-logo-small"><Sparkles size={16} color="white" /></div>
                  <span className="ai-chat-title">Smart Assistant</span>
               </div>
               <div className="flex-center gap-2">
                 <button className="icon-btn-gray" onClick={startNewSession}><RotateCcw size={16} /></button>
                 <button className="icon-btn-gray" onClick={() => setIsExpanded(false)}><X size={18} /></button>
               </div>
            </div>

            <div className="ai-chat-body" ref={chatEndRef}>
               {processSteps.length === 0 ? renderStrategicDashboard() : (
                 <div className="process-steps-container">
                    {processSteps.map((step, idx) => (
                      <div key={idx} className={`process-step ${step.status} type-${step.type}`}>
                        {step.type !== 'user' && <div className="step-icon">{step.status === 'loading' ? <Loader2 className="spin-icon" size={16} /> : <CheckCircle2 size={16} />}</div>}
                        <div className="step-content">{step.content}</div>
                      </div>
                    ))}
                    {aiState === AI_STATE.PROCESSING && (
                      <div className="process-step loading">
                        <div className="step-icon"><Loader2 className="spin-icon" size={16} /></div>
                        <div className="step-content">Đang xử lý...</div>
                      </div>
                    )}
                 </div>
               )}
            </div>

            <div className="ai-chat-footer-area">
               {aiState === AI_STATE.STOCK_ENTRY && (
                 <div className="ai-suggestions slide-up">
                    <button className="cta-chip primary-cta" onClick={() => handleStockConfirm(30)}>+30 (1 Thùng)</button>
                    <button className="cta-chip primary-cta" onClick={() => handleStockConfirm(100)}>+100 (Sỉ)</button>
                    <button className="cta-chip outline-cta" onClick={() => setAiState(AI_STATE.DONE)}>Quay lại</button>
                 </div>
               )}

               {(aiState === AI_STATE.DONE || aiState === AI_STATE.SUCCESS) && (
                 <div className="ai-suggestions slide-up">
                    {lastActionType === 'SALE_SUCCESS' && aiState === AI_STATE.DONE && (
                      <>
                        <button className="cta-chip primary-cta" onClick={handleCheckoutIntent}><CreditCard size={15} /> Thanh toán</button>
                        <button className="cta-chip secondary-cta" onClick={handleQRIntent}><Smartphone size={15} /> QR VietQR</button>
                        <button className="cta-chip secondary-cta" onClick={handleEditOrder}><Settings size={15} /> Sửa đơn</button>
                      </>
                    )}
                    {lastActionType === 'INVENTORY_REPORT' && aiState === AI_STATE.DONE && (
                      <>
                        <button className="cta-chip primary-cta" onClick={handleQuickStockEntry}><Database size={14} /> Nhập hàng ngay</button>
                        <button className="cta-chip secondary-cta" onClick={() => addStep("Đã mở điều chuyển...", 'done')}><Truck size={14} /> Chuyển kho</button>
                      </>
                    )}
                    {aiState === AI_STATE.SUCCESS && (
                      <>
                        <button className="cta-chip primary-cta" onClick={() => { setIsExpanded(false); startNewSession(); }}><CheckCircle2 size={15} /> Hoàn tất</button>
                        <button className="cta-chip secondary-cta" onClick={handlePrintIntent}><Printer size={15} /> In lại</button>
                        <button className="cta-chip secondary-cta" onClick={() => startNewSession()}><Plus size={15} /> Đơn mới</button>
                      </>
                    )}
                    {aiState === AI_STATE.DONE && (
                      <>
                        {lastActionType !== 'SALE_SUCCESS' && lastActionType !== 'INVENTORY_REPORT' && (
                           <>
                             <button className="cta-chip primary-cta" onClick={handleQuickStockEntry}><Database size={14} /> Trợ lý kho</button>
                             <button className="cta-chip secondary-cta" onClick={() => handleAction("Cho tôi xem báo cáo tổng hợp")}><BarChart3 size={14} /> Báo cáo</button>
                           </>
                        )}
                        <button className="cta-chip outline-cta" onClick={() => setIsExpanded(false)}><X size={15} /> Đóng thẻ</button>
                      </>
                    )}
                 </div>
               )}

               {listening && transcript && (
                 <div className="live-transcript">
                    <div className="transcript-pulse"></div>
                    <span className="live-transcript-text">{transcript}</span>
                 </div>
               )}
               
               <div className={`ai-input-pill ${listening ? 'listening' : ''}`}>
                  {listening ? (
                    <div className="siri-orb-container">
                       <div className="siri-glow-layer layer-1"></div>
                       <div className="siri-glow-layer layer-2"></div>
                       <div className="siri-glow-layer layer-3"></div>
                       <div className="siri-glow-layer layer-core"></div>
                    </div>
                  ) : (
                    <div className="voice-idle-state" onClick={handleMicClick}>
                       <Mic size={18} className="text-blue-500" />
                       <span className="idle-text">Bấm để nói yêu cầu...</span>
                    </div>
                  )}
                  <div className="ai-controls-group">
                     {listening ? (
                       <button className="ai-action-btn mic-btn pulse" onClick={() => handleMicClick()}>
                          <Mic size={20} color="white" />
                       </button>
                     ) : (
                       <button className="ai-action-btn send-btn" onClick={() => handleAction()}>
                          <Send size={20} color="white" />
                       </button>
                     )}
                  </div>
               </div>
            </div>
          </>
        )}

        {!isExpanded && renderAiTriggers()}

      </div>
    </>
  );
};

export default AiAssistant;
