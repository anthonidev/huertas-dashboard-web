export interface Profile {
  access: string;
  refresh: string;
  user: UserClient;
}

export interface UserClient {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  doc: string;
  active: boolean;
  image: null;
  created_on: string;
  updated_at: string;
  last_login: string;
}
