export interface DBProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  roll: "admin" | "user";
}
