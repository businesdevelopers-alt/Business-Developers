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
  Eye
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
  Legend
} from 'recharts';

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
  onScrollToConsultation
}: ClientPortalProps) {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [portalSubTab, setPortalSubTab] = useState<'requests' | 'invoices' | 'databases'>('requests');

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
  const [dbActiveSection, setDbActiveSection] = useState<'clients' | 'requests' | 'invoices'>('clients');
  const [dbClientFormOpen, setDbClientFormOpen] = useState(false);
  const [dbInvoiceFormOpen, setDbInvoiceFormOpen] = useState(false);

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
            titleAr: 'حوكمة الابتكار وقياس الأثر الملموس',
            descEn: 'Implement review workflows, sandbox filters, and impact indicators checking ideas value return.',
            descAr: 'إنشاء هياكل الحوكمة والمصفوفات التقييمية ومؤشرات تتبع الأثر الإيجابي والملموس.',
            roleEn: 'Governance & Value Lead',
            roleAr: 'مدير حوكمة الابتكار وقياس الأثر'
          },
          {
            titleEn: 'Innovation Lab Setup & Tooling',
            titleAr: 'تأسيس وتشغيل معامل الابتكار التجريبية',
            descEn: 'Design and deploy physical or digital sandbox environments supportive of ideation streams.',
            descAr: 'تخطيط وتفعيل البيئات الحاضنة للأفكار وبرمجيات تسريع النمذجة السريعة للمنتجات.',
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

      case 'ai-ml':
        taskTemplates = [
          {
            titleEn: 'Data Ingestion & Dataset Slicing Strategy',
            titleAr: 'تصميم هيكل توريد وتنقية البيانات للتدريب',
            descEn: 'Compile relevant multi-source corporate datasets and remove null-fields or bias elements.',
            descAr: 'تجميع وتخزين مجموعات البيانات التدريبية من مصادرها وتنظيفها من القيم الفارغة والانحياز.',
            roleEn: 'Lead Data Architect',
            roleAr: 'كبير مهندسي البيانات الاستراتيجية'
          },
          {
            titleEn: 'Feature Engineering & Model Feasibility Scoping',
            titleAr: 'تحديد المدخلات البرمجية واختبار ملاءمة النموذج',
            descEn: 'Evaluate whether random forests, deep architectures, or transformer embeddings yield optimal scores.',
            descAr: 'تحليل الأفضلية بين خوارزميات التعلم العميق أو النماذج المعالجة للغات للحصول على أفضل دقة.',
            roleEn: 'AI Research Scientist',
            roleAr: 'عالم أبحاث الذكاء الاصطناعي'
          },
          {
            titleEn: 'AI Model Prototyping & Pipeline Drafting',
            titleAr: 'بناء النموذج الأولي وإعداد مسار التدريب الآلي',
            descEn: 'Develop initial notebook models and automate periodic training cycles using active workflows.',
            descAr: 'بناء البيئة الأولية وتطوير خوارزميات التدريب المعيارية بمسارات معالجة مؤتمتة.',
            roleEn: 'MLOps Engineer',
            roleAr: 'مهندس عمليات التعلم الآلي'
          },
          {
            titleEn: 'Interactive Hyperparameter Optimization',
            titleAr: 'دوزنة معاملات دقة النموذج والتحقق من الأوزان',
            descEn: 'Refine loss functions, dropout rates, and batch shapes to eliminate overfitting anomalies.',
            descAr: 'تحسين دقة الاستدلال للنموذج لتقليل مستويات الخطأ وضمان أفضل مرونة تعميمية.',
            roleEn: 'Inference Specialist',
            roleAr: 'أخصائي ضبط كفاءة الاستدلال'
          },
          {
            titleEn: 'REST Endpoint Integration & Cloud Deployment',
            titleAr: 'النشر السحابي ودمج نموذج الذكاء الاصطناعي بالواجهات',
            descEn: 'Expose the trained weights securely via scalable endpoints accessible by central interfaces.',
            descAr: 'دمج النموذج ضمن واجهات برمجية مشفرة وسريعة الاستجابة لاستقبال الطلبات ومعالجتها.',
            roleEn: 'Backend Developer',
            roleAr: 'مطور الأنظمة الخلفية الفائقة'
          },
          {
            titleEn: 'Concept Drift Monitoring & Continuous Training',
            titleAr: 'مراقبة انحراف المفاهيم وتنشيط التعلم التلقائي',
            descEn: 'Validate accuracy metrics against fresh incoming transaction streams and re-trigger fits weekly.',
            descAr: 'مراقبة توافق قرارات الذكاء الاصطناعي مع مدخلات السوق المستجدة وتحديث الأوزان أسبوعياً.',
            roleEn: 'AI Auditor',
            roleAr: 'مدقق جودة نظم التفكير الآلي'
          }
        ];
        break;

      case 'cloud-computing':
        taskTemplates = [
          {
            titleEn: 'Multi-Region Infrastructure Sizing',
            titleAr: 'تقييم الحجم وتوزيع الخوادم عبر الأقاليم السحابية',
            descEn: 'Calculate the expected concurrent request loads, peak usage bursts, and bandwidth requirements.',
            descAr: 'دراسة سحب الموارد وحساب أعداد المستخدمين المتزامنين وتحديد النطاقات الترددية القصوى.',
            roleEn: 'Infrastructure Architect',
            roleAr: 'مهندس البنية التحتية السحابية'
          },
          {
            titleEn: 'Infrastructure-as-Code (Terraform) Blueprinting',
            titleAr: 'برمجة البنية التحتية ككود باستعمال Terraform',
            descEn: 'Define target VPCs, subnet segmentations, IAM guidelines, and firewalls in descriptive scripts.',
            descAr: 'صياغة نصوص برمجية مرنة ومكررة لبناء شبكات الاتصال وجدران الحماية وقواعد الوصول.',
            roleEn: 'DevOps Specialist',
            roleAr: 'أخصائي عمليات النشر والتشغيل'
          },
          {
            titleEn: 'High Availability Multi-zone Network Prep',
            titleAr: 'تأسيس بيئة الجاهزية العالية وتعدد مناطق التوفر',
            descEn: 'Configure Load Balancers, Target Groups, and active health checkers to prevent server downtime.',
            descAr: 'تثبيت موزعات الأحمال وضبط مؤشرات الصحة التلقائية لضمان عمل الخدمة دون انقطاع.',
            roleEn: 'Network Reliability Architect',
            roleAr: 'مهندس شبكات الاتصال السحابية'
          },
          {
            titleEn: 'Live Database Reorganization & Syncing',
            titleAr: 'ترحيل ومزامنة قواعد البيانات دون انقطاع التشغيل',
            descEn: 'Establish master-replica syncing to migrate databases from local stores to fully managed engines.',
            descAr: 'ربط قواعد البيانات ومواءمتها مع محركات الفهرسة الحديثة لترحيل السجلات والبيانات الحساسة.',
            roleEn: 'Cloud DBA',
            roleAr: 'خبير الأنظمة السحابية المدارة'
          },
          {
            titleEn: 'Compute Instances Provisioning & Security Hardening',
            titleAr: 'تهيئة الحاويات السحابية وتأمين خوادم التشغيل',
            descEn: 'Spin up production environments with strict security baselines, encrypted storage, and secret vaulting.',
            descAr: 'تشغيل بيئة الإنتاج الفعلية بأحدث معايير التشفير وتأمين مفاتيح وجسور الاتصال.',
            roleEn: 'Cloud Security Lead',
            roleAr: 'كبير مسؤولي الأمن السحابي'
          },
          {
            titleEn: 'Autoscaling Trigger Testing & Edge CDN Caching',
            titleAr: 'اختبار التمدد الديناميكي ومناطق التوزيع CDN',
            descEn: 'Simulate synthetic traffic rushes to verify clusters spawn clean replacement pods under strain.',
            descAr: 'مكافحة سيناريوهات التحميل المفاجئ للتأكد من إنتاج المزيد من النسخ الافتراضية الموازية تلقائياً.',
            roleEn: 'SRE Specialist',
            roleAr: 'مدير موثوقية النظم للشركاء'
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
            roleAr: 'مصمم مستودعات البيانات السريعة'
          },
          {
            titleEn: 'Recharts Interactive Dashboard Sprints',
            titleAr: 'تصميم وتكويد لوحات البيانات التفاعلية الرقمية',
            descEn: 'Build React charts with high-contrast color codes to simplify complex relational charts summaries.',
            descAr: 'برمجة لوحات تحكم تفاعلية ملونة تمثل البيانات والإحصاءات بطرق جذابة ومفهومة لمجلس الإدارة.',
            roleEn: 'Frontend Eng / UX Dev',
            roleAr: 'مطور الواجهات التفاعلية للبيانات'
          },
          {
            titleEn: 'Automated Stakeholder Report Delivery Settle',
            titleAr: 'تمكين التقارير الدورية المؤتمتة لكبار التنفيذيين',
            descEn: 'Configure automated reports generated with insights delivered seamlessly via corporate messaging channels.',
            descAr: 'برمجة خطوط التدفق لإرسال ملخصات ذكاء الأعمال أسبوعياً لبريد القياديين تلقائياً.',
            roleEn: 'Delivery Coordinator',
            roleAr: 'منسق تسليم الحلول المعلوماتية'
          }
        ];
        break;

      case 'cybersecurity':
        taskTemplates = [
          {
            titleEn: 'Surface Vulnerability Assessment & Pen Testing',
            titleAr: 'تقييم ثغرات النطاقات الخارجية واختبار الاختراق',
            descEn: 'Discover exposed endpoints, evaluate weak authentication protocols, and probe port rules.',
            descAr: 'مسح المنافذ المفتوحة وتتبع طرق تسجيل الدخول غير المؤمنة واختبار جدران الحماية الحالية.',
            roleEn: 'White-hat Pen Tester',
            roleAr: 'خبير اختبار اختراق وحماية'
          },
          {
            titleEn: 'Zero-Trust Architecture Layout Blueprinting',
            titleAr: 'برمجة وتصميم هيكلية الثقة المعدومة (Zero-Trust)',
            descEn: 'Draft security guidelines enforcing token auth validation loops, least-privilege schemas, and MFA.',
            descAr: 'وضع خارطة حماية تفترض اختراق كل شبكات الاتصال وتتطلب التحقق الكلي لكل رغبة وصول.',
            roleEn: 'Principal Security Officer',
            roleAr: 'كبير مسؤولي أمن وموثوقية المعلومات'
          },
          {
            titleEn: 'ISO-27001 Compliance Baseline Mapping',
            titleAr: 'تقييم الفجوة وتطبيق معايير الامتثال لـ ISO-27001',
            descEn: 'Audit operational workflows against international confidentiality, integrity, and availability benchmarks.',
            descAr: 'مطابقة لوائح الشركة الداخلية وهياكل النفاذ لقواعد البيانات مع تشريعات أمن المعلومات الدولية.',
            roleEn: 'Compliance Assessor',
            roleAr: 'مستشار الامتثال والتشريعات الأمنية'
          },
          {
            titleEn: 'Cryptographic Edge Cryptography & JWT Implementation',
            titleAr: 'برمجة شيفرات الاتصال والتشفير التام لـ JWT',
            descEn: 'Introduce secure JWT signing systems rejecting broken tokens, securing in-transit parameters.',
            descAr: 'برمجة وتوزيع مفاتيح التشفير التلقائية للتأكيد من التوقيع الرقمي لهويات الجلسات دون تسريب.',
            roleEn: 'Cryptography Developer',
            roleAr: 'مطور خوارزميات التشفير'
          },
          {
            titleEn: 'Active Firewalls & Cloud WAF Integration',
            titleAr: 'تنصيب وتكوين جدران الحماية الذكية وتنشيط WAF',
            descEn: 'Deploy active rate limiters and deep-packet filters blocking cross-site injection attempts.',
            descAr: 'إعداد وتشغيل مصافي حظر هجمات حجب الخدمة ومكافحة حزم الطلبات الضارة بذكاء.',
            roleEn: 'Cyber Defense Specialist',
            roleAr: 'أخصائي الدفاع السيبراني النشط'
          },
          {
            titleEn: 'SLA Monitoring Setup & Incident Center Deployment',
            titleAr: 'تثبيت نظم المراقبة الأمنية ومركز الاستجابة السيبراني',
            descEn: 'Integrate tools for real-time alerting to detect unusual cloud storage queries instantly.',
            descAr: 'بناء غرف رصد الحوادث واكتشاف محاولات تصفح السجلات المشبوهة وقفل الحسابات فوراً.',
            roleEn: 'SOC Lead Analyst',
            roleAr: 'محلل أول مركز الرصد الأمني'
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
        <div className="fixed inset-0 z-[150] overflow-y-auto" id="client-portal-overlay">
          {/* Dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              
              {/* Modal Core Header */}
              <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between shrink-0 font-sans">
                <div className="flex items-center space-x-2.5 rtl:space-x-reverse text-sky-400">
                  <div className="bg-sky-500/10 p-2 rounded-xl text-sky-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                      {isAr ? 'منطقة الشركاء والعملاء' : 'Enterprise Partner Hub'}
                    </h3>
                    <p className="text-[10px] text-slate-400 block mt-0.5">
                      {isAr ? 'تسجيل الدخول ومتابعة مسيرة التحول الرقمي' : 'Client Access Portal & Lifecycle Tracker'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  {currentClient && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title={isAr ? 'تسجيل الخروج' : 'Log Out Account'}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isAr ? 'خروج' : 'Logout'}</span>
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* 1. NOT LOGGED IN VIEW: AUTHENTICATION FORMS */}
                {!currentClient ? (
                  <div className="max-w-md mx-auto space-y-6">
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
                        <span className="align-middle">{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
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
                        <span className="align-middle">{isAr ? 'حساب جديد' : 'Register'}</span>
                      </button>
                    </div>

                    {/* LOGIN TAB */}
                    {activeTab === 'login' && (
                      <motion.form 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleLoginSubmit}
                        className="space-y-4"
                      >
                        <div className="text-center pb-2">
                          <p className="text-slate-400 text-xs leading-relaxed">
                            {isAr 
                              ? 'سجل دخولك لمتابعة عقود دراسات الجدوى، استعراض الحلول التقنية المعتمدة، والتواصل المباشر مع استشاري المشروع الخاص بك.'
                              : 'Log in to track structural advisory roadmaps, approved tech modernization scopes, and coordinate with your dedicated solution architect.'}
                          </p>
                        </div>

                        {loginError && (
                          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-400 text-right ltr:text-left">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
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
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white text-xs placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all ltr:text-left rtl:text-left"
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
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white text-xs placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-sky-400 hover:bg-sky-500 text-slate-950 font-extrabold text-xs tracking-wider transition-all shadow-md active:scale-98 cursor-pointer text-center"
                        >
                          {isAr ? 'تسعير ومتابعة الطلبات المفتوحة ➔' : 'Sign In & Track Solutions ➔'}
                        </button>

                        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/40 text-[10px] text-slate-500 text-center leading-relaxed font-sans">
                          {isAr 
                            ? 'معلومات محاكاة: يمكنك التسجيل ببريدك وتحديد كلمة مرور مخصصة، أو تسجيل مستخدم وهمي للاختبار الفوري.'
                            : 'Prototype Simulation: Click "Register" above to create a custom profile instantly to track custom seeded milestones.'}
                        </div>
                      </motion.form>
                    )}

                    {/* REGISTER TAB */}
                    {activeTab === 'register' && (
                      <motion.form 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
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
                                      placeholder={isAr ? 'أحمد التميمي' : 'e.g. Leo Parker'}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-white text-xs placeholder:text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                      required
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-slate-400 text-[11px] font-bold block mb-1 ltr:text-left rtl:text-right">
                                    {isAr ? 'البريد الإلكتروني المهني' : 'Corporate Email *'}
                                  </label>
                                  <div className="relative">
                                    <Mail className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-500 w-4 h-4 pointer-events-none" />
                                    <input
                                      type="email"
                                      value={regEmail}
                                      onChange={(e) => setRegEmail(e.target.value)}
                                      placeholder="partner@company.com"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-white text-xs placeholder:text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all ltr:text-left rtl:text-left"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-slate-400 text-[11px] font-bold block mb-1 ltr:text-left rtl:text-right">
                                    {isAr ? 'اسم المنشأة / الجهة' : 'Company Name *'}
                                  </label>
                                  <div className="relative">
                                    <Building className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-500 w-4 h-4 pointer-events-none" />
                                    <input
                                      type="text"
                                      value={regCompany}
                                      onChange={(e) => setRegCompany(e.target.value)}
                                      placeholder={isAr ? 'المنشأة الهندسية المتقدمة' : 'e.g. Acme Tech'}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-white text-xs placeholder:text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                      required
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-slate-400 text-[11px] font-bold block mb-1 ltr:text-left rtl:text-right">
                                    {isAr ? 'رقم الجوال الاتصالي' : 'Phone Number'}
                                  </label>
                                  <div className="relative">
                                    <Phone className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-500 w-4 h-4 pointer-events-none" />
                                    <input
                                      type="tel"
                                      value={regPhone}
                                      onChange={(e) => setRegPhone(e.target.value)}
                                      placeholder="+966 50 000 0000"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-white text-xs placeholder:text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="text-slate-400 text-[11px] font-bold block mb-1.5 ltr:text-left rtl:text-right">
                                  {isAr ? 'تعيين كلمة مرور الحساب' : 'Create Password * (min. 6 chars)'}
                                </label>
                                <div className="relative">
                                  <Lock className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-500 w-4.5 h-4.5 pointer-events-none" />
                                  <input
                                    type="password"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white text-xs placeholder:text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-450 to-indigo-500 text-white font-extrabold text-xs tracking-wider transition-all shadow-md active:scale-98 cursor-pointer text-center"
                            >
                              {isAr ? 'إنشاء حساب الشريك ➔' : 'Register Corporate Account ➔'}
                            </button>
                          </>
                        )}
                      </motion.form>
                    )}
                  </div>
                ) : (
                  
                  // 2. LOGGED IN VIEW: CLIENT ENTERPRISE DASHBOARD
                  <div className="space-y-6">
                    {/* Welcome banner info telemetry */}
                    <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden text-right ltr:text-left">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="space-y-1 z-10">
                        <span className="text-[10px] text-sky-400 font-extrabold uppercase tracking-widest block font-sans">
                          {isAr ? 'ملف المنشأة الشريكة' : 'Active Account Profile'}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 rtl:justify-end">
                          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                          <span>{isAr ? `أهلاً بك، المستشار ${currentClient.name}` : `Welcome back, ${currentClient.name}`}</span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          {isAr 
                            ? `شريكنا في: ${currentClient.companyName} | ${currentClient.email}` 
                            : `${currentClient.companyName} | Contact: ${currentClient.email}`}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onScrollToConsultation();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-500 text-slate-950 text-xs font-black transition-all hover:scale-102 cursor-pointer shrink-0 inline-flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تقديم طلب استشارة جديدة' : 'Formulate New Consultation'}</span>
                      </button>
                    </div>

                    {/* Visual Analytics Hub with Recharts */}
                    <div className="bg-slate-950/60 leading-relaxed rounded-2xl border border-slate-850 p-5 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900/60 pb-4">
                        <div className="text-right rtl:text-right ltr:text-left">
                          <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5 rtl:justify-end">
                            <Activity className="w-4 h-4 text-sky-400" />
                            <span>{isAr ? 'التحليلات والمؤشرات المالية للمشاريع' : 'Project Financial Analytics Hub'}</span>
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {isAr ? 'تطور حجم تقديرات التكاليف والدفعات المسددة للمحفظة الاستشارية' : 'Sizing and milestone settled cash metrics overview'}
                          </p>
                        </div>
                        <div className="font-mono text-[10px] px-2 py-1 rounded bg-slate-900 border border-slate-805 text-sky-450 self-start sm:self-center font-bold">
                          {isAr ? 'تحديث فوري' : 'LIVE ACCRUAL'}
                        </div>
                      </div>

                      {/* Bento Cards Metrics Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-850/60 text-right rtl:text-right ltr:text-left">
                          <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-widest">{isAr ? 'إجمالي حجم الأعمال والمشاريع' : 'TOTAL PORTFOLIO BUDGET'}</span>
                          <span className="text-sm sm:text-base font-black text-white font-mono mt-1 block">
                            ﷼ {totalEstimatedBudget.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-850/60 text-right rtl:text-right ltr:text-left">
                          <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-widest">{isAr ? 'الفواتير الصادرة' : 'BILLED MILESTONES'}</span>
                          <span className="text-sm sm:text-base font-black text-sky-400 font-mono mt-1 block">
                            ﷼ {totalInvoiced.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-850/60 text-right rtl:text-right ltr:text-left">
                          <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-widest">{isAr ? 'إجمالي المسدد فعلياً' : 'SETTLED CAPEX CASH'}</span>
                          <span className="text-sm sm:text-base font-black text-emerald-400 font-mono mt-1 block">
                            ﷼ {totalPaidInvoices.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Recharts Area Chart */}
                      {chartData.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 border border-dashed border-slate-850 rounded-xl text-xs">
                          {isAr ? 'لم نجد بيانات تاريخية كافية لعرض الرسم البياني.' : 'Incomplete historic metrics to render linear graphs.'}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-full h-[220px] pr-2.5">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                              >
                                <defs>
                                  <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25}/>
                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis 
                                  dataKey="id" 
                                  stroke="#64748b" 
                                  fontSize={10} 
                                  tickLine={false} 
                                />
                                <YAxis 
                                  stroke="#64748b" 
                                  fontSize={10} 
                                  tickLine={false}
                                  tickFormatter={(value) => `﷼${value >= 1000 ? (value / 1000) + 'k' : value}`}
                                />
                                <Tooltip
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const d = payload[0].payload;
                                      return (
                                        <div className="bg-slate-950 border border-slate-805 p-3 rounded-xl shadow-xl space-y-1.5 text-right font-sans">
                                          <p className="text-[10px] text-sky-400 font-mono font-bold">
                                            {isAr ? `المعرّف الكودي: ${d.id}` : `Key ID: ${d.id}`}
                                          </p>
                                          <p className="text-[9px] text-slate-500 font-mono">
                                            {isAr ? `تاريخ الإطلاق: ${d.date}` : `Est Date: ${d.date}`}
                                          </p>
                                          <div className="border-t border-slate-900 pt-1.5 space-y-0.5 text-[11px]">
                                            <div className="flex justify-between gap-4">
                                              <span className="text-slate-400">{isAr ? 'حجم تقدير المشروع:' : 'Project Budget:'}</span>
                                              <span className="text-white font-bold font-mono">﷼ {d.budget.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                              <span className="text-slate-400">{isAr ? 'المفوتر كدفعات مالية:' : 'Milestones Invoiced:'}</span>
                                              <span className="text-sky-400 font-bold font-mono">﷼ {d.invoiced.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                              <span className="text-slate-400">{isAr ? 'المسدد فعلياً:' : 'Settled Cash:'}</span>
                                              <span className="text-emerald-400 font-bold font-mono">﷼ {d.paid.toLocaleString()}</span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Legend 
                                  verticalAlign="top" 
                                  height={36} 
                                  iconType="circle"
                                  iconSize={8}
                                  wrapperStyle={{ fontSize: 10 }}
                                  formatter={(value) => {
                                    if (value === 'budget') return isAr ? 'ميزانية تقديرية للمشروع' : 'Project Budget Estimate';
                                    if (value === 'invoiced') return isAr ? 'الفواتير الصادرة' : 'Milestones Invoiced';
                                    if (value === 'paid') return isAr ? 'تم سداده ودفع مالي' : 'Settled Balance Paid';
                                    return value;
                                  }}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="budget" 
                                  stroke="#38bdf8" 
                                  strokeWidth={2}
                                  fillOpacity={1} 
                                  fill="url(#colorBudget)" 
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="paid" 
                                  stroke="#10b981" 
                                  strokeWidth={2}
                                  fillOpacity={1} 
                                  fill="url(#colorPaid)" 
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                          <span className="text-[10px] text-slate-500 block text-center">
                            {isAr 
                              ? '💡 يوضح المؤشر تطور حجم تقديرات طلباتكم التقنية المعتمدة ومطابقتها مع حجم الأموال المسددة كدفعات تحويل.'
                              : '💡 Evolution index tracks requested tech budgets matched dynamically with certified bank wire transfers.'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Toggle Selector Button Group */}
                    <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-855 font-sans">
                      <button
                        type="button"
                        onClick={() => {
                          setPortalSubTab('requests');
                          setExpandedRequestId(null);
                        }}
                        className={`flex-1 py-1.5 text-center text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          portalSubTab === 'requests'
                            ? 'bg-sky-500 text-slate-950 shadow-sm font-black'
                            : 'text-slate-400 hover:text-slate-205'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>
                          {isAr ? 'الطلبات والدراسات' : 'Inquiries & Sizing'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPortalSubTab('invoices');
                          setExpandedRequestId(null);
                        }}
                        className={`flex-1 py-1.5 text-center text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          portalSubTab === 'invoices'
                            ? 'bg-sky-500 text-slate-950 shadow-sm font-black'
                            : 'text-slate-400 hover:text-slate-205'
                        }`}
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>
                          {isAr ? 'الفواتير والمدفوعات' : 'Invoices & Billing'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPortalSubTab('databases');
                          setExpandedRequestId(null);
                        }}
                        className={`flex-1 py-1.5 text-center text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          portalSubTab === 'databases'
                            ? 'bg-sky-500 text-slate-950 shadow-sm font-black'
                            : 'text-slate-400 hover:text-slate-205'
                        }`}
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>
                          {isAr ? 'قواعد البيانات' : 'Cloud Databases'}
                        </span>
                      </button>
                    </div>

                    {portalSubTab === 'requests' ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-sans">
                          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-sky-400" />
                            <span>{isAr ? 'سجل الطلبات الاستشارية والحلول' : 'Solutions Tracking Matrix'}</span>
                          </h5>
                          <span className="text-[10px] font-mono text-sky-400 font-bold">
                            {isAr ? `${requests.length} طلبات نشطة` : `${requests.length} Active Records`}
                          </span>
                        </div>

                      {requests.length === 0 ? (
                        <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-3 bg-slate-950/20">
                          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 mx-auto">
                            <FileText className="w-5 h-5" />
                          </div>
                          <p className="text-xs text-slate-500">
                            {isAr 
                              ? 'لا يوجد لديك طلبات استشارية معلنة بعد. تفضل بتقديم أول طلبك الآن.'
                              : 'You have no registered digital transformation inquiries filed yet.'}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onScrollToConsultation();
                            }}
                            className="text-xs text-sky-400 font-bold underline cursor-pointer hover:text-sky-300"
                          >
                            {isAr ? 'اضغط هنا للذهاب لنموذج الاستشارة' : 'Click here to submit an inquiry now'}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {requests.map((req) => {
                            const isExpanded = expandedRequestId === req.id;
                            
                            // Locate industry details
                            const targetSector = SECTORS.find(s => s.id === req.sectorId);
                            const targetSolution = SOLUTIONS.find(s => s.id === req.solutionId);

                            return (
                              <div 
                                key={req.id} 
                                className="bg-slate-950/85 border border-slate-850 rounded-2xl overflow-hidden hover:border-slate-800 transition-all text-right ltr:text-left"
                              >
                                {/* Accordion Header */}
                                <div 
                                  onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                                >
                                  <div className="space-y-1.5 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 rtl:justify-end">
                                      <span className="text-[10px] font-mono text-sky-450 font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                                        #{req.id}
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        {req.createdAt}
                                      </span>
                                    </div>
                                    <h6 className="text-xs sm:text-sm font-extrabold text-white">
                                      {targetSolution 
                                        ? (isAr ? targetSolution.titleAr : targetSolution.titleEn) 
                                        : req.solutionId}
                                    </h6>
                                    <span className="text-[11px] text-slate-400 block truncate">
                                      {isAr ? 'قطاع التحول المستهدف:' : 'Sector Focused:'} {' '}
                                      <span className="font-semibold text-slate-300">
                                        {targetSector ? (isAr ? targetSector.titleAr : targetSector.titleEn) : req.sectorId}
                                      </span>
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-900 sm:border-0">
                                    {/* Elevated badge coloring */}
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                      req.status === 'completed'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : req.status === 'approved'
                                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                        : req.status === 'planned'
                                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                        : req.status === 'reviewing'
                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                                    }`}>
                                      {getStatusLabel(req.status)}
                                    </span>

                                    <div className="text-slate-400">
                                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                  </div>
                                </div>

                                {/* Accordion Expanded Details */}
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.25 }}
                                    >
                                      <div className="p-4 sm:p-5 bg-slate-950/40 border-t border-slate-850 space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
                                        
                                        {/* Dynamic Telemetry stats of the request */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-850/60 font-sans">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider mb-0.5">
                                              {isAr ? 'الجدول الزمني التقديري' : 'ESTIMATED TIMELINE'}
                                            </span>
                                            <strong className="text-white text-xs font-mono font-bold flex items-center gap-1.5 rtl:justify-end">
                                              <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                              <span>{req.timelineDays ? `${req.timelineDays} ${isAr ? 'يوم عمل' : 'Work Days'}` : (isAr ? 'جاري التقييم التقني' : 'TBD (Sizing in process)')}</span>
                                            </strong>
                                          </div>

                                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-850/60 font-sans">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider mb-0.5">
                                              {isAr ? 'التكلفة الإرشادية الفنية' : 'BUDGETARY ESTIMATION'}
                                            </span>
                                            <strong className="text-white text-xs font-mono font-bold flex items-center gap-1.5 rtl:justify-end">
                                              <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                              <span>{req.estimatedCost ? `${isAr ? '﷼ ' : 'SAR '}${req.estimatedCost}` : (isAr ? 'بانتظار نموذج الجدوى' : 'Sizing Analysis Queue')}</span>
                                            </strong>
                                          </div>

                                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-850/60 font-sans">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider mb-0.5">
                                              {isAr ? 'رسالة المشروع وشرح المتطلبات' : 'COGNITIVE LOG NOTES'}
                                            </span>
                                            <p className="text-[10px] text-slate-400 truncate" title={req.message}>
                                              {req.message || (isAr ? 'لا يوجد تفاصيل إضافية' : 'No custom factors provided')}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Status Progress Tracker Path */}
                                        <div className="space-y-2 pt-2">
                                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                            {isAr ? 'شريط الحالة الهندسية ومستوى التقدم' : 'Structural Project Pipeline Milestones'}
                                          </span>
                                          
                                          {/* Desktop timeline steps path */}
                                          <div className="relative pt-4 pb-2">
                                            {/* Baseline bar element */}
                                            <div className="absolute top-6 left-0 right-0 h-1 bg-slate-800 rounded-full" />
                                            {/* Completed background bar */}
                                            <div 
                                              className="absolute top-6 left-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500" 
                                              style={{ 
                                                width: req.status === 'completed' ? '100%' 
                                                      : req.status === 'approved' ? '75%' 
                                                      : req.status === 'planned' ? '50%' 
                                                      : req.status === 'reviewing' ? '25%' 
                                                      : '5%' 
                                              }} 
                                            />

                                            <div className="relative flex justify-between">
                                              {[
                                                { key: 'pending', num: '١', labelAr: 'تم الاستلام', labelEn: 'Filed' },
                                                { key: 'reviewing', num: '٢', labelAr: 'قيد المراجعة', labelEn: 'Sizing' },
                                                { key: 'planned', num: '٣', labelAr: 'تم التخطيط', labelEn: 'Planned' },
                                                { key: 'approved', num: '٤', labelAr: 'معتمد للتنفيذ', labelEn: 'Approved' },
                                                { key: 'completed', num: '٥', labelAr: 'نشط ومكتمل', labelEn: 'Live' }
                                              ].map((step, idx) => {
                                                const statuses = ['pending', 'reviewing', 'planned', 'approved', 'completed'];
                                                const currentIdx = statuses.indexOf(req.status);
                                                const isStepDone = idx <= currentIdx;
                                                const isStepCurrent = idx === currentIdx;

                                                return (
                                                  <div key={step.key} className="flex flex-col items-center">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                                                      isStepDone 
                                                        ? 'bg-sky-450 text-slate-950 font-black scale-110 shadow-md ring-2 ring-sky-500/30'
                                                        : 'bg-slate-800 text-slate-500 border border-slate-750'
                                                    }`}>
                                                      {isStepDone ? '✓' : step.num}
                                                    </div>
                                                    <span className={`text-[9px] mt-1.5 font-bold whitespace-nowrap block ${
                                                      isStepCurrent 
                                                        ? 'text-sky-400 font-extrabold' 
                                                        : isStepDone 
                                                        ? 'text-slate-300' 
                                                        : 'text-slate-500'
                                                    }`}>
                                                      {isAr ? step.labelAr : step.labelEn}
                                                    </span>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Recommended Tools Stack List */}
                                        {req.techStack && req.techStack.length > 0 && (
                                          <div className="space-y-1.5 pt-2 border-t border-slate-850">
                                            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block flex items-center gap-1 rtl:justify-end">
                                              <Cpu className="w-3.5 h-3.5" />
                                              <span>{isAr ? 'البنية التقنية المصممة مسبقاً (Tech Stack)' : 'Engineered Logical Tech Stack Recommendations'}</span>
                                            </span>
                                            <div className="flex flex-wrap gap-1.5 pt-1 rtl:justify-end">
                                              {req.techStack.map((tech, tIdx) => (
                                                <span key={tIdx} className="px-2 py-1 rounded bg-slate-900 border border-slate-800/80 text-[10px] font-mono text-slate-300">
                                                  {tech}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Solution Milestones & Sub-tasks Timeline Visualization */}
                                        {(() => {
                                          const subTasks = getSolutionSubTasks(req);
                                          const completedCount = subTasks.filter(t => t.status === 'completed').length;
                                          const progressPercent = Math.round((completedCount / subTasks.length) * 100);
                                          
                                          return (
                                            <div className="space-y-3 pt-3 border-t border-slate-850">
                                              {/* Header and Progress Bar Section */}
                                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <span className="text-[10px] font-bold text-sky-450 uppercase tracking-widest flex items-center gap-1.5 rtl:justify-end">
                                                  <Activity className="w-3.5 h-3.5 animate-pulse text-sky-450" />
                                                  <span>{isAr ? 'خارطة محطات تنفيذ الحل والمستهدفات الفنية' : 'Solution Implementation Milestones & Sub-tasks'}</span>
                                                </span>
                                                
                                                {/* Visual Completion Progress Badge */}
                                                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded self-start flex items-center gap-1.5">
                                                  <span>{isAr ? 'معدل الإنجاز:' : 'Progress:'}</span>
                                                  <span className="font-bold text-emerald-400">{progressPercent}%</span>
                                                  <span className="text-slate-500">({completedCount}/6)</span>
                                                </span>
                                              </div>
                                              
                                              {/* Visual Horizontal Progress Bar */}
                                              <div className="w-full bg-slate-900/90 rounded-full h-1.5 overflow-hidden border border-slate-800">
                                                <motion.div 
                                                  initial={{ width: 0 }}
                                                  animate={{ width: `${progressPercent}%` }}
                                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                                  className="h-full bg-gradient-to-r from-sky-500 via-sky-450 to-emerald-500 rounded-full"
                                                />
                                              </div>

                                              {/* 2-column or 1-column responsive timeline of subtasks */}
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                                {subTasks.map((task, sIdx) => {
                                                  const isCompleted = task.status === 'completed';
                                                  const isInProgress = task.status === 'in-progress';
                                                  
                                                  return (
                                                    <div 
                                                      key={task.id} 
                                                      className={`relative p-3 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
                                                        isCompleted 
                                                          ? 'bg-emerald-950/10 border-emerald-500/20 hover:border-emerald-500/45' 
                                                          : isInProgress
                                                            ? 'bg-sky-950/15 border-sky-450/45 ring-1 ring-sky-450/20 hover:border-sky-450/70 shadow-lg shadow-sky-950/10'
                                                            : 'bg-slate-900/30 border-slate-800/60 opacity-60 hover:opacity-85'
                                                      }`}
                                                    >
                                                      {/* Header of Task Slot */}
                                                      <div className="flex items-start justify-between gap-2.5">
                                                        <div className="flex items-center gap-2">
                                                          {/* Pulse glowing/solid indicator */}
                                                          {isCompleted ? (
                                                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                                                              <CheckCircle2 className="w-3.5 h-3.5" />
                                                            </div>
                                                          ) : isInProgress ? (
                                                            <div className="relative shrink-0 flex items-center justify-center w-5 h-5">
                                                              <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400/25 animate-ping" />
                                                              <div className="w-5 h-5 rounded-full bg-sky-400/10 text-sky-300 flex items-center justify-center border border-sky-400/40 relative">
                                                                <Clock className="w-3.5 h-3.5 text-sky-450 shrink-0" />
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center shrink-0">
                                                              <span className="text-[8px] font-mono font-bold">Q</span>
                                                            </div>
                                                          )}
                                                          
                                                          <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-900/70 py-0.5 px-1.5 rounded border border-slate-800">
                                                            {task.id}
                                                          </span>
                                                        </div>
                                                        
                                                        {/* Custom State Badge */}
                                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                                          isCompleted 
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                                                            : isInProgress
                                                              ? 'bg-sky-500/10 text-sky-300 border border-sky-500/35 animate-pulse'
                                                              : 'bg-slate-900 text-slate-500 border border-slate-800'
                                                        }`}>
                                                          {isCompleted 
                                                            ? (isAr ? 'مكتمل' : 'Completed') 
                                                            : isInProgress 
                                                              ? (isAr ? 'قيد العمل' : 'In Progress') 
                                                              : (isAr ? 'مخطط' : 'Pending')}
                                                        </span>
                                                      </div>
                                                      
                                                      {/* Main Body content */}
                                                      <div className="mt-2 space-y-1">
                                                        <h4 className={`text-[11px] font-bold ${
                                                          isCompleted ? 'text-emerald-300' : isInProgress ? 'text-sky-300' : 'text-slate-300'
                                                        }`}>
                                                          {task.title}
                                                        </h4>
                                                        <p className="text-[10px] text-slate-400 leading-relaxed text-pretty">
                                                          {task.desc}
                                                        </p>
                                                      </div>

                                                      {/* Footer containing active engineer/role */}
                                                      <div className="mt-2.5 pt-1.5 border-t border-slate-800/40 flex justify-between items-center text-[10px]">
                                                        <span className="text-slate-500">{isAr ? 'المسؤول التنفيذي' : 'Delivery Owner'}:</span>
                                                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                                                          isCompleted 
                                                            ? 'text-emerald-400 bg-emerald-950/20' 
                                                            : isInProgress 
                                                              ? 'text-sky-400 bg-sky-950/20' 
                                                              : 'text-slate-500 bg-slate-900'
                                                        }`}>
                                                          {task.role}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          );
                                        })()}

                                        {/* Deep chronological log of events */}
                                        <div className="space-y-2 pt-2 border-t border-slate-850">
                                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                            {isAr ? 'سجل العمليات التفصيلي الفعلي' : 'Inquiry Cognitive Roadmap Logs'}
                                          </span>
                                          <div className="space-y-3 pl-2.5 border-l border-slate-800/80 rtl:border-l-0 rtl:border-r rtl:pr-2.5 rtl:space-y-3 text-[11px]">
                                            {getMilestones(req).map((log, lIdx) => (
                                              <div key={lIdx} className="relative space-y-0.5">
                                                {/* Bullet dot indicator */}
                                                <div className={`absolute top-1.5 -left-[14.5px] rtl:-left-0 rtl:-right-[14.5px] w-2 h-2 rounded-full ${
                                                  log.done ? 'bg-sky-450' : 'bg-slate-800'
                                                }`} />
                                                <div className="flex justify-between items-center gap-3">
                                                  <span className={`font-bold ${log.done ? 'text-white' : 'text-slate-500'}`}>
                                                    {log.title}
                                                  </span>
                                                  <span className="text-[9px] font-mono text-slate-500 shrink-0">
                                                    {log.date}
                                                  </span>
                                                </div>
                                                <p className={`text-[10px] ${log.done ? 'text-slate-450' : 'text-slate-600'}`}>
                                                  {log.desc}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    ) : portalSubTab === 'invoices' ? (
                      <div className="space-y-3 font-sans">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-sans">
                          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Receipt className="w-3.5 h-3.5 text-sky-400" />
                            <span>{isAr ? 'قائمة الفواتير وتفاصيل السداد' : 'Accounts Statement & Invoices'}</span>
                          </h5>
                          <span className="text-[10px] font-mono text-sky-455 font-bold">
                            {isAr ? `${invoices.length} فواتير المكتشفة` : `${invoices.length} Ledgers Found`}
                          </span>
                        </div>

                        {invoices.length === 0 ? (
                          <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-3 bg-slate-950/20 font-sans">
                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 mx-auto">
                              <Receipt className="w-5 h-5" />
                            </div>
                            <p className="text-xs text-slate-500">
                              {isAr 
                                ? 'لا توجد فواتير أو مستندات محاسبية مصدرة لحسابكم حالياً.'
                                : 'No project invoices compiled for your account yet.'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {invoices.map((inv) => {
                              const isExpanded = expandedRequestId === inv.id;
                              return (
                                <div 
                                  key={inv.id} 
                                  className="bg-slate-950/85 border border-slate-850 rounded-2xl overflow-hidden hover:border-slate-800 transition-all text-right ltr:text-left"
                                >
                                  {/* Accordion Header */}
                                  <div 
                                    onClick={() => setExpandedRequestId(isExpanded ? null : inv.id)}
                                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                                  >
                                    <div className="space-y-1.5 min-w-0">
                                      <div className="flex flex-wrap items-center gap-2 rtl:justify-end font-mono">
                                        <span className="text-[10px] text-sky-450 font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                                          {inv.id}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                          {isAr ? `تاريخ الإصدار: ${inv.issueDate}` : `Issued: ${inv.issueDate}`}
                                        </span>
                                      </div>
                                      <h6 className="text-xs sm:text-sm font-extrabold text-white">
                                        {isAr ? inv.titleAr : inv.titleEn}
                                      </h6>
                                      {inv.requestId && (
                                        <span className="text-[10px] font-mono text-slate-400 block mt-1">
                                          {isAr ? 'مرتبطة بالطلب:' : 'Linked key request:'} {' '}
                                          <span className="text-sky-400 font-semibold">{inv.requestId}</span>
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-900 sm:border-0">
                                      <div className="text-right rtl:text-right ltr:text-left">
                                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                                          {isAr ? 'المبلغ المستحق' : 'Amount Retained'}
                                        </span>
                                        <span className="text-sm font-black text-white font-mono">
                                          {isAr ? '﷼ ' : 'SAR '}{inv.amount}
                                        </span>
                                      </div>

                                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                                        inv.status === 'paid'
                                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                          : inv.status === 'overdue'
                                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                      }`}>
                                        {inv.status === 'paid' ? (isAr ? 'مسددة' : 'Paid') 
                                         : inv.status === 'overdue' ? (isAr ? 'متأخرة' : 'Overdue')
                                         : (isAr ? 'مستحقة' : 'Outstanding')}
                                      </span>

                                      <div className="text-slate-400">
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Accordion Expanded Details */}
                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <div className="p-4 sm:p-5 bg-slate-950/40 border-t border-slate-850 space-y-4 text-xs text-slate-300 leading-relaxed">
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            
                                            {/* Dates terms parameters section */}
                                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-850/65 space-y-2">
                                              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider text-right rtl:text-right ltr:text-left">
                                                {isAr ? 'آجال وجدولة الاستحقاق' : 'ISSUE & TIMELINE MATRICES'}
                                              </span>
                                              <div className="space-y-1 text-[11px] text-right rtl:text-right ltr:text-left">
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">{isAr ? 'تاريخ الإصدار:' : 'Issue Date:'}</span>
                                                  <span className="text-white font-semibold font-mono">{inv.issueDate}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">{isAr ? 'تاريخ الاستحقاق الأخير:' : 'Final Due Date:'}</span>
                                                  <span className={`font-semibold font-mono ${inv.status !== 'paid' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                                                    {inv.dueDate}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Bank Details wiring information */}
                                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-850/65 space-y-2 text-right rtl:text-right ltr:text-left">
                                              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                                                {isAr ? 'التحويل المصرفي المعتمد' : 'WIRE BANKING INSTRUCTIONS'}
                                              </span>
                                              <div className="space-y-1 text-[11px]">
                                                <div>
                                                  <span className="text-slate-400 text-[10px] block">{isAr ? 'البنك المستضيف للتحويل:' : 'Host Settlement Vault Bank:'}</span>
                                                  <span className="text-white font-bold">{isAr ? 'البنك السعودي الفرنسي' : 'Banque Saudi Fransi'}</span>
                                                </div>
                                                {inv.bankDetailsIBAN && (
                                                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-850 mt-1">
                                                    <div className="min-w-0">
                                                      <span className="text-slate-500 text-[9px] block">IBAN</span>
                                                      <span className="text-sky-400 font-bold font-mono text-[10px] block truncate">{inv.bankDetailsIBAN}</span>
                                                    </div>
                                                    <button
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(inv.bankDetailsIBAN || '');
                                                      }}
                                                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-[10px] font-bold cursor-pointer shrink-0 transition-all hover:scale-102"
                                                    >
                                                      {isAr ? 'نسخ الآيبان' : 'Copy'}
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            </div>

                                          </div>

                                          {/* Informational helpful checkmark */}
                                          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-850/60 text-xs">
                                            {inv.status === 'paid' ? (
                                              <p className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                <span>{isAr ? 'تمت تسوية هذه الفاتورة ومطابقة الدفعة بنجاح.' : 'This milestone statement has been settled, logged, and authorized.'}</span>
                                              </p>
                                            ) : (
                                              <p className="flex items-start gap-1.5 text-amber-400 font-medium">
                                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                <span>
                                                  {isAr 
                                                    ? 'يرجى تحويل الدفعة المستحقة إلى الآيبان الموضح أعلاه لمباشرة أعمال الفحص الفني وبدء تطوير البرمجيات.'
                                                    : 'Kindly complete wire transfer prior to due date to keep development sprints fully activated.'}
                                                </span>
                                              </p>
                                            )}
                                          </div>

                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4 font-sans text-right rtl:text-right ltr:text-left">
                        {/* Title bar with database status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                          <div>
                            <h5 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5 justify-start rtl:justify-end">
                              <Database className="w-4 h-4 text-emerald-405 animate-pulse" />
                              <span>{isAr ? 'منصة مستكشف وإدارة قواعد البيانات' : 'Firestore Real-time DB Manager'}</span>
                            </h5>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {isAr ? 'اتصال سحابي نشط مع Firestore Real-time Database' : 'Active cloud connections pointing directly to live document paths'}
                            </p>
                          </div>
                          
                          {/* Live cloud connection status pill */}
                          <div className="inline-flex items-center gap-1.5 self-start sm:self-center bg-emerald-500/10 text-emerald-405 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                            <span>{isAr ? 'متصل سحابياً' : 'CLOUD CONNECTED'}</span>
                          </div>
                        </div>

                        {/* Interactive segment switcher for collections */}
                        <div className="flex p-1 bg-slate-950/75 rounded-xl border border-slate-855 font-sans gap-1">
                          {[
                            { key: 'clients', count: allClients.length, labelAr: 'العملاء والشراكاء', labelEn: 'Clients DB' },
                            { key: 'requests', count: allRequests.length, labelAr: 'الطلبات التقنية', labelEn: 'Inquiries DB' },
                            { key: 'invoices', count: allInvoices.length, labelAr: 'الفواتير والماليات', labelEn: 'Invoices DB' }
                          ].map((segItem) => (
                            <button
                              key={segItem.key}
                              type="button"
                              onClick={() => {
                                setDbActiveSection(segItem.key as any);
                                setExpandedRequestId(null);
                              }}
                              className={`flex-1 py-1.5 text-center text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                dbActiveSection === segItem.key
                                  ? 'bg-sky-500 text-slate-950 font-black shadow-sm'
                                  : 'text-slate-400 hover:text-slate-205'
                              }`}
                            >
                              <span>{isAr ? segItem.labelAr : segItem.labelEn}</span>
                              <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold border ${
                                dbActiveSection === segItem.key 
                                  ? 'bg-slate-950 text-sky-400 border-slate-900' 
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}>
                                {segItem.count}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* 1. CLIENTS COLLECTION MANAGEMENT */}
                        {dbActiveSection === 'clients' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider font-mono">
                                {isAr ? 'بيانات تواصل عملاء المنصة' : 'AUTOSYNC: ONLINE CLIENT LIST'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setDbClientFormOpen(!dbClientFormOpen)}
                                className="px-3 py-1.5 rounded-lg bg-sky-500 text-slate-950 hover:bg-sky-450 text-[10px] font-black transition-all cursor-pointer inline-flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>{isAr ? 'إضافة عميل جديد لـ Firestore' : 'Add Client to Firestore'}</span>
                              </button>
                            </div>

                            {/* Client input form component drawer */}
                            <AnimatePresence>
                              {dbClientFormOpen && (
                                <motion.form
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  onSubmit={handleDbClientSubmit}
                                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-sans text-right placeholder:text-slate-700"
                                >
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                        {isAr ? 'البريد الإلكتروني للعميل *' : 'Client Corporate Email *'}
                                      </label>
                                      <input
                                        type="email"
                                        required
                                        value={dbNewClientEmail}
                                        onChange={e => setDbNewClientEmail(e.target.value)}
                                        placeholder="partner@enterprise.sa"
                                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all text-right ltr:text-left"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                        {isAr ? 'الاسم الثنائي / الثلاثي *' : 'Client Contact Name *'}
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={dbNewClientName}
                                        onChange={e => setDbNewClientName(e.target.value)}
                                        placeholder="عبد العزيز النوفل"
                                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all text-right ltr:text-left"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                        {isAr ? 'اسم المنشأة أو الشركة *' : 'Company Name *'}
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={dbNewClientCompany}
                                        onChange={e => setDbNewClientCompany(e.target.value)}
                                        placeholder="مجموعة النوفل للصناعة"
                                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all text-right ltr:text-left"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                        {isAr ? 'رقم جوال للتواصل' : 'Contact Phone'}
                                      </label>
                                      <input
                                        type="tel"
                                        value={dbNewClientPhone}
                                        onChange={e => setDbNewClientPhone(e.target.value)}
                                        placeholder="0505112233"
                                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all text-right ltr:text-left"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                      {isAr ? 'تعيين كلمة المرور (للتجربة والدخول متاح)' : 'Password (to simulate login)'}
                                    </label>
                                    <input
                                      type="text"
                                      value={dbNewClientPassword}
                                      onChange={e => setDbNewClientPassword(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all font-mono text-right ltr:text-left"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                                    <button
                                      type="button"
                                      onClick={() => setDbClientFormOpen(false)}
                                      className="px-3 py-1.5 rounded bg-slate-950 hover:bg-slate-900 text-slate-400 text-[10px] font-bold cursor-pointer"
                                    >
                                      {isAr ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                      type="submit"
                                      className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 hover:bg-sky-450 font-extrabold text-[10px] cursor-pointer"
                                    >
                                      {isAr ? 'حفظ المستند بقاعدة البيانات ➔' : 'Commit Client Document ➔'}
                                    </button>
                                  </div>
                                </motion.form>
                              )}
                            </AnimatePresence>

                            {/* Clients live display list */}
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                              {allClients.map((cl, cIdx) => (
                                <div key={cIdx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-850 flex justify-between items-center gap-3">
                                  <div className="space-y-0.5 text-right rtl:text-right ltr:text-left min-w-0">
                                    <h6 className="text-xs font-extrabold text-white truncate">{cl.name}</h6>
                                    <p className="text-[10px] text-slate-400 truncate">{cl.companyName}</p>
                                    <span className="text-[9px] font-mono text-sky-450/80 block mt-0.5 truncate">{cl.email}</span>
                                  </div>
                                  <div className="text-left shrink-0 text-right">
                                    {cl.phone && <span className="text-[10px] font-mono text-slate-500 block">{cl.phone}</span>}
                                    <span className="text-[9px] font-mono text-slate-400 bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded-md inline-block mt-0.5 font-bold">
                                      {isAr ? `رمز الشريك: ${cl.password}` : `Key: ${cl.password}`}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 2. REQUESTS COLLECTION COORDINATOR */}
                        {dbActiveSection === 'requests' && (
                          <div className="space-y-3">
                            <div className="text-[10px] text-slate-400 border-b border-slate-900 pb-1 flex justify-between uppercase tracking-wider font-mono">
                              <span>{isAr ? 'مسارات ومراحل تتبع مشاريع الشركاء' : 'Control request statuses across Firestore documents'}</span>
                            </div>
                            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                              {allRequests.map((reqItem) => {
                                const targetSector = SECTORS.find(s => s.id === reqItem.sectorId);
                                const targetSolution = SOLUTIONS.find(s => s.id === reqItem.solutionId);
                                return (
                                  <div key={reqItem.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-850 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-900 pb-2">
                                      <div className="text-right rtl:text-right ltr:text-left">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] font-mono text-sky-450 font-bold bg-slate-900 border border-slate-850 px-1.5 py-0.2 rounded-md">
                                            #{reqItem.id}
                                          </span>
                                          <span className="text-[9px] text-slate-505 font-mono">{reqItem.createdAt}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 block mt-1">
                                          {isAr ? `الشريك: ${reqItem.name} | ${reqItem.companyName}` : `Client: ${reqItem.name} | ${reqItem.companyName}`}
                                        </span>
                                        <span className="text-[9px] truncate font-mono text-slate-500 block">{reqItem.clientEmail}</span>
                                      </div>

                                      {/* LIVE status updater */}
                                      <div className="flex items-center gap-2 rtl:justify-end self-start sm:self-center">
                                        <span className="text-[10px] text-slate-500">{isAr ? 'حالة التدفق:' : 'Flow Status:'}</span>
                                        <select
                                          value={reqItem.status}
                                          onChange={(e) => onUpdateRequestStatus?.(reqItem.id, e.target.value as any)}
                                          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-sky-400 font-bold focus:border-sky-500 focus:outline-none transition-all cursor-pointer"
                                        >
                                          <option value="pending">{isAr ? 'تم الاستلام (Pending)' : 'Pending/Filed'}</option>
                                          <option value="reviewing">{isAr ? 'قيد المراجعة (Reviewing)' : 'Sizing/Reviewing'}</option>
                                          <option value="planned">{isAr ? 'تمت الجدولة (Planned)' : 'Planned'}</option>
                                          <option value="approved">{isAr ? 'اعتمدت (Approved)' : 'Approved'}</option>
                                          <option value="completed">{isAr ? 'مكتملة ونشطة (Live)' : 'Live/Completed'}</option>
                                        </select>
                                      </div>
                                    </div>

                                    {/* Sizing context attributes */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                                      <div>
                                        <span className="font-semibold text-slate-500">{isAr ? 'الخدمة التمكينية للتحول:' : 'Digital Transformation Pillar:'}</span>{' '}
                                        <span className="text-white">
                                          {targetSolution ? (isAr ? targetSolution.titleAr : targetSolution.titleEn) : reqItem.solutionId}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-semibold text-slate-500">{isAr ? 'تقدير استرشادي:' : 'Baseline Budget Sizing:'}</span>{' '}
                                        <span className="text-emerald-400 font-bold font-mono">
                                          {isAr ? '﷼ ' : 'SAR '}{reqItem.estimatedCost || '35,000'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* 3. INVOICES COLLECTION COMPILER */}
                        {dbActiveSection === 'invoices' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                                {isAr ? 'إصدار وتنظيم فواتير المشاريع' : 'FUNDS ALLOCATION ENGINE'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setDbInvoiceFormOpen(!dbInvoiceFormOpen)}
                                className="px-3 py-1.5 rounded-lg bg-sky-500 text-slate-950 hover:bg-sky-450 text-[10px] font-black transition-all cursor-pointer inline-flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>{isAr ? 'إصدار فاتورة شريك سحابية' : 'Issue New Invoice Document'}</span>
                              </button>
                            </div>

                            {/* New Invoice form drawer components */}
                            <AnimatePresence>
                              {dbInvoiceFormOpen && (
                                <motion.form
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  onSubmit={handleDbInvoiceSubmit}
                                  className="p-4 rounded-xl bg-slate-900/85 border border-slate-800 space-y-3 font-sans text-right"
                                >
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                        {isAr ? 'اختر حساب العميل الشريك *' : 'Associate Partner Account *'}
                                      </label>
                                      <select
                                        required
                                        value={dbNewInvoiceClientEmail}
                                        onChange={e => {
                                          setDbNewInvoiceClientEmail(e.target.value);
                                          // Auto-default to first matching request ID if possible
                                          const matched = allRequests.find(r => r.clientEmail.toLowerCase() === e.target.value.toLowerCase());
                                          if (matched) setDbNewInvoiceRequestId(matched.id);
                                        }}
                                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all font-mono text-right"
                                      >
                                        <option value="">{isAr ? '--- اختر بريد شريك ---' : '--- Choose partner account ---'}</option>
                                        {allClients.map((clientItem, clIdx) => (
                                          <option key={clIdx} value={clientItem.email}>{clientItem.email}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                        {isAr ? 'ارتباط الطلب الاستشاري (اختياري)' : 'Link Sizing Consultation Request (Optional)'}
                                      </label>
                                      <select
                                        value={dbNewInvoiceRequestId}
                                        onChange={e => setDbNewInvoiceRequestId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all font-mono text-right"
                                      >
                                        <option value="">{isAr ? '--- لا يوجد ارتباط مباشر ---' : '--- No direct link ---'}</option>
                                        {allRequests
                                          .filter(r => !dbNewInvoiceClientEmail || r.clientEmail.toLowerCase() === dbNewInvoiceClientEmail.toLowerCase())
                                          .map((reqItem, rIdx) => (
                                            <option key={rIdx} value={reqItem.id}>{reqItem.id} ({reqItem.companyName})</option>
                                          ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                        {isAr ? 'العنوان المالي بالعربية *' : 'Arabic Invoice Title *'}
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={dbNewInvoiceTitleAr}
                                        onChange={e => setDbNewInvoiceTitleAr(e.target.value)}
                                        placeholder="المرحلة الثانية: ترحيل خوادم الفروع السحابية"
                                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2.5 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all text-right ltr:text-left"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                        {isAr ? 'العنوان المالي بالإنجليزية *' : 'English Invoice Title *'}
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={dbNewInvoiceTitleEn}
                                        onChange={e => setDbNewInvoiceTitleEn(e.target.value)}
                                        placeholder="Phase 2: Cloud Branch Servers Modernization"
                                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2.5 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all text-right ltr:text-left"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                        {isAr ? 'مبلغ الفاتورة بالريال * (منسق بفاصلة)' : 'Amount SAR * (comma formatted)'}
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={dbNewInvoiceAmount}
                                        onChange={e => setDbNewInvoiceAmount(e.target.value)}
                                        placeholder="85,000"
                                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2 px-3 text-white text-sm font-extrabold focus:border-sky-500 transition-all font-mono text-right ltr:text-left"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                        {isAr ? 'حالة السداد والتحقق' : 'Due Status'}
                                      </label>
                                      <select
                                        value={dbNewInvoiceStatus}
                                        onChange={e => setDbNewInvoiceStatus(e.target.value as any)}
                                        className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all text-right"
                                      >
                                        <option value="unpaid">{isAr ? 'مستحقة للدفع (Unpaid)' : 'Unpaid'}</option>
                                        <option value="paid">{isAr ? 'تم تسديدها ومطابقتها (Paid)' : 'Paid / Settled'}</option>
                                        <option value="overdue">{isAr ? 'متأخرة عن الآجال (Overdue)' : 'Overdue'}</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-slate-400 text-[10px] font-bold block mb-1">
                                      {isAr ? 'آيبان التحويل البنكي للتسوية المباشرة' : 'IBAN Saudi Fransi'}
                                    </label>
                                    <input
                                      type="text"
                                      value={dbNewInvoiceIBAN}
                                      onChange={e => setDbNewInvoiceIBAN(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-850 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-sky-500 transition-all font-mono text-right ltr:text-left"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                                    <button
                                      type="button"
                                      onClick={() => setDbInvoiceFormOpen(false)}
                                      className="px-3 py-1.5 rounded bg-slate-950 hover:bg-slate-900 text-slate-400 text-[10px] font-bold cursor-pointer"
                                    >
                                      {isAr ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                      type="submit"
                                      className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 hover:bg-sky-450 font-extrabold text-[10px] cursor-pointer"
                                    >
                                      {isAr ? 'ترحيل وإصدار الفاتورة ➔' : 'Issue Invoice Cloud Document ➔'}
                                    </button>
                                  </div>
                                </motion.form>
                              )}
                            </AnimatePresence>

                            {/* Invoices live display list */}
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                              {allInvoices.map((invItem, idx) => (
                                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-850 flex justify-between items-center gap-2">
                                  <div className="text-right rtl:text-right ltr:text-left min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-mono text-sky-450 font-bold bg-slate-900 border border-slate-855 px-1.5 py-0.2 rounded-md">
                                        {invItem.id}
                                      </span>
                                      <span className="text-[9px] text-slate-400 truncate">{invItem.clientEmail}</span>
                                    </div>
                                    <h6 className="text-[11px] font-bold text-white mt-1 truncate">{isAr ? invItem.titleAr : invItem.titleEn}</h6>
                                  </div>
                                  <div className="text-left shrink-0 text-right">
                                    <span className="text-[11px] font-extrabold font-mono text-white block">
                                      {isAr ? '﷼ ' : 'SAR '}{invItem.amount}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold block text-center mt-1 uppercase ${
                                      invItem.status === 'paid'
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : invItem.status === 'overdue'
                                        ? 'bg-red-500/10 text-red-400'
                                        : 'bg-amber-500/10 text-amber-400'
                                    }`}>
                                      {invItem.status === 'paid' ? (isAr ? 'مسددة' : 'Paid') 
                                       : invItem.status === 'overdue' ? (isAr ? 'متأخرة' : 'Overdue')
                                       : (isAr ? 'مستحقة' : 'Outstanding')}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850/60 text-[10px] text-slate-400 text-center leading-relaxed">
                      {isAr 
                        ? 'ملاحظة: تظهر الطلبات التي تقدمها بنماذج الاستراتيجية وحجز الأدوات وتحديث النماذج تلقائياً في حسابك الشريك بمجرد إرسالها.'
                        : 'Any technological sizing or dynamic modernization request submitted while logged in links automatically in your enterprise area.'}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
