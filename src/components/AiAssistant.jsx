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
      }, 2000);
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
    const unitMatch = lower.match(/([\d.,]+)\s*(kg|cân|g|l|hộp|quả|trứng|chai)/i);
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
      'chục': 10, 'tá': 12, 'thùng': 24, 'két': 24, 'vỉ': 10, 'nửa': 0.5
    };
    if (lower.includes('một thùng') || lower.includes('1 thùng')) return 24;
    for (const [word, val] of Object.entries(wordMap)) {
      if (lower.includes(`${word} kg`) || lower.includes(`${word} cân`)) return val;
    }
    for (const [word, val] of Object.entries(wordMap)) {
      const regex = new RegExp(`(^|\\s)${word}(\\s|$)`, 'i');
      if (regex.test(lower)) return val;
    }
    return null;
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleReconciliationDashboard = async (productId = null) => {
    setAiState(AI_STATE.PROCESSING);
    addStep('Đang đối soát số liệu...');
    await delay(1200);
    updateLastStep('done');
    const productsToRecon = productId ? MOCK_DB.filter(p => p.id === productId) : MOCK_DB.slice(0, 5);
    addStep(
      <div className='reconciliation-hub-elite elite-glass fade-in'>
         <div className='recon-header'><ShieldCheck size={20} className='text-emerald-400' /><span>ĐỐI SOÁT & MINH BẠCH</span></div>
         <div className='recon-body'>
            {productsToRecon.map(p => {
               const sales = SALES_HISTORY_AGGREGATE.find(s => s.productId === p.id);
               const inputs = INPUT_INVOICES.filter(i => i.productId === p.id);
               const totalIn = inputs.reduce((a, b) => a + b.qty, 0);
               const totalOut = sales?.totalSold || 0;
               const diff = totalIn - totalOut;
               const isAlert = diff < 0;
               return (
                  <div className={'recon-item-card ' + (isAlert ? 'alert' : '')} key={'recon-' + p.id}>
                     <div className='p-header'><span className='p-name'>{p.emoji} {p.name}</span></div>
                     <div className='p-stats'>
                        <span>Nhập: {totalIn}</span><span>Bán: {totalOut}</span><span>Tồn: {diff}</span>
                     </div>
                  </div>
               );
            })}
         </div>
         <button className='recon-btn-full' onClick={() => setAiState(AI_STATE.DONE)}>Hoàn tất</button>
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleSessionHistory = async () => {
    setAiState(AI_STATE.PROCESSING);
    addStep('Đang trích xuất nhật ký...');
    await delay(800);
    updateLastStep('done');
    addStep(
      <div className='session-history-card premium-glass fade-in'>
         <div className='history-header'><History size={18} /><span>NHẬT KÝ PHIÊN</span></div>
         <div className='history-timeline mt-4'>
            {sessionHistory.length > 0 ? sessionHistory.map((log, idx) => (
               <div className='history-log-item' key={idx}><span>{log.timestamp}</span><span>{log.action}</span></div>
            )).reverse() : <div className='text-center py-4'>Trống</div>}
         </div>
         <button className='history-btn outline' onClick={() => setAiState(AI_STATE.DONE)}>Đóng</button>
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleAction = async (forcedText = null) => {
    const textToProcess = forcedText || transcript;
    if (!textToProcess && aiState !== AI_STATE.LISTENING) return;

    if (aiState === AI_STATE.LISTENING) {
      SpeechRecognition.stopListening();
    }

    setAiState(AI_STATE.PROCESSING);
    addStep(textToProcess, 'done', 'user');
    resetTranscript();

    await delay(1000);
    simulateProcessing(textToProcess);
  };

  const simulateProcessing = async (text, additive = false) => {
    const lower = text.toLowerCase();
    
    // --- Intent Detection Logic (Logic from BanHang.jsx) ---
    // Reporting & Audit
    if (lower.includes('hóa đơn đầu vào') || lower.includes('giá nhập') || lower.includes('đối soát')) {
      let matchedId = 1; // Default Táo
      const itemMatch = MOCK_DB.find(p => p.keywords.some(k => lower.includes(k)));
      if (itemMatch) matchedId = itemMatch.id;
      
      let filterMonth = null;
      const monthMatch = lower.match(/tháng (\d+)/);
      if (monthMatch) filterMonth = monthMatch[1];
      else if (lower.includes('tháng này')) filterMonth = new Date().getMonth() + 1;

      if (lower.includes('đối soát kho') || lower.includes('đối soát tồn')) {
        handleReconciliationDashboard();
      } else {
        handleProductCostAudit(matchedId, filterMonth);
      }
      return;
    }

    if (lower.includes('lịch sử')) {
      handleSessionHistory();
      return;
    }

    // Default: Sale / Inventory check (Simplification for now)
    addStep("Dạ, em đang kiểm tra yêu cầu của mình...");
    await delay(800);
    updateLastStep('done');
    addStep("Em đã thực hiện xong yêu cầu của mình ạ.", 'result');
    setAiState(AI_STATE.DONE);
  };

  // --- Rendering Functions ---
  const renderStrategicDashboard = () => {
    return (
      <div className="strategic-dashboard fade-in">
        <div className="dashboard-title-area">
          <small className="text-blue-600 font-bold uppercase tracking-widest">Gợi ý hành động</small>
          <h3>Thông minh & Hiệu quả</h3>
        </div>
        <div className="strategic-grid">
           <div className="strategic-tile tile-warning" onClick={() => handleClearanceStrategy("Mì Hảo Hảo", 150)}>
             <div className="tile-icon"><TrendingDown size={18} /></div>
             <span>Xả kho Mì Hảo Hảo</span>
           </div>
           <div className="strategic-tile tile-success" onClick={() => handleUpsellStrategy("Táo Envy", "Đang là xu hướng")}>
             <div className="tile-icon"><TrendingUp size={18} /></div>
             <span>Đẩy mạnh Táo Envy</span>
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
      
      <div className={`ai-assistant-wrapper ${isExpanded ? 'expanded' : ''}`} 
           style={isExpanded ? { height: popupHeight, borderRadius: isMini ? '40px' : '32px' } : {}}>
        
        {isExpanded && (
          <>
            <div className="ai-drag-handle" onMouseDown={handleDragStart} onTouchStart={handleDragStart}></div>
            <div className="ai-chat-header flex-between">
               <div className="flex-center">
                  <div className="ai-logo-small"><Sparkles size={16} color="white" /></div>
                  <span className="ai-chat-title">COMET Smart Assistant</span>
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
               {listening && transcript && (
                 <div className="live-transcript">
                    <div className="transcript-pulse"></div>
                    <span className="live-transcript-text">{transcript}</span>
                 </div>
               )}
               
               <div className={`ai-input-pill ${listening ? 'listening' : ''}`}>
                  {listening ? (
                    <div className="voice-visualizer-symphony">
                       {[...Array(20)].map((_, i) => <div key={i} className="spectral-bar" style={{ animationDelay: `${i * 0.05}s` }} />)}
                    </div>
                  ) : (
                    <div className="voice-idle-state" onClick={() => { setAiState(AI_STATE.LISTENING); SpeechRecognition.startListening({ continuous: true, language: 'vi-VN' }); }}>
                       <Mic size={18} className="text-blue-500" />
                       <span className="idle-text">Bấm để nói yêu cầu...</span>
                    </div>
                  )}
                  <div className="ai-controls-group">
                     {listening ? (
                       <button className="ai-action-btn mic-btn pulse" onClick={() => handleAction()}>
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

        {!isExpanded && (
          <div className="ai-trigger-container" style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>
            {showNudge && (
              <div className="ai-nudge fade-in-left">
                <span className="nudge-text" onClick={() => { setIsExpanded(true); setShowNudge(false); }}>Kiểm kho ngay?</span>
                <button className="nudge-close" onClick={() => setShowNudge(false)}><X size={10} /></button>
              </div>
            )}
            <div className="ai-voice-trigger-compact" onClick={() => setIsExpanded(true)}>
               <div className="trigger-orb">
                  <div className="orb-ring"></div>
                  <Sparkles size={20} color="white" />
               </div>
               <span className="trigger-label-elegant">Trợ lý AI</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AiAssistant;
