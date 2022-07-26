import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {UserLog, USER_LOG_TYPE} from '@rahul/typescript/util';
import { useEffect, useState } from 'react';


interface CalculationResults {
  conv: number;
  imp: number;
  rev: number;
}

interface UserCardStatisticProps {
  logs: Array<UserLog>;
}


/**
 * User Statistic: revenue, impression, conversions
 * @param param0 
 * @returns 
 */
export function UserCardStatistic({logs}: UserCardStatisticProps) {
  const [revenue, setRevenue] = useState<number|null>(null);
  const [impressions, setImpressions] = useState<number|null>(null);
  const [conversions, setConversions] = useState<number|null>(null);

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
          logs.forEach((o: UserLog) => {
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
            setConversions(r.conv);
            setImpressions(r.imp);
            setRevenue(r.rev);
          })
          .catch(e=>{
            if(!active) return;
          })
    }
  }, []);

  return (
    <Stack direction={'column'}>
      <Impression amount={impressions} />
      <Conversion amount={conversions} />
      <Revenue amount={revenue} />
    </Stack>
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
            ? <Typography sx={{color: 'secondary.main'}}>{amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
            : <Skeleton />
        }
      </Typography>
      <Typography sx={{color: 'text.secondary'}}>impressions</Typography>
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
          ? <Typography sx={{color: 'primary.main'}}>{amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
          : <Skeleton />
      }
      <Typography sx={{color: 'text.secondary'}}>conversions</Typography>
    </>
  );
}


interface RevenueProps {
  amount: number | null;
}

function Revenue({amount}: RevenueProps) {
  return (   
    <Typography sx={{color: 'success.main', fontWeight: 'bold'}}>
      {(amount !== null)
          ? `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
          : <Skeleton />
      }
    </Typography>
  );
}