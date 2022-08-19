import users from '../data/users';
import logs from '../data/logs';
import {UserCard} from '@rahul/react/ui';
import { UserLog, UserType, UserWithLog } from '@rahul/typescript/util';
import { useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';


/**
 * Home/Landing page component.
 * 
 * @return  ReactNode   Home React Component   
 */
export default function Home(){
  // Users data to be displayed
  const [usersWithLogs, setUsersWithLogs] = useState<UserWithLog[]>([]);

  // Expensive processes of user's data
  useEffect(() => {
    let active = true;
    
    getUserLogs();
  
    return(() => {
      active = false;
    });

    async function getUserLogs() {
      const promises = users.map((user: UserType) => {
        return new Promise((resolve, reject) => {
          try {
            const filteredLogs = logs.filter((log: UserLog) => {
              return log.user_id === user.id;
            });
            
            resolve({user, logs: filteredLogs} as UserWithLog);
          } catch(e) {
            reject(e);
          }
        });
      });

      let usersWithLogs: UserWithLog[];
      try {
        usersWithLogs = await Promise.all(promises) as UserWithLog[];
      } catch (e) {
        usersWithLogs = [];
      }
      if(!active) return;
      setUsersWithLogs(usersWithLogs);
    }
  }, []);

  // User's data displayed as Card
  const userCards = useMemo(() => {
    return (
      usersWithLogs.map((u,k) => ( 
        <Grid item key={k} xs={12} sm={6} md={4} >
          <UserCard userWithLog={u} />
        </Grid>
      ))
    )
  }, [usersWithLogs]);

  // Returns the components
  return(
    <Container>
      {userCards
          ?<Grid container>{userCards}</Grid>
          : <Alert severity='info'><Typography>Loading..</Typography></Alert>
      }
    </Container>
  );
}