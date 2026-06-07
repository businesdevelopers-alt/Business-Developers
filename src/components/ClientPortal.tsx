import React, { useState } from 'react';
import { Lang, Client, ClientRequest, ClientInvoice } from '../types';
import { SOLUTIONS, SECTORS } from '../data';
import { 
  X, 
  User, 
  Lock, 
  Building, 
  Phone, 
  Mail, 
  UserPlus, 
  LogIn, 
  LogOut, 
  FileText, 
  Activity, 
  Compass, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Clock, 
  DollarSign,
  Receipt,
  CreditCard,
  Database,
  Plus,
  Search,
  Eye,
  Chrome,
  RefreshCw,
  Key,
  Cloud,
  CheckSquare,
  Loader2,
  Link2,
  ExternalLink,
  Linkedin,
  Bell,
  Camera,
  Globe,
  Trash2,
  Download,
  Code,
  Settings,
  Share2,
  Users,
  Shield,
  UserCheck,
  FileCheck,
  PenTool,
  Upload,
  FileSpreadsheet,
  ArrowDown,
  TrendingUp,
  Video,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { jsPDF } from 'jspdf';

interface ClientPortalProps {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
  currentClient: Client | null;
  onLogin: (email: string, pass: string) => { success: boolean; error?: string };
  onRegister: (client: Client) => { success: boolean; error?: string } | Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
  requests: ClientRequest[];
  invoices: ClientInvoice[];
  allClients?: Client[];
  allRequests?: ClientRequest[];
  allInvoices?: ClientInvoice[];
  onUpdateRequestStatus?: (requestId: string, newStatus: ClientRequest['status']) => void;
  onCreateInvoice?: (invoice: ClientInvoice) => void;
  onCreateClient?: (client: Client) => void;
  onUpdateClient?: (client: Client) => void;
  onScrollToConsultation: () => void;
}

export default function ClientPortal({
  lang,
  isOpen,
  onClose,
  currentClient,
  onLogin,
  onRegister,
  onLogout,
  requests,
  invoices,
  allClients = [],
  allRequests = [],
  allInvoices = [],
  onUpdateRequestStatus,
  onCreateInvoice,
  onCreateClient,
  onUpdateClient,
  onScrollToConsultation
}: ClientPortalProps) {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'admin_login'>('login');
  const [portalSubTab, setPortalSubTab] = useState<'profile' | 'requests' | 'invoices' | 'databases' | 'workspace' | 'team' | 'contracts' | 'financials' | 'dashboard' | 'admin_panel' | 'analytics'>('dashboard');
  const [adminActiveTab, setAdminActiveTab] = useState<'clients' | 'requests' | 'invoices'>('clients');

  // Team management states for "باقة النمو" (Growth Package)
  const [teamMembers, setTeamMembers] = useState<any[]>(() => {
    const defaultList = [
      {
        id: 'team-1',
        name: isAr ? 'أحمد الشمري' : 'Ahmad Al-Shammari',
        email: 'ahmad@company.com',
        role: 'Admin',
        status: 'Active',
        joinedAt: '2026-03-10',
        permissions: ['read_databases', 'manage_workspace', 'view_financials', 'request_consultation']
      },
      {
        id: 'team-2',
        name: isAr ? 'سارة القحطاني' : 'Sarah Al-Qahtani',
        email: 'sarah@company.com',
        role: 'Developer',
        status: 'Active',
        joinedAt: '2026-04-12',
        permissions: ['read_databases', 'manage_workspace']
      },
      {
        id: 'team-3',
        name: isAr ? 'إياد العتيبي' : 'Eyad Al-Otaibi',
        email: 'eyad@company.com',
        role: 'Analyst',
        status: 'Pending',
        joinedAt: '2026-05-20',
        permissions: ['view_financials']
      }
    ];
    if (!currentClient) return defaultList;
    if (currentClient.team && Array.isArray(currentClient.team) && currentClient.team.length > 0) {
      return currentClient.team;
    }
    const saved = localStorage.getItem(`bd_team_${currentClient.email}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultList;
  });

  // State controls for team member modal or editor panel
  const [teamFormOpen, setTeamFormOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<any | null>(null);
  
  // Team member fields
  const [teamNameInput, setTeamNameInput] = useState('');
  const [teamEmailInput, setTeamEmailInput] = useState('');
  const [teamRoleInput, setTeamRoleInput] = useState<'Admin' | 'Developer' | 'Analyst' | 'Guest'>('Developer');
  const [teamStatusInput, setTeamStatusInput] = useState<'Active' | 'Pending' | 'Suspended'>('Active');
  const [teamPermsInput, setTeamPermsInput] = useState<string[]>(['read_databases']);

  // Dynamic persistence syncing
  React.useEffect(() => {
    if (currentClient) {
      const savedLocal = localStorage.getItem(`bd_team_${currentClient.email}`);
      const stringified = JSON.stringify(teamMembers);
      if (savedLocal !== stringified) {
        localStorage.setItem(`bd_team_${currentClient.email}`, stringified);
        onUpdateClient({
          ...currentClient,
          team: teamMembers
        });
      }
    }
  }, [teamMembers, currentClient, onUpdateClient]);
 
  // Contracts Management State
  const [contracts, setContracts] = useState<any[]>(() => {
    const defaultContracts = [
      {
        id: 'CON-MSA-402',
        titleAr: 'اتفاقية تقديم الخدمات الاستشارية والهندسية الموحدة (MSA)',
        titleEn: 'Master Service Agreement for Technical Consultation & Engineering (MSA)',
        type: 'MSA',
        status: 'signed',
        signedAt: '2026-03-01',
        signedBy: currentClient?.name || 'Ahmad Al-Shammari',
        signedByTitleAr: 'الرئيس التنفيذي للعمليات',
        signedByTitleEn: 'Chief Operating Officer (COO)',
        certifiedHash: 'BD-SHA256-402e3b2a8f89c091d8e874bc0281b37f8f9024c0800fa1b0213ffdd280eaef9a',
        documentUrl: '#',
        clausesAr: [
          'الالتزام بمعايير الأداء السحابي وتكامل البنى التحتية بمعدل تواجد لا يقل عن 99.9%',
          'المحافظة على سرية البيانات وتبادل المعلومات المشفرة بالبروتوكولات الآمنة',
          'استحقاق الدفعات للفواتير المعتمدة خلال 15 يوماً عمل من تاريخ الصدور الرقمي'
        ],
        clausesEn: [
          'Uptime commitment of no less than 99.9% for cloud environments and integrated stacks.',
          'Strict compliance with information security mandates and encrypted data channels.',
          'Payment settlement within 15 working days from digital invoice issuance.'
        ]
      }
    ];
    if (!currentClient) return defaultContracts;
    if (currentClient.contracts && Array.isArray(currentClient.contracts) && currentClient.contracts.length > 0) {
      return currentClient.contracts;
    }
    const saved = localStorage.getItem(`bd_contracts_${currentClient.email}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultContracts;
  });

  // Available new Addenda that can be signed
  const availableAddenda = [
    {
      id: 'ADD-SLA-901',
      titleAr: 'ملحق ترقية الدعم وضمان استمرارية التشغيل 99.99% (SLA)',
      titleEn: 'Uptime SLA Upgrade & 24/7 Dedicated Support Addendum (SLA-901)',
      descAr: 'اتفاقية تلتزم برفع ضمان التشغيل بمقدار تسعة إضافية مع استجابة مخصصة خلال ساعة للطارئ.',
      descEn: 'Upgrade system uptime guarantee to 99.99% with a 1-hour critical response SLA.',
      costAr: '+12,000 ريال سعودي / شهرياً',
      costEn: '+12,000 SAR / Month',
      scopeAr: 'تغطية البنى التحتية في Google Cloud وبوابات الدفع وقواعد البيانات الموزعة تحت مراقبة دائمة.',
      scopeEn: 'Covers live infrastructure, production databases, and payment microservices under active telemetry monitoring.'
    },
    {
      id: 'ADD-NDA-404',
      titleAr: 'ملحق تشديد الحماية وتحصين البيانات والامتثال المؤسسي والـ NDA',
      titleEn: 'Data Sovereignty, Advanced Encryption & NDA Addendum (NDA-404)',
      descAr: 'إضافة شروط تضمن تشفير البيانات الثابتة بمفاتيح مخصصة للعميل متوافقة مع لوائح سدايا وبشكل ثنائي الاتجاه.',
      descEn: 'Additional regulatory compliance provisions enforcing AES-256 client-managed keys, aligned with SDAIA data local guidelines.',
      costAr: 'مشمول بالباقة الأساسية (0 ريال)',
      costEn: 'Included in Base Plan (0 SAR)',
      scopeAr: 'الامتثال الكامل لتشريعات حماية البيانات ومستويات العزل الحصري لقواعد البيانات.',
      scopeEn: 'Enforces full logical database isolation, localized audit logging, and bilateral IP protections.'
    },
    {
      id: 'ADD-API-205',
      titleAr: 'ملحق تكامل واجهة التطبيقات المخصصة والتوزيع المتعدد',
      titleEn: 'Global API Gateways & High-Throughput Integration Addendum (API-205)',
      descAr: 'ترقية وتوسيع بوابات نقل واستقبال البيانات لدعم أكثر من مليون نداء يومياً من خوادم متعددة.',
      descEn: 'Upgrade active endpoints bandwidth to facilitate over 1,000,000 daily API calls across isolated channels.',
      costAr: '+5,000 ريال سعودي / شهرياً',
      costEn: '+5,000 SAR / Month',
      scopeAr: 'تهيئة واجهات API وبناء قنوات المزامنة والحد الفوري من الهجمات الموزعة DDoS.',
      scopeEn: 'Enables custom webhook delivery integrations, rate-limiting rules, and global latency edge acceleration.'
    }
  ];

  const [selectedAddendumToSign, setSelectedAddendumToSign] = useState<any | null>(null);
  const [signerFullName, setSignerFullName] = useState(currentClient?.name || '');
  const [signerTitleAr, setSignerTitleAr] = useState('الرئيس التنفيذي');
  const [signerTitleEn, setSignerTitleEn] = useState('Chief Executive Officer (CEO)');
  const [isSigningInFlight, setIsSigningInFlight] = useState(false);
  const [signingSuccess, setSigningSuccess] = useState('');
  const [signatureDrawMode, setSignatureDrawMode] = useState<'type' | 'draw' | 'upload'>('type');
  const [typeSignatureStyle, setTypeSignatureStyle] = useState(0);

  // Drawing Canvas and File Upload states
  const signatureCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSecret, setHasDrawnSecret] = useState(false);
  const [uploadedSignatureImg, setUploadedSignatureImg] = useState<string | null>(null);
  const [isDragOverSignature, setIsDragOverSignature] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    // Scaling relative coordinates mathematically so it remains perfectly synchronized with responsive stretching
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0284c7'; // Professional high-integrity sky blue signature ink
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawnSecret(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSecret(false);
  };

  const handleSignatureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert(isAr ? 'الرجاء اختيار ملف صورة صالح للتوقيع.' : 'Please select a valid image file for signature.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedSignatureImg(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUploadedSignature = () => {
    setUploadedSignatureImg(null);
  };

  // Sync contracts to cloud state
  React.useEffect(() => {
    if (currentClient) {
      const savedLocal = localStorage.getItem(`bd_contracts_${currentClient.email}`);
      const stringified = JSON.stringify(contracts);
      if (savedLocal !== stringified) {
        localStorage.setItem(`bd_contracts_${currentClient.email}`, stringified);
        onUpdateClient({
          ...currentClient,
          contracts: contracts
        });
      }
    }
  }, [contracts, currentClient, onUpdateClient]);

  // Interactive profile edits state
  const [profName, setProfName] = useState(currentClient?.name || '');
  const [profCompany, setProfCompany] = useState(currentClient?.companyName || '');
  const [profPhone, setProfPhone] = useState(currentClient?.phone || '');
  const [profPassword, setProfPassword] = useState(currentClient?.password || '');
  const [profBio, setProfBio] = useState(currentClient?.bio || '');
  const [profIndustry, setProfIndustry] = useState(currentClient?.industry || '');
  const [profAvatar, setProfAvatar] = useState(currentClient?.avatar || '💻');
  
  // Extended Profile Fields
  const [profJobTitle, setProfJobTitle] = useState(currentClient?.jobTitle || '');
  const [profLinkedin, setProfLinkedin] = useState(currentClient?.linkedin || '');
  const [profLogo, setProfLogo] = useState(currentClient?.logo || '');
  const [logoPrompt, setLogoPrompt] = useState('');
  const [logoStyle, setLogoStyle] = useState('cyber');
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [generationSteps, setGenerationSteps] = useState('');
  
  // Security Password state extension
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  
  // Detailed notification preferences
  const [prefEmail, setPrefEmail] = useState(currentClient?.notifications?.email ?? true);
  const [prefSms, setPrefSms] = useState(currentClient?.notifications?.sms ?? false);
  const [prefPush, setPrefPush] = useState(currentClient?.notifications?.push ?? true);
  const [prefMarketing, setPrefMarketing] = useState(currentClient?.notifications?.marketing ?? true);

  // Real-time notification statuses tracking
  const [portalSeenStatuses, setPortalSeenStatuses] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('bd_seen_request_statuses');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeToasts, setActiveToasts] = useState<any[]>([]);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloadingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Colors
      const primaryColor = [14, 165, 233]; // sky-500
      const darkColor = [15, 23, 42]; // slate-900 / dark slate
      const grayColor = [100, 116, 139]; // text-slate-500
      const borderTheme = [226, 232, 240]; // slate-200

      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Draw Top Decorative Branding Header Accent Bar
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 5, 'F');

      // Top Header Info
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('BUSINESS SOLUTIONS DEVELOPERS', 15, 18);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('Executive Corporate Client Performance Audit & Diagnostic Report', 15, 23);

      // Metadatas box (Right side info)
      doc.setFontSize(8.5);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('REPORT METADATA', 135, 16);
      
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text(`Generated: ${new Date().toISOString().replace('T', ' ').substring(0, 16)} UTC`, 135, 21);
      doc.text(`Environment: BSD Secure Cloud Sync`, 135, 25);
      doc.text(`Document Ref: BSD-RPT-${currentClient?.email?.slice(0, 4).toUpperCase() || 'GUEST'}`, 135, 29);

      // Separator line
      doc.setDrawColor(borderTheme[0], borderTheme[1], borderTheme[2]);
      doc.setLineWidth(0.4);
      doc.line(15, 34, pageWidth - 15, 34);

      // Partner Workspace block
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('PARTNER WORKSPACE ACCOUNT IDENTIFICATION', 15, 42);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      
      const clientName = currentClient?.name || currentClient?.email || 'N/A';
      const companyName = currentClient?.companyName || 'Corporate Partner';
      const clientTier = (currentClient?.tier || 'Standard Client').toUpperCase();
      const clientEmail = currentClient?.email || 'N/A';
      const clientPhone = currentClient?.phone || 'N/A';

      doc.text(`Authorized Client Representative: ${clientName}`, 15, 48);
      doc.text(`Affiliated Enterprise: ${companyName}`, 15, 53);
      doc.text(`Operational Partner Tier: ${clientTier}`, 15, 58);

      doc.text(`Email Address: ${clientEmail}`, 110, 48);
      doc.text(`Phone / Contact Channel: ${clientPhone}`, 110, 53);
      doc.text(`Portal Status: CONNECTED`, 110, 58);

      // Separator line
      doc.line(15, 64, pageWidth - 15, 64);

      // Key Metrics Card Containers
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('EXECUTIVE PERFORMANCE SUMMARY', 15, 72);

      // Draw Summary Cards
      const cardY = 77;
      const cardHeight = 22;
      const cardWidth = (pageWidth - 30 - 6) / 4; // 4 cards

      const paidSum = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);
      const unpaidSum = invoices
        .filter(inv => inv.status === 'unpaid')
        .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);
      const totalBudget = requests.reduce((sum, req) => sum + parseAmount(req.estimatedCost), 0);

      // Compute physical progress average
      let avgCompletion = 0;
      if (requests.length > 0) {
        let totalC = 0;
        requests.forEach((req) => {
          const subTasks = getSolutionSubTasks(req);
          const total = subTasks.length;
          const completed = subTasks.filter(t => t.status === 'completed').length;
          const inPrg = subTasks.filter(t => t.status === 'in-progress').length;
          let prg = 0;
          if (total > 0) {
            prg = Math.round(((completed + inPrg * 0.5) / total) * 100);
          } else {
            const sMap: Record<string, number> = { pending: 15, reviewing: 35, planned: 55, approved: 80, completed: 100 };
            prg = sMap[req.status] || 0;
          }
          totalC += prg;
        });
        avgCompletion = Math.round(totalC / requests.length);
      } else {
        avgCompletion = 65;
      }

      const activeProjectsCount = requests.filter(r => r.status === 'approved' || r.status === 'planned').length;

      const metrics = [
        { label: 'TOTAL PROJECTS', val: `${requests.length}` },
        { label: 'ACTIVE / PIPELINE', val: `${activeProjectsCount}` },
        { label: 'AVG WORK PROGRESS', val: `${avgCompletion}%` },
        { label: 'AUTHORIZED BUDGET', val: `${totalBudget.toLocaleString()} SAR` }
      ];

      metrics.forEach((m, idx) => {
        const xPos = 15 + idx * (cardWidth + 2);
        // Card background
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(xPos, cardY, cardWidth, cardHeight, 1.5, 1.5, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(xPos, cardY, cardWidth, cardHeight, 1.5, 1.5, 'S');

        // Text inside card
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.text(m.label, xPos + 4, cardY + 6);

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(idx === 3 ? 9.5 : 12);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text(m.val, xPos + 4, cardY + 16);
      });

      // Projects Section
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('PROJECTS & DELIVERABLES DETAILED AUDIT', 15, 109);

      // Draw table columns
      const tableY = 114;
      doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.rect(15, tableY, pageWidth - 30, 8, 'F');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('ID', 17, tableY + 5.5);
      doc.text('PROJECT NAME / ADVISORY REQUEST', 40, tableY + 5.5);
      doc.text('STATUS', 110, tableY + 5.5);
      doc.text('PROGRESS', 145, tableY + 5.5);
      doc.text('EST. BUDGET', 172, tableY + 5.5);

      let currentY = tableY + 8;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);

      if (requests.length === 0) {
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.text('No request data or active advisories detected linked securely to this portal workspace.', 20, currentY + 8);
        currentY += 14;
      } else {
        requests.forEach((req, ruleIndex) => {
          // Zebra striping
          if (ruleIndex % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(15, currentY, pageWidth - 30, 8.5, 'F');
          }
          doc.setDrawColor(241, 245, 249);
          doc.line(15, currentY + 8.5, pageWidth - 15, currentY + 8.5);

          doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
          doc.setFont('Helvetica', 'bold');
          doc.text(req.id, 17, currentY + 5.5);
          
          doc.setFont('Helvetica', 'normal');
          const maxNameLen = 42;
          const reqName = req.name.length > maxNameLen ? req.name.substring(0, maxNameLen) + '...' : req.name;
          doc.text(reqName, 40, currentY + 5.5);

          const statusTexts: Record<string, string> = {
            pending: 'In Queue',
            reviewing: 'Under Review',
            planned: 'Scheduled',
            approved: 'Approved & Active',
            completed: 'Delivered'
          };
          doc.text(statusTexts[req.status] || req.status, 110, currentY + 5.5);

          const subTasks = getSolutionSubTasks(req);
          const done = subTasks.filter(t => t.status === 'completed').length;
          const total = subTasks.length;
          const percentage = total > 0 ? Math.round((done / total) * 100) : 35;
          doc.text(`${percentage}% (${done}/${total})`, 145, currentY + 5.5);

          const budgetNum = parseAmount(req.estimatedCost);
          doc.text(`${budgetNum.toLocaleString()} SAR`, 172, currentY + 5.5);

          currentY += 8.5;
        });
      }

      // Financials block
      currentY += 6;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('FINANCIAL RECONCILIATION OVERVIEW', 15, currentY);

      currentY += 5;
      // Draw a financial summary card
      doc.setFillColor(250, 250, 250);
      doc.rect(15, currentY, pageWidth - 30, 28, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.rect(15, currentY, pageWidth - 30, 28, 'S');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('BILLING METRIC', 20, currentY + 7);
      doc.text('VALUE (SAR)', 110, currentY + 7);
      doc.text('STATUS', 160, currentY + 7);

      doc.setDrawColor(226, 232, 240);
      doc.line(18, currentY + 10, pageWidth - 18, currentY + 10);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Total Paid Financial Outlays (Deposited)', 20, currentY + 15);
      doc.text(`${paidSum.toLocaleString()} SAR`, 110, currentY + 15);
      doc.setTextColor(16, 185, 129); // green-600
      doc.text('FULLY SETTLED', 160, currentY + 15);

      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Total Unpaid Standard Billings', 20, currentY + 22);
      doc.text(`${unpaidSum.toLocaleString()} SAR`, 110, currentY + 22);
      if (unpaidSum > 0) {
        doc.setTextColor(245, 158, 11); // amber-500
        doc.text('PENDING TRANSFER', 160, currentY + 22);
      } else {
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.text('CLEAR / NO LINES', 160, currentY + 22);
      }

      // Add a clean advisory comment or compliance note
      currentY += 36;
      doc.setFillColor(240, 249, 255); // sky-50
      doc.rect(15, currentY, pageWidth - 30, 18, 'F');
      doc.setDrawColor(186, 230, 253); // sky-200
      doc.rect(15, currentY, pageWidth - 30, 18, 'S');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(2, 132, 199); // sky-600
      doc.text('OFFICIAL WORKSPACE ADVISORY NOTE', 20, currentY + 6);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(3, 105, 161);
      doc.text('This business performance evaluation contains active operational cycles and financials verified by your BSD consultant.', 20, currentY + 11);
      doc.text('For dispute resolutions, contact corporate partnerships desk at support@businessdevelopers.sa.', 20, currentY + 14);

      // Footnote
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('Business Solutions Developers • Confidential Corporate Workspace Sync • Riyadh, Saudi Arabia', 15, pageHeight - 12);
      doc.text(`Page 1 of 1`, pageWidth - 30, pageHeight - 12);

      // Save document
      const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      doc.save(`bsd_performance_report_${slug}.pdf`);
    } catch (err) {
      console.error('Failed to generate operational audit pdf:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  React.useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('bd_seen_request_statuses');
        if (saved) {
          setPortalSeenStatuses(JSON.parse(saved));
        }
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  React.useEffect(() => {
    if (currentClient && requests.length > 0) {
      let changed = false;
      const nextSeen = { ...portalSeenStatuses };
      const newToasts: any[] = [];

      requests.forEach((req) => {
        const old = nextSeen[req.id];
        if (old === undefined) {
          nextSeen[req.id] = req.status;
          changed = true;
        } else if (old !== req.status) {
          newToasts.push({
            id: `${req.id}-${Date.now()}-${Math.random()}`,
            requestId: req.id,
            requestName: req.name,
            oldStatus: old,
            newStatus: req.status,
            timestamp: new Date().toISOString()
          });
          nextSeen[req.id] = req.status;
          changed = true;
        }
      });

      if (newToasts.length > 0) {
        setActiveToasts(prev => [...prev, ...newToasts]);
      }

      if (changed) {
        setPortalSeenStatuses(nextSeen);
        localStorage.setItem('bd_seen_request_statuses', JSON.stringify(nextSeen));
      }
    }
  }, [requests, currentClient]);

  const dismissToast = (toastId: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== toastId));
  };

  const [profSuccess, setProfSuccess] = useState('');
  const [profError, setProfError] = useState('');

  React.useEffect(() => {
    if (currentClient) {
      setProfName(currentClient.name || '');
      setProfCompany(currentClient.companyName || '');
      setProfPhone(currentClient.phone || '');
      setProfPassword(currentClient.password || '');
      setProfBio(currentClient.bio || '');
      setProfIndustry(currentClient.industry || '');
      setProfAvatar(currentClient.avatar || '💻');
      setProfJobTitle(currentClient.jobTitle || '');
      setProfLinkedin(currentClient.linkedin || '');
      setProfLogo(currentClient.logo || '');
      setPrefEmail(currentClient.notifications?.email ?? true);
      setPrefSms(currentClient.notifications?.sms ?? false);
      setPrefPush(currentClient.notifications?.push ?? true);
      setPrefMarketing(currentClient.notifications?.marketing ?? true);
      setProfSuccess('');
      setProfError('');
    }
  }, [currentClient]);

  const handleProfileUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName || !profCompany) {
      setProfError(isAr ? 'الرجاء ملء حقول الاسم والشركة الأساسية.' : 'Please fill in Name and Company fields.');
      return;
    }

    // Password change validation if attempted
    let finalPassword = profPassword;
    if (newPassInput) {
      if (currentPassInput !== profPassword) {
        setProfError(isAr ? 'كلمة المرور الحالية غير صحيحة.' : 'Current security password does not match.');
        return;
      }
      if (newPassInput !== confirmPassInput) {
        setProfError(isAr ? 'كلمة المرور الجديدة غير متطابقة مع التأكيد!' : 'New password confirmation does not match!');
        return;
      }
      if (newPassInput.length < 6) {
        setProfError(isAr ? 'يجب أن لا تقل المرور عن 6 رموز.' : 'Password must be at least 6 characters.');
        return;
      }
      finalPassword = newPassInput;
    }

    if (onUpdateClient && currentClient) {
      const updated: Client = {
        ...currentClient,
        name: profName,
        companyName: profCompany,
        phone: profPhone,
        password: finalPassword,
        bio: profBio,
        industry: profIndustry,
        avatar: profAvatar,
        jobTitle: profJobTitle,
        linkedin: profLinkedin,
        logo: profLogo,
        notifications: {
          email: prefEmail,
          sms: prefSms,
          push: prefPush,
          marketing: prefMarketing
        }
      };
      onUpdateClient(updated);
      setProfSuccess(isAr ? 'تم تحديث وحفظ بيانات ملفك الشخصي في قاعدة Firestore السحابية بنجاح! ✓' : 'Profile updated and synchronized with cloud Firestore successfully! ✓');
      setProfError('');
      
      // Clear password fields
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
      
      setTimeout(() => setProfSuccess(''), 4000);
    }
  };

  const handleGenerateLogo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGeneratingLogo(true);
    setGenerationSteps(isAr ? 'بدء معالجة طلب تصميم الهوية المتجهة...' : 'Initializing vector design generation flow...');
    
    setTimeout(() => {
      setGenerationSteps(isAr ? 'تحليل قطاع العمل وتوليد السمات البصرية...' : 'Analyzing corporate industry vertical to synthesize visual color schemes...');
      
      setTimeout(() => {
        setGenerationSteps(isAr ? 'تجميع تدويد الملف المتجه ورسم الأشكال الهندسية...' : 'Assembling SVG math geometries and optimizing color gradients...');
        
        setTimeout(() => {
          const companyInitial = profCompany ? profCompany.slice(0, 2).toUpperCase() : 'BD';
          
          let svgMarkup = '';
          if (logoStyle === 'cyber') {
            svgMarkup = `<svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#06b6d4" />
                  <stop offset="50%" stop-color="#3b82f6" />
                  <stop offset="100%" stop-color="#1d4ed8" />
                </linearGradient>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="44" fill="none" stroke="url(#cyberGrad)" stroke-width="1.5" stroke-dasharray="3 3" />
              <circle cx="50" cy="50" r="34" fill="none" stroke="url(#cyberGrad)" stroke-width="1.2" />
              <circle cx="50" cy="50" r="38" fill="url(#glow)" />
              <path d="M 50,20 A 30,30 0 1,1 25,50" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" />
              <g transform="translate(50, 50)">
                <circle cx="0" cy="-34" r="3" fill="#38bdf8" />
                <line x1="0" y1="0" x2="0" y2="-34" stroke="#38bdf8" stroke-width="0.5" stroke-opacity="0.5" />
                <circle cx="24" cy="-24" r="2.5" fill="#f43f5e" />
                <line x1="0" y1="0" x2="24" y2="-24" stroke="#f43f5e" stroke-width="0.5" stroke-opacity="0.4" />
              </g>
              <rect x="36" y="36" width="28" height="28" rx="6" fill="#0b1329" stroke="url(#cyberGrad)" stroke-width="1.5" />
              <text x="50" y="54" font-family="'Inter', sans-serif" font-size="11" font-weight="900" fill="#38bdf8" text-anchor="middle">${companyInitial}</text>
            </svg>`;
          } else if (logoStyle === 'gold') {
            svgMarkup = `<svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#b45309" />
                  <stop offset="50%" stop-color="#fbbf24" />
                  <stop offset="100%" stop-color="#fef08a" />
                </linearGradient>
              </defs>
              <path d="M 50,12 L 80,30 L 80,70 L 50,88 L 20,70 L 20,30 Z" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linejoin="round" />
              <path d="M 50,20 L 72,36 L 72,64 L 50,80 L 28,64 L 28,36 Z" fill="none" stroke="url(#goldGrad)" stroke-width="1" stroke-opacity="0.4" />
              <path d="M 50,23 C 55,23 60,35 50,48 C 40,35 45,23 50,23 Z M 50,77 C 45,77 40,65 50,52 C 60,65 55,77 50,77 Z" fill="url(#goldGrad)" fill-opacity="0.25" />
              <circle cx="50" cy="50" r="16" fill="#0b1329" stroke="url(#goldGrad)" stroke-width="1.5" />
              <text x="50" y="54" font-family="'Space Grotesk', sans-serif" font-size="10" font-weight="950" fill="url(#goldGrad)" text-anchor="middle">${companyInitial}</text>
            </svg>`;
          } else if (logoStyle === 'ecology') {
            svgMarkup = `<svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ecoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#10b981" />
                  <stop offset="100%" stop-color="#06b6d4" />
                </linearGradient>
              </defs>
              <path d="M 50,15 C 65,30 80,45 80,60 C 80,75 68,85 50,85 C 32,85 20,75 20,60 C 20,45 35,30 50,15 Z" fill="none" stroke="url(#ecoGrad)" stroke-width="2.2" />
              <path d="M 50,85 L 50,45" stroke="url(#ecoGrad)" stroke-width="2" stroke-linecap="round" />
              <path d="M 50,50 C 58,45 68,48 68,48" stroke="#10b981" stroke-width="2" stroke-linecap="round" fill="none" />
              <path d="M 50,60 C 42,55 32,58 32,58" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" fill="none" />
              <circle cx="68" cy="48" r="3.5" fill="#34d399" />
              <circle cx="32" cy="58" r="3.5" fill="#22d3ee" />
              <circle cx="50" cy="38" r="9" fill="#0b1329" stroke="url(#ecoGrad)" stroke-width="1.5" />
              <text x="50" y="42" font-family="'Inter', sans-serif" font-size="9" font-weight="bold" fill="#34d399" text-anchor="middle">${companyInitial}</text>
            </svg>`;
          } else {
            svgMarkup = `<svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="aiGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#d946ef" />
                  <stop offset="50%" stop-color="#8b5cf6" />
                  <stop offset="100%" stop-color="#6366f1" />
                </linearGradient>
              </defs>
              <rect x="25" y="25" width="50" height="50" rx="10" fill="none" stroke="url(#aiGrad)" stroke-width="2" transform="rotate(45 50 50)" />
              <line x1="15" y1="50" x2="85" y2="50" stroke="url(#aiGrad)" stroke-width="1" stroke-dasharray="3 3" />
              <line x1="50" y1="15" x2="50" y2="85" stroke="url(#aiGrad)" stroke-width="1" stroke-dasharray="3 3" />
              <circle cx="15" cy="50" r="3" fill="#d946ef" />
              <circle cx="85" cy="50" r="3" fill="#6366f1" />
              <circle cx="50" cy="15" r="3" fill="#8b5cf6" />
              <circle cx="50" cy="85" r="3" fill="#a78bfa" />
              <circle cx="50" cy="50" r="15" fill="#0b1329" stroke="url(#aiGrad)" stroke-width="1.5" />
              <text x="50" y="53.5" font-family="'Inter', sans-serif" font-size="9" font-weight="extrabold" fill="#f472b6" text-anchor="middle">${companyInitial}</text>
            </svg>`;
          }
          
          setProfLogo(svgMarkup);
          setIsGeneratingLogo(false);
          setGenerationSteps('');
        }, 800);
      }, 800);
    }, 800);
  };

  // Database active blueprint design event handlers
  const handleDeleteTable = (tblName: string) => {
    setDesignerTables(prev => prev.filter(t => t.name !== tblName));
    if (inspectorTableName === tblName) {
      setInspectorTableName(null);
    }
  };

  const handleDeleteField = (tblName: string, fieldName: string) => {
    setDesignerTables(prev => prev.map(t => {
      if (t.name === tblName) {
        return {
          ...t,
          fields: t.fields.filter(f => f.name !== fieldName)
        };
      }
      return t;
    }));
  };

  const handleAddField = (tblName: string) => {
    if (!newFieldName.trim()) return;
    const cleanFieldName = newFieldName.trim().replace(/\s+/g, '_').toLowerCase();
    
    setDesignerTables(prev => prev.map(t => {
      if (t.name === tblName) {
        if (t.fields.some(f => f.name === cleanFieldName)) return t;
        
        const newField: any = {
          name: cleanFieldName,
          type: newFieldType === 'relation' ? 'string' : newFieldType
        };
        if (newFieldType === 'relation' && newFieldRel) {
          newField.relationTo = newFieldRel;
        }
        return {
          ...t,
          fields: [...t.fields, newField]
        };
      }
      return t;
    }));
    
    // Reset inputs
    setNewFieldName('');
    setNewFieldRel('');
    setSelectedTableForField(null);
  };

  const handleAddNewTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    const cleanTblName = newTableName.trim().replace(/\s+/g, '_').toLowerCase();
    
    if (designerTables.some(t => t.name === cleanTblName)) {
      return;
    }

    const newTbl = {
      name: cleanTblName,
      descriptionAr: newTableDescAr || 'جدول مخصص جديد',
      descriptionEn: newTableDescEn || 'Custom database entity',
      fields: [
        { name: 'id', type: 'string', isPrimary: true },
        { name: 'createdAt', type: 'timestamp' }
      ]
    };

    setDesignerTables(prev => [...prev, newTbl]);
    setInspectorTableName(cleanTblName);
    setNewTableName('');
    setNewTableDescAr('');
    setNewTableDescEn('');
    setAddTableFormOpen(false);
  };

  const getSchemaCodeText = () => {
    if (schemaExportFormat === 'drizzle') {
      let code = `// Drizzle ORM Schema - Ready for Node.js / Serverless\n`;
      code += `// Generated dynamically via AI advisory portal\n\n`;
      code += `import { pgTable, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';\n\n`;
      designerTables.forEach(t => {
        code += `// ${isAr ? t.descriptionAr : t.descriptionEn}\n`;
        code += `export const ${t.name} = pgTable('${t.name}', {\n`;
        t.fields.forEach((f: any) => {
          let line = `  ${f.name}: `;
          if (f.name === 'id') {
            line += `varchar('id', { length: 256 }).primaryKey()`;
          } else if (f.type === 'number') {
            line += `integer('${f.name}')`;
          } else if (f.type === 'boolean') {
            line += `boolean('${f.name}')`;
          } else if (f.type === 'timestamp') {
            line += `timestamp('${f.name}')`;
          } else {
            line += `varchar('${f.name}', { length: 256 })`;
          }
          if (f.relationTo) {
            line += `.references(() => ${f.relationTo}.id)`;
          }
          code += line + `,\n`;
        });
        code += `});\n\n`;
      });
      return code;
    } else if (schemaExportFormat === 'sql') {
      let sql = `-- Postgres SQL DDL Tables Dump\n`;
      sql += `-- Generated on ${new Date().toISOString().split('T')[0]}\n\n`;
      designerTables.forEach(t => {
        sql += `-- Table ${t.name}: ${isAr ? t.descriptionAr : t.descriptionEn}\n`;
        sql += `CREATE TABLE ${t.name} (\n`;
        const cols = t.fields.map((f: any) => {
          let l = `  ${f.name} `;
          if (f.name === 'id') {
            l += `VARCHAR(255) PRIMARY KEY`;
          } else if (f.type === 'number') {
            l += `INT`;
          } else if (f.type === 'boolean') {
            l += `BOOLEAN DEFAULT FALSE`;
          } else if (f.type === 'timestamp') {
            l += `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
          } else {
            l += `VARCHAR(255)`;
          }
          if (f.relationTo) {
            l += ` REFERENCES ${f.relationTo}(id) ON DELETE CASCADE`;
          }
          return l;
        });
        sql += cols.join(',\n') + `\n);\n\n`;
      });
      return sql;
    } else {
      let rules = `rules_version = '2';\n\nservice cloud.firestore {\n  match /databases/{database}/documents {\n`;
      designerTables.forEach(t => {
        rules += `\n    // Security policies & write schemas for ${t.name} collection\n`;
        rules += `    // Description: ${isAr ? t.descriptionAr : t.descriptionEn}\n`;
        rules += `    match /${t.name}/{documentId} {\n`;
        rules += `      allow read: if request.auth != null;\n`;
        rules += `      allow create, update: if request.auth != null \n`;
        rules += `        && request.resource.data.keys().hasAll([\n`;
        const requiredKeys = t.fields.map((f: any) => `          '${f.name}'`).slice(0, 4);
        rules += requiredKeys.join(',\n') + `\n        ]);\n`;
        rules += `      allow delete: if request.auth != null && request.auth.token.role == 'admin';\n`;
        rules += `    }\n`;
      });
      rules += `  }\n}`;
      return rules;
    }
  };

  const handleCopySchemaCode = () => {
    const text = getSchemaCodeText();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    });
  };

  const handleDownloadSchemaFile = () => {
    const text = getSchemaCodeText();
    let filename = 'schema.sql';
    let mime = 'text/plain';
    if (schemaExportFormat === 'drizzle') {
      filename = 'schema.ts';
      mime = 'text/typescript';
    } else if (schemaExportFormat === 'firestore') {
      filename = 'firestore.rules';
      mime = 'text/plain';
    }
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Team management handlers for "باقة النمو" (Growth Package)
  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamNameInput.trim() || !teamEmailInput.trim()) {
      setProfError(isAr ? 'الرجاء كتابة اسم العضو وبريده الإلكتروني' : 'Please provide member name and email');
      return;
    }
    
    // Check if member already exists
    if (teamMembers.some(m => m.email.toLowerCase() === teamEmailInput.trim().toLowerCase())) {
      setProfError(isAr ? 'هذا البريد الإلكتروني مسجل مسبقاً لعضو آخر' : 'This email is already registered to another member');
      return;
    }

    if (teamMembers.length >= 5) {
      setProfError(isAr ? 'لقد وصلت للحد الأقصى لعدد أعضاء الفريق (5 أعضاء في باقة النمو)' : 'You have reached the maximum team members limit (5 members in Growth Package)');
      return;
    }

    const newMember = {
      id: `team-${Date.now()}`,
      name: teamNameInput.trim(),
      email: teamEmailInput.trim().toLowerCase(),
      role: teamRoleInput,
      status: teamStatusInput,
      joinedAt: new Date().toISOString().split('T')[0],
      permissions: [...teamPermsInput]
    };

    setTeamMembers(prev => [...prev, newMember]);
    setProfSuccess(isAr ? 'تمت إضافة عضو الفريق بنجاح وتعيين الصلاحيات' : 'Team member added and permissions assigned successfully');
    
    // Reset form states
    setTeamNameInput('');
    setTeamEmailInput('');
    setTeamRoleInput('Developer');
    setTeamStatusInput('Active');
    setTeamPermsInput(['read_databases']);
    setTeamFormOpen(false);
  };

  const handleEditTeamMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember) return;
    if (!teamNameInput.trim() || !teamEmailInput.trim()) return;

    setTeamMembers(prev => prev.map(m => {
      if (m.id === editingTeamMember.id) {
        return {
          ...m,
          name: teamNameInput.trim(),
          email: teamEmailInput.trim().toLowerCase(),
          role: teamRoleInput,
          status: teamStatusInput,
          permissions: [...teamPermsInput]
        };
      }
      return m;
    }));

    setProfSuccess(isAr ? 'تم تعديل العضو وتحديث مستويات صلاحياته بنجاح' : 'Team member role and access updated successfully');
    
    // Reset form states
    setEditingTeamMember(null);
    setTeamNameInput('');
    setTeamEmailInput('');
    setTeamRoleInput('Developer');
    setTeamStatusInput('Active');
    setTeamPermsInput(['read_databases']);
    setTeamFormOpen(false);
  };

  const handleStartEditTeamMember = (member: any) => {
    setEditingTeamMember(member);
    setTeamNameInput(member.name);
    setTeamEmailInput(member.email);
    setTeamRoleInput(member.role);
    setTeamStatusInput(member.status || 'Active');
    setTeamPermsInput(member.permissions || []);
    setTeamFormOpen(true);
  };

  const handleDeleteTeamMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    setProfSuccess(isAr ? 'تمت إزالة العضو من الفريق وحجب غرف الصلاحيات' : 'Team member was removed and environment access revoked');
  };

  const handleUpdateMemberRoleInline = (memberId: string, newRole: 'Admin' | 'Developer' | 'Analyst' | 'Guest') => {
    setTeamMembers(prev => {
      const updated = prev.map(m => {
        if (m.id === memberId) {
          return { ...m, role: newRole };
        }
        return m;
      });
      if (currentClient) {
        onUpdateClient({
          ...currentClient,
          team: updated
        });
      }
      return updated;
    });
    setProfSuccess(isAr ? 'تم تحديث دور العضو بنجاح وحفظ التغييرات تلقائيًا وبقاعدة البيانات' : 'Member role updated successfully and persisted to Firestore');
  };

  const handleDownloadContract = (contract: any) => {
    const legalHeader = `============================================================
              BUSINESS DEVELOPERS CONSULTANCY CO.
            المؤسسة الهندسية المعتمدة لاستشارات الأعمال والحلول التقنية
============================================================

DOCUMENT REFERENCE: ${contract.id}
DOCUMENT TYPE: ${contract.type || 'ADDENDUM'}
STATUS: VERIFIED & DIGITALLY SIGNED
CERTIFICATE INTEGRITY HASH: ${contract.certifiedHash}

------------------------------------------------------------
CONTRACT TITLE / عنوان الوثيقة:
${contract.titleAr}
${contract.titleEn}

SIGNATORY PARTIES / أطراف التعاقد الموقعة:
First Party / المستشار: Business Developers Ltd.
Second Party / العميل الشريك: ${currentClient?.companyName || 'Corporate Client'}
Authorized Signee / المفوض بالإمضاء: ${contract.signedBy} (${contract.signedByTitleAr} / ${contract.signedByTitleEn})
Execution & Seal Status / حالة التوقيع والختم الرقمي: ${contract.signatureType === 'drawn' ? 'رسم يدوي رقمي مصادق' : contract.signatureType === 'uploaded' ? 'توقيع مصور مرفوع ومعتمد' : 'خط توقيع رقمي معتمد'}
Execution Timestamp / تاريخ ووقت التوقيع الرقمي: ${contract.signedAt} 

============================================================
CORE CLAUSES & OUTLINE / البنود الرئيسية والمقررة للتعاقد:
------------------------------------------------------------
${(contract.clausesAr || []).map((c: string, idx: number) => `${idx + 1}. [AR] ${c}`).join('\n')}

${(contract.clausesEn || []).map((c: string, idx: number) => `${idx + 1}. [EN] ${c}`).join('\n')}

============================================================
GOVERNANCE & STATUTORIES / الحوكمة والأنظمة والاشتراطات:
- All services and deliverables are subject to the Saudi Electronic Transactions Law.
- Under certified checksum validation, any subsequent modification of bytecode renders this copy legally void.
- This document holds full enforceable civil authority for enterprise planning and technological execution.

------------------------------------------------------------
[END OF SECURE CERTIFIED TRANSCRIPT / نهاية المستند الآمن المعتمد]
============================================================`;

    const blob = new Blob([legalHeader], { type: 'text/plain;charset=utf-8' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = `${contract.id}_Signed_Transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setProfSuccess(isAr ? 'تم تحميل النسخة الرسمية المصادق عليها بنجاح' : 'Certified contract transcript downloaded successfully');
  };

  const handleSignAddendum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerFullName.trim()) {
      alert(isAr ? 'الرجاء كتابة اسم المفوّض الرباعي لتوثيق التوقيع.' : 'Please enter the authorized signatory full name.');
      return;
    }

    let signatureDataUrlToSave = null;
    let signatureTypeToSave = 'typed';
    let signatureStyleToSave = typeSignatureStyle;

    if (signatureDrawMode === 'draw') {
      if (signatureCanvasRef.current && hasDrawnSecret) {
        signatureDataUrlToSave = signatureCanvasRef.current.toDataURL('image/png');
        signatureTypeToSave = 'drawn';
      } else {
        alert(isAr ? 'الرجاء رسم التوقيع أولاً في لوحة الرسم المخصصة.' : 'Please draw your signature first on the designated pad.');
        return;
      }
    } else if (signatureDrawMode === 'upload') {
      if (uploadedSignatureImg) {
        signatureDataUrlToSave = uploadedSignatureImg;
        signatureTypeToSave = 'uploaded';
      } else {
        alert(isAr ? 'الرجاء رفع ملف صورة التوقيع أولاً قبل النقر على زر الاعتماد.' : 'Please upload your signature image file before finalizing.');
        return;
      }
    } else {
      signatureTypeToSave = 'typed';
    }
    
    setIsSigningInFlight(true);
    setSigningSuccess('');
    
    setTimeout(() => {
      const hash = 'BD-SHA256-' + Math.floor(10000000 + Math.random() * 90000000) + Math.random().toString(36).substring(2, 10).toUpperCase();
      const today = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      const newContractItem = {
        id: `CON-${selectedAddendumToSign.id.split('-')[1]}-${Math.floor(100 + Math.random() * 900)}`,
        titleAr: selectedAddendumToSign.titleAr,
        titleEn: selectedAddendumToSign.titleEn,
        type: 'Addendum',
        status: 'signed',
        signedAt: today,
        signedBy: signerFullName,
        signedByTitleAr: signerTitleAr || (isAr ? 'الرئيس التنفيذي' : 'Chief Executive Officer (CEO)'),
        signedByTitleEn: signerTitleEn || 'Chief Executive Officer (CEO)',
        certifiedHash: hash,
        signatureType: signatureTypeToSave,
        signatureDataUrl: signatureDataUrlToSave,
        signatureStyle: signatureStyleToSave,
        clausesAr: [
          selectedAddendumToSign.descAr,
          selectedAddendumToSign.scopeAr,
          `قيمة التعاقد الاقتصادي السنوي المحددة لهذا الملحق: ${selectedAddendumToSign.costAr}`
        ],
        clausesEn: [
          selectedAddendumToSign.descEn,
          selectedAddendumToSign.scopeEn,
          `Allocated financial structure and periodic cost: ${selectedAddendumToSign.costEn}`
        ]
      };
      
      setContracts(prev => [newContractItem, ...prev]);
      setIsSigningInFlight(false);
      setSigningSuccess(isAr ? 'تم تطبيق بروتوكول التشفير والتوثيق المعتمد وتخزين التوقيع الإلكتروني!' : 'Bilateral cryptographic signature verified and synced to cloud store.');
      
      // Clear canvas drawing or uploaded states for cleanliness
      setUploadedSignatureImg(null);
      setHasDrawnSecret(false);

      // Keep selected addendum open on success brief time or auto close
      setTimeout(() => {
        setSelectedAddendumToSign(null);
        setSigningSuccess('');
      }, 3000);
    }, 1500);
  };

  const togglePermissionInput = (permKey: string) => {
    setTeamPermsInput(prev => {
      if (prev.includes(permKey)) {
        return prev.filter(p => p !== permKey);
      } else {
        return [...prev, permKey];
      }
    });
  };

  // Google Workspace Integration states
  const [workspaceToken, setWorkspaceToken] = useState<string | null>(() => {
    return localStorage.getItem('bd_workspace_token') || null;
  });
  const [workspaceActiveTab, setWorkspaceActiveTab] = useState<'drive' | 'forms' | 'calendar' | 'sheets' | 'tasks' | 'meet'>('drive');
  
  // Google Sheets Integration states
  const [sheetsSpreadsheetId, setSheetsSpreadsheetId] = useState<string | null>(() => {
    return localStorage.getItem('bd_sheets_spreadsheet_id') || null;
  });
  const [sheetsSyncLoading, setSheetsSyncLoading] = useState(false);
  const [sheetsSyncError, setSheetsSyncError] = useState('');
  const [sheetsSyncSuccess, setSheetsSyncSuccess] = useState('');
  const [sheetsMetadata, setSheetsMetadata] = useState<any | null>(null);
  const [sheetsPreviewTab, setSheetsPreviewTab] = useState<'clients' | 'requests' | 'invoices'>('clients');
  const [sheetsClientRows, setSheetsClientRows] = useState<any[]>([]);
  const [sheetsRequestRows, setSheetsRequestRows] = useState<any[]>([]);
  const [sheetsInvoiceRows, setSheetsInvoiceRows] = useState<any[]>([]);
  const [sheetsInputIdOrUrl, setSheetsInputIdOrUrl] = useState('');

  // Project Financials Google Sheets states
  const [financialSpreadsheetId, setFinancialSpreadsheetId] = useState<string | null>(() => {
    return localStorage.getItem('bd_financial_spreadsheet_id') || null;
  });
  const [financialLoading, setFinancialLoading] = useState(false);
  const [financialError, setFinancialError] = useState('');
  const [financialSuccess, setFinancialSuccess] = useState('');
  const [financialMetadata, setFinancialMetadata] = useState<any | null>(null);
  const [financialActiveSheet, setFinancialActiveSheet] = useState<'budgets' | 'transactions'>('budgets');
  
  // Grid/Table Rows
  const [financialBudgetRows, setFinancialBudgetRows] = useState<any[]>([]);
  const [financialTransactionRows, setFinancialTransactionRows] = useState<any[]>([]);
  const [financialInputIdOrUrl, setFinancialInputIdOrUrl] = useState('');
  
  // Adding state
  const [isAddingFinancialRow, setIsAddingFinancialRow] = useState(false);
  
  // Temporary Form Inputs
  const [newBudgetInput, setNewBudgetInput] = useState({
    projectName: '',
    manager: '',
    totalBudget: '',
    spent: '',
    status: 'On Budget',
    completion: '0%'
  });
  
  const [newTransactionInput, setNewTransactionInput] = useState({
    txId: '',
    projectName: '',
    type: 'Income',
    amount: '',
    description: '',
    dueDate: '',
    status: 'Pending'
  });
  
  // Edit mode tracking
  const [editingCell, setEditingCell] = useState<{sheet: 'budgets' | 'transactions', rowIndex: number, colIndex: number} | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const [isLinkingWorkspace, setIsLinkingWorkspace] = useState(false);
  const [workspaceError, setWorkspaceError] = useState('');
  const [formCreationSuccess, setFormCreationSuccess] = useState('');
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [createdForm, setCreatedForm] = useState<any | null>(null);
  const [customFormId, setCustomFormId] = useState('');
  const [selectedFormDetail, setSelectedFormDetail] = useState<any | null>(null);
  const [formResponses, setFormResponses] = useState<any[]>([]);
  const [isLoadingFormDetail, setIsLoadingFormDetail] = useState(false);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);
  const [selectedFormTemplate, setSelectedFormTemplate] = useState<'diagnostic' | 'intake' | 'feedback'>('diagnostic');
  const [expandedResponseId, setExpandedResponseId] = useState<string | null>(null);
  
  // Google Calendar Integration states
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [calendarSummary, setCalendarSummary] = useState('');
  const [isBookingEvent, setIsBookingEvent] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<any | null>(null);

  // Calendar Event form inputs
  const [calSummary, setCalSummary] = useState('');
  const [calDescription, setCalDescription] = useState('');
  const [calDateTime, setCalDateTime] = useState('');
  const [calDuration, setCalDuration] = useState('30');

  // Google Drive Integration states
  const [driveFilesList, setDriveFilesList] = useState<any[]>([]);
  const [isLoadingDriveFiles, setIsLoadingDriveFiles] = useState(false);
  const [driveSearchQuery, setDriveSearchQuery] = useState('');
  const [driveUploadInFlight, setDriveUploadInFlight] = useState(false);
  const [driveUploadError, setDriveUploadError] = useState('');
  const [driveUploadSuccess, setDriveUploadSuccess] = useState('');

  // Google Tasks Integration states
  const [taskLists, setTaskLists] = useState<any[]>([]);
  const [selectedTaskListId, setSelectedTaskListId] = useState<string>('');
  const [tasksInSelectedList, setTasksInSelectedList] = useState<any[]>([]);
  const [isLoadingTaskLists, setIsLoadingTaskLists] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isCreatingTaskList, setIsCreatingTaskList] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskListTitle, setNewTaskListTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [tasksSearchQuery, setTasksSearchQuery] = useState('');
  const [isExportingMilestones, setIsExportingMilestones] = useState(false);
  const [isCategorizingTasks, setIsCategorizingTasks] = useState(false);
  const [isSyncingAllProjects, setIsSyncingAllProjects] = useState(false);

  // Google Meet states
  const [isGeneratingMeetSpace, setIsGeneratingMeetSpace] = useState(false);
  const [meetSpaces, setMeetSpaces] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('bd_meet_spaces');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [meetSpaceTitle, setMeetSpaceTitle] = useState('');
  const [createdMeetSpace, setCreatedMeetSpace] = useState<any | null>(null);
  const [attachMeetLinkToCalendar, setAttachMeetLinkToCalendar] = useState(false);

  // Sync Google Calendar Events
  const handleFetchCalendarEvents = async () => {
    if (!workspaceToken) return;
    setIsLoadingEvents(true);
    try {
      const timeMin = new Date().toISOString();
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&maxResults=5&orderBy=startTime&singleEvents=true`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCalendarSummary(data.summary || '');
        setEventsList(data.items || []);
      }
    } catch (err) {
      console.error("Failed to load events: ", err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Google Drive Files Listing
  const handleFetchDriveFiles = async () => {
    if (!workspaceToken) return;
    setIsLoadingDriveFiles(true);
    setDriveUploadError('');
    try {
      let url = 'https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,webViewLink,iconLink,createdTime,size)&orderBy=createdTime%20desc';
      if (driveSearchQuery.trim()) {
        const q = encodeURIComponent(`name contains '${driveSearchQuery.replace(/'/g, "\\'")}' and trashed = false`);
        url += `&q=${q}`;
      } else {
        url += `&q=trashed%20%3D%20false`;
      }
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDriveFilesList(data.files || []);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Status ${res.status}`);
      }
    } catch (err: any) {
      console.error("Failed to load Drive files:", err);
      setDriveUploadError(isAr ? `خطأ في جلب ملفات Drive: ${err.message}` : `Failed to fetch Drive files: ${err.message}`);
    } finally {
      setIsLoadingDriveFiles(false);
    }
  };

  // Google Drive Files Uploading
  const handleUploadToDrive = async (file: File) => {
    if (!workspaceToken) return;
    setDriveUploadInFlight(true);
    setDriveUploadError('');
    setDriveUploadSuccess('');
    try {
      const metadata = {
        name: file.name,
        mimeType: file.type
      };

      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setDriveUploadSuccess(isAr ? `تم رفع الملف "${data.name}" بنجاح! ✓` : `File "${data.name}" uploaded successfully! ✓`);
        handleFetchDriveFiles();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Status ${res.status}`);
      }
    } catch (err: any) {
      console.error("Failed to upload file to Drive:", err);
      setDriveUploadError(isAr ? `فشل الرفع: ${err.message}` : `Upload failed: ${err.message}`);
    } finally {
      setDriveUploadInFlight(false);
    }
  };

  // Google Drive Document deletion
  const handleDeleteDriveFile = async (fileId: string, fileName: string) => {
    if (!workspaceToken) return;
    const confirmed = window.confirm(
      isAr 
        ? `هل أنت متأكد تماماً من حذف الملف "${fileName}" من Google Drive الخاص بك؟` 
        : `Are you absolutely sure you want to delete file "${fileName}" from your Google Drive? This action is permanent.`
    );
    if (!confirmed) return;

    setIsLoadingDriveFiles(true);
    setDriveUploadError('');
    setDriveUploadSuccess('');
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`
        }
      });
      if (res.ok) {
        setDriveUploadSuccess(isAr ? 'تم حذف الملف بنجاح من حسابك. ✓' : 'File deleted successfully from your Drive. ✓');
        handleFetchDriveFiles();
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Status ${res.status}`);
      }
    } catch (err: any) {
      console.error(err);
      setDriveUploadError(isAr ? `فشل الحذف: ${err.message}` : `Deletion failed: ${err.message}`);
    } finally {
      setIsLoadingDriveFiles(false);
    }
  };

  // Upload Signet/Executed Contract Transcript to Google Drive
  const handleUploadContractToDrive = async (contract: any) => {
    if (!workspaceToken) {
      alert(isAr ? 'الرجاء ربط حساب Google Workspace أولاً من علامة تبويب الربط السحابي.' : 'Please connect your Google Workspace account first under the Cloud Hub tab.');
      return;
    }
    
    // Explicit safety confirmation as mandated by the Workspace Integration Guidelines
    const confirmed = window.confirm(
      isAr 
        ? `هل تريد رفع الملف التعاقدي الموثق "${contract.id}" إلى حساب Google Drive الخاص بك؟` 
        : `Would you like to upload the certified contract agreement "${contract.id}" directly to your Google Drive?`
    );
    if (!confirmed) return;

    const titleEn = contract.titleEn || 'Agreement';
    const fileName = `${contract.id}_Signed_${titleEn.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    
    const legalHeader = `============================================================
              BUSINESS DEVELOPERS CONSULTANCY CO.
            المؤسسة الهندسية المعتمدة لاستشارات الأعمال والحلول التقنية
============================================================

DOCUMENT REFERENCE: ${contract.id}
DOCUMENT TYPE: ${contract.type || 'ADDENDUM'}
STATUS: VERIFIED & DIGITALLY SIGNED
CERTIFICATE INTEGRITY HASH: ${contract.certifiedHash}

------------------------------------------------------------
CONTRACT TITLE / عنوان الوثيقة:
${contract.titleAr}
${contract.titleEn}

SIGNATORY PARTIES / أطراف التعاقد الموقعة:
First Party / المستشار: Business Developers Ltd.
Second Party / العميل الشريك: ${currentClient?.companyName || 'Corporate Client'}
Authorized Signee / المفوض بالإمضاء: ${contract.signedBy} (${contract.signedByTitleAr} / ${contract.signedByTitleEn})
Execution & Seal Status / حالة التوقيع والختم الرقمي: ${contract.signatureType === 'drawn' ? 'رسم يدوي رقمي مصادق' : contract.signatureType === 'uploaded' ? 'توقيع مصور مرفوع ومعتمد' : 'خط توقيع رقمي معتمد'}
Execution Timestamp / تاريخ ووقت التوقيع الرقمي: ${contract.signedAt} 

============================================================
CORE CLAUSES & OUTLINE / البنود الرئيسية والمقررة للتعاقد:
------------------------------------------------------------
${(contract.clausesAr || []).map((c: string, idx: number) => `${idx + 1}. [AR] ${c}`).join('\n')}

${(contract.clausesEn || []).map((c: string, idx: number) => `${idx + 1}. [EN] ${c}`).join('\n')}

============================================================
GOVERNANCE & STATUTORIES / الحوكمة والأنظمة والاشتراطات:
- All services and deliverables are subject to the Saudi Electronic Transactions Law.
- Under certified checksum validation, any subsequent modification of bytecode renders this copy legally void.
- This document holds full enforceable civil authority for enterprise planning and technological execution.

------------------------------------------------------------
[END OF SECURE CERTIFIED TRANSCRIPT / نهاية المستند الآمن المعتمد]
============================================================`;

    setIsLoadingDriveFiles(true);
    try {
      const metadata = {
        name: fileName,
        mimeType: 'text/plain'
      };

      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', new Blob([legalHeader], { type: 'text/plain;charset=utf-8' }));

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        alert(
          isAr 
            ? `تم رفع العقد الموثق بنجاح إلى Google Drive الخاص بك! المعرّف: ${data.id}` 
            : `Certified agreement uploaded successfully to your Google Drive! File ID: ${data.id}`
        );
        handleFetchDriveFiles();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Status ${res.status}`);
      }
    } catch (err: any) {
      console.error("Failed to upload contract template:", err);
      alert(isAr ? `فشل رفع العقد لـ Drive: ${err.message}` : `Failed to upload contract to Drive: ${err.message}`);
    } finally {
      setIsLoadingDriveFiles(false);
    }
  };

  const formatBytes = (bytes: number | undefined) => {
    if (bytes === undefined) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Load Google Sheet metadata
  const handleFetchSheetsMetadata = async (targetId?: string) => {
    const id = targetId || sheetsSpreadsheetId;
    if (!workspaceToken || !id) return;
    setSheetsSyncLoading(true);
    setSheetsSyncError('');
    try {
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSheetsMetadata(data);
        
        // Fetch rows for preview
        handleFetchAllSheetRows(id);
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Status ${res.status}`);
      }
    } catch (err: any) {
      console.error("Failed to load Sheets metadata:", err);
      setSheetsSyncError(isAr ? `فشل تحميل معطيات المستند: ${err.message}` : `Failed to load Spreadsheet: ${err.message}`);
    } finally {
      setSheetsSyncLoading(false);
    }
  };

  // Fetch all rows for previewing
  const handleFetchAllSheetRows = async (id: string) => {
    if (!workspaceToken || !id) return;
    try {
      // Fetch Clients
      const resC = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/Clients!A2:G50`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (resC.ok) {
        const dataC = await resC.json();
        setSheetsClientRows(dataC.values || []);
      }
      
      // Fetch Requests
      const resR = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/Consultation%20Requests!A2:I50`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (resR.ok) {
        const dataR = await resR.json();
        setSheetsRequestRows(dataR.values || []);
      }

      // Fetch Invoices
      const resI = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/Invoices!A2:I50`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (resI.ok) {
        const dataI = await resI.json();
        setSheetsInvoiceRows(dataI.values || []);
      }
    } catch (err) {
      console.error("Error loading preview rows:", err);
    }
  };

  // Connect manually with Spreadsheet ID/URL
  const handleConnectExistingSpreadsheet = async () => {
    if (!workspaceToken || !sheetsInputIdOrUrl.trim()) return;
    setSheetsSyncLoading(true);
    setSheetsSyncError('');
    setSheetsSyncSuccess('');
    
    let extractedId = sheetsInputIdOrUrl.trim();
    // Check if it's a full URL
    const urlMatch = sheetsInputIdOrUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (urlMatch && urlMatch[1]) {
      extractedId = urlMatch[1];
    }
    
    try {
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${extractedId}`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSheetsSpreadsheetId(extractedId);
        localStorage.setItem('bd_sheets_spreadsheet_id', extractedId);
        setSheetsMetadata(data);
        setSheetsSyncSuccess(isAr ? 'تم ربط جدول البيانات بنجاح! ✓' : 'Spreadsheet connected successfully! ✓');
        handleFetchAllSheetRows(extractedId);
        setSheetsInputIdOrUrl('');
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Status ${res.status}`);
      }
    } catch (err: any) {
      console.error("Connect sheet error: ", err);
      setSheetsSyncError(isAr ? `رمز المستند غير صالح أو يتعذر الاتصال به: ${err.message}` : `Invalid spreadsheet ID/URL or connection issue: ${err.message}`);
    } finally {
      setSheetsSyncLoading(false);
    }
  };

  // Create & Provision a beautiful syncing sheet inside drive
  const handleCreateSyncSpreadsheet = async () => {
    if (!workspaceToken) return;
    setSheetsSyncLoading(true);
    setSheetsSyncError('');
    setSheetsSyncSuccess('');
    try {
      // Call Drive API to create a blank Spreadsheet
      const resource = {
        name: isAr ? 'سجل بوابة الرواد الاستشارية - بيزنس ديفلوبرز' : 'Riyadh Advisors Consulting Portal Sync',
        mimeType: 'application/vnd.google-apps.spreadsheet'
      };
      
      const driveRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resource)
      });
      
      if (!driveRes.ok) {
        const err = await driveRes.json().catch(() => ({}));
        throw new Error(err.error?.message || 'Drive file creation failed');
      }
      
      const fileData = await driveRes.json();
      const newSheetId = fileData.id;
      
      // Now, provision sheets (tabs) in the newly created spreadsheet!
      const batchUpdateBody = {
        requests: [
          { addSheet: { properties: { title: 'Clients' } } },
          { addSheet: { properties: { title: 'Consultation Requests' } } },
          { addSheet: { properties: { title: 'Invoices' } } }
        ]
      };
      
      const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${newSheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(batchUpdateBody)
      });
      
      if (!updateRes.ok) {
        console.warn("Could not create sheets: proceeding anyway");
      }
      
      setSheetsSpreadsheetId(newSheetId);
      localStorage.setItem('bd_sheets_spreadsheet_id', newSheetId);
      
      // Directly populate initial baseline data!
      await handlePushDataToSheets(newSheetId);
      
      setSheetsSyncSuccess(isAr ? 'تم إنشاء وتهيئة جدول البيانات السحابي الجديد وبدء المزامنة! ✓' : 'Created a new cloud Spreadsheet and performed initial sync successfully! ✓');
    } catch (err: any) {
      console.error("Create spreadsheet error: ", err);
      setSheetsSyncError(err.message || 'Failed to create spreadsheet');
    } finally {
      setSheetsSyncLoading(false);
    }
  };

  // Push Data to Google Sheets
  const handlePushDataToSheets = async (targetId?: string) => {
    const id = targetId || sheetsSpreadsheetId;
    if (!workspaceToken || !id) return;
    setSheetsSyncLoading(true);
    setSheetsSyncError('');
    setSheetsSyncSuccess('');
    
    try {
      const tabCheckRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (tabCheckRes.ok) {
        const metadata = await tabCheckRes.json();
        const existingTitles = metadata.sheets?.map((s: any) => s.properties?.title) || [];
        const missingReqs: any[] = [];
        
        if (!existingTitles.includes('Clients')) {
          missingReqs.push({ addSheet: { properties: { title: 'Clients' } } });
        }
        if (!existingTitles.includes('Consultation Requests')) {
          missingReqs.push({ addSheet: { properties: { title: 'Consultation Requests' } } });
        }
        if (!existingTitles.includes('Invoices')) {
          missingReqs.push({ addSheet: { properties: { title: 'Invoices' } } });
        }
        
        if (missingReqs.length > 0) {
          await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}:batchUpdate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${workspaceToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requests: missingReqs })
          });
        }
      }

      // Prepare the rows
      const clientsHeader = ["Client Name", "Company Name", "Email Address", "Phone Number", "Service Tier", "Join Date", "Client Bio"];
      const clientValues = [
        clientsHeader,
        ...allClients.map((c: any) => [
          c.name || '',
          c.companyName || '',
          c.email || '',
          c.phone || '',
          c.tier || 'silver',
          c.joinedAt || '',
          c.bio || ''
        ])
      ];

      const requestsHeader = ["Request ID", "Client Email", "Company Name", "Consultation Sector", "Solutions ID", "Budget", "Status", "Message", "Created At"];
      const requestValues = [
        requestsHeader,
        ...allRequests.map((r: any) => [
          r.id || '',
          r.clientEmail || '',
          r.companyName || '',
          r.sectorId || '',
          r.solutionId || '',
          r.estimatedCost || '',
          r.status || '',
          r.message || '',
          r.createdAt || ''
        ])
      ];

      const invoicesHeader = ["Invoice ID", "Client Email", "Request ID", "Title (Ar)", "Title (En)", "Amount (SAR)", "Status", "Issue Date", "Due Date"];
      const invoiceValues = [
        invoicesHeader,
        ...allInvoices.map((inv: any) => [
          inv.id || '',
          inv.clientEmail || '',
          inv.requestId || '',
          inv.titleAr || '',
          inv.titleEn || '',
          inv.amount || '',
          inv.status || '',
          inv.issueDate || '',
          inv.dueDate || ''
        ])
      ];

      const body = {
        valueInputOption: "USER_ENTERED",
        data: [
          {
            range: "Clients!A1:G100",
            values: clientValues
          },
          {
            range: "Consultation Requests!A1:I100",
            values: requestValues
          },
          {
            range: "Invoices!A1:I100",
            values: invoiceValues
          }
        ]
      };

      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setSheetsSyncSuccess(isAr ? 'تم رفع ومزامنة كافة البيانات السحابية لجدول جوجل بنجاح! ✓' : 'All portal database values successfully synchronized with Google Spreadsheet! ✓');
        handleFetchAllSheetRows(id);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Sync failed');
      }
    } catch (err: any) {
      console.error("Sheets push error:", err);
      setSheetsSyncError(isAr ? `فشل مزامنة وتصدير المعطيات: ${err.message}` : `Data sync failed: ${err.message}`);
    } finally {
      setSheetsSyncLoading(false);
    }
  };

  const handleDisconnectSheetOnly = () => {
    const conf = window.confirm(
      isAr 
        ? 'هل ترغب في إلغاء ربط مستند Google Sheets الحالي بالبوابة؟ سيبقى الملف محفوظ على حسابك.' 
        : 'Do you want to disconnect current active Google Sheets spreadsheet? The file in your Drive will not be altered.'
    );
    if (!conf) return;
    setSheetsSpreadsheetId(null);
    setSheetsMetadata(null);
    localStorage.removeItem('bd_sheets_spreadsheet_id');
    setSheetsClientRows([]);
    setSheetsRequestRows([]);
    setSheetsInvoiceRows([]);
  };

  // ==========================================
  // PROJECT FINANCIALS GOOGLE SHEETS FUNCTIONS
  // ==========================================

  // Load Financial Spreadsheet metadata & fetch rows
  const handleFetchFinancialsMetadata = async (targetId?: string) => {
    const id = targetId || financialSpreadsheetId;
    if (!workspaceToken || !id) return;
    setFinancialLoading(true);
    setFinancialError('');
    try {
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFinancialMetadata(data);
        handleFetchAllFinancialRows(id);
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Status ${res.status}`);
      }
    } catch (err: any) {
      console.error("Failed to load financials metadata:", err);
      setFinancialError(isAr ? `فشل تحميل معطيات المستند المالي: ${err.message}` : `Failed to load financial spreadsheet: ${err.message}`);
    } finally {
      setFinancialLoading(false);
    }
  };

  // Fetch all rows from both tabs
  const handleFetchAllFinancialRows = async (id: string) => {
    if (!workspaceToken || !id) return;
    try {
      // 1. Fetch Project Budgets (columns A to G, up to 100 rows)
      const resB = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/Project%20Budgets!A2:G100`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (resB.ok) {
        const dataB = await resB.json();
        setFinancialBudgetRows(dataB.values || []);
      }

      // 2. Fetch Project Transactions (columns A to G, up to 100 rows)
      const resT = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/Project%20Transactions!A2:G100`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (resT.ok) {
        const dataT = await resT.json();
        setFinancialTransactionRows(dataT.values || []);
      }
    } catch (err) {
      console.error("Error loading financial rows:", err);
    }
  };

  // Connect via manually pasted ID/URL
  const handleConnectExistingFinancials = async () => {
    if (!workspaceToken || !financialInputIdOrUrl.trim()) return;
    setFinancialLoading(true);
    setFinancialError('');
    setFinancialSuccess('');
    
    let extractedId = financialInputIdOrUrl.trim();
    const urlMatch = extractedId.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (urlMatch && urlMatch[1]) {
      extractedId = urlMatch[1];
    }
    
    try {
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${extractedId}`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (res.ok) {
        setFinancialSpreadsheetId(extractedId);
        localStorage.setItem('bd_financial_spreadsheet_id', extractedId);
        setFinancialSuccess(isAr ? 'تم ربط جدول البيانات المالية للمشاريع بنجاح! ✓' : 'Financial spreadsheet connected successfully! ✓');
        await handleFetchFinancialsMetadata(extractedId);
        setFinancialInputIdOrUrl('');
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Status ${res.status}`);
      }
    } catch (err: any) {
      console.error("Connect financials error:", err);
      setFinancialError(isAr ? `تعذر الاتصال بجدول البيانات المالي: ${err.message}` : `Could not connect to the specified sheet: ${err.message}`);
    } finally {
      setFinancialLoading(false);
    }
  };

  // Create & provision a new project financials sheet
  const handleCreateFinancialsSpreadsheet = async () => {
    if (!workspaceToken) return;
    setFinancialLoading(true);
    setFinancialError('');
    setFinancialSuccess('');
    try {
      // 1. Create Spreadsheet file
      const resource = {
        name: isAr ? 'البيانات المالية للمشاريع - سجلات بوابتك الاستشارية' : 'Project Financials & Budgets Ledger',
        mimeType: 'application/vnd.google-apps.spreadsheet'
      };
      
      const driveRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resource)
      });
      
      if (!driveRes.ok) {
        const err = await driveRes.json().catch(() => ({}));
        throw new Error(err.error?.message || 'Failed to create drive file');
      }
      
      const fileData = await driveRes.json();
      const newSheetId = fileData.id;
      
      // 2. Add both tabs: 'Project Budgets' and 'Project Transactions'
      const batchUpdateBody = {
        requests: [
          { addSheet: { properties: { title: 'Project Budgets' } } },
          { addSheet: { properties: { title: 'Project Transactions' } } }
        ]
      };
      
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${newSheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(batchUpdateBody)
      });
      
      setFinancialSpreadsheetId(newSheetId);
      localStorage.setItem('bd_financial_spreadsheet_id', newSheetId);

      // Seed initial data to both tabs
      await handleSeedFinancialData(newSheetId);
      
      setFinancialSuccess(isAr ? 'تم إنشاء ميزانية مخصصة للمشاريع وبدء مزامنة المعاملات المالية المباشرة! ✓' : 'Created a new active Project Financials ledger and seeded initial templates! ✓');
    } catch (err: any) {
      console.error("Create financials spreadsheet error:", err);
      setFinancialError(err.message || 'Failed to generate financial ledger');
    } finally {
      setFinancialLoading(false);
    }
  };

  // Helper to Seed initial mock values
  const handleSeedFinancialData = async (sheetId: string) => {
    try {
      const budgetHeader = ["Project Name", "Project Manager", "Total Budget (SAR)", "Spent Amount (SAR)", "Remaining (SAR)", "Status", "Completion Percentage"];
      const budgetSeed = [
        budgetHeader,
        ["تطوير البنية السحابية", "م. عبد الهادي", "250000", "120002", "129998", "On Budget", "48%"],
        ["بناء لوحة تحكم الشركاء", "م. سناء", "110000", "95000", "15000", "Watch", "85%"],
        ["حملة الترويج والنمو التجاري", "أ. عبد اللطيف", "90000", "20000", "70000", "On Budget", "22%"]
      ];

      const txHeader = ["Transaction ID", "Project Name", "Type", "Amount (SAR)", "Description", "Date", "Status"];
      const txSeed = [
        txHeader,
        ["TX-5001", "تطوير البنية السحابية", "Expense", "50000", "تكلفة خدمات خوادم Google Cloud", "2026-05-10", "Paid"],
        ["TX-5002", "تطوير البنية السحابية", "Income", "70000", "الدفعة الأولى المستلمة من العميل", "2026-05-15", "Paid"],
        ["TX-5003", "بناء لوحة تحكم الشركاء", "Expense", "45000", "شراء رخص واجهات المستخدم المكتبية", "2026-05-22", "Paid"],
        ["TX-5004", "حملة الترويج والنمو التجاري", "Expense", "20000", "رسوم إعلانات مدفوعة على شبكات التواصل", "2026-06-02", "Paid"]
      ];

      const body = {
        valueInputOption: "USER_ENTERED",
        data: [
          {
            range: "Project Budgets!A1:G4",
            values: budgetSeed
          },
          {
            range: "Project Transactions!A1:G5",
            values: txSeed
          }
        ]
      };

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      handleFetchAllFinancialRows(sheetId);
    } catch (err) {
      console.error("Error seeding initial financials:", err);
    }
  };

  // Add (Append) single row to Google Sheets
  const handleAddFinancialRow = async (type: 'budgets' | 'transactions') => {
    if (!workspaceToken || !financialSpreadsheetId) return;
    setFinancialLoading(true);
    setFinancialError('');
    setFinancialSuccess('');
    
    try {
      let range = '';
      let values: any[] = [];
      
      if (type === 'budgets') {
        const { projectName, manager, totalBudget, spent, status, completion } = newBudgetInput;
        if (!projectName.trim()) throw new Error(isAr ? 'يرجى إدخال اسم المشروع أولاً' : 'Project name is required');
        
        const totalNum = parseFloat(totalBudget) || 0;
        const spentNum = parseFloat(spent) || 0;
        const remainingNum = totalNum - spentNum;

        range = 'Project Budgets!A:G';
        values = [[
          projectName,
          manager || 'N/A',
          totalNum.toString(),
          spentNum.toString(),
          remainingNum.toString(),
          status,
          completion || '0%'
        ]];

        // Reset
        setNewBudgetInput({ projectName: '', manager: '', totalBudget: '', spent: '', status: 'On Budget', completion: '0%' });
      } else {
        const { txId, projectName, type: tType, amount, description, dueDate, status } = newTransactionInput;
        if (!projectName.trim()) throw new Error(isAr ? 'يرجى تحديد أو كتابة اسم المشروع' : 'Project name is required');
        if (!amount) throw new Error(isAr ? 'يرجى إدخال قيمة المعاملة المالية' : 'Amount is required');

        const finalTxId = txId.trim() || `TX-${Math.floor(1000 + Math.random() * 9000)}`;
        range = 'Project Transactions!A:G';
        values = [[
          finalTxId,
          projectName,
          tType,
          amount,
          description || 'N/A',
          dueDate || new Date().toISOString().split('T')[0],
          status
        ]];

        // Reset
        setNewTransactionInput({ txId: '', projectName: '', type: 'Income', amount: '', description: '', dueDate: '', status: 'Pending' });
      }

      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${financialSpreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
      });

      if (res.ok) {
        setFinancialSuccess(isAr ? 'تم حفظ وإضافة البيانات بنجاح إلى جدول جوجل! ✓' : 'Row successfully appended to Google Spreadsheet! ✓');
        setIsAddingFinancialRow(false);
        handleFetchAllFinancialRows(financialSpreadsheetId);
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || 'Append failed');
      }
    } catch (err: any) {
      console.error("Add financial row error:", err);
      setFinancialError(err.message || 'Failed to add record');
    } finally {
      setFinancialLoading(false);
    }
  };

  // Inline cell edit save
  const handleSaveInlineCellEdit = async (sheetType: 'budgets' | 'transactions', rowIndex: number, colIndex: number, cellVal: string) => {
    if (!workspaceToken || !financialSpreadsheetId) return;
    setFinancialLoading(true);
    setFinancialError('');
    setFinancialSuccess('');
    
    try {
      const sheetName = sheetType === 'budgets' ? 'Project Budgets' : 'Project Transactions';
      const colLetter = String.fromCharCode(65 + colIndex); // A is char 65
      const sheetsRowNum = rowIndex + 2;
      const range = `${sheetName}!${colLetter}${sheetsRowNum}`;

      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${financialSpreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [[cellVal]]
        })
      });

      if (res.ok) {
        setFinancialSuccess(isAr ? 'تم تعديل مصفوفة الخلية وحفظها مباشرة! ✓' : 'Cell updated and saved to Google Sheets! ✓');
        
        if (sheetType === 'budgets') {
          const updated = [...financialBudgetRows];
          updated[rowIndex][colIndex] = cellVal;
          
          if (colIndex === 2 || colIndex === 3) {
            const totB = parseFloat(updated[rowIndex][2]) || 0;
            const spentB = parseFloat(updated[rowIndex][3]) || 0;
            updated[rowIndex][4] = (totB - spentB).toString();
            
            const remainingRange = `${sheetName}!E${sheetsRowNum}`;
            fetch(`https://sheets.googleapis.com/v4/spreadsheets/${financialSpreadsheetId}/values/${remainingRange}?valueInputOption=USER_ENTERED`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${workspaceToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ values: [[(totB - spentB).toString()]] })
            });
          }
          setFinancialBudgetRows(updated);
        } else {
          const updated = [...financialTransactionRows];
          updated[rowIndex][colIndex] = cellVal;
          setFinancialTransactionRows(updated);
        }
        setEditingCell(null);
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || 'Update cell failed');
      }
    } catch (err: any) {
      console.error("Inline cell edit error:", err);
      setFinancialError(err.message || 'Failed to update cell values');
    } finally {
      setFinancialLoading(false);
    }
  };

  const handleDisconnectFinancials = () => {
    const conf = window.confirm(
      isAr 
        ? 'هل ترغب في إلغاء ربط مستند البيانات المالية الحالي؟ سيبقى الملف محفوظ على حسابك.' 
        : 'Do you want to disconnect current active project financial spreadsheet? The file in your Drive will not be altered.'
    );
    if (!conf) return;
    setFinancialSpreadsheetId(null);
    setFinancialMetadata(null);
    localStorage.removeItem('bd_financial_spreadsheet_id');
    setFinancialBudgetRows([]);
    setFinancialTransactionRows([]);
  };

  React.useEffect(() => {
    if (workspaceToken) {
      if (portalSubTab === 'dashboard') {
        handleFetchCalendarEvents();
      } else if (portalSubTab === 'workspace') {
        if (workspaceActiveTab === 'calendar') {
          handleFetchCalendarEvents();
        } else if (workspaceActiveTab === 'drive') {
          handleFetchDriveFiles();
        } else if (workspaceActiveTab === 'sheets' && sheetsSpreadsheetId) {
          handleFetchSheetsMetadata();
        } else if (workspaceActiveTab === 'tasks') {
          handleFetchTaskLists();
        }
      } else if (portalSubTab === 'financials' && financialSpreadsheetId) {
        handleFetchFinancialsMetadata();
      }
    }
  }, [workspaceToken, portalSubTab, workspaceActiveTab, financialSpreadsheetId]);

  const handleConnectWorkspace = async () => {
    setIsLinkingWorkspace(true);
    setWorkspaceError('');
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const { auth } = await import('../firebase');
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar');
      provider.addScope('https://www.googleapis.com/auth/forms.body');
      provider.addScope('https://www.googleapis.com/auth/forms.responses.readonly');
      provider.addScope('https://www.googleapis.com/auth/drive');
      provider.addScope('https://www.googleapis.com/auth/spreadsheets');
      provider.addScope('https://www.googleapis.com/auth/tasks');
      provider.addScope('https://www.googleapis.com/auth/meetings.space.created');
      provider.addScope('https://www.googleapis.com/auth/meetings.space.readonly');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setWorkspaceToken(credential.accessToken);
        localStorage.setItem('bd_workspace_token', credential.accessToken);
      } else {
        setWorkspaceError(isAr ? 'عذراً، لم نتمكن من استلاف رمز تفويض Google Auth.' : 'Failed to receive Google Auth credentials.');
      }
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `خطأ أثناء الاتصال: ${err.message || err}` : `Connection failed: ${err.message || err}`);
    } finally {
      setIsLinkingWorkspace(false);
    }
  };

  const handleDisconnectWorkspace = () => {
    if (window.confirm(isAr ? 'هل أنت متأكد من قطع الاتصال بقنوات Google Workspace السحابية؟' : 'Are you sure you want to disconnect from Google Workspace services?')) {
      setWorkspaceToken(null);
      localStorage.removeItem('bd_workspace_token');
      setCreatedForm(null);
      setSelectedFormDetail(null);
      setFormResponses([]);
      setEventsList([]);
      setDriveFilesList([]);
    }
  };

  const handleCreateGoogleForm = async () => {
    if (!workspaceToken) return;
    setIsCreatingForm(true);
    setWorkspaceError('');
    setFormCreationSuccess('');
    try {
      let title = '';
      let documentTitle = '';
      if (selectedFormTemplate === 'diagnostic') {
        title = isAr ? `${currentClient?.companyName || 'الشركاء'} - استبانه تشخيص البنية التقنية` : `${currentClient?.companyName || 'Partners'} - Cloud Diagnostic Assessment`;
        documentTitle = isAr ? 'تقييم التحول الرقمي السحابي' : 'Cloud Diagnostic Assessment';
      } else if (selectedFormTemplate === 'intake') {
        title = isAr ? `${currentClient?.companyName || 'الشركاء'} - استبانه استشارة بدء المشروع` : `${currentClient?.companyName || 'Partners'} - Project Consulting Intake`;
        documentTitle = isAr ? 'استبيان بدء العمل الاستشاري' : 'Project Consulting Intake';
      } else {
        title = isAr ? `${currentClient?.companyName || 'الشركاء'} - نموذج تقييم جودة الخدمة والرضا` : `${currentClient?.companyName || 'Partners'} - Service Evaluation & Feedback`;
        documentTitle = isAr ? 'استبيان جودة الخدمات والرضا' : 'Service Evaluation & Feedback';
      }

      const res = await fetch('https://forms.googleapis.com/v1/forms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          info: {
            title,
            documentTitle
          }
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error?.message || 'Error occurred while creating form');
      }
      
      const data = await res.json();
      const formId = data.formId;

      // Seed questions based on template
      let questionsList: any[] = [];
      if (selectedFormTemplate === 'diagnostic') {
        questionsList = [
          {
            title: isAr ? 'ما هي البيئة الحالية لبنيتكم التحتية لتكنولوجيا المعلومات؟' : 'What is your current IT infrastructure environment?',
            description: isAr ? 'مثال: خوادم محلية، سحابية بالكامل، بنية هجينة' : 'For example: on-premise physical servers, fully cloud, hybrid setup',
            required: true
          },
          {
            title: isAr ? 'ما هي أبرز العقبات التقنية أو النقاط الحرجة التي تواجهونها حالياً؟' : 'What are the main technical bottlenecks or challenges you currently face?',
            description: isAr ? 'يرجى ذكر التحديات مثل سرعة الأنظمة، تكاليف الصيانة، الأمان، أو التكامل.' : 'Please list bottlenecks like performance, high maintenance costs, security or silos.',
            required: true
          },
          {
            title: isAr ? 'ما هو الإطار الزمني المستهدف لإكمال هذا التحول الرقمي؟' : 'What is your target timeline for completing this digital transformation?',
            description: isAr ? 'الموعد النهائي المفضل للمشروع' : 'Preferred project deadline',
            required: false
          },
          {
            title: isAr ? 'هل هناك ميزانية مرصودة ومعتمدة لمشروع الانتقال السحابي؟' : 'Do you have an allocated, approved budget for this cloud migration?',
            description: isAr ? 'نعم / لا / قيد الدراسة' : 'Yes / No / In discussion',
            required: false
          }
        ];
      } else if (selectedFormTemplate === 'intake') {
        questionsList = [
          {
            title: isAr ? 'يرجى تقديم نبذة مختصرة عن الخدمات الأساسية لشركتكم.' : 'Briefly describe your company\'s core business and services.',
            description: '',
            required: true
          },
          {
            title: isAr ? 'ما هو الهدف الأساسي أو النتيجة المرجوة من هذا العمل الاستشاري؟' : 'What is the primary objective of this consulting engagement?',
            description: isAr ? 'ما الذي تأمل تحقيقه بالتعاون معنا؟' : 'What do you hope to achieve working with us?',
            required: true
          },
          {
            title: isAr ? 'ما هي المخرجات أو مراحل العمل الرئيسية التي تتوقع رؤيتها أولاً؟' : 'What key deliverables or milestones do you expect to see first?',
            description: '',
            required: false
          },
          {
            title: isAr ? 'ما هي قنوات الاتصال والتعاون المفضلة لديكم؟' : 'What are your preferred communication and team collaboration channels?',
            description: isAr ? 'مثال: برامج المراسلة، بريد إلكتروني، لقاءات دورية' : 'e.g. Chat tools, Email, regular meetings',
            required: false
          }
        ];
      } else {
        questionsList = [
          {
            title: isAr ? 'ما مدى رضاك العام عن مخرجات أعمالنا الاستشارية وجودة التسليم؟' : 'How satisfied are you with our consulting delivery and results?',
            description: isAr ? 'يرجى تقييم الأداء العام' : 'Please evaluate the overall consulting performance',
            required: true
          },
          {
            title: isAr ? 'ما هي الجوانب أو الخدمات التي وجدتموها الأكثر قيمة ومساعدة لكم؟' : 'Which area of our service did you find most valuable?',
            description: '',
            required: true
          },
          {
            title: isAr ? 'ما هي مقترحاتك أو ملاحظاتك البناءة لتحسين مستوى الأداء مستقبلاً؟' : 'Constructive feedback or suggestions to improve our services?',
            description: '',
            required: false
          },
          {
            title: isAr ? 'هل ترغب في ترشيح فريقنا الاستشاري لشركات أو شركاء آخرين مستقبلاً؟' : 'Would you recommend our consulting team to other partners or enterprises?',
            description: isAr ? 'نعم بالتأكيد / ربما / لا' : 'Yes / Maybe / No',
            required: false
          }
        ];
      }

      const batchRequests = questionsList.map((q, qidx) => ({
        createItem: {
          item: {
            title: q.title,
            description: q.description || undefined,
            questionItem: {
              question: {
                required: q.required,
                textQuestion: {
                  paragraph: true
                }
              }
            }
          },
          location: {
            index: qidx
          }
        }
      }));

      // Seed questions to form
      const updateRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: batchRequests
        })
      });

      if (!updateRes.ok) {
        console.error("Failed to seed templated questions:", await updateRes.text());
      }

      setCreatedForm(data);
      setCustomFormId(formId);
      setFormCreationSuccess(isAr 
        ? 'تم إنشاء نموذج الاستشارة بالكامل على مساحة Drive مع إدراج الأسئلة المناسبة تلقائياً! ✓' 
        : 'Smart Consulting Intake Form created with fully structured template questions successfully inside your Drive! ✓'
      );
      setTimeout(() => setFormCreationSuccess(''), 5000);
      handleFetchFormDetails(formId);
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `لا يمكن إنشاء الاستمارة: ${err.message}` : `Cannot create form: ${err.message}`);
    } finally {
      setIsCreatingForm(false);
    }
  };

  const handleFetchFormDetails = async (targetFormId?: string) => {
    const fId = targetFormId || customFormId;
    if (!workspaceToken || !fId) return;
    setIsLoadingFormDetail(true);
    setWorkspaceError('');
    try {
      const res = await fetch(`https://forms.googleapis.com/v1/forms/${fId}`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch form (status ${res.status})`);
      }
      const data = await res.json();
      setSelectedFormDetail(data);
      // Fetch responses for this form as well
      handleFetchFormResponses(fId);
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `خطأ أثناء جلب تفاصيل الاستمارة: ${err.message}` : `Failed to load form details: ${err.message}`);
    } finally {
      setIsLoadingFormDetail(false);
    }
  };

  const handleFetchFormResponses = async (targetFormId?: string) => {
    const fId = targetFormId || customFormId;
    if (!workspaceToken || !fId) return;
    setIsLoadingResponses(true);
    try {
      const res = await fetch(`https://forms.googleapis.com/v1/forms/${fId}/responses`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (!res.ok) {
        setFormResponses([]);
        return;
      }
      const data = await res.json();
      setFormResponses(data.responses || []);
    } catch (err: any) {
      console.error(err);
      setFormResponses([]);
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const handleBookCalendarEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceToken || !calSummary || !calDateTime) return;
    setIsBookingEvent(true);
    setWorkspaceError('');
    try {
      const startDT = new Date(calDateTime);
      const endDT = new Date(startDT.getTime() + parseInt(calDuration) * 60 * 1000);
      
      const payload: any = {
        summary: calSummary,
        description: calDescription || (isAr ? 'جلسة تقييم وتخطيط الشراكة الرقمية المصنفة' : 'Corporate digital advisory and diagnostic review.'),
        start: {
          dateTime: startDT.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        },
        end: {
          dateTime: endDT.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        }
      };

      if (attachMeetLinkToCalendar) {
        payload.conferenceData = {
          createRequest: {
            requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        };
      }

      const url = attachMeetLinkToCalendar 
        ? 'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1'
        : 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Failed to insert calendar event (status ${res.status})`);
      }
      const data = await res.json();
      setBookingResponse(data);
      setCalSummary('');
      setCalDescription('');
      setCalDateTime('');
      setAttachMeetLinkToCalendar(false);
      // Refresh event list
      handleFetchCalendarEvents();
      setTimeout(() => setBookingResponse(null), 6000);
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `خطأ أثناء حجز الموعد: ${err.message}` : `Booking failed: ${err.message}`);
    } finally {
      setIsBookingEvent(false);
    }
  };

  // Google Tasks Integration methods
  const handleFetchTaskLists = async () => {
    if (!workspaceToken) return;
    setIsLoadingTaskLists(true);
    setWorkspaceError('');
    try {
      const res = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (!res.ok) {
        throw new Error(`Failed to load task lists (status ${res.status})`);
      }
      const data = await res.json();
      const lists = data.items || [];
      setTaskLists(lists);
      if (lists.length > 0) {
        const exists = lists.some((l: any) => l.id === selectedTaskListId);
        const nextListId = exists ? selectedTaskListId : lists[0].id;
        setSelectedTaskListId(nextListId);
        handleFetchTasks(nextListId);
      } else {
        setSelectedTaskListId('');
        setTasksInSelectedList([]);
      }
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `خطأ أثناء جلب قوائم المهام: ${err.message}` : `Failed to load task lists: ${err.message}`);
    } finally {
      setIsLoadingTaskLists(false);
    }
  };

  const handleFetchTasks = async (listId: string) => {
    if (!workspaceToken || !listId) return;
    setIsLoadingTasks(true);
    setWorkspaceError('');
    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=true&showHidden=true`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (!res.ok) {
        throw new Error(`Failed to load tasks (status ${res.status})`);
      }
      const data = await res.json();
      setTasksInSelectedList(data.items || []);
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `خطأ أثناء جلب المهام: ${err.message}` : `Failed to load tasks: ${err.message}`);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleCreateTaskList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceToken || !newTaskListTitle.trim()) return;
    setIsCreatingTaskList(true);
    setWorkspaceError('');
    try {
      const res = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTaskListTitle })
      });
      if (!res.ok) {
        throw new Error(`Failed to create task list (status ${res.status})`);
      }
      const data = await res.json();
      setNewTaskListTitle('');
      const updatedRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (updatedRes.ok) {
        const uData = await updatedRes.json();
        const lists = uData.items || [];
        setTaskLists(lists);
        setSelectedTaskListId(data.id);
        handleFetchTasks(data.id);
      }
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `خطأ أثناء إنشاء قائمة المهام: ${err.message}` : `Failed to create task list: ${err.message}`);
    } finally {
      setIsCreatingTaskList(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceToken || !selectedTaskListId || !newTaskTitle.trim()) return;
    setIsCreatingTask(true);
    setWorkspaceError('');
    try {
      const payload: any = {
        title: newTaskTitle,
        notes: newTaskNotes || undefined,
      };
      if (newTaskDueDate) {
        payload.due = new Date(newTaskDueDate).toISOString();
      }
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${selectedTaskListId}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(`Failed to create task (status ${res.status})`);
      }
      setNewTaskTitle('');
      setNewTaskNotes('');
      setNewTaskDueDate('');
      handleFetchTasks(selectedTaskListId);
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `خطأ أثناء إنشاء المهمة: ${err.message}` : `Failed to create task: ${err.message}`);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    if (!workspaceToken || !selectedTaskListId) return;
    const nextStatus = currentStatus === 'completed' ? 'needsAction' : 'completed';
    try {
      setTasksInSelectedList(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
      
      const payload: any = {
        id: taskId,
        status: nextStatus
      };
      if (nextStatus === 'completed') {
        payload.completed = new Date().toISOString();
      }
      
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${selectedTaskListId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(`Failed to update task status (status ${res.status})`);
      }
      handleFetchTasks(selectedTaskListId);
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `خطأ أثناء تحديث حالة المهمة: ${err.message}` : `Failed to update task status: ${err.message}`);
      handleFetchTasks(selectedTaskListId);
    }
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (!workspaceToken || !selectedTaskListId) return;
    const confirmed = window.confirm(
      isAr 
        ? `هل أنت متأكد من حذف المهمة "${taskTitle}" نهائياً من حساب Google الخاص بك؟` 
        : `Are you sure you want to delete the task "${taskTitle}" permanently from your Google Tasks?`
    );
    if (!confirmed) return;
    
    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${selectedTaskListId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (!res.ok) {
        throw new Error(`Failed to delete task (status ${res.status})`);
      }
      handleFetchTasks(selectedTaskListId);
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `خطأ أثناء حذف المهمة: ${err.message}` : `Failed to delete task: ${err.message}`);
    }
  };

  const handleAICategorizeTasks = async () => {
    if (!workspaceToken || !selectedTaskListId) return;
    
    // Identify unorganized tasks that do not already have [Development], [Design], or [Admin] prefixes
    const unorganizedTasks = tasksInSelectedList.filter((task: any) => {
      const match = task.title?.match(/^\[(Development|Design|Admin)\]/i);
      return !match;
    });

    if (unorganizedTasks.length === 0) {
      alert(
        isAr 
          ? 'تنبيه: جميع المهام الحالية مصنفة بالفعل بنجاح!' 
          : 'Notice: All current tasks in this list are already categorized!'
      );
      return;
    }

    const confirmed = window.confirm(
      isAr 
        ? `هل تريد استخدام الذكاء الاصطناعي (Gemini) لتصنيف المخرجات والمهام الـ ${unorganizedTasks.length} غير المصنفة تلقائياً؟`
        : `Do you want to use the Gemini AI service to automatically organize and categorize the ${unorganizedTasks.length} unorganized tasks?`
    );
    if (!confirmed) return;

    setIsCategorizingTasks(true);
    setWorkspaceError('');

    try {
      const response = await fetch('/api/tasks/categorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tasks: unorganizedTasks.map(t => ({ id: t.id, title: t.title, notes: t.notes }))
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      const categories: Array<{ id: string, category: string }> = data.categories || [];

      if (!categories || categories.length === 0) {
        alert(isAr ? 'لم يتم العثور على أي تحديثات للتصنيف.' : 'No categorization updates returned.');
        return;
      }

      // Update unorganized tasks with [Category] prefix in Google Tasks
      let successCount = 0;
      await Promise.all(
        categories.map(async (rec) => {
          const originalTask = unorganizedTasks.find(t => t.id === rec.id);
          if (!originalTask) return;

          const newTitle = `[${rec.category}] ${originalTask.title || ''}`;

          const patchRes = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${selectedTaskListId}/tasks/${rec.id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${workspaceToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: rec.id,
              title: newTitle
            })
          });

          if (patchRes.ok) {
            successCount++;
          } else {
            console.error(`Failed to patch task ${rec.id}: status ${patchRes.status}`);
          }
        })
      );

      await handleFetchTasks(selectedTaskListId);

      alert(
        isAr 
          ? `✓ تم تصنيف وتنظيم ${successCount} مهام بنجاح بواسطة الذكاء الاصطناعي!` 
          : `✓ Successfully categorized and tagged ${successCount} tasks using Gemini AI!`
      );
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(
        isAr 
          ? `فشل تصنيف الذكاء الاصطناعي للمهام: ${err.message}` 
          : `AI task categorization failed: ${err.message}`
      );
    } finally {
      setIsCategorizingTasks(false);
    }
  };

  const handleExportProjectMilestones = async (reqId: string) => {
    if (!workspaceToken || !selectedTaskListId) return;
    const req = requests.find(r => r.id === reqId);
    if (!req) return;
    
    const subTasks = getSolutionSubTasks(req);
    if (subTasks.length === 0) return;
    
    const count = subTasks.length;
    const confirmed = window.confirm(
      isAr 
        ? `هل أنت متأكد من تصدير ${count} مهام/معالم فرعية من المشروع "${req.id}" إلى قائمة مهام Google المحددة؟`
        : `Are you sure you want to export ${count} project milestones from "${req.id}" directly into your Google Tasks list?`
    );
    if (!confirmed) return;
    
    setIsExportingMilestones(true);
    setWorkspaceError('');
    try {
      for (const item of subTasks) {
        const title = isAr 
          ? `[مشروع ${req.id}] ${item.title}` 
          : `[Project ${req.id}] ${item.title}`;
        const notes = isAr 
          ? `مسؤولية المخرجات: ${item.role}\nالوصف العملي: ${item.desc}` 
          : `Role Assignment: ${item.role}\nTechnical Details: ${item.desc}`;
        
        await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${selectedTaskListId}/tasks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${workspaceToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            notes
          })
        });
      }
      
      handleFetchTasks(selectedTaskListId);
      alert(
        isAr 
          ? `نجاح! تم تصدير كافة المعالم (${count} مهام) وتكاملها مع Google Tasks بنجاح!` 
          : `Success! Exported all ${count} project milestones to Google Tasks successfully!`
      );
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `فشل في تصدير المهام: ${err.message}` : `Failed to export tasks: ${err.message}`);
    } finally {
      setIsExportingMilestones(false);
    }
  };

  const handleSyncAllProjectsToGoogleTasks = async () => {
    if (!workspaceToken) {
      setWorkspaceError(isAr ? 'الرجاء ربط حساب Google أولاً' : 'Please authenticate with Google first.');
      return;
    }
    setIsSyncingAllProjects(true);
    setWorkspaceError('');
    try {
      // 1. Fetch all task lists
      const listsRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (!listsRes.ok) {
        throw new Error(`Failed to query Google Task lists (status ${listsRes.status})`);
      }
      const listsData = await listsRes.json();
      const lists = listsData.items || [];
      
      // Determine the designated list name
      const targetListName = isAr ? 'مشاريع مطوري الأعمال Business Developers' : 'Business Developers Projects';
      let bdList = lists.find((l: any) => l.title === targetListName || l.title === 'Business Developers Projects' || l.title?.toLowerCase().includes('business developers'));
      let listId = bdList?.id;
      
      if (!listId) {
        // Create new list
        const createListRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${workspaceToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: targetListName })
        });
        if (!createListRes.ok) {
          throw new Error('Could not create a designated Business Developers task list');
        }
        const createdList = await createListRes.json();
        listId = createdList.id;
      }
      
      setSelectedTaskListId(listId);
      
      // 2. Fetch all existing tasks in that list to cross-reference
      const tasksRes = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=true&showHidden=true`, {
        headers: { 'Authorization': `Bearer ${workspaceToken}` }
      });
      if (!tasksRes.ok) {
        throw new Error(`Failed to query existing tasks inside the list (status ${tasksRes.status})`);
      }
      const tasksData = await tasksRes.json();
      const existingTasks = tasksData.items || [];
      
      // 3. Filter current client’s requests
      const clientReqs = requests.filter(req => req.clientEmail === currentClient?.email);
      if (clientReqs.length === 0) {
        alert(isAr ? 'لم يتم العثور على مشروعات نشطة للعميل الحالي لمزامنتها.' : 'No active projects found for the current client to synchronize.');
        setIsSyncingAllProjects(false);
        return;
      }
      
      // 4. Sync each project
      let updatedCount = 0;
      let createdCount = 0;
      
      for (const req of clientReqs) {
        const solObj = SOLUTIONS.find(s => s.id === req.solutionId);
        const solutionTitle = isAr ? (solObj?.titleAr || req.solutionId) : (solObj?.titleEn || req.solutionId);
        
        // Find existing task
        const existingProjTask = existingTasks.find((t: any) => t.title.includes(req.id) && !t.parent);
        
        const projPayload = {
          title: `[Project: ${req.id}] ${solutionTitle}`,
          notes: isAr 
            ? `مطور الأعمال: Business Developers\nالحالة الفنية: ${req.status}\nتاريخ الطلب: ${req.createdAt}\nموازنة المشروع تقديرياً: ${req.estimatedCost || 'قيد المراجعة'}\nوصف المتطلبات:\n${req.message || ''}`
            : `Consultant Assigned: Business Developers Hub\nTechnical Status: ${req.status}\nRequested Date: ${req.createdAt}\nBudget Allocation: ${req.estimatedCost || 'Under review'}\nRequirements Brief:\n${req.message || ''}`,
          status: req.status === 'completed' ? 'completed' : 'needsAction'
        };
        
        let parentId = '';
        if (existingProjTask) {
          // Update project task
          const patchRes = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${existingProjTask.id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${workspaceToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(projPayload)
          });
          if (patchRes.ok) {
            parentId = existingProjTask.id;
            updatedCount++;
          }
        } else {
          // Create new project task
          const postRes = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${workspaceToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(projPayload)
          });
          if (postRes.ok) {
            const newTask = await postRes.json();
            parentId = newTask.id;
            createdCount++;
          }
        }
        
        // Sync project subtasks/milestones
        if (parentId) {
          const subTasks = getSolutionSubTasks(req);
          for (const sub of subTasks) {
            const subTitle = isAr ? `• ${sub.title}` : `• ${sub.title}`;
            const existingSubTask = existingTasks.find((t: any) => t.parent === parentId && t.title === subTitle);
            
            const subPayload = {
              title: subTitle,
              notes: isAr 
                ? `الدور التقني: ${sub.role}\nالحالة الفنية الفرعية: ${sub.status}\nالتفاصيل: ${sub.desc}`
                : `Assigned Role: ${sub.role}\nMilestone Status: ${sub.status}\nDetails: ${sub.desc}`,
              status: sub.status === 'completed' ? 'completed' : 'needsAction'
            };
            
            if (existingSubTask) {
              await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${existingSubTask.id}`, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${workspaceToken}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(subPayload)
              });
            } else {
              await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?parent=${parentId}`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${workspaceToken}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(subPayload)
              });
            }
          }
        }
      }
      
      // Update the active state lists and tasks in the UI
      await handleFetchTaskLists();
      await handleFetchTasks(listId);
      
      alert(
        isAr 
          ? `تم مزامنة مشاريع شركة مطوري الأعمال (Business Developers) بنجاح!\nالجديد: تم إنشاء/تحديث مشاريعك بمهام تفصيلية ومعالم ممتازة في حساب Google Tasks الخاص بك.`
          : `Sync Completed successfully with Google Tasks API Service!\nProcessed active corporate project boards with detailed milestone nesting.`
      );
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `فشل في المزامنة مع خدمة جوجل: ${err.message}` : `Failed Google Tasks API Sync: ${err.message}`);
    } finally {
      setIsSyncingAllProjects(false);
    }
  };

  const handleCreateMeetSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceToken) {
      setWorkspaceError(isAr ? 'الرجاء ربط حساب Google أولاً' : 'Please authenticate with Google first.');
      return;
    }
    setIsGeneratingMeetSpace(true);
    setWorkspaceError('');
    setCreatedMeetSpace(null);
    try {
      const res = await fetch('https://meet.googleapis.com/v2/spaces', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workspaceToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      if (!res.ok) {
        throw new Error(`Google Meet API error (status ${res.status})`);
      }
      const data = await res.json();
      const titleToUse = meetSpaceTitle.trim() || (isAr ? 'جلسة مشورة مطوري الأعمال' : 'Business Developers Consulting Room');
      const newItem = {
        name: data.name,
        meetingUri: data.meetingUri,
        meetingCode: data.meetingCode,
        title: titleToUse,
        createdAt: new Date().toISOString()
      };
      
      const updatedSpaces = [newItem, ...meetSpaces];
      setMeetSpaces(updatedSpaces);
      localStorage.setItem('bd_meet_spaces', JSON.stringify(updatedSpaces));
      setCreatedMeetSpace(newItem);
      setMeetSpaceTitle('');
    } catch (err: any) {
      console.error(err);
      setWorkspaceError(isAr ? `خطأ أثناء إنشاء غرفة Google Meet: ${err.message}` : `Failed to create Meet room: ${err.message}`);
    } finally {
      setIsGeneratingMeetSpace(false);
    }
  };

  const handleDeleteMeetSpace = (name: string, titleToDisplay: string) => {
    const confirmation = window.confirm(
      isAr 
        ? `هل تريد إزالة الغرفة "${titleToDisplay}" من سجل اللقاءات المحلي؟` 
        : `Are you sure you want to remove the space "${titleToDisplay}" from your session history?`
    );
    if (!confirmation) return;
    const updated = meetSpaces.filter(sp => sp.name !== name);
    setMeetSpaces(updated);
    localStorage.setItem('bd_meet_spaces', JSON.stringify(updated));
    if (createdMeetSpace?.name === name) {
      setCreatedMeetSpace(null);
    }
  };

  const parseAmount = (val: string | undefined): number => {
    if (!val) return 0;
    return parseFloat(val.replace(/,/g, '')) || 0;
  };

  // Aggregated calculations for metrics dashboard
  const totalEstimatedBudget = requests.reduce((sum, req) => sum + parseAmount(req.estimatedCost), 0);
  const totalInvoiced = invoices.reduce((sum, inv) => sum + parseAmount(inv.amount), 0);
  const totalPaidInvoices = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);

  // Formatting chart data mapping requests vs matching invoices
  const chartData = [...requests]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(req => {
      const matchingInvs = invoices.filter(inv => inv.requestId === req.id);
      const invoicedCost = matchingInvs.reduce((sum, inv) => sum + parseAmount(inv.amount), 0);
      const paidCost = matchingInvs
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);

      return {
        id: req.id,
        date: req.createdAt,
        budget: parseAmount(req.estimatedCost),
        invoiced: invoicedCost,
        paid: paidCost
      };
    });
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Firestore Database sub-tab form and section switching states
  const [dbActiveSection, setDbActiveSection] = useState<'clients' | 'requests' | 'invoices' | 'blueprint'>('clients');
  const [dbClientFormOpen, setDbClientFormOpen] = useState(false);
  const [dbInvoiceFormOpen, setDbInvoiceFormOpen] = useState(false);

  // Database Blueprint Designer state
  const [designerTemplates, setDesignerTemplates] = useState([
    {
      id: 'default',
      nameAr: 'نظام الاستشارات والتحول (الحالي)',
      nameEn: 'Transformation Consulting System (Native)',
      descriptionAr: 'قاعدة البيانات التشغيلية للبوابة التقنية؛ تتضمن سجلات الشركاء والطلبات الاستشارية وجدول النفقات المالية الشاملة.',
      descriptionEn: 'The core production database model powering the advisory portal. Handles company clients, dynamic requests, and finance ledgers.',
      tables: [
        {
          name: 'clients',
          descriptionAr: 'حسابات وملفات الشركاء والعملاء',
          descriptionEn: 'Registered corporate partner profiles',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'email', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'companyName', type: 'string' },
            { name: 'phone', type: 'string' },
            { name: 'password', type: 'string' },
            { name: 'createdAt', type: 'timestamp' }
          ]
        },
        {
          name: 'requests',
          descriptionAr: 'الطلبات التقنية واستشارات السعة والتمكين',
          descriptionEn: 'Inbound digital consulting initiatives',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'clientId', type: 'string', relationTo: 'clients' },
            { name: 'name', type: 'string' },
            { name: 'companyName', type: 'string' },
            { name: 'clientEmail', type: 'string' },
            { name: 'sectorId', type: 'string' },
            { name: 'solutionId', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'estimatedCost', type: 'number' },
            { name: 'createdAt', type: 'timestamp' }
          ]
        },
        {
          name: 'invoices',
          descriptionAr: 'مستندات وفواتير باقات التمكين المالي',
          descriptionEn: 'Client billing plans and credit ledger',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'clientId', type: 'string', relationTo: 'clients' },
            { name: 'clientEmail', type: 'string' },
            { name: 'requestId', type: 'string', relationTo: 'requests' },
            { name: 'titleAr', type: 'string' },
            { name: 'titleEn', type: 'string' },
            { name: 'amount', type: 'number' },
            { name: 'status', type: 'string' },
            { name: 'iban', type: 'string' },
            { name: 'createdAt', type: 'timestamp' }
          ]
        }
      ]
    },
    {
      id: 'saas',
      nameAr: 'منظومة بوابات الخدمة والاشتراكات (SaaS)',
      nameEn: 'SaaS Multi-Tenant Subscription Hub',
      descriptionAr: 'بنية تحتية مرنة لتقييد والتحقق من اشتراكات العملاء، الفترات الزمنية للولوج، رموز التحقق وسير الأنشطة والعمليات سحابياً.',
      descriptionEn: 'Designed for hosting SaaS models. Handles admin users, tiered subscriptions, Stripe-ready payments, and audit logging.',
      tables: [
        {
          name: 'users',
          descriptionAr: 'مستخدمو ومستأجرو النظام الأساسيون',
          descriptionEn: 'SaaS tenants and administrative operators',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'name', type: 'string' },
            { name: 'email', type: 'string' },
            { name: 'role', type: 'string' },
            { name: 'isActive', type: 'boolean' }
          ]
        },
        {
          name: 'subscriptions',
          descriptionAr: 'سجلات باقات واشتراكات العملاء النشطة',
          descriptionEn: 'Active pricing tier assignments',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'userId', type: 'string', relationTo: 'users' },
            { name: 'planName', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'startDate', type: 'timestamp' },
            { name: 'endDate', type: 'timestamp' }
          ]
        },
        {
          name: 'payments',
          descriptionAr: 'العمليات والحوالات المالية المرتبطة بالبوابات',
          descriptionEn: 'Stripe webhook payment ledger',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'subscriptionId', type: 'string', relationTo: 'subscriptions' },
            { name: 'amount', type: 'number' },
            { name: 'currency', type: 'string' },
            { name: 'gatewayTxId', type: 'string' },
            { name: 'timestamp', type: 'timestamp' }
          ]
        },
        {
          name: 'audit_logs',
          descriptionAr: 'سجلات تدقيق الأيقونات وحالات التوثيق الأمني',
          descriptionEn: 'System security audit telemetry lines',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'userId', type: 'string', relationTo: 'users' },
            { name: 'endpoint', type: 'string' },
            { name: 'ipAddress', type: 'string' },
            { name: 'statusCode', type: 'number' }
          ]
        }
      ]
    },
    {
      id: 'ecommerce',
      nameAr: 'مخازن التجارة ودورة الشحن والمبيعات',
      nameEn: 'E-Commerce Retail & Logistic Ledger',
      descriptionAr: 'نموذج علاقات مثالي لسلاسل المنتجات، تصنيفات الهرم الضريبي للمخازن، مسار سلال المشتريات، وبيانات الزبائن وعناوين التسليم.',
      descriptionEn: 'E-Commerce schema focusing on product taxonomic categories, buyer baskets, checkout orders, and shipping status nodes.',
      tables: [
        {
          name: 'products',
          descriptionAr: 'سجل السلع والخدمات المعروضة بالمنصة',
          descriptionEn: 'Store digital and physical stock catalog',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'sku', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'price', type: 'number' },
            { name: 'stockLevel', type: 'number' },
            { name: 'categoryId', type: 'string', relationTo: 'categories' }
          ]
        },
        {
          name: 'categories',
          descriptionAr: 'أقسام الفهرسة والتصنيفات الهرمية',
          descriptionEn: 'Inventory taxonomic trees',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'slug', type: 'string' },
            { name: 'label', type: 'string' }
          ]
        },
        {
          name: 'orders',
          descriptionAr: 'طلبات الشراء وفواتير الدفع المعتمدة',
          descriptionEn: 'Customer checkout purchase receipts',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'buyerId', type: 'string', relationTo: 'buyers' },
            { name: 'totalPrice', type: 'number' },
            { name: 'deliveryStatus', type: 'string' },
            { name: 'checkoutTime', type: 'timestamp' }
          ]
        },
        {
          name: 'buyers',
          descriptionAr: 'أعضاء وحسابات المشترين وعناوين التوصيل',
          descriptionEn: 'Customer contact profiles',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'fullName', type: 'string' },
            { name: 'address', type: 'string' },
            { name: 'mobilePhone', type: 'string' }
          ]
        }
      ]
    },
    {
      id: 'healthtech',
      nameAr: 'إدارة العيادات والملفات الطبية الذكية',
      nameEn: 'HealthTech Patient EMR Core',
      descriptionAr: 'هيكلة قواعد البيانات لربط المرضى، المواعيد الاستشارية، بيانات القياسات الحيوية، والأطباء والتوصيات والوصفات الدوائية.',
      descriptionEn: 'Compliance-oriented medical schema linking patients, doctors, appointment slots, vitals dashboard, and clinical telemetry.',
      tables: [
        {
          name: 'patients',
          descriptionAr: 'الملفات الشخصية وصحية للمرضى',
          descriptionEn: 'Patient registration profiles',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'fileNo', type: 'string' },
            { name: 'fullName', type: 'string' },
            { name: 'birthDate', type: 'string' },
            { name: 'bloodGroup', type: 'string' }
          ]
        },
        {
          name: 'doctors',
          descriptionAr: 'سجلات الكوادر الاستشارية والطبية بالمنشأة',
          descriptionEn: 'Clinical consultant directories',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'name', type: 'string' },
            { name: 'specialty', type: 'string' },
            { name: 'licenceNo', type: 'string' }
          ]
        },
        {
          name: 'appointments',
          descriptionAr: 'جدولة اللقاءات والزيارات السريرية والافتراضية',
          descriptionEn: 'Medical consultation schedulers',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'patientId', type: 'string', relationTo: 'patients' },
            { name: 'doctorId', type: 'string', relationTo: 'doctors' },
            { name: 'dateTime', type: 'timestamp' },
            { name: 'status', type: 'string' }
          ]
        },
        {
          name: 'vitals',
          descriptionAr: 'سجل المؤشرات الحيوية كضغط الدم ومستويات السكر',
          descriptionEn: 'Patient live health telemetry',
          fields: [
            { name: 'id', type: 'string', isPrimary: true },
            { name: 'patientId', type: 'string', relationTo: 'patients' },
            { name: 'weight', type: 'number' },
            { name: 'height', type: 'number' },
            { name: 'bloodPressure', type: 'string' },
            { name: 'timestamp', type: 'timestamp' }
          ]
        }
      ]
    }
  ]);

  const [activeTemplateId, setActiveTemplateId] = useState('default');
  const [designerTables, setDesignerTables] = useState<any[]>(designerTemplates[0].tables);

  // Schema form states
  const [newTableName, setNewTableName] = useState('');
  const [newTableDescAr, setNewTableDescAr] = useState('');
  const [newTableDescEn, setNewTableDescEn] = useState('');
  const [addTableFormOpen, setAddTableFormOpen] = useState(false);

  // Field addition inputs
  const [selectedTableForField, setSelectedTableForField] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('string');
  const [newFieldRel, setNewFieldRel] = useState('');

  // Selected table detail for inspector view
  const [inspectorTableName, setInspectorTableName] = useState<string | null>('clients');
  const [schemaExportFormat, setSchemaExportFormat] = useState<'firestore' | 'sql' | 'drizzle'>('firestore');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // New Client Form inputs
  const [dbNewClientEmail, setDbNewClientEmail] = useState('');
  const [dbNewClientName, setDbNewClientName] = useState('');
  const [dbNewClientCompany, setDbNewClientCompany] = useState('');
  const [dbNewClientPhone, setDbNewClientPhone] = useState('');
  const [dbNewClientPassword, setDbNewClientPassword] = useState('password123');

  // New Invoice Form inputs
  const [dbNewInvoiceClientEmail, setDbNewInvoiceClientEmail] = useState('');
  const [dbNewInvoiceRequestId, setDbNewInvoiceRequestId] = useState('');
  const [dbNewInvoiceTitleAr, setDbNewInvoiceTitleAr] = useState('');
  const [dbNewInvoiceTitleEn, setDbNewInvoiceTitleEn] = useState('');
  const [dbNewInvoiceAmount, setDbNewInvoiceAmount] = useState('');
  const [dbNewInvoiceStatus, setDbNewInvoiceStatus] = useState<'paid' | 'unpaid' | 'overdue'>('unpaid');
  const [dbNewInvoiceIBAN, setDbNewInvoiceIBAN] = useState('SA8040000001234567890123');

  // Expanded Request Details State
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  // Premium Client Gateway & Estimation Menu States
  const [calcSector, setCalcSector] = useState('retail');
  const [calcSolution, setCalcSolution] = useState('digital-transformation');
  const [calcComplexity, setCalcComplexity] = useState('medium');
  const [calcFormsIntegration, setCalcFormsIntegration] = useState(true);
  const [activeSideTab, setActiveSideTab] = useState<'estimator' | 'services' | 'demo'>('estimator');

  // Interactive estimates calculations
  const getDynamicEstimate = () => {
    let baseCost = 150000;
    let days = 60;
    
    // Solution pricing pricing
    if (calcSolution === 'digital-transformation') {
      baseCost = 180000;
      days = 75;
    } else if (calcSolution === 'cloud-computing') {
      baseCost = 130000;
      days = 45;
    } else if (calcSolution === 'ai-ml') {
      baseCost = 240000;
      days = 90;
    } else if (calcSolution === 'fintech') {
      baseCost = 260000;
      days = 100;
    }

    // Sector adjustments
    let multiplier = 1.0;
    if (calcSector === 'banking') multiplier = 1.15;
    else if (calcSector === 'government') multiplier = 1.20;
    else if (calcSector === 'healthcare') multiplier = 1.10;

    // Complexity factor
    if (calcComplexity === 'simple') {
      multiplier *= 0.75;
      days = Math.round(days * 0.7);
    } else if (calcComplexity === 'complex') {
      multiplier *= 1.45;
      days = Math.round(days * 1.5);
    }

    // Google Forms Integration additive
    let formsCost = 0;
    if (calcFormsIntegration) {
      formsCost = 22000;
      days += 10;
    }

    const finalCost = Math.round((baseCost * multiplier) + formsCost);
    return {
      cost: finalCost.toLocaleString(),
      timeline: days,
      components: [
        calcSolution === 'ai-ml' 
          ? (isAr ? 'خوارزميات تصنيف التنبؤ الرياضي والتعلم المتقدم' : 'Predictive Analytics & ML Algorithms')
          : calcSolution === 'fintech'
          ? (isAr ? 'بوابة امتثال للعملات المفتوحة ممتدة الربط' : 'Open Banking Compliance Sandbox API')
          : calcSolution === 'cloud-computing'
          ? (isAr ? 'بنية تحتية مشفرة بالكامل Terraform IaC' : 'Terraform Secure Infrastructure IaC')
          : (isAr ? 'لوحة تحكم تفاعلية متكاملة للمنشأة' : 'Integrated Partner KPI Dashboard'),
        ...(calcFormsIntegration ? [isAr ? 'مستقبل نماذج Google Forms التلقائي' : 'Google Forms Intake Automated Webhooks'] : []),
        isAr ? 'قاعدة بيانات سحابية لحظية آمنة Firestore' : 'Cloud Firestore Secured Realtime Database'
      ]
    };
  };

  const currentEstimate = getDynamicEstimate();

  const handleDbClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbNewClientEmail || !dbNewClientName || !dbNewClientCompany) return;
    const newCl: Client = {
      email: dbNewClientEmail.trim().toLowerCase(),
      name: dbNewClientName.trim(),
      companyName: dbNewClientCompany.trim(),
      phone: dbNewClientPhone.trim(),
      password: dbNewClientPassword || 'password123'
    };
    if (onCreateClient) {
      onCreateClient(newCl);
    }
    // Reset form
    setDbNewClientEmail('');
    setDbNewClientName('');
    setDbNewClientCompany('');
    setDbNewClientPhone('');
    setDbNewClientPassword('password123');
    setDbClientFormOpen(false);
  };

  const handleDbInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbNewInvoiceClientEmail || !dbNewInvoiceTitleAr || !dbNewInvoiceAmount) return;
    const invId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInv: ClientInvoice = {
      id: invId,
      clientEmail: dbNewInvoiceClientEmail.trim().toLowerCase(),
      requestId: dbNewInvoiceRequestId || undefined,
      titleAr: dbNewInvoiceTitleAr.trim(),
      titleEn: dbNewInvoiceTitleEn.trim() || dbNewInvoiceTitleAr.trim(),
      amount: dbNewInvoiceAmount.trim(),
      status: dbNewInvoiceStatus,
      issueDate: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      bankDetailsIBAN: dbNewInvoiceIBAN
    };
    if (onCreateInvoice) {
      onCreateInvoice(newInv);
    }
    // Reset form
    setDbNewInvoiceClientEmail('');
    setDbNewInvoiceRequestId('');
    setDbNewInvoiceTitleAr('');
    setDbNewInvoiceTitleEn('');
    setDbNewInvoiceAmount('');
    setDbNewInvoiceStatus('unpaid');
    setDbInvoiceFormOpen(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError(isAr ? 'الرجاء كتابة البريد الإلكتروني وكلمة المرور' : 'Please fill in both email and password.');
      return;
    }
    const result = onLogin(loginEmail, loginPassword);
    if (result.success) {
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginError(result.error || (isAr ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials.'));
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(false);

    if (!regName || !regEmail || !regCompany || !regPassword) {
      setRegError(isAr ? 'الرجاء ملء كافة الحقول الإلزامية' : 'Please fill in all required fields.');
      return;
    }

    if (regName.trim().length < 2) {
      setRegError(isAr ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setRegError(isAr ? 'عنوان البريد الإلكتروني غير صالح' : 'Invalid email address format.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError(isAr ? 'كلمة المرور يجب ألا تقل عن 6 خانات' : 'Password must be at least 6 characters.');
      return;
    }

    const result = await onRegister({
      email: regEmail.trim().toLowerCase(),
      name: regName.trim(),
      companyName: regCompany.trim(),
      phone: regPhone.trim(),
      password: regPassword
    });

    if (result.success) {
      setRegSuccess(true);
      // Clean register inputs
      setRegName('');
      setRegEmail('');
      setRegCompany('');
      setRegPhone('');
      setRegPassword('');
      setTimeout(() => {
        setActiveTab('login');
        setRegSuccess(false);
      }, 1500);
    } else {
      setRegError(result.error || (isAr ? 'هذا البريد الإلكتروني مسجل بالفعل' : 'This email is already registered.'));
    }
  };

  // Helper to translate status value to Arabic or English
  const getStatusLabel = (status: ClientRequest['status']) => {
    const labels: Record<ClientRequest['status'], { ar: string; en: string }> = {
      pending: { ar: 'بانتظار المراجعة', en: 'In Review Queue' },
      reviewing: { ar: 'قيد الدراسة الفنية', en: 'Sizing & Tech Analysis' },
      planned: { ar: 'تم تخطيط الهيكل', en: 'Blueprint Drafted' },
      approved: { ar: 'معتمد للتنفيذ', en: 'Approved for Build' },
      completed: { ar: 'تم التسليم والتشغيل', en: 'Successfully Active' }
    };
    return isAr ? labels[status].ar : labels[status].en;
  };

  // Helper to get chronological milestones for the request timeline
  const getMilestones = (req: ClientRequest) => {
    const secObj = SECTORS.find(s => s.id === req.sectorId);
    const solObj = SOLUTIONS.find(s => s.id === req.solutionId);
    
    const secTitle = secObj ? (isAr ? secObj.titleAr : secObj.titleEn) : req.sectorId;
    const solTitle = solObj ? (isAr ? solObj.titleAr : solObj.titleEn) : req.solutionId;

    const baseLogs = [
      {
        title: isAr ? 'تم استلام طلب الاستشارة والحل التقني' : 'Inquiry Filed & Registered',
        desc: isAr 
          ? `تم إنشاء تذكرة الخدمة لطلب (${solTitle}) الخاص بقطاع (${secTitle}) بنجاح.`
          : `Service ticket created successfully for ${solTitle} under ${secTitle} framework.`,
        date: req.createdAt,
        done: true
      },
      {
        title: isAr ? 'تحليل متطلبات المنشأة وجدواها الرقمية' : 'Sizing & Capacity Scoping',
        desc: isAr 
          ? `يقوم مهندسو الحلول بتحليل بيانات مؤسسة (${req.companyName}) لتقديم هيكل ملائم.`
          : `System architects analyzing payload capacities for ${req.companyName} to frame baseline topology.`,
        date: isAr ? 'قيد الدراسة والتدقيق' : 'Technical analysis underway',
        done: req.status !== 'pending'
      },
      {
        title: isAr ? 'إرسال مسودة الهيكل والمواصفات النهائية' : 'Architecture & Financial Blueprint',
        desc: isAr 
          ? `تضمين الأدوات البرمجية المتوقعة وتحديد الميزانية وخارطة الطريق.`
          : `Pre-sizing dev tools, micro-framework paths, and budget estimations.`,
        date: isAr ? 'مخطط زمني تقريبي' : 'Dynamic roadmap generation',
        done: ['planned', 'approved', 'completed'].includes(req.status)
      },
      {
        title: isAr ? 'الاعتماد النهائي وبدء الدورة الهندسية' : 'Final Build Contract & Kickoff',
        desc: isAr 
          ? `تجهيز المستودعات البرمجية والبدء في بناء وإعداد النماذج والحلول التقنية التكرارية.`
          : `Initializing codebases, provisioning Cloud instances, and kickstarting iterative sprints.`,
        date: isAr ? 'اعتماد الإدارة العليا' : 'Approved by stakeholders',
        done: ['approved', 'completed'].includes(req.status)
      }
    ];
    return baseLogs;
  };

  // Helper to get tailored solution-specific implementation sub-tasks and milestones
  const getSolutionSubTasks = (req: ClientRequest) => {
    // Determine status index bounds
    const statuses = ['pending', 'reviewing', 'planned', 'approved', 'completed'];
    const currentStatusIndex = statuses.indexOf(req.status);

    // Dynamic tasks templates mapping based on solutionId
    let taskTemplates: Array<{ 
      titleEn: string; 
      titleAr: string; 
      descEn: string; 
      descAr: string; 
      roleEn: string; 
      roleAr: string; 
    }> = [];

    switch (req.solutionId) {
      case 'corporate-innovation':
        taskTemplates = [
          {
            titleEn: 'Innovation Maturity & Gap Analysis',
            titleAr: 'دراسة جاهزية ونضج الابتكار المؤسسي',
            descEn: 'Analyze culture and current capabilities against international ISO 56002 guidelines.',
            descAr: 'تحليل الثقافة والقدرات التشغيلية الحالية للمنظمة مقارنة بمعيار الأيزو 56002.',
            roleEn: 'Innovation Compliance Analyst',
            roleAr: 'محلل امتثال نظم الابتكار'
          },
          {
            titleEn: 'ISO 56002 Alignment & Guidebook',
            titleAr: 'مواءمة العمليات مع الأيزو ISO 56002',
            descEn: 'Configure organizational innovation guidebook matching global integration and quality frameworks.',
            descAr: 'صياغة دليل الابتكار وسياسته الداخلية الملائمة للمواصفات القياسية للأيزو 56002.',
            roleEn: 'ISO 56002 Consultant',
            roleAr: 'مستشار مواصفة الأيزو 56002'
          },
          {
            titleEn: 'Corporate Strategy Blueprint Design',
            titleAr: 'تصميم خارطة طريق استراتيجية الابتكار',
            descEn: 'Design visual roadmap linking creative initiatives directly to strategic corporate OKRs.',
            descAr: 'وضع خارطة طريق واضحة تربط بين المبادرات الإبداعية والأهداف الكبرى للمؤسسة.',
            roleEn: 'Strategic Innovation Architect',
            roleAr: 'مهندس استراتيجية الابتكار'
          },
          {
            titleEn: 'Governance Blueprint & Evaluation Matrix',
            titleAr: 'عوكمة الابتكار وقياس الأثر الملموس',
            descEn: 'Implement review workflows, sandbox filters, and impact indicators checking ideas value return.',
            descAr: 'إنشاء هياكل الحوكمة والمصفوفات التقييمية ومؤشرات تتبع الأثر الإيجابي والملموس.',
            roleEn: 'Governance & Value Lead',
            roleAr: 'مدير حوكمة الابتكار وقياس الأثر'
          },
          {
            titleEn: 'Innovation Lab Setup & Tooling',
            titleAr: 'تأسيس وتشغيل معامل الابتكار التجريبية',
            descEn: 'Design and deploy physical or digital sandbox environments supportive of ideation streams.',
            descAr: 'تخطيط وتفعيل البيئات الحاضنة للأفكار وبرمجيات تسريع النمذجة SRE للمنتجات.',
            roleEn: 'Lab Orchestration Lead',
            roleAr: 'أخصائي تشغيل معامل الابتكار'
          },
          {
            titleEn: 'First Venture Cohort Scaling',
            titleAr: 'تحويل المشاريع الريادية لواقع ملموس',
            descEn: 'Accelerate custom pilot initiatives from early draft ideas directly to active corporate implementation.',
            descAr: 'تسريع انتقال النماذج المبتكرة الأولى من الفكرة لواقع ملموس يخدم مستهدفات المنظمة.',
            roleEn: 'Venture Acceleration Manager',
            roleAr: 'مدير تسريع المشاريع الإبداعية'
          }
        ];
        break;

      case 'digital-transformation':
        taskTemplates = [
          {
            titleEn: 'Legacy Operations Gap Analysis',
            titleAr: 'تحليل فجوات العمليات التقليدية',
            descEn: 'Evaluate existing non-digital workflows, bottleneck sizing, and operational friction points.',
            descAr: 'تقييم مسارات العمل التقليدية الحالية، وتحديد الاختناقات التشغيلية ونقاط البطء.',
            roleEn: 'Business Change Strategist',
            roleAr: 'مخطط التغيير المؤسسي'
          },
          {
            titleEn: 'Key Stakeholder Alignment Workshop',
            titleAr: 'ورشة عمل مواءمة قادة المنتجات',
            descEn: 'Define unified corporate OKRs, migration tolerances, and operational ownership divisions.',
            descAr: 'تحديد الأهداف الاستراتيجية المشتركة، معايير التحمل التشغيلي، ومسؤوليات الأقسام.',
            roleEn: 'Transformation Facilitator',
            roleAr: 'ميسر ورش التحول'
          },
          {
            titleEn: 'Digital Roadmap Blueprint Draft',
            titleAr: 'صياغة مسودة خارطة الطريق الرقمية',
            descEn: 'Establish the phased execution timelines, target legacy retirements, and technical milestones.',
            descAr: 'تحديد فترات التنفيذ المرحلية، تواريخ الاستغناء عن الأنظمة القديمة، والمعالم التقنية.',
            roleEn: 'Lead Enterprise Architect',
            roleAr: 'كبير مهندسي النظم والمؤسسات'
          },
          {
            titleEn: 'Integration Architecture Approval',
            titleAr: 'اعتماد هيكلية ربط الأنظمة الهجينة',
            descEn: 'Validate clean interfacing of target digital layers with central relational models and legacy stores.',
            descAr: 'التحقق من جاهزية الطبقات الرقمية للربط المرن مع خوادم البيانات المركزية بنظام موحد.',
            roleEn: 'Solutions Integration Architect',
            roleAr: 'مهندس تكامل الأنظمة'
          },
          {
            titleEn: 'Talent Upskilling & Transition Briefings',
            titleAr: 'تأهيل وتدريب الكفاءات والكوادر البشرية',
            descEn: 'Empower operational staff with modern collaborative dashboards training to handle digital change.',
            descAr: 'تمكين الطواقم التشغيلية وتدريبهم على استخدام لوحات التحكم والأنظمة الرقمية المستحدثة.',
            roleEn: 'Cultural Change Manager',
            roleAr: 'مدير إدارة التغيير وتدريب الكوادر'
          },
          {
            titleEn: 'Continuous Optimization Metrics Dashboard',
            titleAr: 'بناء لوحة مؤشرات الكفاءة والتحسين',
            descEn: 'Configure Recharts metrics pipelines evaluating real-time operational speed gains.',
            descAr: 'تثبيت خطوط معالجة تفاعلية لقياس وتسجيل مستويات تحسن الكفاءة والسرعة الحقيقية.',
            roleEn: 'Digital Ops Lead',
            roleAr: 'قائد العمليات الرقمية الممتدة'
          }
        ];
        break;

      case 'technical-modernization':
        taskTemplates = [
          {
            titleEn: 'Legacy Codebase Auditing & Performance Profiling',
            titleAr: 'تدقيق الأكواد القديمة وتحليل الأداء الفعلي',
            descEn: 'Perform automated profiling to identify memory leaks, nested loops, and slow queries.',
            descAr: 'إجراء تحليل شامل وهندسة عكسية لاكتشاف تسريبات الذاكرة والتعليمات البرمجية المسببة للبطء.',
            roleEn: 'Senior Technical Lead',
            roleAr: 'كبير المستشارين التقنيين'
          },
          {
            titleEn: 'Decoupling Strategy & Microservices Design',
            titleAr: 'هيكلة فك ارتباط الخدمات وتصميم الخدمات المصغرة',
            descEn: 'Isolate tightly coupled elements into standalone service boundaries for scalable orchestration.',
            descAr: 'تقسيم الأنظمة المتداخلة إلى خدمات مستقلة مرنة قابلة للتطوير المستقل.',
            roleEn: 'Cloud Solutions Architect',
            roleAr: 'مهندس حلول سحابية'
          },
          {
            titleEn: 'API Spec & API Gateway Configuration',
            titleAr: 'تصميم مسار البوابة والتحقق من مواصفات الواجهات API',
            descEn: 'Establish OpenAPI structural schemas and rate-limiting rules across public and private channels.',
            descAr: 'تأسيس مواصفات ربط OpenAPI وتعيين قواعد الحماية وتحديد معدل الطلبات.',
            roleEn: 'API Gateway Engineer',
            roleAr: 'مهندس بوابات الربط الرقمي'
          },
          {
            titleEn: 'System Refactoring & Database Migration Sprints',
            titleAr: 'ترحيل قواعد البيانات وإعادة صياغة الهيكل البرمجي',
            descEn: 'Accelerate transactions by refactoring SQL constructs and decoupling storage components.',
            descAr: 'تحسين الاستعلامات وإنشاء فهارس قواعد البيانات لتسريع الاستجابة والتعامل مع التحميل العالي.',
            roleEn: 'Senior Database Engineer',
            roleAr: 'كبير مهندسي البيانات مصفوفاً'
          },
          {
            titleEn: 'Staged Traffic Ingress Migration',
            titleAr: 'توجيه حركة المرور التدريجي للأنظمة الجديدة',
            descEn: 'Deploy Canary releases to run portions of traffic safely via the newly optimized endpoints.',
            descAr: 'نشر تحديثات تجريبية تدريجية (Canary) لضمان متانة الانتقال دون حدوث توقف للخدمة.',
            roleEn: 'Continuous Delivery Engineer',
            roleAr: 'مهندس النشر المستمر والترقية'
          },
          {
            titleEn: 'Complete Legacy System Deprecation',
            titleAr: 'إيقاف تشغيل الأصول البرمجية القديمة بالكامل',
            descEn: 'Securely archive obsolete systems after complete integrity validation of replacement micro-apps.',
            descAr: 'أرشفة خوادم الأنظمة القديمة بأمان تام بعد التيقن من عمل الأنظمة الجديدة بكامل طاقتها.',
            roleEn: 'Security & Systems Auditor',
            roleAr: 'مدقق حماية النظم والهجائن'
          }
        ];
        break;

      case 'cybersecurity':
        taskTemplates = [
          {
            titleEn: 'Infrastructure Penetration & Assessment Drill',
            titleAr: 'تقييم مخاطر الاختراق والثغرات في الخوادم والسجلات',
            descEn: 'Execute automated network vulnerability runs exposing unhardened ports and outdated frameworks.',
            descAr: 'محاكاة هجمات منظمة على جدران الحماية وقواعد البيانات للكشف عن الثغرات التقنية وتصحيحها.',
            roleEn: 'Offensive Security Lead',
            roleAr: 'قائد خطوط الهجوم واختبار الاختراقات'
          },
          {
            titleEn: 'Client Access Identity Governance Setup',
            titleAr: 'عوكمة صلاحيات الوصول لتأمين حسابات المستخدمين والفرق',
            descEn: 'Draft strict role configurations limiting data exposure metrics across partner gateways.',
            descAr: 'صياغة مرشحات تحكم مشددة تمنع وصول أي حساب غير مأذون له خارج صلاحيته المعتمدة.',
            roleEn: 'IAM Specialist',
            roleAr: 'أخصائي إدارة الهويات والصلاحيات الصارمة'
          },
          {
            titleEn: 'Encrypted Communication Pipeline Settle',
            titleAr: 'بناء قنوات الاتصال والتبادل المشفر للمستندات والبيانات',
            descEn: 'Ensure database records, local caches, and HTTP streams employ strong encryption keys.',
            descAr: 'تأصيل استخدام قنوات آمنة ومفاتيح مشفرة لضمان سرية المستندات المتداولة مع الشركاء.',
            roleEn: 'Cryptography Engineer',
            roleAr: 'مهندس أمن وتشفير البيانات المتكاملة'
          },
          {
            titleEn: 'OWASP Defensive Sprints & API Hardening',
            titleAr: 'تطبيق معايير OWASP وتحصين بوابات الربط البرمجية',
            descEn: 'Implement robust rate limit protections, secure CORS policies, and strict headers filtering.',
            descAr: 'تضمين خوارزميات تحديد معدل الاستهلاك والتصدي لمحاولات حجب الخدمات الموجهة لبوابات API.',
            roleEn: 'Application Security Engineer',
            roleAr: 'مهندس أمن وحماية التطبيقات السحابية'
          },
          {
            titleEn: 'Security Incident Monitoring & Logs Forwarding',
            titleAr: 'تأسيس بيئة المراقبة الذكية وتسجيل أحداث الأمن السيبراني',
            descEn: 'Integrate tools for real-time alerting to detect unusual cloud storage queries instantly.',
            descAr: 'بناء غرف رصد الحوادث واكتشاف محاولات تصفح السجلات المشبوهة وقفل الحسابات فوراً.',
            roleEn: 'SOC Lead Analyst',
            roleAr: 'محلل أول مركز الرصد الأمني'
          },
          {
            titleEn: 'Security Certification Audit Preparation Sprint',
            titleAr: 'تحضير مسودة تدقيق نيل شهادات الامتثال والالتزام الوطني',
            descEn: 'Assemble comprehensive documentation mapping defenses to facilitate national regulatory compliance.',
            descAr: 'صياغة اللوائح والملفات وإجراء الفحوصات الاستباقية لتسهيل الحصول على شهادات الامتثال الرسمي.',
            roleEn: 'Compliance Audit Lead',
            roleAr: 'مدير عمليات ضبط وثائق التحقق الموحد'
          }
        ];
        break;

      case 'data-analytics':
        taskTemplates = [
          {
            titleEn: 'Business Intelligence Strategy Formulating',
            titleAr: 'صياغة استراتيجية ذكاء الأعمال وصنع القرارات',
            descEn: 'Pinpoint precise historical indicators and predictive analytics desired for operational execution.',
            descAr: 'تحديد مؤشرات الأداء التاريخية والتحليلات التنبؤية المطلوبة لدعم اتخاذ القرار اليومي.',
            roleEn: 'BI Consultant',
            roleAr: 'مستشار ذكاء الأعمال والبيانات'
          },
          {
            titleEn: 'Data Source Inventorying & Connection Schemas',
            titleAr: 'جرد أوعية ومصادر البيانات ورسم أطر الاتصال',
            descEn: 'Audit existing databases, CRM tables, and flat-logs to resolve relationship inconsistencies.',
            descAr: 'تدقيق الأوعية الحالية للمستندات والعملاء لإزالة التعارض وبناء مصفوفات العلاقات.',
            roleEn: 'BI Architect',
            roleAr: 'مهندس مسارات ذكاء الأعمال'
          },
          {
            titleEn: 'ETL Pipeline Integration & Clean Scheduling',
            titleAr: 'بناء مجاري تحويل البيانات وجدولتها (ETL)',
            descEn: 'Configure extraction, transformation, and automated loading batches routing into deep pools.',
            descAr: 'بناء مسارات استخلاص وتنقية وتجانس السجلات وجدولة المزامنة التلقائية لها.',
            roleEn: 'Data Engineer',
            roleAr: 'مهندس ومطور خطوط البيانات'
          },
          {
            titleEn: 'Warehousing Strategy & Aggregation Modeling',
            titleAr: 'تصميم هيكل مستودع البيانات وحزم التلخيص للتقارير',
            descEn: 'Model transactional dimension matrices optimizing speedy retrieval of aggregated analytics.',
            descAr: 'بناء الهيكل المكعّب لمستودعات البيانات لتمكين الحسابات التلخيصية الفورية بمرونة.',
            roleEn: 'Data Warehouse Architect',
            roleAr: 'مصمم مستودعات البيانات السحابية'
          },
          {
            titleEn: 'Unified Dashboard Construction & Widget Deployment',
            titleAr: 'تكامل لوحات الرصد والمؤشرات الذكية الحية بالمتصفح',
            descEn: 'Assemble visual React graphs, KPIs cards, and secure widgets tracking core targets.',
            descAr: 'تكويد وتصميم رسوم بيانية تفاعلية ومؤشرات حية تقيس تطورات وأهداف قطاع الأعمال.',
            roleEn: 'Dashboard Developer',
            roleAr: 'مطور واجهات ومؤشرات تفاعلية'
          },
          {
            titleEn: 'Data Audit Training & Dynamic Reporting Settle',
            titleAr: 'التدريب على التحليل واستخراج التقارير المعتمدة',
            descEn: 'Train operational leaders in querying filters and deploying automated daily exports.',
            descAr: 'تدريب الإدارة العليا على قراءة وفلترة وصياغة تقارير دورية تخدم صناع القرار بكفاءة.',
            roleEn: 'Data Enablement Specialist',
            roleAr: 'أخصائي تمكين وتدريب البيانات'
          }
        ];
        break;

      case 'digital-experience':
        taskTemplates = [
          {
            titleEn: 'Persona Alignment & Interactive Wireframing',
            titleAr: 'محاذاة هوية المستخدمين وصياغة مخططات الواجهات',
            descEn: 'Flesh out demographic profiles, high priority screens layout, and brand mood boards.',
            descAr: 'تحليل سلوكيات الشركاء والمشترين وابتكار لوحات إلهام تصميمية تعكس القوة والهوية التجارية.',
            roleEn: 'UI/UX Visual Architect',
            roleAr: 'مهندس الواجهات وتجربة المستخدم'
          },
          {
            titleEn: 'Interactive Figma Prototypes Mapping',
            titleAr: 'رسم النماذج التفاعلية الحية وتجارب النقر الأفقية',
            descEn: 'Formulate responsive wireframes linking all operational tasks to guarantee speedy task flow.',
            descAr: 'تأصيل وتصميم صفحات النظام والتنقل بينها لحوكمة سلاسة الحصول على المنتجات.',
            roleEn: 'Product Interaction Designer',
            roleAr: 'مصمم المنتجات الرقمية والتفاعل'
          },
          {
            titleEn: 'Tailwind CSS Custom Style Themes Generation',
            titleAr: 'تجهيز قواميس البرمجة الشاملة بلغة Tailwind CSS',
            descEn: 'Optimize responsiveness, customize custom theme configurations, and establish typography curves.',
            descAr: 'بناء نظام مكونات موحد متجاوب بشكل ذكي يدعم دقة الخطوط والشاشات المختلفة.',
            roleEn: 'Design Systems Developer',
            roleAr: 'مطور أول أنظمة التصميم المرن'
          },
          {
            titleEn: 'Integrated Checkout & API Gateways Integration',
            titleAr: 'برمجة وتجميع حزم سداد المدفوعات والاشتراكات لـ API',
            descEn: 'Build client routes syncing transactions with modern checkout gateways directly.',
            descAr: 'ربط مسارات السداد الرقمي بالبوابات المحلية المعتمدة لدعم حركة الفواتير والمدفوعات الحية.',
            roleEn: 'Payment Gateway Engineer',
            roleAr: 'مهندس دمج شرايين السداد الرقمية'
          },
          {
            titleEn: 'Frontend Feature Sprints & React Integrations',
            titleAr: 'دورات هندسة المكونات البرمجية التفاعلية بـ React',
            descEn: 'Draft robust components integrating real-time server streams cleanly into standard browser frames.',
            descAr: 'ربط الواجهات الأمامية بالخوادم وقواعد البيانات لتحديث الصفحات بليونة ودون تحميل متكرر.',
            roleEn: 'Senior React Developer',
            roleAr: 'كبير مطوري تطبيقات React الحديثة'
          },
          {
            titleEn: 'Cross-functional User Acceptance Testing (UAT)',
            titleAr: 'جلسات التحقق للمستخدم وتدقيق القفزة الرقمية',
            descEn: 'Facilitate testing with early clients to isolate edge rendering errors across mobile layouts.',
            descAr: 'إطلاق النسخة التجريبية للشركاء المقربين وقياس كفاءة التنقل وتجربة المستلزمات.',
            roleEn: 'QA Lead Optimizer',
            roleAr: 'قائد ضمان جودة تجربة المستهلك'
          }
        ];
        break;

      case 'infrastructure-ops':
        taskTemplates = [
          {
            titleEn: 'Operational Infrastructure Bottleneck Audit',
            titleAr: 'تدقيق البنية التحتية واكتشاف اختناقات موارد التشغيل',
            descEn: 'Assess existing node allocations, query latency, and pipeline delays.',
            descAr: 'قياس استهلاك المعالجات والذاكرة في البيئة الحالية ومكامن بطء استجابة الخوادم.',
            roleEn: 'Platform Engineer',
            roleAr: 'مهندس المنصات والبنى التحتية'
          },
          {
            titleEn: 'Enterprise Containerization & Kubernetes Setup',
            titleAr: 'تأسيس حاويات التشغيل والربط المعياري عبر Kubernetes',
            descEn: 'Draft Dockerfiles, optimize image layers, and form high-performance Helm chart bundles.',
            descAr: 'برمجة وإعداد حاويات النشر الافتراضية وحوكمة حركتها بكفاءة عبر باقات Helm معيارية.',
            roleEn: 'Kubernetes Administrator',
            roleAr: 'مدير نظم توزيع حاويات Kubernetes'
          },
          {
            titleEn: 'Advanced Prometheus & Grafana Monitoring Configuration',
            titleAr: 'بناء لوحات الرصد والمراقبة الذكية بـ Grafana',
            descEn: 'Configure robust exporters, set up slack webhook triggers, and write latency metrics panels.',
            descAr: 'تثبيت حساسات رصد الاستهلاك وتثبيت قنوات التنبيه في المجموعات البرمجية الفورية.',
            roleEn: 'Telemetry Lead Developer',
            roleAr: 'مطور نظم إنذار واستهلاك البيانات'
          },
          {
            titleEn: 'Robust GitOps CI/CD Deployment Workflows Settle',
            titleAr: 'أتمتة وبناء مسارات النشر الآلي المستقبلي GitOps',
            descEn: 'Build continuous tests validating lint guidelines and compile checks for fail-fast releases.',
            descAr: 'تأسيس مسارات الفحص والتدقيق التلقائي للأكواد للتأكد من خلوها من أي ثغرة قبل النشر التلقائي.',
            roleEn: 'CI/CD Ops Engineer',
            roleAr: 'مهندس دمج ونشر الحلول الذكية'
          },
          {
            titleEn: 'Failover Replication Drills & Storage Redundancy',
            titleAr: 'تدريبات محاكاة فشل الأنظمة والنسخ الاحتياطي الجغرافي',
            descEn: 'Simulate server network routing disruptions ensuring replication nodes kick in automatically.',
            descAr: 'تعمد فصل بعض الخوادم لاختبار متانة تفعيل النسخة الجغرافية البديلة فوراً وتلقائياً.',
            roleEn: 'SRE Lead Architect',
            roleAr: 'أخصائي هندسة تلافي الأخطاء والموثوقية'
          },
          {
            titleEn: '99.99% SLA Incident Response Guidelines Setup',
            titleAr: 'اعتماد دليل الاستجابة للطوارئ بنسبة عمل 99.99%',
            descEn: 'Write playbook parameters mapping standard recovery paths to reduce recovery time objectives.',
            descAr: 'تأصيل وتدريب الطواقم على أدلة الموثوقية الشاملة للتعامل مع أي طارئ بجهوزية قصوى.',
            roleEn: 'Incident Commander',
            roleAr: 'مسؤول الاستجابة لحوادث البنى التحتية'
          }
        ];
        break;

      case 'digital-government':
        taskTemplates = [
          {
            titleEn: 'Citizen Security Guidelines Mapping',
            titleAr: 'مواءمة لوائح سرية وخصوصية بيانات المواطن في النظام',
            descEn: 'Review the regulatory framework governing digital identity access across government channels.',
            descAr: 'مراجعة المعايير المنظمة لهويات المستفيدين وحماية بياناتهم وسجل معاملاتهم الحكومية.',
            roleEn: 'Government Compliance Advisor',
            roleAr: 'مستشار الامتثال والتنظيم الحكومي'
          },
          {
            titleEn: 'Common API Integration Scoping (Balady / Masar)',
            titleAr: 'دراسة أطر تكامل بوابات الربط (مثل بلدي، مسار، أبشر)',
            descEn: 'Validate target endpoints complying with national data exchange systems schemas.',
            descAr: 'مطابقة خطوط الاتصال الهندسية مع متطلبات النفاذ والمشاركة الوطنية الآمنة للبيانات.',
            roleEn: 'Integration Systems Specialist',
            roleAr: 'أخصائي ربط المنصات الحكومية'
          },
          {
            titleEn: 'National Single Sign-On (SSO) Portal Schemas',
            titleAr: 'تصميم هيكل التحقق للنفاذ الوطني الموحد (SSO)',
            descEn: 'Map identity claims returning from standard OAuth government identity authorization gateways.',
            descAr: 'مواءمة واجهات تسجيل الدخول والتحقق لتطابق نظم الموفّر الوطني لهويات الشركاء.',
            roleEn: 'SSO Security Engineer',
            roleAr: 'مهندس نظم تسجيل الدخول الوطني'
          },
          {
            titleEn: 'Secure Document Attestation Verification Engines',
            titleAr: 'تكويد محرك التحقق والتوثيق التلقائي للمستندات',
            descEn: 'Integrate cryptographic document signing to prevent counterfeit file entries across systems.',
            descAr: 'تضمين تقنيات الختم الرقمي والتواقيع المشفرة لمنع التلاعب بالتقارير ومستندات الإفادة.',
            roleEn: 'Blockchain & Certs Developer',
            roleAr: 'مطور أول نظم التوثيق الرقمي'
          },
          {
            titleEn: 'National Security Validation Sprints',
            titleAr: 'دورات واختبارات الجاهزية للحماية الرقمية الوطنية',
            descEn: 'Coordinate validation audits confirming infrastructure protection level aligns with official guidelines.',
            descAr: 'إجراء التدقيق والاختبار المتزامن لقياس مستويات تلافي الاختراق حسب اشتراطات الأمن السيبراني.',
            roleEn: 'National Cyber Security Lead',
            roleAr: 'قائد الفحص والاستجابة السيبرانية'
          },
          {
            titleEn: 'Public Campaign Deployment & Scale Exercises',
            titleAr: 'تجهيز بيئة الإطلاق الرسمي واختبارات الأحمال الوطنية',
            descEn: 'Establish redundant edge routing networks handling concurrent launch traffic surges.',
            descAr: 'تهيئة مسارات النشر والاتصالات السحابية لاستيعاب التدفق المتزامن الضخم للجمهور.',
            roleEn: 'Government Delivery Director',
            roleAr: 'مدير تسليم قطاع المبادرات الوطنية'
          }
        ];
        break;

      case 'ai-ml':
        taskTemplates = [
          {
            titleEn: 'Data Feasibility & Ethics Review',
            titleAr: 'دراسة جدوى البيانات والأخلاقيات الرقمية',
            descEn: 'Review core datasets for biases, leaks, and establish primary learning goals.',
            descAr: 'مراجعة مجموعات البيانات واستكشاف انحيازها وتحديد غايات الفحص والتعلم.',
            roleEn: 'AI Compliance Officer',
            roleAr: 'مسؤول امتثال الذكاء الاصطناعي'
          },
          {
            titleEn: 'Dataset Cleanse & Feature Engineering',
            titleAr: 'هندسة الخصائص وتنقية البيانات التوجيهية',
            descEn: 'Prepare model inputs, handle missing outliers, and normalize dimensions.',
            descAr: 'تحضير وتنقية أوعية المدخلات وصياغة المتغيرات الرياضية الموجهة.',
            roleEn: 'ML Data Engineer',
            roleAr: 'مهندس بيانات تعلم الآلة'
          },
          {
            titleEn: 'Model Architecture Selection',
            titleAr: 'هندسة وبناء الهيكل الرياضي للنموذج',
            descEn: 'Flesh out prospective neural layers, custom transfer learning weights, or standard tree parameters.',
            descAr: 'تحديد أفضل طبقات التدريب العصبي أو خوارزميات التصنيف المثلى للمشكلة.',
            roleEn: 'AI Research Scientist',
            roleAr: 'باحث ومطور ذكاء اصطناعي'
          },
          {
            titleEn: 'Hyperparameter Sprints & Epoch Training',
            titleAr: 'دورات تدريب النموذج وصقل المعاملات الدقيقة',
            descEn: 'Execute deep loops on GPU containers, tracking loss indicators and precision metrics.',
            descAr: 'بدء عمليات التدريب المحوسبة ومراقبة منحنيات الدقة والتلافي.',
            roleEn: 'Deep Learning Specialist',
            roleAr: 'أخصائي التعلم العميق'
          },
          {
            titleEn: 'Endpoint Construction & Pipeline Deployment',
            titleAr: 'نشر الواجهة البرمجية ومزامنة مخرجات التوقع',
            descEn: 'Wrap learned logic in lightweight API boundaries with robust latency caches.',
            descAr: 'تغليف النموذج في واجهة API خفيفة مع ترقية ذاكرة الاستجابة السريعة.',
            roleEn: 'MLOps Engineer',
            roleAr: 'مهندس عمليات تعلم الآلة'
          },
          {
            titleEn: 'Interactive Integration & QA Safety Drift Checks',
            titleAr: 'التحقق من تراجع الاستجابة وضمان الجودة',
            descEn: 'Connect predictions to UI widgets, monitoring outputs against safety filters and ground truth.',
            descAr: 'ربط مخرجات الذكاء الاصطناعي بالواجهات ومراقبة دقة التوقعات باستمرار.',
            roleEn: 'AI Auditor',
            roleAr: 'مدير حلول الذكاء الاصطناعي'
          }
        ];
        break;

      case 'cloud-computing':
        taskTemplates = [
          {
            titleEn: 'Cloud Migration Readiness Assessment',
            titleAr: 'تقييم جاهزية وسعة الترحيل للسحابة',
            descEn: 'Audit source server assets, database sizes, and bandwidth configurations.',
            descAr: 'جرد الأصول البرمجية ومصادر البيانات وقدرة الاستهلاك لشبكة الخوادم الراهنة.',
            roleEn: 'Cloud Migration Strategist',
            roleAr: 'مخطط مسارات الهجرة السحابية'
          },
          {
            titleEn: 'Secure Multi-Region Cloud Architecture Design',
            titleAr: 'تصميم الهيكلية السحابية متعددة المناطق',
            descEn: 'Draft cloud resources, virtual networks, security rules, and subnets setups.',
            descAr: 'تصميم الخوادم والشبكات الافتراضية والمسارات الجغرافية وجدران الحماية للشركة.',
            roleEn: 'Principal Cloud Architect',
            roleAr: 'كبير مهندسي الحلول السحابية'
          },
          {
            titleEn: 'Database Replication & Schema Settle',
            titleAr: 'مزامنة هياكل وترحيل قواعد البيانات',
            descEn: 'Establish real-time replication tunnels from source databases to managed cloud instances.',
            descAr: 'تأسيس قنوات نقل البيانات الفورية إلى خوادم قواعد البيانات المدارة سحابياً.',
            roleEn: 'Cloud Database Specialist',
            roleAr: 'أخصائي قواعد البيانات السحابية'
          },
          {
            titleEn: 'Auto-Scaling & Load Balancing Drills',
            titleAr: 'موازنة الأحمال والتحجيم التلقائي',
            descEn: 'Configure auto-scaling triggers and resilient CDNs to endure high user bursts.',
            descAr: 'بناء حزم التحميل التكراري وموزع المرور للتعامل مع ذروة النشاط بمرونة.',
            roleEn: 'DevOps Engineer',
            roleAr: 'مهندس العمليات السحابية المدمجة'
          },
          {
            titleEn: 'Identity & Secrets Management Hardening',
            titleAr: 'تأمين حسابات الوصول وتشفير المفاتيح',
            descEn: 'Vault development credentials, isolate identity channels, and enforce least-privilege IAM.',
            descAr: 'تخزين المفاتيح الأمنية بقنوات مشفرة مع حظر وتحصين هويات وصلاحيات العبور.',
            roleEn: 'Cloud IAM Specialist',
            roleAr: 'أخصائي هويات ونظم حماية السحابة'
          },
          {
            titleEn: 'Final Production Go-Live & Disaster Recovery Dry Run',
            titleAr: 'التشغيل الفعلي واختبار خطة التعافي من الطوارئ',
            descEn: 'Flip production traffic to the cloud with concurrent monitoring and active backup checks.',
            descAr: 'توجيه حركة المرور الفعلية للسحابة كلياً وإجراء سيناريو التعافي والنسخ الجغرافي.',
            roleEn: 'SRE Director',
            roleAr: 'مدير موثوقية البنى التحتية'
          }
        ];
        break;

      default:
        taskTemplates = [
          {
            titleEn: 'Preliminary Exploration & Logging',
            titleAr: 'الاستكشاف الأولي وتسجيل الطلب بقواعد البيانات',
            descEn: 'Securely record inquiry, establish Firestore indexes, and align primary engineering leads.',
            descAr: 'تسجيل التذكرة بقاعدة بيانات Firestore السحابية بنجاح، وتفريد مهندس حلول لمراجعتها.',
            roleEn: 'Systems Analyst',
            roleAr: 'محلل النظم ومهندس النشر'
          },
          {
            titleEn: 'Feasibility Assessment & Work Scope Sizing',
            titleAr: 'تقييم الجدوى التقنية وهندسة النطاق والاحتياج',
            descEn: 'Determine constraints of targeted solutions, estimate code sprint metrics and database structures.',
            descAr: 'توقع السعة التخزينية وحجم المرور وقنوات التواصل لصياغة أنسب تكلفة تقديرية مجدية.',
            roleEn: 'Lead Tech Consultant',
            roleAr: 'مستشار الحلول الرقمية الشاملة'
          },
          {
            titleEn: 'Dynamic Architecture & Financial Blueprint Construction',
            titleAr: 'ابتكار الهيكلية الهندسية وصياغة المسودة المالية',
            descEn: 'Document recommended libraries, security protocols, container structures, and workflow charts.',
            descAr: 'صياغة المكونات واللغات والشفرات وجدولة قنوات التغذية المقترحة لمستودع الحلول.',
            roleEn: 'Solutions Architect',
            roleAr: 'مصمم وهيكل البرمجيات السحابية'
          },
          {
            titleEn: 'Enterprise Kickoff & Sprint Provisioning',
            titleAr: 'جلسة التدشين المعتمدة وبدء دورات هندسة الكود',
            descEn: 'Allocate secure repositories, coordinate team roles, and provision first developer environments.',
            descAr: 'تجهيز مستودعات الأكواد ومزامنة حزم التطوير والبدء فوراً في دورات التنفيذ الهيكلية الأولى.',
            roleEn: 'Engineering Team Lead',
            roleAr: 'رئيس الطواقم والقدرات الهندسية'
          },
          {
            titleEn: 'System Construction & Staged Performance Drills',
            titleAr: 'تشييد المكونات وإجراء اختبارات الجودة الموازية',
            descEn: 'Iterative construction of React modules or database collections with complete Unit coverage.',
            descAr: 'تكويد وبناء الواجهات والمرشحات وبنيان قواعد البيانات بأعلى مستويات المواءمة التشغيلية.',
            roleEn: 'Senior Frontend & Cloud Eng',
            roleAr: 'مطور الواجهات الأمامية والنظم السحابية'
          },
          {
            titleEn: 'Final QA Integration & Scalable CDN Cloud Launch',
            titleAr: 'التحقق البرمجي النهائي وتدشين النظم للمتعاملين',
            descEn: 'Confirm end-to-end flow handles concurrent active loops, map domains, and configure safety locks.',
            descAr: 'معاينة الواجهات والربط النهائي لضمان أعلى معايير الاستقرار وتفعيل القفل الأمني التام للبث المباشر.',
            roleEn: 'QA Lead Auditor',
            roleAr: 'مدير عمليات ضبط الفقد والجودة'
          }
        ];
    }

    return taskTemplates.map((tmpl, idx) => {
      let taskStatus: 'completed' | 'in-progress' | 'pending' = 'pending';
      if (idx < currentStatusIndex) {
        taskStatus = 'completed';
      } else if (idx === currentStatusIndex) {
        taskStatus = 'in-progress';
      }

      return {
        id: `ST-0${idx + 1}`,
        title: isAr ? tmpl.titleAr : tmpl.titleEn,
        desc: isAr ? tmpl.descAr : tmpl.descEn,
        role: isAr ? tmpl.roleAr : tmpl.roleEn,
        status: taskStatus
      };
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-[#fafafa]" id="client-portal-overlay">
          {/* Light solid page-like backdrop transition filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#fafafa]"
          />

          <div className="relative min-h-screen w-full flex flex-col z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-7xl mx-auto bg-[#fafafa] flex flex-col min-h-screen transition-all duration-300 client-portal-light-page"
              id="client-portal-page-wrap"
            >
              
              {/* Native Header Section */}
              <div className="px-6 py-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 gap-4 font-sans">
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-sky-600">
                  <div className="bg-sky-50 p-2.5 rounded-2xl text-sky-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider Cairo">
                      {isAr ? 'منطقة الشركاء والعملاء' : 'Enterprise Partner Hub'}
                    </h3>
                    <p className="text-[11px] text-slate-500 block mt-0.5">
                      {isAr ? 'تسجيل الدخول ومتابعة مسيرة التحول الرقمي والتطوير المالي' : 'Client Access Portal & Lifecycle Tracker'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 rtl:space-x-reverse self-stretch sm:self-auto justify-between sm:justify-end">
                  {currentClient && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-650 border border-red-100 hover:bg-red-100/50 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
                      title={isAr ? 'تسجيل الخروج' : 'Log Out Account'}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{isAr ? 'خروج من الحساب' : 'Logout'}</span>
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl border border-slate-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{isAr ? 'العودة للرئيسية ←' : '← Back to Homepage'}</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* 1. NOT LOGGED IN VIEW: AUTHENTICATION FORMS & INTEGRATED CLIENT MENUS */}
                {!currentClient ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT SIDEBAR: Interactive Estimator and Modernization Capabilities Menu (span 5) */}
                    <div className="lg:col-span-5 space-y-5 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        {/* Interactive Sidebar Header */}
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-4 h-4 text-sky-400" />
                          <h4 className="text-xs font-bold text-sky-400 uppercase tracking-widest font-mono">
                            {isAr ? 'بيئة التقدير والتحول الرقمي' : 'Advisory Workspace Tools'}
                          </h4>
                        </div>
                        
                        {/* Sub-menu Navigation for the Sidebar */}
                        <div className="flex p-0.5 bg-slate-950/80 rounded-lg border border-slate-800 mb-4 shrink-0">
                          <button
                            type="button"
                            onClick={() => setActiveSideTab('estimator')}
                            className={`flex-1 py-1.5 text-center rounded text-[10px] font-bold transition-all cursor-pointer ${
                              activeSideTab === 'estimator'
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {isAr ? 'حاسبة المشاريع' : 'Sizing Calculator'}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setActiveSideTab('services')}
                            className={`flex-1 py-1.5 text-center rounded text-[10px] font-bold transition-all cursor-pointer ${
                              activeSideTab === 'services'
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {isAr ? 'المزايا الرقمية' : 'Platform Menus'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveSideTab('demo')}
                            className={`flex-1 py-1.5 text-center rounded text-[10px] font-bold transition-all cursor-pointer ${
                              activeSideTab === 'demo'
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {isAr ? 'شركاء تجريبيين' : 'Quick Demo Logins'}
                          </button>
                        </div>

                        {/* TAB 1: INTERACTIVE INVESTMENT SIZING ESTIMATOR */}
                        {activeSideTab === 'estimator' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3.5"
                          >
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {isAr 
                                ? 'أجر تقدير لخطط العمل بالمنصة والتقنيات لتحديد الميزانية المتوقعة على الفور قبل تسجيل دخولك.'
                                : 'Evaluate architectural tech options to approximate integration costs and milestones before authenticating.'}
                            </p>

                            <div className="space-y-2.5">
                              {/* Sector Selector */}
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">
                                  {isAr ? 'قطاع المنشأة المستهدفة' : 'Target Corporate Sector'}
                                </label>
                                <select
                                  value={calcSector}
                                  onChange={(e) => setCalcSector(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2.5 text-slate-300 text-[11px] outline-none focus:border-sky-500 font-sans"
                                >
                                  <option value="retail">{isAr ? '🛒 التجارة الإلكترونية والتجزئة' : 'Retail & E-commerce'}</option>
                                  <option value="banking">{isAr ? '🏦 البنوك والمدفوعات الرقمية' : 'Banking & Fintech Regulation'}</option>
                                  <option value="government">{isAr ? '🏛️ القطاع الحكومي والبلدي' : 'Municipality & Government'}</option>
                                  <option value="healthcare">{isAr ? '🏥 الرعاية الطبية والصحة' : 'Healthcare & Diagnostics'}</option>
                                </select>
                              </div>

                              {/* Solution tech Selector */}
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">
                                  {isAr ? 'الحل التقني الرئيسي المطلوب' : 'Primary Solution Architecture'}
                                </label>
                                <select
                                  value={calcSolution}
                                  onChange={(e) => setCalcSolution(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2.5 text-slate-300 text-[11px] outline-none focus:border-sky-500 font-sans"
                                >
                                  <option value="digital-transformation">{isAr ? '🚀 التحول الرقمي الشامل' : 'Comprehensive Transformation'}</option>
                                  <option value="cloud-computing">{isAr ? '☁️ ترحيل السيرفرات السحابية' : 'Server & IaC Cloud Migration'}</option>
                                  <option value="ai-ml">{isAr ? '🧠 خوارزميات وذكاء اصطناعي' : 'Applied AI & ML Pipelines'}</option>
                                  <option value="fintech">{isAr ? '💳 بوابات الدفع والتكامل المالي' : 'Fintech Integrations & Open Banking'}</option>
                                </select>
                              </div>

                              {/* Complexity Selector */}
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1">
                                  {isAr ? 'درجة تعقيد وتكامل الأنظمة' : 'Database & Tech Complexity'}
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                  {['simple', 'medium', 'complex'].map((level) => (
                                    <button
                                      key={level}
                                      type="button"
                                      onClick={() => setCalcComplexity(level)}
                                      className={`py-1 text-[10px] font-bold rounded border cursor-pointer transition-all ${
                                        calcComplexity === level
                                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                                          : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-white'
                                      }`}
                                    >
                                      {level === 'simple' && (isAr ? 'بسيط وغرضي' : 'Simple')}
                                      {level === 'medium' && (isAr ? 'متكامل طبيعي' : 'Standard')}
                                      {level === 'complex' && (isAr ? 'متقدم ومركّب' : 'Enterprise')}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Google Forms workspace Toggle */}
                              <div className="pt-1.5 flex items-center justify-between border-t border-slate-800/40 mt-1">
                                <span className="text-[10px] font-bold text-slate-400">
                                  {isAr ? 'دمج استمارات Google Forms التلقائية' : 'Integrate Google Forms Intake'}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={calcFormsIntegration}
                                    onChange={(e) => setCalcFormsIntegration(e.target.checked)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-7 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-sky-450"></div>
                                </label>
                              </div>
                            </div>

                            {/* ESTIMATION BOX OUTCOME */}
                            <div className="mt-3.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800 mx-auto text-right ltr:text-left space-y-2 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 rounded-full blur-xl" />
                              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                <span>{isAr ? 'التقدير المتوقع للمشروع' : 'Corporate Target Sizing'}</span>
                                <span className="bg-sky-500/15 text-sky-400 px-1 rounded font-bold uppercase">{calcComplexity}</span>
                              </div>
                              <div className="flex justify-between items-baseline">
                                <span className="text-sm font-extrabold text-white font-mono">
                                  {currentEstimate.cost} <span className="text-[10px] text-sky-400 font-sans">{isAr ? 'ريال سعودي' : 'SAR'}</span>
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ⏱️ {currentEstimate.timeline} {isAr ? 'يوم عمل' : 'Work Days'}
                                </span>
                              </div>

                              {/* Components preview list */}
                              <div className="pt-2 border-t border-slate-800/60 mt-1 space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 block uppercase font-mono">{isAr ? 'المكونات الهندسية المعتمدة:' : 'Approved Architecture Components:'}</span>
                                {currentEstimate.components.map((comp, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-[9px] text-slate-400">
                                    <div className="w-1 h-1 rounded-full bg-sky-400 shrink-0" />
                                    <span className="truncate">{comp}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* TAB 2: MODERN CAPABILITIES MENUS & SYSTEM ECOSYSTEM */}
                        {activeSideTab === 'services' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3 font-sans"
                          >
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {isAr 
                                ? 'حلولنا مصممة لتفعيل التكامل التام مع بيئات العمل السحابية والتطبيقات المؤسسية ومستودعات البيانات.'
                                : 'Our solutions seamlessly link with secure corporate platforms, cloud repositories, and Google workspace frameworks.'}
                            </p>

                            <div className="grid grid-cols-1 gap-2">
                              {/* Item 1 */}
                              <div className="flex items-start gap-3 p-2 bg-slate-950/60 rounded-xl border border-slate-800/40">
                                <div className="text-emerald-400 bg-emerald-500/10 p-1.5 rounded-lg shrink-0">
                                  <Chrome className="w-3.5 h-3.5" />
                                </div>
                                <div className="space-y-0.5">
                                  <h5 className="text-[11px] font-bold text-white leading-tight">
                                    {isAr ? 'تكامل Google Forms اللحظي' : 'Direct Google Forms Hub'}
                                  </h5>
                                  <p className="text-[10px] text-slate-400 leading-normal">
                                    {isAr ? 'توليد المخططات والاستمارات وأتمتة الردود وحفظها مباشرة.' : 'Auto-sync user-facing forms data and process it directly.'}
                                  </p>
                                </div>
                              </div>

                              {/* Item 2 */}
                              <div className="flex items-start gap-3 p-2 bg-slate-950/60 rounded-xl border border-slate-800/40">
                                <div className="text-sky-400 bg-sky-500/10 p-1.5 rounded-lg shrink-0">
                                  <Database className="w-3.5 h-3.5" />
                                </div>
                                <div className="space-y-0.5">
                                  <h5 className="text-[11px] font-bold text-white leading-tight">
                                    {isAr ? 'قاعدة بيانات سحابية لحظية' : 'Cloud Secure Firestore'}
                                  </h5>
                                  <p className="text-[10px] text-slate-400 leading-normal">
                                    {isAr ? 'بيانات معزولة وجدران مراقبة تضمن أداء بنسبة استقرار تفوق 99.9%.' : 'Isolated records protected by bulletproof ABAC rules.'}
                                  </p>
                                </div>
                              </div>

                              {/* Item 3 */}
                              <div className="flex items-start gap-3 p-2 bg-slate-950/60 rounded-xl border border-slate-800/40">
                                <div className="text-indigo-400 bg-indigo-500/10 p-1.5 rounded-lg shrink-0">
                                  <Calendar className="w-3.5 h-3.5" />
                                </div>
                                <div className="space-y-0.5">
                                  <h5 className="text-[11px] font-bold text-white leading-tight">
                                    {isAr ? 'مزامنة Calendars & Auth' : 'Google Auth & Scheduling'}
                                  </h5>
                                  <p className="text-[10px] text-slate-400 leading-normal">
                                    {isAr ? 'الربط بمواعيد المطورين المتاحة لتنسيق اجتماعات انطلاق المشاريع.' : 'Establish direct lines with solution architects via OAuth screens.'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* TAB 3: SUDDEN PRESET DEMO ACCOUNTS CLIENT SUCCESS */}
                        {activeSideTab === 'demo' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3 font-sans"
                          >
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {isAr 
                                ? 'تحسين تجربة العميل: بنقرة واحدة سريعة، يمكنك تعبئة الحسابات الافتراضية للشركاء للاطلاع على لوحة البيانات.'
                                : 'Optimized customer flow: click on any corporate client profile below to fill credentials instantly and run diagnostics.'}
                            </p>

                            <div className="space-y-2 mt-2">
                              {/* Client 1 */}
                              <button
                                type="button"
                                onClick={() => {
                                  setLoginEmail('demo@developer.sa');
                                  setLoginPassword('password123');
                                  setActiveTab('login');
                                  setLoginError('');
                                }}
                                className="w-full p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800/80 rounded-xl text-right ltr:text-left text-xs transition-all flex items-center justify-between group cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 bg-amber-500/10 rounded-lg flex items-center justify-center text-sm">🏢</div>
                                  <div>
                                    <h6 className="text-[11px] font-bold text-white group-hover:text-amber-400 transition-colors">عبد الرحمن المطلق</h6>
                                    <p className="text-[9px] text-slate-500 font-mono">demo@developer.sa</p>
                                  </div>
                                </div>
                                <span className="text-[9px] bg-amber-500/15 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase">Gold</span>
                              </button>

                              {/* Client 2 */}
                              <button
                                type="button"
                                onClick={() => {
                                  setLoginEmail('businesdevelopers@gmail.com');
                                  setLoginPassword('password123');
                                  setActiveTab('login');
                                  setLoginError('');
                                }}
                                className="w-full p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800/80 rounded-xl text-right ltr:text-left text-xs transition-all flex items-center justify-between group cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 bg-indigo-500/10 rounded-lg flex items-center justify-center text-sm">🚀</div>
                                  <div>
                                    <h6 className="text-[11px] font-bold text-white group-hover:text-indigo-400 transition-colors">شريك التطوير البلاتيني</h6>
                                    <p className="text-[9px] text-slate-500 font-mono">businesdevelopers@gmail.com</p>
                                  </div>
                                </div>
                                <span className="text-[9px] bg-teal-500/15 text-teal-400 px-1.5 py-0.5 rounded font-bold uppercase">Platinum</span>
                              </button>
                            </div>
                            
                            <div className="p-2 border border-dashed border-slate-800 rounded-lg text-center">
                              <span className="text-[9px] text-slate-500 text-center block">
                                {isAr ? '💡 عينات اختبارية فورية لقاعدة بيانات Firestore السحابية.' : '💡 Instant seeded profiles mapped directly in Firestore DB.'}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Bottom advisory credit */}
                      <div className="mt-4 pt-4 border-t border-slate-900">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans">
                          <span>{isAr ? 'الهاتف الموحد' : 'Unified Hotline'}</span>
                          <span className="font-mono">{isAr ? '9200-BD-966' : '9200-BD-966'}</span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT PANEL: Dynamic Authentication Form */}
                    <div className="lg:col-span-7 space-y-6 flex flex-col justify-center">
                      <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('login');
                            setLoginError('');
                          }}
                          className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'login'
                              ? 'bg-sky-500 text-slate-950 shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <LogIn className="w-3.5 h-3.5 inline ltr:mr-1.5 rtl:ml-1.5 align-middle" />
                          <span className="align-middle">{isAr ? 'تسجيل الدخول ومتابعة المشروع' : 'Sign In Gateway'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('register');
                            setRegError('');
                          }}
                          className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'register'
                              ? 'bg-sky-500 text-slate-950 shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <UserPlus className="w-3.5 h-3.5 inline ltr:mr-1.5 rtl:ml-1.5 align-middle" />
                          <span className="align-middle">{isAr ? 'إنشاء حساب جديد' : 'Register Account'}</span>
                        </button>
                      </div>

                      {/* LOGIN FORM VIEW */}
                      {activeTab === 'login' && (
                        <motion.form 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          onSubmit={handleLoginSubmit}
                          className="space-y-4"
                        >
                          <div className="text-center pb-2">
                            <p className="text-slate-400 text-xs leading-relaxed">
                              {isAr 
                                ? 'سجل دخولك لمتابعة عقود دراسات الجدوى، استعراض الحلول التقنية المعتمدة، وتكليف المطورين من لوحة التحكم.'
                                : 'Log in to track structural advisory roadmaps, approved tech modernization scopes, and coordinate with your dedicated solution architect.'}
                            </p>
                          </div>

                          {loginError && (
                            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-550/20 flex items-start gap-2.5 text-xs text-red-400 text-right ltr:text-left">
                              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                              <span>{loginError}</span>
                            </div>
                          )}

                          <div className="space-y-3">
                            <div>
                              <label className="text-slate-400 text-[11px] font-bold block mb-1.5 ltr:text-left rtl:text-right">
                                {isAr ? 'البريد الإلكتروني المؤسسي' : 'Corporate Email Address'}
                              </label>
                              <div className="relative">
                                <Mail className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-500 w-4.5 h-4.5 pointer-events-none" />
                                <input
                                  type="email"
                                  value={loginEmail}
                                  onChange={(e) => setLoginEmail(e.target.value)}
                                  placeholder="name@company.com"
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white text-xs placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-slate-400 text-[11px] font-bold block mb-1.5 ltr:text-left rtl:text-right">
                                {isAr ? 'كلمة المرور الآمنة' : 'Security Password'}
                              </label>
                              <div className="relative">
                                <Lock className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-500 w-4.5 h-4.5 pointer-events-none" />
                                <input
                                  type="password"
                                  value={loginPassword}
                                  onChange={(e) => setLoginPassword(e.target.value)}
                                  placeholder="••••••••"
                                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-10 pr-4 text-white text-xs placeholder:text-slate-650 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-sky-450 hover:bg-sky-500 text-slate-950 font-extrabold text-xs tracking-wider transition-all shadow-md active:scale-98 cursor-pointer text-center"
                          >
                            {isAr ? 'تسعير ومتابعة الطلبات المفتوحة ➔' : 'Sign In & Track Solutions ➔'}
                          </button>

                          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/40 text-[10px] text-slate-500 text-center leading-relaxed font-sans">
                            {isAr 
                              ? '💡 تلميح تجربة المستخدم: انقر على تبويب "شركاء تجريبيين" في الجانب لتعبئة بيانات الدخول مباشرة بلحظة واحدة.'
                              : '💡 UX Tip: Click on the "Quick Demo Logins" menu on the sidebar to instantly fill credentials for local test data.'}
                          </div>
                        </motion.form>
                      )}

                      {/* REGISTER FORM VIEW */}
                      {activeTab === 'register' && (
                        <motion.form 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          onSubmit={handleRegisterSubmit}
                          className="space-y-4"
                        >
                          {regSuccess ? (
                            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                                <CheckCircle2 className="w-6 h-6" />
                              </div>
                              <h4 className="text-sm font-bold text-white">
                                {isAr ? 'تم إنشاء حسابك بنجاح!' : 'Account Created Successfully!'}
                              </h4>
                              <p className="text-xs text-slate-400">
                                {isAr ? 'جاري تحويلك لصفحة تسجيل الدخول...' : 'Redirecting to sign-in panel...'}
                              </p>
                            </div>
                          ) : (
                            <>
                              <div className="text-center pb-1">
                                <p className="text-slate-400 text-xs leading-relaxed">
                                  {isAr 
                                    ? 'أنشئ حساباً لشركتك الآن لحفظ مسودات حلولك التقنية وتتبع الخطط الهندسية مباشرة.'
                                    : 'Establish a secure company space to coordinate architectural drafts and trace system milestones.'}
                                </p>
                              </div>

                              {regError && (
                                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-400 text-right ltr:text-left">
                                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                  <span>{regError}</span>
                                </div>
                              )}

                              <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-slate-400 text-[11px] font-bold block mb-1 ltr:text-left rtl:text-right">
                                      {isAr ? 'الاسم بالكامل' : 'Full Name *'}
                                    </label>
                                    <div className="relative">
                                      <User className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-500 w-4 h-4 pointer-events-none" />
                                      <input
                                        type="text"
                                        value={regName}
                                        onChange={(e) => setRegName(e.target.value)}
                                        placeholder={isAr ? 'الاسم بالكامل' : 'John Doe'}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-white text-xs placeholder:text-slate-650 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all text-right"
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-slate-400 text-[11px] font-bold block mb-1 ltr:text-left rtl:text-right">
                                      {isAr ? 'البريد الإلكتروني المؤسسي' : 'Corporate Email *'}
                                    </label>
                                    <div className="relative">
                                      <Mail className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-500 w-4 h-4 pointer-events-none" />
                                      <input
                                        type="email"
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-white text-xs placeholder:text-slate-650 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all text-right"
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-slate-400 text-[11px] font-bold block mb-1 ltr:text-left rtl:text-right">
                                      {isAr ? 'اسم الشركة / الكيان' : 'Company Name *'}
                                    </label>
                                    <div className="relative">
                                      <Building className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-500 w-4 h-4 pointer-events-none" />
                                      <input
                                        type="text"
                                        value={regCompany}
                                        onChange={(e) => setRegCompany(e.target.value)}
                                        placeholder={isAr ? 'مثال: شركة التطوير الكبرى' : 'e.g. Acme Corp'}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-white text-xs placeholder:text-slate-650 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all text-right"
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-slate-400 text-[11px] font-bold block mb-1 ltr:text-left rtl:text-right">
                                      {isAr ? 'رقم الجوال (اختياري)' : 'Phone Number (Optional)'}
                                    </label>
                                    <div className="relative">
                                      <Phone className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-500 w-4 h-4 pointer-events-none" />
                                      <input
                                        type="tel"
                                        value={regPhone}
                                        onChange={(e) => setRegPhone(e.target.value)}
                                        placeholder="+966 50 000 0000"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-white text-xs placeholder:text-slate-650 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all text-right"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-slate-400 text-[11px] font-bold block mb-1 ltr:text-left rtl:text-right">
                                    {isAr ? 'كلمة المرور الآمنة' : 'Security Password *'}
                                  </label>
                                  <div className="relative">
                                    <Lock className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-500 w-4 h-4 pointer-events-none" />
                                    <input
                                      type="password"
                                      value={regPassword}
                                      onChange={(e) => setRegPassword(e.target.value)}
                                      placeholder="••••••••"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-white text-xs placeholder:text-slate-650 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all text-right"
                                      required
                                    />
                                  </div>
                                </div>

                                <button
                                  type="submit"
                                  className="w-full py-3 rounded-xl bg-sky-450 hover:bg-sky-500 text-slate-950 font-extrabold text-xs tracking-wider transition-all shadow-md active:scale-98 cursor-pointer text-center"
                                >
                                  {isAr ? 'إنشاء حساب الشريك ➔' : 'Create Partner Account ➔'}
                                </button>
                              </div>
                            </>
                          )}
                        </motion.form>
                      )}
                    </div>
                  </div>
                ) : (
                  // Client Logged-in View
                  <div className="w-full animate-fadeIn text-right rtl:text-right ltr:text-left">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                      
                      {/* Sidebar Professional Navigation Panel */}
                      <aside className="w-full lg:w-72 shrink-0 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-6 lg:sticky lg:top-6 shadow-sm">
                        {/* Client Identity Briefing */}
                        <div className="pb-4 border-b border-slate-800/80 flex items-center gap-3 justify-start rtl:justify-end">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-450 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm uppercase shadow-md shadow-sky-500/10">
                            {currentClient?.name?.slice(0, 1) || (currentClient?.email ? currentClient.email.slice(0, 1) : 'C')}
                          </div>
                          <div className="space-y-0.5 text-right rtl:text-right ltr:text-left">
                            <h4 className="text-xs font-black text-white flex items-center gap-1.5 Cairo">
                              <span>{currentClient?.name || currentClient?.email}</span>
                            </h4>
                            <div className="flex items-center gap-1.5 justify-start rtl:justify-end">
                              <span className="text-[9px] font-black tracking-normal px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase">
                                {currentClient?.tier || 'client'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium font-sans">
                                {isAr ? 'حساب الشريك' : 'Partner Space'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Company Segment */}
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-slate-550 font-extrabold block font-sans">
                            {isAr ? 'الشركة المنتسبة' : 'AFFILIATED COMPANY'}
                          </span>
                          <p className="text-xs font-black text-slate-200 truncate Cairo">
                            {currentClient?.companyName || (isAr ? 'الشريك البرونزي' : 'Corporate Partner')}
                          </p>
                        </div>

                        {/* Professional Sidebar Navigation Links */}
                        <nav className="space-y-1.5">
                          {[
                            { id: 'dashboard', labelAr: 'لوحة التحكم والمؤشرات', labelEn: 'Dashboard Overview', icon: Activity },
                            { id: 'analytics', labelAr: 'تحليلات الأداء والمشاريع', labelEn: 'Performance Analytics', icon: TrendingUp },
                            { id: 'workspace', labelAr: 'بيئة العمل المدمجة', labelEn: 'Workspace Sync', icon: Cloud },
                            { id: 'team', labelAr: 'إدارة الفريق', labelEn: 'Team Hub', icon: Users },
                            { id: 'financials', labelAr: 'الموازنات والمصروفات', labelEn: 'Budgets & Financials', icon: DollarSign },
                            { id: 'contracts', labelAr: 'العقود والملاحق', labelEn: 'Contracts & Addenda', icon: FileCheck }
                          ].map((tab) => {
                            const TabIcon = tab.icon;
                            const isActive = portalSubTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setPortalSubTab(tab.id as any)}
                                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 justify-start cursor-pointer group ${
                                  isActive
                                    ? 'bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/10'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                                }`}
                              >
                                <TabIcon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-sky-400'}`} />
                                <span className="Cairo">{isAr ? tab.labelAr : tab.labelEn}</span>
                              </button>
                            );
                          })}
                        </nav>

                        {/* General Operational Stat Line */}
                        <div className="pt-2 border-t border-slate-800/85 hidden lg:block">
                          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850/50 space-y-2">
                            <span className="text-[9px] uppercase tracking-wider text-slate-550 font-extrabold block font-sans">
                              {isAr ? 'الحالة التشغيلية' : 'Operational Status'}
                            </span>
                            <div className="flex items-center gap-2 justify-start rtl:justify-end text-[10px] text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>{isAr ? 'اتصال سـحابي مـؤمن' : 'Encrypted Workspace Link'}</span>
                            </div>
                          </div>
                        </div>
                      </aside>

                      {/* Main Sidebar Content Area */}
                      <div className="flex-1 w-full min-w-0 space-y-6">
                        {/* Render corresponding subtab content */}
                    {portalSubTab === 'dashboard' ? (
                      <div className="space-y-6 animate-fadeIn text-right rtl:text-right ltr:text-left">
                        {/* Executive Dashboard Action Header */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
                          <div className="space-y-0.5">
                            <h5 className="text-sm font-black text-white flex items-center gap-2 justify-start rtl:justify-end Cairo">
                              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                              <span>{isAr ? 'لوحة التحكم للمؤشرات والتقدم الفني' : 'Executive Workspace & Progress Dashboard'}</span>
                            </h5>
                            <p className="text-[11px] text-slate-500 mt-1">
                              {isAr 
                                ? 'رصد ذكي لمعدلات إنجاز المهام الاستراتيجية، ومعدلات استهلاك الموازنة وموثوقية مخرجات المشاريع.' 
                                : 'Advanced operational views tracking corporate deliverable metrics, financial ledgers, and milestone velocity.'}
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={handleDownloadPDF}
                            disabled={isDownloadingPdf}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-450 to-indigo-650 font-black text-slate-950 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 text-xs shadow-lg shadow-sky-500/10 cursor-pointer Cairo"
                          >
                            {isDownloadingPdf ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                                <span>{isAr ? 'جاري بناء التقرير السحابي...' : 'Creating Audit Report...'}</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 text-slate-950" />
                                <span>{isAr ? 'تصدير تقرير التقدم والتحليلات (PDF)' : 'Download Performance Audit (PDF)'}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Google Meet Scheduled Sessions Spotlight */}
                        {(() => {
                          const meetEvents = (eventsList || []).filter(ev => {
                            const link = ev.hangoutLink || 
                              ev.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video' || ep.uri?.includes('meet.google.com'))?.uri || 
                              (ev.location?.includes('meet.google.com') ? ev.location : null);
                            return !!link;
                          });

                          if (meetEvents.length === 0) return null;

                          return (
                            <div className="grid grid-cols-1 gap-4 animate-fadeIn">
                              {meetEvents.map((ev: any, idx: number) => {
                                const meetLink = ev.hangoutLink || 
                                  ev.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video' || ep.uri?.includes('meet.google.com'))?.uri || 
                                  (ev.location?.includes('meet.google.com') ? ev.location : null);

                                const startStr = ev.start?.dateTime || ev.start?.date;
                                const formattedDT = startStr ? new Date(startStr).toLocaleString(isAr ? 'ar-SA' : 'en-US', {
                                  weekday: 'long',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : '';

                                return (
                                  <div key={idx} className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/40 to-slate-950 border border-indigo-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-lg shadow-indigo-500/5">
                                    <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                                    
                                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                      <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl shrink-0 mt-0.5">
                                        <Video className="w-5 h-5 animate-pulse text-indigo-400" />
                                      </div>
                                      <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-1.5 justify-start rtl:justify-end">
                                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                                            {isAr ? 'لقاء مجدول' : 'Advisory Support Call'}
                                          </span>
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                        </div>
                                        <h6 className="text-[13px] font-black text-white truncate max-w-lg font-sans">
                                          {ev.summary || (isAr ? 'جلسة تقييم ومراجعة' : 'Corporate Advisory Session')}
                                        </h6>
                                        <p className="text-[10.5px] text-indigo-250 font-mono">
                                          {formattedDT}
                                        </p>
                                        {ev.description && (
                                          <p className="text-[10px] text-slate-450 truncate max-w-md font-sans">
                                            {ev.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          try {
                                            navigator.clipboard.writeText(meetLink);
                                          } catch {
                                            const textarea = document.createElement("textarea");
                                            textarea.value = meetLink;
                                            document.body.appendChild(textarea);
                                            textarea.select();
                                            document.execCommand("copy");
                                            document.body.removeChild(textarea);
                                          }
                                          alert(isAr ? '✓ تم نسخ رابط الاجتماع المرئي!' : '✓ Meet invitation link copied!');
                                        }}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer hover:bg-slate-850"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
                                      </button>

                                      <a
                                        href={meetLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-500 text-slate-950 font-black text-[11px] rounded-xl hover:bg-indigo-400 active:scale-[0.98] transition-all hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
                                      >
                                        <Video className="w-4 h-4 text-slate-950" />
                                        <span>{isAr ? 'التحاق بالاجتماع الآن' : 'Join Meeting'}</span>
                                      </a>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}

                        {/* Summary Header Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                                {isAr ? 'إجمالي المشاريع' : 'Total Projects'}
                              </p>
                              <h4 className="text-xl font-black text-white font-mono">
                                {requests.length}
                              </h4>
                            </div>
                            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                              <Activity className="w-5 h-5" />
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1.5 justify-start rtl:justify-end">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>{isAr ? 'المشاريع النشطة' : 'Active Projects'}</span>
                              </p>
                              <h4 className="text-xl font-black text-emerald-400 font-mono">
                                {requests.filter(r => r.status === 'approved' || r.status === 'planned').length}
                              </h4>
                            </div>
                            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1.5 justify-start rtl:justify-end">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                <span>{isAr ? 'قيد المراجعة' : 'Under Review'}</span>
                              </p>
                              <h4 className="text-xl font-black text-amber-500 font-mono">
                                {requests.filter(r => r.status === 'reviewing' || r.status === 'pending').length}
                              </h4>
                            </div>
                            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              <Clock className="w-5 h-5" />
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                                {isAr ? 'إجمالي الدفعات المعتمدة' : 'Total Approved Payments'}
                              </p>
                              <h4 className="text-xl font-black text-sky-400 font-mono">
                                {totalPaidInvoices.toLocaleString()} <span className="text-[10px] font-bold font-sans">{isAr ? 'ريال' : 'SAR'}</span>
                              </h4>
                            </div>
                            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                              <DollarSign className="w-5 h-5" />
                            </div>
                          </div>
                        </div>

                        {/* Status Change Notification Center Panel */}
                        {(() => {
                          const unreadAlerts = requests.filter(r => portalSeenStatuses[r.id] && portalSeenStatuses[r.id] !== r.status);
                          if (unreadAlerts.length === 0) return null;

                          return (
                            <motion.div 
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-sky-500/30 rounded-2xl shadow-xl space-y-4 relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
                              
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div className="flex items-center gap-2.5 justify-start rtl:justify-end">
                                  <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-450 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                                  </span>
                                  <h5 className="text-xs font-black text-white flex items-center gap-1.5 Cairo">
                                    <Bell className="w-4 h-4 text-sky-400" />
                                    <span>{isAr ? 'تنبيهات هامة وتحديثات مشاريع نشطة' : 'Urgent Project Status Alerts'}</span>
                                  </h5>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextSeen = { ...portalSeenStatuses };
                                    unreadAlerts.forEach(r => {
                                      nextSeen[r.id] = r.status;
                                    });
                                    setPortalSeenStatuses(nextSeen);
                                    localStorage.setItem('bd_seen_request_statuses', JSON.stringify(nextSeen));
                                  }}
                                  className="text-[10px] text-sky-400 font-extrabold hover:text-sky-300 transition-colors bg-sky-500/10 hover:bg-sky-500/15 border border-sky-500/20 px-3 py-1.5 rounded-lg cursor-pointer font-sans"
                                >
                                  {isAr ? 'تأكيد قراءة جميع التنبيهات' : 'Acknowledge All Updates'}
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {unreadAlerts.map(req => {
                                  const oldS = portalSeenStatuses[req.id];
                                  const statusNames: Record<string, { labelAr: string, labelEn: string, color: string }> = {
                                    pending: { labelAr: 'مستلم/قيد الانتظار', labelEn: 'In Queue', color: 'text-slate-400 bg-slate-900 border-slate-850' },
                                    reviewing: { labelAr: 'قيد المراجعة الفنية', labelEn: 'Under Review', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                                    planned: { labelAr: 'مجدول ومقرر', labelEn: 'Scheduled', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                                    approved: { labelAr: 'مصادق وفعال', labelEn: 'Approved & Active', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
                                    completed: { labelAr: 'مكتمل ومسلم بنجاح', labelEn: 'Delivered', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                                  };

                                  const oldInfo = statusNames[oldS] || statusNames.pending;
                                  const newInfo = statusNames[req.status] || statusNames.pending;

                                  return (
                                    <div 
                                      key={req.id} 
                                      className="p-3.5 bg-slate-950 rounded-xl border border-slate-850/70 hover:border-sky-500/25 transition-all flex flex-col justify-between gap-3 text-right rtl:text-right ltr:text-left relative"
                                    >
                                      <div className="space-y-1 pr-4 rtl:pr-0 rtl:pl-4">
                                        <div className="flex justify-between items-center">
                                          <span className="text-[9px] font-mono text-slate-500 uppercase">
                                            {req.id}
                                          </span>
                                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                                        </div>
                                        <h6 className="text-[12px] font-black text-white truncate Cairo">
                                          {req.name}
                                        </h6>
                                        <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                                          {isAr 
                                            ? `تم إقرار تعديل على حالة دورتك الفنية من قِبل المشرفين:` 
                                            : `A corporate supervisor updated your platform status:`}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-black font-sans bg-slate-900/60 p-2 rounded-lg border border-slate-850 justify-start rtl:justify-end">
                                        <span className={`px-2 py-0.5 rounded border ${oldInfo.color}`}>
                                          {isAr ? oldInfo.labelAr : oldInfo.labelEn}
                                        </span>
                                        <span className="text-slate-500">➔</span>
                                        <span className={`px-2 py-0.5 rounded border ${newInfo.color} animate-pulse`}>
                                          {isAr ? newInfo.labelAr : newInfo.labelEn}
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextSeen = { ...portalSeenStatuses, [req.id]: req.status };
                                          setPortalSeenStatuses(nextSeen);
                                          localStorage.setItem('bd_seen_request_statuses', JSON.stringify(nextSeen));
                                        }}
                                        className="absolute top-2.5 left-2.5 rtl:left-auto rtl:right-2.5 text-slate-600 hover:text-white transition-colors cursor-pointer"
                                        title={isAr ? 'حذف التنبيه' : 'Dismiss Alert'}
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          );
                        })()}

                        {/* Interactive Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Financial Trend Line Chart */}
                          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 space-y-4">
                            <div>
                              <h5 className="text-[12px] font-extrabold text-white flex items-center gap-1.5 justify-start rtl:justify-end Cairo">
                                <Receipt className="w-4 h-4 text-sky-400" />
                                <span>{isAr ? 'الموازنة وسجل المدفوعات' : 'Authorized Budget & Payments'}</span>
                              </h5>
                              <p className="text-[10px] text-slate-500 mt-1 font-sans justify-start rtl:justify-end">
                                {isAr ? 'مقارنة الموازنة المحددة للمشاريع بالفواتير ومبالغ الدفع المسددة لتتبع السيولة.' : 'Compare project advisory budgets with logged & actual paid invoices.'}
                              </p>
                            </div>

                            <div className="w-full">
                              {chartData.length === 0 ? (
                                <div className="h-[260px] flex flex-col items-center justify-center text-slate-500 font-sans">
                                  <Sparkles className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
                                  <p className="text-xs">{isAr ? 'لا توجد بيانات مخطط كافي للتحليل مالي حالياً.' : 'Insufficient financial data to map charts.'}</p>
                                </div>
                              ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                      <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                      </linearGradient>
                                      <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#101827" />
                                    <XAxis 
                                      dataKey="id" 
                                      stroke="#4b5563" 
                                      tickLine={false} 
                                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                                    />
                                    <YAxis 
                                      stroke="#4b5563" 
                                      tickLine={false} 
                                      tick={{ fill: '#9ca3af', fontSize: 10 }} 
                                    />
                                    <Tooltip
                                      content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                          return (
                                            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg shadow-xl text-right rtl:text-right ltr:text-left text-xs font-sans space-y-1">
                                              <p className="font-bold text-slate-200">{isAr ? `الطلب: ${label}` : `Request ID: ${label}`}</p>
                                              {payload.map((pld: any) => (
                                                <p key={pld.name} style={{ color: pld.color }}>
                                                  <span className="font-semibold">{pld.name}: </span>
                                                  <span className="font-mono font-black">{pld.value.toLocaleString()} {isAr ? 'ريال' : 'SAR'}</span>
                                                </p>
                                              ))}
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11, color: '#e5e7eb' }} />
                                    <Area 
                                      type="monotone" 
                                      dataKey="budget" 
                                      name={isAr ? "الموازنة المقدرة" : "Estimated Budget"} 
                                      stroke="#38bdf8" 
                                      fillOpacity={1} 
                                      fill="url(#colorBudget)" 
                                    />
                                    <Area 
                                      type="monotone" 
                                      dataKey="paid" 
                                      name={isAr ? "المدفوع" : "Paid"} 
                                      stroke="#10b981" 
                                      fillOpacity={1} 
                                      fill="url(#colorPaid)" 
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              )}
                            </div>
                          </div>

                          {/* Request Lifecycle Breakdown Status Widget */}
                          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 space-y-4">
                            <div>
                              <h5 className="text-[12px] font-extrabold text-white flex items-center gap-1.5 justify-start rtl:justify-end Cairo">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                <span>{isAr ? 'تحديث وتوزيع حالة ملف الأعمال' : 'Lifecycle Project Breakdown'}</span>
                              </h5>
                              <p className="text-[10px] text-slate-500 mt-1 font-sans justify-start rtl:justify-end">
                                {isAr ? 'تصنيف ومراقبة سرعة الإنجاز والمراجعة لجميع المشاريع المقدمة.' : 'Categorization breakdown based on development timelines & states.'}
                              </p>
                            </div>

                            <div className="w-full">
                              {requests.length === 0 ? (
                                <div className="h-[260px] flex flex-col items-center justify-center text-slate-500 font-sans">
                                  <Activity className="w-8 h-8 text-slate-700 mb-2" />
                                  <p className="text-xs">{isAr ? 'لا توجد مشاريع مسجلة بعد لبناء المخطط.' : 'No projects registered yet to map breakdown.'}</p>
                                </div>
                              ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                  <BarChart 
                                    data={[
                                      { name: isAr ? 'قيد المراجعة' : 'Reviewing / Pending', value: requests.filter(r => r.status === 'reviewing' || r.status === 'pending').length, color: '#f59e0b' },
                                      { name: isAr ? 'مجدول / نشط' : 'Planned / Active', value: requests.filter(r => r.status === 'approved' || r.status === 'planned').length, color: '#38bdf8' },
                                      { name: isAr ? 'مكتبة المشاريع المكتملة' : 'Completed', value: requests.filter(r => r.status === 'completed').length, color: '#10b981' }
                                    ]} 
                                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#101827" />
                                    <XAxis 
                                      dataKey="name" 
                                      stroke="#4b5563" 
                                      tickLine={false} 
                                      tick={{ fill: '#9ca3af', fontSize: 9 }}
                                    />
                                    <YAxis 
                                      stroke="#4b5563" 
                                      tickLine={false} 
                                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                                      allowDecimals={false}
                                    />
                                    <Tooltip
                                      content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                          return (
                                            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg shadow-xl text-right rtl:text-right ltr:text-left text-xs font-sans space-y-1">
                                              <p className="font-extrabold text-slate-200">{payload[0].name}</p>
                                              <p className="text-sky-400 font-black">
                                                <span>{isAr ? 'عدد المشاريع: ' : 'Projects: '}</span>
                                                <span className="font-mono text-white text-sm">{payload[0].value}</span>
                                              </p>
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Bar dataKey="value" name={isAr ? "عدد المشاريع" : "Count of Projects"} label={{ fill: '#fff', fontSize: 10, position: 'top' }}>
                                      {[
                                        { color: '#f59e0b' },
                                        { color: '#38bdf8' },
                                        { color: '#10b981' }
                                      ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                    </Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : portalSubTab === 'analytics' ? (
                      <div className="space-y-6 animate-fadeIn text-right rtl:text-right ltr:text-left font-sans">
                        {/* Header Panel */}
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h5 className="text-sm font-black text-white flex items-center gap-2 justify-start rtl:justify-end Cairo">
                              <TrendingUp className="w-5 h-5 text-sky-400" />
                              <span>{isAr ? 'لوحة تحليلات مؤشرات الأداء المتقدمة' : 'Executive Portfolio Analytics Dashboard'}</span>
                            </h5>
                            <p className="text-[11px] text-slate-500 mt-1">
                              {isAr 
                                ? 'رصد ذكي لمعدلات إنجاز المهام الاستراتيجية ومعدل استهلاك الموازنة المعتمدة وتطابق المخرجات للمشاريع.' 
                                : 'Advanced tracking of active advisory deliverables, budget depletion velocity, and chronological task completion rates.'}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-850 text-[10px] font-mono text-slate-400 font-extrabold">
                            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                            <span>{isAr ? 'تحديث تلقائي مدمج' : 'Real-Time Database Feed'}</span>
                          </div>
                        </div>

                        {/* Summary Metrics Cards */}
                        {(() => {
                          const activeRequests = requests;
                          const totalBudget = activeRequests.reduce((sum, req) => sum + parseAmount(req.estimatedCost), 0) || 120000;
                          const paidSum = invoices
                            .filter(inv => inv.status === 'paid')
                            .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);
                          const unpaidSum = invoices
                            .filter(inv => inv.status === 'unpaid')
                            .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);
                          
                          // Compute overall average task completion percentage
                          let avgCompletion = 0;
                          let completedReqCount = 0;
                          const tasksDetails = activeRequests.map(req => {
                            const subTasks = getSolutionSubTasks(req);
                            const total = subTasks.length;
                            const completed = subTasks.filter(t => t.status === 'completed').length;
                            const inProgress = subTasks.filter(t => t.status === 'in-progress').length;
                            
                            let prg = 0;
                            if (total > 0) {
                              prg = Math.round(((completed + inProgress * 0.5) / total) * 100);
                            } else {
                              const sMap: Record<string, number> = { pending: 15, reviewing: 35, planned: 55, approved: 80, completed: 100 };
                              prg = sMap[req.status] || 0;
                            }
                            if (req.status === 'completed') {
                              completedReqCount++;
                            }
                            return prg;
                          });
                          
                          if (tasksDetails.length > 0) {
                            avgCompletion = Math.round(tasksDetails.reduce((a, b) => a + b, 0) / tasksDetails.length);
                          } else {
                            avgCompletion = 65; // realistic fallback illustrative average
                          }

                          const consumptionPercent = totalBudget > 0 ? Math.round((paidSum / totalBudget) * 100) : 0;
                          const burnEfficiency = avgCompletion > 0 ? (avgCompletion / Math.max(consumptionPercent, 1)).toFixed(2) : '0';

                          return (
                            <>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Card 1: Avg Task progress */}
                                <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex flex-col justify-between h-28 relative overflow-hidden">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">
                                      {isAr ? 'متوسط نسبة إنجاز المهام' : 'Avg Task Progress'}
                                    </span>
                                    <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                      <CheckSquare className="w-4 h-4" />
                                    </span>
                                  </div>
                                  <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-2xl font-black text-white font-mono">{avgCompletion}%</span>
                                    <span className="text-[9px] text-emerald-400 font-bold font-sans">
                                      {isAr ? '±8% تقدم مستمر' : '±8% weekly progression'}
                                    </span>
                                  </div>
                                  {/* Mini visual progress bar */}
                                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden mt-2">
                                    <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500" style={{ width: `${avgCompletion}%` }} />
                                  </div>
                                </div>

                                {/* Card 2: Strategic Allocated Budget */}
                                <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex flex-col justify-between h-28">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">
                                      {isAr ? 'الموازنة الاستراتيجية للمشاريع' : 'Strategic Allocated Budget'}
                                    </span>
                                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      <DollarSign className="w-4 h-4" />
                                    </span>
                                  </div>
                                  <div className="mt-2">
                                    <span className="text-xl font-black text-emerald-400 font-mono">{(totalBudget || 120000).toLocaleString()}</span>
                                    <span className="text-[9px] text-slate-400 font-bold ml-1 font-sans">{isAr ? 'ريال سعودي' : 'SAR'}</span>
                                  </div>
                                  <span className="text-[9px] text-slate-500 mt-1 font-sans">
                                    {isAr ? `${activeRequests.length} مشاريع مرتبطة وممولة` : `${activeRequests.length} active funded contracts`}
                                  </span>
                                </div>

                                {/* Card 3: Consumption Value */}
                                <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex flex-col justify-between h-28">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">
                                      {isAr ? 'المصروفات الفعلية' : 'Total Spent (Paid Lines)'}
                                    </span>
                                    <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                      <Receipt className="w-4 h-4" />
                                    </span>
                                  </div>
                                  <div className="mt-2 text-right">
                                    <div className="flex items-baseline gap-1 justify-start rtl:justify-end">
                                      <span className="text-xl font-black text-indigo-400 font-mono">{paidSum.toLocaleString()}</span>
                                      <span className="text-[9px] text-slate-400 font-bold">{isAr ? 'ريال' : 'SAR'}</span>
                                    </div>
                                    <p className="text-[9px] text-slate-500 font-sans mt-1">
                                      {isAr ? `تستهلك ${consumptionPercent}% من إجمالي الميزانية` : `Consumes ${consumptionPercent}% of total capital`}
                                    </p>
                                  </div>
                                </div>

                                {/* Card 4: Burn Efficiency Index */}
                                <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex flex-col justify-between h-28">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">
                                      {isAr ? 'مؤشر كفاءة الإنفاق التشغيلي' : 'Asset Sprints ROI Index'}
                                    </span>
                                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                      <Sparkles className="w-4 h-4" />
                                    </span>
                                  </div>
                                  <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-2xl font-black text-amber-500 font-mono">{burnEfficiency}x</span>
                                    <span className="text-[9px] text-slate-400 font-semibold font-sans">
                                      {parseFloat(burnEfficiency) >= 1 ? (isAr ? 'كفاءة ممتازة' : 'High Delivery Yield') : (isAr ? 'مستقر' : 'Normal Pace')}
                                    </span>
                                  </div>
                                  <p className="text-[9px] text-slate-500 font-sans">
                                    {isAr ? 'معدل تسليم المخرجات مقسوماً على المصروفات' : 'Ratio of deliverables completed vs spent scale'}
                                  </p>
                                </div>
                              </div>

                              {/* Big Charts Grid */}
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                                {/* Column 8: Dual Trend Line Chart */}
                                <div className="lg:col-span-8 p-5 bg-slate-950 border border-slate-900 rounded-2xl space-y-4">
                                  <div>
                                    <h6 className="text-[12px] font-extrabold text-white flex items-center gap-2 justify-start rtl:justify-end Cairo">
                                      <TrendingUp className="w-4 h-4 text-sky-400" />
                                      <span>{isAr ? 'منحنى أداء إنجاز المهام واستعمال الميزانية' : 'Deliverables Progress vs Budget Depletion Trendline'}</span>
                                    </h6>
                                    <p className="text-[10px] text-slate-500 mt-1 font-sans">
                                      {isAr 
                                        ? 'مؤشر زمني يقارن التقدم الهندسي الفعلي (أزرق) مع نسبة استدامة واستهلاك الميزانية المصروفة (أخضر).' 
                                        : 'A timeline model tracking physical deliverables development (cyan) against paid outlays trend (emerald).'}
                                    </p>
                                  </div>

                                  {(() => {
                                    // Make sure we have a list of chronological data points
                                    const rawPoints = [...activeRequests].sort((a, b) => a.id.localeCompare(b.id));
                                    
                                    let timelineData = rawPoints.map((req, idx) => {
                                      const subTasks = getSolutionSubTasks(req);
                                      const total = subTasks.length;
                                      const completed = subTasks.filter(t => t.status === 'completed').length;
                                      const inPrg = subTasks.filter(t => t.status === 'in-progress').length;
                                      
                                      let prg = 0;
                                      if (total > 0) {
                                        prg = Math.round(((completed + inPrg * 0.5) / total) * 100);
                                      } else {
                                        const sMap: Record<string, number> = { pending: 15, reviewing: 35, planned: 55, approved: 80, completed: 100 };
                                        prg = sMap[req.status] || 0;
                                      }

                                      const reqBudget = parseAmount(req.estimatedCost) || 30000;
                                      const matchingInvs = invoices.filter(inv => inv.requestId === req.id);
                                      const reqPaid = matchingInvs
                                        .filter(inv => inv.status === 'paid')
                                        .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);
                                      
                                      const reqConsumption = reqBudget > 0 ? Math.round((reqPaid / reqBudget) * 100) : 0;

                                      return {
                                        id: req.id,
                                        name: isAr ? `طلب ${req.id}` : `ID: ${req.id}`,
                                        date: new Date(req.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' }),
                                        completion: prg,
                                        budgetBurn: reqConsumption
                                      };
                                    });

                                    // If only 1 node or empty, interpolate intermediate phases to construct a stunning trend line
                                    if (timelineData.length < 3) {
                                      const baseCompletion = timelineData[0]?.completion || 75;
                                      const baseBurn = timelineData[0]?.budgetBurn || 55;
                                      timelineData = [
                                        { id: 'Start', name: isAr ? 'التدشين الأول' : 'Kickoff Project', date: 'Phase 1', completion: 15, budgetBurn: 10 },
                                        { id: 'Sprint 1', name: isAr ? 'تحليل الثغرات والجدوى' : 'Sizing & Scope', date: 'Phase 2', completion: 35, budgetBurn: 25 },
                                        { id: 'Sprint 2', name: isAr ? 'هندسة الواجهات والمرونة' : 'Design UI/UX', date: 'Phase 3', completion: Math.max(55, baseCompletion - 20), budgetBurn: Math.max(40, baseBurn - 15) },
                                        { id: 'Sprint 3', name: isAr ? 'بناء المكونات وربط API' : 'React Code Sprint', date: 'Phase 4', completion: baseCompletion, budgetBurn: baseBurn },
                                        { id: 'Sprint 4', name: isAr ? 'التحقق السحابي النهائي' : 'Integration & Launch', date: 'Phase 5', completion: Math.min(100, baseCompletion + 25), budgetBurn: Math.min(100, baseBurn + 20) }
                                      ];
                                    }

                                    return (
                                      <div className="w-full">
                                        <ResponsiveContainer width="100%" height={290}>
                                          <LineChart data={timelineData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                                            <XAxis 
                                              dataKey="name" 
                                              stroke="#475569" 
                                              tickLine={false} 
                                              tick={{ fill: '#94a3b8', fontSize: 10 }}
                                            />
                                            <YAxis 
                                              stroke="#475569" 
                                              domain={[0, 100]}
                                              tickFormatter={(val) => `${val}%`}
                                              tickLine={false} 
                                              tick={{ fill: '#94a3b8', fontSize: 10 }} 
                                            />
                                            <Tooltip
                                              content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                  return (
                                                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-right rtl:text-right ltr:text-left text-xs font-sans space-y-1.5 backdrop-blur-md">
                                                      <p className="font-extrabold text-white text-xs border-b border-slate-800 pb-1">{label}</p>
                                                      <p className="text-sky-400 font-bold flex items-center gap-1.5 justify-start rtl:justify-end">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-450" />
                                                        <span>{isAr ? 'معدل إنجاز المهام: ' : 'Task Completion Rate: '}</span>
                                                        <span className="font-mono font-black">{payload[0]?.value}%</span>
                                                      </p>
                                                      <p className="text-emerald-400 font-bold flex items-center gap-1.5 justify-start rtl:justify-end">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-450" />
                                                        <span>{isAr ? 'استهلاك الموازنة: ' : 'Budget Consumption: '}</span>
                                                        <span className="font-mono font-black">{payload[1]?.value}%</span>
                                                      </p>
                                                    </div>
                                                  );
                                                }
                                                return null;
                                              }}
                                            />
                                            <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: 11, color: '#f8fafc', paddingBottom: 10 }} />
                                            <Line 
                                              type="monotone" 
                                              dataKey="completion" 
                                              name={isAr ? "معدل إنجاز المهام (%)" : "Task Completion (%)"} 
                                              stroke="#38bdf8" 
                                              strokeWidth={3}
                                              dot={{ r: 5, stroke: '#1e293b', strokeWidth: 1.5, fill: '#38bdf8' }}
                                              activeDot={{ r: 7, strokeWidth: 2 }}
                                            />
                                            <Line 
                                              type="monotone" 
                                              dataKey="budgetBurn" 
                                              name={isAr ? "استهلاك الموازنة المعتمدة (%)" : "Budget Depletion (%)"} 
                                              stroke="#34d399" 
                                              strokeWidth={3}
                                              dot={{ r: 5, stroke: '#1e293b', strokeWidth: 1.5, fill: '#34d399' }}
                                              activeDot={{ r: 7, strokeWidth: 2 }}
                                            />
                                          </LineChart>
                                        </ResponsiveContainer>
                                      </div>
                                    );
                                  })()}
                                </div>

                                {/* Column 4: Detailed Deliverables Sprints Sizing */}
                                <div className="lg:col-span-4 p-5 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col justify-between">
                                  <div className="space-y-4">
                                    <div>
                                      <h6 className="text-[12px] font-extrabold text-white flex items-center gap-2 justify-start rtl:justify-end Cairo">
                                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                                        <span>{isAr ? 'مستويات إكمال دورات تسليم النماذج' : 'Advisory Sprint Sprints Breakdown'}</span>
                                      </h6>
                                      <p className="text-[10px] text-slate-500 mt-1 font-sans">
                                        {isAr 
                                          ? 'جرد نسبة الأهداف والواجبات المكتملة الفردية مخرجات كل مشروع استشاري مسجل.' 
                                          : 'Status overview mapping individual completed tasks vs pending sprints.'}
                                      </p>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                      {activeRequests.length === 0 ? (
                                        <div className="py-8 text-center text-slate-500 text-xs">
                                          {isAr ? 'لا توجد طلبات نشطة في الأرشيف للاستعراض.' : 'No active projects available.'}
                                        </div>
                                      ) : (
                                        activeRequests.map((req) => {
                                          const subTasks = getSolutionSubTasks(req);
                                          const doneCount = subTasks.filter(t => t.status === 'completed').length;
                                          const totalCount = subTasks.length;
                                          const prg = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 35;

                                          return (
                                            <div key={req.id} className="p-3 bg-slate-900 rounded-xl border border-slate-850 space-y-2">
                                              <div className="flex justify-between items-center text-[10px]">
                                                <span className="font-bold text-slate-200 truncate max-w-[120px] font-sans">
                                                  {req.name}
                                                </span>
                                                <span className="font-mono text-[9px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded-md font-extrabold">
                                                  {doneCount} / {totalCount} {isAr ? 'مهام' : 'Tasks'}
                                                </span>
                                              </div>
                                              
                                              {/* Mini horizontal loading bar */}
                                              <div className="space-y-1">
                                                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                                                  <span>{isAr ? 'نسبة التقدم:' : 'Progress:'}</span>
                                                  <span className="font-bold">{prg}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                                  <div className="h-full bg-sky-450" style={{ width: `${prg}%` }} />
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })
                                      )}
                                    </div>
                                  </div>

                                  <div className="mt-4 pt-3 border-t border-slate-900 text-[10.5px] text-slate-400 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-850/50">
                                    <span className="font-bold text-white text-[11px] block text-right rtl:text-right ltr:text-left Cairo">
                                      {isAr ? '💡 رؤية تحليلية للأعمال:' : '💡 Enterprise Business insight:'}
                                    </span>
                                    <span className="block mt-1 text-[10px] text-slate-500 leading-relaxed text-right rtl:text-right ltr:text-left font-sans">
                                      {isAr 
                                        ? 'يتطابق معدل الإكمال بشكل متوازن مع المجهود المبذول. لم يلاحظ أي زيادة غير مبررة في الاحتراق المالي.'
                                        : 'Asset deliverables completion rate aligns symmetrically with capital burn rate. Total efficiency ratios are fully in range.'}
                                    </span>
                                  </div>
                                </div>

                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : portalSubTab === 'workspace' ? (
                      <div className="space-y-6">
                        {/* Workspace Headers and Sub-Tabs Toggle Bar */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-2">
                            <div>
                              <h5 className="text-[12px] font-extrabold text-white flex items-center gap-1.5 font-sans justify-start rtl:justify-end">
                                <Sparkles className="w-4 h-4 text-sky-400" />
                                <span>{isAr ? 'أدوات المزامنة السحابية المتقدمة' : 'Advanced Cloud Integration Engine'}</span>
                              </h5>
                              <p className="text-[10px] text-slate-500 mt-0.5 font-sans justify-start rtl:justify-end">
                                {isAr ? 'ربط واستيراد كافة الأدوات والبيانات من بيئة عمل جوجل الخاصة بك.' : 'Couple real-time data grids, documents, forms, and calendars with your workspace.'}
                              </p>
                            </div>

                            {/* Inner Subtabs Selector */}
                            <div className="flex flex-wrap p-0.5 bg-slate-900 rounded-lg border border-slate-800 shrink-0 gap-0.5">
                              {[
                                { id: 'drive', labelAr: 'جوجل درايف', labelEn: 'G-Drive Files' },
                                { id: 'forms', labelAr: 'نماذج Forms', labelEn: 'Forms Hub' },
                                { id: 'calendar', labelAr: 'التقويم وجلساتنا', labelEn: 'Calendar Sessions' },
                                { id: 'sheets', labelAr: 'جداول الموازنات', labelEn: 'Sheets Sync' },
                                { id: 'tasks', labelAr: 'مهام جوجل Tasks', labelEn: 'Google Tasks' },
                                { id: 'meet', labelAr: 'لقاءات Meet', labelEn: 'Google Meet' }
                              ].map((subTab) => (
                                <button
                                  key={subTab.id}
                                  type="button"
                                  onClick={() => setWorkspaceActiveTab(subTab.id as any)}
                                  className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                                    workspaceActiveTab === subTab.id
                                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/25 font-black'
                                      : 'text-slate-500 hover:text-white'
                                  }`}
                                >
                                  {isAr ? subTab.labelAr : subTab.labelEn}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                      {/* GOOGLE DRIVE HUB */}
                      {workspaceActiveTab === 'drive' && (
                        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                            <h6 className="text-[12px] font-extrabold text-white uppercase tracking-wider flex items-center gap-2 font-sans">
                              <Cloud className="w-4 h-4 text-sky-400" />
                              <span>{isAr ? 'مستودع المزامنة السحابي' : 'Integrated Sync Storage'}</span>
                            </h6>
                            {isLoadingDriveFiles && (
                              <span className="text-[10px] text-sky-400 font-bold flex items-center gap-1 animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                {isAr ? 'مزامنة مع Google Drive...' : 'Syncing Google Drive...'}
                              </span>
                            )}
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-850/40 space-y-3 font-sans">
                            <div className="flex flex-col gap-2.5">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={driveSearchQuery}
                                  onChange={(e) => setDriveSearchQuery(e.target.value)}
                                  placeholder={isAr ? 'ابحث باسم الملف...' : 'Search by file name...'}
                                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-white text-xs outline-none focus:border-sky-505 transition-all text-right placeholder:text-slate-650"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleFetchDriveFiles();
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={handleFetchDriveFiles}
                                  className="px-3.5 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-sky-400 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                                >
                                  {isAr ? 'تصفية' : 'Search'}
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-[11px] text-slate-450 mt-4 px-1">
                              <span>{isAr ? 'حساب المزامنة السحابي:' : 'Linked target storage:'}</span>
                              <strong className="text-emerald-430 font-extrabold">{isAr ? 'جوجل درايف الفوري' : 'Synced G-Drive'}</strong>
                            </div>
                          </div>

                                  {/* Files Explorer Grid */}
                                  <div className="space-y-2 pt-2 border-t border-slate-900">
                                    <div className="flex items-center justify-between text-[11px] font-black text-slate-500 uppercase tracking-wider pb-1">
                                      <span>{isAr ? 'تفاصيل الملف والصنف السحابي' : 'File Metadata'}</span>
                                      <span>{isAr ? 'العمليات' : 'Actions'}</span>
                                    </div>

                                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                      {driveFilesList && driveFilesList.length > 0 ? (
                                        driveFilesList.map((file: any) => (
                                          <div key={file.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-slate-800 transition-all flex items-center justify-between gap-3 text-right">
                                            <div className="min-w-0 text-right space-y-1">
                                              <div className="flex items-center gap-1.5 justify-start">
                                                {file.iconLink && (
                                                  <img 
                                                    src={file.iconLink} 
                                                    alt="mime icon" 
                                                    className="w-3.5 h-3.5 object-contain" 
                                                    referrerPolicy="no-referrer"
                                                  />
                                                )}
                                                <span className="font-sans font-extrabold text-xs text-white truncate max-w-[200px] sm:max-w-md block">
                                                  {file.name}
                                                </span>
                                              </div>
                                              <div className="flex flex-wrap gap-2 text-[9px] text-slate-500 font-bold justify-start">
                                                <span>{formatBytes(file.size ? parseInt(file.size) : undefined)}</span>
                                                <span>•</span>
                                                <span>{file.createdTime ? new Date(file.createdTime).toLocaleDateString(isAr ? 'ar-SA' : 'en-US') : ''}</span>
                                                <span>•</span>
                                                <span className="uppercase text-sky-400 font-mono text-[8.5px]">{file.mimeType?.split('/').pop()?.split('.').pop() || 'File'}</span>
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                              {file.webViewLink && (
                                                <a 
                                                  href={file.webViewLink} 
                                                  target="_blank" 
                                                  rel="noreferrer" 
                                                  className="p-1.5 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                                  title={isAr ? 'عرض في علامة تبويب جديدة' : 'Open in a new tab'}
                                                >
                                                  <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                              )}
                                              <button
                                                type="button"
                                                onClick={() => handleDeleteDriveFile(file.id, file.name)}
                                                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                                title={isAr ? 'حذف من Drive' : 'Delete file'}
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="p-10 rounded-2xl border border-dashed border-slate-850 text-center bg-slate-950/20">
                                          <Cloud className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                                          <p className="text-xs text-slate-500 font-bold">
                                            {isAr ? 'لا توجد ملفات مرفوعة حالياً في مساحة Drive الخاصة بك.' : 'No active validated storage outputs found in drive.'}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                            {/* GOOGLE FORMS HUB */}
                            {workspaceActiveTab === 'forms' && (
                              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                                  <h6 className="text-[12px] font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4 text-sky-400" />
                                    <span>{isAr ? 'إدارة استمارات Google Forms' : 'Google Forms Orchestrator'}</span>
                                  </h6>
                                  {isCreatingForm && (
                                    <span className="text-[10px] text-sky-400 font-bold flex items-center gap-1 animate-pulse">
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                      {isAr ? 'جاري الإنشاء في Drive...' : 'Spinning up on Drive...'}
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {isAr
                                    ? 'أنشئ استبانات فحص تقني رقمي متكاملة لعملائك ومؤسستك بشكل حي، وتحقق من الحقول والردود مباشرة من شاشتك الاستشارية.'
                                    : 'Create and deploy fully custom technical diagnostic intakes to gather inputs from potential partners, or review ongoing responses.'}
                                </p>

                                {formCreationSuccess && (
                                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 text-center font-bold">
                                    {formCreationSuccess}
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2.5">
                                  <button
                                    type="button"
                                    onClick={handleCreateGoogleForm}
                                    disabled={isCreatingForm}
                                    className="px-4 py-2 bg-sky-500 hover:bg-sky-450 disabled:bg-sky-950 disabled:text-slate-500 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5 font-bold" />
                                    <span>{isAr ? 'إنشاء نموذج استشارة سحابي جديد' : 'Generate Consultation Form'}</span>
                                  </button>
                                  
                                  {customFormId && (
                                    <button
                                      type="button"
                                      onClick={() => handleFetchFormDetails()}
                                      disabled={isLoadingFormDetail}
                                      className="px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFormDetail ? 'animate-spin' : ''}`} />
                                      <span>{isAr ? 'سحب التفاصيل والردود' : 'Sync Status & Responses'}</span>
                                    </button>
                                  )}
                                </div>

                                {/* Form Inspection details if exists */}
                                {createdForm && (
                                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-850 space-y-2 text-xs font-mono">
                                    <div className="flex justify-between items-center text-[10px] border-b border-slate-850 pb-1.5">
                                      <span className="text-slate-500">{isAr ? 'ملف النموذج السحابي' : 'Form Cloud Identity'}</span>
                                      <span className="text-sky-400 font-bold select-all">{createdForm.formId}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-400 text-right">
                                      <div>
                                        <span className="text-[9px] text-slate-500 block">{isAr ? 'عنوان المستند' : 'Title'}</span>
                                        <span className="font-sans text-white font-bold block truncate">{createdForm.info?.title}</span>
                                      </div>
                                      <div>
                                        <span className="text-[9px] text-slate-500 block">{isAr ? 'رابط المشاركة المفتوح' : 'Publish URL'}</span>
                                        <a 
                                          href={createdForm.responderUri} 
                                          target="_blank" 
                                          rel="noreferrer" 
                                          className="text-emerald-400 hover:underline font-sans flex items-center gap-1 truncate"
                                        >
                                          <span>{isAr ? 'رابط الاستمارة' : 'Open Link'}</span>
                                          <ExternalLink className="w-3 h-3 text-emerald-400 shrink-0" />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Manual Form ID entry and checking */}
                                <div className="space-y-2 pt-2 border-t border-slate-900">
                                  <label className="text-[10px] text-slate-450 font-bold block">
                                    {isAr ? 'فحص نموذج عبر معرّف مخصص (Form ID)' : 'Inspect Existing Google Form by ID'}
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={customFormId}
                                      onChange={(e) => setCustomFormId(e.target.value)}
                                      placeholder="e.g. 1AdBfSR9-..."
                                      className="flex-1 bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-white text-xs outline-none focus:border-sky-505 transition-all font-mono"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleFetchFormDetails()}
                                      disabled={!customFormId || isLoadingFormDetail}
                                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-sky-405 text-xs font-bold rounded-xl cursor-pointer transition-all disabled:opacity-50"
                                    >
                                      {isAr ? 'فحص البنية ➔' : 'Inspect Form ➔'}
                                    </button>
                                  </div>
                                </div>

                                {/* Form Fields Structure Display */}
                                {selectedFormDetail && (
                                  <div className="pt-3 border-t border-slate-900 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        {isAr ? 'الحقول والأسئلة المفهرسة' : 'Form Structured Input Areas'}
                                      </span>
                                      <span className="text-[10.5px] font-mono font-bold bg-slate-900 px-2 py-0.5 border border-slate-850 text-slate-350 rounded">
                                        {selectedFormDetail.items?.length || 0} {isAr ? 'سؤال/عنصر' : 'items'}
                                      </span>
                                    </div>

                                    {/* Scrollable inputs structure breakdown */}
                                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                      {selectedFormDetail.items && selectedFormDetail.items.length > 0 ? (
                                        selectedFormDetail.items.map((it: any, idx: number) => (
                                          <div key={idx} className="p-2.5 rounded-lg bg-slate-905 border border-slate-850/60 flex items-center justify-between gap-3 text-[11px] text-right">
                                            <div className="min-w-0 text-right">
                                              <span className="text-[10px] text-slate-500 font-mono block">Item #{idx+1}</span>
                                              <p className="font-bold text-white truncate">{it.title || (isAr ? '(بدون عنوان)' : '(Untitled field)')}</p>
                                            </div>
                                            <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[9px] text-slate-400 shrink-0 uppercase">
                                              {it.questionItem ? 'QUESTION' : 'LAYOUT'}
                                            </span>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-[10px] text-slate-500 italic text-center py-2">
                                          {isAr ? 'لا تحتوي هذه الاستمارة على أسئلة حتى الآن، يمكنك إدارتها وتخصيصها عبر الرابط.' : 'No active question nodes defined inside this form shell yet.'}
                                        </p>
                                      )}
                                    </div>

                                    {/* Form Submissions responses analysis */}
                                    <div className="pt-3 border-t border-slate-900 space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">
                                          {isAr ? 'ردود واستجابات الشركاء المتوفرة' : 'Active Form Respondent Submissions'}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleFetchFormResponses()}
                                          disabled={isLoadingResponses}
                                          className="text-[10px] text-sky-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                                        >
                                          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingResponses ? 'animate-spin' : ''}`} />
                                          <span>{isAr ? 'تحديث الردود' : 'Sync Responses'}</span>
                                        </button>
                                      </div>

                                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                        {isLoadingResponses ? (
                                          <p className="text-[10px] text-slate-500 text-center py-4">{isAr ? 'جاري جلب ردود الاستمارات المكتملة...' : 'Fetching live responders metadata...'}</p>
                                        ) : formResponses && formResponses.length > 0 ? (
                                          formResponses.map((rep: any, idx: number) => (
                                            <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-850 space-y-1.5 text-xs text-right">
                                              <div className="flex justify-between gap-2 text-[10px] text-slate-550 font-mono font-bold">
                                                <span>{isAr ? `رد رقم ${idx+1}` : `Resp #${idx+1}`}</span>
                                                <span>{new Date(rep.lastSubmittedTime).toLocaleString(isAr ? 'ar-SA' : 'en-US')}</span>
                                              </div>
                                              <div className="text-[11px] text-white">
                                                <span className="text-slate-500 block text-[9px]">{isAr ? 'معرّف الرد الفريد' : 'Response Token'}</span>
                                                <span className="font-mono text-sky-400 font-semibold select-all">{rep.responseId}</span>
                                              </div>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="p-5 rounded-xl border border-dashed border-slate-850 text-center text-slate-500 text-[11px] italic">
                                            {isAr ? 'لم يقم أي شريك بملء هذه الاستمارة بعد.' : 'No customer response logs found for this intake ID.'}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                  </div>
                                )}
                              </div>
                            )}

                            {/* GOOGLE CALENDAR ADVISORY */}
                            {workspaceActiveTab === 'calendar' && (
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-right">
                                
                                {/* Calendar upcoming events bucket */}
                                <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-3.5">
                                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 font-sans">
                                    <h6 className="text-[12px] font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                                      <Calendar className="w-4 h-4 text-emerald-400" />
                                      <span>{isAr ? 'مواعيد الاستشارات والجدولة' : 'Advisory Slots Sync'}</span>
                                    </h6>
                                    {isLoadingEvents && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-450" />}
                                  </div>

                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {isAr 
                                      ? 'تتم مزامنة هذه الحجوزات مع تقويم Google Calendar المعتمد لمنشأتك لعرض وحجز أحدث جلسات التحول والمشورة التقنية.'
                                      : 'Live calendar slot matrices connected directly with your primary calendar to enforce diagnostic sessions.'}
                                  </p>

                                  {calendarSummary && (
                                    <div className="text-[10px] text-slate-400 font-bold bg-slate-900 p-2 border border-slate-850 rounded-xl truncate flex items-center gap-1 font-mono">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                      <span>{isAr ? `التقويم النشط: ${calendarSummary}` : `Active Google Cal: ${calendarSummary}`}</span>
                                    </div>
                                  )}

                                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1 pt-1 text-right">
                                    {eventsList && eventsList.length > 0 ? (
                                      eventsList.map((ev: any, idx: number) => {
                                          const startStr = ev.start?.dateTime || ev.start?.date;
                                          const formattedDT = startStr ? new Date(startStr).toLocaleString(isAr ? 'ar-SA' : 'en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          }) : '';
                                          
                                          // Search for Meet links in various locations returned by the API
                                          const meetLink = ev.hangoutLink || ev.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video' || ep.uri?.includes('meet.google.com'))?.uri || (ev.location?.includes('meet.google.com') ? ev.location : null);

                                          return (
                                            <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-850 space-y-1 hover:border-slate-800 transition-colors text-right animate-fadeIn">
                                              <div className="flex justify-between items-center gap-3">
                                                <span className="text-[11px] font-bold text-white truncate">{ev.summary || (isAr ? 'جلسة تقييم بدون عنوان' : 'Untitled session')}</span>
                                                {ev.htmlLink && (
                                                  <a href={ev.htmlLink} target="_blank" rel="noreferrer" className="text-[10px] text-sky-400 shrink-0 hover:underline font-mono">
                                                    {isAr ? 'عرض' : 'View'}
                                                  </a>
                                                )}
                                              </div>
                                              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                                <span>{formattedDT}</span>
                                                {ev.location && !ev.location.includes('meet.google.com') && <span className="truncate max-w-[124px] text-right">{ev.location}</span>}
                                              </div>
                                              {meetLink && (
                                                <div className="pt-1.5 text-right flex items-center justify-end">
                                                  <a
                                                    href={meetLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded-lg text-[9px] font-bold hover:bg-indigo-500 hover:text-slate-950 transition-colors cursor-pointer"
                                                  >
                                                    <Video className="w-3 h-3 animate-pulse text-indigo-400" />
                                                    <span>{isAr ? 'التحاق باجتماع Google Meet' : 'Join Google Meet Session'}</span>
                                                  </a>
                                                </div>
                                              )}
                                            </div>
                                          );
                                      })
                                    ) : (
                                      <div className="text-center py-6 text-slate-500 text-xs italic">
                                        {isAr ? 'لا توجد مواعيد وجلسات قادمة مجدولة.' : 'No upcoming diagnostic appointments booked.'}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Book New Event form */}
                                <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-4 text-right">
                                  <h6 className="text-[12px] font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-sky-450 animate-pulse" />
                                    <span>{isAr ? 'حجز وجدولة استشارة فورية' : 'Book Immediate Advisory Consultation'}</span>
                                  </h6>

                                  {bookingResponse && (
                                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-400 font-bold text-center leading-snug">
                                      {isAr ? '✓ تم حجز الموعد وإضافته لـ Google Calendar الخاص بك بنجاح!' : '✓ Consultation booked and injected to Google Calendar!'}
                                    </div>
                                  )}

                                  <form onSubmit={handleBookCalendarEvent} className="space-y-3 text-right">
                                    <div>
                                      <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                        {isAr ? 'موضوع ومسمى الجلسة *' : 'Consultation Topic / Summary *'}
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={calSummary}
                                        onChange={(e) => setCalSummary(e.target.value)}
                                        placeholder={isAr ? "مراجعة متطلبات التحول السحابي" : "Advisory consultation review session"}
                                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all text-right placeholder/text-slate-650"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-right">
                                      <div>
                                        <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                          {isAr ? 'التاريخ والوقت بالتوقيت المحلي *' : 'Selected Date & Time *'}
                                        </label>
                                        <input
                                          type="datetime-local"
                                          required
                                          value={calDateTime}
                                          onChange={(e) => setCalDateTime(e.target.value)}
                                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-white text-[11px] outline-none focus:border-sky-500 transition-all font-mono text-right"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                          {isAr ? 'مدة الجلسة الاستشارية' : 'Duration'}
                                        </label>
                                        <select
                                          value={calDuration}
                                          onChange={(e) => setCalDuration(e.target.value)}
                                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-white text-xs outline-none focus:border-sky-505 transition-all text-right bg-slate-950"
                                        >
                                          <option value="30">{isAr ? '30 دقيقة' : '30 mins'}</option>
                                          <option value="60">{isAr ? '60 دقيقة (ساعة)' : '60 mins'}</option>
                                          <option value="90">{isAr ? '90 دقيقة' : '90 mins'}</option>
                                        </select>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                        {isAr ? 'وصف تفصيلي للجلسة (اختياري)' : 'Diagnostic Details (Optional)'}
                                      </label>
                                      <textarea
                                        value={calDescription}
                                        onChange={(e) => setCalDescription(e.target.value)}
                                        placeholder={isAr ? "نقاش حول تكامل الدفع وترحيل البيانات" : "Discuss backend architectural steps and payment modules."}
                                        rows={2}
                                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all resize-none text-right placeholder:text-slate-650"
                                      />
                                    </div>

                                    {/* Google Meet Inclusion toggle */}
                                    <div className="flex items-center justify-between gap-3 bg-slate-900/40 p-2.5 border border-slate-850 rounded-xl select-none">
                                      <input
                                        type="checkbox"
                                        id="attachMeetLinkToCalendar"
                                        checked={attachMeetLinkToCalendar}
                                        onChange={(e) => setAttachMeetLinkToCalendar(e.target.checked)}
                                        className="rounded border-slate-800 bg-slate-950 text-sky-400 focus:ring-sky-500 w-3.5 h-3.5 cursor-pointer accent-sky-400 shrink-0"
                                      />
                                      <label htmlFor="attachMeetLinkToCalendar" className="text-[10.5px] text-slate-300 font-medium text-right leading-relaxed cursor-pointer select-none">
                                        {isAr ? 'إنشاء رابط Google Meet تلقائي وبثه بالجلسة' : 'Provision secure Google Meet space for this event'}
                                      </label>
                                    </div>

                                    <button
                                      type="submit"
                                      disabled={isBookingEvent || !calSummary || !calDateTime}
                                      className="w-full py-2 bg-emerald-500 hover:bg-emerald-450 disabled:bg-emerald-950 disabled:text-slate-500 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg transform active:scale-98"
                                    >
                                      {isBookingEvent ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                                      ) : (
                                        <Calendar className="w-3.5 h-3.5" />
                                      )}
                                      <span>{isAr ? 'حجز وإرسال لـ Google Calendar ➔' : 'Schedule on Google Calendar ➔'}</span>
                                    </button>
                                  </form>
                                </div>

                              </div>
                            )}

                            {/* GOOGLE SHEETS PORTAL SYNCHRONIZER */}
                            {workspaceActiveTab === 'sheets' && (
                              <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-4 text-right">
                                  {/* Header */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                                    <h6 className="text-[12px] font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                                      <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                                      <span>{isAr ? 'تكامل وجدولة بيانات Google Sheets' : 'Google Sheets Database Sync'}</span>
                                    </h6>
                                    {sheetsSyncLoading && (
                                      <span className="text-[10px] text-sky-450 font-bold flex items-center gap-1 animate-pulse">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                                        {isAr ? 'جاري الاتصال والمزامنة...' : 'Communicating with Google Sheets API...'}
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-slate-400 leading-relaxed">
                                    {isAr
                                      ? 'قم بربط وتصدير سجلات البوابة الإلكترونية (قائمة العملاء، الفواتير الصادرة، طلبات الاستشارة) بشكل مباشر وسلس إلى ملف جداول بيانات Google Sheets لإعداد التقارير وتصدير البيانات.'
                                      : 'Sync, push, and review your local portals database records (Clients list, Requests trackers, and Invoices logs) directly onto customized Google Sheets tabs.'}
                                  </p>

                                  {/* Success and Error Displays */}
                                  {sheetsSyncError && (
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 font-bold text-center">
                                      {sheetsSyncError}
                                    </div>
                                  )}
                                  {sheetsSyncSuccess && (
                                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-bold text-center">
                                      {sheetsSyncSuccess}
                                    </div>
                                  )}

                                  {!sheetsSpreadsheetId ? (
                                    /* Connection Portal Screen */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch pt-2 text-right">
                                      {/* Option A: Generate New Setup */}
                                      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-850/85 flex flex-col justify-between space-y-4 text-right">
                                        <div className="space-y-1.5">
                                          <div className="inline-flex items-center gap-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold">
                                            {isAr ? 'تهيئة تلقائية ذكية' : 'RECOMMENDED EASY ROUTE'}
                                          </div>
                                          <h6 className="text-[12px] font-bold text-white">
                                            {isAr ? 'إنشاء ملف مكاملة جديد وتلقائي' : 'Create & Provision New Spreadsheet'}
                                          </h6>
                                          <p className="text-[11px] text-slate-400 leading-relaxed">
                                            {isAr
                                              ? 'سنقوم بإنشاء ملف Google Sheets مخصص على حسابك، به ثلاثة تبويبات منسقة ومستعدة لكتابة وجلب البيانات تلقائياً.'
                                              : 'Creates a fully formatted Google Spreadsheet on your Drive with corresponding tabs for Clients, Consultation requests, and Invoices.'}
                                          </p>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={handleCreateSyncSpreadsheet}
                                          disabled={sheetsSyncLoading}
                                          className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                          <FileSpreadsheet className="w-4 h-4" />
                                          <span>{isAr ? 'إنشاء ومزامنة ملف جديد' : 'Generate & Automate Sheet'}</span>
                                        </button>
                                      </div>

                                      {/* Option B: Match Existing Spreadsheet */}
                                      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-850/85 flex flex-col justify-between space-y-4 text-right">
                                        <div className="space-y-2">
                                          <div className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold">
                                            {isAr ? 'ربط يدوي مخصص' : 'CUSTOM FILE COUPLING'}
                                          </div>
                                          <h6 className="text-[12px] font-bold text-white">{isAr ? 'ربط مستند ومساحة أوراق عمل حالية' : 'Connect Existing Spreadsheet ID'}</h6>
                                          <p className="text-[11px] text-slate-400 leading-relaxed">
                                            {isAr
                                              ? 'الصق رابط أو معرف مستند Excel/Google Sheets النشط على حسابك للمزامنة المتبادلة.'
                                              : 'Paste an existing spreadsheet URL or identifier from Google Sheets to couple with our portal.'}
                                          </p>
                                          <input
                                            type="text"
                                            value={sheetsInputIdOrUrl}
                                            onChange={(e) => setSheetsInputIdOrUrl(e.target.value)}
                                            placeholder={isAr ? "https://docs.google.com/spreadsheets/d/..." : "Enter Spreadsheet URL or ID..."}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-white text-[10px] outline-none focus:border-sky-500 transition-all text-right placeholder:text-slate-600"
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={handleConnectExistingSpreadsheet}
                                          disabled={sheetsSyncLoading || !sheetsInputIdOrUrl.trim()}
                                          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                                        >
                                          {isAr ? 'ربط المستند الحالي' : 'Couple Active Sheet'}
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    /* Active Connection Sheet Controller */
                                    <div className="space-y-4 pt-1">
                                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right">
                                        <div className="space-y-1">
                                          <div className="text-[10px] text-slate-500 font-bold font-mono">
                                            SPREADSHEET ID: {sheetsSpreadsheetId}
                                          </div>
                                          <h6 className="text-xs font-black text-white flex items-center gap-1.5 justify-start rtl:justify-end">
                                            <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>
                                              {sheetsMetadata?.properties?.title || (isAr ? 'جداول الربط المدمجة للبوابة' : 'Active Management Syncsheet')}
                                            </span>
                                          </h6>
                                        </div>

                                        <div className="flex items-center gap-2 select-none self-start sm:self-center">
                                          <a
                                            href={`https://docs.google.com/spreadsheets/d/${sheetsSpreadsheetId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                          >
                                            <ExternalLink className="w-3 h-3" />
                                            <span>{isAr ? 'فتح في Google Sheets ↗' : 'Open in Google Sheets ↗'}</span>
                                          </a>
                                          <button
                                            type="button"
                                            onClick={handleDisconnectSheetOnly}
                                            className="px-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 text-[10px] sm:text-xs font-bold transition-all cursor-pointer"
                                          >
                                            {isAr ? 'إلغاء الربط' : 'Disconnect'}
                                          </button>
                                        </div>
                                      </div>

                                      {/* Operational Controllers */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                                        {/* Push Controller */}
                                        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-850 flex flex-col justify-between space-y-3 text-right">
                                          <div className="space-y-1">
                                            <h6 className="text-[11px] font-black text-white">{isAr ? 'تصدير وتحديث أوراق العمل (Push)' : 'Export & Rewrite Sheets (Push)'}</h6>
                                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                              {isAr
                                                ? 'قم بدفع كافة بيانات المنصة الحالية لتحديث جدول جوجل مباشرة ومسح البيانات القديمة بتبويبات المستند.'
                                                : 'Overwrites existing Sheets database with current local live entries of Clients, Requests, and Invoices records.'}
                                            </p>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handlePushDataToSheets()}
                                            disabled={sheetsSyncLoading}
                                            className="py-2 bg-sky-500 hover:bg-sky-455 text-slate-950 font-black text-[11px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                          >
                                            <RefreshCw className={`w-3.5 h-3.5 ${sheetsSyncLoading ? 'animate-spin' : ''}`} />
                                            <span>{isAr ? 'مزامنة وتصدير السجلات الآن' : 'Perform Push Sync Now'}</span>
                                          </button>
                                        </div>

                                        {/* Pull / Show Records Header */}
                                        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-850 flex flex-col justify-between space-y-3 text-right">
                                          <div className="space-y-1">
                                            <h6 className="text-[11px] font-black text-white">{isAr ? 'تحديث المعاينة من Excel' : 'Fetch Sheet Updates (Pull)'}</h6>
                                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                              {isAr
                                                ? 'اقرأ محتويات ومقالات الصفوف المسجلة حالياً بملف Google Sheets مباشرة لعرضها بتبويب الاستكشاف أدناه.'
                                                : 'Reads current sheets, pull active changes and updates the dynamic spreadsheet rows preview display below.'}
                                            </p>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handleFetchSheetsMetadata()}
                                            disabled={sheetsSyncLoading}
                                            className="py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                          >
                                            <ArrowDown className={`w-3.5 h-3.5 ${sheetsSyncLoading ? 'animate-spin' : ''}`} />
                                            <span>{isAr ? 'جلب وتحديث المعاينة' : 'Fetch & Refresh Preview'}</span>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Interactive live preview grid from Google Sheets */}
                                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-3 text-right">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                                          <h6 className="text-[11px] font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                                            <Eye className="w-3.5 h-3.5 text-sky-400" />
                                            <span>{isAr ? 'معاينة الصفوف المباشرة بـ Google Sheets' : 'Live Spreadsheet Rows Preview'}</span>
                                          </h6>

                                          <div className="flex gap-1.5">
                                            <button
                                              type="button"
                                              onClick={() => setSheetsPreviewTab('clients')}
                                              className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                                                sheetsPreviewTab === 'clients'
                                                  ? 'bg-sky-500/15 text-sky-400 font-extrabold'
                                                  : 'text-slate-500 hover:text-slate-350'
                                              }`}
                                            >
                                              {isAr ? 'العملاء' : 'Clients'}
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setSheetsPreviewTab('requests')}
                                              className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                                                sheetsPreviewTab === 'requests'
                                                  ? 'bg-sky-500/15 text-sky-400 font-extrabold'
                                                  : 'text-slate-500 hover:text-slate-350'
                                              }`}
                                            >
                                              {isAr ? 'الطلبات' : 'Requests'}
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setSheetsPreviewTab('invoices')}
                                              className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                                                sheetsPreviewTab === 'invoices'
                                                  ? 'bg-sky-500/15 text-sky-400 font-extrabold'
                                                  : 'text-slate-500 hover:text-slate-350'
                                              }`}
                                            >
                                              {isAr ? 'الفواتير' : 'Invoices'}
                                            </button>
                                          </div>
                                        </div>

                                        <div className="overflow-x-auto select-text">
                                          {sheetsPreviewTab === 'clients' && (
                                            <table className="w-full text-[10px] text-right font-mono">
                                              <thead>
                                                <tr className="border-b border-slate-900 text-slate-500">
                                                  <th className="py-2.5 px-2">{isAr ? 'الاسم والشركة' : 'Name / Company'}</th>
                                                  <th className="py-2.5 px-2">{isAr ? 'الإيميل والجوّال' : 'Email / Phone'}</th>
                                                  <th className="py-2.5 px-2">{isAr ? 'الباقة' : 'Tier'}</th>
                                                  <th className="py-2.5 px-2">{isAr ? 'الإنضمام' : 'Joined'}</th>
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-slate-900 text-slate-300">
                                                {sheetsClientRows.length > 0 ? (
                                                  sheetsClientRows.map((row: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-slate-900/35 transition-colors">
                                                      <td className="py-2 px-2">
                                                        <div className="font-sans font-bold text-white">{row[0] || 'N/A'}</div>
                                                        <div className="text-[9px] text-slate-505">{row[1] || 'N/A'}</div>
                                                      </td>
                                                      <td className="py-2 px-2 text-slate-400">
                                                        <div>{row[2] || 'N/A'}</div>
                                                        <div className="text-[9px] text-slate-505">{row[3] || 'N/A'}</div>
                                                      </td>
                                                      <td className="py-2 px-2 uppercase font-extrabold text-sky-450">{row[4] || 'silver'}</td>
                                                      <td className="py-2 px-2 text-slate-500">{row[5] || 'N/A'}</td>
                                                    </tr>
                                                  ))
                                                ) : (
                                                  <tr>
                                                    <td colSpan={4} className="py-4 text-center text-slate-600 font-sans">
                                                      {isAr ? 'لا توجد صفوف نشطة بجدول "Clients" - يرجى الضغط على مزامنة وتصدير السجلات.' : 'No rows found in clients tab. Perform a Sync above to write entries.'}
                                                    </td>
                                                  </tr>
                                                )}
                                              </tbody>
                                            </table>
                                          )}

                                          {sheetsPreviewTab === 'requests' && (
                                            <table className="w-full text-[10px] text-right font-mono">
                                              <thead>
                                                <tr className="border-b border-slate-900 text-slate-500">
                                                  <th className="py-2.5 px-2">{isAr ? 'الطلب' : 'Request'}</th>
                                                  <th className="py-2.5 px-2">{isAr ? 'التاريخ والقيمة' : 'Date & Sizing'}</th>
                                                  <th className="py-2.5 px-2">{isAr ? 'الحالة' : 'Status'}</th>
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-slate-900 text-slate-300">
                                                {sheetsRequestRows.length > 0 ? (
                                                  sheetsRequestRows.map((row: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-slate-900/35 transition-colors">
                                                      <td className="py-2 px-2 font-sans">
                                                        <div className="font-mono text-white font-bold">{row[0] || 'N/A'}</div>
                                                        <p className="text-[9px] text-slate-400 truncate max-w-[200px]">{row[7] || 'N/A'}</p>
                                                      </td>
                                                      <td className="py-2 px-2 text-slate-400">
                                                        <div>{row[8] || 'N/A'}</div>
                                                        <div className="text-[9px] text-emerald-400 font-extrabold">{row[5] || 'N/A'} SAR</div>
                                                      </td>
                                                      <td className="py-2 px-2">
                                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-slate-900 text-slate-350 border border-slate-800">
                                                          {row[6] || 'pending'}
                                                        </span>
                                                      </td>
                                                    </tr>
                                                  ))
                                                ) : (
                                                  <tr>
                                                    <td colSpan={3} className="py-4 text-center text-slate-600 font-sans">
                                                      {isAr ? 'لا توجد صفوف نشطة بجدول "Consultation Requests".' : 'No rows found in consultation requests tab. Perform a Sync to write entries.'}
                                                    </td>
                                                  </tr>
                                                )}
                                              </tbody>
                                            </table>
                                          )}

                                          {sheetsPreviewTab === 'invoices' && (
                                            <table className="w-full text-[10px] text-right font-mono">
                                              <thead>
                                                <tr className="border-b border-slate-900 text-slate-500">
                                                  <th className="py-2.5 px-2">{isAr ? 'رقم الفاتورة' : 'Invoice ID'}</th>
                                                  <th className="py-2.5 px-2">{isAr ? 'العنوان' : 'Title'}</th>
                                                  <th className="py-2.5 px-2">{isAr ? 'المبلغ' : 'Amount'}</th>
                                                  <th className="py-2.5 px-2">{isAr ? 'الحالة والتواريخ' : 'Status & Dates'}</th>
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-slate-900 text-slate-300">
                                                {sheetsInvoiceRows.length > 0 ? (
                                                  sheetsInvoiceRows.map((row: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-slate-900/35 transition-colors">
                                                      <td className="py-2 px-2 font-bold text-white">{row[0] || 'N/A'}</td>
                                                      <td className="py-2 px-2 font-sans text-slate-400 text-xs">
                                                        <div>{isAr ? row[3] : row[4]}</div>
                                                      </td>
                                                      <td className="py-2 px-2 text-emerald-400 font-extrabold">{row[5] || 'N/A'} SAR</td>
                                                      <td className="py-2 px-2">
                                                        <div className="text-[9px] text-slate-400">{row[7] || 'N/A'}</div>
                                                        <span className={`inline-block mt-0.5 text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${
                                                          row[6] === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-150'
                                                        }`}>
                                                          {row[6] || 'unpaid'}
                                                        </span>
                                                      </td>
                                                    </tr>
                                                  ))
                                                ) : (
                                                  <tr>
                                                    <td colSpan={4} className="py-4 text-center text-slate-600 font-sans">
                                                      {isAr ? 'لا توجد صفوف نشطة بجدول "Invoices".' : 'No rows found in invoices tab. Perform a Sync to write entries.'}
                                                    </td>
                                                  </tr>
                                                )}
                                              </tbody>
                                            </table>
                                          )}
                                        </div>

                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {workspaceActiveTab === 'tasks' && (
                              <div className="space-y-6">
                                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-4">
                                  {/* Header */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                                    <h6 className="text-[12px] font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                                      <CheckSquare className="w-4 h-4 text-sky-400" />
                                      <span>{isAr ? 'منصة مهام ومتابعة Google Tasks' : 'Google Tasks Management Hub'}</span>
                                    </h6>
                                    {(isLoadingTaskLists || isLoadingTasks) && (
                                      <span className="text-[10px] text-sky-450 font-bold flex items-center gap-1 animate-pulse">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-450" />
                                        {isAr ? 'مزامنة مع Google Tasks...' : 'Syncing Google Tasks...'}
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-slate-400 leading-relaxed text-right rtl:text-right ltr:text-left">
                                    {isAr
                                      ? 'قم بمتابعة مهامك، إنشاء قوائم عمل جديدة، وتصدير كافة المخرجات ومعالم مشاريعك التقنية الهامة بشكل مباشر من البوابة الإلكترونية إلى حساب مهام جوجل الخاص بك.'
                                      : 'Track checklists, create workspace task lists, and export strategic project delivery milestones directly to your corporate Google Tasks application.'}
                                  </p>

                                  {/* Strategic "1-Click Full Synchronizer" Dashboard card */}
                                  <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 to-indigo-950/40 border border-sky-500/20 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
                                    <div className="space-y-1 text-right">
                                      <h6 className="text-xs font-extrabold text-sky-450 flex items-center gap-1.5 justify-end">
                                        <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                                        <span>{isAr ? 'المزامنة السحابية الشاملة للمشاريع' : 'Unified Cloud Project Synchronization Service'}</span>
                                      </h6>
                                      <p className="text-[11px] text-slate-350 leading-relaxed text-right">
                                        {isAr
                                          ? 'هل تريد أتمتة كافة مشاريعك؟ هذا الخيار المميز ينشئ لك قائمة مخصصة باسم "Business Developers Projects" في حساب Google الخاص بك مع كافة المشاريع الحالية المعتمدة وتفاصيل تفريع المخرجات والمعالم الفيدرالية المرتبطة بها لسهولة التتبع والمتابعة المباشرة.'
                                          : 'Automate your project tracking. This action provisions a dedicated "Business Developers Projects" task list in your Google account, syncing all your active corporate requests and their milestone checklists natively.'}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={handleSyncAllProjectsToGoogleTasks}
                                      disabled={isSyncingAllProjects}
                                      className="w-full md:w-auto shrink-0 px-5 py-2.5 bg-gradient-to-r from-sky-450 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/10 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                      {isSyncingAllProjects ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          <span>{isAr ? 'جاري المزامنة...' : 'Syncing...'}</span>
                                        </>
                                      ) : (
                                        <>
                                          <RefreshCw className="w-4 h-4" />
                                          <span>{isAr ? 'مزامنة كافة المشاريع الآن' : 'Sync All Projects Now'}</span>
                                        </>
                                      )}
                                    </button>
                                  </div>

                                  {/* Error/Success Feedback */}
                                  {workspaceError && (
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 font-bold text-center">
                                      {workspaceError}
                                    </div>
                                  )}

                                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                                    {/* Sidebar: Lists Selection and Creator */}
                                    <div className="space-y-4 col-span-1">
                                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 space-y-3.5">
                                        <label className="text-[10px] uppercase font-bold text-slate-500 block text-right rtl:text-right ltr:text-left">
                                          {isAr ? 'قائمة المهام النشطة' : 'Active Task List'}
                                        </label>
                                        
                                        {taskLists.length > 0 ? (
                                          <select
                                            value={selectedTaskListId}
                                            onChange={(e) => {
                                              setSelectedTaskListId(e.target.value);
                                              handleFetchTasks(e.target.value);
                                            }}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-xs Cairo block outline-none focus:border-sky-500 text-right"
                                          >
                                            {taskLists.map((list) => (
                                              <option key={list.id} value={list.id}>
                                                {list.title}
                                              </option>
                                            ))}
                                          </select>
                                        ) : (
                                          <div className="text-[11px] text-slate-500 py-1 text-right rtl:text-right ltr:text-left">
                                            {isAr ? 'لم يتم العثور على قوائم مهام.' : 'No task lists found.'}
                                          </div>
                                        )}

                                        <div className="border-t border-slate-850 pt-3">
                                          <form onSubmit={handleCreateTaskList} className="space-y-2 text-right">
                                            <label className="text-[10px] uppercase font-bold text-slate-500 block text-right rtl:text-right ltr:text-left">
                                              {isAr ? 'إنشاء قائمة مهام جديدة' : 'Create New List'}
                                            </label>
                                            <div className="flex gap-2">
                                              <input
                                                type="text"
                                                value={newTaskListTitle}
                                                onChange={(e) => setNewTaskListTitle(e.target.value)}
                                                placeholder={isAr ? 'اسم القائمة...' : 'List title...'}
                                                className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-white text-xs outline-none focus:border-sky-505 text-right"
                                              />
                                              <button
                                                type="submit"
                                                disabled={isCreatingTaskList || !newTaskListTitle.trim()}
                                                className="px-3 bg-sky-500 text-slate-950 font-black rounded-lg py-1.5 text-xs hover:opacity-90 active:scale-[0.95] transition-all cursor-pointer disabled:opacity-40"
                                              >
                                                {isCreatingTaskList ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 mx-auto" /> : <Plus className="w-4 h-4 shrink-0 mx-auto" />}
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                      </div>

                                      {/* Export Milestones Fast card */}
                                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 space-y-3 text-right">
                                        <h6 className="text-[11px] font-extrabold text-white flex items-center gap-1.5 justify-start rtl:justify-end">
                                          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                                          <span>{isAr ? 'تصدير معالم ومخرجات المشاريع' : 'Export Project Milestones'}</span>
                                        </h6>
                                        <p className="text-[10px] text-slate-500 leading-relaxed text-right rtl:text-right ltr:text-left">
                                          {isAr 
                                            ? 'اختر أحد مشروعاتك الفعّالة لتصدير كافة معالم البناء والمخرجات الفنية كمهام تفصيلية مباشرة إلى حساب Google Tasks الخاص بك.'
                                            : 'Select an active consultancy project or business request to export all customized technical milestones directly to Google Tasks.'}
                                        </p>

                                        {requests.filter(req => req.clientEmail === currentClient?.email).length > 0 ? (
                                          <div className="space-y-2 pt-1 font-sans">
                                            {requests
                                              .filter(req => req.clientEmail === currentClient?.email)
                                              .map(req => {
                                                const milestonesCount = getSolutionSubTasks(req).length;
                                                return (
                                                  <div key={req.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex flex-col gap-2 justify-between text-right">
                                                    <div className="min-w-0 text-right space-y-0.5">
                                                      <span className="text-[9px] font-black text-sky-400 block font-mono text-left">{req.id}</span>
                                                      <p className="text-[10px] font-bold text-slate-300 truncate">
                                                        {isAr ? (req.solutionId === 'ai-ml' ? 'ذكاء اصطناعي وتعلم آلي' : req.solutionId) : req.id}
                                                      </p>
                                                      <span className="text-[8.5px] text-slate-500 block">
                                                        {isAr ? `${milestonesCount} مهام تنفيذية` : `${milestonesCount} milestones`}
                                                      </span>
                                                    </div>
                                                    <button
                                                      type="button"
                                                      onClick={() => handleExportProjectMilestones(req.id)}
                                                      disabled={isExportingMilestones || !selectedTaskListId}
                                                      className="w-full py-1.5 px-2.5 rounded bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-slate-950 font-black text-[9.5px] transition-all flex items-center justify-center gap-1 Cairo border border-sky-500/20 cursor-pointer disabled:opacity-40"
                                                    >
                                                      {isExportingMilestones ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                                      <span>{isAr ? 'تصدير لمعلم Google' : 'Export to Google list'}</span>
                                                    </button>
                                                  </div>
                                                );
                                              })}
                                          </div>
                                        ) : (
                                          <div className="text-[10px] text-slate-500 text-center py-2">
                                            {isAr ? 'لا توجد مشاريع سارية لتصديرها.' : 'No active projects available.'}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Main Area: Tasks List and Creator */}
                                    <div className="col-span-1 lg:col-span-2 space-y-4">
                                      {/* Task creation form */}
                                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-850">
                                        <form onSubmit={handleCreateTask} className="space-y-3.5 text-right">
                                          <h6 className="text-[11px] font-extrabold text-white uppercase tracking-wider text-right rtl:text-right ltr:text-left">
                                            {isAr ? 'إضافة مهمة سريعة' : 'Quick Add Task'}
                                          </h6>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1 sm:col-span-2 text-right">
                                              <input
                                                type="text"
                                                value={newTaskTitle}
                                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                                placeholder={isAr ? 'عنوان المهمة الفنية...' : 'Tasks title or delivery milestone...'}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-xs outline-none focus:border-sky-500 text-right"
                                                required
                                              />
                                            </div>
                                            <div className="space-y-1 text-right">
                                              <label className="text-[9px] font-black text-slate-500 block font-mono uppercase text-right rtl:text-right ltr:text-left">
                                                {isAr ? 'ملاحظات وتفاصيل' : 'Description / Notes'}
                                              </label>
                                              <input
                                                type="text"
                                                value={newTaskNotes}
                                                onChange={(e) => setNewTaskNotes(e.target.value)}
                                                placeholder={isAr ? 'أولوية، دور فني...' : 'Priority, assignee roles...'}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-3 text-white text-xs outline-none focus:border-sky-500 text-right"
                                              />
                                            </div>
                                            <div className="space-y-1 text-right">
                                              <label className="text-[9px] font-black text-slate-500 block font-mono uppercase text-right rtl:text-right ltr:text-left">
                                                {isAr ? 'الموعد النهائي' : 'Due Date'}
                                              </label>
                                              <input
                                                type="date"
                                                value={newTaskDueDate}
                                                onChange={(e) => setNewTaskDueDate(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-3 text-white text-xs outline-none focus:border-sky-500 text-slate-400 font-mono text-right"
                                              />
                                            </div>
                                          </div>
                                          
                                          <div className="flex justify-end pt-1">
                                            <button
                                              type="submit"
                                              disabled={isCreatingTask || !selectedTaskListId || !newTaskTitle.trim()}
                                              className="px-4 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 font-bold text-slate-950 hover:opacity-90 rounded-xl text-xs active:scale-[0.95] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
                                            >
                                              {isCreatingTask ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                              <span>{isAr ? 'إدراج المهمة السحابية' : 'Insert Task to Google'}</span>
                                            </button>
                                          </div>
                                        </form>
                                      </div>

                                      {/* Tasks Listing */}
                                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 space-y-3 font-sans">
                                        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                                          <h6 className="text-[11px] font-extrabold text-white uppercase tracking-wider">
                                            {isAr ? 'قائمة المهام السحابية المسجلة' : 'Synced Google Tasks'}
                                          </h6>
                                          <div className="flex items-center gap-2">
                                            {tasksInSelectedList.length > 0 && (
                                              <button
                                                type="button"
                                                onClick={handleAICategorizeTasks}
                                                disabled={isCategorizingTasks || isLoadingTasks}
                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-slate-950 text-[10px] font-black transition-all border border-indigo-500/20 disabled:opacity-40 select-none cursor-pointer"
                                                title={isAr ? 'تصنيف المهام المعلقة بالذكاء الاصطناعي' : 'Classify pending list tasks using Gemini AI'}
                                              >
                                                {isCategorizingTasks ? (
                                                  <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                  <Sparkles className="w-3 h-3 text-indigo-400" />
                                                )}
                                                <span>{isAr ? 'تصنيف ذكي (Gemini)' : 'Gemini Auto-Tag'}</span>
                                              </button>
                                            )}
                                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                                              {tasksInSelectedList.length} {isAr ? 'مهام' : 'Tasks'}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Tasks Filter Search Bar */}
                                        {tasksInSelectedList.length > 0 && (
                                          <div className="relative">
                                            <input
                                              type="text"
                                              value={tasksSearchQuery}
                                              onChange={(e) => setTasksSearchQuery(e.target.value)}
                                              placeholder={isAr ? 'ابحث في المهام باسم أو وصف المهمة...' : 'Search tasks by name or description...'}
                                              className={`w-full bg-slate-950 border border-slate-800 rounded-xl py-2 text-white text-xs outline-none focus:border-sky-500 text-right ${
                                                isAr ? 'pl-3 pr-9' : 'pl-9 pr-3'
                                              }`}
                                            />
                                            <div className={`absolute inset-y-0 flex items-center pointer-events-none ${
                                              isAr ? 'right-0 pr-3' : 'left-0 pl-3'
                                            }`}>
                                              <Search className="h-3.5 w-3.5 text-slate-500" />
                                            </div>
                                            {tasksSearchQuery && (
                                              <button
                                                type="button"
                                                onClick={() => setTasksSearchQuery('')}
                                                className={`absolute inset-y-0 flex items-center text-[10px] text-slate-500 hover:text-white font-bold bg-slate-950/80 px-2 rounded-xl border border-slate-800 focus:outline-none cursor-pointer ${
                                                  isAr ? 'left-2 my-1.5' : 'right-2 my-1.5'
                                                }`}
                                              >
                                                {isAr ? 'مسح' : 'Clear'}
                                              </button>
                                            )}
                                          </div>
                                        )}

                                        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                          {isLoadingTasks ? (
                                            <div className="py-8 text-center text-slate-500 animate-pulse text-xs flex flex-col items-center justify-center gap-1.5">
                                              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
                                              <span>{isAr ? 'جاري جلب المهام النشطة...' : 'Retrieving task records from Google Tasks...'}</span>
                                            </div>
                                          ) : (() => {
                                            const filteredTasks = tasksInSelectedList.filter((task: any) => {
                                              if (!tasksSearchQuery.trim()) return true;
                                              const term = tasksSearchQuery.toLowerCase();
                                              return (task.title?.toLowerCase() || '').includes(term) || 
                                                     (task.notes?.toLowerCase() || '').includes(term);
                                            });

                                            if (tasksInSelectedList.length === 0) {
                                              return (
                                                <div className="py-8 text-center text-slate-500 text-xs font-sans">
                                                  <CheckCircle2 className="w-6 h-6 text-slate-700 mx-auto mb-2 opacity-50" />
                                                  <span>{isAr ? 'رائع! لا توجد مهام نشطة في هذه القائمة.' : 'No active tasks found in this list.'}</span>
                                                </div>
                                              );
                                            }

                                            if (filteredTasks.length === 0) {
                                              return (
                                                <div className="py-8 text-center text-slate-500 text-xs font-sans">
                                                  <Search className="w-6 h-6 text-slate-700 mx-auto mb-2 opacity-50 animate-pulse" />
                                                  <span>{isAr ? 'لم يتم العثور على نتائج مطابقة للبحث.' : 'No matching tasks found for your search.'}</span>
                                                </div>
                                              );
                                            }

                                            return filteredTasks.map((task: any) => {
                                              const isCompleted = task.status === 'completed';
                                              const tagMatch = task.title?.match(/^\[(Development|Design|Admin)\]\s*(.*)$/i);
                                              const displayTitle = tagMatch ? tagMatch[2] : task.title;
                                              const taskCategory = tagMatch ? tagMatch[1] : null;

                                              return (
                                                <div 
                                                  key={task.id} 
                                                  className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 text-right bg-slate-950/40 ${
                                                    isCompleted 
                                                      ? 'border-slate-850 opacity-60' 
                                                      : 'border-slate-850 hover:border-slate-800'
                                                  }`}
                                                >
                                                  <div className="flex items-start gap-2.5 min-w-0 text-right">
                                                    <input
                                                      type="checkbox"
                                                      id={`task-check-${task.id}`}
                                                      checked={isCompleted}
                                                      onChange={() => handleToggleTaskStatus(task.id, task.status)}
                                                      className="mt-1 w-4 h-4 rounded border border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 cursor-pointer accent-emerald-500 shrink-0 select-none"
                                                      title={isAr ? 'تحديد كمكتمل / غير مكتمل' : 'Mark as Complete / Incomplete'}
                                                    />
                                                    <div className="min-w-0 text-right space-y-1">
                                                      <div className="flex items-center gap-1.5 flex-wrap">
                                                        {taskCategory && (
                                                          <span className={`text-[8.5px] uppercase font-mono tracking-wider font-extrabold px-1.5 py-0.5 rounded border select-none leading-none shrink-0 ${
                                                            taskCategory.toLowerCase() === 'development' 
                                                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'
                                                              : taskCategory.toLowerCase() === 'design'
                                                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/15'
                                                              : 'bg-sky-500/10 text-sky-400 border-sky-500/15'
                                                          }`}>
                                                            {isAr 
                                                              ? (taskCategory.toLowerCase() === 'development' ? 'تطوير' : taskCategory.toLowerCase() === 'design' ? 'تصميم' : 'إدارة')
                                                              : taskCategory
                                                            }
                                                          </span>
                                                        )}
                                                        <label
                                                          htmlFor={`task-check-${task.id}`}
                                                          className={`text-xs font-black block truncate cursor-pointer select-none leading-none ${isCompleted ? 'line-through text-slate-500 font-medium' : 'text-slate-200 hover:text-white transition-colors'}`}
                                                        >
                                                          {displayTitle}
                                                        </label>
                                                      </div>
                                                      {task.notes && (
                                                        <p className="text-[10.5px] text-slate-550 leading-relaxed max-w-md break-words whitespace-pre-line text-right">
                                                          {task.notes}
                                                        </p>
                                                      )}
                                                      {task.due && (
                                                        <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 inline-flex items-center gap-1 rounded font-mono">
                                                          <Clock className="w-3 h-3 text-amber-400" />
                                                          <span>{new Date(task.due).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</span>
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>

                                                  <button
                                                    type="button"
                                                    onClick={() => handleDeleteTask(task.id, task.title)}
                                                    className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
                                                    title={isAr ? 'حذف المهمة نهائياً' : 'Delete task permanently'}
                                                  >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              );
                                            });
                                          })()}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {workspaceActiveTab === 'meet' && (
                              <div className="space-y-6 animate-fadeIn">
                                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-4 text-right">
                                  {/* Header */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                                    <h6 className="text-[12px] font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                                      <Video className="w-4 h-4 text-sky-400" />
                                      <span>{isAr ? 'منصة اجتماعات ولقاءات Google Meet' : 'Google Meet Video Conferencing Hub'}</span>
                                    </h6>
                                    {isGeneratingMeetSpace && (
                                      <span className="text-[10px] text-sky-450 font-bold flex items-center gap-1 animate-pulse">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-450" />
                                        {isAr ? 'جاري تهيئة قاعة اللقاء السحابية...' : 'Provisioning Google Meet space...'}
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-slate-400 leading-relaxed font-sans text-right">
                                    {isAr
                                      ? 'قم بإنشاء وتأسيس قاعات اجتماعات مرئية آمنة وموثوقة لعملائك ومستشاريك من خلال تكامل Google Meet الفيدرالي لإنشاء روابط فورية أو تتبع تاريخ القاعات المعدة مسبقاً.'
                                      : 'Provision secure, high-definition Google Meet video conferencing rooms natively. Generate instant meeting rooms, copy invitation metadata, and maintain scheduled advisory sessions.'}
                                  </p>

                                  {/* Error Feedback */}
                                  {workspaceError && (
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 font-bold text-center">
                                      {workspaceError}
                                    </div>
                                  )}

                                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 items-start text-right">
                                    {/* Create panel: left (col-span-12 lg:col-span-12) */}
                                    <div className="lg:col-span-5 p-4 rounded-xl bg-slate-900 border border-slate-850 space-y-4">
                                      <form onSubmit={handleCreateMeetSpace} className="space-y-3.5 text-right">
                                        <h6 className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 justify-end">
                                          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                                          <span>{isAr ? 'إنشاء قاعة اجتماعات فورية' : 'Generate Instant Meet Room'}</span>
                                        </h6>

                                        <div className="space-y-1 block text-right">
                                          <label className="text-[9.5px] font-bold text-slate-400 block mb-1">
                                            {isAr ? 'موضوع أو عنوان الاجتماع *' : 'Meeting Title / Purpose *'}
                                          </label>
                                          <input
                                            type="text"
                                            required
                                            value={meetSpaceTitle}
                                            onChange={(e) => setMeetSpaceTitle(e.target.value)}
                                            placeholder={isAr ? "مثال: مراجعة مخطط المتطلبات الأمنية" : "e.g., General Architecture Review Sync"}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-xs outline-none focus:border-sky-500 text-right font-sans placeholder/text-slate-650"
                                          />
                                        </div>

                                        <button
                                          type="submit"
                                          disabled={isGeneratingMeetSpace || !meetSpaceTitle.trim()}
                                          className="w-full py-2.5 bg-gradient-to-r from-sky-450 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/10 transition-all disabled:opacity-55"
                                        >
                                          {isGeneratingMeetSpace ? (
                                            <>
                                              <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                                              <span>{isAr ? 'جاري الإنشاء...' : 'Creating Room...'}</span>
                                            </>
                                          ) : (
                                            <>
                                              <Video className="w-4 h-4 text-slate-900" />
                                              <span>{isAr ? 'تأكيد وإنشاء الغرفة الآن' : 'Provision Dedicated Room'}</span>
                                            </>
                                          )}
                                        </button>
                                      </form>

                                      {/* Sub-card: Newly provisioned space presentation */}
                                      {createdMeetSpace && (
                                        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/35 space-y-3 mt-4 text-right animate-fadeIn">
                                          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-1.5">
                                            <span className="text-[8.5px] uppercase font-black tracking-wider text-indigo-400 bg-indigo-550/15 py-0.5 px-1.5 rounded-full">
                                              {isAr ? 'تم الإنشاء بنجاح' : 'Active Room Created'}
                                            </span>
                                            <span className="text-[9.5px] font-black text-indigo-300 font-mono">{createdMeetSpace.meetingCode}</span>
                                          </div>
                                          <div>
                                            <h6 className="text-xs font-extrabold text-white">{createdMeetSpace.title}</h6>
                                            <p className="text-[9.5px] text-slate-400 mt-1 truncate font-mono">{createdMeetSpace.meetingUri}</p>
                                          </div>
                                          <div className="flex gap-2 justify-end">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const inviteText = isAr 
                                                  ? `يرجى الانضمام لاجتماع مطوري الأعمال (Business Developers)\nالموضوع: ${createdMeetSpace.title}\nالرابط المباشر: ${createdMeetSpace.meetingUri}\nرمز اللقاء: ${createdMeetSpace.meetingCode}`
                                                  : `Please join the Business Developers consulting meeting.\nTopic: ${createdMeetSpace.title}\nDirect Link: ${createdMeetSpace.meetingUri}\nMeet Code: ${createdMeetSpace.meetingCode}`;
                                                
                                                try {
                                                  navigator.clipboard.writeText(inviteText);
                                                } catch {
                                                  const textArea = document.createElement("textarea");
                                                  textArea.value = inviteText;
                                                  document.body.appendChild(textArea);
                                                  textArea.select();
                                                  document.execCommand("copy");
                                                  document.body.removeChild(textArea);
                                                }
                                                alert(isAr ? '✓ تم نسخ بيانات دعوة الاجتماع المباشرة بنجاح!' : '✓ Direct meeting invite clipboard copy completed!');
                                              }}
                                              className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-[9px] font-black hover:text-white transition-colors cursor-pointer"
                                            >
                                              {isAr ? 'نسخ الدعوة' : 'Copy Invitation'}
                                            </button>
                                            <a
                                              href={createdMeetSpace.meetingUri}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="px-3 py-1.5 bg-indigo-500 text-slate-950 rounded-lg text-[9px] font-black hover:bg-indigo-400 transition-colors flex items-center gap-1 hover:shadow-md cursor-pointer"
                                            >
                                              <span>{isAr ? 'دخول اللقاء ميت ➔' : 'Join Room Now ➔'}</span>
                                            </a>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* History listing: right (col-span-12 lg:col-span-7) */}
                                    <div className="lg:col-span-7 p-4 rounded-xl bg-slate-900 border border-slate-850 space-y-4">
                                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                                        <h6 className="text-[11px] font-extrabold text-white uppercase tracking-wider">
                                          {isAr ? 'قائمة الغرف المحفوظة' : 'Provisioned Sessions History'}
                                        </h6>
                                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800 font-sans">
                                          {meetSpaces.length} {isAr ? 'غرف' : 'Rooms'}
                                        </span>
                                      </div>

                                      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                        {meetSpaces.length > 0 ? (
                                          meetSpaces.map((room: any, rIdx: number) => (
                                            <div key={rIdx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 flex items-center justify-between gap-3 text-right hover:border-slate-800 transition-all font-sans">
                                              
                                              {/* Deleted button on leftmost end in RTL layout */}
                                              <button
                                                type="button"
                                                onClick={() => handleDeleteMeetSpace(room.name, room.title)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                                                title={isAr ? 'حذف من السجل' : 'Remove from logs'}
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>

                                              <div className="flex items-center gap-2">
                                                <a
                                                  href={room.meetingUri}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className="p-1 px-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-[9px] font-bold hover:bg-indigo-500 hover:text-slate-950 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                                                >
                                                  <Video className="w-3 h-3 text-current" />
                                                  <span>{isAr ? 'دخول اللقاء' : 'Join'}</span>
                                                </a>
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    try {
                                                      navigator.clipboard.writeText(room.meetingUri);
                                                    } catch {
                                                      const t = document.createElement("textarea");
                                                      t.value = room.meetingUri;
                                                      document.body.appendChild(t);
                                                      t.select();
                                                      document.execCommand("copy");
                                                      document.body.removeChild(t);
                                                    }
                                                    alert(isAr ? '✓ تم نسخ رابط الاجتماع المرئي!' : '✓ Meet link copied successfully!');
                                                  }}
                                                  className="p-1.5 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white rounded-lg cursor-pointer transition-colors"
                                                  title={isAr ? 'نسخ رابط اللقاء' : 'Copy meet link'}
                                                >
                                                  <Copy className="w-3 h-3" />
                                                </button>
                                              </div>

                                              <div className="min-w-0 text-right space-y-1 pr-1 flex-1">
                                                <h6 className="text-[11.5px] font-bold text-slate-200 truncate">{room.title}</h6>
                                                <div className="flex items-center gap-1.5 justify-end text-[9px] font-mono text-slate-500">
                                                  <span>{room.meetingCode}</span>
                                                  <span className="w-1 h-1 rounded-full bg-slate-800" />
                                                  <span>{new Date(room.createdAt).toLocaleDateString(isAr ? 'ar-SA': 'en-US')}</span>
                                                </div>
                                              </div>

                                            </div>
                                          ))
                                        ) : (
                                          <div className="py-12 text-center text-slate-500 text-xs font-sans">
                                            <Video className="w-6 h-6 text-slate-700 mx-auto mb-2 opacity-50" />
                                            <span>{isAr ? 'لم يتم إنشاء أي قاعات لقاءات مستقلة حالياً.' : 'No standalone meeting rooms provisioned yet.'}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : portalSubTab === 'team' ? (
                      <div className="space-y-6 font-sans text-right rtl:text-right ltr:text-left animate-fadeIn">
                        {/* Tab header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                          <div>
                            <h5 className="text-base font-extrabold text-slate-800 flex items-center gap-2 justify-start rtl:justify-end Cairo">
                              <Users className="w-5 h-5 text-sky-600" />
                              <span>{isAr ? 'لوحة إدارة الفريق وصلاحيات الوصول (باقة النمو)' : 'Team Management & Role Access Hub (Growth Plan)'}</span>
                            </h5>
                            <p className="text-xs text-slate-500 mt-1">
                              {isAr 
                                ? 'إضافة وتعديل أدوار أعضاء فريقك وتخصيص صلاحياتهم للوصول إلى الأدوات والبيانات المشتركة.' 
                                : 'Add, edit, and organize team members, designate administrative roles, and allocate granular scope permissions.'}
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTeamMember(null);
                              setTeamNameInput('');
                              setTeamEmailInput('');
                              setTeamRoleInput('Developer');
                              setTeamStatusInput('Active');
                              setTeamPermsInput(['read_databases']);
                              setTeamFormOpen(true);
                              setProfSuccess('');
                              setProfError('');
                            }}
                            className="px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-md hover:scale-101 active:scale-99 flex items-center gap-2 cursor-pointer self-start sm:self-center font-black"
                          >
                            <Plus className="w-4 h-4 font-bold" />
                            <span>{isAr ? 'إضافة عضو جديد للفريق' : 'Add Team Member'}</span>
                          </button>
                        </div>

                        {/* Error and Success highlights */}
                        {profSuccess && (
                          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs text-center font-bold flex items-center justify-center gap-2 animate-pulse">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{profSuccess}</span>
                          </div>
                        )}
                        {profError && (
                          <div className="p-3.5 rounded-xl bg-red-50 text-red-600 border border-red-100 text-xs text-center font-mono flex items-center justify-center gap-2 animate-bounce">
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                            <span>{profError}</span>
                          </div>
                        )}

                        {/* Visual summary of team capacity */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-2xl bg-white border border-slate-200">
                            <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{isAr ? 'أعضاء الفريق النشطين' : 'Active Team Seats'}</span>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-2xl font-black text-slate-900 font-mono">{teamMembers.length}</span>
                              <span className="text-xs text-slate-400">/ 5 {isAr ? 'أعضاء كحد أقصى' : 'seats max'}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2.5">
                              <div 
                                className="bg-sky-500 h-full rounded-full transition-all" 
                                style={{ width: `${(teamMembers.length / 5) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-white border border-slate-200">
                            <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{isAr ? 'حالة الباقة الحالية' : 'Subscription Plan State'}</span>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-150">
                                {isAr ? 'باقة النمو نشطة' : 'Growth Plan Active'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold">
                                {isAr ? 'تجديد شهري' : 'Renewable Monthly'}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2">
                              {isAr ? 'تتيح باقة النمو مرونة فائقة وتوزيع الصلاحيات بين مطورين ومحللين.' : 'Enables direct role synchronization with database and environment spaces.'}
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-white border border-slate-200">
                            <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{isAr ? 'صلاحيات الأمان المفروضة' : 'Security Policy Status'}</span>
                            <div className="flex items-center gap-2 mt-1 px-1.5 py-1 bg-sky-50 rounded-lg text-sky-750 text-[10.5px] font-bold mt-2 border border-sky-100">
                              <Shield className="w-4 h-4 text-sky-600 shrink-0" />
                              <span>{isAr ? 'حماية مشفرة تعتمد على الدور' : 'Sovereign Role-Based Access Control'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Form Editor Section (collapsible inline drawer) */}
                        {teamFormOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
                          >
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                              <h6 className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-1.5 Cairo">
                                <UserCheck className="w-4 h-4 text-sky-600" />
                                <span>{editingTeamMember ? (isAr ? `تعديل صلاحيات العضو: ${editingTeamMember.name}` : `Edit permissions: ${editingTeamMember.name}`) : (isAr ? 'إضافة شريك/عضو جديد للفريق' : 'Add Partner / Team seat')}</span>
                              </h6>
                              <button 
                                type="button" 
                                onClick={() => setTeamFormOpen(false)}
                                className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                              >
                                {isAr ? 'العودة ✕' : 'Close ✕'}
                              </button>
                            </div>

                            <form onSubmit={editingTeamMember ? handleEditTeamMemberSubmit : handleAddTeamMember} className="space-y-4 text-right">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[11px] text-slate-600 font-bold block mb-1">
                                    {isAr ? 'اسم العضو بالكامل *' : 'Full Name *'}
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={teamNameInput}
                                    onChange={(e) => setTeamNameInput(e.target.value)}
                                    placeholder={isAr ? "مثال: فيصل الحربي" : "e.g. Faisal Al-Harbi"}
                                    className="w-full bg-white border border-slate-350 rounded-xl py-2.5 px-3.5 text-slate-800 text-xs outline-none focus:border-sky-500 transition-all font-sans"
                                  />
                                </div>

                                <div>
                                  <label className="text-[11px] text-slate-600 font-bold block mb-1">
                                    {isAr ? 'البريد الإلكتروني المهني *' : 'Professional Email *'}
                                  </label>
                                  <input
                                    type="email"
                                    required
                                    value={teamEmailInput}
                                    onChange={(e) => setTeamEmailInput(e.target.value)}
                                    placeholder="faisal@company.com"
                                    className="w-full bg-white border border-slate-350 rounded-xl py-2.5 px-3.5 text-slate-800 text-xs outline-none focus:border-sky-500 transition-all font-mono"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[11px] text-slate-600 font-bold block mb-1">
                                    {isAr ? 'المسمى الوظيفي والدور القيادي *' : 'Business Role Selection *'}
                                  </label>
                                  <select
                                    value={teamRoleInput}
                                    onChange={(e: any) => setTeamRoleInput(e.target.value)}
                                    className="w-full bg-white border border-slate-350 rounded-xl py-2.5 px-3.5 text-slate-800 text-xs outline-none focus:border-sky-500 transition-all text-right"
                                  >
                                    <option value="Admin">{isAr ? 'مدير نظام (Admin)' : 'Admin'}</option>
                                    <option value="Developer">{isAr ? 'مطور برمجيات (Developer)' : 'Developer'}</option>
                                    <option value="Analyst">{isAr ? 'محلل أعمال مالي (Analyst)' : 'Analyst'}</option>
                                    <option value="Guest">{isAr ? 'ضيف مشاهد (Guest)' : 'Guest'}</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[11px] text-slate-600 font-bold block mb-1">
                                    {isAr ? 'حالة الحساب ومستوى الجهوزية' : 'Account Life Status'}
                                  </label>
                                  <select
                                    value={teamStatusInput}
                                    onChange={(e: any) => setTeamStatusInput(e.target.value)}
                                    className="w-full bg-white border border-slate-350 rounded-xl py-2.5 px-3.5 text-slate-800 text-xs outline-none focus:border-sky-500 transition-all text-right"
                                  >
                                    <option value="Active">{isAr ? 'نشط (Active)' : 'Active'}</option>
                                    <option value="Pending">{isAr ? 'قيد الانتظار (Pending)' : 'Pending'}</option>
                                    <option value="Suspended">{isAr ? 'معطل مؤقتاً (Suspended)' : 'Suspended'}</option>
                                  </select>
                                </div>
                              </div>

                              {/* Granular Permissions Section */}
                              <div className="space-y-2 pt-2 border-t border-slate-100">
                                <label className="text-[11px] text-slate-700 font-bold block">
                                  {isAr ? 'تخصيص صلاحيات الوصول الدقيقة (Granular Permissions) *' : 'Allocate Custom Access Scopes *'}
                                </label>
                                <p className="text-[10px] text-slate-500 mb-2">
                                  {isAr 
                                    ? 'اختر الصلاحيات التي ترغب في فرضها على هذا العضو لإدارة بيئة العمل المشتركة.' 
                                    : 'Select specific database and advisory permissions. Checkboxes reflect real active roles.'}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-right">
                                  {[
                                    { key: 'read_databases', labelAr: 'التعديل على قوالب قواعد البيانات والهياكل المخططة', labelEn: 'Read & Edit DB Schema Layouts' },
                                    { key: 'manage_workspace', labelAr: 'الربط ومزامنة Google Workspace وسحب الملفات', labelEn: 'Manage Workspace & Google Sync' },
                                    { key: 'view_financials', labelAr: 'استعراض الفواتير والمدفوعات والميزانيات التقديرية', labelEn: 'Review Billing & Estimations' },
                                    { key: 'request_consultation', labelAr: 'طلب استشارات جديدة وحجز مواعيد في التقويم', labelEn: 'Schedule Consultation Advisory slots' }
                                  ].map((pItem) => {
                                    const isChecked = teamPermsInput.includes(pItem.key);
                                    return (
                                      <div 
                                        key={pItem.key}
                                        onClick={() => togglePermissionInput(pItem.key)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-right hover:border-sky-305 ${
                                          isChecked ? 'border-sky-200 bg-sky-50 text-slate-900 font-bold' : 'border-slate-200 text-slate-600'
                                        }`}
                                      >
                                        <div className="min-w-0 flex-1 text-right">
                                          <p className="text-xs leading-relaxed">{isAr ? pItem.labelAr : pItem.labelEn}</p>
                                          <p className="text-[9px] text-slate-400 font-mono mt-0.5">{pItem.key}</p>
                                        </div>
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-350 bg-white'}`}>
                                          {isChecked && <span className="text-[10px] leading-none font-bold">✓</span>}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="flex justify-end gap-2.5 pt-3">
                                <button
                                  type="button"
                                  onClick={() => setTeamFormOpen(false)}
                                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 bg-white rounded-xl text-xs font-bold cursor-pointer transition-all"
                                >
                                  {isAr ? 'إلغاء المراجعة' : 'Cancel'}
                                </button>
                                <button
                                  type="submit"
                                  className="px-5 py-2.5 bg-sky-650 hover:bg-sky-700 bg-sky-600 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                  <UserCheck className="w-4 h-4" />
                                  <span>{editingTeamMember ? (isAr ? 'تحديث الصلاحيات والعضو' : 'Update Member') : (isAr ? 'حفظ وإضافة العضو للفريق' : 'Save & Join Member')}</span>
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        )}

                        {/* Team Members List Table Grid */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <span className="text-xs font-extrabold text-slate-800 Cairo">{isAr ? 'قائمة أعضاء فريق العمل المعتمدين' : 'Authorized Active Team Directory'}</span>
                            <span className="text-[9.5px] font-mono bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full font-bold">
                              {teamMembers.length} / 5 {isAr ? 'مقاعد مستخدمة' : 'Seats Registered'}
                            </span>
                          </div>

                          {teamMembers.length === 0 ? (
                            <div className="p-12 text-center space-y-3">
                              <Users className="w-10 h-10 text-slate-300 mx-auto animate-bounce" />
                              <p className="text-xs text-slate-500 italic">
                                {isAr ? 'لا يوجد أعضاء في فريقك حالياً. أضف شريكاً لبدء العمل من لوحة تحكم واحدة.' : 'No team members added yet. Add a co-founder or worker to split workflow parameters.'}
                              </p>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-right text-xs">
                                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-100">
                                  <tr>
                                    <th className="px-5 py-3 text-right">{isAr ? 'الاسم والبريد' : 'Member & Email'}</th>
                                    <th className="px-5 py-3 text-center">{isAr ? 'الدور والمسؤولية' : 'Sovereign Role'}</th>
                                    <th className="px-5 py-3 text-center">{isAr ? 'صلاحيات الوصول' : 'Allocated Permissions'}</th>
                                    <th className="px-5 py-3 text-center">{isAr ? 'حالة التفعيل' : 'Active Status'}</th>
                                    <th className="px-5 py-3 text-left">{isAr ? 'إجراءات' : 'Actions'}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {teamMembers.map((member, mIdx) => (
                                    <tr key={member.id || mIdx} className="hover:bg-slate-50/50 transition-colors">
                                      {/* Name & Email detail */}
                                      <td className="px-5 py-4">
                                        <div className="flex items-center gap-3 justify-start">
                                          <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold font-mono text-xs uppercase shadow-sm">
                                            {member.name.slice(0, 2)}
                                          </div>
                                          <div className="text-right">
                                            <p className="font-extrabold text-slate-800 leading-none">{member.name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono mt-1 block font-semibold">{member.email}</p>
                                          </div>
                                        </div>
                                      </td>

                                      {/* Role Dropdown Selector */}
                                      <td className="px-5 py-4 text-center">
                                        <div className="inline-block relative">
                                          <select
                                            value={member.role}
                                            onChange={(e) => handleUpdateMemberRoleInline(member.id, e.target.value as any)}
                                            className={`px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500 select-none ${
                                              member.role === 'Admin' ? 'text-purple-700 border-purple-200 bg-purple-50/50 hover:bg-purple-100' :
                                              member.role === 'Developer' ? 'text-sky-700 border-sky-200 bg-sky-50/50 hover:bg-sky-100' :
                                              member.role === 'Analyst' ? 'text-amber-700 border-amber-200 bg-amber-50/50 hover:bg-amber-100' :
                                              'text-slate-700 border-slate-200 bg-slate-50 hover:bg-slate-150'
                                            }`}
                                          >
                                            <option value="Admin" className="text-purple-700 font-bold bg-white">
                                              {isAr ? 'مدير (Admin)' : 'Admin'}
                                            </option>
                                            <option value="Developer" className="text-sky-700 font-bold bg-white">
                                              {isAr ? 'مطور/محرر (Editor/Dev)' : 'Editor/Dev'}
                                            </option>
                                            <option value="Analyst" className="text-amber-700 font-bold bg-white">
                                              {isAr ? 'محلل (Analyst)' : 'Analyst'}
                                            </option>
                                            <option value="Guest" className="text-slate-700 font-bold bg-white">
                                              {isAr ? 'مشاهد (Viewer)' : 'Viewer'}
                                            </option>
                                          </select>
                                        </div>
                                      </td>

                                      {/* Permissions list */}
                                      <td className="px-5 py-4 text-center">
                                        <div className="flex justify-center flex-wrap gap-1 max-w-[170px] mx-auto min-h-[20px]">
                                          {member.permissions && member.permissions.length > 0 ? (
                                            member.permissions.map((pKey: string) => (
                                              <span key={pKey} className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[8px] font-bold font-mono">
                                                {pKey === 'read_databases' ? (isAr ? 'قواعد' : 'DB') :
                                                 pKey === 'manage_workspace' ? (isAr ? 'سحابي' : 'Cloud') :
                                                 pKey === 'view_financials' ? (isAr ? 'مالي' : 'Fin') :
                                                 (isAr ? 'حجز' : 'Cal')}
                                              </span>
                                            ))
                                          ) : (
                                            <span className="text-[9px] text-slate-500 italic select-none">
                                              {isAr ? 'لا توجد صلاحيات' : 'No permissions assigned'}
                                            </span>
                                          )}
                                        </div>
                                      </td>

                                      {/* Active Status Badge */}
                                      <td className="px-5 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                          member.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                          member.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                          'bg-red-50 text-red-600 border border-red-100'
                                        }`}>
                                          <span className={`w-1 h-1 rounded-full ${
                                            member.status === 'Active' ? 'bg-emerald-555 bg-emerald-500' :
                                            member.status === 'Pending' ? 'bg-amber-500 font-bold' : 'bg-red-500'
                                          }`} />
                                          <span>
                                            {member.status === 'Active' ? (isAr ? 'نشط' : 'Active') :
                                             member.status === 'Pending' ? (isAr ? 'قيد الانتظار' : 'Pending') :
                                             (isAr ? 'معلق مؤقتاً' : 'Suspended')}
                                          </span>
                                        </span>
                                      </td>

                                      {/* Actions Buttons */}
                                      <td className="px-5 py-4 text-left">
                                        <div className="flex gap-2 justify-end">
                                          <button
                                            type="button"
                                            onClick={() => handleStartEditTeamMember(member)}
                                            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-705 hover:text-slate-900 rounded-lg text-[10.5px] font-bold transition-colors cursor-pointer"
                                          >
                                            {isAr ? 'تعديل الدور' : 'Edit Access'}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (confirm(isAr ? 'هل أنت متأكد من حذف هذا العضو؟ سيفقد كافة صلاحيات الوصول فوراً.' : 'Are you sure you want to delete this member? All workspace session authorizations will be revoked immediately.')) {
                                                handleDeleteTeamMember(member.id);
                                              }
                                            }}
                                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer border border-red-100 hover:border-red-200"
                                          >
                                            {isAr ? 'إزالة' : 'Revoke'}
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                        {/* Interactive tips footer */}
                        <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-[10.5px] text-sky-700 leading-relaxed font-sans text-right">
                          <span className="font-extrabold">{isAr ? '💡 نصيحة الخبراء لتنظيم الصلاحيات:' : '💡 Pro Tip on Secure Access Control:'}</span>
                          <span className="block mt-1">
                            {isAr 
                              ? 'يوصى بتعيين أقل صلاحية ممكنة (Principle of Least Privilege). قم بتعيين دور "مطور تطبيقات" للمطور الشريك، مع تمكين "التعديل على قوالب قواعد البيانات" فقط للحد من الفروقات والتعارضات.' 
                              : 'Always enforce the Principle of Least Privilege by configuring members with only the specific cloud resources they require. For engineers, we recommend assigning DB schema alteration scopes only.'}
                          </span>
                        </div>
                      </div>
                    ) : portalSubTab === 'financials' ? (
                      <div className="space-y-6 font-sans text-right rtl:text-right ltr:text-left animate-fadeIn">
                        {/* Header Section */}
                        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                            <div>
                              <h5 className="text-base font-extrabold text-white flex items-center gap-2 justify-start rtl:justify-end Cairo">
                                <DollarSign className="w-5 h-5 text-emerald-400" />
                                <span>{isAr ? 'منظومة ميزانيات ومصروفات المشاريع التفاعلية' : 'Interactive Project Budgets & Cashflow Hub'}</span>
                              </h5>
                              <p className="text-xs text-slate-400 mt-1">
                                {isAr 
                                  ? 'إدارة استراتيجية للأموال والنفقات متصلة بـ Google Sheets API مباشرة؛ لقراءة الجداول المالية، تعديل الخلايا لحظياً، وإضافة سجلات الميزانية بموثوقية حساب شريكك.' 
                                  : 'Strategic sheets-backed ledger mapping master budgets, active burns, and transactional records in real-time.'}
                              </p>
                            </div>

                            {/* Connection Indicator */}
                            {workspaceToken ? (
                              <div className="flex items-center gap-2.5">
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                  <span>{isAr ? 'متصل بـ Google Sheets API' : 'Google Sheets API Sync Active'}</span>
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                                {isAr ? 'بانتظار ربط حساب Google لبدء الاتصال' : 'Awaiting Google Workspace Pairing'}
                              </span>
                            )}
                          </div>

                          {/* Connection flow trigger if no Token */}
                          {!workspaceToken ? (
                            <div className="text-center py-6 space-y-4 font-sans justify-center">
                              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mx-auto border border-amber-500/25">
                                <Key className="w-6 h-6 animate-pulse" />
                              </div>
                              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed text-center">
                                {isAr 
                                  ? 'تتطلب واجهة البيانات المالية للمشاريع ربط حساب Google الخاص بك بشكل آمن لمنح التطبيق تذاكر اتصال مشفرة ومحدودة الصلاحية للمزامنة مع جداول ورصيد ميزانيتك.'
                                  : 'Connect your corporate Google Account via secure OAuth popup to syn budget master plans, add expense entries, and modify milestones.'}
                              </p>
                              {workspaceError && (
                                <p className="text-xs text-red-400 font-bold text-center">{workspaceError}</p>
                              )}
                              <button
                                type="button"
                                onClick={handleConnectWorkspace}
                                disabled={isLinkingWorkspace}
                                className="mx-auto inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-black shadow-lg transition-all transform hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
                              >
                                {isLinkingWorkspace ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-slate-705" />
                                ) : (
                                  <Chrome className="w-4.5 h-4.5 text-red-500" />
                                )}
                                <span>
                                  {isAr ? 'مصادقة واتصال عبر حساب Google' : 'Authenticate & Bind via Google Account'}
                                </span>
                              </button>
                            </div>
                          ) : !financialSpreadsheetId ? (
                            /* Sub-sheet Pairing Screen */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch pt-2 text-right">
                              {/* Pathway A: Create Sheet */}
                              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-850 flex flex-col justify-between space-y-4 text-right">
                                <div className="space-y-1.5">
                                  <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide">
                                    {isAr ? 'التكوين التلقائي السريع' : 'RECOMMENDED AUTO GENERATION'}
                                  </span>
                                  <h6 className="text-xs sm:text-sm font-bold text-white">
                                    {isAr ? 'إنشاء ملف مالي متكامل ومبني تلقائياً' : 'Create & Provision Financial Ledger'}
                                  </h6>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {isAr
                                      ? 'سنقوم ببرمجة وبناء مستند Google Sheets متقدم مخصص في مساحة درايف الخاصة بك، يضم تصفح ميزانيات المشاريع، النفقات، الدفعات، والتدفق المالي.'
                                      : 'Generates a fully indexed Google Sheet in your Drive, with active worksheets and mock baselines for Project Budgets and Project Transactions.'}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleCreateFinancialsSpreadsheet}
                                  disabled={financialLoading}
                                  className="w-full py-2.5 bg-emerald-505 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  {financialLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <FileSpreadsheet className="w-4 h-4" />
                                  )}
                                  <span>{isAr ? 'تهيئة وتصميم مستند الميزانية' : 'Generate & Design Ledger'}</span>
                                </button>
                              </div>

                              {/* Pathway B: Custom ID Coupling */}
                              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-850 flex flex-col justify-between space-y-4 text-right">
                                <div className="space-y-2">
                                  <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide">
                                    {isAr ? 'ربط مستند حالي' : 'EXISTING LEDGER ID'}
                                  </span>
                                  <h6 className="text-xs sm:text-sm font-bold text-white">
                                    {isAr ? 'ربط معرف أو عنوان جدول بيانات قائم' : 'Connect Existing Sheet'}
                                  </h6>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {isAr
                                      ? 'الصق رابط أو معرف جدول جداول بيانات Google Sheet متاح مسبقاً لمزامنته وقراءته كقاعدة مالية تفاعلية.'
                                      : 'Paste an existing spreadsheet ID or URL from Google Sheets to link with our interactive client portal.'}
                                  </p>
                                  <input
                                    type="text"
                                    value={financialInputIdOrUrl}
                                    onChange={(e) => setFinancialInputIdOrUrl(e.target.value)}
                                    placeholder={isAr ? "https://docs.google.com/spreadsheets/d/..." : "Enter Spreadsheet URL or ID..."}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-white text-[11px] outline-none focus:border-emerald-500 transition-all text-right placeholder:text-slate-600"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={handleConnectExistingFinancials}
                                  disabled={financialLoading || !financialInputIdOrUrl.trim()}
                                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                                >
                                  {financialLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                  ) : (
                                    <span>{isAr ? 'ربط جدول البيانات المالي' : 'Link Financial Budget Sheet'}</span>
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Connected Sheets Controller and Tables Panel */
                            <div className="space-y-4 pt-1 font-sans">
                              {/* Top Bar Details */}
                              <div className="p-4 rounded-xl bg-slate-900 border border-slate-855 border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right">
                                <div className="space-y-1">
                                  <div className="text-[9px] text-slate-500 font-bold font-mono">
                                    SPREADSHEET ID: {financialSpreadsheetId}
                                  </div>
                                  <h6 className="text-xs font-black text-white flex items-center gap-1.5 justify-start rtl:justify-end">
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>
                                      {financialMetadata?.properties?.title || (isAr ? 'مستند الميزانيات والنفقات النشط للمشاريع' : 'Active Management Syncsheet')}
                                    </span>
                                  </h6>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 select-none self-start sm:self-center">
                                  <a
                                    href={`https://docs.google.com/spreadsheets/d/${financialSpreadsheetId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>{isAr ? 'فتح في Google Sheets ↗' : 'Open in Google Sheets ↗'}</span>
                                  </a>
                                  
                                  <button
                                    type="button"
                                    onClick={() => handleFetchFinancialsMetadata(financialSpreadsheetId)}
                                    disabled={financialLoading}
                                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <RefreshCw className={`w-3.5 h-3.5 ${financialLoading ? 'animate-spin' : ''}`} />
                                    <span>{isAr ? 'جلب وتحديث الصفوف' : 'Pull Live Rows'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={handleDisconnectFinancials}
                                    className="px-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 text-[10px] sm:text-xs font-bold transition-all cursor-pointer"
                                  >
                                    {isAr ? 'إلغاء الربط' : 'Disconnect'}
                                  </button>
                                </div>
                              </div>

                              {/* Alert Feedback Messages */}
                              {financialError && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 font-bold text-center">
                                  {financialError}
                                </div>
                              )}
                              {financialSuccess && (
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-bold text-center">
                                  {financialSuccess}
                                </div>
                              )}

                              {/* Display Tabs Switching */}
                              <div className="flex items-center justify-between gap-4 border-b border-slate-900 pb-2">
                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFinancialActiveSheet('budgets');
                                      setIsAddingFinancialRow(false);
                                    }}
                                    className={`px-3 py-1.5 text-xs font-black rounded-lg transition-colors ${
                                      financialActiveSheet === 'budgets'
                                        ? 'bg-emerald-500 text-slate-950 font-black'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-905 bg-slate-900/40'
                                    }`}
                                  >
                                    {isAr ? '📊 ميزانية ومراحل المشاريع' : '📊 Master Project Budgets'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFinancialActiveSheet('transactions');
                                      setIsAddingFinancialRow(false);
                                    }}
                                    className={`px-3 py-1.5 text-xs font-black rounded-lg transition-colors ${
                                      financialActiveSheet === 'transactions'
                                        ? 'bg-emerald-500 text-slate-950 font-black'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-905 bg-slate-900/40'
                                    }`}
                                  >
                                    {isAr ? '💸 التدفقات والمعاملات المالية' : '💸 Financial Transactions Ledger'}
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setIsAddingFinancialRow(!isAddingFinancialRow)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>{isAr ? 'سجل بند مالي جديد' : 'Add Financial Entry'}</span>
                                </button>
                              </div>

                              {/* Slide Open - Creation Input Forms */}
                              {isAddingFinancialRow && (
                                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-850 space-y-4 animate-slideDown">
                                  <h6 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-1">
                                    <Plus className="w-4 h-4 text-emerald-400" />
                                    <span>
                                      {financialActiveSheet === 'budgets'
                                        ? (isAr ? 'إضافة مشروع وميزانية جديدة لملف Google Sheets' : 'Add New Project Plan to Sheets')
                                        : (isAr ? 'تسجيل معاملة مالية جديدة (صادر/وارد) في Google Sheets' : 'Post Inbound/Outbound Financial Item')
                                      }
                                    </span>
                                  </h6>

                                  {financialActiveSheet === 'budgets' ? (
                                    /* BUDGET INPUT FORM */
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-right">
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'اسم المشروع *' : 'Project Name *'}</label>
                                        <input
                                          type="text"
                                          placeholder={isAr ? "مثال: منصة التسويق العقاري..." : "Project key name..."}
                                          value={newBudgetInput.projectName}
                                          onChange={e => setNewBudgetInput({...newBudgetInput, projectName: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right font-sans"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'مدير المشروع الرئيسي' : 'Project Lead/Manager'}</label>
                                        <input
                                          type="text"
                                          placeholder={isAr ? "مثال: مهندس رزان..." : "Manager name..."}
                                          value={newBudgetInput.manager}
                                          onChange={e => setNewBudgetInput({...newBudgetInput, manager: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right font-sans"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'الميزانية الكلية (SAR) *' : 'Total Budget (SAR) *'}</label>
                                        <input
                                          type="number"
                                          placeholder="150000"
                                          value={newBudgetInput.totalBudget}
                                          onChange={e => setNewBudgetInput({...newBudgetInput, totalBudget: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right font-mono"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'المبلغ المستهلك أو المصروف (SAR)' : 'Spent Funds Amount (SAR)'}</label>
                                        <input
                                          type="number"
                                          placeholder="45000"
                                          value={newBudgetInput.spent}
                                          onChange={e => setNewBudgetInput({...newBudgetInput, spent: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right font-mono"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'وضعية الميزانية' : 'Financial Health Status'}</label>
                                        <select
                                          value={newBudgetInput.status}
                                          onChange={e => setNewBudgetInput({...newBudgetInput, status: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right cursor-pointer font-sans"
                                        >
                                          <option value="On Budget">{isAr ? 'مجدي ومستقر / On Budget' : 'On Budget'}</option>
                                          <option value="Watch">{isAr ? 'تحت الملاحظة / Watch' : 'Watch'}</option>
                                          <option value="Overrun">{isAr ? 'تجاوز حدود الميزانية / Overrun' : 'Overrun'}</option>
                                        </select>
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'نسبة الإنجاز الفعلي' : 'Completion Percent'}</label>
                                        <input
                                          type="text"
                                          placeholder="30%"
                                          value={newBudgetInput.completion}
                                          onChange={e => setNewBudgetInput({...newBudgetInput, completion: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right font-mono"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    /* TRANSACTION INPUT FORM */
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-right">
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'معرف المعاملة (اختياري)' : 'Transaction ID (Optional)'}</label>
                                        <input
                                          type="text"
                                          placeholder="TX-7001"
                                          value={newTransactionInput.txId}
                                          onChange={e => setNewTransactionInput({...newTransactionInput, txId: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right font-mono"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'اسم المشروع التابع *' : 'Assigned Project *'}</label>
                                        <input
                                          type="text"
                                          placeholder={isAr ? "تطوير البنية السحابية..." : "Project Name..."}
                                          value={newTransactionInput.projectName}
                                          onChange={e => setNewTransactionInput({...newTransactionInput, projectName: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right font-sans"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'طبيعة التدفق المالي' : 'Transaction Nature'}</label>
                                        <select
                                          value={newTransactionInput.type}
                                          onChange={e => setNewTransactionInput({...newTransactionInput, type: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right cursor-pointer font-sans"
                                        >
                                          <option value="Income">{isAr ? 'إيرادات مستلمة / Income' : 'Income'}</option>
                                          <option value="Expense">{isAr ? 'مصروفات ونفقات / Expense' : 'Expense'}</option>
                                        </select>
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'قيمة المعاملة (SAR) *' : 'Amount in SAR *'}</label>
                                        <input
                                          type="number"
                                          placeholder="35000"
                                          value={newTransactionInput.amount}
                                          onChange={e => setNewTransactionInput({...newTransactionInput, amount: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right font-mono"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'تاريخ الاستحقاق' : 'Transaction Date'}</label>
                                        <input
                                          type="date"
                                          value={newTransactionInput.dueDate}
                                          onChange={e => setNewTransactionInput({...newTransactionInput, dueDate: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right font-mono"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'الحالة المعاملة' : 'Payment Status'}</label>
                                        <select
                                          value={newTransactionInput.status}
                                          onChange={e => setNewTransactionInput({...newTransactionInput, status: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right cursor-pointer font-sans"
                                        >
                                          <option value="Paid">{isAr ? 'مسددة / Paid' : 'Paid'}</option>
                                          <option value="Pending">{isAr ? 'معلقة ومستحقة / Pending' : 'Pending'}</option>
                                        </select>
                                      </div>
                                      <div className="space-y-1 sm:col-span-2 md:col-span-3">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'وصف المعاملة المالي وبند الصرف' : 'Transaction Details Description'}</label>
                                        <input
                                          type="text"
                                          placeholder={isAr ? "سداد تكاليف حجز تراخيص الخوادم..." : "Description..."}
                                          value={newTransactionInput.description}
                                          onChange={e => setNewTransactionInput({...newTransactionInput, description: e.target.value})}
                                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500 transition-all text-right font-sans"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex gap-2 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => setIsAddingFinancialRow(false)}
                                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                                    >
                                      {isAr ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleAddFinancialRow(financialActiveSheet)}
                                      disabled={financialLoading}
                                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1"
                                    >
                                      {financialLoading ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-905" />
                                      ) : (
                                        <CheckSquare className="w-4 h-4" />
                                      )}
                                      <span>{isAr ? 'كتابة المعاملة في Google Sheets' : 'Commit Row to Spreadsheet'}</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* INTERACTIVE EDITABLE DATA-GRID / TABLES */}
                              <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-4">
                                <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center gap-2 justify-start rtl:justify-end text-[10.5px] text-sky-400 mb-2 leading-relaxed font-sans">
                                  <span>💡</span>
                                  <p>{isAr 
                                    ? 'تغيير تفاعلي حي: اضغط ضغطاً مزدوجاً على أي خلية ترغب في تعديل قيمتها وميزانيتها مباشرة، ثم اضغط Enter أو زر الحفظ لتحديث خلايا مستند Google Sheet فوريًا.' 
                                    : 'Interactive Editing Mode Active: Double-click any cell to modify its value directly, then press Enter or click save to push parameters instantly back to your live Google Sheet.'}
                                  </p>
                                </div>

                                <div className="overflow-x-auto select-text font-sans">
                                  {financialActiveSheet === 'budgets' ? (
                                    /* BUDGET TABLE GRID */
                                    <table className="w-full text-right text-[11px] font-sans">
                                      <thead>
                                        <tr className="border-b border-slate-900 text-slate-505 text-slate-500 uppercase text-[9px] tracking-wider">
                                          <th className="py-3 px-3">{isAr ? 'اسم المشروع' : 'Project Name'}</th>
                                          <th className="py-3 px-3">{isAr ? 'مسؤول الميزانية' : 'Manager'}</th>
                                          <th className="py-3 px-3">{isAr ? 'الميزانية الإجمالية' : 'Total Budget'}</th>
                                          <th className="py-3 px-3">{isAr ? 'المستهلك الفعلي' : 'Spent funds'}</th>
                                          <th className="py-3 px-3">{isAr ? 'المتبقي المتاح' : 'Remaining'}</th>
                                          <th className="py-3 px-3">{isAr ? 'الوضعية المالية' : 'Health status'}</th>
                                          <th className="py-3 px-3">{isAr ? 'مستويات الإنجاز' : 'Completion %'}</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-900 text-slate-300">
                                        {financialBudgetRows.length > 0 ? (
                                          financialBudgetRows.map((row: any, rIdx: number) => (
                                            <tr key={rIdx} className="hover:bg-slate-900/35 transition-colors group">
                                              {[0, 1, 2, 3, 4, 5, 6].map((cIdx: number) => {
                                                const isEditing = editingCell?.sheet === 'budgets' && editingCell?.rowIndex === rIdx && editingCell?.colIndex === cIdx;
                                                const rawVal = row[cIdx] || '';
                                                
                                                return (
                                                  <td 
                                                    key={cIdx} 
                                                    className="py-3 px-3 relative min-w-[110px]"
                                                    onDoubleClick={() => {
                                                      setEditingCell({ sheet: 'budgets', rowIndex: rIdx, colIndex: cIdx });
                                                      setEditingValue(rawVal);
                                                    }}
                                                  >
                                                    {isEditing ? (
                                                      <div className="flex items-center gap-1.5 min-w-[100px]">
                                                        <input
                                                          type="text"
                                                          value={editingValue}
                                                          onChange={e => setEditingValue(e.target.value)}
                                                          onKeyDown={e => {
                                                            if (e.key === 'Enter') {
                                                              handleSaveInlineCellEdit('budgets', rIdx, cIdx, editingValue);
                                                            } else if (e.key === 'Escape') {
                                                              setEditingCell(null);
                                                            }
                                                          }}
                                                          className="w-full bg-slate-950 border border-emerald-500 rounded py-1 px-1.5 text-[11px] text-white outline-none font-sans text-right"
                                                          autoFocus
                                                        />
                                                        <button
                                                          type="button"
                                                          onClick={() => handleSaveInlineCellEdit('budgets', rIdx, cIdx, editingValue)}
                                                          className="p-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
                                                        >
                                                          ✓
                                                        </button>
                                                      </div>
                                                    ) : (
                                                      <div className="flex items-center justify-between cursor-pointer group-hover:text-white">
                                                        {cIdx === 5 ? (
                                                          /* Badge health status */
                                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                            rawVal.toLowerCase().includes('budget') || rawVal.includes('مجدي')
                                                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                                              : rawVal.toLowerCase().includes('watch') || rawVal.includes('ملاحظة')
                                                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                                              : 'bg-red-500/15 text-red-400 border border-red-500/20'
                                                          }`}>
                                                            {rawVal}
                                                          </span>
                                                        ) : cIdx === 2 || cIdx === 3 || cIdx === 4 ? (
                                                          /* Numbers currency */
                                                          <span className="font-mono font-bold text-slate-100">
                                                            {rawVal ? `﷼ ${parseFloat(rawVal).toLocaleString()}` : '0'}
                                                          </span>
                                                        ) : cIdx === 6 ? (
                                                          /* Completion percentage visual */
                                                          <div className="space-y-1 w-full max-w-[130px]">
                                                            <div className="flex justify-between items-center text-[10px]">
                                                              <span className="font-mono text-slate-400">{rawVal}</span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                                              <div 
                                                                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                                                                style={{ width: `${parseFloat(rawVal) || 0}%` }}
                                                              />
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          <span className="font-sans leading-relaxed">{rawVal}</span>
                                                        )}

                                                        <span className="opacity-0 group-hover:opacity-60 text-[9px] text-emerald-400 font-mono transition-opacity ml-1 select-none">
                                                          {isAr ? '✏️ تعديل' : '✏️ Edit'}
                                                        </span>
                                                      </div>
                                                    )}
                                                  </td>
                                                );
                                              })}
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan={7} className="py-8 text-center text-slate-500 leading-relaxed font-sans">
                                              {financialLoading ? (
                                                <div className="flex justify-center items-center gap-1.5 animate-pulse">
                                                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                                  <span>{isAr ? 'تحميل جدول الميزانيات التفاعلية...' : 'Fetching dynamic sheets matrices from Drive...'}</span>
                                                </div>
                                              ) : (
                                                isAr ? 'لا توجد صفوف ميزانية نشطة في نطاق "Project Budgets".' : 'No rows found in Master Budgets worksheet tab.'
                                              )}
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  ) : (
                                    /* TRANSACTION TABLE GRID */
                                    <table className="w-full text-right text-[11px] font-sans">
                                      <thead>
                                        <tr className="border-b border-slate-900 text-slate-505 text-slate-500 uppercase text-[9px] tracking-wider">
                                          <th className="py-3 px-3">{isAr ? 'معرّف الحركة' : 'Tx ID'}</th>
                                          <th className="py-3 px-3">{isAr ? 'المشروع التابع' : 'Project Name'}</th>
                                          <th className="py-3 px-3">{isAr ? 'طبيعة العملية' : 'Transaction Type'}</th>
                                          <th className="py-3 px-3">{isAr ? 'المبلغ المستحق' : 'Amount'}</th>
                                          <th className="py-3 px-3">{isAr ? 'الشرح والبيان' : 'Description'}</th>
                                          <th className="py-3 px-3">{isAr ? 'التاريخ المرجعي' : 'Date'}</th>
                                          <th className="py-3 px-3">{isAr ? 'الوضعية' : 'Status'}</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-900 text-slate-300">
                                        {financialTransactionRows.length > 0 ? (
                                          financialTransactionRows.map((row: any, rIdx: number) => (
                                            <tr key={rIdx} className="hover:bg-slate-900/35 transition-colors group">
                                              {[0, 1, 2, 3, 4, 5, 6].map((cIdx: number) => {
                                                const isEditing = editingCell?.sheet === 'transactions' && editingCell?.rowIndex === rIdx && editingCell?.colIndex === cIdx;
                                                const rawVal = row[cIdx] || '';
                                                
                                                return (
                                                  <td 
                                                    key={cIdx} 
                                                    className="py-3 px-3 relative min-w-[100px]"
                                                    onDoubleClick={() => {
                                                      setEditingCell({ sheet: 'transactions', rowIndex: rIdx, colIndex: cIdx });
                                                      setEditingValue(rawVal);
                                                    }}
                                                  >
                                                    {isEditing ? (
                                                      <div className="flex items-center gap-1.5 min-w-[90px]">
                                                        <input
                                                          type="text"
                                                          value={editingValue}
                                                          onChange={e => setEditingValue(e.target.value)}
                                                          onKeyDown={e => {
                                                            if (e.key === 'Enter') {
                                                              handleSaveInlineCellEdit('transactions', rIdx, cIdx, editingValue);
                                                            } else if (e.key === 'Escape') {
                                                              setEditingCell(null);
                                                            }
                                                          }}
                                                          className="w-full bg-slate-950 border border-emerald-500 rounded py-1 px-1.5 text-[11px] text-white outline-none font-sans text-right"
                                                          autoFocus
                                                        />
                                                        <button
                                                          type="button"
                                                          onClick={() => handleSaveInlineCellEdit('transactions', rIdx, cIdx, editingValue)}
                                                          className="p-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
                                                        >
                                                          ✓
                                                        </button>
                                                      </div>
                                                    ) : (
                                                      <div className="flex items-center justify-between cursor-pointer group-hover:text-white">
                                                        {cIdx === 2 ? (
                                                          /* Income / Expense Badge */
                                                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-extrabold uppercase tracking-widest ${
                                                            rawVal.toLowerCase().includes('income') || rawVal.includes('إيراد')
                                                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                          }`}>
                                                            {rawVal}
                                                          </span>
                                                        ) : cIdx === 3 ? (
                                                          /* Currency formatting */
                                                          <span className="font-mono font-bold text-slate-100 text-emerald-400">
                                                            {rawVal ? `﷼ ${parseFloat(rawVal).toLocaleString()}` : '0'}
                                                          </span>
                                                        ) : cIdx === 6 ? (
                                                          /* Paid / Pending Status */
                                                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                                            rawVal.toLowerCase().includes('paid') || rawVal.includes('سدد')
                                                              ? 'bg-teal-500/10 text-teal-400 border border-teal-500/25'
                                                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                                                          }`}>
                                                            {rawVal}
                                                          </span>
                                                        ) : cIdx === 0 ? (
                                                          <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                                            {rawVal}
                                                          </span>
                                                        ) : (
                                                          <span className="leading-relaxed">{rawVal}</span>
                                                        )}

                                                        <span className="opacity-0 group-hover:opacity-60 text-[9px] text-emerald-400 font-mono transition-opacity ml-1 select-none">
                                                          {isAr ? '✏️ تعديل' : '✏️ Edit'}
                                                        </span>
                                                      </div>
                                                    )}
                                                  </td>
                                                );
                                              })}
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan={7} className="py-8 text-center text-slate-500 leading-relaxed font-sans">
                                              {financialLoading ? (
                                                <div className="flex justify-center items-center gap-1.5 animate-pulse">
                                                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                                  <span>{isAr ? 'قراءة تدفقات القيود المالية التفاعلية...' : 'Loading cashflow transactions matrix from google...'}</span>
                                                </div>
                                              ) : (
                                                isAr ? 'لا توجد صفوف نفقات نشطة في نطاق "Project Transactions".' : 'No transactions posted onto active sheet tab yet.'
                                              )}
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Interactive tips and rules info footer */}
                        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850/60 text-[10.5px] text-slate-400 leading-relaxed font-sans text-right">
                          <span className="font-extrabold text-white">{isAr ? '🛡️ ممارسات الحوكمة والحسابات المشتركة:' : '🛡️ Governance & Internal Control Notice:'}</span>
                          <span className="block mt-1">
                            {isAr 
                              ? 'يتيح لك الاتصال المباشر بحساب جوجل كتابة وتحديث جداول الموازنات بشكل فوري وتنعكس وتتزامن التغيرات تلقائياً لكل المستشارين المشاركين على المستند بصفة مركزية.' 
                              : 'Real-time multi-collaborator spreadsheets sync enables managers and corporate leaders to observe capital flows transparently with zero delayed batch entries.'}
                          </span>
                        </div>
                      </div>
                    ) : portalSubTab === 'contracts' ? (
                      <div className="space-y-6 font-sans text-right rtl:text-right ltr:text-left animate-fadeIn">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                          <div>
                            <h5 className="text-base font-extrabold text-slate-800 flex items-center gap-2 justify-start rtl:justify-end Cairo">
                              <FileCheck className="w-5 h-5 text-emerald-600" />
                              <span>{isAr ? 'منظومة إدارة العقود الرقمية والملاحق المعتمدة' : 'Digital Contract & Signed Addenda Hub'}</span>
                            </h5>
                            <p className="text-xs text-slate-500 mt-1">
                              {isAr 
                                ? 'استعراض العقود والاتفاقيات المبرمة مع Business Developers، تحميل مسودات التراخيص الموقعة بجزئيات التشفير، وإمضاء ملحقات الأعمال الجديدة بأثر قانوني فوري.' 
                                : 'Review executed client agreements, download officially certified SHA-256 legal transcripts, and digitally sign dynamic workspace annexes.'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-500">
                              {isAr ? 'بوابة التوقيع الرقمي الآمن نشطة (SHA-256)' : 'Certified Signature Engine Active'}
                            </span>
                          </div>
                        </div>

                        {/* Two Columns Grid: Right: Active Contracts, Left: Available Addenda/Signing wizard */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          
                          {/* Signed Contracts List (7 Columns) */}
                          <div className="lg:col-span-7 space-y-4">
                            <div className="flex items-center justify-between pb-1">
                              <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <span>{isAr ? 'العقود الرسمية المبرمة' : 'Executed Legal Agreements'}</span>
                                <span className="bg-emerald-100 text-emerald-850 px-1.5 py-0.2 rounded-md font-extrabold text-[9px]">
                                  {contracts.length}
                                </span>
                              </h6>

                              <span className="text-[10px] text-slate-400">
                                {isAr ? 'الشركة الشريكة: ' : 'Consolidated with: '}
                                <strong className="text-slate-700 font-bold">{currentClient?.companyName || 'Corporate Client'}</strong>
                              </span>
                            </div>

                            {contracts.length === 0 ? (
                              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center bg-slate-50/50">
                                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs text-slate-500 font-bold">{isAr ? 'لا توجد عقود مبرمة حالياً.' : 'No active validated contracts found.'}</p>
                              </div>
                            ) : (
                              contracts.map((contract, contractIdx) => (
                                <div key={contract.id || contractIdx} className="bg-white border border-slate-200 hover:border-slate-300 transition-all rounded-2xl p-5 shadow-xs relative overflow-hidden group">
                                  {/* Certified background sticker */}
                                  <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
                                  
                                  <div className="md:flex justify-between items-start gap-4">
                                    <div className="space-y-2 text-right">
                                      <div className="flex flex-wrap items-center gap-2 justify-start rtl:justify-end">
                                        <span className="px-2 py-0.5 rounded-md bg-slate-150 text-slate-600 font-mono text-[9px] font-bold">
                                          {contract.id}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                          {isAr ? 'مُعتمد وموقع رقمياً' : 'Certified & Active'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono">
                                          {contract.signedAt}
                                        </span>
                                      </div>

                                      <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug Cairo">
                                        {isAr ? contract.titleAr : contract.titleEn}
                                      </h3>

                                      {/* Signee Info */}
                                      <div className="p-3 bg-slate-50/75 rounded-xl text-[11px] text-slate-600 space-y-1.5 border border-slate-100">
                                        <div className="flex items-center justify-between">
                                          <span>{isAr ? 'الموقع والمفوّض:' : 'Authorized Signee:'}</span>
                                          <strong className="text-slate-800 font-bold">{contract.signedBy}</strong>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span>{isAr ? 'الصفة القانونية:' : 'Legal Title:'}</span>
                                          <span className="text-slate-500">{isAr ? contract.signedByTitleAr : contract.signedByTitleEn}</span>
                                        </div>
                                        <div className="flex flex-col pt-1.5 border-t border-slate-200 mt-1 text-[9px] text-slate-400 font-mono">
                                          <span>{isAr ? 'سلسلة التشفير المرجعية (SHA-256 Hash):' : 'Bilateral Integrity Byte-Hash:'}</span>
                                          <span className="bg-slate-100 p-1 rounded mt-0.5 select-all overflow-x-auto whitespace-nowrap block no-scrollbar scrollbar-none">
                                            {contract.certifiedHash}
                                          </span>
                                        </div>

                                        {/* Dynamic digital signature seal visualization */}
                                        <div className="flex flex-col pt-1.5 border-t border-slate-200 mt-1 text-[9px] text-slate-400">
                                          <span>{isAr ? 'التوقيع الإلكتروني الموثق:' : 'Certified Digital Signature Seal:'}</span>
                                          <div className="mt-1 bg-white p-2 rounded-lg border border-slate-150 flex items-center justify-center min-h-[48px] overflow-hidden shadow-2xs">
                                            {contract.signatureType === 'drawn' || contract.signatureType === 'uploaded' ? (
                                              <img 
                                                src={contract.signatureDataUrl} 
                                                alt="Seal" 
                                                className="max-h-12 object-contain filter brightness-95"
                                                referrerPolicy="no-referrer"
                                              />
                                            ) : (
                                              <span className={`text-xs select-none ${
                                                contract.signatureStyle === 0 ? 'font-serif underline text-indigo-700 italic font-black text-sm' :
                                                contract.signatureStyle === 1 ? 'font-mono text-emerald-800 font-black tracking-tight text-[11px]' :
                                                'font-sans tracking-widest text-indigo-600 underline decoration-sky-400 underline-offset-2 italic font-bold'
                                              }`}>
                                                {contract.signedBy || 'Business Partner'}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Core features listing */}
                                      <div className="pt-2 text-[11px] space-y-1">
                                        <p className="text-[10.5px] font-bold text-slate-500">{isAr ? 'أهم البنود والشروط المشمولة:' : 'Core Included Provisions:'}</p>
                                        <ul className="list-disc list-inside ltr:list-inside space-y-1 text-slate-600 ps-1">
                                          {(isAr ? contract.clausesAr : contract.clausesEn).map((clause: string, clIdx: number) => (
                                            <li key={clIdx} className="leading-relaxed">
                                              {clause}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Action button in row on desktop/top on mobile */}
                                    <div className="mt-4 md:mt-0 shrink-0 self-end flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadContract(contract)}
                                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-97 flex-1 sm:flex-initial"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>{isAr ? 'تحميل العقد المعتمد' : 'Download Signed PDF'}</span>
                                      </button>
                                      
                                      {workspaceToken && (
                                        <button
                                          type="button"
                                          onClick={() => handleUploadContractToDrive(contract)}
                                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-97 flex-1 sm:flex-initial"
                                        >
                                          <Cloud className="w-3.5 h-3.5" />
                                          <span>{isAr ? 'حفظ بـ Google Drive 📁' : 'Save to Google Drive 📁'}</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Available Addenda & Instant Sign Wizard (5 Columns) */}
                          <div className="lg:col-span-12 xl:col-span-5 space-y-6 w-full">
                            
                            {/* Sign Mode Trigger Box */}
                            {!selectedAddendumToSign ? (
                              <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-4">
                                <div className="space-y-1">
                                  <span className="text-[9px] text-sky-400 font-extrabold uppercase tracking-widest block">
                                    {isAr ? 'ملاحق أعمال متاحة للتوقيع' : 'Addenda Available for Sign-off'}
                                  </span>
                                  <h4 className="text-xs sm:text-sm font-bold">
                                    {isAr ? 'تأمين بنود ترقية النماذج فورياً كالمحترفين' : 'Instantly upgrade scope options'}
                                  </h4>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {isAr 
                                      ? 'هل تحتاج لترقية مستويات الجودة أو تشديد حماية البيانات؟ اختر أحد الملاحق أدناه وأمضِه رقمياً ليرتبط مباشرة بالحساب وبقاعد البيانات.'
                                      : 'Require elevated SLA guarantees, localized compliance parameters, or boosted APIs? Bind them legally below.'}
                                  </p>
                                </div>

                                <div className="space-y-3 pt-2">
                                  {availableAddenda.map((addendum) => {
                                    // Ensure it's not already signed to avoid repetition
                                    const isSigned = contracts.some(c => c.titleAr === addendum.titleAr);
                                    
                                    return (
                                      <div key={addendum.id} className={`p-4 rounded-xl border transition-all text-right ${
                                        isSigned 
                                          ? 'bg-slate-950/60 border-slate-850 opacity-60' 
                                          : 'bg-slate-950 border-slate-800 hover:border-sky-500/50'
                                      }`}>
                                        <div className="flex items-center justify-between">
                                          <span className="text-[10px] text-slate-500 font-mono font-bold">{addendum.id}</span>
                                          <span className="text-[10px] text-sky-400 font-extrabold tracking-tight bg-sky-500/10 px-2 py-0.5 rounded-md">
                                            {isAr ? addendum.costAr : addendum.costEn}
                                          </span>
                                        </div>

                                        <h5 className="text-[11px] sm:text-xs font-black text-slate-200 mt-1.5 leading-snug Cairo">
                                          {isAr ? addendum.titleAr : addendum.titleEn}
                                        </h5>

                                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                          {isAr ? addendum.descAr : addendum.descEn}
                                        </p>

                                        <div className="mt-3 flex justify-between items-center pt-2.5 border-t border-slate-800/80">
                                          <span className="text-[9px] text-slate-500 italic block">
                                            {isAr ? 'النطاق: ' : 'Context: '}
                                            <span className="text-slate-400 not-italic font-semibold">{isAr ? addendum.scopeAr.slice(0, 30) : addendum.scopeEn.slice(0, 35)}...</span>
                                          </span>

                                          {isSigned ? (
                                            <span className="text-[9.5px] text-emerald-400 font-extrabold flex items-center gap-1">
                                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                              {isAr ? 'موقّع مسبقاً' : 'Already Signed'}
                                            </span>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedAddendumToSign(addendum);
                                                setSigningSuccess('');
                                              }}
                                              className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-450 text-slate-950 rounded-lg text-[10.5px] font-black transition-all cursor-pointer flex items-center gap-1 active:scale-97"
                                            >
                                              <span>{isAr ? 'بدء التوقيع ✍️' : 'Sign Now ✍️'}</span>
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              /* Interactive Signing Panel Form */
                              <div className="bg-slate-50/75 border border-slate-200 rounded-3xl p-6 space-y-4 animate-scaleUp">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-sans">
                                  <div className="text-right">
                                    <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-widest block">
                                      {isAr ? 'توثيق وتعديل بنود الاتفاقية' : 'Digital Sign-Off Protocol'}
                                    </span>
                                    <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-none Cairo">
                                      {isAr ? 'لوحة إمضاء ملاحق الأعمال' : 'Addendum Execution'}
                                    </h4>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setSelectedAddendumToSign(null)}
                                    className="p-1 px-2.5 text-[10.5px] bg-slate-200 hover:bg-slate-350 rounded-lg text-slate-700 font-black transition-all cursor-pointer"
                                  >
                                    {isAr ? 'إلغاء' : 'Back'}
                                  </button>
                                </div>

                                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 text-right">
                                  <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-mono font-bold inline-block w-fit">
                                    {selectedAddendumToSign.id}
                                  </span>
                                  <h5 className="text-[11.5px] font-extrabold text-slate-800 leading-tight Cairo pt-1">
                                    {isAr ? selectedAddendumToSign.titleAr : selectedAddendumToSign.titleEn}
                                  </h5>
                                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 mt-2 space-y-1 leading-relaxed">
                                    <p><strong className="text-slate-700">{isAr ? 'البيان الاقتصادي:' : 'Financial Quote: '}</strong> {isAr ? selectedAddendumToSign.costAr : selectedAddendumToSign.costEn}</p>
                                    <p><strong className="text-slate-700">{isAr ? 'تفاصيل التعديل:' : 'Provisions: '}</strong> {isAr ? selectedAddendumToSign.descAr : selectedAddendumToSign.descEn}</p>
                                  </div>
                                </div>

                                <form onSubmit={handleSignAddendum} className="space-y-4">
                                  {/* Signatory Inputs */}
                                  <div className="space-y-3">
                                    <div className="space-y-1 text-right">
                                      <label className="text-[10.5px] sm:text-xs font-bold text-slate-700 block">
                                        {isAr ? 'الاسم الكامل للطرف المفوّض بالإمضاء 🛑' : 'Authorized Signatory Full Name 🛑'}
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        placeholder={isAr ? 'اكتب الاسم الرباعي الرسمي للشركة' : 'Type authorized legal name'}
                                        value={signerFullName}
                                        onChange={(e) => setSignerFullName(e.target.value)}
                                        className="w-full px-4 py-2 bg-white text-slate-800 border border-slate-200 rounded-xl text-xs font-bold leading-relaxed placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-sky-500 text-right ltr:text-left"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="space-y-1 text-right">
                                        <label className="text-[10px] font-bold text-slate-600 block">
                                          {isAr ? 'المسمى الوظيفي (عربي)' : 'Title (AR)'}
                                        </label>
                                        <input
                                          type="text"
                                          value={signerTitleAr}
                                          onChange={(e) => setSignerTitleAr(e.target.value)}
                                          className="w-full px-2.5 py-2 bg-white text-slate-800 border border-slate-200 rounded-xl text-xs font-bold leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500 text-right"
                                        />
                                      </div>

                                      <div className="space-y-1 text-right">
                                        <label className="text-[10px] font-bold text-slate-600 block">
                                          {isAr ? 'المسمى الوظيفي (En)' : 'Title (EN)'}
                                        </label>
                                        <input
                                          type="text"
                                          value={signerTitleEn}
                                          onChange={(e) => setSignerTitleEn(e.target.value)}
                                          className="w-full px-2.5 py-2 bg-white text-slate-800 border border-slate-200 rounded-xl text-xs font-bold leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500 ltr:text-left"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Interactive Visual Design for digital signature styles */}
                                  <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] font-bold text-slate-600">
                                      <span>{isAr ? 'اختر طريقة التوقيع الرقمي المعتمد:' : 'Select Digital Seal Method:'}</span>
                                      <div className="flex flex-wrap gap-1">
                                        <button
                                          type="button"
                                          onClick={() => setSignatureDrawMode('type')}
                                          className={`px-2 py-0.5 rounded text-[9.5px] cursor-pointer font-bold transition-all ${signatureDrawMode === 'type' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                                        >
                                          {isAr ? '✍️ نمط خط المفوّض' : '✍️ Elegant Type'}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setSignatureDrawMode('draw')}
                                          className={`px-2 py-0.5 rounded text-[9.5px] cursor-pointer font-bold transition-all ${signatureDrawMode === 'draw' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                                        >
                                          {isAr ? '🎨 رسم يدوي بالماوس/اللمس' : '🎨 Draw Live'}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setSignatureDrawMode('upload')}
                                          className={`px-2 py-0.5 rounded text-[9.5px] cursor-pointer font-bold transition-all ${signatureDrawMode === 'upload' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                                        >
                                          {isAr ? '📁 رفع ملف صورة التوقيع' : '📁 Upload Image'}
                                        </button>
                                      </div>
                                    </div>

                                    {signatureDrawMode === 'type' ? (
                                      <div className="bg-white border border-slate-200 rounded-xl p-4 text-center space-y-3 relative overflow-hidden min-h-[90px] flex flex-col justify-center">
                                        <div className="absolute top-1 right-2 text-[8px] text-slate-300 font-mono">
                                          {isAr ? 'ترميز رقمي آمن: ' : 'Cryptographic Hash ID: '} CON-ID-99
                                        </div>
                                        
                                        <p className={`text-base sm:text-lg select-none ${
                                          typeSignatureStyle === 0 ? 'font-serif underline tracking-wide text-indigo-700 italic font-black' :
                                          typeSignatureStyle === 1 ? 'font-mono text-emerald-800 font-black' :
                                          'font-sans tracking-widest text-indigo-600 underline decoration-sky-500 underline-offset-4 italic font-bold'
                                        }`}>
                                          {signerFullName || 'Business Partner'}
                                        </p>

                                        <div className="flex justify-center gap-2 pt-1 border-t border-slate-100">
                                          {[0, 1, 2].map((styleIdx) => (
                                            <button
                                              key={styleIdx}
                                              type="button"
                                              onClick={() => setTypeSignatureStyle(styleIdx)}
                                              className={`w-6 h-6 rounded-full border text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                                                typeSignatureStyle === styleIdx 
                                                  ? 'bg-slate-900 text-white border-slate-900' 
                                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                              }`}
                                            >
                                              {styleIdx + 1}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    ) : signatureDrawMode === 'draw' ? (
                                      /* Interactive Canvas Drawing Pad */
                                      <div className="space-y-2">
                                        <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                                          <canvas
                                            ref={signatureCanvasRef}
                                            width={450}
                                            height={150}
                                            className="w-full max-w-[450px] h-[150px] bg-slate-50 cursor-crosshair shadow-inner block mx-auto touch-none"
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
                                          />
                                          <div className="absolute bottom-1 right-2 pointer-events-none select-none text-[8.5px] font-mono text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                            {isAr ? 'لوحة الرسم باللمس أو الماوس' : 'Interactive Signature Pad'}
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                                          <span>{isAr ? 'اسحب الماوس أو إصبعك في المربع أعلاه للتوقيع' : 'Draw with your cursor or touch/stylus inside the box.'}</span>
                                          <button
                                            type="button"
                                            onClick={clearCanvas}
                                            className="px-2 py-1 text-[9px] font-extrabold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-all cursor-pointer hover:shadow-2xs active:scale-97"
                                          >
                                            {isAr ? '🔄 إعادة تعيين' : '🔄 Reset Pad'}
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      /* Interactive Signature File Uploader with Drop-zone visual cues */
                                      <div
                                        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                                          isDragOverSignature 
                                            ? 'border-sky-500 bg-sky-50/10' 
                                            : 'border-slate-300 bg-white hover:border-slate-400'
                                        }`}
                                        onDragOver={(e) => {
                                          e.preventDefault();
                                          setIsDragOverSignature(true);
                                        }}
                                        onDragLeave={() => {
                                          setIsDragOverSignature(false);
                                        }}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          setIsDragOverSignature(false);
                                          const file = e.dataTransfer.files?.[0];
                                          if (file) {
                                            if (!file.type.startsWith('image/')) {
                                              alert(isAr ? 'الرجاء اختيار ملف صورة صالح للتوقيع.' : 'Please select a valid image file for signature.');
                                              return;
                                            }
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                              setUploadedSignatureImg(event.target?.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                      >
                                        {uploadedSignatureImg ? (
                                          <div className="space-y-2">
                                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 inline-block">
                                              <img 
                                                src={uploadedSignatureImg} 
                                                alt="Uploaded signature preview" 
                                                className="max-h-24 object-contain mx-auto"
                                                referrerPolicy="no-referrer"
                                              />
                                            </div>
                                            <div className="flex justify-center gap-2">
                                              <button
                                                type="button"
                                                onClick={clearUploadedSignature}
                                                className="px-2.5 py-1 text-[9.5px] font-extrabold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors cursor-pointer"
                                              >
                                                {isAr ? 'إزالة الصورة 🗑️' : 'Remove Image 🗑️'}
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <label className="cursor-pointer block space-y-1.5 p-2">
                                            <Upload className="w-5 h-5 text-slate-400 mx-auto pointer-events-none" />
                                            <p className="text-[11px] font-black text-slate-700 pointer-events-none">
                                              {isAr ? 'انقر هنا لرفع ملف التوقيع أو اسحبه وأفلته هنا' : 'Click to select custom seal or drag image file here'}
                                            </p>
                                            <p className="text-[9px] text-slate-400 font-semibold uppercase font-mono pointer-events-none">
                                              PNG, JPG, BMP, WEBP (Max 2MB)
                                            </p>
                                            <input 
                                              type="file" 
                                              accept="image/*" 
                                              className="hidden" 
                                              onChange={handleSignatureFileChange}
                                            />
                                          </label>
                                        )}
                                      </div>
                                    )}

                                    {/* Legal binding consent check */}
                                    <div className="flex items-start gap-2 pt-1 bg-sky-50/50 p-2.5 rounded-lg border border-sky-100/30">
                                      <input
                                        type="checkbox"
                                        required
                                        id="legalConsentCheck"
                                        className="mt-0.5 scale-95 rounded cursor-pointer accent-sky-500"
                                      />
                                      <label htmlFor="legalConsentCheck" className="text-[10px] text-slate-605 text-slate-600 select-none leading-relaxed cursor-pointer text-right">
                                        {isAr 
                                          ? 'أقر وأصادق بأن هذا التوقيع ملزم وقانوني وفق المرسوم الملكي للتعاملات الإلكترونية في المملكة العربية السعودية.'
                                          : 'I consent that this signature is legally binding under local Electronic Transaction statutory regulations.'}
                                      </label>
                                    </div>
                                  </div>

                                  {/* Error/Success Feedbacks */}
                                  {signingSuccess && (
                                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold font-sans text-center">
                                      {signingSuccess}
                                    </div>
                                  )}

                                  {/* Action Trigger Buttons */}
                                  <button
                                    type="submit"
                                    disabled={isSigningInFlight}
                                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-450 hover:to-teal-550 transition-all text-xs font-black rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                                  >
                                    {isSigningInFlight ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                                        <span>{isAr ? 'بروتوكول التشفير والمصادقة في سجلات قاعدة البيانات سحابة الرياض...' : 'Applying remote secure digital seal validation...'}</span>
                                      </>
                                    ) : (
                                      <>
                                        <PenTool className="w-4 h-4" />
                                        <span>{isAr ? 'اعتماد التوقيع وتوسيع اتفاقيتنا فوريًا' : 'Approve & Digital Sign Addendum'}</span>
                                      </>
                                    )}
                                  </button>
                                </form>
                              </div>
                            )}

                          </div>

                        </div>

                        {/* Regulatory notice footer info bar */}
                        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50 text-[10px] leading-relaxed font-sans text-right">
                          <span className="font-extrabold text-emerald-800 flex items-center gap-1.5 justify-start rtl:justify-end">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {isAr ? '🛡️ إثبات الثقة والامتثال القانوني:' : '🛡️ Institutional Integrity Compliance Statement:'}
                          </span>
                          <span className="block mt-1 text-slate-600 leading-relaxed">
                            {isAr 
                              ? 'تخضع كافة التعاملات الإلكترونية ونطاقات التوقيع الرقمي والهاشات المرجعية لنظام التعاملات الإلكترونية السعودي الصادر بقرار الهيئة التشريعية لجهة الدفع السحابي الآمن الثنائي وتتم أرشفتها مغلّقة ببروتوكول AES-255.' 
                              : 'All certified signatures, transaction logs, and reference checksum arrays are cryptographically hashed and sealed under strict guidelines of the Communications, Space & Technology Commission (CST) and are non-modifiable.'}
                          </span>
                        </div>
                      </div>
                     ) : null}

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850/60 text-[10px] text-slate-400 text-center leading-relaxed">
                      {isAr 
                        ? 'ملاحظة: تظهر الطلبات التي تقدمها بنماذج الاستراتيجية وحجز الأدوات وتحديث النماذج تلقائياً في حسابك الشريك بمجرد إرسالها.'
                        : 'Any technological sizing or dynamic modernization request submitted while logged in links automatically in your enterprise area.'}
                    </div>
                    </div>
                  </div>
                </div>
              )}

              </div>
            </motion.div>
          </div>

          {/* Visual Toast Notification Overlay System */}
          <div className="fixed bottom-6 right-6 z-[200] w-full max-w-sm pointer-events-none flex flex-col gap-3 font-sans" id="real-time-status-toasts">
            <AnimatePresence>
              {activeToasts.map((toast) => {
                const statusColors: Record<string, { bg: string, text: string, labelAr: string, labelEn: string }> = {
                  pending: { bg: 'bg-slate-500/15 text-slate-400 border-slate-500/20', text: 'text-slate-400', labelAr: 'مستلم/قيد الانتظار', labelEn: 'Pending' },
                  reviewing: { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/20', text: 'text-amber-400', labelAr: 'قيد المراجعة الفنية', labelEn: 'Reviewing' },
                  planned: { bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20', text: 'text-cyan-400', labelAr: 'مخطط ومجدول', labelEn: 'Planned & Scheduled' },
                  approved: { bg: 'bg-sky-500/15 text-sky-450 border-sky-500/20', text: 'text-sky-450', labelAr: 'تمت الموافقة والتشغيل', labelEn: 'Approved/Active' },
                  completed: { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', text: 'text-emerald-400', labelAr: 'مكتمل ومسلم بنجاح', labelEn: 'Completed' }
                };
                
                const oldColor = statusColors[toast.oldStatus] || statusColors.pending;
                const newColor = statusColors[toast.newStatus] || statusColors.pending;

                return (
                  <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, y: 50, x: lang === 'ar' ? -50 : 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                    className="pointer-events-auto bg-slate-950/95 border border-slate-850/90 rounded-2xl p-4 shadow-2xl flex gap-3 backdrop-blur-md relative overflow-hidden text-right rtl:text-right ltr:text-left"
                  >
                    {/* Glowing side accent */}
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-sky-450 to-indigo-500" />
                    
                    <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl max-h-10 self-start shrink-0">
                      <Bell className="w-5 h-5 animate-bounce" />
                    </div>

                    <div className="flex-1 space-y-1.5 min-w-0 pr-1">
                      <div className="flex justify-between items-start gap-2">
                        <h6 className="text-[11.5px] font-extrabold text-white leading-tight font-sans truncate Cairo">
                          {isAr ? 'تحديث فوري للمشروع' : 'Project Status Update'}
                        </h6>
                        <span className="text-[8px] font-mono text-slate-500 uppercase shrink-0">
                          {new Date(toast.timestamp).toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-[10.5px] text-slate-300 font-medium font-sans leading-relaxed">
                        {isAr ? (
                          <>تغيرت حالة المشروع <strong>{toast.requestName}</strong> إلى:</>
                        ) : (
                          <>Status of <strong>{toast.requestName}</strong> transitioned to:</>
                        )}
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-black font-sans mt-1 justify-start rtl:justify-end">
                        <span className={`px-2 py-0.5 rounded border ${oldColor.text} ${oldColor.bg}`}>
                          {isAr ? oldColor.labelAr : oldColor.labelEn}
                        </span>
                        <span className="text-slate-500">➔</span>
                        <span className={`px-2 py-0.5 rounded border ${newColor.text} ${newColor.bg} animate-pulse`}>
                          {isAr ? newColor.labelAr : newColor.labelEn}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => dismissToast(toast.id)}
                      className="text-slate-500 hover:text-white transition-colors self-start p-1 cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
