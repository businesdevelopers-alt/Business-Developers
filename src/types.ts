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

