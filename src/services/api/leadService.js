import leadsData from "@/services/mockData/leads.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LeadService {
  constructor() {
    this.leads = [...leadsData];
  }

  async getAll() {
    await delay(300);
    return [...this.leads];
  }

  async getById(id) {
    await delay(200);
    const lead = this.leads.find(l => l.Id === parseInt(id));
    if (!lead) {
      throw new Error("Lead not found");
    }
    return { ...lead };
  }

  async create(leadData) {
    await delay(500);
    const newLead = {
      Id: Math.max(...this.leads.map(l => l.Id)) + 1,
      ...leadData,
      contactId: parseInt(leadData.contactId),
      score: parseInt(leadData.score),
      createdAt: new Date().toISOString()
    };
    this.leads.push(newLead);
    return { ...newLead };
  }

  async update(id, leadData) {
    await delay(400);
    const index = this.leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Lead not found");
    }
    
    this.leads[index] = {
      ...this.leads[index],
      ...leadData,
      Id: parseInt(id),
      contactId: parseInt(leadData.contactId),
      score: parseInt(leadData.score)
    };
    return { ...this.leads[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Lead not found");
    }
    
    this.leads.splice(index, 1);
    return true;
  }
}

export const leadService = new LeadService();