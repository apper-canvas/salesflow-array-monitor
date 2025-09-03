import dealsData from "@/services/mockData/deals.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async getAll() {
    await delay(300);
    return [...this.deals];
  }

  async getById(id) {
    await delay(200);
    const deal = this.deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  }

  async create(dealData) {
    await delay(500);
    const newDeal = {
      Id: Math.max(...this.deals.map(d => d.Id)) + 1,
      ...dealData,
      contactId: parseInt(dealData.contactId),
      value: parseFloat(dealData.value),
      probability: parseInt(dealData.probability),
      createdAt: new Date().toISOString()
    };
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await delay(400);
    const index = this.deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    this.deals[index] = {
      ...this.deals[index],
      ...dealData,
      Id: parseInt(id),
      contactId: parseInt(dealData.contactId),
      value: parseFloat(dealData.value),
      probability: parseInt(dealData.probability)
    };
    return { ...this.deals[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    this.deals.splice(index, 1);
    return true;
  }
}

export const dealService = new DealService();