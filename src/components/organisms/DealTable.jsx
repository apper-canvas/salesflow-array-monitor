import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { format } from "date-fns";

const DealTable = ({ searchQuery, onDealSelect, onAddDeal }) => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : "Unknown Contact";
  };

  const getContactCompany = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.company : "";
  };

  const handleDeleteDeal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) {
      return;
    }

    try {
      await dealService.delete(id);
      setDeals(deals.filter(deal => deal.Id !== id));
      toast.success("Deal deleted successfully");
    } catch (err) {
      toast.error("Failed to delete deal");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const filteredDeals = deals.filter(deal =>
    !searchQuery || 
    deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getContactName(deal.contactId).toLowerCase().includes(searchQuery.toLowerCase()) ||
    getContactCompany(deal.contactId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (deals.length === 0) {
    return (
      <Empty
        title="No deals found"
        description="Start tracking your sales opportunities by adding your first deal."
        actionLabel="Add Deal"
        onAction={onAddDeal}
        icon="DollarSign"
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
                Deal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Probability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Close Date
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDeals.map((deal) => (
              <tr 
                key={deal.Id} 
                className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => onDealSelect?.(deal)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-accent-400 to-emerald-400 flex items-center justify-center">
                        <ApperIcon name="DollarSign" className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {deal.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {deal.assignedTo}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getContactName(deal.contactId)}</div>
                  <div className="text-sm text-gray-500">{getContactCompany(deal.contactId)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-primary-600">
                    {formatCurrency(deal.value)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={deal.stage} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
                        style={{ width: `${deal.probability}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {deal.probability}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(deal.expectedCloseDate), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDealSelect?.(deal);
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Trash2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDeal(deal.Id);
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

export default DealTable;