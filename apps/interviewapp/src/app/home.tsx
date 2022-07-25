import users from '../data/users';
import {UserCard} from '@rahul/react/ui';
import { useMemo } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

export default function Home(){

  const userCards = useMemo(() => (
      users.map((u,k) => ( 
        <Grid item key={k} xs={12} sm={6} md={4} >
          <UserCard user={u} />
        </Grid>
      ))
  ), [users]);

  return(
    <Container>
      {users && <Grid container>{userCards}</Grid>}
    </Container>
  );
}