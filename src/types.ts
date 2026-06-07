export type Lang = 'ar' | 'en';

export interface Solution {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  featuresAr: string[];
  featuresEn: string[];
  impactAr: string;
  impactEn: string;
  detailsAr: string;
  detailsEn: string;
}

export interface Sector {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  challengesAr: string[];
  challengesEn: string[];
  solutionsProvidedAr: string[];
  solutionsProvidedEn: string[];
  caseStudyTitleAr: string;
  caseStudyTitleEn: string;
  caseStudyDescAr: string;
  caseStudyDescEn: string;
  metrics: {
    labelAr: string;
    labelEn: string;
    value: string;
  }[];
}

export interface ContactInquiry {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  sectorId: string;
  solutionId: string;
  message: string;
}

export interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  sectorAr: string;
  sectorEn: string;
  descriptionAr: string;
  descriptionEn: string;
  demoLink: string;
  techStack: string[];
  iconName: string;
}

export interface FAQItem {
  id: string;
  categoryAr: string;
  categoryEn: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

export interface Client {
  email: string;
  name: string;
  companyName: string;
  phone?: string;
  password?: string; // stored hashed or simply for prototype auth simulation
  avatar?: string; // e.g., 'avatar-1'
  tier?: 'silver' | 'gold' | 'platinum'; // Partner Tier
  industry?: string; // Company Industry
  joinedAt?: string; // Joining date
  bio?: string; // Company brief bio
  jobTitle?: string; // Job Title
  linkedin?: string; // LinkedIn URL
  logo?: string; // Company custom logo
  notifications?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  team?: any[];
  contracts?: any[];
}

export interface ClientRequest {
  id: string;
  clientEmail: string;
  name: string;
  companyName: string;
  sectorId: string;
  solutionId: string;
  message: string;
  phone?: string;
  status: 'pending' | 'reviewing' | 'planned' | 'approved' | 'completed';
  createdAt: string;
  techStack?: string[];
  timelineDays?: number;
  estimatedCost?: string;
}

export interface ClientInvoice {
  id: string; // e.g. "INV-4309"
  clientEmail: string;
  requestId?: string;
  titleAr: string;
  titleEn: string;
  amount: string;
  status: 'paid' | 'unpaid' | 'overdue';
  issueDate: string;
  dueDate: string;
  bankDetailsName?: string;
  bankDetailsIBAN?: string;
}

