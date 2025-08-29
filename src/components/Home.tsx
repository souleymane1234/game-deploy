import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { usePluginManager } from '../plugins/PluginManager';
// import { usePluginManager } from '../plugins/Text';
import { X, Eye, EyeOff, Plus, Mail, Phone, Lock, ChevronRight, Star, Award, TrendingUp, Clock, Gift, Calendar, Users, Zap, Shield, Bell, Wallet, ArrowDownCircle, ArrowUpCircle, CreditCard, Menu } from 'lucide-react';
import BalanceService from '../services/BalanceService';


interface ColorClass {
  bg: string;
  text: string;
}

const getColors = (colorClass: string): ColorClass => {
  switch(colorClass) {
    case 'bg-white text-gray-600': return { bg: '#ffffff', text: '#4b5563' };
    case 'bg-blue-600 text-white': return { bg: '#2563eb', text: '#ffffff' };
    case 'bg-blue-400 text-white': return { bg: '#60a5fa', text: '#ffffff' };
    case 'bg-blue-700 text-white': return { bg: '#1d4ed8', text: '#ffffff' };
    case 'bg-red-500 text-white': return { bg: '#ef4444', text: '#ffffff' };
    case 'bg-orange-500 text-white': return { bg: '#f97316', text: '#ffffff' };
    case 'bg-gray-800 text-white': return { bg: '#1f2937', text: '#ffffff' };
    default: return { bg: '#ffffff', text: '#4b5563' };
  }
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 30%, #1e293b 70%, #0f172a 100%);
  overflow-x: hidden;
  position: relative; 
`;

const Header = styled.header`
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #334155;
`;

const HeaderContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const FreeMoney = styled.div`
  background: #facc15;
  color: black;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;

  @media (max-width: 767px) {
    display: none;
  }
`;

const Navigation = styled.nav`
  display: none;
  align-items: center;
  gap: 0.25rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavButton = styled.button<{ active?: boolean; highlight?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;

  ${props => {
    if (props.active) {
      return `
        background: #2563eb;
        color: white;
      `;
    } else if (props.highlight) {
      return `
        background: linear-gradient(90deg, #ec4899, #9333ea);
        color: white;
      `;
    } else {
      return `
        background: transparent;
        color: #d1d5db;
        
        &:hover {
          color: white;
          background: #374151;
        }
      `;
    }
  }}
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 767px) {
    display: none;
  }
`;

const MobileRight = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 767px) {
    display: flex;
  }
`;

const MobileMenuButton = styled.button`
  background: transparent;
  border: 1px solid #334155;
  color: #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.35rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const MobileMenuPanel = styled.div`
  position: absolute;
  right: 1rem;
  top: 4.25rem;
  z-index: 10000;
  background: rgba(15, 23, 42, 0.98);
  border: 1px solid #334155;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  border-radius: 0.75rem;
  padding: 0.5rem;
  width: 14rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuItem = styled.button<{ variant?: 'deposit' | 'withdraw' | 'default' }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  background: ${({ variant }) => variant === 'deposit' ? 'linear-gradient(90deg, #16a34a, #22c55e)' : variant === 'withdraw' ? 'linear-gradient(90deg, #ef4444, #f97316)' : 'transparent'};
  color: ${({ variant }) => variant ? 'white' : '#e5e7eb'};
  border: 1px solid ${({ variant }) => variant === 'deposit' ? '#22c55e' : variant === 'withdraw' ? '#f97316' : 'transparent'};
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: left;
`;

const BalanceBadge = styled.div`
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid #22c55e;
  color: #bbf7d0;
  padding: 0.35rem 0.5rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.8rem;
`;

const LoginButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #60a5fa;
  }
`;

const SignupButton = styled.button`
  background: #22c55e;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #16a34a;
  }
`;

const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const HeroSection = styled.div`
  position: relative;
  background: linear-gradient(90deg, #1e293b, #374151);
  border-radius: 1rem;
  overflow: hidden;
  height: 20rem;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.5), transparent);
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SlideImage = styled.img<{ active: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${p => (p.active ? 1 : 0)};
  transition: opacity 0.6s ease;
`;

const Dots = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  z-index: 2;
`;

const Dot = styled.button<{ active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  background: ${p => (p.active ? '#ffffff' : 'rgba(255,255,255,0.5)')};
`;

const HeroContent = styled.div`
  position: absolute;
  inset: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroButton = styled.button`
  background: white;
  color: black;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  width: fit-content;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const PromotionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PromotionCard = styled.div<{ gradient?: string }>`
  background: ${props => props.gradient || 'linear-gradient(135deg, #7c3aed, #ec4899)'};
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
`;

const PromotionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const PromotionSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
`;

const PromotionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 2.5rem;
`;

const PromotionButton = styled.button<{ textColor?: string }>`
  background: white;
  color: ${props => props.textColor || '#7c3aed'};
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CategoryCard = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #334155;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(51, 65, 85, 0.5);
  }
`;

const CategoryIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: ${props => props.color || '#eab308'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

const CategorySubtitle = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
`;

const GamesSection = styled.div`
  margin-top: 3rem;
`;

const GamesSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const GamesHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const GamesLogo = styled.div`
  width: 2rem;
  height: 2rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GamesLogoText = styled.span`
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
`;

const GamesTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const ViewAllButton = styled.button`
  color: #60a5fa;
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #93c5fd;
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const GameCard = styled.div`
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const GameCardContent = styled.div<{ gradient?: string }>`
  background: ${props => props.gradient || 'linear-gradient(135deg, #3b82f6, #1e40af)'};
  border-radius: 1.5rem;
  padding: 0;
  height: 14rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const GameIcon = styled.div`
  font-size: 4.5rem;
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
`;

const GameInfo = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
`;

const GameProvider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ProviderLogo = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: bold;
  color: #1e40af;
`;

const ProviderText = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const GameTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
`;

const GameHoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${GameCard}:hover & {
    opacity: 1;
  }
`;

const GamePlayButton = styled.button`
  background: rgba(255, 255, 255, 0.95);
  color: #1e40af;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transform: translateY(10px);
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  ${GameCard}:hover & {
    transform: translateY(0);
  }

  &:hover {
    background: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const PokerSection = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PokerCard = styled.div<{ relative?: boolean; overflow?: boolean }>`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #334155;
  position: ${props => props.relative ? 'relative' : 'static'};
  overflow: ${props => props.overflow ? 'hidden' : 'visible'};
`;

const PokerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const PokerLogo = styled.div`
  width: 2rem;
  height: 2rem;
  background: #7c3aed;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PokerLogoText = styled.span`
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
`;

const PokerTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
`;

const PokerDescription = styled.p`
  color: #9ca3af;
  margin-bottom: 1.5rem;
`;

const PokerButton = styled.button`
  background: #7c3aed;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #6d28d9;
  }
`;

const CardsContainer = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const PlayingCard = styled.div<{ red?: boolean }>`
  width: 4rem;
  height: 5rem;
  background: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${props => props.red ? '#ef4444' : 'black'};
`;

const Badge247 = styled.div`
  background: #2563eb;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 0.5rem;
`;

// New styled components for modals, forms, and UI elements
const ModalContent = styled.div`
  padding: 2rem 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
`;

const ModalSubtitle = styled.p`
  color: #6b7280;
  margin-top: 0.25rem;
  margin-bottom: 1rem;
`;

const SocialIconsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin: 0.75rem 0 1rem 0;
`;

const SocialIconButton = styled.button<{ bgColor: string; textColor: string }>`
  background: ${p => p.bgColor};
  color: ${p => p.textColor};
  border: none;
  border-radius: 0.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const TabButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${p => (p.active ? '#3b82f6' : '#e5e7eb')};
  color: ${p => (p.active ? '#1f2937' : '#374151')};
  background: ${p => (p.active ? '#eff6ff' : 'transparent')};
  cursor: pointer;
`;

const InputGroup = styled.div`
  margin-bottom: 0.75rem;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: #111827;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
`;

const ForgotPasswordButton = styled.button`
  background: transparent;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
  margin: 0.25rem 0 0.75rem 0;
`;

const ActionButton = styled.button<{ variant?: 'success' | 'default' }>`
  background: ${p => (p.variant === 'success' ? '#22c55e' : '#3b82f6')};
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  width: 100%;
  font-weight: 700;
  margin: 0.5rem 0;
`;

const LinkText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
`;

const LinkButton = styled.button`
  background: transparent;
  border: none;
  color: #3b82f6;
  cursor: pointer;
`;

const CurrencySelector = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #374151;
  margin-bottom: 0.75rem;
`;

const PhoneInputContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
`;

const FlagContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-right: 0.5rem;
`;

const Flag = styled.div<{ color: string }>`
  width: 12px;
  height: 10px;
  background: ${p => p.color};
`;

const PromoCodeSection = styled.div`
  margin: 0.5rem 0 0.75rem 0;
`;

const PromoCodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PromoCodeButton = styled.button`
  background: #f3f4f6;
  color: #111827;
  border: none;
  border-radius: 0.375rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const CheckboxContainer = styled.div`
  margin: 0.5rem 0 0.75rem 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 0.25rem;
  background: #22c55e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
`;

const CheckboxText = styled.span`
  color: #374151;
  font-size: 0.875rem;
`;

const BonusSection = styled.div`
  margin-top: 0.75rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const BonusCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BonusIcon = styled.div`
  font-size: 1.25rem;
`;

const BonusText = styled.div`
  color: #374151;
  font-weight: 600;
`;

const BonusCheck = styled.div`
  color: #22c55e;
  font-weight: 700;
`;

// Modal overlay containers using styled-components (no Tailwind required)
const OverlayWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const OverlayCard = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  width: 100%;
  max-width: 28rem;
  position: relative;
`;

const OverlayCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #9ca3af;
  background: transparent;
  border: none;
  cursor: pointer;
  &:hover { color: #4b5563; }
`;

// Helper function for category colors
const categoryColors = {
  'bg-yellow-500': '#eab308',
  'bg-red-500': '#ef4444',
  'bg-blue-500': '#3b82f6',
  'bg-green-500': '#22c55e'
};
function getCategoryColor(color: keyof typeof categoryColors) {
  return categoryColors[color] || '#3b82f6';
}

const defaultGames = [
  // Jeux existants
  {
    id: 'coinflip',
    name: 'Coin Flip',
    description: 'Pile ou face ? Misez sur votre intuition et doublez vos gains !',
    icon: '🪙',
    route: '/coinflip',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 10,
      maxBet: 10000,
      defaultBet: 100,
      betIncrements: [10, 50, 100, 500, 1000],
      currency: 'XOF',
      features: [
        { id: 'autoplay', name: 'Auto Play', description: 'Jouer automatiquement', isEnabled: false },
        { id: 'sound', name: 'Son', description: 'Effets sonores', isEnabled: true }
      ],
      rules: [
        { id: 'heads', name: 'Face', description: 'Multiplier x2', payoutMultiplier: 2 },
        { id: 'tails', name: 'Pile', description: 'Multiplier x2', payoutMultiplier: 2 }
      ],
      theme: {
        primaryColor: '#fbbf24',
        secondaryColor: '#f59e0b',
        backgroundColor: '#0f172a',
        accentColor: '#eab308'
      }
    }
  },
  {
    id: 'dice',
    name: 'Dice Game',
    description: 'Lancez les dés et devinez le résultat. Un classique revisité !',
    icon: '🎲',
    route: '/dice',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 5,
      maxBet: 5000,
      defaultBet: 50,
      betIncrements: [5, 25, 50, 250, 500],
      currency: 'XOF',
      features: [
        { id: 'multipleDice', name: 'Multi Dés', description: 'Jouer avec plusieurs dés', isEnabled: true },
        { id: 'animations', name: 'Animations', description: 'Animations 3D', isEnabled: true }
      ],
      rules: [
        { id: 'exact', name: 'Nombre exact', description: 'Deviner le nombre exact', payoutMultiplier: 6 },
        { id: 'range', name: 'Plage', description: 'Deviner la plage', payoutMultiplier: 2.5 }
      ],
      theme: {
        primaryColor: '#22c55e',
        secondaryColor: '#16a34a',
        backgroundColor: '#0f172a',
        accentColor: '#4ade80'
      }
    }
  },

  // Nouveaux jeux internes
  {
    id: 'roulette',
    name: 'Roulette Européenne',
    description: 'La roulette classique avec un seul zéro. Misez sur vos numéros favoris !',
    icon: '🎡',
    route: '/roulette',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 25,
      maxBet: 25000,
      defaultBet: 250,
      betIncrements: [25, 100, 250, 1000, 2500],
      currency: 'XOF',
      features: [
        { id: 'statistics', name: 'Statistiques', description: 'Historique des numéros', isEnabled: true },
        { id: 'quickBets', name: 'Mises rapides', description: 'Mises prédéfinies', isEnabled: true }
      ],
      rules: [
        { id: 'straight', name: 'Plein', description: 'Un seul numéro', payoutMultiplier: 35 },
        { id: 'red_black', name: 'Rouge/Noir', description: 'Couleur', payoutMultiplier: 2 }
      ],
      theme: {
        primaryColor: '#dc2626',
        secondaryColor: '#991b1b',
        backgroundColor: '#0f172a',
        accentColor: '#ef4444'
      }
    }
  },
  {
    id: 'blackjack',
    name: 'Blackjack Classic',
    description: 'Le jeu de cartes le plus populaire. Battez le croupier sans dépasser 21 !',
    icon: '🃏',
    route: '/blackjack',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 50,
      maxBet: 15000,
      defaultBet: 500,
      betIncrements: [50, 200, 500, 1500, 3000],
      currency: 'XOF',
      features: [
        { id: 'insurance', name: 'Assurance', description: 'Protection contre le blackjack du croupier', isEnabled: true },
        { id: 'doubleDown', name: 'Doubler', description: 'Doubler la mise', isEnabled: true },
        { id: 'split', name: 'Séparer', description: 'Séparer les paires', isEnabled: true }
      ],
      rules: [
        { id: 'blackjack', name: 'Blackjack', description: '21 avec 2 cartes', payoutMultiplier: 2.5 },
        { id: 'win', name: 'Victoire', description: 'Plus proche de 21', payoutMultiplier: 2 }
      ],
      theme: {
        primaryColor: '#059669',
        secondaryColor: '#047857',
        backgroundColor: '#0f172a',
        accentColor: '#10b981'
      }
    }
  },
  {
    id: 'slots',
    name: 'Lucky Slots',
    description: 'Machine à sous avec 5 rouleaux et bonus. Tentez le jackpot !',
    icon: '🎰',
    route: '/slots',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 10,
      maxBet: 1000,
      defaultBet: 100,
      betIncrements: [10, 25, 50, 100, 200],
      currency: 'XOF',
      features: [
        { id: 'autoSpin', name: 'Tours automatiques', description: 'Mode automatique', isEnabled: true },
        { id: 'bonusRounds', name: 'Tours bonus', description: 'Mini-jeux bonus', isEnabled: true },
        { id: 'jackpot', name: 'Jackpot progressif', description: 'Jackpot qui augmente', isEnabled: true }
      ],
      rules: [
        { id: 'three_match', name: '3 symboles', description: 'Trois symboles identiques', payoutMultiplier: 5 },
        { id: 'five_match', name: '5 symboles', description: 'Cinq symboles identiques', payoutMultiplier: 100 }
      ],
      theme: {
        primaryColor: '#f59e0b',
        secondaryColor: '#d97706',
        backgroundColor: '#0f172a',
        accentColor: '#fbbf24'
      }
    }
  },
  {
    id: 'poker',
    name: 'Video Poker',
    description: 'Poker contre la machine. Formez la meilleure main possible !',
    icon: '🂡',
    route: '/poker',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 25,
      maxBet: 2500,
      defaultBet: 125,
      betIncrements: [25, 50, 125, 250, 500],
      currency: 'XOF',
      features: [
        { id: 'jokersWild', name: 'Jokers Wild', description: 'Jokers comme cartes wild', isEnabled: false },
        { id: 'doubleUp', name: 'Quitte ou double', description: 'Doubler les gains', isEnabled: true }
      ],
      rules: [
        { id: 'royalFlush', name: 'Quinte flush royale', description: 'As, Roi, Dame, Valet, 10 de même couleur', payoutMultiplier: 800 },
        { id: 'straightFlush', name: 'Quinte flush', description: 'Cinq cartes consécutives de même couleur', payoutMultiplier: 50 }
      ],
      theme: {
        primaryColor: '#7c3aed',
        secondaryColor: '#6d28d9',
        backgroundColor: '#0f172a',
        accentColor: '#a855f7'
      }
    }
  },
  {
    id: 'baccarat',
    name: 'Baccarat',
    description: 'Le jeu préféré des hautes mises. Banco, Punto ou Égalité ?',
    icon: '♠️',
    route: '/baccarat',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 100,
      maxBet: 50000,
      defaultBet: 1000,
      betIncrements: [100, 500, 1000, 5000, 10000],
      currency: 'XOF',
      features: [
        { id: 'roadmaps', name: 'Tableaux de route', description: 'Historique des parties', isEnabled: true },
        { id: 'squeeze', name: 'Squeeze', description: 'Dévoilement lent des cartes', isEnabled: true }
      ],
      rules: [
        { id: 'player', name: 'Joueur', description: 'Mise sur le joueur', payoutMultiplier: 2 },
        { id: 'banker', name: 'Banque', description: 'Mise sur la banque', payoutMultiplier: 1.95 },
        { id: 'tie', name: 'Égalité', description: 'Mise sur l\'égalité', payoutMultiplier: 9 }
      ],
      theme: {
        primaryColor: '#1e40af',
        secondaryColor: '#1e3a8a',
        backgroundColor: '#0f172a',
        accentColor: '#3b82f6'
      }
    }
  },

  // Jeux en développement (disabled)
  {
    id: 'crash',
    name: 'Crash Game',
    description: '🚧 EN DÉVELOPPEMENT - Regardez le multiplicateur grimper et encaissez avant le crash !',
    icon: '🚀',
    route: '/crash',
    type: 'internal',
    isEnabled: false,
    config: {
      minBet: 10,
      maxBet: 10000,
      defaultBet: 100,
      betIncrements: [10, 50, 100, 500, 1000],
      currency: 'XOF',
      features: [
        { id: 'autoCashout', name: 'Retrait automatique', description: 'Retrait automatique à un multiplicateur défini', isEnabled: true }
      ],
      rules: [
        { id: 'multiplier', name: 'Multiplicateur', description: 'Gain = mise × multiplicateur au moment du retrait', payoutMultiplier: 0 }
      ],
      theme: {
        primaryColor: '#ff6b6b',
        secondaryColor: '#ee5a52',
        backgroundColor: '#0f172a',
        accentColor: '#ff7979'
      }
    }
  },
  {
    id: 'mines',
    name: 'Mines',
    description: '🚧 EN DÉVELOPPEMENT - Dévoilez les cases sans tomber sur une mine !',
    icon: '💣',
    route: '/mines',
    type: 'internal',
    isEnabled: false,
    config: {
      minBet: 5,
      maxBet: 5000,
      defaultBet: 50,
      betIncrements: [5, 25, 50, 250, 500],
      currency: 'XOF',
      features: [
        { id: 'customMines', name: 'Nombre de mines personnalisé', description: 'Choisir le nombre de mines', isEnabled: true }
      ],
      rules: [
        { id: 'safe', name: 'Case sûre', description: 'Multiplicateur augmente avec chaque case sûre', payoutMultiplier: 0 }
      ],
      theme: {
        primaryColor: '#4338ca',
        secondaryColor: '#3730a3',
        backgroundColor: '#0f172a',
        accentColor: '#6366f1'
      }
    }
  },

  // Jeux externes (iframe)
  {
    id: 'sweet_bonanza',
    name: 'Sweet Bonanza',
    description: 'La slot Pragmatic Play la plus populaire avec des multiplicateurs énormes !',
    icon: '🍭',
    route: '/sweet-bonanza',
    type: 'iframe',
    externalUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=en&cur=USD&gameSymbol=vs20fruitss',
    isEnabled: true,
    iframeConfig: {
      src: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=en&cur=USD&gameSymbol=vs20fruitss',
      width: '100%',
      height: '600px',
      allowFullscreen: true,
      sandbox: 'allow-scripts allow-same-origin allow-forms',
      title: 'Sweet Bonanza'
    },
    config: {
      minBet: 20,
      maxBet: 10000,
      defaultBet: 200,
      betIncrements: [20, 100, 200, 1000, 2000],
      currency: 'XOF',
      features: [
        { id: 'tumble', name: 'Tumble Feature', description: 'Les symboles gagnants disparaissent', isEnabled: true },
        { id: 'freeSpins', name: 'Tours gratuits', description: 'Déclenchés par 4+ scatters', isEnabled: true }
      ],
      rules: [
        { id: 'scatter', name: 'Scatter', description: '4+ scatters déclenchent les free spins', payoutMultiplier: 0 }
      ],
      theme: {
        primaryColor: '#ec4899',
        secondaryColor: '#db2777',
        backgroundColor: '#0f172a',
        accentColor: '#f472b6'
      },
      integration: {
        communicationProtocol: 'postMessage',
        balanceSync: true,
        sharedData: {
          balance: true,
          userInfo: false,
          gameHistory: true
        }
      }
    }
  },
  {
    id: 'gates_olympus',
    name: 'Gates of Olympus',
    description: 'Rejoignez Zeus dans cette aventure épique avec des multiplicateurs divins !',
    icon: '⚡',
    route: '/gates-olympus',
    type: 'iframe',
    externalUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=en&cur=USD&gameSymbol=vs20olympgate',
    isEnabled: true,
    iframeConfig: {
      src: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=en&cur=USD&gameSymbol=vs20olympgate',
      width: '100%',
      height: '600px',
      allowFullscreen: true,
      sandbox: 'allow-scripts allow-same-origin allow-forms',
      title: 'Gates of Olympus'
    },
    config: {
      minBet: 20,
      maxBet: 12500,
      defaultBet: 200,
      betIncrements: [20, 100, 200, 1250, 2500],
      currency: 'XOF',
      features: [
        { id: 'ante', name: 'Ante Bet', description: 'Augmente les chances de free spins', isEnabled: true },
        { id: 'buyBonus', name: 'Acheter bonus', description: 'Acheter directement les free spins', isEnabled: true }
      ],
      rules: [
        { id: 'multiplier', name: 'Multiplicateurs Zeus', description: 'Multiplicateurs aléatoires jusqu\'à x500', payoutMultiplier: 0 }
      ],
      theme: {
        primaryColor: '#facc15',
        secondaryColor: '#eab308',
        backgroundColor: '#0f172a',
        accentColor: '#fde047'
      },
      integration: {
        communicationProtocol: 'postMessage',
        balanceSync: true,
        sharedData: {
          balance: true,
          userInfo: false,
          gameHistory: true
        }
      }
    }
  },
  {
    id: 'book_of_dead',
    name: 'Book of Dead',
    description: '🚧 EN DÉVELOPPEMENT - Explorez l\'Égypte ancienne avec Rich Wilde !',
    icon: '📚',
    route: '/book-of-dead',
    type: 'external',
    externalUrl: 'https://example.com/book-of-dead',
    isEnabled: false,
    config: {
      minBet: 10,
      maxBet: 5000,
      defaultBet: 100,
      betIncrements: [10, 50, 100, 500, 1000],
      currency: 'XOF',
      features: [
        { id: 'expanding', name: 'Symboles extensibles', description: 'Symboles qui s\'étendent sur toute la colonne', isEnabled: true }
      ],
      rules: [
        { id: 'book', name: 'Livre', description: 'Scatter et wild combinés', payoutMultiplier: 0 }
      ],
      theme: {
        primaryColor: '#92400e',
        secondaryColor: '#78350f',
        backgroundColor: '#0f172a',
        accentColor: '#d97706'
      }
    }
  },

  // Jeux de table classiques
  {
    id: 'sic_bo',
    name: 'Sic Bo',
    description: '🚧 EN DÉVELOPPEMENT - Le jeu de dés asiatique traditionnel !',
    icon: '🎯',
    route: '/sic-bo',
    type: 'internal',
    isEnabled: false,
    config: {
      minBet: 25,
      maxBet: 5000,
      defaultBet: 125,
      betIncrements: [25, 50, 125, 500, 1000],
      currency: 'XOF',
      features: [
        { id: 'combo', name: 'Mises combinées', description: 'Plusieurs mises en même temps', isEnabled: true }
      ],
      rules: [
        { id: 'big', name: 'Grand', description: 'Total 11-17', payoutMultiplier: 2 },
        { id: 'small', name: 'Petit', description: 'Total 4-10', payoutMultiplier: 2 }
      ],
      theme: {
        primaryColor: '#dc2626',
        secondaryColor: '#b91c1c',
        backgroundColor: '#0f172a',
        accentColor: '#f87171'
      }
    }
  },
  {
    id: 'teen_patti',
    name: 'Teen Patti',
    description: '🚧 EN DÉVELOPPEMENT - Le poker indien traditionnel !',
    icon: '🕉️',
    route: '/teen-patti',
    type: 'internal',
    isEnabled: false,
    config: {
      minBet: 50,
      maxBet: 10000,
      defaultBet: 250,
      betIncrements: [50, 125, 250, 1000, 2500],
      currency: 'XOF',
      features: [
        { id: 'blind', name: 'Jeu aveugle', description: 'Jouer sans voir ses cartes', isEnabled: true },
        { id: 'sidebet', name: 'Mises annexes', description: 'Mises supplémentaires', isEnabled: true }
      ],
      rules: [
        { id: 'trail', name: 'Trail', description: 'Trois cartes identiques', payoutMultiplier: 50 },
        { id: 'sequence', name: 'Séquence', description: 'Trois cartes consécutives', payoutMultiplier: 5 }
      ],
      theme: {
        primaryColor: '#f97316',
        secondaryColor: '#ea580c',
        backgroundColor: '#0f172a',
        accentColor: '#fb923c'
      }
    }
  },
  {
    id: 'andar_bahar',
    name: 'Andar Bahar',
    description: '🚧 EN DÉVELOPPEMENT - Jeu de cartes indien simple et excitant !',
    icon: '🃖',
    route: '/andar-bahar',
    type: 'internal',
    isEnabled: false,
    config: {
      minBet: 25,
      maxBet: 7500,
      defaultBet: 250,
      betIncrements: [25, 100, 250, 750, 1500],
      currency: 'XOF',
      features: [
        { id: 'prediction', name: 'Prédictions', description: 'Prédire le nombre de cartes', isEnabled: true }
      ],
      rules: [
        { id: 'andar', name: 'Andar', description: 'Première carte du côté Andar', payoutMultiplier: 1.9 },
        { id: 'bahar', name: 'Bahar', description: 'Première carte du côté Bahar', payoutMultiplier: 2 }
      ],
      theme: {
        primaryColor: '#059669',
        secondaryColor: '#047857',
        backgroundColor: '#0f172a',
        accentColor: '#34d399'
      }
    }
  },
  {
    id: 'dragon_tiger',
    name: 'Dragon Tiger',
    description: '🚧 EN DÉVELOPPEMENT - Le jeu de comparaison de cartes le plus simple !',
    icon: '🐉',
    route: '/dragon-tiger',
    type: 'internal',
    isEnabled: false,
    config: {
      minBet: 50,
      maxBet: 15000,
      defaultBet: 500,
      betIncrements: [50, 200, 500, 1500, 3000],
      currency: 'XOF',
      features: [
        { id: 'suited', name: 'Mises couleur', description: 'Miser sur la couleur des cartes', isEnabled: true }
      ],
      rules: [
        { id: 'dragon', name: 'Dragon', description: 'Dragon gagne', payoutMultiplier: 2 },
        { id: 'tiger', name: 'Tiger', description: 'Tiger gagne', payoutMultiplier: 2 },
        { id: 'tie', name: 'Égalité', description: 'Cartes identiques', payoutMultiplier: 8 }
      ],
      theme: {
        primaryColor: '#dc2626',
        secondaryColor: '#b91c1c',
        backgroundColor: '#0f172a',
        accentColor: '#f87171'
      }
    }
  }
];

const Home = () => {
  const [activeTab, setActiveTab] = useState('accueil');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    phone: '+225 01 23 45 67 89',
    email: '',
    password: '',
    promoCode: ''
  });

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [depositPhone, setDepositPhone] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('');

  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');

  const [balance, setBalance] = useState<number>(0);
  const balanceService = BalanceService.getInstance();

  useEffect(() => {
    setBalance(balanceService.getBalance());
    const handleBalanceUpdate = (newBalance: number) => setBalance(newBalance);
    balanceService.on('balanceUpdate', handleBalanceUpdate);
    return () => balanceService.off('balanceUpdate', handleBalanceUpdate);
  }, [balanceService]);

  const handleValidateDeposit = () => {
    const amt = Number(depositAmount);
    if (!depositPhone || !depositMethod || !amt || amt <= 0) return;
    balanceService.setBalance(balance + amt);
    setShowDeposit(false);
    setDepositPhone('');
    setDepositAmount('');
    setDepositMethod('');
  };

  const handleValidateWithdraw = () => {
    const amt = Number(withdrawAmount);
    if (!withdrawPhone || !withdrawMethod || !amt || amt <= 0) return;
    if (amt > balance) return;
    balanceService.setBalance(balance - amt);
    setShowWithdraw(false);
    setWithdrawPhone('');
    setWithdrawAmount('');
    setWithdrawMethod('');
  };

  const emailRef = useRef(email);
  const passwordRef = useRef(password);

  const navigationItems = [
    { id: 'accueil', label: 'Accueil', active: true },
    { id: 'sport', label: 'Sport' },
    { id: 'casino', label: 'Casino' },
    { id: 'live-games', label: 'Live-games' },
    { id: 'lucky-jet', label: 'LuckyJet', highlight: true },
  ];


  // Animation pour les éléments promotionnels
const pulse = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.05); }
100% { transform: scale(1); }
`;

const slideIn = keyframes`
from { transform: translateX(-100%); }
to { transform: translateX(0); }
`;

// Bannière promotionnelle défilante
const PromoBanner = styled.div`
background: linear-gradient(90deg, #ec4899, #8b5cf6);
color: white;
padding: 0.5rem 1rem;
display: flex;
align-items: center;
justify-content: center;
font-size: 0.875rem;
font-weight: 500;
position: relative;
overflow: hidden;
`;

const PromoContent = styled.div`
display: flex;
align-items: center;
gap: 0.5rem;
animation: ${slideIn} 20s linear infinite;
white-space: nowrap;
`;

// Section des matches en direct
const LiveMatchesSection = styled.section`
margin-top: 3rem;
background: rgba(15, 23, 42, 0.7);
border-radius: 1rem;
padding: 1.5rem;
border: 1px solid #334155;
`;

const SectionHeader = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
font-size: 1.5rem;
font-weight: bold;
color: white;
display: flex;
align-items: center;
gap: 0.5rem;
`;

const LiveBadge = styled.span`
background: #ef4444;
color: white;
padding: 0.25rem 0.5rem;
border-radius: 0.25rem;
font-size: 0.75rem;
font-weight: 600;
display: flex;
align-items: center;
gap: 0.25rem;
`;

const MatchesGrid = styled.div`
display: grid;
grid-template-columns: 1fr;
gap: 1rem;

@media (min-width: 768px) {
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 1024px) {
  grid-template-columns: repeat(3, 1fr);
}
`;

const MatchCard = styled.div`
background: rgba(30, 41, 59, 0.7);
border-radius: 0.75rem;
padding: 1rem;
border: 1px solid #334155;
cursor: pointer;
transition: all 0.3s ease;

&:hover {
  background: rgba(51, 65, 85, 0.7);
  transform: translateY(-2px);
}
`;

const MatchHeader = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 1rem;
`;

const MatchLeague = styled.div`
font-size: 0.75rem;
color: #9ca3af;
display: flex;
align-items: center;
gap: 0.25rem;
`;

const MatchTime = styled.div`
background: #ef4444;
color: white;
padding: 0.25rem 0.5rem;
border-radius: 0.25rem;
font-size: 0.75rem;
font-weight: 600;
`;

const MatchTeams = styled.div`
display: flex;
flex-direction: column;
gap: 0.5rem;
margin-bottom: 1rem;
`;

const Team = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`;

const TeamName = styled.span`
color: white;
font-size: 0.875rem;
`;

const TeamOdds = styled.span`
background: rgba(255, 255, 255, 0.1);
color: white;
padding: 0.25rem 0.5rem;
border-radius: 0.25rem;
font-size: 0.875rem;
font-weight: 600;
min-width: 2.5rem;
text-align: center;
`;

const MatchFooter = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
font-size: 0.75rem;
color: #9ca3af;
`;

// Section des tournois
const TournamentsSection = styled.section`
margin-top: 3rem;
`;

const TournamentsGrid = styled.div`
display: grid;
grid-template-columns: 1fr;
gap: 1.5rem;

@media (min-width: 768px) {
  grid-template-columns: repeat(2, 1fr);
}
`;

const TournamentCard = styled.div`
background: linear-gradient(135deg, #1e293b, #374151);
border-radius: 1rem;
padding: 1.5rem;
position: relative;
overflow: hidden;
cursor: pointer;
transition: all 0.3s ease;

&:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
`;

const TournamentHeader = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 1rem;
`;

const TournamentPrize = styled.div`
background: linear-gradient(90deg, #f59e0b, #fbbf24);
color: black;
padding: 0.5rem 1rem;
border-radius: 2rem;
font-weight: 700;
font-size: 0.875rem;
`;

const TournamentTitle = styled.h3`
font-size: 1.25rem;
font-weight: bold;
color: white;
margin-bottom: 0.5rem;
`;

const TournamentInfo = styled.div`
display: flex;
align-items: center;
gap: 1rem;
margin-bottom: 1rem;
font-size: 0.875rem;
color: #9ca3af;
`;

const TournamentDetail = styled.div`
display: flex;
align-items: center;
gap: 0.25rem;
`;

const ProgressBar = styled.div`
height: 0.5rem;
background: rgba(255, 255, 255, 0.1);
border-radius: 1rem;
overflow: hidden;
margin-bottom: 1rem;
`;

const ProgressFill = styled.div<{ width: number }>`
height: 100%;
width: ${props => props.width}%;
background: linear-gradient(90deg, #3b82f6, #60a5fa);
border-radius: 1rem;
`;

const TournamentFooter = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`;

const Participants = styled.div`
display: flex;
align-items: center;
gap: 0.5rem;
font-size: 0.875rem;
color: #9ca3af;
`;

const JoinButton = styled.button`
background: #22c55e;
color: white;
padding: 0.5rem 1rem;
border-radius: 0.5rem;
font-weight: 600;
border: none;
cursor: pointer;
transition: background-color 0.3s ease;

&:hover {
  background: #16a34a;
}
`;

// Section des promotions VIP
const VipSection = styled.section`
margin-top: 3rem;
background: linear-gradient(135deg, #0f172a, #1e293b);
border-radius: 1rem;
padding: 2rem;
position: relative;
overflow: hidden;
`;

const VipContent = styled.div`
position: relative;
z-index: 2;
`;

const VipTitle = styled.h2`
font-size: 2rem;
font-weight: bold;
color: white;
margin-bottom: 1rem;
`;

const VipDescription = styled.p`
color: #9ca3af;
margin-bottom: 1.5rem;
max-width: 600px;
`;

const VipBenefits = styled.div`
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 1rem;
margin-bottom: 2rem;

@media (min-width: 768px) {
  grid-template-columns: repeat(4, 1fr);
}
`;

const VipBenefit = styled.div`
display: flex;
flex-direction: column;
align-items: center;
text-align: center;
`;

const BenefitIcon = styled.div`
width: 3rem;
height: 3rem;
border-radius: 50%;
background: rgba(255, 255, 255, 0.1);
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 0.5rem;
color: #fbbf24;
`;

const BenefitTitle = styled.h4`
color: white;
font-size: 0.875rem;
font-weight: 600;
margin-bottom: 0.25rem;
`;

const BenefitDescription = styled.p`
color: #9ca3af;
font-size: 0.75rem;
`;

const VipButton = styled.button`
background: linear-gradient(90deg, #f59e0b, #fbbf24);
color: black;
padding: 0.75rem 2rem;
border-radius: 0.5rem;
font-weight: 700;
border: none;
cursor: pointer;
transition: all 0.3s ease;

&:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(245, 158, 11, 0.3);
}
`;

const VipBackground = styled.div`
position: absolute;
top: 0;
right: 0;
bottom: 0;
width: 50%;
background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.1));
display: flex;
align-items: center;
justify-content: center;
font-size: 15rem;
opacity: 0.1;
`;

// Barre de cotes en direct
const OddsBar = styled.div`
background: rgba(30, 41, 59, 0.9);
border-top: 1px solid #334155;
border-bottom: 1px solid #334155;
padding: 0.75rem 1rem;
display: flex;
align-items: center;
justify-content: space-between;
overflow-x: auto;
gap: 1rem;
`;

const SportOdds = styled.div`
display: flex;
align-items: center;
gap: 0.5rem;
color: white;
font-size: 0.875rem;
white-space: nowrap;
`;

const SportIcon = styled.div`
font-size: 1.25rem;
`;

const OddsValue = styled.span<{ change?: 'up' | 'down' }>`
color: ${props => props.change === 'up' ? '#22c55e' : props.change === 'down' ? '#ef4444' : 'white'};
font-weight: 600;
`;

// Notification badge
const NotificationBadge = styled.span`
position: absolute;
top: -5px;
right: -5px;
background: #ef4444;
color: white;
width: 18px;
height: 18px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-size: 0.75rem;
font-weight: bold;
`;

// Ajouter ces états au composant Home
const [promoMessages] = useState([
"🎉 Bonus de bienvenue 500% jusqu'à 100 000 XOF !",
"⚽ Paris sportifs avec les meilleures cotes du marché !",
"🎰 3000+ jeux de casino avec des jackpots progressifs !",
"💰 Cashback de 15% toutes les semaines !"
]);

const [liveMatches] = useState([
{
  id: 1,
  league: "Ligue 1",
  time: "75'",
  team1: "PSG",
  team2: "Marseille",
  odds1: 1.85,
  oddsDraw: 3.40,
  odds2: 4.20,
  bets: 1247
},
{
  id: 2,
  league: "Premier League",
  time: "63'",
  team1: "Liverpool",
  team2: "Man City",
  odds1: 2.10,
  oddsDraw: 3.25,
  odds2: 3.50,
  bets: 2873
},
{
  id: 3,
  league: "Ligue des Champions",
  time: "32'",
  team1: "Real Madrid",
  team2: "Bayern Munich",
  odds1: 2.30,
  oddsDraw: 3.40,
  odds2: 3.10,
  bets: 3561
}
]);

const [tournaments] = useState([
{
  id: 1,
  title: "Tournoi du Weekend",
  prize: "5 000 000 XOF",
  game: "Fortnite",
  date: "Aujourd'hui, 20:00",
  participants: 127,
  maxParticipants: 256,
  entryFee: "Gratuit"
},
{
  id: 2,
  title: "Ligue des Champions Esports",
  prize: "15 000 000 XOF",
  game: "FIFA 24",
  date: "12 Nov, 19:00",
  participants: 84,
  maxParticipants: 128,
  entryFee: "2 500 XOF"
}
]);

const [sportOdds] = useState([
{ sport: "⚽ Football", odds: "2.45", change: "up" },
{ sport: "🏀 Basketball", odds: "1.87", change: "down" },
{ sport: "🎾 Tennis", odds: "3.20", change: "up" },
{ sport: "🏎️ F1", odds: "5.50", change: "up" },
{ sport: "🏒 Hockey", odds: "2.10", change: "down" }
]);

  const categories: { id: string; title: string; subtitle: string; icon: string; color: 'bg-yellow-500' | 'bg-red-500' | 'bg-blue-500' | 'bg-green-500' }[] = [
    { id: 'tvbet', title: 'TVBET', subtitle: 'Jeux en direct 24/7', icon: '📺', color: 'bg-yellow-500' },
    { id: 'casino', title: 'Casino', subtitle: 'Plus de 3000 jeux', icon: '🎰', color: 'bg-red-500' },
    { id: 'live-games', title: 'Live-Games', subtitle: 'Revendeurs vivants', icon: '🎮', color: 'bg-blue-500' },
    { id: 'poker', title: 'Poker', subtitle: 'Tournois gratuits', icon: '🂡', color: 'bg-green-500' }
  ];

  const { getEnabledPlugins } = usePluginManager();
  const enabledGames = getEnabledPlugins();


  const socialIcons = [
    { name: 'Google', color: 'bg-white text-gray-600', icon: '🌐' },
    { name: 'VK', color: 'bg-blue-600 text-white', icon: 'VK' },
    { name: 'Telegram', color: 'bg-blue-400 text-white', icon: '✈' },
    { name: 'Mail', color: 'bg-blue-700 text-white', icon: '@' },
    { name: 'Yandex', color: 'bg-red-500 text-white', icon: 'Я' },
    { name: 'OK', color: 'bg-orange-500 text-white', icon: 'OK' },
    { name: 'Steam', color: 'bg-gray-800 text-white', icon: '🎮' }
  ];

  const Overlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
    <OverlayWrapper>
      <OverlayCard>
        <OverlayCloseButton onClick={onClose}>
          <X size={24} />
        </OverlayCloseButton>
        {children}
      </OverlayCard>
    </OverlayWrapper>
  );

  const LoginPopup = () => (
    <Overlay onClose={() => setShowLogin(false)}>
      <ModalContent>
        <ModalTitle>Connectez-vous</ModalTitle>
        <ModalSubtitle>Bienvenue à 1win</ModalSubtitle>
        
        {/* Icônes des réseaux sociaux */}
        <SocialIconsContainer>
        {socialIcons.map((social, index) => {
          const colors = getColors(social.color);
          return (
            <SocialIconButton
              key={`social-${social.name}-${index}`}
              bgColor={colors.bg}
              textColor={colors.text}
            >
              {social.icon}
            </SocialIconButton>
          );
        })}
        </SocialIconsContainer>
        
        {/* Options de connexion */}
        <ButtonGroup>
          <TabButton>
            <Phone size={20} />
            Téléphone
          </TabButton>
          <TabButton active>
            <Mail size={20} />
            Adresse électronique
          </TabButton>
        </ButtonGroup>
        
        {/* Champ de saisie email */}
        <InputGroup>
          <InputContainer>
            <Mail size={20} color="#9ca3af" />
            <Input
              type="email"
              placeholder="Email"
              defaultValue={email}
              onChange={(e) => (emailRef.current = e.target.value)}
              onBlur={() =>
                setEmail(emailRef.current)
              }
              className="flex-1 outline-none"
            />
            {/* <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value )}
            /> */}
          </InputContainer>
        </InputGroup>
        
        {/* Champ de saisie mot de passe */}
        <InputGroup>
          <InputContainer>
            <Lock size={20} color="#9ca3af" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              defaultValue={password}
              onChange={(e) => (passwordRef.current = e.target.value)}
              onBlur={() =>
                setPassword(passwordRef.current)
              }
              className="flex-1 outline-none"
            />
            <IconButton onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </IconButton>
          </InputContainer>
        </InputGroup>
        
        {/* Lien mot de passe oublié */}
        <ForgotPasswordButton>
          Avez-vous oublié votre mot de passe ?
        </ForgotPasswordButton>
        
        {/* Bouton de connexion */}
        <ActionButton>
          Se connecter
        </ActionButton>
        
        {/* Lien d'inscription */}
        <LinkText>
          Vous n'avez pas encore de compte ?{' '}
          <LinkButton 
            onClick={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          >
            Inscrivez-vous
          </LinkButton>
        </LinkText>
      </ModalContent>
    </Overlay>
  );

  const RegisterPopup = () => (
    <Overlay onClose={() => setShowRegister(false)}>
      <ModalContent>
        <ModalTitle>Inscription</ModalTitle>

        {/* Registration Type */}
        <ButtonGroup>
          <TabButton>
            💬 Réseaux sociaux
          </TabButton>
          <TabButton active>
            <Mail size={20} />
            Rapide
          </TabButton>
        </ButtonGroup>

        {/* Currency */}
        <CurrencySelector>
          <span>F CFA</span>
          <span>Franc CFA (UEMOA) (XOF)</span>
          <span>⌄</span>
        </CurrencySelector>

        {/* Phone Input */}
        <PhoneInputContainer>
          <FlagContainer>
            <Flag color="#f97316" />
            <Flag color="#ffffff" />
            <Flag color="#22c55e" />
            <span style={{ color: '#9ca3af' }}>⌄</span>
          </FlagContainer>
          <Input
            type="tel"
            value={registerData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterData({...registerData, phone: e.target.value})}
          />
        </PhoneInputContainer>

        {/* Email Input */}
        <InputGroup>
          <InputContainer>
            <Input
              type="email"
              placeholder="E-Mail"
              value={registerData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterData({...registerData, email: e.target.value})}
            />
          </InputContainer>
        </InputGroup>

        {/* Password Input */}
        <InputGroup>
          <InputContainer>
            <Input
              type="password"
              placeholder="Mot de passe"
              value={registerData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterData({...registerData, password: e.target.value})}
            />
            <Eye size={20} color="#9ca3af" />
          </InputContainer>
        </InputGroup>

        {/* Promo Code */}
        <PromoCodeSection>
          <PromoCodeHeader>
            <span style={{ color: '#374151' }}>Code promo</span>
            <PromoCodeButton>
              <Plus size={16} />
            </PromoCodeButton>
          </PromoCodeHeader>
        </PromoCodeSection>

        {/* Terms Checkbox */}
        <CheckboxContainer>
          <CheckboxLabel>
            <Checkbox>
              <span>✓</span>
            </Checkbox>
            <CheckboxText>
              Je suis conscient et j'accepte{' '}
              <LinkButton>
                l'accord sur les conditions d'utilisation
              </LinkButton>
            </CheckboxText>
          </CheckboxLabel>
        </CheckboxContainer>

        {/* Register Button */}
        <ActionButton variant="success">
          S'inscrire
        </ActionButton>

        {/* Login Link */}
        <LinkText>
          Avez-vous déjà un compte ?{' '}
          <LinkButton 
            onClick={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
          >
            Connexion
          </LinkButton>
        </LinkText>

        {/* Casino Bonus */}
        <BonusSection>
          <BonusCard>
            <BonusIcon>🎰</BonusIcon>
            <BonusText>500 % au Casino</BonusText>
            <BonusCheck>✓</BonusCheck>
          </BonusCard>
          <BonusCard>
            <BonusIcon>💰</BonusIcon>
            <BonusText>Remboursement jusqu'à 30 %</BonusText>
            <BonusCheck>✓</BonusCheck>
          </BonusCard>
        </BonusSection>
      </ModalContent>
    </Overlay>
  );

  const ActionHeaderButton = styled.button<{ variant?: 'deposit' | 'withdraw' }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.9rem;
    border-radius: 0.5rem;
    font-weight: 700;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    color: white;
    background: ${p => (p.variant === 'deposit' ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #ef4444, #f97316)')};
    border-color: ${p => (p.variant === 'deposit' ? '#22c55e' : '#f97316')};

    &:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
  `;

  const slides = [
    {
      id: 'ferrari',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=600&fit=crop&crop=center',
      title: (
        <>
          Ferrari 296 GTB,<br />
          produits Apple et FS<br />
          dans LUCKY DRIVE
        </>
      )
    },
    {
      id: 'casino',
      image: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=1200&h=600&fit=crop&crop=center',
      title: (
        <>
          Bonus jusqu'à 500%<br />
          Cashback 30%<br />
          sur vos jeux favoris
        </>
      )
    },
    {
      id: 'sports',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=600&fit=crop&crop=center',
      title: (
        <>
          Pariez sur le sport<br />
          Cotes boostées<br />
          chaque semaine
        </>
      )
    }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(s => (s + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderContainer>
          <HeaderContent>
            {/* Logo */}
            <LogoSection>
              <Logo>4win</Logo>
              <FreeMoney>Free Money!</FreeMoney>
            </LogoSection>

            {/* Navigation */}
            {/* <Navigation>
              {navigationItems.map((item) => (
                <NavButton
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  active={item.active || activeTab === item.id}
                  highlight={item.highlight}
                >
                  {item.label}
                </NavButton>
              ))}
            </Navigation> */}

            {/* Right side buttons */}
            <AuthSection>
              <BalanceBadge>{balance} XOF</BalanceBadge>
              <ActionHeaderButton variant="deposit" onClick={() => setShowDeposit(true)}>
                <ArrowDownCircle size={18} /> Dépôt
              </ActionHeaderButton>
              <ActionHeaderButton variant="withdraw" onClick={() => setShowWithdraw(true)}>
                <ArrowUpCircle size={18} /> Retrait
              </ActionHeaderButton>
              <LoginButton onClick={() => setShowLogin(true)}>Connexion</LoginButton>
              <SignupButton onClick={() => setShowRegister(true)}>+ Inscription</SignupButton>
            </AuthSection>

            <MobileRight>
              <BalanceBadge>{balance} XOF</BalanceBadge>
              <MobileMenuButton onClick={() => setShowMobileMenu(v => !v)}>
                <Menu size={20} />
              </MobileMenuButton>
            </MobileRight>
          </HeaderContent>
        </HeaderContainer>
      </Header>

      {showMobileMenu && (
        <MobileMenuPanel>
          <MobileMenuItem variant="deposit" onClick={() => { setShowDeposit(true); setShowMobileMenu(false); }}>
            <ArrowDownCircle size={18} /> Dépôt
          </MobileMenuItem>
          <MobileMenuItem variant="withdraw" onClick={() => { setShowWithdraw(true); setShowMobileMenu(false); }} style={{ marginTop: 6 }}>
            <ArrowUpCircle size={18} /> Retrait
          </MobileMenuItem>
          <div style={{ height: 6 }} />
          <MobileMenuItem onClick={() => { setShowLogin(true); setShowMobileMenu(false); }}>
            <Lock size={18} /> Connexion
          </MobileMenuItem>
          <MobileMenuItem onClick={() => { setShowRegister(true); setShowMobileMenu(false); }} style={{ marginTop: 6 }}>
            <Plus size={18} /> Inscription
          </MobileMenuItem>
        </MobileMenuPanel>
      )}

      {showDeposit && (
        <OverlayWrapper>
          <OverlayCard>
            <OverlayCloseButton onClick={() => setShowDeposit(false)}>
              <X size={18} />
            </OverlayCloseButton>
            <ModalContent>
              <ModalTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wallet size={20} /> Dépôt
              </ModalTitle>
              <ModalSubtitle>Renseignez vos informations pour créditer votre compte.</ModalSubtitle>

              <InputGroup>
                <label style={{ display: 'block', color: '#374151', fontWeight: 600, marginBottom: 6 }}>Numéro de retrait</label>
                <InputContainer>
                  <Phone size={18} />
                  <Input placeholder="Ex: +225 07 00 00 00 00" value={depositPhone} onChange={(e) => setDepositPhone(e.target.value)} />
                </InputContainer>
              </InputGroup>

              <InputGroup>
                <label style={{ display: 'block', color: '#374151', fontWeight: 600, marginBottom: 6 }}>Montant</label>
                <InputContainer>
                  <CreditCard size={18} />
                  <Input type="number" placeholder="Ex: 5000" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                </InputContainer>
              </InputGroup>

              <InputGroup>
                <label style={{ display: 'block', color: '#374151', fontWeight: 600, marginBottom: 6 }}>Moyen de retrait</label>
                <InputContainer>
                  <select style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: '#111827' }} value={depositMethod} onChange={(e) => setDepositMethod(e.target.value)}>
                    <option value="">Sélectionner</option>
                    <option value="orange">Orange Money</option>
                    <option value="moov">Moov Money</option>
                    <option value="mtn">MTN Money</option>
                    <option value="wave">Wave</option>
                  </select>
                </InputContainer>
              </InputGroup>

              <ActionButton variant="success" onClick={handleValidateDeposit}>
                Valider le dépôt
              </ActionButton>
            </ModalContent>
          </OverlayCard>
        </OverlayWrapper>
      )}

      {showWithdraw && (
        <OverlayWrapper>
          <OverlayCard>
            <OverlayCloseButton onClick={() => setShowWithdraw(false)}>
              <X size={18} />
            </OverlayCloseButton>
            <ModalContent>
              <ModalTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wallet size={20} /> Retrait
              </ModalTitle>
              <ModalSubtitle>Renseignez vos informations pour retirer vos fonds.</ModalSubtitle>

              <InputGroup>
                <label style={{ display: 'block', color: '#374151', fontWeight: 600, marginBottom: 6 }}>Numéro de retrait</label>
                <InputContainer>
                  <Phone size={18} />
                  <Input placeholder="Ex: +225 07 00 00 00 00" value={withdrawPhone} onChange={(e) => setWithdrawPhone(e.target.value)} />
                </InputContainer>
              </InputGroup>

              <InputGroup>
                <label style={{ display: 'block', color: '#374151', fontWeight: 600, marginBottom: 6 }}>Montant</label>
                <InputContainer>
                  <CreditCard size={18} />
                  <Input type="number" placeholder="Ex: 5000" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
                </InputContainer>
              </InputGroup>

              <InputGroup>
                <label style={{ display: 'block', color: '#374151', fontWeight: 600, marginBottom: 6 }}>Moyen de retrait</label>
                <InputContainer>
                  <select style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: '#111827' }} value={withdrawMethod} onChange={(e) => setWithdrawMethod(e.target.value)}>
                    <option value="">Sélectionner</option>
                    <option value="orange">Orange Money</option>
                    <option value="moov">Moov Money</option>
                    <option value="mtn">MTN Money</option>
                    <option value="wave">Wave</option>
                  </select>
                </InputContainer>
              </InputGroup>

              <ActionButton onClick={handleValidateWithdraw}>
                Valider le retrait
              </ActionButton>
            </ModalContent>
          </OverlayCard>
        </OverlayWrapper>
      )}

      <PromoBanner>
  <PromoContent>
    {promoMessages.map((message, index) => (
      <React.Fragment key={index}>
        <span>{message}</span>
        {index < promoMessages.length - 1 && <span>•</span>}
      </React.Fragment>
    ))}
  </PromoContent>
</PromoBanner>


      {/* Main Content */}
      <Main>
        <HeroGrid>
          {/* Hero Section */}
          <HeroSection>
            <HeroOverlay />
            {slides.map((s, idx) => (
              <SlideImage key={s.id} src={s.image} alt={s.id} active={idx === currentSlide} />
            ))}
            <HeroContent>
              <HeroTitle>
                {slides[currentSlide].title}
              </HeroTitle>
              <HeroButton>Participer</HeroButton>
            </HeroContent>
            <Dots>
              {slides.map((_, idx) => (
                <Dot key={idx} active={idx === currentSlide} onClick={() => setCurrentSlide(idx)} />)
              )}
            </Dots>
          </HeroSection>

          {/* Promotions */}
          <PromotionsSection>
            <PromotionCard gradient="linear-gradient(135deg, #7c3aed, #ec4899)">
              <PromotionTitle>Remboursement jusqu'à 30%</PromotionTitle>
              <PromotionSubtitle>sur les casinos</PromotionSubtitle>
              <PromotionIcon>🎰</PromotionIcon>
              <PromotionButton textColor="#7c3aed">Aller au casino</PromotionButton>
            </PromotionCard>

            <PromotionCard gradient="linear-gradient(135deg, #3b82f6, #7c3aed)">
              <PromotionTitle>Bonus +500%</PromotionTitle>
              <PromotionIcon>🎁</PromotionIcon>
              <PromotionButton textColor="#3b82f6">Inscription</PromotionButton>
            </PromotionCard>
          </PromotionsSection>
        </HeroGrid>

        {/* Categories */}
        <CategoriesGrid>
          {categories.map((category) => (
            <CategoryCard key={category.id}>
              <CategoryIcon color={getCategoryColor(category.color)}>
                {category.icon}
              </CategoryIcon>
              <CategoryTitle>{category.title}</CategoryTitle>
              <CategorySubtitle>{category.subtitle}</CategorySubtitle>
            </CategoryCard>
          ))}
        </CategoriesGrid>

        {/* Games Section */}
        <GamesSection>
          <GamesSectionHeader>
            <GamesHeaderLeft>
              <GamesLogo>
                <GamesLogoText>1W</GamesLogoText>
              </GamesLogo>
              <GamesTitle>4win games</GamesTitle>
            </GamesHeaderLeft>
            <ViewAllButton>Tout</ViewAllButton>
          </GamesSectionHeader>

          <GamesGrid>
            {enabledGames.map((game) => (
              <GameCard key={game.id}>
                <GameCardContent gradient={`linear-gradient(135deg, ${game.config.theme?.primaryColor || '#00ff88'}, ${game.config.theme?.accentColor || '#ff6b6b'})`}>
                  <GameIcon>{game.icon}</GameIcon>
                  <GameInfo>
                    <GameProvider>
                      <ProviderLogo>4W</ProviderLogo>
                      <ProviderText>4win Platform</ProviderText>
                    </GameProvider>
                    <GameTitle>{game.name}</GameTitle>
                  </GameInfo>
                  <GameHoverOverlay>
                    <GamePlayButton onClick={() => window.location.href = game.route}>
                      Jouer
                    </GamePlayButton>
                  </GameHoverOverlay>
                </GameCardContent>
              </GameCard>
            ))}
          </GamesGrid>
        </GamesSection>

          {/* Games en cours Section */}
            <GamesSection>
          <GamesSectionHeader>
            <GamesHeaderLeft>
              <GamesLogo>
                <GamesLogoText>1W</GamesLogoText>
              </GamesLogo>
              <GamesTitle>4win games en cours</GamesTitle>
            </GamesHeaderLeft>
            <ViewAllButton>Tout</ViewAllButton>
          </GamesSectionHeader>

          <GamesGrid>
            {defaultGames.map((game) => (
              <GameCard key={game.id}>
                <GameCardContent gradient={`linear-gradient(135deg, ${game.config.theme?.primaryColor || '#00ff88'}, ${game.config.theme?.accentColor || '#ff6b6b'})`}>
                  <GameIcon>{game.icon}</GameIcon>
                  <GameInfo>
                    <GameProvider>
                      <ProviderLogo>4W</ProviderLogo>
                      <ProviderText>4win Platform</ProviderText>
                    </GameProvider>
                    <GameTitle>{game.name}</GameTitle>
                  </GameInfo>
                  <GameHoverOverlay>
                    <GamePlayButton>
                      En cours de dévélopement
                    </GamePlayButton>
                  </GameHoverOverlay>
                </GameCardContent>
              </GameCard>
            ))}
          </GamesGrid>
        </GamesSection>

        {/* Poker Section */}
        <PokerSection>
          <PokerCard>
            <PokerHeader>
              <PokerLogo>
                <PokerLogoText>PJ</PokerLogoText>
              </PokerLogo>
              <PokerTitle>Poker</PokerTitle>
            </PokerHeader>
            <PokerDescription>Entrez, jouez et gagnez</PokerDescription>
            <PokerButton>Obtenir un bonus</PokerButton>
          </PokerCard>

          <PokerCard relative overflow>
            <CardsContainer>
              <CardsGrid>
                <PlayingCard>A♠</PlayingCard>
                <PlayingCard red>A♥</PlayingCard>
                <PlayingCard red>A♦</PlayingCard>
                <PlayingCard>A♣</PlayingCard>
              </CardsGrid>
            </CardsContainer>
            <Badge247>24h/7j</Badge247>
          </PokerCard>
        </PokerSection>
        <OddsBar>
        {sportOdds.map((item, index) => (
          <SportOdds key={index}>
            <SportIcon>{item.sport.split(' ')[0]}</SportIcon>
            <span>{item.sport.split(' ').slice(1).join(' ')}:</span>
            <OddsValue change={item.change as 'up' | 'down'}>{item.odds}</OddsValue>
          </SportOdds>
        ))}
      </OddsBar>
<TournamentsSection>
  <SectionHeader>
    <SectionTitle>
      <Award size={24} color="#8b5cf6" />
      Tournois Esports
    </SectionTitle>
    <ViewAllButton>Tout voir</ViewAllButton>
  </SectionHeader>
  
  <TournamentsGrid>
    {tournaments.map(tournament => (
      <TournamentCard key={tournament.id}>
        <TournamentHeader>
          <TournamentPrize>{tournament.prize}</TournamentPrize>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.875rem'}}>
            <Clock size={14} />
            {tournament.date}
          </div>
        </TournamentHeader>
        
        <TournamentTitle>{tournament.title}</TournamentTitle>
        
        <TournamentInfo>
          <TournamentDetail>
            <span>🎮 {tournament.game}</span>
          </TournamentDetail>
          <TournamentDetail>
            <span>🎫 {tournament.entryFee}</span>
          </TournamentDetail>
        </TournamentInfo>
        
        <ProgressBar>
          <ProgressFill width={(tournament.participants / tournament.maxParticipants) * 100} />
        </ProgressBar>
        
        <TournamentFooter>
          <Participants>
            <Users size={14} />
            {tournament.participants}/{tournament.maxParticipants}
          </Participants>
          <JoinButton>Rejoindre</JoinButton>
        </TournamentFooter>
      </TournamentCard>
    ))}
  </TournamentsGrid>
</TournamentsSection>

<VipSection>
  <VipBackground>VIP</VipBackground>
  <VipContent>
    <VipTitle>Programme VIP Exclusive</VipTitle>
    <VipDescription>
      Devenez membre VIP et profitez d'avantages exclusifs, cadeaux personnalisés,
      cashback augmenté et offres spéciales réservées à notre élite.
    </VipDescription>
    
    <VipBenefits>
      <VipBenefit>
        <BenefitIcon>
          <Gift size={20} />
        </BenefitIcon>
        <BenefitTitle>Cadeaux Exclusifs</BenefitTitle>
        <BenefitDescription>Surprises et cadeaux personnalisés</BenefitDescription>
      </VipBenefit>
      
      <VipBenefit>
        <BenefitIcon>
          <TrendingUp size={20} />
        </BenefitIcon>
        <BenefitTitle>Cashback Augmenté</BenefitTitle>
        <BenefitDescription>Jusqu'à 25% de cashback</BenefitDescription>
      </VipBenefit>
      
      <VipBenefit>
        <BenefitIcon>
          <Shield size={20} />
        </BenefitIcon>
        <BenefitTitle>Support Prioritaire</BenefitTitle>
        <BenefitDescription>Manager dédié 24/7</BenefitDescription>
      </VipBenefit>
      
      <VipBenefit>
        <BenefitIcon>
          <Star size={20} />
        </BenefitIcon>
        <BenefitTitle>Offres Spéciales</BenefitTitle>
        <BenefitDescription>Promotions exclusives VIP</BenefitDescription>
      </VipBenefit>
    </VipBenefits>
    
    <VipButton>Devenir VIP</VipButton>
  </VipContent>
</VipSection>
      </Main>
      {showLogin && <LoginPopup />}
      {showRegister && <RegisterPopup />}
    </Container>
  );
};

export default Home;