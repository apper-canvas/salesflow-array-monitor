import activitiesData from "@/services/mockData/activities.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await delay(300);
    return [...this.activities];
  }

  async getById(id) {
    await delay(200);
    const activity = this.activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  }

  async create(activityData) {
    await delay(500);
    const newActivity = {
      Id: Math.max(...this.activities.map(a => a.Id)) + 1,
      ...activityData,
      entityId: parseInt(activityData.entityId),
      createdAt: new Date().toISOString()
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await delay(400);
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    this.activities[index] = {
      ...this.activities[index],
      ...activityData,
      Id: parseInt(id),
      entityId: parseInt(activityData.entityId)
    };
    return { ...this.activities[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    this.activities.splice(index, 1);
    return true;
  }
}

export const activityService = new ActivityService();