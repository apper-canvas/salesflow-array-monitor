import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import { leadService } from "@/services/api/leadService";
import { contactService } from "@/services/api/contactService";

const LeadModal = ({ isOpen, onClose, lead, onSave }) => {
  const [formData, setFormData] = useState({
    contactId: "",
    status: "new",
    score: 50,
    source: "",
    assignedTo: "Sales Manager"
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (lead) {
setFormData({
        contactId: lead.contactId || "",
        status: lead.status || "new",
        score: lead.score || 50,
        source: lead.source || "",
        assignedTo: lead.assignedTo || "Sales Manager"
      });
    } else {
      setFormData({
        contactId: "",
        status: "new",
        score: 50,
        source: "",
        assignedTo: "Sales Manager"
      });
    }
  }, [lead]);

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (err) {
      toast.error("Failed to load contacts");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let savedLead;
      if (lead) {
        savedLead = await leadService.update(lead.Id, formData);
        toast.success("Lead updated successfully");
      } else {
        savedLead = await leadService.create(formData);
        toast.success("Lead created successfully");
      }

      onSave?.(savedLead);
      onClose();
    } catch (err) {
      toast.error(lead ? "Failed to update lead" : "Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <Card className="border-0 shadow-none">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {lead ? "Edit Lead" : "Add New Lead"}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    icon="X"
                  />
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <Select
                  label="Contact"
                  name="contactId"
                  value={formData.contactId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a contact</option>
                  {contacts.map(contact => (
                    <option key={contact.Id} value={contact.Id}>
                      {contact.name} - {contact.email}
                    </option>
                  ))}
                </Select>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="new">New</option>
                    <option value="qualified">Qualified</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </Select>

                  <Input
                    label="Lead Score"
                    name="score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.score}
                    onChange={handleChange}
                    placeholder="Enter lead score (0-100)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Source"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    placeholder="e.g., Website, Referral, Cold Call"
                  />

                  <Input
                    label="Assigned To"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    placeholder="Enter assignee name"
                  />
                </div>
              </CardContent>

              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                >
                  {lead ? "Update Lead" : "Create Lead"}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadModal;