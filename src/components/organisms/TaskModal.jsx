import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import { taskService } from "@/services/api/taskService";

const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    assignedTo: "",
    dueDate: ""
  });
  const [loading, setLoading] = useState(false);

  const teamMembers = [
    "Sarah Chen",
    "Alex Rodriguez", 
    "Mike Johnson",
    "Jennifer Liu",
    "David Park"
  ];

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "pending",
        assignedTo: task.assignedTo || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
        assignedTo: "",
        dueDate: ""
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
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter task title"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
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
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Assigned To"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                  >
                    <option value="">Select team member</option>
                    {teamMembers.map(member => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
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