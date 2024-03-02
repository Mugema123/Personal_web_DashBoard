import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {
  Alert,
  AlertTitle,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { sentenceCase } from 'change-case';

const DataWidget = ({
  title,
  isLoading,
  isError = null,
  isEmpty,
  children,
  customEmptyMessage,
}) => {
  if (isLoading) {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={4}
        sx={{ py: 2 }}
      >
        <CircularProgress size={40} color="success" />
        <Typography>
          {title ? sentenceCase(title) : 'Items'} loading, please
          wait...
        </Typography>
      </Stack>
    );
  }
  if (isError) {
    const error = isError.message || isError.invalidToken;

    return (
      <Container>
        <Alert severity="error" variant="outlined">
          <AlertTitle>Error!</AlertTitle>
          {error ||
            'Oops, Something went wrong due to unknown error. Try to refresh the page and try again.'}
        </Alert>
      </Container>
    );
  }
  if (isEmpty) {
    return (
      <Container>
        <Alert severity="info" variant="outlined">
          <AlertTitle>
            No {title ? title?.toLowerCase() : 'items'} found!
          </AlertTitle>
          {customEmptyMessage
            ? customEmptyMessage
            : `There are no ${
                title ? title?.toLowerCase() : 'items'
              } in our
          system yet!`}
        </Alert>
      </Container>
    );
  }
  return <>{children}</>;
};

export default DataWidget;
