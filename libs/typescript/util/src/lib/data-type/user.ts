import { UserLog} from "./user-log";


export interface UserType{
  name: string;
  avatar: string;
  id: number;
  occupation: string;
};


export interface UserWithLog {
  user: UserType;
  logs: UserLog[];
}