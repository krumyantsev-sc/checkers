import React from 'react';
import styled, {keyframes} from 'styled-components';
import {CircularProgress} from "@mui/material";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const Title = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  margin: 0;
  animation: ${spin} 2s linear infinite;
`;

function Loading() {
    return (
        <LoadingScreen>
            <CircularProgress />
        </LoadingScreen>
    );
}

export default Loading;