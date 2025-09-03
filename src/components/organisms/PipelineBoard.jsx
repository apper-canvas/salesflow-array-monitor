import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { format } from "date-fns";

const pipelineStages = [
  { id: "prospect", title: "Prospect", color: "bg-gray-50 border-gray-200" },
  { id: "qualified", title: "Qualified", color: "bg-blue-50 border-blue-200" },
  { id: "proposal", title: "Proposal", color: "bg-yellow-50 border-yellow-200" },
  { id: "negotiation", title: "Negotiation", color: "bg-purple-50 border-purple-200" },
  { id: "closed-won", title: "Closed Won", color: "bg-green-50 border-green-200" },
];

const PipelineBoard = ({ onDealSelect, onAddDeal }) => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedDeal, setDraggedDeal] = useState(null);

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

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    
    if (!draggedDeal || draggedDeal.stage === newStage) {
      setDraggedDeal(null);
      return;
    }

    try {
const updatedDeal = await dealService.update(draggedDeal.Id, {
        ...draggedDeal,
        stage: newStage
      });

      setDeals(deals.map(deal => 
        deal.Id === draggedDeal.Id ? updatedDeal : deal
      ));

      toast.success(`Deal moved to ${newStage.replace("-", " ")}`);
    } catch (err) {
      toast.error("Failed to update deal stage");
    }

    setDraggedDeal(null);
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
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {pipelineStages.map((stage) => {
        const stageDeals = deals.filter(deal => deal.stage === stage.id);
        const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
        
        return (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <Card className={`${stage.color} h-full`}>
              <CardHeader>
                <CardTitle className="text-lg">
                  <div className="flex items-center justify-between">
                    {stage.title}
                    <Badge variant="outline">
                      {stageDeals.length}
                    </Badge>
                  </div>
                  {stageValue > 0 && (
                    <p className="text-sm font-normal text-gray-600 mt-1">
                      {formatCurrency(stageValue)} total value
                    </p>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {stageDeals.map((deal) => (
                  <Card
                    key={deal.Id}
                    className="p-4 bg-white cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    onClick={() => onDealSelect?.(deal)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {deal.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {getContactName(deal.contactId)}
                          </p>
                        </div>
                        <div className="flex space-x-1">
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
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-primary-600">
                          {formatCurrency(deal.value)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <div className="w-8 h-2 bg-gray-200 rounded-full mr-2">
                            <div 
                              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>
                          <span>{deal.probability}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <ApperIcon name="User" className="h-3 w-3 mr-1" />
                          {deal.assignedTo}
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
                          {format(new Date(deal.expectedCloseDate), "MMM d")}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Inbox" className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No deals in this stage</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineBoard;