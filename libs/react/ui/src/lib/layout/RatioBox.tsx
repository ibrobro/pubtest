import React, { ReactNode } from 'react';
import { styled } from '@mui/system';


const RatioDiv = styled('div')({
  width: '100%',
  position: 'relative',
});


const AbsoluteDiv = styled('div')({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

const ContentDiv = styled('div')({
  position: 'relative',
  height: '100%',
  width: '100%',
});


export interface RatioBoxProps{
  heightRatio: number;
  children: ReactNode;
}

export function RatioBox({heightRatio, children}: RatioBoxProps) {
  const paddingTop = (heightRatio*100).toString().concat('%');

  return (
    <RatioDiv sx={{paddingTop}}> 
      <AbsoluteDiv>
        <ContentDiv>
          {children}
        </ContentDiv>
      </AbsoluteDiv>
    </RatioDiv>
  )
}