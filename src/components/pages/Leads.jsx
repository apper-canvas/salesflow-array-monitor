import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import LeadBoard from "@/components/organisms/LeadBoard";
import LeadModal from "@/components/organisms/LeadModal";
import Button from "@/components/atoms/Button";

const Leads = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleLeadSave = () => {
    setRefreshKey(prev => prev + 1);
    handleModalClose();
  };

  const headerActions = (
    <Button icon="Plus" onClick={handleAddLead}>
      Add Lead
    </Button>
  );

  return (
    <Layout
      title="Leads"
      showSearch={false}
      headerActions={headerActions}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
            <p className="text-gray-600">
              Track and nurture your potential customers through the sales funnel.
            </p>
          </div>
        </div>

        <LeadBoard
          key={refreshKey}
          onLeadSelect={handleLeadSelect}
          onAddLead={handleAddLead}
        />

        <LeadModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          lead={selectedLead}
          onSave={handleLeadSave}
        />
      </div>
    </Layout>
  );
};

export default Leads;