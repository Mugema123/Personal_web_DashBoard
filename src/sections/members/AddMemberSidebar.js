import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
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
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import {
  AddCircleOutlineOutlined,
  PaidOutlined,
} from '@mui/icons-material';
import ChooseFileImage from 'src/components/Global/files/ChooseFileImage';
import { ADD_MEMBER, EDIT_MEMBER } from 'src/redux/actionTypes';

// ----------------------------------------------------------------------

//Comparing two objects and return new
function compareObj(obj1, obj2) {
  const uniqueObj = Object.entries(obj2).reduce(
    (acc, [key, value]) => {
      if (obj1[key] !== value) {
        acc[key] = value;
      }
      return acc;
    },
    {},
  );
  return uniqueObj;
}

// ----------------------------------------------------------------------
const CATEGORIES = [
  'Governing Council',
  'Membership & Licensing',
  'Compliance, Inspection & Discipline',
  'Development, Research & Publication',
  'Finance Resources and Mobilization',
  'Honorable Members',
];
// ----------------------------------------------------------------------

AddMemberSidebar.propTypes = {
  openSidebar: PropTypes.bool,
  onOpenSidebar: PropTypes.func,
  onCloseSidebar: PropTypes.func,
};

export default function AddMemberSidebar({
  openSidebar,
  onOpenSidebar,
  onCloseSidebar,
  onSubmit,
  data,
  errorApi,
  message,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedIn, setLinkedIn] = useState('');

  //Error state
  const [error, setError] = useState();
  //Loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setError();
    if (!name || !position || !category || !image || !email) {
      setError('Some fields are required');
      return;
    }

    setError();
    setLoading(true);
    const userData = {
      name,
      position,
      email,
      category,
      image,
      facebookProfile: facebook,
      linkedlinProfile: linkedIn,
      twitterProfile: twitter,
    };
    if (!data) {
      onSubmit({
        create: true,
        data: userData,
      });
    } else {
      onSubmit({
        create: false,
        data: compareObj(data, userData),
      });
    }
  };

  useEffect(() => {
    setLoading(false);
    if (message?.action === ADD_MEMBER && !data) {
      setName('');
      setPosition('');
      setEmail('');
      setCategory(CATEGORIES[0]);
      setImage('');
      setFacebook('');
      setLinkedIn('');
      setTwitter('');
    }
    if (message?.action === EDIT_MEMBER) {
      setName('');
      setPosition('');
      setEmail('');
      setCategory(CATEGORIES[0]);
      setImage('');
      setFacebook('');
      setLinkedIn('');
      setTwitter('');
    }
    if (data) {
      setName(data.name);
      setEmail(data.email);
      setPosition(data.position);
      setCategory(data.category);
      setImage(data.image);
      setFacebook(data.facebookProfile);
      setLinkedIn(data.linkedlinProfile);
      setTwitter(data.twitterProfile);
    } else {
      setName('');
      setEmail('');
      setPosition('');
      setCategory(CATEGORIES[0]);
      setImage('');
      setFacebook('');
      setLinkedIn('');
      setTwitter('');
    }
  }, [data, message]);

  useEffect(() => {
    setError(
      errorApi?.action === ADD_MEMBER ||
        errorApi?.action === EDIT_MEMBER
        ? errorApi?.message
        : '',
    );
    setLoading(false);
  }, [errorApi]);

  return (
    <>
      <Button
        onClick={onOpenSidebar}
        variant="outlined"
        color="secondary"
        startIcon={<AddCircleOutlineOutlined />}
      >
        Add Member
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
            {data ? 'Update' : 'Add'} Member
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
        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <TextField
              label="Full name"
              color="secondary"
              fullWidth
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <TextField
              label="Email"
              color="secondary"
              fullWidth
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              label="Position"
              color="secondary"
              fullWidth
              required
              value={position}
              onChange={e => setPosition(e.target.value)}
            />
            <span>
              <Typography color="grey" sx={{ mb: 1 }}>
                Category *
              </Typography>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
                fullWidth
              >
                {CATEGORIES.map((department, index) => {
                  return (
                    <MenuItem value={department} key={index}>
                      {department}
                    </MenuItem>
                  );
                })}
              </Select>
            </span>

            <ChooseFileImage
              selected={image}
              title="Member profile image"
              onSelect={selected => setImage(selected)}
            />
            <TextField
              label="Facebook Link"
              color="secondary"
              fullWidth
              value={facebook}
              onChange={e => setFacebook(e.target.value)}
            />
            <TextField
              label="Twitter Link"
              color="secondary"
              fullWidth
              value={twitter}
              onChange={e => setTwitter(e.target.value)}
            />
            <TextField
              label="LinkedIn Link"
              color="secondary"
              fullWidth
              value={linkedIn}
              onChange={e => setLinkedIn(e.target.value)}
            />
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          {!loading ? (
            <Button
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              onClick={handleSubmit}
              variant="outlined"
            >
              {data ? 'Update' : 'Submit'}
            </Button>
          ) : (
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
            >
              <CircularProgress color="inherit" size={20} />
              &nbsp; {data ? 'Updating' : 'Creating'}
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
}
