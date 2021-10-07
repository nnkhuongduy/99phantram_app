export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: {
    id: string;
    name: string;
  };
}
