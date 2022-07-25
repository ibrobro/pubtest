import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {useState} from 'react';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { RatioBox } from '../layout/RatioBox';


export interface UserProps{
  name: string;
  avatar: string;
  id: number;
  occupation: string;
};


export interface UserCardProps {
  user: UserProps;
}


export function UserCard({user}: UserCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(null);

  return (
    <Card sx={{m:1,p: 1}} variant='outlined'>
      <RatioBox heightRatio={0.5} >
        <Grid container>
          <Grid item xs={3} sx={{width:'100%', height:'100px'}}>
            <RatioBox heightRatio={1}>
              {imgLoaded
                ? <Avatar  src={user.avatar} onLoad={() => setImgLoaded(true)} />
                : <Skeleton variant='circular' sx={{height:'100%', width:'100%'}} />
              }
            </RatioBox>
          </Grid>
          <Grid item xs={9}>
            <Stack direction='column'>
              <Typography>{user.name}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </RatioBox>
    </Card>
  );
}