export interface UserLog {
  time: string;
  type: string;
  user_id: number;
  revenue: number;
};

export const USER_LOG_TYPE = {
  conversion: 'conversion',
  impression: 'impression',
}