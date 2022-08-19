import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { RatioBox } from '../layout/RatioBox';
import {UserWithLog} from '@rahul/typescript/util';
import { UserCardBio } from './UserCardBio';
import { UserCardStatistic} from './UserCardStatistic';
import { UserCardChart } from './UserCardChart';


export interface UserCardProps {
  userWithLog: UserWithLog;
}


/**
 * User card
 * shows bio, chart, statistic
 * @param     userrWithLog  ReactNode
 * @returns                 ReactNode
 */
export function UserCard({userWithLog}: UserCardProps) {
  const {user, logs} = userWithLog;

  return (
    <Card sx={{m:.5,p: 1}} variant='outlined'>
      <RatioBox heightRatio={0.75} >
        <UserCardBio user={user} />
        <Grid container sx={{mt: 2}}>
          <Grid item xs={8}>
            <UserCardChart logs={logs} />
          </Grid>
          <Grid item xs={4}>
            <UserCardStatistic logs={logs} />
          </Grid>
        </Grid>
      </RatioBox>
    </Card>
  );
}
