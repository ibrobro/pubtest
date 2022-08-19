import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { UserType } from "@rahul/typescript/util";
import { useEffect, useMemo, useState } from "react";
import { RatioBox } from "../layout/RatioBox";

/**
 * UserCardBio Props
 */
export interface UserCardBioProps {
  user: UserType;
}


/*******************************************************************************
 * Displaying User's Avatar, Name, Occupation
 * @param   UserType  user
 * @returns ReactNode
 ******************************************************************************/
export function UserCardBio({user}: UserCardBioProps) {
  const [isLoadingImg, setIsLoadingImg] = useState(true);
  const [img, setImg] = useState('');

  // AVATAR IMAGE
  useEffect(() => {
    let active = true;

    fetchImage();
    
    return(() => {active = false});

    async function fetchImage(){
      try{
        const res = await fetch(user.avatar, {headers: {mode:'no-cors'}});
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        if(!active) return;
        setImg(imageObjectURL);
      } catch(e) {
      } finally {
        if(!active) return;
        setIsLoadingImg(false);
      }
    }
  }, []);

  const firstLetterOfName = useMemo(()=> {
    let matches = user.name.match(/\b(\w)/g);
    matches = matches?.map(v => v.toUpperCase()) || null;
    return matches?.join('')||'X';
  }, [user.name]);

  return (
    <Grid container>
          <Grid item xs={3}>
            <RatioBox heightRatio={1}>
              {isLoadingImg 
                  ? <Skeleton 
                      variant='circular' 
                      sx={{width:'100%', height: '100%'}} 
                    />
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
              <Typography 
                component={'strong'} 
                sx={{
                  fontSize: '0.9rem', 
                  color: 'text.secondary', 
                  textTransform:'capitalize'}}
                >
                  {user.occupation}
                </Typography>
            </Stack>
          </Grid>
        </Grid>
  )
}
