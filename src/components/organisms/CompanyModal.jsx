import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { companyService } from "@/services/api/companyService";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";

const CompanyModal = ({ isOpen, onClose, company, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    industry: "",
    numberOfEmployees: "",
    annualRevenue: "",
    description: "",
    tags: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        address: company.address || "",
        phone: company.phone || "",
        email: company.email || "",
        website: company.website || "",
        industry: company.industry || "",
        numberOfEmployees: company.numberOfEmployees?.toString() || "",
        annualRevenue: company.annualRevenue?.toString() || "",
        description: company.description || "",
        tags: company.tags ? company.tags.join(", ") : ""
      });
    } else {
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        industry: "",
        numberOfEmployees: "",
        annualRevenue: "",
        description: "",
        tags: ""
      });
    }
  }, [company]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const companyData = {
        ...formData,
        numberOfEmployees: formData.numberOfEmployees ? parseInt(formData.numberOfEmployees) : 0,
        annualRevenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : 0,
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : []
      };

      let savedCompany;
      if (company) {
        savedCompany = await companyService.update(company.Id, companyData);
        toast.success("Company updated successfully");
      } else {
        savedCompany = await companyService.create(companyData);
        toast.success("Company created successfully");
      }

      onSave?.(savedCompany);
      onClose();
    } catch (err) {
      toast.error(company ? "Failed to update company" : "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const industryOptions = companyService.getIndustryOptions().map(industry => ({
    value: industry,
    label: industry
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <Card className="border-0 shadow-none">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {company ? "Edit Company" : "Add New Company"}
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
                    label="Company Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter company name"
                  />

                  <Select
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    options={industryOptions}
                    placeholder="Select industry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter company address..."
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

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>

                <Input
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Enter website URL"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Number of Employees"
                    name="numberOfEmployees"
                    type="number"
                    min="0"
                    value={formData.numberOfEmployees}
                    onChange={handleChange}
                    placeholder="Enter number of employees"
                  />

                  <Input
                    label="Annual Revenue ($)"
                    name="annualRevenue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.annualRevenue}
                    onChange={handleChange}
                    placeholder="Enter annual revenue"
                  />
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
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter company description..."
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
                  {company ? "Update Company" : "Create Company"}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;