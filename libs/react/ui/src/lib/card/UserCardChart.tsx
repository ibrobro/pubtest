import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {UserLog, USER_LOG_TYPE} from '@rahul/typescript/util';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';


interface DateConversion{
  date: string;
  conv: number;
}

interface UserCardChartProps {
  logs: Array<UserLog>;
}


/**
 * User chart
 * @param   UserLog[] logs 
 * @returns ReactNode
 */
export function UserCardChart({logs}: UserCardChartProps) {
  const [convPerDay, setConvPerDay] = useState<DateConversion[]|null>(null);
  // CALCULATING VALUES
  useEffect(() => {
    let active = true;

    calculateValues();

    return(() => {active = false});

    async function calculateValues() {
      const promise: Promise<DateConversion[]> = new Promise((resolve, reject) => {
        try {
          let conversionsPerDay: DateConversion[] = [];
          logs.forEach((o: UserLog) => {
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
            }
          });

          conversionsPerDay = conversionsPerDay.sort((a,b)=> {
            return +new Date(a.date) - +new Date(b.date);
          });
          
          resolve(conversionsPerDay);
        } catch(e) {
          reject(e);
        }
      });
      promise
          .then((r: DateConversion[]) => {
            if(!active) return;
            setConvPerDay(r);
          })
          .catch(e=>{
            if(!active) return;
          })
    }
  }, []);

  return (
    <Box sx={{p: 1, position: 'relative'}}>
    {(convPerDay !== null)
        ? <ResponsiveContainer width='100%' height={125}>
            <LineChart
              width={150}
              height={110}
              data={convPerDay}
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
