import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealModal from "@/components/organisms/DealModal";
import Button from "@/components/atoms/Button";

const Pipeline = () => {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
      title="Sales Pipeline"
      showSearch={false}
      headerActions={headerActions}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sales Pipeline</h2>
            <p className="text-gray-600">
              Visualize and manage your deals through each stage of the sales process.
            </p>
          </div>
        </div>

        <PipelineBoard
          key={refreshKey}
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

export default Pipeline;