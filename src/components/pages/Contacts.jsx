import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import ContactTable from "@/components/organisms/ContactTable";
import ContactModal from "@/components/organisms/ContactModal";
import Button from "@/components/atoms/Button";

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleContactSave = () => {
    setRefreshKey(prev => prev + 1);
    handleModalClose();
  };

  const headerActions = (
    <Button icon="Plus" onClick={handleAddContact}>
      Add Contact
    </Button>
  );

  return (
    <Layout
      title="Contacts"
      onSearch={handleSearch}
      headerActions={headerActions}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contact Management</h2>
            <p className="text-gray-600">
              Manage your customer relationships and contact information.
            </p>
          </div>
        </div>

        <ContactTable
          key={refreshKey}
          searchQuery={searchQuery}
          onContactSelect={handleContactSelect}
          onAddContact={handleAddContact}
        />

        <ContactModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          contact={selectedContact}
          onSave={handleContactSave}
        />
      </div>
    </Layout>
  );
};

export default Contacts;