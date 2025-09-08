import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import CompanyTable from "@/components/organisms/CompanyTable";
import CompanyModal from "@/components/organisms/CompanyModal";
import Button from "@/components/atoms/Button";

const Companies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  const handleCompanySave = () => {
    setRefreshKey(prev => prev + 1);
    handleModalClose();
  };

  const headerActions = (
    <Button icon="Plus" onClick={handleAddCompany}>
      Add Company
    </Button>
  );

  return (
    <Layout
      title="Companies"
      onSearch={handleSearch}
      headerActions={headerActions}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Company Management</h2>
            <p className="text-gray-600">
              Manage your business relationships and company information.
            </p>
          </div>
        </div>

        <CompanyTable
          key={refreshKey}
          searchQuery={searchQuery}
          onCompanySelect={handleCompanySelect}
          onAddCompany={handleAddCompany}
        />

        <CompanyModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          company={selectedCompany}
          onSave={handleCompanySave}
        />
      </div>
    </Layout>
  );
};

export default Companies;