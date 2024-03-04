import { useState } from 'react';
// @mui
import {
  Box,
  Stack,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { connect } from 'react-redux';
import API from 'src/api/_api_';

const RECEIVERS = [
  { label: 'All Users', value: 'all' },
  { label: 'Admins Only', value: 'admins' },
];

const EmailUsersSidebar = ({
  userId,
  openSidebar,
  onOpenSidebar,
  onCloseSidebar,
}) => {
  //----------------------------------------------------------------
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [receivers, setReceivers] = useState(RECEIVERS[0].value);

  //Error state
  const [error, setError] = useState();
  //Success state
  const [success, setSuccess] = useState();
  //Loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError();
    if (!subject || !body || !receivers) {
      setError('All fields are required');
      return;
    }
    setError();
    const data = {
      subject,
      emailBody: body,
      receivers,
      sender: userId,
    };
    try {
      setLoading(true);
      setError();
      const result = await API.post(
        '/auth/emailRegisteredUsers',
        data,
      );
      if (result.data.successMessage) {
        setSuccess('Email sent successfully to ' + receivers);
      }
    } catch (error) {
      setError(
        error.response?.data?.invalidToken ||
          error.response?.data?.errorMessage ||
          'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={onOpenSidebar}
        variant="outlined"
        color={'secondary'}
        startIcon={<Iconify icon="eva:email-outline" />}
      >
        Email Users
      </Button>

      <Drawer
        anchor="right"
        open={openSidebar}
        onClose={onCloseSidebar}
        PaperProps={{
          sx: { width: 320, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Email Users
          </Typography>
          <IconButton onClick={onCloseSidebar}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>
        {error && (
          <Alert variant="standard" severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="standard" severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        <Divider />

        <Scrollbar>
          <Stack spacing={2} sx={{ px: 3, pt: 3 }}>
            <TextField
              label="Subject"
              color="secondary"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              fullWidth
              required
            />
            <FormControl fullWidth sx={{ my: 1 }}>
              <InputLabel id="to">To</InputLabel>
              <Select
                labelId="to"
                id="to-select"
                value={receivers}
                onChange={e => setReceivers(e.target.value)}
                label="Select Receivers"
              >
                {RECEIVERS.map(item => {
                  return (
                    <MenuItem value={item.value} key={item.value}>
                      {item.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <TextField
              label="Compose email"
              color="secondary"
              value={body}
              multiline
              rows={10}
              onChange={e => setBody(e.target.value)}
              fullWidth
              required
            />
          </Stack>
        </Scrollbar>
        <Box sx={{ p: 3 }}>
          {success && (
            <Button
              fullWidth
              size="large"
              color="error"
              onClick={() => {
                setSuccess();
                setSubject('');
                setBody('');
                setReceivers(RECEIVERS[0].value);
              }}
              variant="outlined"
              sx={{ my: 1 }}
            >
              {'Clear'}
            </Button>
          )}
          {!loading ? (
            <Button
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              onClick={handleSubmit}
              variant="outlined"
            >
              {success ? 'Send this email again' : 'Send Email'}
            </Button>
          ) : (
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
            >
              <CircularProgress color="inherit" size={20} />
              &nbsp; {'Sending...'}
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};

const mapStateToProps = state => ({
  userId: state.auth.isAuthenticated.currentUser._id,
});

export default connect(mapStateToProps)(EmailUsersSidebar);
