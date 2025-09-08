import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { companyService } from "@/services/api/companyService";
import { format } from "date-fns";

const CompanyTable = ({ searchQuery, onCompanySelect, onAddCompany }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCompanies = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleDeleteCompany = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    try {
      await companyService.delete(id);
      setCompanies(companies.filter(company => company.Id !== id));
      toast.success("Company deleted successfully");
    } catch (err) {
      toast.error("Failed to delete company");
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatEmployees = (count) => {
    if (!count || count === 0) return "N/A";
    return count.toLocaleString();
  };

  const filteredCompanies = companies.filter(company =>
    !searchQuery || 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;
  if (companies.length === 0) {
    return (
      <Empty
        title="No companies found"
        description="Start building your business network by adding your first company."
        actionLabel="Add Company"
        onAction={onAddCompany}
        icon="Building"
      />
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Industry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size & Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCompanies.map((company) => (
              <tr 
                key={company.Id} 
                className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => onCompanySelect?.(company)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center">
                        <ApperIcon name="Building" className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {company.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {company.website || "No website"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {company.industry && (
                    <Badge variant="outline" className="text-xs">
                      {company.industry}
                    </Badge>
                  )}
                  {!company.industry && (
                    <span className="text-sm text-gray-500">Not specified</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatEmployees(company.numberOfEmployees)} employees
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(company.annualRevenue)} revenue
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{company.email || "No email"}</div>
                  <div className="text-sm text-gray-500">{company.phone || "No phone"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCompanySelect?.(company);
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Trash2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCompany(company.Id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CompanyTable;