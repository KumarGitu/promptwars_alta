import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { UniversalInputCenter } from './pages/UniversalInputCenter';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { CasesListPage } from './pages/CasesListPage';
import { VerificationCenterPage } from './pages/VerificationCenterPage';
import { ActionPlansPage } from './pages/ActionPlansPage';
import { CommunityResourcesPage } from './pages/CommunityResourcesPage';
import { ImpactDashboardPage } from './pages/ImpactDashboardPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-flood-001');

  // Handle URL hash or browser history if desired
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('case/')) {
        const id = hash.split('/')[1];
        if (id) {
          setSelectedCaseId(id);
          setCurrentPage('case-detail');
        }
      } else if (hash) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (page: string) => {
    window.location.hash = `#/${page}`;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    window.location.hash = `#/case/${caseId}`;
    setCurrentPage('case-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLanding = currentPage === 'landing';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {/* Sidebar on inner dashboard/workspace views */}
        {!isLanding && (
          <Sidebar
            currentPage={currentPage}
            onNavigate={navigateTo}
            onOpenPrimaryDemo={() => openCase('case-flood-001')}
          />
        )}

        {/* Content Area */}
        <main className={`flex-1 w-full ${!isLanding ? 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto' : ''}`}>
          {currentPage === 'landing' && (
            <LandingPage onNavigate={navigateTo} onOpenCase={openCase} />
          )}

          {currentPage === 'dashboard' && (
            <DashboardOverview onNavigate={navigateTo} onOpenCase={openCase} />
          )}

          {currentPage === 'input' && (
            <UniversalInputCenter
              onCaseCreated={(newId) => openCase(newId)}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === 'cases' && (
            <CasesListPage onOpenCase={openCase} onNavigate={navigateTo} />
          )}

          {currentPage === 'case-detail' && (
            <CaseDetailPage
              caseId={selectedCaseId}
              onBack={() => navigateTo('cases')}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === 'verification' && (
            <VerificationCenterPage onOpenCase={openCase} />
          )}

          {currentPage === 'actions' && (
            <ActionPlansPage onOpenCase={openCase} />
          )}

          {currentPage === 'resources' && <CommunityResourcesPage />}

          {currentPage === 'impact' && <ImpactDashboardPage />}

          {currentPage === 'settings' && (
            <SettingsPage onResetComplete={() => openCase('case-flood-001')} />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default App;
