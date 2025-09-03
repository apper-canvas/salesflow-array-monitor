import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import TaskModal from "@/components/organisms/TaskModal";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { format, isBefore, isToday } from "date-fns";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const loadTasks = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await taskService.getAll();
      setTasks(data);
      setFilteredTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (statusFilter !== "all") {
      if (statusFilter === "overdue") {
        filtered = filtered.filter(task => 
          task.status !== 'completed' && 
          task.dueDate && 
          isBefore(new Date(task.dueDate), new Date()) &&
          !isToday(new Date(task.dueDate))
        );
      } else {
        filtered = filtered.filter(task => task.status === statusFilter);
      }
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, priorityFilter]);

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(id);
      setTasks(tasks.filter(task => task.Id !== id));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleSaveTask = (savedTask) => {
    if (selectedTask) {
      setTasks(tasks.map(task => 
        task.Id === savedTask.Id ? savedTask : task
      ));
    } else {
      setTasks([savedTask, ...tasks]);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "success";
      case "in-progress": return "primary";
      case "pending": return "secondary";
      case "overdue": return "danger";
      default: return "default";
    }
  };

  const isOverdue = (task) => {
    return task.status !== 'completed' && 
           task.dueDate && 
           isBefore(new Date(task.dueDate), new Date()) &&
           !isToday(new Date(task.dueDate));
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return "No due date";
    const date = new Date(dueDate);
    if (isToday(date)) return "Today";
    return format(date, "MMM d, yyyy");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <Layout title="Tasks" showSearch={false}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </Select>

            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </Select>
          </div>

          <Button onClick={handleAddTask} icon="Plus">
            Add Task
          </Button>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <Empty
            title="No tasks found"
            description="Create your first task to start managing your work efficiently."
            actionLabel="Add Task"
            onAction={handleAddTask}
            icon="CheckSquare"
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr 
                      key={task.Id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {task.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {task.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getPriorityColor(task.priority)} className="capitalize">
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={isOverdue(task) ? "danger" : getStatusColor(task.status)} 
                          className="capitalize"
                        >
                          {isOverdue(task) ? "Overdue" : task.status.replace("-", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {task.assignedTo ? task.assignedTo.charAt(0).toUpperCase() : "?"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {task.assignedTo || "Unassigned"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${isOverdue(task) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {formatDueDate(task.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            icon="Edit"
                            onClick={() => handleEditTask(task)}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            icon="Trash2"
                            onClick={() => handleDeleteTask(task.Id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
          onSave={handleSaveTask}
        />
      </div>
    </Layout>
  );
};

export default Tasks;