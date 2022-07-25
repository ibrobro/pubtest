import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {useMemo, useCallback, useState, useEffect} from 'react';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { RatioBox } from '../layout/RatioBox';
import Box from '@mui/material/Box';


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
  const [isLoadingImg, setIsLoadingImg] = useState(true);
  const [img, setImg] = useState('');

  const firstLetterOfName = useMemo(()=> {
    let matches = user.name.match(/\b(\w)/g);
    matches = matches?.map(v => v.toUpperCase()) || null;
    return matches?.join('')||'X';
  }, [user.name]); 

  const fetchImage = useCallback(async () => {
    try{
      const res = await fetch(user.avatar, {headers: {mode:'no-cors'}});
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImg(imageObjectURL);
    } catch(e) {
    } finally {
      setIsLoadingImg(false);
    }
  }, [user.avatar]);

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <Card sx={{m:1,p: 1}} variant='outlined'>
      <RatioBox heightRatio={0.5} >
        <Grid container>
          <Grid item xs={3} sx={{width:'100%', height:'100px'}}>
            <RatioBox heightRatio={1}>
              {isLoadingImg 
                  ? <Skeleton variant='circular' sx={{width:'100%', height: '100%'}} />
                  : <Avatar
                      src={img} 
                      sx={{height:'100%', width:'100%'}}
                    >
                      {firstLetterOfName}
                    </Avatar>
              }
            </RatioBox>
          </Grid>
          <Grid item xs={9}>
            <Stack direction='column' sx={{pl: 2}}>
              <Typography component={'h3'}>{user.name}</Typography>
              <Typography component={'strong'} sx={{fontSize: '0.9rem',color: 'lightgray', textTransform:'capitalize'}}>{user.occupation}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </RatioBox>
    </Card>
  );
}