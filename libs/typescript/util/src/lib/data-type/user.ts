import { UserLog} from "./user-log";

/**
 * Typescript user's data type
 */
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