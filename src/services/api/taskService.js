import { toast } from "react-toastify";
import tasksData from "@/services/mockData/tasks.json";

// Mock delay to simulate API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await delay(300);
    try {
      return this.tasks.map(task => ({ ...task }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Failed to fetch tasks");
    }
  }

  async getById(id) {
    await delay(200);
    try {
      const task = this.tasks.find(t => t.Id === parseInt(id));
      if (!task) {
        throw new Error("Task not found");
      }
      return { ...task };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    await delay(400);
    try {
      const newTask = {
        Id: Date.now(),
        title: taskData.title || "",
        description: taskData.description || "",
        priority: taskData.priority || "medium",
        status: taskData.status || "pending",
        assignedTo: taskData.assignedTo || "",
        dueDate: taskData.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.tasks.unshift(newTask);
      return { ...newTask };
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Failed to create task");
    }
  }

  async update(id, taskData) {
    await delay(400);
    try {
      const index = this.tasks.findIndex(t => t.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Task not found");
      }

      const updatedTask = {
        ...this.tasks[index],
        ...taskData,
        updatedAt: new Date().toISOString()
      };

      this.tasks[index] = updatedTask;
      return { ...updatedTask };
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    await delay(300);
    try {
      const index = this.tasks.findIndex(t => t.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Task not found");
      }

      const deletedTask = this.tasks.splice(index, 1)[0];
      return { ...deletedTask };
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }

  async getByStatus(status) {
    await delay(250);
    try {
      return this.tasks
        .filter(task => task.status === status)
        .map(task => ({ ...task }));
    } catch (error) {
      console.error(`Error fetching tasks by status ${status}:`, error);
      throw new Error("Failed to fetch tasks by status");
    }
  }

  async getByPriority(priority) {
    await delay(250);
    try {
      return this.tasks
        .filter(task => task.priority === priority)
        .map(task => ({ ...task }));
    } catch (error) {
      console.error(`Error fetching tasks by priority ${priority}:`, error);
      throw new Error("Failed to fetch tasks by priority");
    }
  }
}

export const taskService = new TaskService();