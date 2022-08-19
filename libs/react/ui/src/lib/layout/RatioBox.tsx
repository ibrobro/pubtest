import React, { ReactNode } from 'react';
import { styled } from '@mui/system';


/**
 * Styled div Element
 */
const RatioDiv = styled('div')({
  width: '100%',
  position: 'relative',
});


/**
 * Styled div component with absolute position
 */
const AbsoluteDiv = styled('div')({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

/**
 * Styled div for content
 */
const ContentDiv = styled('div')({
  position: 'relative',
  height: '100%',
  width: '100%',
});


/**
 * Properties type
 */
export interface RatioBoxProps{
  heightRatio: number;
  children: ReactNode;
}

/**
 * Container that will keep width n height ratio
 * @param heightRatio   Number      height ratio repectively to it's width
 * @param children      ReactNode   
 * @returns             ReactNode
 */
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