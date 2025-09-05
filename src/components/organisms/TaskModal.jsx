import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import { taskService } from "@/services/api/taskService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { leadService } from "@/services/api/leadService";
const TaskModal = ({ isOpen, onClose, task, onSave }) => {
const [formData, setFormData] = useState({
    Name: "",
    description_c: "",
    priority: "medium",
    status_c: "Not Started",
    related_to_contact_c: "",
    related_to_lead_c: "",
    related_to_deal_c: "",
    due_date_c: ""
  });
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

useEffect(() => {
    const loadLookupData = async () => {
      try {
        setLoadingLookups(true);
        const [contactsData, dealsData, leadsData] = await Promise.all([
          contactService.getAll(),
          dealService.getAll(),
          leadService.getAll()
        ]);
        setContacts(contactsData);
        setDeals(dealsData);
        setLeads(leadsData);
      } catch (error) {
        console.error("Error loading lookup data:", error);
        toast.error("Failed to load related data");
      } finally {
        setLoadingLookups(false);
      }
    };

    if (isOpen) {
      loadLookupData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (task) {
      setFormData({
        Name: task.Name || "",
        description_c: task.description_c || "",
        priority: "medium", // UI-only field
        status_c: task.status_c || "Not Started",
        related_to_contact_c: task.related_to_contact_c?.Id || "",
        related_to_lead_c: task.related_to_lead_c?.Id || "",
        related_to_deal_c: task.related_to_deal_c?.Id || "",
        due_date_c: task.due_date_c ? task.due_date_c.split("T")[0] : ""
      });
    } else {
      setFormData({
        Name: "",
        description_c: "",
        priority: "medium", // UI-only field
        status_c: "Not Started",
        related_to_contact_c: "",
        related_to_lead_c: "",
        related_to_deal_c: "",
        due_date_c: ""
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let savedTask;
      if (task) {
        savedTask = await taskService.update(task.Id, formData);
        toast.success("Task updated successfully");
      } else {
        savedTask = await taskService.create(formData);
        toast.success("Task created successfully");
      }

      onSave?.(savedTask);
      onClose();
    } catch (err) {
      toast.error(task ? "Failed to update task" : "Failed to create task");
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
                    {task ? "Edit Task" : "Add New Task"}
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
<Input
                  label="Task Title"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                  placeholder="Enter task title"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
<textarea
                    name="description_c"
                    value={formData.description_c}
                    onChange={handleChange}
                    rows={3}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                    placeholder="Enter task description"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </Select>

<Select
                    label="Status"
                    name="status_c"
                    value={formData.status_c}
                    onChange={handleChange}
                    required
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Deferred">Deferred</option>
                  </Select>
                </div>

<Input
                  label="Due Date"
                  name="due_date_c"
                  type="date"
                  value={formData.due_date_c}
                  onChange={handleChange}
                />

                {/* Lookup Fields Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 border-b pb-2">Related Records</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select
                      label="Related Contact"
                      name="related_to_contact_c"
                      value={formData.related_to_contact_c}
                      onChange={handleChange}
                      disabled={loadingLookups}
                    >
                      <option value="">Select Contact</option>
                      {contacts.map(contact => (
                        <option key={contact.Id} value={contact.Id}>
                          {contact.name || contact.email || `Contact ${contact.Id}`}
                        </option>
                      ))}
                    </Select>

                    <Select
                      label="Related Deal"
                      name="related_to_deal_c"
                      value={formData.related_to_deal_c}
                      onChange={handleChange}
                      disabled={loadingLookups}
                    >
                      <option value="">Select Deal</option>
                      {deals.map(deal => (
                        <option key={deal.Id} value={deal.Id}>
                          {deal.title || `Deal ${deal.Id}`} - ${deal.value ? `$${deal.value.toLocaleString()}` : 'No Value'}
                        </option>
                      ))}
                    </Select>

                    <Select
                      label="Related Lead"
                      name="related_to_lead_c"
                      value={formData.related_to_lead_c}
                      onChange={handleChange}
                      disabled={loadingLookups}
                    >
                      <option value="">Select Lead</option>
                      {leads.map(lead => (
                        <option key={lead.Id} value={lead.Id}>
                          Lead {lead.Id} - {lead.status || 'No Status'} ({lead.score || 0}% Score)
                        </option>
                      ))}
                    </Select>
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
                  {task ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;