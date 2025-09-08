import { toast } from 'react-toastify';

class CompanyService {
  constructor() {
    this.tableName = 'company_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "number_of_employees_c"}},
          {"field": {"Name": "annual_revenue_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch companies: ${response.message}`);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(company => ({
        Id: company.Id,
        name: company.name_c || company.Name || '',
        address: company.address_c || '',
        phone: company.phone_c || '',
        email: company.email_c || '',
        website: company.website_c || '',
        industry: company.industry_c || '',
        numberOfEmployees: company.number_of_employees_c || 0,
        annualRevenue: company.annual_revenue_c || 0,
        description: company.description_c || '',
        tags: company.Tags ? company.Tags.split(',').map(tag => tag.trim()) : [],
        createdAt: company.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "number_of_employees_c"}},
          {"field": {"Name": "annual_revenue_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.data) {
        return null;
      }

      const company = response.data;
      return {
        Id: company.Id,
        name: company.name_c || company.Name || '',
        address: company.address_c || '',
        phone: company.phone_c || '',
        email: company.email_c || '',
        website: company.website_c || '',
        industry: company.industry_c || '',
        numberOfEmployees: company.number_of_employees_c || 0,
        annualRevenue: company.annual_revenue_c || 0,
        description: company.description_c || '',
        tags: company.Tags ? company.Tags.split(',').map(tag => tag.trim()) : [],
        createdAt: company.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(companyData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: companyData.name || '',
          name_c: companyData.name || '',
          address_c: companyData.address || '',
          phone_c: companyData.phone || '',
          email_c: companyData.email || '',
          website_c: companyData.website || '',
          industry_c: companyData.industry || '',
          number_of_employees_c: parseInt(companyData.numberOfEmployees) || 0,
          annual_revenue_c: parseFloat(companyData.annualRevenue) || 0,
          description_c: companyData.description || '',
          Tags: Array.isArray(companyData.tags) ? companyData.tags.join(',') : (companyData.tags || '')
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create company: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} companies:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdCompany = successful[0].data;
          return {
            Id: createdCompany.Id,
            name: createdCompany.name_c || createdCompany.Name || '',
            address: createdCompany.address_c || '',
            phone: createdCompany.phone_c || '',
            email: createdCompany.email_c || '',
            website: createdCompany.website_c || '',
            industry: createdCompany.industry_c || '',
            numberOfEmployees: createdCompany.number_of_employees_c || 0,
            annualRevenue: createdCompany.annual_revenue_c || 0,
            description: createdCompany.description_c || '',
            tags: createdCompany.Tags ? createdCompany.Tags.split(',').map(tag => tag.trim()) : [],
            createdAt: createdCompany.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, companyData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: companyData.name || '',
          name_c: companyData.name || '',
          address_c: companyData.address || '',
          phone_c: companyData.phone || '',
          email_c: companyData.email || '',
          website_c: companyData.website || '',
          industry_c: companyData.industry || '',
          number_of_employees_c: parseInt(companyData.numberOfEmployees) || 0,
          annual_revenue_c: parseFloat(companyData.annualRevenue) || 0,
          description_c: companyData.description || '',
          Tags: Array.isArray(companyData.tags) ? companyData.tags.join(',') : (companyData.tags || '')
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update company: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} companies:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedCompany = successful[0].data;
          return {
            Id: updatedCompany.Id,
            name: updatedCompany.name_c || updatedCompany.Name || '',
            address: updatedCompany.address_c || '',
            phone: updatedCompany.phone_c || '',
            email: updatedCompany.email_c || '',
            website: updatedCompany.website_c || '',
            industry: updatedCompany.industry_c || '',
            numberOfEmployees: updatedCompany.number_of_employees_c || 0,
            annualRevenue: updatedCompany.annual_revenue_c || 0,
            description: updatedCompany.description_c || '',
            tags: updatedCompany.Tags ? updatedCompany.Tags.split(',').map(tag => tag.trim()) : [],
            createdAt: updatedCompany.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to delete company: ${response.message}`);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} companies:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error);
      return false;
    }
  }

  getIndustryOptions() {
    return [
      'Technology',
      'Finance',
      'Healthcare',
      'Manufacturing',
      'Retail',
      'Education',
      'Government',
      'Non-profit',
      'Other'
    ];
  }
}

export const companyService = new CompanyService();