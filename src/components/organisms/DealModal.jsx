import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";

const DealModal = ({ isOpen, onClose, deal, onSave }) => {
  const [formData, setFormData] = useState({
    contactId: "",
    title: "",
    value: "",
    stage: "prospect",
    probability: 25,
    expectedCloseDate: "",
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
    if (deal) {
      setFormData({
        contactId: deal.contactId || "",
        title: deal.title || "",
        value: deal.value || "",
        stage: deal.stage || "prospect",
        probability: deal.probability || 25,
        expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split("T")[0] : "",
        assignedTo: deal.assignedTo || "Sales Manager"
      });
    } else {
      setFormData({
        contactId: "",
        title: "",
        value: "",
        stage: "prospect",
        probability: 25,
        expectedCloseDate: "",
        assignedTo: "Sales Manager"
      });
    }
  }, [deal]);

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
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability)
      };

      let savedDeal;
      if (deal) {
        savedDeal = await dealService.update(deal.Id, dealData);
        toast.success("Deal updated successfully");
      } else {
        savedDeal = await dealService.create(dealData);
        toast.success("Deal created successfully");
      }

      onSave?.(savedDeal);
      onClose();
    } catch (err) {
      toast.error(deal ? "Failed to update deal" : "Failed to create deal");
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
                    {deal ? "Edit Deal" : "Add New Deal"}
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
                      {contact.name} - {contact.company}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Deal Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter deal title"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Deal Value"
                    name="value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.value}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                  />

                  <Select
                    label="Stage"
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    required
                  >
                    <option value="prospect">Prospect</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closed-won">Closed Won</option>
                    <option value="closed-lost">Closed Lost</option>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Probability (%)"
                    name="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={handleChange}
                    placeholder="25"
                  />

                  <Input
                    label="Expected Close Date"
                    name="expectedCloseDate"
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label="Assigned To"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  placeholder="Enter assignee name"
                />
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
                  {deal ? "Update Deal" : "Create Deal"}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DealModal;