import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Header from '../Header';

export default function AppLayout({ currentTab, setCurrentTab, children, onAddTransactionClick, isAdminView, AdminSidebar: AdminSidebarComp }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar Nav */}
      {isAdminView ? (
        AdminSidebarComp
      ) : (
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
      )}

      {/* Main layout views */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          currentTab={currentTab} 
          setSidebarOpen={setSidebarOpen} 
          onAddTransactionClick={onAddTransactionClick} 
          isAdminView={isAdminView}
        />

        {/* Dynamic page contents wrapper */}
        <main className="flex-1 p-6 overflow-y-auto bg-[var(--bg-main)] transition-all">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
