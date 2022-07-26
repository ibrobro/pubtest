import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {useMemo, useState, useEffect} from 'react';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { RatioBox } from '../layout/RatioBox';
import {UserLog, UserWithLog, USER_LOG_TYPE} from '@rahul/typescript/util';
import {CartesianGrid, Line, LineChart, Tooltip, ResponsiveContainer, XAxis} from 'recharts';
import Box from '@mui/material/Box';

interface CalculationResults {
  conv: number;
  imp: number;
  rev: number;
  conversionsPerDay: DateConversion[];
}


interface DateConversion{
  date: string;
  conv: number;
}


export interface UserCardProps {
  userWithLog: UserWithLog;
}


export function UserCard({userWithLog}: UserCardProps) {
  const {user, logs} = userWithLog;
  const [revenue, setRevenue] = useState<number|null>(null);
  const [impressions, setImpressions] = useState<number|null>(null);
  const [conversions, setConversions] = useState<number|null>(null);
  const [convPerDay, setConvPerDay] = useState<DateConversion[]|null>(null);
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
          let conversionsPerDay: DateConversion[] = [];
          logs.forEach((o: UserLog) => {
            rev += o.revenue;
            if(o.type === USER_LOG_TYPE.conversion) {
              const yearMonthDate = o.time?.split(' ')[0];
              if(yearMonthDate) {
                let cpd: DateConversion | undefined = 
                    conversionsPerDay.find(e => e.date === yearMonthDate);
                if(!cpd) {
                  conversionsPerDay.push({
                    date: yearMonthDate,
                    conv: o.revenue,    
                  });
                } else {
                  cpd.conv += o.revenue;
                }
              }
              conv += o.revenue;
            } else if (o.type === USER_LOG_TYPE.impression) {
              imp += o.revenue;
            }
          });

          conversionsPerDay = conversionsPerDay.sort((a,b)=> {
            return +new Date(a.date) - +new Date(b.date);
          });
          
          resolve({rev,imp,conv, conversionsPerDay});
        } catch(e) {
          reject(e);
        }
      });
      promise
          .then((r: CalculationResults) => {
            if(!active) return;
            setConversions(r.conv);
            setImpressions(r.imp);
            setRevenue(r.rev);
            setConvPerDay(r.conversionsPerDay||[]);
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
    <Card sx={{m:.5,p: 1}} variant='outlined'>
      <RatioBox heightRatio={0.75} >
        <Grid container>
          <Grid item xs={3}>
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
        <Grid container sx={{mt: 2}}>
          <Grid item xs={8}>
            <ConversionPerDayChart conversionsPerDay={convPerDay} />
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
  amount: number | null;
}

function Impression({amount}: ImpressionProps) {
  return (
    <>
      <Typography>
        {(amount !== null)
            ? amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : <Skeleton />
        }
      </Typography>
      <Typography>impressions</Typography>
    </>
  );
}


interface ConversionProps {
  amount: number | null;
}

function Conversion({amount}: ConversionProps) {
  return (
    <>
      {(amount !== null)
          ? amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : <Skeleton />
      }
      <Typography>conversions</Typography>
    </>
  );
}


interface RevenueProps {
  amount: number | null;
}

function Revenue({amount}: RevenueProps) {
  return (   
    <Typography>
      {(amount !== null)
          ? amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : <Skeleton />
      }
    </Typography>
  );
}

interface ConversionPerDayChartProps {
  conversionsPerDay: DateConversion[] | null;
}

function ConversionPerDayChart({conversionsPerDay}: ConversionPerDayChartProps) {
  return (
      <Box sx={{p: 1, position: 'relative'}}>
        {(conversionsPerDay !== null)
            ? <ResponsiveContainer width='100%' height={125}>
                <LineChart
                  width={150}
                  height={110}
                  data={conversionsPerDay}
                  margin={{ top: 5, right: 5, left: 5, bottom: 15 }}
                >
                  <Tooltip />
                  <CartesianGrid stroke="#f5f5f5" />
                  <Line type="monotone" dataKey="conv" stroke="#ff7300" yAxisId={0} />
                </LineChart>
              </ResponsiveContainer>
            : <Skeleton sx={{width:'100%', height: '100%'}} />
      }
    </Box>
  );
}