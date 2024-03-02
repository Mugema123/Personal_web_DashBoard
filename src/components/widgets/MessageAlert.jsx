import { Alert, CircularProgress } from '@mui/material';
import React from 'react';

const MessageAlert = ({ state }) => {
  const { error, success, loading } = state;
  if (!error && !success && !loading) {
    return null;
  }
  return (
    <Alert
      variant="standard"
      severity={success ? 'success' : loading ? 'info' : 'error'}
      icon={loading ? <CircularProgress size={20} /> : null}
      sx={{ my: 2 }}
    >
      {loading}
      {success}
      {error}
    </Alert>
  );
};

export default MessageAlert;
