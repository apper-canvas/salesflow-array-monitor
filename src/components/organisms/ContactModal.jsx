import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import FileUpload from "@/components/molecules/FileUpload";
import AttachmentList from "@/components/molecules/AttachmentList";
const ContactModal = ({ isOpen, onClose, contact, onSave }) => {
const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: null,
    tags: "",
    notes: ""
  });
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [attachmentRefresh, setAttachmentRefresh] = useState(0);
const [loading, setLoading] = useState(false);

  // Load companies for dropdown
  useEffect(() => {
    const loadCompanies = async () => {
      setLoadingCompanies(true);
      try {
        const companiesData = await companyService.getAll();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error loading companies:', error);
        toast.error('Failed to load companies');
      } finally {
        setLoadingCompanies(false);
      }
    };
    
    loadCompanies();
  }, []);
useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || null,
        tags: contact.tags ? contact.tags.join(", ") : "",
        notes: contact.notes || ""
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: null,
        tags: "",
        notes: ""
      });
    }
  }, [contact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contactData = {
...formData,
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : []
      };

      let savedContact;
      if (contact) {
        savedContact = await contactService.update(contact.Id, contactData);
        toast.success("Contact updated successfully");
      } else {
        savedContact = await contactService.create(contactData);
        toast.success("Contact created successfully");
      }

      onSave?.(savedContact);
      onClose();
    } catch (err) {
      toast.error(contact ? "Failed to update contact" : "Failed to create contact");
    } finally {
      setLoading(false);
    }
  };

const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'company') {
      // Find the selected company object
      const selectedCompany = companies.find(company => company.Id === parseInt(value));
      setFormData(prev => ({ ...prev, [name]: selectedCompany || null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAttachmentUpload = () => {
    setAttachmentRefresh(prev => prev + 1);
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
                    {contact ? "Edit Contact" : "Add New Contact"}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />

<Select
                    label="Company"
                    name="company"
                    value={formData.company?.Id || ''}
                    onChange={handleChange}
                    disabled={loadingCompanies}
                  >
                    <option value="">Select a company...</option>
                    {companies.map((company) => (
                      <option key={company.Id} value={company.Id}>
                        {company.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <Input
                  label="Tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Enter tags separated by commas"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter any additional notes..."
                  />
                </div>
{/* File Attachments Section */}
                <div className="space-y-4 pt-6 border-t">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Paperclip" className="h-5 w-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Attachments</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <FileUpload 
                      entityType="contact"
                      entityId={contact?.Id}
                      onUploadComplete={handleAttachmentUpload}
                    />
                    <AttachmentList 
                      entityType="contact"
                      entityId={contact?.Id}
                      refreshTrigger={attachmentRefresh}
                    />
                  </div>
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
                  {contact ? "Update Contact" : "Create Contact"}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;