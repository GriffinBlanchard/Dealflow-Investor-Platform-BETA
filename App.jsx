import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Building2, TrendingUp, Shield, CheckCircle, Users, Upload, ChevronRight, Check, Plus, X, DollarSign, Calendar, Percent, Calculator, Home, Hammer, TreePine, Heart, Filter, ChevronDown, MapPin, Maximize2, BedDouble, Car, Share2, Flag, Bell, User, Settings, LogOut, BarChart3, Activity, Search, Grid, List, AlertCircle, Camera, FileText, Briefcase } from 'lucide-react';

export default function DealflowApp() {
  // App state
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'register', 'onboarding', 'marketplace', 'dashboard'
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });

  // Onboarding state
  const [onboardingStep, setOnboardingStep] = useState('welcome');
  const [teamMembers, setTeamMembers] = useState([{ email: '', role: 'Analyst', name: '' }]);
  const [portfolioProperties, setPortfolioProperties] = useState([]);
  const [currentPropertyType, setCurrentPropertyType] = useState(null);
  const [currentProperty, setCurrentProperty] = useState({});
  
  // Verification state
  const [verificationStatus, setVerificationStatus] = useState('unverified'); // 'unverified', 'pending', 'verified'
  const [selectedVerificationMethod, setSelectedVerificationMethod] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState({
    taxReturns: [],
    bankStatements: [],
    brokerageStatements: [],
    cpaLetter: [],
    professionalLicense: [],
    entityDocuments: [],
    governmentId: []
  });

  // Marketplace state
  const [properties, setProperties] = useState(SAMPLE_PROPERTIES);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showFlaggedPanel, setShowFlaggedPanel] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Go to onboarding for new users, or marketplace for returning users
    // For demo, let's assume new user
    setCurrentScreen('onboarding');
    setOnboardingStep('welcome');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Go to onboarding
    setCurrentScreen('onboarding');
    setOnboardingStep('welcome');
  };

  const skipOnboarding = () => {
    setOnboardingStep('property-type');
  };

  const addPropertyToPortfolio = () => {
    // Calculate metrics based on property type
    let calculatedMetrics = {};
    const prop = currentProperty;

    if (currentPropertyType === 'commercial' || currentPropertyType === 'multifamily') {
      // Commercial/Multifamily Calculations
      const purchasePrice = parseFloat(prop.purchasePrice) || 0;
      const monthlyRent = parseFloat(prop.monthlyRent) || 0;
      const annualExpenses = parseFloat(prop.annualExpenses) || 0;
      const downPayment = parseFloat(prop.downPayment) || purchasePrice * 0.25; // Default 25% down
      const loanAmount = purchasePrice - downPayment;
      const interestRate = parseFloat(prop.interestRate) || 0.065; // Default 6.5%
      const loanTerm = parseFloat(prop.loanTerm) || 30; // Default 30 years
      
      // Calculate annual debt service (mortgage payment)
      const monthlyRate = interestRate / 12;
      const numPayments = loanTerm * 12;
      const monthlyPayment = loanAmount > 0 
        ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
        : 0;
      const annualDebtService = monthlyPayment * 12;
      
      // Key Metrics
      const annualIncome = monthlyRent * 12;
      const noi = annualIncome - annualExpenses; // Net Operating Income
      const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0; // Cap Rate
      const cashFlow = noi - annualDebtService; // Annual cash flow after debt service
      const cashOnCash = downPayment > 0 ? (cashFlow / downPayment) * 100 : 0; // Cash-on-Cash Return
      const grossYield = purchasePrice > 0 ? (annualIncome / purchasePrice) * 100 : 0; // Gross Yield
      const dscr = annualDebtService > 0 ? noi / annualDebtService : 0; // Debt Service Coverage Ratio
      
      // Appreciation (assumed at 3% annually)
      const appreciationRate = 0.03;
      const year5Value = purchasePrice * Math.pow(1 + appreciationRate, 5);
      const year10Value = purchasePrice * Math.pow(1 + appreciationRate, 10);
      
      calculatedMetrics = {
        purchasePrice,
        monthlyRent,
        annualIncome,
        annualExpenses,
        downPayment,
        loanAmount,
        annualDebtService,
        noi: Math.round(noi),
        capRate: capRate.toFixed(2),
        cashFlow: Math.round(cashFlow),
        monthlyCashFlow: Math.round(cashFlow / 12),
        cashOnCash: cashOnCash.toFixed(2),
        grossYield: grossYield.toFixed(2),
        dscr: dscr.toFixed(2),
        year5Value: Math.round(year5Value),
        year10Value: Math.round(year10Value),
        totalYear5Return: Math.round((cashFlow * 5) + (year5Value - purchasePrice)),
        totalYear10Return: Math.round((cashFlow * 10) + (year10Value - purchasePrice))
      };
    } 
    else if (currentPropertyType === 'residential-flip') {
      // Residential Flip Calculations
      const purchasePrice = parseFloat(prop.purchasePrice) || 0;
      const rehabBudget = parseFloat(prop.rehabBudget) || 0;
      const holdingCosts = parseFloat(prop.holdingCosts) || (purchasePrice * 0.01 * 6); // Default 6 months at 1% per month
      const arv = parseFloat(prop.arv) || 0;
      const sellingCosts = parseFloat(prop.sellingCosts) || (arv * 0.07); // Default 7% selling costs
      
      const totalCost = purchasePrice + rehabBudget + holdingCosts;
      const totalInvestment = totalCost + sellingCosts;
      const grossProfit = arv - totalInvestment;
      const roi = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;
      const profitMargin = arv > 0 ? (grossProfit / arv) * 100 : 0;
      const spread = arv - purchasePrice; // Spread between purchase and ARV
      const equityGain = arv - totalCost;
      
      // 70% Rule Check (good deals should be at or below this)
      const maxPurchasePrice70Rule = (arv * 0.70) - rehabBudget;
      const seventyRulePass = purchasePrice <= maxPurchasePrice70Rule;
      
      calculatedMetrics = {
        purchasePrice,
        rehabBudget,
        holdingCosts,
        arv,
        sellingCosts,
        totalCost: Math.round(totalCost),
        totalInvestment: Math.round(totalInvestment),
        grossProfit: Math.round(grossProfit),
        roi: roi.toFixed(2),
        profitMargin: profitMargin.toFixed(2),
        spread: Math.round(spread),
        equityGain: Math.round(equityGain),
        maxPurchasePrice70Rule: Math.round(maxPurchasePrice70Rule),
        seventyRulePass,
        estimatedTimeline: '6-8 months'
      };
    }
    else if (currentPropertyType === 'vacant-land') {
      // Vacant Land Calculations
      const purchasePrice = parseFloat(prop.purchasePrice) || 0;
      const acres = parseFloat(prop.acres) || 0;
      const developmentCosts = parseFloat(prop.developmentCosts) || 0;
      const projectedValue = parseFloat(prop.projectedValue) || 0;
      const holdingPeriod = parseFloat(prop.holdingPeriod) || 3; // Default 3 years
      
      const pricePerAcre = acres > 0 ? purchasePrice / acres : 0;
      const totalInvestment = purchasePrice + developmentCosts;
      const grossProfit = projectedValue - totalInvestment;
      const roi = totalInvestment > 0 ? (grossProfit / totalInvestment) * 100 : 0;
      const annualizedReturn = holdingPeriod > 0 ? roi / holdingPeriod : 0;
      const profitPerAcre = acres > 0 ? grossProfit / acres : 0;
      const projectedValuePerAcre = acres > 0 ? projectedValue / acres : 0;
      
      calculatedMetrics = {
        purchasePrice,
        acres,
        pricePerAcre: Math.round(pricePerAcre),
        developmentCosts,
        projectedValue,
        projectedValuePerAcre: Math.round(projectedValuePerAcre),
        totalInvestment: Math.round(totalInvestment),
        grossProfit: Math.round(grossProfit),
        profitPerAcre: Math.round(profitPerAcre),
        roi: roi.toFixed(2),
        annualizedReturn: annualizedReturn.toFixed(2),
        holdingPeriod
      };
    }

    setPortfolioProperties([...portfolioProperties, { 
      ...currentProperty, 
      type: currentPropertyType,
      metrics: calculatedMetrics,
      dateAdded: new Date().toISOString()
    }]);
    setCurrentProperty({});
    setCurrentPropertyType(null);
    setOnboardingStep('summary');
  };

  const finishOnboarding = () => {
    setOnboardingStep('verification-prompt');
  };

  const skipVerification = () => {
    setCurrentScreen('dashboard');
  };

  const startVerification = () => {
    setOnboardingStep('verification');
  };

  const toggleFlag = (propertyId) => {
    setProperties(properties.map(prop => 
      prop.id === propertyId ? { ...prop, flagged: !prop.flagged } : prop
    ));
  };

  const requestInfo = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    setConfirmationMessage(`Information request sent for:\n\n${property.name}\n${property.city}, ${property.state}\n\nOur team will contact you within 24 hours with detailed property information, financials, and next steps.`);
    setShowConfirmation(true);
  };

  const requestInfoForAll = () => {
    const flaggedProps = properties.filter(p => p.flagged);
    setConfirmationMessage(`Information request sent for ${flaggedProps.length} properties:\n\n${flaggedProps.map(p => `• ${p.name}`).join('\n')}\n\nOur team will contact you within 24 hours with detailed information on all flagged properties.`);
    setShowConfirmation(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredProperties = properties.filter(prop => {
    if (activeCategory !== 'all' && prop.type !== activeCategory) return false;
    return true;
  });

  const flaggedCount = properties.filter(p => p.flagged).length;

  return (
    <div className="min-h-screen bg-[#1a5c4a]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
        
        body, html {
          background-color: #1a5c4a !important;
          margin: 0;
          padding: 0;
        }
        
        * {
          font-family: 'Space Mono', monospace;
        }
        
        .serif {
          font-family: 'Cormorant Garamond', serif;
        }
        
        .gradient-lime {
          background: linear-gradient(135deg, #c4e538 0%, #d4ff00 50%, #c4e538 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .input-field {
          background-color: rgba(42, 109, 90, 0.5);
          border: 1px solid rgba(196, 229, 56, 0.2);
          transition: all 0.3s ease;
        }
        
        .input-field:focus {
          outline: none;
          border-color: #c4e538;
          background-color: rgba(42, 109, 90, 0.7);
          box-shadow: 0 0 0 3px rgba(196, 229, 56, 0.1);
        }
        
        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        
        .btn-primary {
          background-color: #c4e538;
          color: #0f4436;
          font-weight: bold;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .btn-primary:hover {
          background-color: #afd430;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(196, 229, 56, 0.2);
        }
        
        .btn-secondary {
          background-color: transparent;
          border: 2px solid #c4e538;
          color: #c4e538;
          font-weight: bold;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .btn-secondary:hover {
          background-color: #c4e538;
          color: #0f4436;
        }
        
        .property-card {
          background: linear-gradient(135deg, rgba(15, 68, 54, 0.8) 0%, rgba(42, 109, 90, 0.6) 100%);
          border: 2px solid rgba(196, 229, 56, 0.2);
          transition: all 0.3s ease;
        }
        
        .property-card:hover {
          border-color: #c4e538;
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(196, 229, 56, 0.2);
        }
        
        .category-btn {
          transition: all 0.3s ease;
          border: 2px solid transparent;
          cursor: pointer;
        }
        
        .category-btn.active {
          background-color: #c4e538;
          color: #0f4436;
          border-color: #c4e538;
        }
        
        .category-btn:not(.active) {
          background-color: rgba(42, 109, 90, 0.5);
          border-color: rgba(196, 229, 56, 0.2);
        }
        
        .category-btn:not(.active):hover {
          border-color: #c4e538;
          background-color: rgba(42, 109, 90, 0.7);
        }
        
        .badge-featured {
          background: linear-gradient(135deg, #c4e538 0%, #afd430 100%);
          color: #0f4436;
        }
        
        .badge-new {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
          color: white;
        }
        
        .badge-on-market {
          background: linear-gradient(135deg, #ff9f1c 0%, #ff8800 100%);
          color: white;
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(255, 159, 28, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 159, 28, 0.8);
          }
        }
        
        .flag-btn {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .flag-btn.flagged {
          background-color: #c4e538;
          color: #0f4436;
        }
        
        .flag-btn:not(.flagged) {
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
        }
        
        .flag-btn:hover {
          transform: scale(1.1);
        }
        
        .property-image {
          position: relative;
          overflow: hidden;
        }
        
        .property-image::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(15, 68, 54, 0.8), transparent);
        }
        
        .filter-panel {
          background: linear-gradient(135deg, rgba(15, 68, 54, 0.95) 0%, rgba(42, 109, 90, 0.95) 100%);
          border: 1px solid rgba(196, 229, 56, 0.3);
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .divider {
          background: linear-gradient(90deg, transparent, rgba(196, 229, 56, 0.3), transparent);
          height: 1px;
        }
        
        .feature-card {
          background: linear-gradient(135deg, rgba(15, 68, 54, 0.6) 0%, rgba(42, 109, 90, 0.4) 100%);
          border: 1px solid rgba(196, 229, 56, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .verification-card {
          background: linear-gradient(135deg, rgba(15, 68, 54, 0.8) 0%, rgba(42, 109, 90, 0.6) 100%);
          border: 2px solid rgba(196, 229, 56, 0.2);
          transition: all 0.3s ease;
        }
        
        .verification-card:hover {
          border-color: #c4e538;
          transform: translateY(-2px);
        }
        
        .upload-zone {
          border: 2px dashed rgba(196, 229, 56, 0.3);
          background-color: rgba(42, 109, 90, 0.3);
          transition: all 0.3s ease;
        }
        
        .upload-zone:hover {
          border-color: #c4e538;
          background-color: rgba(42, 109, 90, 0.5);
        }
      `}</style>

      {/* LOGIN SCREEN */}
      {currentScreen === 'login' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding */}
            <div className="hidden md:block space-y-8">
              <div>
                <h1 className="text-6xl font-bold serif gradient-lime mb-2">DEALFLOW</h1>
                <p className="text-lg text-gray-300">OFF-MARKET OPPORTUNITIES</p>
              </div>
              
              <div className="space-y-4">
                <div className="feature-card p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#c4e538] rounded-lg">
                      <Building2 size={24} className="text-[#0f4436]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Exclusive Access</h3>
                      <p className="text-gray-300 text-sm">Get early access to off-market deals before they hit the public market</p>
                    </div>
                  </div>
                </div>
                
                <div className="feature-card p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#c4e538] rounded-lg">
                      <TrendingUp size={24} className="text-[#0f4436]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Higher Returns</h3>
                      <p className="text-gray-300 text-sm">Average IRR of 19%+ across all active opportunities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div>
              <div className="bg-[#0f4436] rounded-2xl shadow-2xl p-8 md:p-10 border border-[#c4e538]/20">
                <div className="md:hidden mb-8">
                  <h1 className="text-4xl font-bold serif gradient-lime mb-1">DEALFLOW</h1>
                  <p className="text-sm text-gray-400">OFF-MARKET OPPORTUNITIES</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold serif text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Sign in to access exclusive deals</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          placeholder="investor@example.com"
                          className="w-full pl-12 pr-4 py-3 rounded-lg input-field text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={userData.password}
                          onChange={(e) => setUserData({...userData, password: e.target.value})}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-12 py-3 rounded-lg input-field text-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg btn-primary flex items-center justify-center gap-2"
                    >
                      Sign In
                      <ArrowRight size={20} />
                    </button>
                  </form>

                  <div className="divider"></div>

                  <div className="text-center">
                    <p className="text-gray-400">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setCurrentScreen('register')}
                        className="text-[#c4e538] font-bold hover:underline"
                      >
                        Sign Up
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER SCREEN */}
      {currentScreen === 'register' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
            <div className="hidden md:block space-y-8">
              <div>
                <h1 className="text-6xl font-bold serif gradient-lime mb-2">DEALFLOW</h1>
                <p className="text-lg text-gray-300">OFF-MARKET OPPORTUNITIES</p>
              </div>
            </div>

            <div>
              <div className="bg-[#0f4436] rounded-2xl shadow-2xl p-8 md:p-10 border border-[#c4e538]/20">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold serif text-white mb-2">Create Account</h2>
                    <p className="text-gray-400">Join our exclusive investor network</p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={userData.fullName}
                        onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 rounded-lg input-field text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          placeholder="investor@example.com"
                          className="w-full pl-12 pr-4 py-3 rounded-lg input-field text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        placeholder="(619) 555-0123"
                        className="w-full px-4 py-3 rounded-lg input-field text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={userData.password}
                          onChange={(e) => setUserData({...userData, password: e.target.value})}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-12 py-3 rounded-lg input-field text-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg btn-primary flex items-center justify-center gap-2"
                    >
                      Create Account
                      <ArrowRight size={20} />
                    </button>
                  </form>

                  <div className="divider"></div>

                  <div className="text-center">
                    <p className="text-gray-400">
                      Already have an account?{' '}
                      <button
                        onClick={() => setCurrentScreen('login')}
                        className="text-[#c4e538] font-bold hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ONBOARDING */}
      {currentScreen === 'onboarding' && onboardingStep === 'welcome' && (
        <div className="min-h-screen p-8 flex items-center justify-center">
          <div className="max-w-2xl w-full text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold serif gradient-lime">Welcome to DEALFLOW</h1>
              <p className="text-2xl text-gray-300">Let's get your portfolio set up</p>
            </div>

            <div className="bg-[#0f4436] rounded-2xl p-8 border border-[#c4e538]/20 space-y-6">
              <div className="flex items-start gap-4 p-4 bg-[#2a6d5a]/30 rounded-lg">
                <div className="p-3 bg-[#c4e538] rounded-lg flex-shrink-0">
                  <Check size={24} className="text-[#0f4436]" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-2">Quick & Easy Setup</h3>
                  <p className="text-gray-300">We'll help you import your existing properties in just a few minutes.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#2a6d5a]/30 rounded-lg">
                <div className="p-3 bg-[#c4e538] rounded-lg flex-shrink-0">
                  <Calculator size={24} className="text-[#0f4436]" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-2">Auto-Calculate Everything</h3>
                  <p className="text-gray-300">Enter basic info and we'll calculate NOI, Cap Rate, Cash-on-Cash, ROI, and more.</p>
                </div>
              </div>

              <button
                onClick={() => skipOnboarding()}
                className="w-full mt-8 py-4 rounded-lg btn-primary flex items-center justify-center gap-2 text-lg"
              >
                Get Started
                <ChevronRight size={24} />
              </button>
              
              <button
                onClick={() => setCurrentScreen('marketplace')}
                className="w-full py-3 rounded-lg btn-secondary text-sm"
              >
                Skip - I'll Add Properties Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Type Selection */}
      {currentScreen === 'onboarding' && onboardingStep === 'property-type' && (
        <div className="min-h-screen p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold serif gradient-lime mb-2">Add Your Properties</h2>
              <p className="text-gray-300">Select property type or import from CSV</p>
            </div>

            {/* CSV Import Option */}
            <div className="bg-[#0f4436] border-2 border-[#c4e538] rounded-2xl p-6">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-[#c4e538] rounded-xl">
                  <Upload size={32} className="text-[#0f4436]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Bulk Import from CSV</h3>
                  <p className="text-gray-300 mb-4">Upload a CSV file with all your properties at once. Save time by importing your entire portfolio.</p>
                  <div className="flex gap-4">
                    <label className="px-6 py-3 bg-[#c4e538] text-[#0f4436] font-bold rounded-lg hover:bg-[#afd430] transition-colors cursor-pointer flex items-center gap-2">
                      <Upload size={20} />
                      Upload CSV
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            alert('CSV Import Feature\n\nYour file: ' + e.target.files[0].name + '\n\nIn production, this would parse your CSV and import all properties automatically. Expected columns:\n\n• Property Name\n• Type (commercial/multifamily/residential-flip/vacant-land)\n• Purchase Price\n• Monthly Rent (for commercial/multifamily)\n• Annual Expenses (for commercial/multifamily)\n• ARV (for flips)\n• Acres (for land)');
                          }
                        }}
                      />
                    </label>
                    <button className="px-6 py-3 border-2 border-[#c4e538] text-[#c4e538] font-bold rounded-lg hover:bg-[#c4e538] hover:text-[#0f4436] transition-all">
                      Download Template
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-400">
              <p className="text-sm">— OR ADD MANUALLY —</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROPERTY_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    onClick={() => {
                      setCurrentPropertyType(type.id);
                      setOnboardingStep('property-form');
                    }}
                    className="property-card p-8 rounded-2xl cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-6 bg-[#c4e538] rounded-2xl">
                        <Icon size={48} className="text-[#0f4436]" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{type.name}</h3>
                        <p className="text-gray-300">{type.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {portfolioProperties.length > 0 && (
              <div className="text-center space-y-4">
                <p className="text-gray-300">
                  {portfolioProperties.length} {portfolioProperties.length === 1 ? 'property' : 'properties'} added
                </p>
                <button
                  onClick={finishOnboarding}
                  className="px-8 py-3 bg-[#c4e538] text-[#0f4436] rounded-lg font-bold hover:bg-[#afd430] transition-colors"
                >
                  Continue to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Property Form - Commercial/Multifamily */}
      {currentScreen === 'onboarding' && onboardingStep === 'property-form' && (currentPropertyType === 'commercial' || currentPropertyType === 'multifamily') && (
        <div className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold serif gradient-lime mb-2">
                {currentPropertyType === 'commercial' ? 'Commercial Property' : 'Multifamily Property'}
              </h2>
              <p className="text-gray-300">Enter property details</p>
            </div>

            <div className="bg-[#0f4436] rounded-2xl p-8 border border-[#c4e538]/20">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Property Name/Address *
                    </label>
                    <input
                      type="text"
                      value={currentProperty.name || ''}
                      onChange={(e) => setCurrentProperty({...currentProperty, name: e.target.value})}
                      placeholder="123 Main St, San Diego, CA"
                      className="w-full px-4 py-3 rounded-lg input-field text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Purchase Price *
                    </label>
                    <input
                      type="number"
                      value={currentProperty.purchasePrice || ''}
                      onChange={(e) => setCurrentProperty({...currentProperty, purchasePrice: e.target.value})}
                      placeholder="2,500,000"
                      className="w-full px-4 py-3 rounded-lg input-field text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Monthly Rent/Income *
                    </label>
                    <input
                      type="number"
                      value={currentProperty.monthlyRent || ''}
                      onChange={(e) => setCurrentProperty({...currentProperty, monthlyRent: e.target.value})}
                      placeholder="18,500"
                      className="w-full px-4 py-3 rounded-lg input-field text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Annual Expenses *
                    </label>
                    <input
                      type="number"
                      value={currentProperty.annualExpenses || ''}
                      onChange={(e) => setCurrentProperty({...currentProperty, annualExpenses: e.target.value})}
                      placeholder="75,000"
                      className="w-full px-4 py-3 rounded-lg input-field text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setOnboardingStep('property-type')}
                  className="px-6 py-4 border-2 border-[#c4e538] text-[#c4e538] rounded-lg hover:bg-[#c4e538] hover:text-[#0f4436] transition-all font-bold"
                >
                  Back
                </button>
                <button
                  onClick={addPropertyToPortfolio}
                  className="flex-1 py-4 rounded-lg btn-primary"
                  disabled={!currentProperty.name || !currentProperty.purchasePrice}
                >
                  Add Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Form - Residential Flip */}
      {currentScreen === 'onboarding' && onboardingStep === 'property-form' && currentPropertyType === 'residential-flip' && (
        <div className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold serif gradient-lime mb-2">Residential Flip</h2>
              <p className="text-gray-300">Track your fix & flip project</p>
            </div>

            <div className="bg-[#0f4436] rounded-2xl p-8 border border-[#c4e538]/20">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Property Address *
                    </label>
                    <input
                      type="text"
                      value={currentProperty.name || ''}
                      onChange={(e) => setCurrentProperty({...currentProperty, name: e.target.value})}
                      placeholder="456 Oak Street, Austin, TX"
                      className="w-full px-4 py-3 rounded-lg input-field text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Purchase Price *
                    </label>
                    <input
                      type="number"
                      value={currentProperty.purchasePrice || ''}
                      onChange={(e) => setCurrentProperty({...currentProperty, purchasePrice: e.target.value})}
                      placeholder="285,000"
                      className="w-full px-4 py-3 rounded-lg input-field text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rehab Budget *
                    </label>
                    <input
                      type="number"
                      value={currentProperty.rehabBudget || ''}
                      onChange={(e) => setCurrentProperty({...currentProperty, rehabBudget: e.target.value})}
                      placeholder="65,000"
                      className="w-full px-4 py-3 rounded-lg input-field text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      After Repair Value (ARV) *
                    </label>
                    <input
                      type="number"
                      value={currentProperty.arv || ''}
                      onChange={(e) => setCurrentProperty({...currentProperty, arv: e.target.value})}
                      placeholder="450,000"
                      className="w-full px-4 py-3 rounded-lg input-field text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setOnboardingStep('property-type')}
                  className="px-6 py-4 border-2 border-[#c4e538] text-[#c4e538] rounded-lg hover:bg-[#c4e538] hover:text-[#0f4436] transition-all font-bold"
                >
                  Back
                </button>
                <button
                  onClick={addPropertyToPortfolio}
                  className="flex-1 py-4 rounded-lg btn-primary"
                  disabled={!currentProperty.name || !currentProperty.purchasePrice}
                >
                  Add Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Form - Vacant Land */}
      {currentScreen === 'onboarding' && onboardingStep === 'property-form' && currentPropertyType === 'vacant-land' && (
        <div className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold serif gradient-lime mb-2">Vacant Land</h2>
              <p className="text-gray-300">Track your land investment</p>
            </div>

            <div className="bg-[#0f4436] rounded-2xl p-8 border border-[#c4e538]/20">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Property Location *
                    </label>
                    <input
                      type="text"
                      value={currentProperty.name || ''}
                      onChange={(e) => setCurrentProperty({...currentProperty, name: e.target.value})}
                      placeholder="Highway 101, Denver, CO"
                      className="w-full px-4 py-3 rounded-lg input-field text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Acreage *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentProperty.acres || ''}
                      onChange={(e) => setCurrentProperty({...currentProperty, acres: e.target.value})}
                      placeholder="5.5"
                      className="w-full px-4 py-3 rounded-lg input-field text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Purchase Price *
                    </label>
                    <input
                      type="number"
                      value={currentProperty.purchasePrice || ''}
                      onChange={(e) => setCurrentProperty({...currentProperty, purchasePrice: e.target.value})}
                      placeholder="550,000"
                      className="w-full px-4 py-3 rounded-lg input-field text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Projected Value *
                    </label>
                    <input
                      type="number"
                      value={currentProperty.projectedValue || ''}
                      onChange={(e) => setCurrentProperty({...currentProperty, projectedValue: e.target.value})}
                      placeholder="950,000"
                      className="w-full px-4 py-3 rounded-lg input-field text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setOnboardingStep('property-type')}
                  className="px-6 py-4 border-2 border-[#c4e538] text-[#c4e538] rounded-lg hover:bg-[#c4e538] hover:text-[#0f4436] transition-all font-bold"
                >
                  Back
                </button>
                <button
                  onClick={addPropertyToPortfolio}
                  className="flex-1 py-4 rounded-lg btn-primary"
                  disabled={!currentProperty.name || !currentProperty.purchasePrice}
                >
                  Add Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary - Portfolio Added */}
      {currentScreen === 'onboarding' && onboardingStep === 'summary' && (
        <div className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#c4e538] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-[#0f4436]" />
              </div>
              <h2 className="text-4xl font-bold serif gradient-lime mb-2">Property Added!</h2>
              <p className="text-gray-300">You've added {portfolioProperties.length} {portfolioProperties.length === 1 ? 'property' : 'properties'} to your portfolio</p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => setOnboardingStep('property-type')}
                className="w-full py-4 border-2 border-[#c4e538] text-[#c4e538] rounded-lg hover:bg-[#c4e538] hover:text-[#0f4436] transition-all font-bold flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Another Property
              </button>
              <button
                onClick={finishOnboarding}
                className="w-full py-4 rounded-lg btn-primary text-lg flex items-center justify-center gap-2"
              >
                Continue to Dashboard
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Prompt */}
      {currentScreen === 'onboarding' && onboardingStep === 'verification-prompt' && (
        <div className="min-h-screen p-8 flex items-center justify-center">
          <div className="max-w-3xl w-full space-y-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-[#c4e538] rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={48} className="text-[#0f4436]" />
              </div>
              <h2 className="text-5xl font-bold serif gradient-lime mb-4">Verify Your Investor Status</h2>
              <p className="text-xl text-gray-300">Unlock exclusive deals and partnership opportunities</p>
            </div>

            <div className="bg-[#0f4436] rounded-2xl p-8 border border-[#c4e538]/20">
              <h3 className="text-2xl font-bold mb-6">Why Verify?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex gap-4">
                  <div className="p-3 bg-[#c4e538] rounded-lg h-fit">
                    <Shield size={24} className="text-[#0f4436]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Access Exclusive Deals</h4>
                    <p className="text-sm text-gray-400">Get access to Reg D 506(c) offerings and off-market opportunities</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-[#c4e538] rounded-lg h-fit">
                    <Users size={24} className="text-[#0f4436]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Partner with Investors</h4>
                    <p className="text-sm text-gray-400">Post partnership opportunities and co-invest with verified investors</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-[#c4e538] rounded-lg h-fit">
                    <CheckCircle size={24} className="text-[#0f4436]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Build Trust</h4>
                    <p className="text-sm text-gray-400">Verified badge increases credibility with sponsors and partners</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-[#c4e538] rounded-lg h-fit">
                    <TrendingUp size={24} className="text-[#0f4436]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Higher Returns</h4>
                    <p className="text-sm text-gray-400">Access to institutional-quality deals with superior returns</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-200">
                    <strong>Quick & Secure:</strong> Verification typically takes 1-3 business days. All documents are encrypted and processed by our SEC-compliant verification partner.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={startVerification}
                  className="w-full py-4 rounded-lg btn-primary text-lg flex items-center justify-center gap-2"
                >
                  <Shield size={20} />
                  Start Verification (5 minutes)
                </button>
                <button
                  onClick={skipVerification}
                  className="w-full py-3 border-2 border-[#c4e538]/30 text-gray-300 rounded-lg hover:border-[#c4e538] hover:text-white transition-all"
                >
                  Skip for Now - I'll Verify Later
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400">
              You can always verify later from your account settings
            </p>
          </div>
        </div>
      )}

      {/* Verification Flow - Select Method */}
      {currentScreen === 'onboarding' && onboardingStep === 'verification' && !selectedVerificationMethod && (
        <div className="min-h-screen p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="mb-6">
              <h2 className="text-4xl font-bold serif gradient-lime mb-2">Select Verification Method</h2>
              <p className="text-gray-400">Choose how you qualify as an accredited investor</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income Method */}
              <div
                onClick={() => setSelectedVerificationMethod('income')}
                className="verification-card rounded-xl p-6 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#c4e538] rounded-lg">
                    <DollarSign size={32} className="text-[#0f4436]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Income Verification</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Individual income exceeding $200,000 (or $300,000 joint) in each of the prior two years
                    </p>
                    <div className="text-xs text-gray-500">
                      <p className="font-bold mb-1">Required Documents:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Tax returns (last 2 years)</li>
                        <li>Government ID</li>
                        <li>CPA letter (optional)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Worth Method */}
              <div
                onClick={() => setSelectedVerificationMethod('net-worth')}
                className="verification-card rounded-xl p-6 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#c4e538] rounded-lg">
                    <TrendingUp size={32} className="text-[#0f4436]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Net Worth Verification</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Net worth exceeding $1,000,000 (excluding primary residence)
                    </p>
                    <div className="text-xs text-gray-500">
                      <p className="font-bold mb-1">Required Documents:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Bank statements (last 3 months)</li>
                        <li>Brokerage statements</li>
                        <li>Government ID</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Credentials */}
              <div
                onClick={() => setSelectedVerificationMethod('professional')}
                className="verification-card rounded-xl p-6 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#c4e538] rounded-lg">
                    <Briefcase size={32} className="text-[#0f4436]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Professional Credentials</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Hold Series 7, 65, or 82 license in good standing
                    </p>
                    <div className="text-xs text-gray-500">
                      <p className="font-bold mb-1">Required Documents:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Professional license certificate</li>
                        <li>Government ID</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Entity */}
              <div
                onClick={() => setSelectedVerificationMethod('entity')}
                className="verification-card rounded-xl p-6 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#c4e538] rounded-lg">
                    <Building2 size={32} className="text-[#0f4436]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Entity Verification</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Trust, LLC, or corporation with assets exceeding $5,000,000
                    </p>
                    <div className="text-xs text-gray-500">
                      <p className="font-bold mb-1">Required Documents:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Entity formation documents</li>
                        <li>Financial statements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setOnboardingStep('verification-prompt')}
                className="px-6 py-4 border-2 border-[#c4e538] text-[#c4e538] rounded-lg hover:bg-[#c4e538] hover:text-[#0f4436] transition-all font-bold"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Flow - Document Upload (Simplified) */}
      {currentScreen === 'onboarding' && onboardingStep === 'verification' && selectedVerificationMethod && (
        <div className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-6">
              <h2 className="text-4xl font-bold serif gradient-lime mb-2">Upload Documents</h2>
              <p className="text-gray-400">Upload your verification documents securely</p>
            </div>

            <div className="bg-[#0f4436] rounded-xl p-6 border border-[#c4e538]/20 space-y-4">
              {/* Government ID */}
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Camera size={20} className="text-[#c4e538]" />
                  Government-Issued ID *
                </h3>
                <label className="upload-zone rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer">
                  <Upload size={40} className="text-[#c4e538] mb-2" />
                  <p className="font-bold mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PDF, JPG, PNG (max 10MB)</p>
                  <input type="file" multiple className="hidden" />
                </label>
              </div>

              {/* Primary Documents */}
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <FileText size={20} className="text-[#c4e538]" />
                  {selectedVerificationMethod === 'income' && 'Tax Returns (Last 2 Years) *'}
                  {selectedVerificationMethod === 'net-worth' && 'Financial Statements *'}
                  {selectedVerificationMethod === 'professional' && 'Professional License *'}
                  {selectedVerificationMethod === 'entity' && 'Entity Documents *'}
                </h3>
                <label className="upload-zone rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer">
                  <Upload size={40} className="text-[#c4e538] mb-2" />
                  <p className="font-bold mb-1">Upload documents</p>
                  <p className="text-xs text-gray-400">PDF format preferred</p>
                  <input type="file" multiple className="hidden" />
                </label>
              </div>
            </div>

            <div className="bg-orange-500/20 border border-orange-500/40 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-200">
                  <strong>Verification Timeline:</strong> Most verifications are completed within 1-3 business days. You'll receive email updates throughout the process.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedVerificationMethod(null)}
                className="px-6 py-4 border-2 border-[#c4e538] text-[#c4e538] rounded-lg hover:bg-[#c4e538] hover:text-[#0f4436] transition-all font-bold"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setVerificationStatus('pending');
                  alert('Verification Submitted!\n\nYour documents have been securely submitted for review.\n\nTypical review time: 1-3 business days\n\nYou will receive an email notification once your verification is complete.');
                  setCurrentScreen('dashboard');
                }}
                className="flex-1 py-4 btn-primary rounded-lg text-lg"
              >
                Submit for Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {currentScreen === 'dashboard' && (
        <div className="min-h-screen text-white">
          {/* Header */}
          <div className="bg-[#0f4436] border-b border-[#c4e538]/20 py-6 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold serif gradient-lime">My Portfolio</h1>
                  <p className="text-gray-300 mt-1">{portfolioProperties.length} properties in your portfolio</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentScreen('marketplace')}
                    className="px-4 py-2 bg-[#2a6d5a] hover:bg-[#3a7d6a] rounded-lg flex items-center gap-2 transition-colors border border-[#c4e538]/20"
                  >
                    <Building2 size={20} />
                    Marketplace
                  </button>
                  <button
                    onClick={() => setCurrentScreen('login')}
                    className="px-4 py-2 bg-[#2a6d5a] hover:bg-[#3a7d6a] rounded-lg flex items-center gap-2 transition-colors border border-[#c4e538]/20"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {portfolioProperties.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-[#2a6d5a] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 size={48} className="text-[#c4e538]" />
                </div>
                <h3 className="text-3xl font-bold serif mb-4">No Properties Yet</h3>
                <p className="text-gray-300 mb-8">Add your first property to start tracking your portfolio</p>
                <button
                  onClick={() => {
                    setCurrentScreen('onboarding');
                    setOnboardingStep('property-type');
                  }}
                  className="px-8 py-4 bg-[#c4e538] text-[#0f4436] rounded-lg font-bold hover:bg-[#afd430] transition-colors text-lg flex items-center gap-2 mx-auto"
                >
                  <Plus size={24} />
                  Add Property
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Your Properties</h2>
                  <button
                    onClick={() => {
                      setCurrentScreen('onboarding');
                      setOnboardingStep('property-type');
                    }}
                    className="px-6 py-3 bg-[#c4e538] text-[#0f4436] rounded-lg font-bold hover:bg-[#afd430] transition-colors flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add Property
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioProperties.map((property, idx) => (
                    <div key={idx} className="bg-[#0f4436] border border-[#c4e538]/20 rounded-xl p-6 hover:border-[#c4e538] transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{property.name}</h3>
                          <p className="text-sm text-[#c4e538] capitalize">{property.type.replace('-', ' ')}</p>
                        </div>
                        <span className="px-2 py-1 bg-[#c4e538]/20 text-[#c4e538] rounded text-xs font-bold">
                          {property.type === 'commercial' || property.type === 'multifamily' ? 'INCOME' : 
                           property.type === 'residential-flip' ? 'FLIP' : 'LAND'}
                        </span>
                      </div>
                      
                      {/* Commercial/Multifamily Metrics */}
                      {(property.type === 'commercial' || property.type === 'multifamily') && property.metrics && (
                        <div className="space-y-3">
                          <div className="bg-[#2a6d5a]/30 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-gray-400">Purchase Price</span>
                              <span className="text-lg font-bold text-[#c4e538]">{formatCurrency(property.metrics.purchasePrice)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-gray-400">Cap Rate</p>
                                <p className="font-bold text-[#c4e538]">{property.metrics.capRate}%</p>
                              </div>
                              <div>
                                <p className="text-gray-400">CoC Return</p>
                                <p className="font-bold text-[#c4e538]">{property.metrics.cashOnCash}%</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-[#2a6d5a]/20 rounded p-2">
                              <p className="text-gray-400">Monthly Income</p>
                              <p className="font-bold">{formatCurrency(property.metrics.monthlyRent)}</p>
                            </div>
                            <div className="bg-[#2a6d5a]/20 rounded p-2">
                              <p className="text-gray-400">Monthly Cash Flow</p>
                              <p className="font-bold text-green-400">{formatCurrency(property.metrics.monthlyCashFlow)}</p>
                            </div>
                            <div className="bg-[#2a6d5a]/20 rounded p-2">
                              <p className="text-gray-400">NOI</p>
                              <p className="font-bold">{formatCurrency(property.metrics.noi)}</p>
                            </div>
                            <div className="bg-[#2a6d5a]/20 rounded p-2">
                              <p className="text-gray-400">DSCR</p>
                              <p className="font-bold">{property.metrics.dscr}x</p>
                            </div>
                          </div>

                          <div className="border-t border-[#c4e538]/20 pt-3">
                            <p className="text-xs text-gray-400 mb-2">Projected Value</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-gray-400">5 Year</p>
                                <p className="font-bold text-[#c4e538]">{formatCurrency(property.metrics.year5Value)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">10 Year</p>
                                <p className="font-bold text-[#c4e538]">{formatCurrency(property.metrics.year10Value)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Residential Flip Metrics */}
                      {property.type === 'residential-flip' && property.metrics && (
                        <div className="space-y-3">
                          <div className="bg-[#2a6d5a]/30 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-gray-400">Total Investment</span>
                              <span className="text-lg font-bold">{formatCurrency(property.metrics.totalCost)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">ARV</span>
                              <span className="text-lg font-bold text-[#c4e538]">{formatCurrency(property.metrics.arv)}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-[#2a6d5a]/20 rounded p-2">
                              <p className="text-gray-400">Projected Profit</p>
                              <p className="font-bold text-green-400">{formatCurrency(property.metrics.grossProfit)}</p>
                            </div>
                            <div className="bg-[#2a6d5a]/20 rounded p-2">
                              <p className="text-gray-400">ROI</p>
                              <p className="font-bold text-[#c4e538]">{property.metrics.roi}%</p>
                            </div>
                            <div className="bg-[#2a6d5a]/20 rounded p-2">
                              <p className="text-gray-400">Profit Margin</p>
                              <p className="font-bold">{property.metrics.profitMargin}%</p>
                            </div>
                            <div className="bg-[#2a6d5a]/20 rounded p-2">
                              <p className="text-gray-400">Rehab Budget</p>
                              <p className="font-bold">{formatCurrency(property.metrics.rehabBudget)}</p>
                            </div>
                          </div>

                          {property.metrics.seventyRulePass !== undefined && (
                            <div className={`text-xs p-2 rounded ${property.metrics.seventyRulePass ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>
                              {property.metrics.seventyRulePass ? '✓ Passes 70% Rule' : '⚠ Above 70% Rule'}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Vacant Land Metrics */}
                      {property.type === 'vacant-land' && property.metrics && (
                        <div className="space-y-3">
                          <div className="bg-[#2a6d5a]/30 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-gray-400">Total Investment</span>
                              <span className="text-lg font-bold">{formatCurrency(property.metrics.totalInvestment)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">Projected Value</span>
                              <span className="text-lg font-bold text-[#c4e538]">{formatCurrency(property.metrics.projectedValue)}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-[#2a6d5a]/20 rounded p-2">
                              <p className="text-gray-400">Acreage</p>
                              <p className="font-bold">{property.metrics.acres} acres</p>
                            </div>
                            <div className="bg-[#2a6d5a]/20 rounded p-2">
                              <p className="text-gray-400">Price/Acre</p>
                              <p className="font-bold">{formatCurrency(property.metrics.pricePerAcre)}</p>
                            </div>
                            <div className="bg-[#2a6d5a]/20 rounded p-2">
                              <p className="text-gray-400">Projected ROI</p>
                              <p className="font-bold text-[#c4e538]">{property.metrics.roi}%</p>
                            </div>
                            <div className="bg-[#2a6d5a]/20 rounded p-2">
                              <p className="text-gray-400">Annual Return</p>
                              <p className="font-bold text-[#c4e538]">{property.metrics.annualizedReturn}%</p>
                            </div>
                          </div>

                          <div className="bg-green-500/20 text-green-300 text-xs p-2 rounded">
                            Profit/Acre: {formatCurrency(property.metrics.profitPerAcre)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MARKETPLACE */}
      {currentScreen === 'marketplace' && (
        <div className="min-h-screen text-white">
          {/* Header */}
          <div className="bg-[#0f4436] border-b border-[#c4e538]/20 py-6 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold serif gradient-lime">Property Marketplace</h1>
                  <p className="text-gray-300 mt-1">Exclusive off-market opportunities</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentScreen('dashboard')}
                    className="px-4 py-2 bg-[#2a6d5a] hover:bg-[#3a7d6a] rounded-lg flex items-center gap-2 transition-colors border border-[#c4e538]/20"
                  >
                    <Home size={20} />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-[#2a6d5a] hover:bg-[#3a7d6a] rounded-lg flex items-center gap-2 transition-colors border border-[#c4e538]/20"
                  >
                    <Filter size={20} />
                    Filters
                  </button>
                  {flaggedCount > 0 && (
                    <button
                      onClick={() => setShowFlaggedPanel(!showFlaggedPanel)}
                      className="px-4 py-2 bg-[#c4e538] text-[#0f4436] rounded-lg font-bold flex items-center gap-2 hover:bg-[#afd430] transition-colors"
                    >
                      <Flag size={20} />
                      {flaggedCount} Flagged
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentScreen('login')}
                    className="px-4 py-2 bg-[#2a6d5a] hover:bg-[#3a7d6a] rounded-lg flex items-center gap-2 transition-colors border border-[#c4e538]/20"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="relative">
                <div className="overflow-x-auto pb-2 scrollbar-hide">
                  <div className="flex gap-3 min-w-max">
                    {CATEGORIES.map(category => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={`category-btn px-6 py-3 rounded-lg flex items-center gap-3 font-bold whitespace-nowrap ${
                            activeCategory === category.id ? 'active' : ''
                          }`}
                        >
                          <Icon size={20} />
                          <span>{category.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            activeCategory === category.id 
                              ? 'bg-[#0f4436] text-[#c4e538]' 
                              : 'bg-[#0f4436] text-gray-300'
                          }`}>
                            {category.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flagged Properties Panel */}
          {showFlaggedPanel && flaggedCount > 0 && (
            <div className="bg-[#0f4436] border-b border-[#c4e538]/20 p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                <div className="filter-panel rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold serif gradient-lime">Your Flagged Properties</h3>
                      <p className="text-gray-300 mt-1">{flaggedCount} properties you're interested in</p>
                    </div>
                    <button
                      onClick={() => setShowFlaggedPanel(false)}
                      className="p-2 hover:bg-[#2a6d5a] rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {properties.filter(p => p.flagged).map(property => (
                      <div
                        key={property.id}
                        className="bg-[#2a6d5a]/30 rounded-lg p-4 flex items-center justify-between hover:bg-[#2a6d5a]/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <img
                            src={property.images[0]}
                            alt={property.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{property.name}</h4>
                            <p className="text-sm text-gray-300">{property.city}, {property.state}</p>
                          </div>
                          <div className="text-right mr-4">
                            <p className="text-2xl font-bold text-[#c4e538]">{formatCurrency(property.price)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => requestInfo(property.id)}
                            className="px-4 py-2 bg-[#c4e538] text-[#0f4436] font-bold rounded-lg hover:bg-[#afd430] transition-colors whitespace-nowrap"
                          >
                            Get Info
                          </button>
                          <button
                            onClick={() => toggleFlag(property.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={requestInfoForAll}
                      className="flex-1 py-3 bg-[#c4e538] text-[#0f4436] font-bold rounded-lg hover:bg-[#afd430] transition-colors text-lg"
                    >
                      Request Info for All {flaggedCount} Properties
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Properties Grid */}
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="mb-6">
              <p className="text-gray-300">
                Showing <span className="text-[#c4e538] font-bold">{filteredProperties.length}</span> properties
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <div key={property.id} className="property-card rounded-xl overflow-hidden">
                  <div 
                    className="property-image relative h-56 cursor-pointer"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {property.onMarket && (
                        <span className="badge-on-market px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          ⚡ ON MARKET
                        </span>
                      )}
                      {property.featured && !property.onMarket && (
                        <span className="badge-featured px-3 py-1 rounded-full text-xs font-bold">
                          FEATURED
                        </span>
                      )}
                      {property.daysOnMarket <= 7 && !property.onMarket && (
                        <span className="badge-new px-3 py-1 rounded-full text-xs font-bold">
                          NEW
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlag(property.id);
                      }}
                      className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur flag-btn z-10 ${
                        property.flagged ? 'flagged' : ''
                      }`}
                    >
                      <Flag size={20} className={property.flagged ? 'fill-current' : ''} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-1">{property.name}</h3>
                      <p className="text-sm text-gray-300 flex items-center gap-1">
                        <MapPin size={14} />
                        {property.address}, {property.city}, {property.state}
                      </p>
                    </div>

                    <div className="space-y-3 mb-4">
                      {property.onMarket && property.reason && (
                        <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg p-3 mb-3">
                          <p className="text-xs font-bold text-orange-300 mb-1">💡 OPPORTUNITY</p>
                          <p className="text-sm text-white">{property.reason}</p>
                        </div>
                      )}

                      {(property.type === 'commercial' || property.type === 'multifamily' || property.type === 'on-market') && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Cap Rate</span>
                            <span className="font-bold text-[#c4e538]">{property.cap_rate}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">NOI</span>
                            <span className="font-bold">{formatCurrency(property.noi)}</span>
                          </div>
                        </>
                      )}

                      {property.type === 'residential-flip' && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">ARV</span>
                            <span className="font-bold text-[#c4e538]">{formatCurrency(property.arv)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Projected ROI</span>
                            <span className="font-bold text-[#c4e538]">{property.roi}%</span>
                          </div>
                        </>
                      )}

                      {property.type === 'vacant-land' && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Acreage</span>
                            <span className="font-bold">{property.acres} acres</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Projected ROI</span>
                            <span className="font-bold text-[#c4e538]">{property.roi}%</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#c4e538]/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">List Price</p>
                          <p className="text-2xl font-bold text-[#c4e538]">{formatCurrency(property.price)}</p>
                        </div>
                        <button
                          onClick={() => setSelectedProperty(property)}
                          className="px-4 py-2 bg-[#c4e538] text-[#0f4436] font-bold rounded-lg hover:bg-[#afd430] transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setSelectedProperty(null)}
        >
          <div
            className="bg-[#0f4436] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#c4e538]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="property-image relative h-96">
              <img
                src={selectedProperty.images[0]}
                alt={selectedProperty.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-6 right-6 p-3 bg-black/50 backdrop-blur rounded-full hover:bg-black/70 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-4xl font-bold serif mb-2">{selectedProperty.name}</h2>
                  <p className="text-gray-300 flex items-center gap-2">
                    <MapPin size={18} />
                    {selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFlag(selectedProperty.id);
                  }}
                  className={`p-4 rounded-full flag-btn ${
                    selectedProperty.flagged ? 'flagged' : ''
                  }`}
                >
                  <Flag size={24} className={selectedProperty.flagged ? 'fill-current' : ''} />
                </button>
              </div>

              <div className="bg-[#2a6d5a]/30 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-400 mb-1">List Price</p>
                <p className="text-4xl font-bold text-[#c4e538]">{formatCurrency(selectedProperty.price)}</p>
              </div>

              {selectedProperty.onMarket && selectedProperty.reason && (
                <div className="bg-gradient-to-r from-orange-500/30 to-orange-600/30 border-2 border-orange-500/50 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">💡</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-orange-200 mb-2">Missed Opportunity</h3>
                      <p className="text-white mb-2">{selectedProperty.reason}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    requestInfo(selectedProperty.id);
                  }}
                  className="flex-1 py-4 bg-[#c4e538] text-[#0f4436] font-bold text-lg rounded-lg hover:bg-[#afd430] transition-colors cursor-pointer"
                >
                  Request More Information
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowConfirmation(false)}
        >
          <div
            className="bg-[#0f4436] rounded-2xl max-w-md w-full p-8 border-2 border-[#c4e538]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-[#c4e538] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-[#0f4436]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              <h3 className="text-3xl font-bold serif gradient-lime mb-4">Request Sent!</h3>
              
              <div className="bg-[#2a6d5a]/30 rounded-lg p-4 mb-6 text-left">
                <p className="text-gray-200 whitespace-pre-line">{confirmationMessage}</p>
              </div>

              <button
                onClick={() => setShowConfirmation(false)}
                className="w-full py-3 bg-[#c4e538] text-[#0f4436] font-bold rounded-lg hover:bg-[#afd430] transition-colors text-lg"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sample data
const SAMPLE_PROPERTIES = [
  {
    id: 1,
    type: 'commercial',
    name: 'Downtown Office Tower',
    address: '450 Main Street',
    city: 'San Diego',
    state: 'CA',
    price: 8500000,
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'],
    sqft: 45000,
    cap_rate: 7.2,
    noi: 612000,
    occupancy: 92,
    yearBuilt: 2015,
    subType: 'Office',
    flagged: false,
    featured: true,
    daysOnMarket: 12,
    onMarket: false
  },
  {
    id: 2,
    type: 'multifamily',
    name: 'Sunset Apartments',
    address: '2200 Pacific Highway',
    city: 'Los Angeles',
    state: 'CA',
    price: 12500000,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'],
    units: 48,
    cap_rate: 5.8,
    noi: 725000,
    occupancy: 96,
    yearBuilt: 2018,
    avgRent: 2400,
    flagged: false,
    featured: false,
    daysOnMarket: 5,
    onMarket: false
  },
  {
    id: 3,
    type: 'residential-flip',
    name: 'Charming Craftsman Fixer',
    address: '1845 Oak Avenue',
    city: 'Austin',
    state: 'TX',
    price: 385000,
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'],
    sqft: 2200,
    bedrooms: 3,
    bathrooms: 2,
    rehabBudget: 75000,
    arv: 580000,
    roi: 26.1,
    yearBuilt: 1925,
    flagged: false,
    featured: true,
    daysOnMarket: 3,
    onMarket: false
  },
  {
    id: 4,
    type: 'vacant-land',
    name: 'Highway 101 Development Site',
    address: 'Highway 101 & Mountain View Rd',
    city: 'Denver',
    state: 'CO',
    price: 2200000,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'],
    acres: 15.5,
    zoning: 'C-2 Commercial',
    projectedValue: 4500000,
    roi: 104.5,
    utilities: 'Available',
    flagged: false,
    featured: false,
    daysOnMarket: 18,
    onMarket: false
  },
  {
    id: 11,
    type: 'on-market',
    name: 'Metro Plaza Shopping Center',
    address: '5600 Commerce Street',
    city: 'San Diego',
    state: 'CA',
    price: 7200000,
    images: ['https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=600&fit=crop'],
    sqft: 32000,
    cap_rate: 6.8,
    noi: 489600,
    occupancy: 85,
    yearBuilt: 2012,
    subType: 'Retail',
    flagged: false,
    featured: false,
    daysOnMarket: 45,
    onMarket: true,
    listingDays: 45,
    reason: 'Listed at 15% below asking due to motivated seller'
  },
  {
    id: 12,
    type: 'on-market',
    name: 'Westside Office Complex',
    address: '3200 Corporate Blvd',
    city: 'Austin',
    state: 'TX',
    price: 5800000,
    images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop'],
    sqft: 38000,
    cap_rate: 7.5,
    noi: 435000,
    occupancy: 78,
    yearBuilt: 2009,
    subType: 'Office',
    flagged: false,
    featured: false,
    daysOnMarket: 62,
    onMarket: true,
    listingDays: 62,
    reason: 'Price reduced 12% - Tenant improvement allowance included'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Properties', icon: Building2, count: 6 },
  { id: 'commercial', name: 'Commercial', icon: Building2, count: 1 },
  { id: 'multifamily', name: 'Multifamily', icon: Home, count: 1 },
  { id: 'residential-flip', name: 'Residential Flips', icon: Hammer, count: 1 },
  { id: 'vacant-land', name: 'Vacant Land', icon: TreePine, count: 1 },
  { id: 'on-market', name: '⚡ Missed Opportunities', icon: TrendingUp, count: 2 }
];

const PROPERTY_TYPES = [
  {
    id: 'commercial',
    name: 'Commercial',
    icon: Building2,
    description: 'Office, retail, industrial properties'
  },
  {
    id: 'multifamily',
    name: 'Multifamily',
    icon: Home,
    description: 'Apartments, condos, multi-unit buildings'
  },
  {
    id: 'residential-flip',
    name: 'Residential Flip',
    icon: Hammer,
    description: 'Single-family fix & flip projects'
  },
  {
    id: 'vacant-land',
    name: 'Vacant Land',
    icon: TreePine,
    description: 'Undeveloped land & development sites'
  }
];