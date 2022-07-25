import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {useMemo, useCallback, useState, useEffect} from 'react';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { RatioBox } from '../layout/RatioBox';
import {UserLog, UserWithLog, USER_LOG_TYPE} from '@rahul/typescript/util';


export interface UserCardProps {
  userWithLog: UserWithLog;
}

interface CalculationResults {
  conv: number;
  imp: number;
  rev: number;
}


export function UserCard({userWithLog}: UserCardProps) {
  const {user, logs} = userWithLog;
  const [revenue, setRevenue] = useState(0);
  const [impressions, setImpressions] = useState(0);
  const [conversions, setConversions] = useState(0);
  
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

  // CALCULATING VALUES
  useEffect(() => {
    let active = true;

    calculateValues();

    return(() => {active = false});
    async function calculateValues() {
      const promise: Promise<CalculationResults> = new Promise((resolve, reject) => {
        try {
          let rev = 0;
          let imp = 0;
          let conv = 0;
          logs.forEach(o => {
            rev += o.revenue;
            if(o.type === USER_LOG_TYPE.conversion) {
              conv += o.revenue;
            } else if (o.type === USER_LOG_TYPE.impression) {
              imp += o.revenue;
            } 
          });
          resolve({rev,imp,conv});
        } catch(e) {
          reject(e);
        }
      });
      promise
          .then((r: CalculationResults) => {
            if(!active) return;
            console.log(r);
            setConversions(r.conv);
            setImpressions(r.imp);
            setRevenue(r.rev);
          })
          .catch(e=>{
            if(!active) return;
          })
    }
  }, []);

  const firstLetterOfName = useMemo(()=> {
    let matches = user.name.match(/\b(\w)/g);
    matches = matches?.map(v => v.toUpperCase()) || null;
    return matches?.join('')||'X';
  }, [user.name]);

  return (
    <Card sx={{m:1,p: 1}} variant='outlined'>
      <RatioBox heightRatio={0.75} >
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
        <Grid container>
          <Grid item xs={8}>

          </Grid>
          <Grid item xs={4}>
            <Stack direction={'column'}>
              <Impression amount={impressions} />
              <Conversion amount={conversions} />
              <Revenue amount={revenue} />
            </Stack>
          </Grid>
        </Grid>
      </RatioBox>
    </Card>
  );
}


interface ImpressionProps {
  amount: number;
}

function Impression({amount}: ImpressionProps) {
  return (
    <>
      <Typography>{amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
      <Typography>impressions</Typography>
    </>
  );
}


interface ConversionProps {
  amount: number;
}

function Conversion({amount}: ConversionProps) {
  return (
    <>
      <Typography>{amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
      <Typography>conversions</Typography>
    </>
  );
}


interface RevenueProps {
  amount: number;
}

function Revenue({amount}: RevenueProps) {
  return (
    <Typography>{amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
  );
}