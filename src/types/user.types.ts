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
export interface View {
  id: number;
  code: string;
  name: string;
  icon: string;
  url: null | string;
  order: number;
  metadata: null;
  children: View[];
}
