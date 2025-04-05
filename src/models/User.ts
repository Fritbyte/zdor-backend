export interface User {
  id?: number;
  username: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserDto {
  id: number;
  username: string;
  created_at: Date;
}
