import React, { useState, useRef, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
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
  Gift
} from 'lucide-react';

// --- TAX RATES ---
const TAX_RATES = {
  RETAIL: 0.015, // 1.5% for individual retail goods
  SERVICE: 0.075, // 7.5% for services/gift-packaging
};

// --- MOCK INVENTORY DATABASE ---
const MOCK_DB = [
  // Top 10 High-Stock Items (Bestsellers)
  { id: 1, name: "Trứng gà", emoji: "🥚", stock: 150, price: 3500, category: "Thực phẩm tươi", keywords: ["trứng", "egg"], salesTrend: 15, lastRestocked: '2024-03-10', taxCategory: 'RETAIL' },
  { id: 2, name: "Dầu Simply 1L", emoji: "🍾", stock: 85, price: 65000, category: "Gia vị", keywords: ["dầu ăn", "simply", "dầu"], salesTrend: 8, lastRestocked: '2024-03-12', taxCategory: 'RETAIL' },
  { id: 3, name: "Gạo ST25 5kg", emoji: "🍚", stock: 12, price: 185000, category: "Lương thực", keywords: ["gạo", "st25", "rice"], salesTrend: 22, lastRestocked: '2024-03-05', taxCategory: 'RETAIL' },
  { id: 4, name: "Nước mắm Nam Ngư", emoji: "🍶", stock: 120, price: 42000, category: "Gia vị", keywords: ["mắm", "nam ngư", "nước mắm"], salesTrend: 5, lastRestocked: '2024-03-14', taxCategory: 'RETAIL' },
  { id: 5, name: "Bánh mì Kinh Đô", emoji: "🍞", stock: 8, price: 15000, category: "Bánh kẹo", keywords: ["bánh mì", "kinh đô"], salesTrend: 45, lastRestocked: '2024-03-15', taxCategory: 'RETAIL' },
  { id: 6, name: "Sữa TH True Milk", emoji: "🥛", stock: 200, price: 32000, category: "Sữa", keywords: ["sữa", "th true", "milk"], salesTrend: 12, lastRestocked: '2024-03-11', taxCategory: 'RETAIL' },
  { id: 7, name: "Coca-Cola 330ml", emoji: "🥤", stock: 300, price: 10000, category: "Nước ngọt", keywords: ["coca", "coke", "nước ngọt"], salesTrend: 18, lastRestocked: '2024-03-13', taxCategory: 'RETAIL' },
  { id: 8, name: "Bột giặt Omo 2kg", emoji: "🧺", stock: 5, price: 115000, category: "Tẩy rửa", keywords: ["omo", "bột giặt"], salesTrend: 3, lastRestocked: '2024-03-01', taxCategory: 'RETAIL' },
  { id: 9, name: "Kem đánh răng PS", emoji: "🪥", stock: 90, price: 28000, category: "Vệ sinh", keywords: ["kem đánh răng", "ps"], salesTrend: 7, lastRestocked: '2024-03-08', taxCategory: 'RETAIL' },
  { id: 10, name: "Mì Hảo Hảo Tôm Cay", emoji: "🍜", stock: 500, price: 4500, category: "Mì gói", keywords: ["mì", "hảo hảo", "tôm chua cay"], salesTrend: 35, lastRestocked: '2024-03-14', taxCategory: 'RETAIL' },

  // Added OOS and low stock items
  { id: 11, name: "Tương ớt Chinsu", emoji: "🌶️", stock: 0, price: 15000, category: "Gia vị", keywords: ["tương ớt", "chinsu"], salesTrend: 0, lastRestocked: '2024-02-28', taxCategory: 'RETAIL' },
  { id: 12, name: "Bánh quy Oreo", emoji: "🍪", stock: 14, price: 25000, category: "Bánh kẹo", keywords: ["oreo", "bánh quy"], salesTrend: 15, lastRestocked: '2024-03-05', taxCategory: 'RETAIL' },
  { id: 13, name: "Khăn giấy Tempo", emoji: "🧻", stock: 0, price: 12000, category: "Vệ sinh", keywords: ["tempo", "khăn giấy"], salesTrend: 0, lastRestocked: '2024-03-01', taxCategory: 'RETAIL' },
  { id: 14, name: "Xà phòng Lifebuoy", emoji: "🧼", stock: 3, price: 18000, category: "Vệ sinh", keywords: ["lifebuoy", "xà phòng"], salesTrend: 10, lastRestocked: '2024-03-02', taxCategory: 'RETAIL' },
  { id: 15, name: "Snack khoai tây O'star", emoji: "🍟", stock: 0, price: 12000, category: "Bánh kẹo", keywords: ["ostar", "bim bim", "snack"], salesTrend: 0, lastRestocked: '2024-03-01', taxCategory: 'RETAIL' },
  { id: 24, name: "Pin Duracell AA", emoji: "🔋", stock: 4, price: 45000, category: "Gia dụng", keywords: ["pin", "duracell"], salesTrend: -5, lastRestocked: '2024-02-15', taxCategory: 'RETAIL' },
  { id: 30, name: "Trà xanh Không Độ", emoji: "🍃", stock: 2, price: 10000, category: "Nước ngọt", keywords: ["không độ", "trà xanh"], salesTrend: 55, lastRestocked: '2024-03-14', taxCategory: 'RETAIL' },

  { 
    id: 51, 
    name: "Táo Envy 1kg", 
    emoji: "🍎", 
    stock: 50, 
    price: 120000, 
    category: "Thực phẩm tươi", 
    keywords: ["táo", "envy", "táo đỏ"], 
    taxCategory: 'RETAIL' 
  },
  { 
    id: 52, 
    name: "Nho mẫu đơn 500g", 
    emoji: "🍇", 
    stock: 30, 
    price: 250000, 
    category: "Thực phẩm tươi", 
    keywords: ["nho", "mẫu đơn", "nho xanh"], 
    taxCategory: 'RETAIL' 
  },
  { 
    id: 53, 
    name: "Phí dịch vụ & Gói quà", 
    emoji: "🎀", 
    stock: 999, 
    price: 80000, 
    category: "Dịch vụ", 
    keywords: ["phí đóng gói", "công gói", "giỏ quà", "gói quà"], 
    taxCategory: 'SERVICE' 
  },
  // Previous Combo Items now referenced as individual entries
  { 
    id: 50, 
    name: "Giỏ quà Trái cây (Sẵn có)", 
    emoji: "🧺", 
    stock: 20, 
    price: 450000, 
    category: "Combo Quà", 
    keywords: ["giỏ quà sẵn", "giỏ sẵn"], 
    taxCategory: 'SERVICE', 
    comboItems: [
      { id: 51, name: "Táo Envy 1kg", price: 120000, taxCategory: 'RETAIL' },
      { id: 52, name: "Nho mẫu đơn 500g", price: 250000, taxCategory: 'RETAIL' },
      { id: 53, name: "Phí dịch vụ & Gói quà", price: 80000, taxCategory: 'SERVICE' }
    ]
  },
];

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

// AI States
const AI_STATE = {
  IDLE: 'IDLE',
  LISTENING: 'LISTENING',
  PROCESSING: 'PROCESSING',
  DONE: 'DONE',
  SUCCESS: 'SUCCESS',
  STOCK_ENTRY: 'STOCK_ENTRY', // New state for interactive restocking
  STOCK_TRANSFER: 'STOCK_TRANSFER', // New state for multi-branch transfer
  REPORTING: 'REPORTING' // New state for global reporting & tax
};

const BanHang = () => {
  const [aiState, setAiState] = useState(AI_STATE.IDLE);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [processSteps, setProcessSteps] = useState([]);
  const [oosProduct, setOosProduct] = useState(null); // Track which product is being restocked
  const [oosQueue, setOosQueue] = useState([]); // List of products pending restocking
  const [pendingOrder, setPendingOrder] = useState([]); // Items from current command
  const [activeCart, setActiveCart] = useState([]); // Persistent cart for entire session
  const [sessionHistory, setSessionHistory] = useState([]); // Log of all actions for review
  const [selectedAlt, setSelectedAlt] = useState(null); 
  const [lastActionType, setLastActionType] = useState(null); // 'OOS', 'SALE_SUCCESS', 'STOCK_SUCCESS', etc.
  const [showNudge, setShowNudge] = useState(true); // Proactive UI nudge
  const [popupHeight, setPopupHeight] = useState(550); // Default vertical height
  const [isMini, setIsMini] = useState(false); // "Flying rectangle" mode
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  
  // NEW: Stock Transfer States
  const [transferProduct, setTransferProduct] = useState(null);
  const [transferQty, setTransferQty] = useState(0);
  const [sourceBranch, setSourceBranch] = useState("Chi nhánh 1");
  const [targetBranch, setTargetBranch] = useState("Chi nhánh 2");

  // NEW: Reporting States
  const [showReportNudge, setShowReportNudge] = useState(true);
  const [isEditingCart, setIsEditingCart] = useState(false); 

  // Background scroll lock
  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add('ai-expanded');
    } else {
      document.body.classList.remove('ai-expanded');
    }
  }, [isExpanded]);

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [processSteps, aiState]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Vertical Resize Handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    dragStartHeight.current = popupHeight;
    document.body.style.userSelect = 'none'; // Prevent text selection
  };

  useEffect(() => {
    const handleDragMove = (e) => {
      if (!isDragging) return;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - dragStartY.current;
      const newHeight = Math.max(160, Math.min(window.innerHeight - 100, dragStartHeight.current - deltaY));
      
      setPopupHeight(newHeight);
      
      // Threshold for Mini Mode (Flying Rectangle)
      if (newHeight < 220) {
        setIsMini(true);
      } else {
        setIsMini(false);
      }
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

  // Auto-trigger processing after a brief pause in speech (silence detection)
  const [silenceTimer, setSilenceTimer] = useState(null);

  useEffect(() => {
    if (listening && transcript) {
      // Clear previous timer on every new word detected
      if (silenceTimer) clearTimeout(silenceTimer);
      
      // Set a new timer. If no speech for 2 seconds, trigger process.
      const timer = setTimeout(() => {
        if (aiState === AI_STATE.LISTENING) {
          handleAction();
        }
      }, 2000); // 2 second "wait" to ensure full sentence
      
      setSilenceTimer(timer);
    }
    
    return () => {
      if (silenceTimer) clearTimeout(silenceTimer);
    };
  }, [transcript, listening]);

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

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // Natural Language Quantity Parser
  const parseVietnameseQuantity = (text) => {
    const lower = text.toLowerCase();
    
    // 1. Digital + Unit (e.g. 3kg, 5 cân)
    const unitMatch = lower.match(/(\d+)\s*(kg|cân|g|l|hộp|quả|trứng|chai)/i);
    if (unitMatch) return parseInt(unitMatch[1]);

    // 2. Direct Digit check
    const digitMatch = lower.match(/\d+/);
    if (digitMatch) return parseInt(digitMatch[0]);

    // 3. Word mapping for Vietnamese numbers
    const wordMap = {
      'không': 0, 'một': 1, 'hai': 2, 'ba': 3, 'bốn': 4, 'năm': 5, 
      'sáu': 6, 'bảy': 7, 'tám': 8, 'chín': 9, 'mười': 10,
      'chục': 10, 'tá': 12, 'thùng': 24, 'két': 24, 'vỉ': 10,
      'nửa': 0.5
    };

    // Complex common phrases
    if (lower.includes('một thùng') || lower.includes('1 thùng')) return 24;
    if (lower.includes('hai thùng') || lower.includes('2 thùng')) return 48;
    
    // Check for "ba kg", "năm cân"
    for (const [word, val] of Object.entries(wordMap)) {
      if (lower.includes(`${word} kg`) || lower.includes(`${word} cân`)) return val;
    }

    // Simple word lookup
    for (const [word, val] of Object.entries(wordMap)) {
      const regex = new RegExp(`(^|\\s)${word}(\\s|$)`, 'i');
      if (regex.test(lower)) return val;
    }

    return null;
  };

  // --- Intents ---
  const resetSession = () => {
    setActiveCart([]);
    setCartCount(0);
    setPendingOrder([]);
    setOosQueue([]);
    setOosProduct(null);
    setTransferProduct(null);
    // Note: We might want to keep sessionHistory for the review action, 
    // but clear the current active cart.
  };

  const handleManualReset = async () => {
    addStep("Đang hủy giỏ hàng hiện tại...");
    await delay(800);
    resetSession();
    updateLastStep('done');
    addStep("Dạ, em đã làm mới session. Giỏ hàng hiện đã trống.", 'result', 'success');
    setAiState(AI_STATE.DONE);
  };

  const handleCheckoutIntent = async () => {
    setAiState(AI_STATE.PROCESSING);
    setIsExpanded(true);

    addStep("Đang chốt đơn và lên hoá đơn...");
    await delay(1200);
    updateLastStep('done');

    const totalAmount = activeCart.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);

    addStep(
      <div className="success-card">
         <div className="sc-icon"><CheckCircle2 size={32} color="#10B981" /></div>
         <h4 className="sc-title">Chốt đơn thành công!</h4>
         <p className="sc-desc">Hoá đơn <strong>#HD09384</strong> đã được lưu vào hệ thống.</p>
         <div className="sc-amount">Tổng thu: {totalAmount.toLocaleString()}₫</div>
      </div>,
      'result',
      'success'
    );
    await delay(400);

    // REMOVED: resetSession() - Delaying until manually finished or full flow done
    setAiState(AI_STATE.SUCCESS);
    await delay(1000);
    handleLedgerFlow();
  };

  const handleLedgerFlow = async () => {
    addStep("Đang tự động ghi sổ kế toán (Theo Thông tư 88/2021/TT-BTC)...");
    await delay(1500);
    updateLastStep('done');

    addStep(
      <div className="ledger-compliance-card fade-in">
        <div className="ledger-header">
           <ShieldCheck size={18} color="#10B981" />
           <span>Ghi sổ hoàn tất - Hợp lệ thuế</span>
        </div>
        <div className="ledger-body">
           <div className="ledger-row"><span>Mã nghiệp vụ:</span><span className="font-mono">NK156093</span></div>
           <div className="ledger-row"><span>Tài khoản:</span><span>Nợ 111 / Có 511</span></div>
           <div className="ledger-row"><span>Thuế GTGT (8%):</span><span>6.000₫</span></div>
           <div className="ledger-row"><span>Trạng thái:</span><span className="verify-badge">ĐÃ XÁC THỰC</span></div>
        </div>
         <div className="ledger-footer mt-4">
            <button className="finish-session-btn" onClick={() => handleConfirmFinalReset()}>
               Hoàn tất phiên & Sang đơn mới <RotateCcw size={14} />
            </button>
         </div>
      </div>,
      'result',
      'ledger'
    );
  };

  const handlePrintIntent = async () => {
    setAiState(AI_STATE.PROCESSING);
    setIsExpanded(true);

    addStep("Đang kết nối máy in Bluetooth...");
    await delay(1200);
    updateLastStep('done');

    addStep("Đang xuất lệnh in hoá đơn mã vạch...");
    await delay(800);
    updateLastStep('done');

    addStep(
      <div className="success-card print-success">
         <div className="sc-icon"><Printer size={32} color="#3B82F6" /></div>
         <h4 className="sc-title">Đã gửi lệnh in!</h4>
         <p className="sc-desc">Hoá đơn đang được in ra từ máy in quầy PT-210.</p>
      </div>,
      'result',
      'success'
    );
    await delay(400);
    setAiState(AI_STATE.SUCCESS);
  };

  const handleQRIntent = async () => {
    setAiState(AI_STATE.PROCESSING);
    setIsExpanded(true);

    addStep("Đang tạo mã QR thanh toán động...");
    await delay(1000);
    updateLastStep('done');

    addStep(
      <div className="qr-card fade-in">
         <div className="qr-header">Quét mã VietQR</div>
         <div className="qr-container">
            <div className="qr-real-wrapper">
               <img 
                 src="https://img.vietqr.io/image/vcb-1023456789-compact2.jpg?amount=75000&addInfo=Thanh%20toan%20HD%2009384&accountName=THE%20FRESH%20GARDEN" 
                 alt="VietQR Payment" 
                 className="qr-real-image"
               />
               <div className="qr-scan-line"></div>
            </div>
         </div>
         <div className="qr-footer">
            <div className="qr-total">75.000₫</div>
            <div className="qr-bank">Vietcombank - 10234..</div>
         </div>
      </div>,
      'result',
      'qr'
    );
    await delay(400);
    setAiState(AI_STATE.SUCCESS);
    handleLedgerFlow();
  };

  const handleQuickStockEntry = async () => {
    setAiState(AI_STATE.PROCESSING);
    const productName = oosProduct;

    addStep(`Đang chuẩn bị hệ thống nhập tồn nhanh...`);
    await delay(800);
    updateLastStep('done');

    // Calculate intelligent suggestions: low stock + high trend
    const recommendations = MOCK_DB
      .filter(i => i.stock < 15)
      .sort((a, b) => b.salesTrend - a.salesTrend)
      .slice(0, 3);

    if (productName) {
      addStep(
        <div className="agent-question premium-restock-card fade-in">
          <div className="pr-badge">YÊU CẦU NHẬP KHO</div>
          <p className="pr-title">Sẵn sàng nhập <strong>{productName}</strong></p>
          <p className="pr-subtitle">Hệ thống gợi ý nhập <strong>100 gói</strong> để tối ưu lợi nhuận.</p>
          <div className="voice-listening-indicator">
            <div className="dot"></div>
            <span>Đang nghe số lượng...</span>
          </div>
        </div>,
        'result',
        'question'
      );
    } else {
      addStep(
        <div className="stock-entry-flow-v2 fade-in">
          <div className="agent-question mb-4">
             <div className="pr-badge-blue">TƯ VẤN NHẬP HÀNG</div>
             <p className="font-bold text-slate-800 text-lg">Anh/Chị muốn nhập kho sản phẩm nào ạ?</p>
             <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">Gợi ý top xu hướng</p>
          </div>
          
          <div className="stock-suggestions-grid">
            {recommendations.map(item => (
              <div key={`rec-${item.id}`} className="stock-suggest-item-premium" onClick={() => { setOosProduct(item.name); handleQuickStockEntry(); }}>
                <div className="item-orb">{item.emoji}</div>
                <div className="item-main">
                  <span className="name">{item.name}</span>
                  <div className="trend-row">
                    <TrendingUp size={10} color="#10B981" />
                    <span className="trend">+{item.salesTrend}%</span>
                  </div>
                </div>
                <div className="item-stock-badge">
                  <span className="stock-val">{item.stock}</span>
                  <span className="stock-label">TỒN</span>
                </div>
              </div>
            ))}
          </div>

          <div className="manual-entry-form-premium mt-6">
             <div className="f-header">
                <div className="f-title"><Plus size={14} /> Nhập thủ công</div>
                <div className="f-voice-hint"><Mic size={12} /> Có thể nói để nhập</div>
             </div>
             <div className="f-row">
                <div className="f-input-group">
                   <Package size={14} className="f-icon" />
                   <input type="text" placeholder="Tên sp..." className="f-input" />
                </div>
                <div className="f-input-group w-24">
                   <Hash size={14} className="f-icon" />
                   <input type="number" placeholder="SL" className="f-input" />
                </div>
                <button className="f-submit-btn" onClick={() => handleStockConfirm(100)}>
                   <ArrowRight size={18} />
                </button>
             </div>
          </div>
        </div>,
        'result',
        'restock_form'
      );
    }
    
    setAiState(AI_STATE.STOCK_ENTRY);
  };

  const handleStockConfirm = async (qty) => {
    setAiState(AI_STATE.PROCESSING);
    const productName = oosProduct || "Sản phẩm";
    addStep(`Đang ghi nhận nhập thêm ${qty} ${productName}...`);
    await delay(1200);
    updateLastStep('done');

    addStep(
      <div className="success-card stock-success">
         <div className="sc-icon"><Database size={32} color="#8B5CF6" /></div>
         <h4 className="sc-title">Đã cập nhật tồn kho!</h4>
         <p className="sc-desc">Sản phẩm <strong>{productName}</strong> hiện tại có tồn kho: <strong>{qty}</strong></p>
         <div className="sc-tag">Vị trí: Kệ chính - Khu thực phẩm</div>
      </div>,
      'result',
      'success'
    );
    await delay(800);
    
    // ORCHESTRATION: Check if there are more items to restock
    const remainingQueue = [...oosQueue];
    if (remainingQueue.length > 0) {
      const nextProduct = remainingQueue.shift();
      setOosQueue(remainingQueue);
      setOosProduct(nextProduct.name);
      addStep(`Đã xong ${productName}. Đang xử lý sản phẩm tiếp theo...`, 'done');
      await delay(800);
      return handleQuickStockEntry(nextProduct.name);
    } else {
      setAiState(AI_STATE.DONE);
      setOosProduct(null);
      setLastActionType('STOCK_SUCCESS');
      addStep("Tất cả sản phẩm đã sẵn sàng. Đang hoàn tất giỏ hàng...", 'done');
      await delay(1000);
      // Resume the main order flow with the pending order
      const resumedItems = pendingOrder.length > 0 ? pendingOrder : [];
      return finalizeOrderFlow(resumedItems);
    }
  };

  const finalizeOrderFlow = async (items) => {
    addStep("Đang cập nhật giỏ hàng session...");
    await delay(800);
    updateLastStep('done');

    // PERSISTENCE: Accumulate items into the active cart with Quantity Aggregation
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

    // LOGGING: Record the action for history review
    const logEntry = {
      timestamp: new Date().toLocaleTimeString(),
      action: "Thêm sản phẩm",
      details: items.map(i => `${i.detectedQty || 1} ${i.name}`).join(", "),
      totalItems: newCart.reduce((sum, i) => sum + (i.quantity || 1), 0)
    };
    setSessionHistory(prev => [...prev, logEntry]);

    const comboInOrder = items.find(i => i.comboItems);
    if (comboInOrder) {
      addStep(
        <div className="tax-optimization-card premium-glass fade-in">
           <div className="opt-header">
              <Sparkles size={16} className="text-amber-500" />
              <span>Gợi ý Tối ưu Thuế AI</span>
           </div>
           <div className="opt-content mt-2">
              <p>Phát hiện <b>{comboInOrder.name}</b> đang được tính thuế <b>Dịch vụ (7.5%)</b>.</p>
              <div className="opt-compare mt-3">
                 <div className="compare-item old">
                    <small>Mặc định</small>
                    <div className="tax-pill">7.5%</div>
                    <strong>{(comboInOrder.price * TAX_RATES.SERVICE).toLocaleString()}₫ thuế</strong>
                 </div>
                 <ArrowRight size={14} className="opacity-40" />
                 <div className="compare-item new">
                    <small>Tối ưu AI</small>
                    <div className="tax-pill retail">1.5%</div>
                    <strong>{(comboInOrder.comboItems.reduce((sum, ci) => sum + (ci.price * TAX_RATES[ci.taxCategory]), 0)).toLocaleString()}₫ thuế</strong>
                 </div>
              </div>
              <p className="opt-hint mt-3">
                 AI gợi ý tách thành các item bán lẻ để áp dụng mức thuế <b>1.5%</b>. Chỉ phần đóng gói chịu thuế 7.5%.
              </p>
           </div>
           <button className="opt-apply-btn mt-4" onClick={() => handleOptimizeTax(comboInOrder.id)}>
              <CheckCircle2 size={14} /> Tối ưu Thuế ngay
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
                  <div className="rc-line-group" key={`final-retail-${item.id}-${idx}`}>
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
                  <div className="rc-line-group" key={`final-service-${item.id}-${idx}`}>
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
              <span>Tổng cộng ({newCart.reduce((sum, i) => sum + (i.quantity || 1), 0)} món)</span>
              <span className="total-val">{totalAmount.toLocaleString()}₫</span>
           </div>
           <div className="rc-tax-summary mt-2">
              <span>Ước tính thuế:</span>
              <strong>{newCart.reduce((sum, i) => sum + (i.price * i.quantity * TAX_RATES[i.taxCategory]), 0).toLocaleString()}₫</strong>
           </div>
            <div className="rc-actions mt-4 flex gap-2">
               <button className="rc-btn-secondary" onClick={() => handleManualReset()}>
                  <RotateCcw size={14} /> Hủy đơn
               </button>
               <button className="rc-btn-primary" onClick={() => handleCheckoutIntent()}>
                  <CheckCircle2 size={14} /> Thanh toán
               </button>
            </div>
         </div>
      </div>,
      'result',
      'receipt'
    );
    
    setCartCount(newCart.reduce((sum, i) => sum + (i.quantity || 1), 0));
    setPendingOrder([]);
    setLastActionType('SALE_SUCCESS');
    setAiState(AI_STATE.DONE);
  };

  const handleInventoryReport = async () => {
    setAiState(AI_STATE.PROCESSING);
    addStep("Đang phân tích dữ liệu tồn kho toàn hệ thống...");
    await delay(1500);
    updateLastStep('done');

    // 1. ANALYTICS ENGINE (Using enriched MOCK_DB)
    const lowStock = MOCK_DB.filter(i => i.stock > 0 && i.stock < 15);
    const bestSellers = [...MOCK_DB].sort((a, b) => b.salesTrend - a.salesTrend).slice(0, 3);
      
    addStep(
      <div className="inventory-report-card fade-in">
        <div className="ir-header"><BarChart2 size={18} /> Báo cáo Trí tuệ Tồn kho</div>
        
        <div className="ir-section">
          <div className="ir-section-title text-orange-600"><TrendingDown size={14}/> Sắp hết hàng (Cần nhập ngay)</div>
          <div className="ir-list">
             {lowStock.length > 0 ? (
               lowStock.map(i => <div key={`ls-${i.id}`} className="ir-item"><span>{i.name}</span><span className="stock-red">{i.stock}</span></div>)
             ) : (
               <div className="ir-empty">Tồn kho hiện tại đang ổn định.</div>
             )}
          </div>
        </div>

        <div className="ir-section mt-4">
          <div className="ir-section-title text-green-600"><TrendingUp size={14}/> Top Bán chạy (Theo xu hướng)</div>
          <div className="ir-list">
             {bestSellers.map(i => (
               <div key={`bs-${i.id}`} className="ir-item">
                 <span>{i.name}</span>
                 <span className="stock-green">+{i.salesTrend}%</span>
               </div>
             ))}
          </div>
        </div>

        <div className="ir-note mt-4">
          <Info size={14} /> <b>Gợi ý điều chuyển:</b> Hệ thống gợi ý chuyển 150 <i>Trứng gà</i> từ Kho A sang Quầy chính để tối ưu doanh thu giờ cao điểm.
        </div>
      </div>,
      'result',
      'analytics'
    );

    setLastActionType('INVENTORY_REPORT');
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
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleDynamicWrapping = async () => {
    if (activeCart.length === 0) {
      addStep("Dạ, giỏ hàng đang trống. Anh/Chị vui lòng chọn sản phẩm trước khi yêu cầu đóng giỏ quà nhé!", 'result', 'info');
      return setAiState(AI_STATE.DONE);
    }

    setAiState(AI_STATE.PROCESSING);
    addStep("Đang phân tích giỏ hàng để tối ưu quy cách đóng gói...");
    await delay(1200);
    updateLastStep('done');

    const fruitItems = activeCart.filter(item => item.category === "Thực phẩm tươi" || item.category === "Lương thực");
    const giftItems = activeCart.filter(item => item.category === "Bánh kẹo" || item.category === "Gia vị");
    
    addStep(
      <div className="dynamic-wrap-card premium-glass fade-in">
         <div className="opt-header">
            <Sparkles size={16} className="text-amber-500" />
            <span>Trí tuệ Bán hàng AI: Tối ưu Giỏ quà</span>
         </div>
         <div className="opt-content mt-2">
            <p>Dạ em nhận lệnh! Em sẽ giúp mình đóng <b>{activeCart.length} mặt hàng</b> này thành giỏ quà chuyên nghiệp.</p>
            <div className="opt-advice bg-blue-50/50 p-3 rounded-xl mt-3 border border-blue-100">
               <p className="text-[12px] text-blue-800 leading-normal">
                 💡 <b>Mẹo tối ưu:</b> Nếu lên đơn là "Dịch vụ giỏ quà", mình sẽ chịu <b>7.5% thuế</b> trên toàn bộ giá trị. 
                 Em sẽ tách riêng: <b>Hàng hóa (1.5%)</b> + <b>Phí đóng gói (7.5%)</b> để mình đóng thuế ít nhất nha!
               </p>
            </div>
            <div className="opt-compare mt-3">
               <div className="compare-item">
                  <small>Thuế cũ (7.5%)</small>
                  <strong className="text-red-500">{(activeCart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.075).toLocaleString()}₫</strong>
               </div>
               <ArrowRight size={14} className="opacity-40" />
               <div className="compare-item">
                  <small>Thuế sau Tối ưu</small>
                  <strong className="text-green-600">{(activeCart.reduce((sum, item) => sum + (item.price * item.quantity * 0.015), 0) + (80000 * 0.075)).toLocaleString()}₫</strong>
               </div>
            </div>
         </div>
         <div className="opt-actions-row mt-4">
            <button className="opt-secondary-btn" onClick={() => setAiState(AI_STATE.DONE)}>Để sau</button>
            <button className="opt-apply-btn flex-1" onClick={() => executeDynamicWrap()}>
               <Gift size={14} /> Chốt Giỏ quà Tối ưu
            </button>
         </div>
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const executeDynamicWrap = async () => {
    setAiState(AI_STATE.PROCESSING);
    addStep("Đang tạo nghiệp vụ đóng gói & áp mã thuế lẻ...");
    await delay(1000);
    
    // Create the packaging fee item
    const packagingFee = {
      id: `fee-${Date.now()}`,
      name: "Phí đóng gói & Giỏ quà linh hoạt",
      price: 80000,
      quantity: 1,
      taxCategory: 'SERVICE'
    };
    
    // We calculate the new cart locally to render it immediately in the UI
    const updatedCart = [...activeCart, packagingFee];
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
      <div className="tax-optimization-success premium-glass fade-in">
         <div className="flex-center gap-2">
            <CheckCircle2 size={24} className="text-green-500 animate-bounce" />
            <h4 className="m-0">Tối ưu Thành công!</h4>
         </div>
         <p className="mt-2 mb-4">Hoá đơn đã được tách dòng để áp thuế <b>1.5%</b>.</p>
         
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
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const removeCartItem = (id) => {
    setActiveCart(prev => prev.filter(item => item.id !== id));
    setCartCount(prev => Math.max(0, prev - 1));
  };

  const handleEditOrder = async () => {
    setAiState(AI_STATE.PROCESSING);
    addStep("Đang mở chế độ chỉnh sửa đơn hàng...");
    await delay(800);
    updateLastStep('done');
    setIsEditingCart(true);
    setLastActionType('EDIT_MODE');
    addStep(
      <div className="edit-instruction">
        <Sparkles size={16} /> <b>Chế độ Sửa Đơn:</b> Click <Plus size={14}/>/<Minus size={14}/> để đổi số lượng hoặc <Trash2 size={14}/> để xóa.
      </div>,
      "result",
      "info"
    );
    setAiState(AI_STATE.DONE);
  };

  const handleShare = async () => {
    addStep("Đang chuẩn bị file hình ảnh hóa đơn...");
    await delay(800);
    updateLastStep('done');
    alert("Đã mở trình chia sẻ hệ thống!");
  };



  const handleOOSFlow = async (productName = "Sản phẩm") => {
    setAiState(AI_STATE.PROCESSING);
    setOosProduct(productName); // Lock the context for restocking
    setIsExpanded(true);

    addStep("Đang kiểm tra tồn kho chi tiết...");
    await delay(1000);
    updateLastStep('done');

    addStep(
      <div className="oos-alert-card">
         <div className="oos-header flex-center">
            <AlertTriangle size={20} color="#EF4444" />
            <h4 className="oos-title">Hết hàng trong kho</h4>
         </div>
         <p className="oos-desc">Sản phẩm <strong>{productName}</strong> hiện tại có tồn kho bằng 0.</p>
         
         <div className="oos-supplier-list">
            <div className="oos-supplier-item">
               <div className="ncc-info">
                  <span className="ncc-name">NCC Tổng hợp Miền Bắc</span>
                  <span className="ncc-price">Giá nhập: --.---₫</span>
               </div>
               <button className="ncc-btn">Đặt hàng</button>
            </div>
            <div className="oos-supplier-item">
               <div className="ncc-info">
                  <span className="ncc-name">Đại lý phân phối ECO</span>
                  <span className="ncc-price">Giá tốt: Ưu đãi</span>
               </div>
               <button className="ncc-btn">Đặt hàng</button>
            </div>
         </div>
      </div>,
      'result',
      'oos'
    );
    await delay(1000);
    setLastActionType('OOS');
    setAiState(AI_STATE.DONE);
  };

  const simulateProcessing = async (text = "Voice command") => {
    // Show user transcript as a chat bubble first
    addStep(text, 'result', 'user');
    setAiState(AI_STATE.PROCESSING);
    setIsExpanded(true);
    await delay(600);
    
    const lowerText = text.toLowerCase();
    
    // NEW: Define clear intents globally
    const isInventoryReport = lowerText.includes('kiểm') || lowerText.includes('báo cáo') || lowerText.includes('tình hình');
    const isRestockIntent = (lowerText.includes('nhập') || lowerText.includes('bổ sung') || lowerText.includes('đặt hàng')) && !isInventoryReport;
    const isTransferIntent = lowerText.includes('điều chuyển') || lowerText.includes('chuyển kho') || lowerText.includes('chuyển sang');
    const isSaleIntent = (lowerText.includes('mua') || lowerText.includes('bán') || lowerText.includes('lấy') || (lowerText.includes('thêm') && !isRestockIntent && !isTransferIntent));
    
    // 0. PRIORITY: Inventory Report / Analytics
    if (isInventoryReport && (lowerText.includes('kho') || lowerText.includes('tồn'))) {
      return handleInventoryReport();
    }

    // 1. SMART CONTEXTUAL HANDLING (Strict Mode Locking)
    if (aiState === AI_STATE.STOCK_ENTRY || isRestockIntent) {
      // Force all detection into Restocking logic
      const detectedItems = MOCK_DB.filter(item => 
        item.keywords.some(k => lowerText.includes(k.toLowerCase())) || 
        lowerText.includes(item.name.toLowerCase())
      );
      
      const qty = parseVietnameseQuantity(text);
      
      if (detectedItems.length > 0) {
        // If multiple, use the first one or queue them
        const primary = detectedItems[0];
        setOosProduct(primary.name);
        if (qty !== null) {
           addStep(`Nhận diện Lệnh Nhập Kho: ${primary.name} + Số lượng: ${qty}`, 'done');
           return handleStockConfirm(qty);
        } else {
           addStep(`Nhận diện sản phẩm nhập: ${primary.name}. Anh/Chị muốn nhập bao nhiêu ạ?`, 'done');
           return handleQuickStockEntry(); 
        }
      } else if (qty !== null && oosProduct) {
        addStep(`Phát hiện số lượng nhập cho ${oosProduct}: ${qty}`, 'done');
        return handleStockConfirm(qty);
      }
      
      // If no product detected but explicitly said 'nhập', ask for product
      if (isRestockIntent) {
        addStep("Anh/Chị muốn nhập kho sản phẩm nào ạ? Em đã mở chế độ Nhập Kho.", 'done');
        return handleQuickStockEntry();
      }
    }

    // 1.1 STOCK TRANSFER INTENT
    if (aiState === AI_STATE.STOCK_TRANSFER || isTransferIntent) {
      const detectedItems = MOCK_DB.filter(item => 
        item.keywords.some(k => lowerText.includes(k.toLowerCase())) || 
        lowerText.includes(item.name.toLowerCase())
      );
      const qty = parseVietnameseQuantity(text);
      
      // Branch detection
      const branchMatch = text.match(/chi nhánh (\d+)/i);
      if (branchMatch) {
         setTargetBranch(`Chi nhánh ${branchMatch[1]}`);
      }

      if (detectedItems.length > 0) {
        const primary = detectedItems[0];
        setTransferProduct(primary);
        if (qty !== null) {
          setTransferQty(qty);
          addStep(`Nhận diện Lệnh Chuyển Kho: ${primary.name} x${qty} sang ${branchMatch ? `Chi nhánh ${branchMatch[1]}` : targetBranch}`, 'done');
          return handleStockTransfer(primary, qty);
        } else {
          addStep(`Đã chọn sản phẩm: ${primary.name}. Anh/Chị muốn chuyển bao nhiêu ạ?`, 'done');
          return handleStockTransfer(primary, transferQty);
        }
      } else if (qty !== null && transferProduct) {
         setTransferQty(qty);
         addStep(`Cập nhật số lượng chuyển: ${qty}`, 'done');
         return handleStockTransfer(transferProduct, qty);
      }

      if (isTransferIntent) {
        addStep("Anh/Chị muốn điều chuyển sản phẩm nào và sang chi nhánh mấy ạ?", 'done');
        return handleStockTransfer();
      }
    }

    // 2. ACTION INTENTS (Strict Matching) - Check these before product detection to avoid overlap
    if (lowerText.includes('chốt đơn') || lowerText.includes('thanh toán') || lowerText.includes('trả tiền')) {
      return handleCheckoutIntent();
    }

    if (lowerText.includes('hủy') || lowerText.includes('xóa giỏ') || lowerText.includes('làm mới')) {
      addStep("Đang hủy giỏ hàng hiện tại...");
      await delay(800);
      resetSession();
      updateLastStep('done');
      addStep("Dạ, em đã làm mới session. Giỏ hàng hiện đã trống, sẵn sàng cho đơn hàng mới của Anh/Chị ạ!", 'result', 'success');
      return setAiState(AI_STATE.DONE);
    }
    
    // NEW: Reporting Specific Intents
    if (lowerText.includes('báo cáo') || lowerText.includes('thống kê') || lowerText.includes('thuế') || lowerText.includes('két tiền')) {
       if (lowerText.includes('thuế')) {
          addStep("Đang trích xuất dữ liệu kê khai thuế quý này...");
          setAiState(AI_STATE.PROCESSING);
          await delay(1500);
          updateLastStep('done');
          addStep(
            <div className="tax-report-elite premium-glass">
               <div className="elite-card-header">
                  <ShieldCheck size={18} className="text-red-500" />
                  <span>BÁO CÁO THUẾ Q2/2024</span>
               </div>
               <div className="tax-grid-detailed mt-4">
                  <div className="tax-item">
                     <p>Tổng doanh thu</p>
                     <strong>152.400.000đ</strong>
                  </div>
                  <div className="tax-item">
                     <p>Thuế GTGT (10%)</p>
                     <strong>15.240.000đ</strong>
                  </div>
                  <div className="tax-item">
                     <p>Lợi nhuận ròng</p>
                     <strong>48.600.000đ</strong>
                  </div>
                  <div className="tax-item">
                     <p>Hạn nộp</p>
                     <strong className="text-red-500">31/07/2024</strong>
                  </div>
               </div>
               <div className="tax-compliance-badge mt-4">
                  <CheckCircle2 size={12} />
                  Dữ liệu đã được đồng bộ với Tổng cục Thuế
               </div>
               <button className="elite-primary-btn mt-4">Kết xuất Tờ khai PDF</button>
            </div>, 'result'
          );
          return setAiState(AI_STATE.DONE);
       }
       
       if (lowerText.includes('thống kê') || lowerText.includes('số liệu')) {
          addStep("Đang tổng hợp số liệu kinh doanh hôm nay...");
          setAiState(AI_STATE.PROCESSING);
          await delay(1200);
          updateLastStep('done');
          addStep(
            <div className="stats-dashboard-premium premium-glass">
               <div className="stats-header-row">
                  <div className="stats-main-val">
                     <p>Doanh thu hôm nay</p>
                     <h3>8.420.000đ</h3>
                     <span className="growth-indicator positive">
                        <TrendingUp size={12} /> +12% so với hôm qua
                     </span>
                  </div>
                  <div className="stats-orders-circle">
                     <strong>42</strong>
                     <span>Đơn hàng</span>
                  </div>
               </div>
               
               <div className="stats-chart-mini mt-6">
                  <div className="chart-bar-container">
                     {[45, 60, 85, 40, 95, 70, 80].map((h, i) => (
                        <div key={i} className="chart-bar-item">
                           <div className="bar-fill" style={{ height: `${h}%` }}></div>
                           <span>T{i+2}</span>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="stats-top-products mt-4">
                  <p className="mini-label">Bán chạy nhất:</p>
                  <div className="top-item-row">
                     <span>1. Nước mắm Nam Ngư</span>
                     <strong>12 chai</strong>
                  </div>
                  <div className="top-item-row">
                     <span>2. Trứng gà ta</span>
                     <strong>8 vỉ</strong>
                  </div>
               </div>
            </div>, 'result'
          );
          return setAiState(AI_STATE.DONE);
       }

       if (lowerText.includes('két')) {
          addStep("Đang kiểm số dư két tiền mặt...");
          setAiState(AI_STATE.PROCESSING);
          await delay(1000);
          updateLastStep('done');
          addStep(
            <div className="cash-audit-elite premium-glass">
               <div className="audit-header">
                  <Banknote size={20} className="text-green-500" />
                  <span>KIỂM KÉT TIỀN MẶT</span>
               </div>
               <div className="cash-main-total mt-4">
                  <small>Tổng tiền trong két</small>
                  <h3>12.500.000đ</h3>
               </div>
               <div className="cash-breakdown mt-4">
                  <div className="bd-row"><span>Tiền đầu ca:</span> <strong>2.000.000đ</strong></div>
                  <div className="bd-row"><span>Bán hàng (mặt):</span> <strong>10.500.000đ</strong></div>
                  <div className="bd-row"><span>Rút tiền:</span> <strong className="text-red-500">0đ</strong></div>
               </div>
               <div className="audit-actions-row mt-6">
                  <button className="audit-btn outline">Lịch sử két</button>
                  <button className="audit-btn primary">Chốt két & In</button>
               </div>
            </div>, 'result'
          );
          return setAiState(AI_STATE.DONE);
       }

       // DEEP DRILL-DOWN VOICE HANDLER
       if (lowerText.includes('chi tiết') || lowerText.includes('tiếp theo') || lowerText.includes('bước')) {
          // Stats Flow Keywords
          if (lowerText.includes('2') || lowerText.includes('cơ cấu') || lowerText.includes('ngành hàng')) return handleGlobalReporting(2);
          if (lowerText.includes('3') || lowerText.includes('giờ cao điểm') || lowerText.includes('thời gian')) return handleGlobalReporting(3);
          if (lowerText.includes('4') || lowerText.includes('gợi ý ai') || lowerText.includes('bất thường')) return handleGlobalReporting(4);
          if (lowerText.includes('5') || lowerText.includes('chiến lược') || lowerText.includes('hành động')) return handleGlobalReporting(5);
          
          // Cash Flow Keywords
          if (lowerText.includes('két') || lowerText.includes('tiền mặt')) return handleGlobalReporting(21);
          if (lowerText.includes('biến động ca')) return handleGlobalReporting(22);
          if (lowerText.includes('lịch sử két')) return handleGlobalReporting(23);
          if (lowerText.includes('đối soát két')) return handleGlobalReporting(24);
          if (lowerText.includes('chốt ca')) return handleGlobalReporting(25);

          // Default sequential progression
          const currentStepIndicator = processSteps.find(s => s.content?.props?.className?.includes('step-indicator'))?.content?.props?.children;
          if (currentStepIndicator) {
             const currentStepMatch = currentStepIndicator.match(/\d/);
             const currentStep = currentStepMatch ? parseInt(currentStepMatch[0]) : 0;
             const isTaxFlow = currentStepIndicator.includes('THUẾ');
             const isCashFlow = currentStepIndicator.includes('TIỀN MẶT') || currentStepIndicator.includes('CA') || currentStepIndicator.includes('KÉT');
             
             if (isTaxFlow && currentStep < 5) return handleGlobalReporting(10 + currentStep + 1);
             if (isCashFlow && currentStep < 5) return handleGlobalReporting(20 + currentStep + 1);
             if (!isTaxFlow && !isCashFlow && currentStep < 5) return handleGlobalReporting(currentStep + 1);
          }
       }

       return handleGlobalReporting();
    }

    if (lowerText.includes('gói quà') || lowerText.includes('giỏ quà') || lowerText.includes('đóng giỏ')) {
       return handleDynamicWrapping();
    }

    if (lowerText.includes('in hoá đơn') || lowerText.includes('xuất hoá đơn') || lowerText.includes('in phiếu')) {
      return handlePrintIntent();
    }
    if (lowerText.includes('qr') || lowerText.includes('chuyển khoản')) {
      return handleQRIntent();
    }
    if (lowerText.includes('thuế')) {
      addStep("Đang truy xuất dữ liệu thuế niên độ hiện tại...");
      await delay(1200);
      updateLastStep('done');
      addStep("Em đã mở mục Quản lý thuế. Anh/Chị có muốn xem báo cáo thuế quý này hay xuất tờ khai không ạ?", 'result');
      return setAiState(AI_STATE.DONE);
    }
    if (lowerText.includes('két tiền') || lowerText.includes('kết số dư')) {
      addStep("Đang kiểm tra kết số dư két tiền mặt...");
      await delay(1000);
      updateLastStep('done');
      addStep("Dạ, em thấy số dư két hiện tại là 12,500,000đ. Anh/Chị có muốn thực hiện rút tiền hay nạp thêm vào két không?", 'result');
      return setAiState(AI_STATE.DONE);
    }

    if (lowerText.includes('review') || lowerText.includes('lịch sử') || lowerText.includes('thống kê')) {
      addStep("Đang tổng hợp lịch sử phiên làm việc...");
      await delay(1200);
      updateLastStep('done');
      
      if (sessionHistory.length === 0) {
        addStep("Dạ, em chưa ghi nhận hành động nào trong phiên này. Anh/Chị muốn bắt đầu bán hàng hay kiểm kho không?", 'result');
      } else {
        addStep(
          <div className="session-log-card">
            <div className="log-header"><History size={16} /> Lịch sử vận hành (Session)</div>
            <div className="log-list">
               {sessionHistory.map((log, idx) => (
                 <div className="log-item" key={`log-${idx}`}>
                    <small className="log-time">{log.timestamp}</small>
                    <div className="log-main">
                      <span className="log-action">{log.action}</span>
                      <span className="log-details">{log.details}</span>
                    </div>
                 </div>
               ))}
            </div>
            <div className="log-footer">
               Tổng số hành động: {sessionHistory.length}
            </div>
          </div>,
          'result'
        );
      }
      return setAiState(AI_STATE.DONE);
    }

    if (lowerText.includes('tồn kho') || lowerText.includes('kiểm kho') || lowerText.includes('sản phẩm bán chạy')) {
      return handleInventoryReport();
    }

    // 3. PRODUCT ENTITY RESOLUTION & ORDER ORCHESTRATION
    addStep("Đang quét giỏ hàng & tồn kho...");
    await delay(1000);
    updateLastStep('done');

    // Identify ALL items mentioned with potential quantities
    // NEW: Exclusive Range Consumption (prevents "mì" from matching inside "bánh mì")
    const detected = [];
    const normalizedText = lowerText.replace(/[.,!?]/g, " ");
    const consumedRanges = [];

    // 1. Index all searchable items (including nested items if any)
    const allKeywords = [];
    MOCK_DB.forEach(item => {
      item.keywords.forEach(kw => {
        allKeywords.push({ item, kw, length: kw.length });
      });
    });
    // Ensure we also search for partial matches or names if no keyword matches
    allKeywords.sort((a, b) => b.length - a.length);

    // 2. Consume ranges for matches
    allKeywords.forEach(({ item, kw }) => {
      // Find occurrences. We now use a more flexible word boundary for Vietnamese
      const regex = new RegExp(`(^|\\s|\\d)${kw}(\\s|$|\\d)`, 'gi');
      let m;
      while ((m = regex.exec(normalizedText)) !== null) {
        let startIdx = m.index;
        let endIdx = m.index + m[0].length;
        
        // Adjust indices to remove potential surrounding chars from the match range
        if (m[1]) startIdx += m[1].length;
        if (m[2]) endIdx -= m[2].length;

        const isOverlapping = consumedRanges.some(range => 
          (startIdx >= range.start && startIdx < range.end) || 
          (endIdx > range.start && endIdx <= range.end)
        );

        if (!isOverlapping) {
          consumedRanges.push({ start: startIdx, end: endIdx });
          
          // QUANTITY ASSOCIATION: Improved window context
          const contextStart = Math.max(0, startIdx - 35);
          const contextEnd = Math.min(lowerText.length, endIdx + 15);
          const window = lowerText.substring(contextStart, contextEnd);
          const qty = parseVietnameseQuantity(window);

          const existing = detected.find(d => d.id === item.id);
          if (!existing) {
            detected.push({ ...item, detectedQty: qty });
          }
        }
      }
    });

    // 2b. Fallback: Check if item names are mentioned directly if no keywords triggered
    if (detected.length === 0) {
       MOCK_DB.forEach(item => {
          if (normalizedText.includes(item.name.toLowerCase())) {
             detected.push({ ...item, detectedQty: parseVietnameseQuantity(normalizedText) });
          }
       });
    }

    // Sort detected items by their appearance in the text (optional but helps UX)

    if (detected.length > 0) {
      setPendingOrder(detected);
      const inStock = detected.filter(i => i.stock > 0);
      const outOfStock = detected.filter(i => i.stock === 0);

      // Distinguish between Sales Intent and Restock Intent

      // Handle Simultaneous Batch Restocking ONLY if it's an explicit Restock Intent
      if (isRestockIntent) return;
      if (false) {
         addStep(
           <div className="batch-success-card">
              <div className="batch-header"><CheckSquare size={18} /> Đã nhận diện lệnh nhập kho đồng thời</div>
              <div className="batch-list">
                 {batchRestock.map(br => (
                   <div className="batch-item" key={`batch-${br.id}`}>
                      <span>{br.name}</span> <ArrowRight size={14} /> <span>+{br.detectedQty}</span>
                   </div>
                 ))}
              </div>
           </div>,
           'result',
           'success'
         );
         await delay(1200);
         // Filter out items already batch-restocked from the sequential queue
         const remainingOos = outOfStock.filter(i => i.detectedQty === null);
         
         if (remainingOos.length > 0) {
            setOosQueue(remainingOos);
            setOosProduct(remainingOos[0].name);
            return handleOOSFlow(remainingOos[0].name);
         } else {
            return finalizeOrderFlow(detected);
         }
      }

      if (outOfStock.length > 0) {
        // Find alternatives for OOS items
        const suggestions = outOfStock.map(oos => ({
          original: oos,
          alternatives: MOCK_DB.filter(i => i.category === oos.category && i.stock > 0).slice(0, 2)
        }));

        addStep(
          <div className="detected-text">
            Phát hiện: <span className="font-bold text-blue-600">{detected.map(i => i.name).join(", ")}</span>. <br/>
            {outOfStock.length > 0 && <span className="text-red-500 font-bold">⚠️ Có {outOfStock.length} mục thiếu hàng.</span>}
          </div>, 
          'result'
        );
        await delay(800);

        if (suggestions.some(s => s.alternatives.length > 0)) {
           addStep(
             <div className="alternatives-container fade-in">
               <div className="alt-title">Gợi ý thay thế còn hàng:</div>
               <div className="alt-list swipe-x">
                  {suggestions.flatMap(s => s.alternatives).map(alt => (
                    <div className="alt-card" key={`alt-${alt.id}`} onClick={() => { addStep(`Đã đổi sang ${alt.name}`, 'done'); setSelectedAlt(alt); }}>
                      <span className="alt-emoji">{alt.emoji}</span>
                      <span className="alt-name">{alt.name}</span>
                      <span className="alt-stock">Tồn: {alt.stock}</span>
                    </div>
                  ))}
               </div>
             </div>,
             'result'
           );
           await delay(1000);
        }

        // Start restocking flow for the first OOS item
        const firstOos = outOfStock[0];
        const remainingQueue = outOfStock.slice(1);
        setOosQueue(remainingQueue);
        setOosProduct(firstOos.name);
        
        return handleOOSFlow(firstOos.name);
      } else {
        // All items in stock - proceed normally
        return finalizeOrderFlow(detected);
      }
    }

    addStep("Xin lỗi, em chưa tìm thấy sản phẩm này trong kho. Anh/Chị có muốn em tìm kiếm trên danh mục NCC không?", 'result');
    setAiState(AI_STATE.DONE);
  };

  const handleAction = () => {
    if (aiState === AI_STATE.LISTENING) {
      SpeechRecognition.stopListening();
      simulateProcessing(transcript || "Voice request");
    } else {
      handleMicClick();
    }
  };

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      setAiState(AI_STATE.LISTENING);
      setIsExpanded(true);
      SpeechRecognition.startListening({ continuous: true, language: 'vi-VN' });
    }
  };

  const handleStockTransfer = (product = transferProduct, qty = transferQty) => {
    setAiState(AI_STATE.STOCK_TRANSFER);
    setLastActionType('TRANSFER');
    addStep(
      <div className="ai-transfer-card premium-glass">
        <div className="transfer-header">
           <Truck size={18} className="text-blue-500" />
           <span>Lệnh điều chuyển kho</span>
        </div>
        
        <div className="transfer-main mt-4">
           {product ? (
             <div className="transfer-item-box">
                <span className="item-emoji">{product.emoji}</span>
                <div className="item-details">
                   <p className="item-name">{product.name}</p>
                   <p className="item-stock">Tồn hiện tại: {product.stock}</p>
                </div>
                <div className="item-qty-badge">x{qty || '?'}</div>
             </div>
           ) : (
             <div className="transfer-suggestions">
                <p className="suggestion-label small mb-2">Gợi ý sản phẩm cần chuyển (Tồn cao):</p>
                <div className="suggestion-pill-row">
                   {MOCK_DB.filter(i => i.stock > 100).map(item => (
                     <div key={item.id} className="suggest-pill-premium" onClick={() => handleStockTransfer(item, transferQty)}>
                        {item.emoji} {item.name}
                     </div>
                   ))}
                </div>
             </div>
           )}

           <div className="transfer-path mt-6">
              <div className="path-node source">
                 <div className="node-icon"><User size={14}/></div>
                 <span>{sourceBranch}</span>
              </div>
              <div className="path-arrow">
                 <div className="arrow-line"></div>
                 <ChevronRight size={16} className="arrow-head" />
              </div>
              <div className="path-node target active">
                 <div className="node-icon"><Smartphone size={14}/></div>
                 <span>{targetBranch}</span>
              </div>
           </div>
        </div>

        {product && qty > 0 && (
          <button className="confirm-transfer-btn mt-6" onClick={() => confirmTransfer(product, qty)}>
             Xác nhận chuyển kho
          </button>
        )}
      </div>,
      'result'
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
      'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
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
      </div>, 'result'
    );
  };

  const closeAssistant = () => {
    setIsExpanded(false);
    setAiState(AI_STATE.IDLE);
    setProcessSteps([]);
    setOosProduct(null);
    setShowNudge(true); // BUG FIX: Re-enable nudge when assistant collapses
    setPopupHeight(550); // Reset to standard height
    setIsMini(false);
    
    // Reset transfer states
    setTransferProduct(null);
    setTransferQty(0);
    setTargetBranch("Chi nhánh 2");
  };

  // Horizontal swipe lock is handled via CSS on ai-assistant-wrapper


  return (
    <div className="ban-hang-page">
      <div className="bh-header-bg">
        <div className="status-bar flex-between text-dark">
          <span className="time text-bold">7:01</span>
          <div className="status-icons flex-center">
            <span className="icon-placeholder text-xs">📶 5G</span>
            <span className="icon-placeholder text-xs">🔋 100</span>
          </div>
        </div>

        <div className="bh-shop-info flex-between">
          <div className="shop-profile flex-center">
            <div className="shop-avatar"><User size={36} color="#3B82F6" strokeWidth={1.5} /></div>
            <div className="shop-details">
              <h2 className="shop-name">THE FRESH GARDEN</h2>
              <p className="shop-phone">093 366 0805</p>
            </div>
          </div>
          <div className="shop-actions flex-center">
            <button className="round-icon-btn"><Bell size={20} color="#1F2937" /></button>
            <button className="round-icon-btn"><Settings size={20} color="#1F2937" /></button>
          </div>
        </div>

        <div className="revenue-card">
          <div className="revenue-cols flex-between">
            <div className="rev-col"><p className="rev-label">Doanh thu ngày</p><p className="rev-value">Chưa phát sinh giao dịch</p></div>
            <div className="rev-divider"></div>
            <div className="rev-col pl-4"><p className="rev-label">Đơn trong ngày</p><p className="rev-value">Chưa phát sinh giao dịch</p></div>
          </div>
          <div className="rev-footer"><span>-</span></div>
        </div>
      </div>

      <div className="bh-content-area">
        <div className="bh-banners">
          <div className="trial-banner flex-between">
            <span>Gói dùng thử: <span className="trial-days">12</span> ngày</span>
            <span className="upgrade-link">Nâng cấp gói <ChevronRight size={14} /></span>
          </div>
          <div className="pos-banner">
            <div className="new-badge">Mới ra mắt</div>
            <div className="pos-content">
              <div className="pos-text">
                <h3>Bán hàng tại quầy</h3>
                <p>Bán hàng & xuất hóa đơn nhanh, tuân thủ Nghị định 70 của Chính phủ</p>
                <button className="btn-create-order">Tạo đơn ngay</button>
              </div>
              <div className="pos-image-placeholder"><span className="pos-emoji">📠</span></div>
            </div>
          </div>
        </div>

        <section className="dashboard-section">
          <h3 className="section-title text-dark">Nghiệp vụ cửa hàng</h3>
          <div className="dashboard-grid">
            {NGHIEP_VU_ITEMS.map(item => (
              <div key={item.id} className="dash-item">
                <div className="dash-icon-container">{item.icon}</div>
                <span className="dash-name">{item.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section mt-6">
          <h3 className="section-title text-dark">Báo cáo</h3>
          <div className="dashboard-grid report-grid">
            {BAO_CAO_ITEMS.map(item => (
              <div key={item.id} className="dash-item">
                <div className="dash-icon-container">{item.icon}</div>
                <span className="dash-name">{item.name}</span>
              </div>
            ))}
          </div>
        </section>
        <div style={{height: '100px'}}></div>
      </div>

      {isExpanded && <div className="ai-backdrop fade-in" onClick={closeAssistant}></div>}

      <div 
        className={`ai-assistant-wrapper ${isExpanded ? 'expanded' : ''} ${aiState === AI_STATE.STOCK_ENTRY ? 'restocking-mode' : ''} ${isMini ? 'mini-mode' : ''} ${isDragging ? 'resizing' : ''}`}
        style={isExpanded ? { height: isMini ? '100px' : `${popupHeight}px` } : {}}
      >
        {isExpanded && (
          <>
            {aiState !== AI_STATE.LISTENING && (
              <div className="ai-floating-shortcuts-exterior">
                 <button className="floating-shortcut-btn inventory" onClick={() => handleInventoryReport()}>
                    <div className="btn-glow"></div>
                    <Package size={16} /> <span>Kiểm kho ngay</span>
                 </button>
                 <button className="floating-shortcut-btn reporting" onClick={() => handleGlobalReporting()}>
                    <div className="btn-glow"></div>
                    <FileBarChart size={16} /> <span>Báo cáo</span>
                 </button>
              </div>
            )}
            <div className="ai-resize-handle" onMouseDown={handleDragStart} onTouchStart={handleDragStart}>
               <div className="resize-indicator"></div>
            </div>
            <div className="ai-chat-header flex-between" style={{ display: isMini ? 'none' : 'flex' }}>
              <div className="flex-center">
                <Sparkles size={20} color={aiState === AI_STATE.STOCK_ENTRY ? "#F59E0B" : "#0056D2"} />
                <h4 className="ai-chat-title">{aiState === AI_STATE.STOCK_ENTRY ? "Trí tuệ Tồn kho AI" : "Trợ lý Fresh Garden"}</h4>
              </div>
              <button className="icon-btn-gray" onClick={closeAssistant}><X size={20} /></button>
            </div>

            {isMini && (
              <div className="ai-mini-content fade-in-up" onClick={() => { setPopupHeight(550); setIsMini(false); }}>
                <div className="mini-orb-compact">
                   <Sparkles size={16} color="white" />
                </div>
                <div className="mini-status-text">
                  <span>Trợ lý đang thu nhỏ</span>
                  <small>Vuốt lên để mở rộng</small>
                </div>
                <div className="mini-actions">
                   <button className="mini-close" onClick={(e) => { e.stopPropagation(); closeAssistant(); }}><X size={14} /></button>
                </div>
              </div>
            )}
            
            <div className="ai-chat-body" style={{ display: isMini ? 'none' : 'block' }}>
              {aiState === AI_STATE.LISTENING && (
                <div className="siri-visualizer">
                  <div className="siri-orb">
                    <div className="orb-layer layer-1"></div>
                    <div className="orb-layer layer-2"></div>
                    <div className="orb-layer layer-3"></div>
                  </div>
                  <p className="listening-text-premium mt-8">Đang lắng nghe Anh/Chị...</p>
                </div>
              )}


              {processSteps.length === 0 && (aiState === AI_STATE.IDLE || aiState === AI_STATE.PROCESSING) && (
                <div className="ai-onboarding-premium fade-in">
                  <div className="onboarding-hero">
                    <div className="hero-orb-glow"></div>
                    <Sparkles size={32} className="hero-sparkle" />
                    <h3 className="hero-greeting mt-4">Chào Anh/Chị!</h3>
                    <p className="hero-subtext">Hôm nay em có thể giúp gì cho cửa hàng mình ạ?</p>
                  </div>
                  
                  <div className="onboarding-suggestions mt-8">
                    <p className="suggestion-label mb-3">Thử các lệnh sau:</p>
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
                          <span>"Xem lịch sử đơn"</span>
                        </div>
                      </div>
                      <div className="suggest-card-premium" onClick={() => handleStockTransfer()}>
                        <div className="suggest-icon bg-blue-50 text-blue-600"><Truck size={18} /></div>
                        <div className="suggest-info">
                          <p>Điều chuyển</p>
                          <span>"Chuyển kho 20 trứng"</span>
                        </div>
                      </div>
                      <div className="suggest-card-premium" onClick={() => handleGlobalReporting()}>
                        <div className="suggest-icon bg-purple-50 text-purple-600"><FileBarChart size={18} /></div>
                        <div className="suggest-info">
                          <p>Báo cáo & Thuế</p>
                          <span>"Xem báo cáo thuế"</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="process-steps-container">
                {processSteps.map((step, idx) => {
                  if (step.type === 'receipt') {
                    const totalAmount = activeCart.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
                    return (
                      <div key={idx} className={`process-step ${step.status} type-receipt`}>
                        {step.status === 'done' && <CheckCircle2 size={16} color="#10B981" />}
                        <div className="step-content">
                          <div className="receipt-card">
                            <div className="rc-header"><FileText size={16} /> Hoá đơn phiên làm việc</div>
                            <div className="rc-body">
                               {activeCart.length === 0 ? (
                                 <div className="text-gray-400 py-4 text-center">Giỏ hàng trống</div>
                               ) : (
                                 activeCart.map((item, iIdx) => (
                                  <div className={`rc-line ${isEditingCart ? 'editing' : ''}`} key={`rc-${item.id}-${iIdx}`}>
                                    <div className="flex flex-col">
                                      <span>{item.name}</span>
                                      {isEditingCart ? (
                                        <div className="qty-controls mt-2">
                                          <button className="qty-btn" onClick={() => updateCartItemQty(item.id, -1)}><Minus size={12}/></button>
                                          <span className="qty-val">{item.quantity || 1}</span>
                                          <button className="qty-btn" onClick={() => updateCartItemQty(item.id, 1)}><Plus size={12}/></button>
                                          <button className="remove-btn ml-4" onClick={() => removeCartItem(item.id)}><Trash2 size={14}/></button>
                                        </div>
                                      ) : (
                                        <strong>x{item.quantity || 1}</strong>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end">
                                      <span>{(item.price * (item.quantity || 1)).toLocaleString()}₫</span>
                                    </div>
                                  </div>
                                 ))
                               )}
                               <div className="rc-divider"></div>
                               <div className="rc-total">
                                 <span>Tổng cộng ({activeCart.reduce((sum, i) => sum + (i.quantity || 1), 0)} món)</span>
                                 <span className="total-val">{totalAmount.toLocaleString()}₫</span>
                               </div>
                            </div>
                            {isEditingCart && idx === (processSteps.findLastIndex(s => s.type === 'receipt')) && (
                              <button 
                                className="w-full mt-4 py-2 bg-blue-600 text-white rounded-xl font-bold flex-center gap-2 shadow-lg"
                                onClick={() => setIsEditingCart(false)}
                              >
                                <CheckCircle2 size={16} /> Hoàn tất sửa
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className={`process-step ${step.status} type-${step.type}`}>
                      {step.status === 'loading' && <Loader2 size={16} className="spin-icon" color="#3B82F6" />}
                      {step.status === 'done' && <CheckCircle2 size={16} color="#10B981" />}
                      <div className="step-content">{step.content}</div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="ai-chat-footer-area" style={{ display: isMini ? 'none' : 'block' }}>
              {(aiState === AI_STATE.DONE || aiState === AI_STATE.SUCCESS || aiState === AI_STATE.STOCK_ENTRY) && (
                <div className="ai-suggestions slide-up">
                  {aiState === AI_STATE.STOCK_ENTRY && (
                    <>
                      <button className="cta-chip primary-cta" onClick={() => handleStockConfirm(30)}>+30 (1 Thùng)</button>
                      <button className="cta-chip primary-cta" onClick={() => handleStockConfirm(100)}>+100 (Sỉ)</button>
                      <button className="cta-chip primary-cta" onClick={() => handleStockConfirm(500)}>+500 (Kho)</button>
                      <button className="cta-chip outline-cta" onClick={() => setAiState(AI_STATE.DONE)}>Quay lại</button>
                    </>
                  )}

                  {aiState === AI_STATE.DONE && (
                    <>
                      {lastActionType === 'OOS' && (
                        <>
                          <button className="cta-chip primary-cta" onClick={handleQuickStockEntry}><Database size={14} /> Nhập tồn nhanh</button>
                          <button className="cta-chip secondary-cta" onClick={() => addStep("Đã mở trang nhập hàng...", 'done')}><Truck size={14} /> Nhập hàng mới</button>
                          <button className="cta-chip outline-cta" onClick={() => { setLastActionType('SALE_SUCCESS'); }}>Bỏ qua</button>
                        </>
                      )}

                      {lastActionType === 'SALE_SUCCESS' && (
                        <>
                          <button className="cta-chip primary-cta" onClick={handleCheckoutIntent}><CreditCard size={15} /> Thanh toán ({(activeCart.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0)/1000).toFixed(0)}k)</button>
                          <button className="cta-chip secondary-cta" onClick={handleQRIntent}><Smartphone size={15} /> QR Chuyển khoản</button>
                          <button className="cta-chip secondary-cta" onClick={() => simulateProcessing("Cho tôi xem lịch sử")}><History size={15} /> Xem lịch sử</button>
                          <button className="cta-chip secondary-cta" onClick={handleEditOrder}><Settings size={15} /> Sửa đơn</button>
                        </>
                      )}

                      {lastActionType === 'INVENTORY_REPORT' && (
                        <>
                          <button className="cta-chip primary-cta" onClick={handleQuickStockEntry}><Database size={14} /> Nhập hàng ngay</button>
                          <button className="cta-chip secondary-cta" onClick={() => handleStockTransfer()}><Truck size={14} /> Điều chuyển kho</button>
                          <button className="cta-chip secondary-cta" onClick={() => addStep("Đang mở báo cáo chi tiết...", 'done')}><Calendar size={14} /> Theo ngày</button>
                        </>
                      )}

                      <button className="cta-chip secondary-cta" onClick={handlePrintIntent}><Printer size={15} /> In tạm tính</button>
                      <button className="cta-chip outline-cta" onClick={closeAssistant}><XCircle size={15} /> Hủy</button>
                    </>
                  )}

                  {aiState === AI_STATE.SUCCESS && (
                    <>
                      <button className="cta-chip primary-cta" onClick={closeAssistant}><CheckCircle2 size={15} color="#fff" /> Xong & Đóng</button>
                      <button className="cta-chip secondary-cta" onClick={handlePrintIntent}><Printer size={15} /> In lại</button>
                      <button className="cta-chip secondary-cta" onClick={handleShare}><Send size={15} /> Chia sẻ</button>
                      <button className="cta-chip secondary-cta" onClick={() => { setAiState(AI_STATE.IDLE); setProcessSteps([]); }}><Plus size={15} /> Đơn mới</button>
                    </>
                  )}
                </div>
              )}

              {aiState === AI_STATE.LISTENING && (
                <div className="live-transcript">
                  <div className="transcript-pulse"></div>
                  <span className="live-transcript-text">{transcript || "Đang nghe..."}</span>
                </div>
              )}

              {(aiState !== AI_STATE.LISTENING || aiState === AI_STATE.LISTENING) && (
                <div 
                  className={`ai-input-pill voice-only ${aiState === AI_STATE.LISTENING ? 'listening recording' : ''}`}
                >
                  {aiState === AI_STATE.LISTENING && <div className="listening-glow"></div>}
                  
                  <div className="ai-input-area">
                    {aiState === AI_STATE.LISTENING ? (
                      <div className="voice-visualizer-symphony">
                        {[...Array(40)].map((_, i) => (
                          <div 
                            key={i} 
                            className="spectral-bar" 
                            style={{ 
                              animationDelay: `${Math.random() * 0.8}s`,
                              opacity: listening ? 1 : 0.3
                            }}
                          ></div>
                        ))}
                      </div>
                    ) : (
                      <div className="voice-idle-state" onClick={handleMicClick}>
                        <Sparkles size={16} className="text-blue-400" />
                        <span className="idle-text ml-2">Chạm để nói...</span>
                      </div>
                    )}
                  </div>

                  <div className="ai-controls-group">
                    <button className="ai-action-btn send-btn" onClick={handleAction} disabled={aiState === AI_STATE.PROCESSING}>
                      {aiState === AI_STATE.PROCESSING ? <Loader2 size={18} className="spin-icon" color="white" /> : <Send size={18} color="white" />}
                    </button>
                    {!aiState === AI_STATE.LISTENING && (
                      <button className="ai-action-btn mic-btn" onClick={handleMicClick}><Mic size={18} color="white" /></button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>

      {!isExpanded && (
        <div className="ai-trigger-container">
          {showNudge && (
            <div className="ai-nudge fade-in-left">
              <span className="nudge-text" onClick={() => { setIsExpanded(true); simulateProcessing("Kiểm tra tồn kho cho tôi"); setShowNudge(false); }}>
                Kiểm kho ngay? <Sparkles size={12} />
              </span>
              <button className="nudge-close" onClick={() => setShowNudge(false)}><X size={10} /></button>
            </div>
          )}
          
          {showReportNudge && (
            <div className="ai-report-nudge-orbit" onClick={() => { setIsExpanded(true); handleGlobalReporting(); }}>
               <div className="nudge-orbit-content">
                  <FileBarChart size={12} />
                  <span>Báo cáo</span>
               </div>
            </div>
          )}
          <div className="ai-voice-trigger-compact" onClick={() => setIsExpanded(true)}>
            <div className="trigger-orb">
              <Sparkles size={20} color="white" />
              <div className="orb-ring"></div>
            </div>
            <div className="trigger-label-elegant">Trợ lý</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanHang;
