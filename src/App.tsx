import { useState, useEffect } from 'react';
import { Lang, Client, ClientRequest, ClientInvoice } from './types';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import ScrollProgressBar from './components/ScrollProgressBar';
import Navbar from './components/Navbar';
import QuickHelpModal from './components/QuickHelpModal';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import ClientTrust from './components/ClientTrust';
import SolutionsSection from './components/SolutionsSection';
import SectorsSection from './components/SectorsSection';
import ServicesMarket from './components/ServicesMarket';
import AboutSection from './components/AboutSection';
import PortfolioSection from './components/PortfolioSection';
import FAQSection from './components/FAQSection';
import ConsultationForm from './components/ConsultationForm';
import NewsletterSubscription from './components/NewsletterSubscription';
import Footer from './components/Footer';
import LiveChatWidget from './components/LiveChatWidget';
import ClientPortal from './components/ClientPortal';
import EntrepreneurJourney from './components/EntrepreneurJourney';

export default function App() {
  const [lang, setLang] = useState<Lang>('ar'); // Defaulting to Arabic as requested by user's content layout
  const [preselectedSectorId, setPreselectedSectorId] = useState<string>('');
  const [preselectedSolutionId, setPreselectedSolutionId] = useState<string>('');
  const [isQuickHelpOpen, setIsQuickHelpOpen] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);

  // Client authentication simulated persistent database
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('bd_clients');
    if (saved) return JSON.parse(saved);
    return [
      {
        email: 'demo@developer.sa',
        name: 'عبد الرحمن المطلق',
        companyName: 'مجموعة المطلق القابضة',
        phone: '0501122334',
        password: 'password123',
        avatar: '🏢',
        tier: 'gold',
        industry: 'retail',
        joinedAt: '01 May 2026',
        bio: 'مجموعتنا تسعى لأتمتة كافة العمليات اللوجستية وتكامل الفروع السحابية ممتدة الفروع حول المملكة.'
      },
      {
        email: 'businesdevelopers@gmail.com',
        name: 'شريك التطوير البلانيني',
        companyName: 'مؤسسة الرواد الدولية',
        phone: '0555555555',
        password: 'password123',
        avatar: '🚀',
        tier: 'platinum',
        industry: 'banking',
        joinedAt: '25 Apr 2026',
        bio: 'ريادة الابتكار والتكامل مع الأنظمة المالية المفتوحة ونظم سداد المدفوعات الحكومية والخاصة.'
      }
    ];
  });

  // Client requests tracker simulated database
  const [requests, setRequests] = useState<ClientRequest[]>(() => {
    const saved = localStorage.getItem('bd_requests');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'BD-7832',
        clientEmail: 'demo@developer.sa',
        name: 'عبد الرحمن المطلق',
        companyName: 'مجموعة المطلق القابضة',
        sectorId: 'retail',
        solutionId: 'cloud-computing',
        message: 'نريد ترحيل خوادم الفروع إلى سحابة مرنة لتخفيض تكاليف التراخيص وربط الفواتير الموحدة.',
        status: 'completed',
        createdAt: '01 Jun 2026',
        techStack: ['AWS Lambda & Terraform IaC', 'DynamoDB / PostgreSQL Vault', 'Nginx Traffic Proxy Routing', 'CloudWatch Metric Monitors'],
        timelineDays: 45,
        estimatedCost: '145,000'
      },
      {
        id: 'BD-8941',
        clientEmail: 'demo@developer.sa',
        name: 'عبد الرحمن المطلق',
        companyName: 'مجموعة المطلق القابضة',
        sectorId: 'government',
        solutionId: 'ai-ml',
        message: 'إدخال نماذج التعلم العميق الرشيقة للتنبؤ برغبات المستهلكين وذكاء الأعمال الرقمي.',
        status: 'reviewing',
        createdAt: '02 Jun 2026',
        techStack: ['TensorFlow & PyTorch Servings', 'FastAPI Microservice Layer', 'Milvus Vector Search DB'],
        timelineDays: 120,
        estimatedCost: '280,000'
      },
      {
        id: 'BD-1225',
        clientEmail: 'businesdevelopers@gmail.com',
        name: 'شريك التطوير البلاتيني',
        companyName: 'مؤسسة الرواد الدولية',
        sectorId: 'banking',
        solutionId: 'digital-transformation',
        message: 'دراسة استشارية متكاملة لرقمنة المعاملات المالية المفتوحة والربط مع شبكة سداد الوطنية.',
        status: 'planned',
        createdAt: '03 Jun 2026',
        techStack: ['Zero-Trust Cryptographic Kernels', 'Apache Kafka Broker', 'Open-API Secure Gateways'],
        timelineDays: 180,
        estimatedCost: '350,000'
      }
    ];
  });

  const [currentClient, setCurrentClient] = useState<Client | null>(() => {
    const saved = localStorage.getItem('bd_current_client');
    return saved ? JSON.parse(saved) : null;
  });

  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);

  // Load initial databases from Firestore on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Load clients from cloud Firestore
        const clientsSnap = await getDocs(collection(db, 'clients')).catch(err => {
          handleFirestoreError(err, OperationType.GET, 'clients');
        });
        const clientList: Client[] = [];
        if (clientsSnap) {
          clientsSnap.forEach(docSnap => {
            clientList.push(docSnap.data() as Client);
          });
        }

        // If firestore is empty, seed initial baseline company accounts
        if (clientList.length === 0) {
          const initialClients: Client[] = [
            {
              email: 'demo@developer.sa',
              name: 'عبد الرحمن المطلق',
              companyName: 'مجموعة المطلق القابضة',
              phone: '0501122334',
              password: 'password123',
              avatar: '🏢',
              tier: 'gold',
              industry: 'retail',
              joinedAt: '01 May 2026',
              bio: 'مجموعتنا تسعى لأتمتة كافة العمليات اللوجستية وتكامل الفروع السحابية ممتدة الفروع حول المملكة.'
            },
            {
              email: 'businesdevelopers@gmail.com',
              name: 'شريك التطوير البلانيني',
              companyName: 'مؤسسة الرواد الدولية',
              phone: '0555555555',
              password: 'password123',
              avatar: '🚀',
              tier: 'platinum',
              industry: 'banking',
              joinedAt: '25 Apr 2026',
              bio: 'ريادة الابتكار والتكامل مع الأنظمة المالية المفتوحة ونظم سداد المدفوعات الحكومية والخاصة.'
            }
          ];
          for (const c of initialClients) {
            await setDoc(doc(db, 'clients', c.email.toLowerCase()), c).catch(err => {
              handleFirestoreError(err, OperationType.WRITE, `clients/${c.email.toLowerCase()}`);
            });
            clientList.push(c);
          }
        }
        setClients(clientList);

        // Load consultation/sizing requests from cloud Firestore
        const requestsSnap = await getDocs(collection(db, 'requests')).catch(err => {
          handleFirestoreError(err, OperationType.GET, 'requests');
        });
        const requestList: ClientRequest[] = [];
        if (requestsSnap) {
          requestsSnap.forEach(docSnap => {
            requestList.push(docSnap.data() as ClientRequest);
          });
        }

        if (requestList.length === 0) {
          const initialRequests: ClientRequest[] = [
            {
              id: 'BD-7832',
              clientEmail: 'demo@developer.sa',
              name: 'عبد الرحمن المطلق',
              companyName: 'مجموعة المطلق القابضة',
              sectorId: 'retail',
              solutionId: 'cloud-computing',
              message: 'نريد ترحيل خوادم الفروع إلى سحابة مرنة لتخفيض تكاليف التراخيص وربط الفواتير الموحدة.',
              status: 'completed',
              createdAt: '01 Jun 2026',
              techStack: ['AWS Lambda & Terraform IaC', 'DynamoDB / PostgreSQL Vault', 'Nginx Traffic Proxy Routing', 'CloudWatch Metric Monitors'],
              timelineDays: 45,
              estimatedCost: '145,000'
            },
            {
              id: 'BD-8941',
              clientEmail: 'demo@developer.sa',
              name: 'عبد الرحمن المطلق',
              companyName: 'مجموعة المطلق القابضة',
              sectorId: 'government',
              solutionId: 'ai-ml',
              message: 'إدخال نماذج التعلم العميق الرشيقة للتنبؤ برغبات المستهلكين وذكاء الأعمال الرقمي.',
              status: 'reviewing',
              createdAt: '02 Jun 2026',
              techStack: ['TensorFlow & PyTorch Servings', 'FastAPI Microservice Layer', 'Milvus Vector Search DB'],
              timelineDays: 120,
              estimatedCost: '280,000'
            },
            {
              id: 'BD-1225',
              clientEmail: 'businesdevelopers@gmail.com',
              name: 'شريك التطوير البلاتيني',
              companyName: 'مؤسسة الرواد الدولية',
              sectorId: 'banking',
              solutionId: 'digital-transformation',
              message: 'دراسة استشارية متكاملة لرقمنة المعاملات المالية المفتوحة والربط مع شبكة سداد الوطنية.',
              status: 'planned',
              createdAt: '03 Jun 2026',
              techStack: ['Zero-Trust Cryptographic Kernels', 'Apache Kafka Broker', 'Open-API Secure Gateways'],
              timelineDays: 180,
              estimatedCost: '350,000'
            }
          ];
          for (const r of initialRequests) {
            await setDoc(doc(db, 'requests', r.id), r).catch(err => {
              handleFirestoreError(err, OperationType.WRITE, `requests/${r.id}`);
            });
            requestList.push(r);
          }
        }
        setRequests(requestList);

        // Load invoices from cloud Firestore
        const invoicesSnap = await getDocs(collection(db, 'invoices')).catch(err => {
          handleFirestoreError(err, OperationType.GET, 'invoices');
        });
        const invoiceList: ClientInvoice[] = [];
        if (invoicesSnap) {
          invoicesSnap.forEach(docSnap => {
            invoiceList.push(docSnap.data() as ClientInvoice);
          });
        }

        if (invoiceList.length === 0) {
          const initialInvoices: ClientInvoice[] = [
            {
              id: 'INV-4309',
              clientEmail: 'demo@developer.sa',
              requestId: 'BD-7832',
              titleAr: 'المرحلة الأولى: ترحيل وإعداد خوادم الفروع السحابية',
              titleEn: 'Phase 1: Cloud Server Branch Migration Retainer',
              amount: '65,000',
              status: 'paid',
              issueDate: '02 Jun 2026',
              dueDate: '15 Jun 2026',
              bankDetailsIBAN: 'SA8040000001234567890123'
            },
            {
              id: 'INV-4411',
              clientEmail: 'demo@developer.sa',
              requestId: 'BD-8941',
              titleAr: 'دفعة اعتماد: دراسة وجدوى خوارزميات الذكاء الاصطناعي',
              titleEn: 'Advisory Sizing Deposit: Deep AI Models Architecture',
              amount: '120,000',
              status: 'unpaid',
              issueDate: '03 Jun 2026',
              dueDate: '20 Jun 2026',
              bankDetailsIBAN: 'SA8040000001234567890123'
            },
            {
              id: 'INV-5502',
              clientEmail: 'businesdevelopers@gmail.com',
              requestId: 'BD-1225',
              titleAr: 'دفعة مقدمة: استشارات رقمنة المعاملات والربط مع سداد',
              titleEn: 'Retainer Deposit: Open Banking Strategy & Sadad Link',
              amount: '150,000',
              status: 'paid',
              issueDate: '03 Jun 2026',
              dueDate: '10 Jun 2026',
              bankDetailsIBAN: 'SA8040000008888888888888'
            }
          ];
          for (const inv of initialInvoices) {
            await setDoc(doc(db, 'invoices', inv.id), inv).catch(err => {
              handleFirestoreError(err, OperationType.WRITE, `invoices/${inv.id}`);
            });
            invoiceList.push(inv);
          }
        }
        setInvoices(invoiceList);

      } catch (err) {
        console.error("Firestore Loading Issue: ", err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (currentClient) {
      localStorage.setItem('bd_current_client', JSON.stringify(currentClient));
    } else {
      localStorage.removeItem('bd_current_client');
    }
  }, [currentClient]);

  const handleLogin = (email: string, pass: string) => {
    const found = clients.find(c => c.email.toLowerCase() === email.toLowerCase() && c.password === pass);
    if (found) {
      setCurrentClient(found);
      return { success: true };
    }
    return { 
      success: false, 
      error: lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور آتية بصيغة خاطئة' : 'Corporate email or password does not match.' 
    };
  };

  const handleRegister = async (newClient: Client) => {
    const exists = clients.some(c => c.email.toLowerCase() === newClient.email.toLowerCase());
    if (exists) {
      return { 
        success: false, 
        error: lang === 'ar' ? 'هذا البريد الإلكتروني مسجل مسبقاً لدينا' : 'This corporate email is already on our system.' 
      };
    }

    try {
      const clientEmail = newClient.email.toLowerCase();
      const clientWithDefaults: Client = {
        ...newClient,
        avatar: newClient.avatar || '💻',
        tier: 'silver',
        joinedAt: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        bio: newClient.bio || (lang === 'ar' ? 'مؤسسة ريادية شريكة في مسيرة التحول الرقمي مع بيزنس ديفلوبرز.' : 'Enterprise partner in the digital transformation journey with Business Developers.'),
        industry: newClient.industry || (lang === 'ar' ? 'تجارة وتوريد' : 'Trade & Supply')
      };

      await setDoc(doc(db, 'clients', clientEmail), clientWithDefaults).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `clients/${clientEmail}`);
      });
      
      // Auto-seed a welcome request on registration so they explore timelines smoothly
      const welcomeRequest: ClientRequest = {
        id: `BD-${Math.floor(1000 + Math.random() * 9000)}`,
        clientEmail: clientEmail,
        name: clientWithDefaults.name,
        companyName: clientWithDefaults.companyName,
        sectorId: 'retail',
        solutionId: 'digital-transformation',
        message: lang === 'ar' 
          ? 'تم إعداد هذا التتبع الاسترشادي الترحيبي تلقائياً لاطلاعك على خطوات تنفيذ الحلول.' 
          : 'This welcome inquiry tracker was created automatically to demonstrate structural progress steps.',
        status: 'pending',
        createdAt: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        techStack: ['React Framework', 'Tailwind Utility Core', 'Vite Bundle Engine'],
        timelineDays: 14,
        estimatedCost: '35,000'
      };

      await setDoc(doc(db, 'requests', welcomeRequest.id), welcomeRequest).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `requests/${welcomeRequest.id}`);
      });

      setClients(prev => [...prev, clientWithDefaults]);
      setRequests(prev => [welcomeRequest, ...prev]);

      return { success: true };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: lang === 'ar' ? 'حدث خطأ في الاتصال بقاعدة البيانات' : 'Failed to register client profile in Firestore.'
      };
    }
  };

  const handleLogout = () => {
    setCurrentClient(null);
  };

  const handleAddRequest = async (reqData: Partial<ClientRequest> & Omit<ClientRequest, 'id' | 'createdAt' | 'clientEmail' | 'status'>) => {
    const rId = `BD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: ClientRequest = {
      ...reqData,
      id: rId,
      clientEmail: reqData.clientEmail ? reqData.clientEmail.toLowerCase() : (currentClient ? currentClient.email.toLowerCase() : 'unregistered@guest.com'),
      status: 'pending',
      createdAt: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    try {
      await setDoc(doc(db, 'requests', rId), newRequest).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `requests/${rId}`);
      });
      setRequests(prev => [newRequest, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  // Firestore DB mutations
  const handleUpdateRequestStatus = async (requestId: string, newStatus: ClientRequest['status']) => {
    const reqToUpdate = requests.find(r => r.id === requestId);
    if (!reqToUpdate) return;
    const updatedRequest: ClientRequest = {
      ...reqToUpdate,
      status: newStatus
    };
    try {
      await setDoc(doc(db, 'requests', requestId), updatedRequest).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `requests/${requestId}`);
      });
      setRequests(prev => prev.map(r => r.id === requestId ? updatedRequest : r));
    } catch (err) {
      console.error("Failed to update status in Firestore: ", err);
    }
  };

  const handleCreateInvoice = async (newInv: ClientInvoice) => {
    try {
      await setDoc(doc(db, 'invoices', newInv.id), newInv).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `invoices/${newInv.id}`);
      });
      setInvoices(prev => [newInv, ...prev]);
    } catch (err) {
      console.error("Failed to create Invoice in Firestore: ", err);
    }
  };

  const handleCreateClient = async (newCl: Client) => {
    try {
      const clientEmail = newCl.email.toLowerCase();
      await setDoc(doc(db, 'clients', clientEmail), newCl).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `clients/${clientEmail}`);
      });
      setClients(prev => [...prev, newCl]);
    } catch (err) {
      console.error("Failed to create Client in Firestore: ", err);
    }
  };

  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      const clientEmail = updatedClient.email.toLowerCase();
      await setDoc(doc(db, 'clients', clientEmail), updatedClient).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `clients/${clientEmail}`);
      });
      setClients(prev => prev.map(c => c.email.toLowerCase() === clientEmail ? updatedClient : c));
      if (currentClient && currentClient.email.toLowerCase() === clientEmail) {
        setCurrentClient(updatedClient);
      }
    } catch (err) {
      console.error("Failed to update Client in Firestore: ", err);
    }
  };

  // Check if current user is the administrator
  const isAdminAccount = currentClient?.email.toLowerCase() === 'businesdevelopers@gmail.com';

  // Filter requests targeting the currently authenticated corporate account, or all if admin
  const activeClientRequests = requests.filter(r => 
    currentClient && (isAdminAccount || r.clientEmail.toLowerCase() === currentClient.email.toLowerCase())
  );

  // Filter invoices targeting the currently authenticated corporate account, or all if admin
  const activeClientInvoices = invoices.filter(inv => 
    currentClient && (isAdminAccount || inv.clientEmail.toLowerCase() === currentClient.email.toLowerCase())
  );

  // Global Ctrl+K / Cmd+K listener for Quick Help Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        const isEditable = document.activeElement?.getAttribute('contenteditable') === 'true';
        
        // Ignore shortcut if typing inside message fields, inputs or textareas
        if (activeTag === 'input' || activeTag === 'textarea' || isEditable) {
          return;
        }
        
        e.preventDefault();
        setIsQuickHelpOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (sectionId: string, customSectorId?: string, customSolutionId?: string) => {
    if (customSectorId !== undefined) {
      setPreselectedSectorId(customSectorId);
    }
    if (customSolutionId !== undefined) {
      setPreselectedSolutionId(customSolutionId);
    }

    const ele = document.getElementById(sectionId);
    if (ele) {
      ele.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigateToConsultWithSector = (sectorId: string) => {
    handleNavigate('consultation', sectorId, '');
  };

  const handleNavigateToConsultWithSolution = (solutionId: string) => {
    handleNavigate('consultation', '', solutionId);
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen text-slate-900 bg-[#fafafa] selection:bg-sky-500 selection:text-white transition-all duration-300 ${
        lang === 'ar' ? 'text-right' : 'text-left'
      }`}
    >
      {/* Scroll indicator overlay */}
      <ScrollProgressBar />

      {/* AI-powered Quick Help automated assistant portal */}
      <QuickHelpModal
        isOpen={isQuickHelpOpen}
        onClose={() => setIsQuickHelpOpen(false)}
        lang={lang}
      />

      {/* Dynamic light grids for ambient background modern aesthetics */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-sky-100/10 via-indigo-100/5 to-transparent pointer-events-none" />

      {/* Main app navigation wrapper */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onNavigate={(id) => handleNavigate(id)}
        onOpenQuickHelp={() => setIsQuickHelpOpen(true)}
        currentClient={currentClient}
        onOpenClientPortal={() => setIsClientPortalOpen(true)}
        requests={requests}
      />

      {/* Core Landing sections */}
      <main className="relative">
        <Hero
          lang={lang}
          onNavigate={(id) => handleNavigate(id)}
        />
        
        <StatsSection lang={lang} />

        <ClientTrust lang={lang} />

        <SolutionsSection
          lang={lang}
          onNavigateToConsult={handleNavigateToConsultWithSolution}
        />

        <SectorsSection
          lang={lang}
          onNavigateToConsult={handleNavigateToConsultWithSector}
        />

        <ServicesMarket 
          lang={lang} 
          currentClient={currentClient}
          onAddRequest={handleAddRequest}
        />

        <EntrepreneurJourney
          lang={lang}
          currentClient={currentClient}
          onAddRequest={handleAddRequest}
          onOpenClientPortal={() => setIsClientPortalOpen(true)}
        />

        <PortfolioSection lang={lang} />

        <AboutSection lang={lang} />

        <FAQSection lang={lang} />

        <ConsultationForm
          lang={lang}
          preselectedSectorId={preselectedSectorId}
          preselectedSolutionId={preselectedSolutionId}
          currentClient={currentClient}
          onAddRequest={handleAddRequest}
        />
      </main>

      {/* Lead Capture Newsletter updates banner */}
      <NewsletterSubscription lang={lang} />

      {/* Corporate Footprint footer */}
      <Footer
        lang={lang}
        onNavigate={(id) => handleNavigate(id)}
      />

      {/* Floating support live-chat system */}
      <LiveChatWidget lang={lang} />

      {/* Dynamic Partner & Client tracking portal */}
      <ClientPortal
        lang={lang}
        isOpen={isClientPortalOpen}
        onClose={() => setIsClientPortalOpen(false)}
        currentClient={currentClient}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        requests={activeClientRequests}
        invoices={activeClientInvoices}
        allClients={clients}
        allRequests={requests}
        allInvoices={invoices}
        onUpdateRequestStatus={handleUpdateRequestStatus}
        onCreateInvoice={handleCreateInvoice}
        onCreateClient={handleCreateClient}
        onUpdateClient={handleUpdateClient}
        onScrollToConsultation={() => handleNavigate('consultation')}
      />
    </div>
  );
}
