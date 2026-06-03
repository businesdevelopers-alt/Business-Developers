import React from 'react';
import {
  Compass,
  Zap,
  Cpu,
  Cloud,
  BarChart3,
  ShieldAlert,
  Smartphone,
  Server,
  Building2,
  Coins,
  Milestone,
  Activity,
  Truck,
  ShoppingBag,
  Home,
  Sparkles,
  Briefcase,
  Lightbulb
} from 'lucide-react';

export const getIconComponent = (name: string, className?: string) => {
  switch (name) {
    case 'Compass': return <Compass className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Cloud': return <Cloud className={className} />;
    case 'BarChart3': return <BarChart3 className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'Smartphone': return <Smartphone className={className} />;
    case 'Server': return <Server className={className} />;
    case 'Building2': return <Building2 className={className} />;
    case 'Coins': return <Coins className={className} />;
    case 'Milestone': return <Milestone className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Truck': return <Truck className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'Home': return <Home className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Lightbulb': return <Lightbulb className={className} />;
    default: return <Briefcase className={className} />;
  }
};
