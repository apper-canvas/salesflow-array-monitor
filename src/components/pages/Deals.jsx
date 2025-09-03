import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import DealTable from "@/components/organisms/DealTable";
import DealModal from "@/components/organisms/DealModal";
import Button from "@/components/atoms/Button";

const Deals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDealSelect = (deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };

  const handleDealSave = () => {
    setRefreshKey(prev => prev + 1);
    handleModalClose();
  };

  const headerActions = (
    <Button icon="Plus" onClick={handleAddDeal}>
      Add Deal
    </Button>
  );

  return (
    <Layout
      title="Deals"
      onSearch={handleSearch}
      headerActions={headerActions}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Deal Management</h2>
            <p className="text-gray-600">
              Track and manage your sales opportunities and revenue pipeline.
            </p>
          </div>
        </div>

        <DealTable
          key={refreshKey}
          searchQuery={searchQuery}
          onDealSelect={handleDealSelect}
          onAddDeal={handleAddDeal}
        />

        <DealModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          deal={selectedDeal}
          onSave={handleDealSave}
        />
      </div>
    </Layout>
  );
};

export default Deals;