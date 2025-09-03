import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent } from "@/components/atoms/Card";

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

<Card className="p-12">
          <CardContent className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Archive" className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pipeline Feature Removed
                </h3>
                <p className="text-gray-600 max-w-md">
                  The deals pipeline functionality has been removed from the application. 
                  Please use the Contacts and Leads sections to manage your customer relationships.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Pipeline;