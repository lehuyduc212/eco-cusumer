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
  Gift,
  RotateCcw,
  Percent,
  Layout,
  AlertCircle,
  FileSearch
} from 'lucide-react';

// --- TAX RATES ---
const TAX_RATES = {
  RETAIL: 0.015, // 1.5% for individual retail goods
  SERVICE: 0.075, // 7.5% for services/gift-packaging
};

// --- MOCK INVENTORY DATABASE ---
const MOCK_DB = [
  { id: 1, name: 'Táo Envy 1kg', emoji: "🍎", price: 120000, keywords: ['táo', 'envy', 'apple'], stock: 45, taxCategory: 'RETAIL', unit: 'kg' },
  { id: 2, name: 'Nho mẫu đơn 500g', emoji: "🍇", price: 250000, keywords: ['nho', 'mẫu đơn'], stock: 30, taxCategory: 'RETAIL', unit: 'hộp' },
  { id: 3, name: 'Mì Hảo Hảo Tôm Cay', emoji: "🍜", price: 4500, keywords: ['mì', 'hảo hảo'], stock: 500, taxCategory: 'RETAIL', unit: 'gói' },
  { id: 4, name: 'Trứng gà (vỉ 10)', emoji: "🥚", price: 35000, keywords: ['trứng'], stock: 120, taxCategory: 'RETAIL', unit: 'vỉ' },
  { id: 5, name: 'Sữa tươi TH True 1L', emoji: "🥛", price: 32000, keywords: ['sữa', 'th true'], stock: 80, taxCategory: 'RETAIL', unit: 'hộp' },
  { id: 6, name: 'Bánh KitKat', emoji: "🍫", price: 15000, keywords: ['kitkat', 'bánh'], stock: 200, taxCategory: 'RETAIL', unit: 'thanh' },
  { id: 7, name: 'Coca Cola 320ml', emoji: "🥤", price: 10000, keywords: ['coca', 'nước ngọt'], stock: 300, taxCategory: 'RETAIL', unit: 'lon' },
  { id: 8, name: 'Dầu ăn Simply 1L', emoji: "🧴", price: 55000, keywords: ['dầu ăn', 'simply'], stock: 60, taxCategory: 'RETAIL', unit: 'chai' },
  { id: 9, name: 'Gạo ST25 5kg', emoji: "🌾", price: 185000, keywords: ['gạo', 'st25'], stock: 40, taxCategory: 'RETAIL', unit: 'túi' },
  { id: 10, name: 'Nước xả Downy', emoji: "🌸", price: 95000, keywords: ['downy', 'nước xả'], stock: 25, taxCategory: 'RETAIL', unit: 'túi' },
  { id: 11, name: 'Kem đánh răng PS', emoji: "🪥", price: 35000, keywords: ['ps', 'kem đánh răng'], stock: 90, taxCategory: 'RETAIL', unit: 'tuýp' },
  { id: 12, name: 'Bia Heineken', emoji: "🍺", price: 22000, keywords: ['bia', 'ken'], stock: 150, taxCategory: 'RETAIL', unit: 'lon' },
  { id: 13, name: 'Xúc xích CP', emoji: "🌭", price: 45000, keywords: ['xúc xích', 'cp'], stock: 75, taxCategory: 'RETAIL', unit: 'vỉ' },
  { id: 14, name: 'Bột giặt Omo 3kg', emoji: "🧼", price: 135000, keywords: ['omo', 'bột giặt'], stock: 35, taxCategory: 'RETAIL', unit: 'túi' },
  { id: 15, name: 'Nước rửa bát Sunlight', emoji: "🍋", price: 28000, keywords: ['sunlight', 'rửa bát'], stock: 110, taxCategory: 'RETAIL', unit: 'chai' }
];

// --- ACCOUNTING MOCK DATA ---
const INPUT_INVOICES = [
  { id: 'NK101', productId: 1, date: '2024-03-01', qty: 50, price: 90000, supplier: 'Green Farm' },
  { id: 'NK102', productId: 1, date: '2024-03-12', qty: 100, price: 85000, supplier: 'Elite Import' },
  { id: 'NK201', productId: 2, date: '2024-03-05', qty: 80, price: 180000, supplier: 'Premium Garden' },
  { id: 'NK202', productId: 2, date: '2024-03-14', qty: 120, price: 195000, supplier: 'Green Farm' },
  { id: 'NK301', productId: 3, date: '2024-03-01', qty: 1000, price: 3600, supplier: 'Acecook Dist.' },
  { id: 'NK401', productId: 4, date: '2024-03-05', qty: 200, price: 28000, supplier: 'Ba Huan Corp' },
  { id: 'NK501', productId: 5, date: '2024-03-02', qty: 150, price: 25000, supplier: 'TH Food' },
  { id: 'NK601', productId: 6, date: '2024-03-10', qty: 300, price: 11000, supplier: 'Nestle VN' },
  { id: 'NK701', productId: 7, date: '2024-03-01', qty: 500, price: 7500, supplier: 'Coca Cola VN' },
  { id: 'NK801', productId: 8, date: '2024-03-05', qty: 100, price: 42000, supplier: 'Simply Corp' },
  { id: 'NK901', productId: 9, date: '2024-03-01', qty: 100, price: 145000, supplier: 'Sóc Trăng Rice' },
  { id: 'NK1001', productId: 10, date: '2024-03-08', qty: 50, price: 78000, supplier: 'P&G VN' },
  { id: 'NK1101', productId: 11, date: '2024-03-10', qty: 200, price: 24000, supplier: 'Unilever VN' },
  { id: 'NK1201', productId: 12, date: '2024-03-01', qty: 400, price: 18000, supplier: 'Heineken VN' },
  { id: 'NK1301', productId: 13, date: '2024-03-05', qty: 150, price: 32000, supplier: 'CP Food' }
];

const SALES_HISTORY_AGGREGATE = [
  { productId: 1, totalSold: 105, lastSale: '2024-03-15' },
  { productId: 2, totalSold: 170, lastSale: '2024-03-14' },
  { productId: 3, totalSold: 850, lastSale: '2024-03-15' },
  { productId: 4, totalSold: 380, lastSale: '2024-03-15' }, // DISCREPANCY
  { productId: 5, totalSold: 70, lastSale: '2024-03-15' },
  { productId: 6, totalSold: 100, lastSale: '2024-03-15' },
  { productId: 7, totalSold: 200, lastSale: '2024-03-15' },
  { productId: 8, totalSold: 40, lastSale: '2024-03-15' },
  { productId: 9, totalSold: 60, lastSale: '2024-03-15' },
  { productId: 10, totalSold: 25, lastSale: '2024-03-15' },
  { productId: 11, totalSold: 110, lastSale: '2024-03-15' },
  { productId: 12, totalSold: 250, lastSale: '2024-03-15' },
  { productId: 13, totalSold: 75, lastSale: '2024-03-15' }
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
    
    // 1. Digital + Unit (e.g. 3.5kg, 5,8 cân)
    const unitMatch = lower.match(/([\d.,]+)\s*(kg|cân|g|l|hộp|quả|trứng|chai)/i);
    if (unitMatch) {
       const val = unitMatch[1].replace(',', '.');
       return parseFloat(val);
    }

    // 2. Direct Digit check
    const digitMatch = lower.match(/[\d.,]+/);
    if (digitMatch && digitMatch[0].length > 0) {
       const val = digitMatch[0].replace(',', '.');
       const parsed = parseFloat(val);
       if (!isNaN(parsed)) return parsed;
    }

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
    setTransferProduct(null);
    setLastActionType('NONE');
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
        <div className="printing-status-bar">
          <div className="status-progress-bar"></div>
        </div>
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
        <div className="invoice-stub-header">
           <b>PHIẾU TẠM TÍNH XẢ KHO</b>
           <br/><small>Dự toán Giải phóng vốn</small>
        </div>
        <div className="invoice-body">
           <div className="invoice-item-line">
              <span>{productName} x 150</span>
              <span>1.912.500</span>
           </div>
           <div className="invoice-item-line">
              <span>Thuế (1.5%)</span>
              <span>28.687</span>
           </div>
           <div className="invoice-total-line">
              <span>TỔNG THU DỰ KIẾN</span>
              <span>1.941.187đ</span>
           </div>
        </div>
        <p className="mt-4 text-[10px] text-slate-400 italic text-center">
           * Phiếu dùng cho báo cáo nội bộ
        </p>
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleCloseStrategicAdvice = () => {
    addStep("Dạ, em đã lưu lại các gợi ý này. Anh/Chị có thể xem lại trong Dashboard bất cứ lúc nào ạ.", 'result');
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
          <p>
            Dữ liệu cho thấy tồn kho <b>{stockCount} đơn vị</b> đang chiếm dụng 12% dòng vốn lưu động. 
            Em gợi ý Anh/Chị nên <b>xả kho nhanh</b> để nhập hàng tươi mới cho tuần sau.
          </p>
        </div>

        <div className="strategy-actions">
          <button className="strategy-btn primary" onClick={() => handleApplyStrategicDiscount(productName, 15)}>
            <Percent size={16} /> Áp dụng Giảm giá 15%
          </button>
          <button className="strategy-btn secondary" onClick={() => handlePrintStrategicLabels(productName)}>
            <Printer size={16} /> In tem "Xả kho - Giá sốc"
          </button>
          <button className="strategy-btn secondary" onClick={() => handleProformaInvoice(productName)}>
            <FileText size={16} /> In Tạm tính (Pro-forma)
          </button>
          <button className="strategy-btn secondary" onClick={() => handleCloseStrategicAdvice()}>
            <X size={16} /> Để sau
          </button>
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
        <div className="consultant-badge"><TrendingUp size={12} /> Tăng trưởng Doanh thu</div>
        <h4>Đẩy mạnh bán lẻ <b>{productName}</b></h4>
        
        <div className="strategy-advice">
          <p>
            Sản phẩm này {context}. Em gợi ý Anh/Chị áp dụng <b>hiệu ứng chim mồi</b>: 
            Trưng bày ngay tại quầy thanh toán hoặc kệ trung tâm để tăng 25% tỷ lệ click.
          </p>
        </div>

        <div className="strategy-actions">
          <button className="strategy-btn primary" onClick={() => handleCreateComboStrategy(productName)}>
            <Gift size={16} /> Tạo Combo Quà tặng (Upsell)
          </button>
          <button className="strategy-btn secondary" onClick={() => {
            addStep("Vị trí 'Kệ trung tâm' đã được đánh dấu ưu tiên trên Bản đồ Nhiệt.", 'done');
            setAiState(AI_STATE.DONE);
          }}>
            <Layout size={16} /> Đánh dấu Vị trí Chiến lược
          </button>
          <button className="strategy-btn secondary" onClick={() => handleCloseStrategicAdvice()}>
             Bỏ qua
          </button>
        </div>
      </div>, 'result', 'consultant'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleCreateComboStrategy = async (productName) => {
    setAiState(AI_STATE.PROCESSING);
    addStep(`Đang phân tích khả năng phối hợp mặt hàng cho ${productName}...`);
    await delay(1000);
    updateLastStep('done');
    
    addStep(
      <div className="tax-optimization-success premium-glass fade-in">
         <Sparkles size={24} className="text-blue-500" />
         <h4>Đã tạo Combo Chiến lược!</h4>
         <p>Combo [<b>{productName}</b> + Giỏ tre + Nho] đã được thêm vào mục Đề xuất bán lẻ.</p>
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleApplyStrategicDiscount = async (productName, discount) => {
    setAiState(AI_STATE.PROCESSING);
    addStep(`Đang thiết lập chương trình khuyến mãi ${discount}% cho ${productName}...`);
    await delay(1200);
    updateLastStep('done');
    
    addStep(
      <div className="tax-optimization-success premium-glass fade-in">
         <CheckCircle2 size={24} className="text-green-500" />
         <h4>Đã kích hoạt khuyến mãi!</h4>
         <p>Toàn bộ <b>{productName}</b> trong kho đã được áp mức giá mới (-{discount}%).</p>
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleProductCostAudit = async (productId, filterMonth = null) => {
    setAiState(AI_STATE.PROCESSING);
    const product = MOCK_DB.find(p => p.id === productId);
    const monthText = filterMonth ? ` tháng ${filterMonth}` : "";
    addStep(`Đang trích lục hồ sơ nhập hàng cho ${product?.name}${monthText}...`);
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
        <div className="audit-header-main">
           <div className="audit-title-row">
              <FileSearch size={22} className="text-blue-400" />
              <div className="audit-title-text">
                 <h3>HỒ SƠ GIÁ NHẬP & TỒN KHO</h3>
                 <span className="audit-subtitle">{product?.name} • {filterMonth ? `Tháng ${filterMonth}/2024` : 'Tất cả thời gian'}</span>
              </div>
           </div>
        </div>
        
        <div className="audit-stats-row">
           <div className="audit-stat-box primary border-r border-gray-100">
              <label>Giá nhập TB</label>
              <div className="audit-value">{Math.round(avgPrice).toLocaleString()}₫</div>
              <div className="audit-trend up"><TrendingUp size={12} /> +2.4%</div>
           </div>
           <div className="audit-stat-box">
              <label>Tổng nhập</label>
              <div className="audit-value">{totalInput} {product?.unit}</div>
              <div className="audit-trend neutral"><Package size={12} /> Ổn định</div>
           </div>
        </div>

        <div className="audit-invoice-timeline">
           <div className="timeline-header">LỊCH SỬ HOÁ ĐƠN ĐẦU VÀO</div>
           <div className="timeline-scroll">
              {invoices.length > 0 ? invoices.map((inv, idx) => (
                <div className="timeline-item" key={inv.id}>
                   <div className="time-node"></div>
                   <div className="timeline-content">
                      <div className="upper">
                         <span className="inv-date">{inv.date}</span>
                         <span className="inv-qty">+{inv.qty} {product?.unit}</span>
                      </div>
                      <div className="lower">
                         <span className="inv-supplier">{inv.supplier}</span>
                         <span className="inv-price">{inv.price.toLocaleString()}₫</span>
                      </div>
                   </div>
                </div>
              )) : (
                <div className="no-data-audit py-4 text-center text-gray-400 text-sm italic">Không tìm thấy dữ liệu nhập hàng kỳ này.</div>
              )}
           </div>
        </div>

         <div className='audit-actions-elite mt-4'>
            <button className='elite-btn-outline' onClick={() => handleReconciliationDashboard(productId)}>
               <BarChart3 size={14} /> Đối soát Bán / Nhập
            </button>
            <button className='elite-btn-primary'>
               <Target size={14} /> Tối ưu tồn kho
            </button>
         </div>
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleReconciliationDashboard = async (productId = null) => {
    setAiState(AI_STATE.PROCESSING);
    if (!productId) {
      addStep('Đang phân tích toàn bộ biến động kho...');
    } else {
      const p = MOCK_DB.find(x => x.id === productId);
      addStep('Đang đối soát số liệu cho ' + (p?.name || 'sản phẩm') + '...');
    }
    await delay(1200);
    updateLastStep('done');

    const productsToRecon = productId ? MOCK_DB.filter(p => p.id === productId) : MOCK_DB.slice(0, 5);

    addStep(
      <div className='reconciliation-hub-elite elite-glass fade-in'>
         <div className='recon-header'>
            <ShieldCheck size={20} className='text-emerald-400' />
            <span>TRUNG TÂM ĐỐI SOÁT & MINH BẠCH</span>
         </div>
         
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
                     <div className='p-header'>
                        <span className='p-name'>{p.emoji} {p.name}</span>
                        {isAlert && <div className='alert-badge'><AlertCircle size={10} /> LỆCH KHO</div>}
                     </div>
                     <div className='p-stats'>
                        <div className='stat'><span>Nhập:</span> <strong>{totalIn}</strong></div>
                        <div className='stat'><span>Bán:</span> <strong>{totalOut}</strong></div>
                        <div className='stat highlight'><span>Tồn:</span> <strong className={isAlert ? 'text-red-500' : ''}>{diff}</strong></div>
                     </div>
                     {isAlert && (
                        <div className='recon-advice'>
                           <Info size={12} /> Phát hiện bán quá số lượng nhập. Vui lòng kiểm tra hóa đơn bù.
                        </div>
                     )}
                  </div>
               );
            })}
         </div>

         <div className='recon-footer mt-4'>
            <button className='recon-btn-full' onClick={() => setIsExpanded(false)}>
               Hoàn tất đối soát
            </button>
         </div>
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const handleSessionHistory = async () => {
    setAiState(AI_STATE.PROCESSING);
    addStep('Đang trích xuất nhật ký phiên làm việc...');
    await delay(800);
    updateLastStep('done');

    addStep(
      <div className='session-history-card premium-glass fade-in'>
         <div className='history-header'>
            <History size={18} className='text-blue-600' />
            <span>NHẬT KÝ PHIÊN (AUDIT LOG)</span>
         </div>
         
         <div className='history-timeline mt-4'>
            {sessionHistory.length > 0 ? (
               sessionHistory.map((log, idx) => (
                  <div className='history-log-item' key={'log-' + idx}>
                     <div className='log-time'>{log.timestamp}</div>
                     <div className='log-action'>{log.action}</div>
                     <div className='log-details'>{log.details}</div>
                  </div>
               )).reverse()
            ) : (
               <div className='text-center py-4 text-gray-400'>Chưa có hoạt động nào được ghi lại.</div>
            )}
         </div>
         
         <div className='history-footer mt-4'>
            <button className='history-btn outline' onClick={() => setIsExpanded(false)}>Đóng</button>
         </div>
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const renderStrategicDashboard = () => {
    return (
      <>
        <div className="dashboard-title-area">
          <small className="text-blue-600 font-bold uppercase tracking-widest">Định hướng chiến lược</small>
          <h3>Gợi ý hành động hôm nay</h3>
          <p>Dựa trên dữ liệu tồn kho & xu hướng thị trường</p>
        </div>

        <div className="strategic-grid">
          {/* Tile 1: Clearance */}
          <div className="strategic-tile tile-warning" onClick={() => handleClearanceStrategy("Mì Hảo Hảo", 150)}>
            <div className="tile-icon bg-red-50 text-red-600"><TrendingDown size={18} /></div>
            <div className="tile-label">Clear tồn kho</div>
            <div className="tile-value">Mì Hảo Hảo (Còn 150 thùng)</div>
            <div className="tile-action"><Zap size={10} /> Chạy khuyến mãi 15%</div>
          </div>

          {/* Tile 2: Best Seller */}
          <div className="strategic-tile tile-success" onClick={() => handleUpsellStrategy("Táo Envy", "Đang là xu hướng")}>
            <div className="tile-icon bg-green-50 text-green-600"><TrendingUp size={18} /></div>
            <div className="tile-label">Bán thêm</div>
            <div className="tile-value">Táo Envy đang HOT</div>
            <div className="tile-action"><Plus size={10} /> Đặt ở kệ trung tâm</div>
          </div>

          {/* Tile 3: Predictions */}
          <div className="strategic-tile tile-info" onClick={() => handleQuickStockEntry()}>
            <div className="tile-icon bg-blue-50 text-blue-600"><Calendar size={18} /></div>
            <div className="tile-label">Dự đoán nhập</div>
            <div className="tile-value">Nho mẫu đơn (Hết sau 2 ngày)</div>
            <div className="tile-action"><Truck size={10} /> Gợi ý nhập: +20kg</div>
          </div>

          {/* Tile 4: Alerts */}
          <div className="strategic-tile tile-amber" onClick={() => handleInventoryReport()}>
            <div className="tile-icon bg-amber-50 text-amber-600"><AlertTriangle size={18} /></div>
            <div className="tile-label">Cảnh báo</div>
            <div className="tile-value">Snack O'star đã hết hàng</div>
            <div className="tile-action"><Settings size={10} /> Xử lý ngay</div>
          </div>
        </div>

        {/* Voucher Section */}
        <div className="voucher-card-premium" onClick={() => simulateProcessing("Dùng voucher nhập hàng sữa")}>
          <div className="voucher-glow"></div>
          <div className="v-label">Ưu đãi nhà phân phối</div>
          <div className="v-title">Voucher GIẢM 20%</div>
          <div className="v-desc">Áp dụng cho đơn nhập Sữa TH True Milk khi kho dưới 10 thùng.</div>
          <button className="v-btn">Xem chi tiết & Dùng ngay</button>
        </div>

        {/* Strategic Timeline */}
        <div className="strategic-timeline-box">
          <div className="timeline-header">
            <Clock size={16} className="text-blue-500" />
            <span>Timeline hành động chiến lược</span>
          </div>
          <div className="timeline-v-list">
            <div className="timeline-v-item">
              <div className="tm-marker active"></div>
              <div className="tm-content">
                <b>08:00 - Kiểm kho & Nhập hàng</b>
                <span>Ưu tiên nhập các mặt hàng dự báo hết trong 48h tới.</span>
              </div>
            </div>
            <div className="timeline-v-item">
              <div className="tm-marker"></div>
              <div className="tm-content">
                <b>11:30 - Tiếp đón cao điểm</b>
                <span>Chuẩn bị sẵn 50 giỏ quà táo mẫu đơn cho khách văn phòng.</span>
              </div>
            </div>
            <div className="timeline-v-item">
              <div className="tm-marker"></div>
              <div className="tm-content">
                <b>16:00 - Tối ưu tồn cuối ngày</b>
                <span>Cân nhắc giảm giá 10% các mặt hàng tươi sống còn dư.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legacy Quick CTAs */}
        <div className="onboarding-suggestions mt-10">
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
              <div className="suggest-icon bg-blue-50 text-blue-600"><Truck size={18} /></div>
              <div className="suggest-info">
                <p>Điều chuyển</p>
                <span>"Chuyển kho 20 táo"</span>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="session-start-ctas mt-8">
           <button className="start-cta-btn" onClick={() => handleMicClick()}>
              <Mic size={18} /> Bán hàng bằng giọng nói
           </button>
        </div> */}
      </>
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
    try {
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
      return newCart; // Return snapshot for async flows
    } catch (error) {
      console.error("Order Flow Error:", error);
      addStep("Dạ, có lỗi xảy ra khi xử lý giỏ hàng. Em đã đưa hệ thống về trạng thái an toàn.", 'result', 'error');
      setAiState(AI_STATE.DONE);
      return [];
    }
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
      </div>, 'result'
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
      <div className="tax-optimization-success premium-glass fade-in">
         <div className="flex-center gap-2">
            {/* <CheckCircle2 size={24} className="text-green-500 animate-bounce" /> */}
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
    setOosProduct(productName);
    setIsExpanded(true);
    addStep("Đang kiểm tra tồn kho chi tiết...");
    await delay(1000);
    updateLastStep('done');

    addStep(
      <div className="oos-alert-card premium-glass fade-in">
         <div className="oos-header flex items-center gap-2">
            <AlertTriangle size={20} color="#EF4444" />
            <h4 className="oos-title text-red-600 font-bold">Hết hàng trong kho</h4>
         </div>
         <p className="oos-desc mt-2">Sản phẩm <strong>{productName}</strong> hiện có tồn kho bằng 0.</p>
         <div className="oos-supplier-list mt-4 flex flex-col gap-2">
            <div className="oos-supplier-item p-3 rounded-lg border border-gray-100 flex justify-between items-center">
               <div className="ncc-info">
                  <span className="ncc-name block font-semibold">NCC Tổng hợp Miền Bắc</span>
                  <span className="ncc-price text-sm text-gray-500">Giá nhập: --.---₫</span>
               </div>
               <button className="ncc-btn bg-blue-600 text-white px-3 py-1 rounded text-sm">Đặt hàng</button>
            </div>
         </div>
      </div>, 'result'
    );
    setAiState(AI_STATE.DONE);
  };

  const simulateProcessing = async (text = "Voice command") => {
    try {
      addStep(text, 'result', 'user');
      if (aiState === AI_STATE.PROCESSING) return;
      setAiState(AI_STATE.PROCESSING);
      setIsExpanded(true);
      await delay(600);
      
      const lowerText = text.toLowerCase();
      
      // --- INTENT DETECTION (High Priority) ---
      const isHistoryIntent = lowerText.includes('lịch sử') || lowerText.includes('nhật ký') || lowerText.includes('xem lại');
      const isInventoryReport = lowerText.includes('kiểm') || lowerText.includes('báo cáo');
      const isAccountingAudit = lowerText.includes('giá nhập') || lowerText.includes('giá mua') || lowerText.includes('truy xuất') || 
                               (lowerText.includes('hóa đơn') && (lowerText.includes('nhập') || lowerText.includes('đầu vào')));
      const isReconDashboard = lowerText.includes('đối soát') || lowerText.includes('so khớp');

      // 0. Accounting Hub (Priority over Sales if specific keywords match)
      if (isHistoryIntent) return handleSessionHistory();
      
      if (isAccountingAudit) {
        let monthMatch = null;
        const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        const monthNames = ['một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười'];
        
        // Dynamic time detection
        if (lowerText.includes('tháng này')) monthMatch = (new Date().getMonth() + 1).toString();
        else {
          months.forEach(m => { if (lowerText.includes(`tháng ${m}`)) monthMatch = m; });
          monthNames.forEach((n, idx) => { if (lowerText.includes(`tháng ${n}`)) monthMatch = (idx + 1).toString(); });
        }

        // IMPROVED MATCH LOGIC: Check for longest keyword match or exact match
        const matches = MOCK_DB.filter(item => 
           item.keywords.some(k => lowerText.includes(k.toLowerCase())) || 
           lowerText.includes(item.name.toLowerCase())
        );
        
        // Prioritize by length of match to avoid "táo" matching "trứng" if they ever collide (unlikely but safe)
        const bestMatch = matches.length > 0 ? matches.reduce((prev, curr) => {
          const prevLen = prev.name.length;
          const currLen = curr.name.length;
          return (lowerText.includes(curr.name.toLowerCase()) && currLen > prevLen) ? curr : prev;
        }) : null;

        if (bestMatch) return handleProductCostAudit(bestMatch.id, monthMatch);
        return handleReconciliationDashboard(); // Fallback if no product named
      }

      if (isReconDashboard) return handleReconciliationDashboard();

      if (isInventoryReport && (lowerText.includes('kho') || lowerText.includes('tồn'))) return handleInventoryReport();

      // 1. Order Flow
      addStep("Đang quét giỏ hàng & tồn kho...");
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

      // Unit conversion
      detected.forEach(item => {
        const segment = segments.find(s => item.keywords.some(k => s.toLowerCase().includes(k.toLowerCase())));
        if (segment && (segment.toLowerCase().includes('kg') || segment.toLowerCase().includes('kí'))) {
           const weightVal = parseVietnameseQuantity(segment);
           if (item.weightPerUnit && item.weightPerUnit < 1) {
              item.detectedQty = Math.ceil(weightVal / item.weightPerUnit);
              addStep(`💡 Quy đổi: ${weightVal}kg = ${item.detectedQty} ${item.unit}`, 'done');
           } else {
              item.detectedQty = weightVal;
           }
        }
      });

      if (detected.length > 0) {
        const finalToCart = [];
        detected.forEach(dt => {
          if (dt.isCombo) {
            addStep(`🧩 Tách Combo: ${dt.name}...`);
            dt.specs.forEach(spec => {
               const specItem = MOCK_DB.find(m => m.id === spec.id);
               if (specItem) finalToCart.push({ ...specItem, detectedQty: spec.qty * dt.detectedQty });
            });
            updateLastStep('done');
          } else {
            finalToCart.push(dt);
          }
        });

        if (finalToCart.length > 0) {
          const outOfStock = finalToCart.filter(i => i.stock === 0);
          if (outOfStock.length > 0) {
            return handleOOSFlow(outOfStock[0].name);
          } else {
            const cartSnapshot = await finalizeOrderFlow(finalToCart);
            if (lowerText.includes('giỏ quà') || lowerText.includes('gói quà')) return handleDynamicWrapping(cartSnapshot);
            return;
          }
        }
      }

      // Default
      addStep("Xin lỗi, em chưa tìm thấy sản phẩm này.", 'result');
      setAiState(AI_STATE.DONE);
    } catch (error) {
      console.error("AI Error:", error);
      addStep("Dạ, bộ não của em đang gặp chút trục trặc.", 'result', 'error');
      setAiState(AI_STATE.DONE);
    }
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
                renderStrategicDashboard()
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
                Kiểm kho ngay?
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
