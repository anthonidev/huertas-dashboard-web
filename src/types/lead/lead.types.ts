export interface ResponseLeads {
  count: number;
  next: null | string | boolean;
  previous: null | string | boolean;
  results: Leads[];
}

export interface Leads {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  created_at: Date;
  project: null | string;
  project_name: null | string;
}
