import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { leadService } from "@/services/api/leadService";
import { contactService } from "@/services/api/contactService";
import { format } from "date-fns";

const leadStatuses = [
  { id: "new", title: "New Leads", color: "bg-blue-50 border-blue-200" },
  { id: "qualified", title: "Qualified", color: "bg-yellow-50 border-yellow-200" },
  { id: "contacted", title: "Contacted", color: "bg-purple-50 border-purple-200" },
  { id: "converted", title: "Converted", color: "bg-green-50 border-green-200" }
];

const LeadBoard = ({ onLeadSelect, onAddLead }) => {
  const [leads, setLeads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedLead, setDraggedLead] = useState(null);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [leadsData, contactsData] = await Promise.all([
        leadService.getAll(),
        contactService.getAll()
      ]);
      setLeads(leadsData);
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

  const getContactEmail = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.email : "";
  };

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedLead || draggedLead.status === newStatus) {
      setDraggedLead(null);
      return;
    }

    try {
const updatedLead = await leadService.update(draggedLead.Id, {
        ...draggedLead,
        status: newStatus
      });

      setLeads(leads.map(lead => 
        lead.Id === draggedLead.Id ? updatedLead : lead
      ));

      toast.success(`Lead moved to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update lead status");
    }

    setDraggedLead(null);
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {
      await leadService.delete(id);
      setLeads(leads.filter(lead => lead.Id !== id));
      toast.success("Lead deleted successfully");
    } catch (err) {
      toast.error("Failed to delete lead");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (leads.length === 0) {
    return (
      <Empty
        title="No leads found"
        description="Start capturing potential customers by adding your first lead."
        actionLabel="Add Lead"
        onAction={onAddLead}
        icon="UserPlus"
      />
    );
  }

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {leadStatuses.map((status) => {
        const statusLeads = leads.filter(lead => lead.status === status.id);
        
        return (
          <div
            key={status.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            <Card className={`${status.color} h-full`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  {status.title}
                  <Badge variant="outline" className="ml-2">
                    {statusLeads.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {statusLeads.map((lead) => (
                  <Card
                    key={lead.Id}
                    className="p-4 bg-white cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onClick={() => onLeadSelect?.(lead)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {getContactName(lead.contactId)}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {getContactEmail(lead.contactId)}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            icon="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLeadSelect?.(lead);
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            icon="Trash2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLead(lead.Id);
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Star" className="h-4 w-4 text-yellow-500" />
                          <span className="text-gray-600">Score: {lead.score}/100</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {lead.source}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <ApperIcon name="User" className="h-3 w-3 mr-1" />
                          {lead.assignedTo}
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
                          {format(new Date(lead.createdAt), "MMM d")}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {statusLeads.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Inbox" className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No leads in this stage</p>
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

export default LeadBoard;