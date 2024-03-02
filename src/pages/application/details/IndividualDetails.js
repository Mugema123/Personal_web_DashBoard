import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Fragment, useMemo, useState } from 'react';
import { sentenceCase } from 'change-case';
import Label from '../../../components/label';
import API from 'src/api/_api_';
import { isExpired } from 'src/utils/expiredDate';
import { ApplicationService, paymentService } from 'src/api';
import { toast } from 'react-hot-toast';

const PLANS = ['none', 'Junior', 'Professional', 'Consulting'];

export default function IndividualDetails({
  application,
  currentUser,
}) {
  const [currentDecision, setCurrentDecision] = useState(
    application?.status,
  );
  const [viewPaid, setViewPaid] = useState({
    show: application?.paid || false,
    isPaid: application?.paid || false,
  });
  const [rejectReason, setRejectReason] = useState({
    show: application?.rejectReason ? true : false,
    message: application?.rejectReason || '',
    action: application?.status,
    error: null,
  });
  const [loading, setLoading] = useState(false);
  const { information, membership: plan } = application || {};
  const { role } = currentUser;
  const hasCertificate = application?.hasCertificate;
  const status = (application?.status || 'pending').toLowerCase();
  const navigate = useNavigate();

  const [state, setState] = useState({
    loading: false,
    error: null,
  });

  const [membership, setMembership] = useState(plan);

  const handleDecision = async decision => {
    try {
      // setRejectReason(prev => ({
      //   ...prev,
      //   // show: false,
      //   error: null,
      // }));
      if (
        (decision === 'DISAPPROVED' || decision === 'REJECTED') &&
        (!rejectReason.show || !rejectReason.message)
      ) {
        setRejectReason({
          show: true,
          message: '',
          action: decision,
          error: !rejectReason.message
            ? `Please specify the reason why you are ${
                decision === 'DISAPPROVED'
                  ? 'disapproving'
                  : 'declining'
              } this application!`
            : null,
        });
        return;
      } else {
        setRejectReason(prev => ({
          ...prev,
          show: false,
          error: null,
        }));
      }
      setLoading(true);
      const { data } = await toast.promise(
        API.patch(`/api/applications/${application._id}`, {
          status: decision,
          message: rejectReason.message,
        }),
        {
          loading: 'Updating membership status, please wait...',
          success: 'Membership status updated successfully!',
          error: error => {
            if (error.response) {
              return `Error: ${error?.response?.data?.message}`;
            } else {
              return 'Something went wrong while updating membership status, please try again';
            }
          },
        },
      );
      if (data.status === 200) {
        navigate('/dashboard/application');
      }
    } catch (error) {
      // alert(error.response?.data?.message || 'Something went wrong');
    } finally {
      // setCurrentDecision(null);
      setLoading(false);
    }
  };

  const handleAllowCertificateAccess = async decision => {
    try {
      setLoading(true);
      const { data } = await toast.promise(
        API.put(`/payment/hasACertificate?id=${application._id}`, {
          hasCertificate: false,
        }),
        {
          loading: `Allowing ${information.firstName} ${information.lastName} to get certificate again, please wait...`,
          success: `${information.firstName} ${information.lastName} allowed to get certificate again!`,
          error: error => {
            if (error.response) {
              return `Error: ${error?.response?.data?.message}`;
            } else {
              return 'Something went wrong while updating this application, please try again';
            }
          },
        },
      );
      if (data.SuccessMessage) {
        navigate('/dashboard/application');
      }
    } catch (error) {
      // alert(error.response?.data?.message || 'Something went wrong');
    } finally {
      // setCurrentDecision(null);
      setLoading(false);
    }
  };

  const handleNotify = async () => {
    try {
      setState({ loading: true, error: null, message: null });
      const result = await paymentService.notifyUser({
        email: information.email,
        name: `${information.firstName} ${information.lastName}`,
        lastPaidMembership: application.lastPaidMembership,
      });
      if (result.status === 200) {
        setState(prev => ({
          ...prev,
          message: result.data.message,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error:
          error.response?.data?.message ||
          error.response?.data?.invalidToken ||
          error.message ||
          'Something went wrong!',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleEditMembership = async membership => {
    try {
      setState({ loading: true, error: null, message: null });
      const result = await toast.promise(
        ApplicationService.editApplicationMembership(
          application._id,
          membership,
        ),
        {
          loading: 'Updating membership, please wait...',
          success: 'Application membership updated successfully!',
          error: error => {
            if (error.response) {
              return `Error: ${error?.response?.data?.message}`;
            } else {
              return 'Something went wrong while updating user membership, please try again';
            }
          },
        },
      );
      if (result.status === 200) {
        setMembership(membership);
        setState(prev => ({
          ...prev,
          message: result.data.message,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error:
          error.response?.data?.message ||
          error.response?.data?.invalidToken ||
          error.message ||
          'Something went wrong!',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          Application Details -{' '}
          {`${information.firstName} ${information.lastName}`}{' '}
          <Label
            color={
              status === 'rejected'
                ? 'error'
                : status === 'pending'
                ? 'info'
                : 'success'
            }
          >
            {sentenceCase(status)}
          </Label>
        </Typography>
        <Box sx={{ mx: 2, display: 'inline' }}></Box>
        <Link
          to="#"
          component="a"
          target="_blank"
          href={
            '/dashboard/application/' + application._id + '/payments'
          }
          variant="caption"
        >
          Membership Fee Payments
        </Link>
      </Stack>
      {isExpired(application?.lastPaidMembership) &&
        !state.message && (
          <Alert
            severity="error"
            sx={{ my: 2 }}
            variant="filled"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleNotify}
              >
                NOTIFY
              </Button>
            }
          >
            Membership payment has expired. Click{' '}
            <strong>NOTIFY</strong> to ask {information.firstName}
            {information.lastName} to repay again.
          </Alert>
        )}
      {(state.error || state.message) && (
        <Alert
          severity={state.error ? 'error' : 'success'}
          sx={{ my: 2 }}
        >
          {state.message ? (
            <span>{state.message}</span>
          ) : (
            <span>
              ERROR: <strong>{state.error}</strong>, try again later.
            </span>
          )}
        </Alert>
      )}

      {!viewPaid.show ? (
        <Card sx={{ p: 2, px: 4 }}>
          <Typography>
            Hi Admin, we've detected that this application by{' '}
            <strong>
              {information.firstName} {information.lastName}
            </strong>{' '}
            is not paid so far! And you can not undertake any action
            on it!
          </Typography>
          <Button
            variant="outlined"
            size="small"
            color="error"
            sx={{ mt: 4 }}
            onClick={() =>
              setViewPaid(prev => ({ ...prev, show: true }))
            }
          >
            It's Okay, Show me the details
          </Button>
        </Card>
      ) : (
        <Card sx={{ p: 2, px: 4 }}>
          <Typography sx={{ my: 2 }}>Personal Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                color="secondary"
                fullWidth
                value={information.firstName}
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                color="secondary"
                value={information.lastName}
                fullWidth
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Gender"
                color="secondary"
                fullWidth
                value={information.gender}
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                color="secondary"
                value={information.email}
                fullWidth
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Birth"
                color="secondary"
                fullWidth
                value={new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'medium',
                }).format(new Date(information.dateOfBirth))}
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone number"
                color="secondary"
                value={information.phoneNumber}
                fullWidth
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nationality"
                color="secondary"
                fullWidth
                value={information.nationality}
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Identification Number"
                color="secondary"
                value={information.identificationNumber}
                fullWidth
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Place of birth"
                color="secondary"
                fullWidth
                value={information.placeOfBirth}
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Place of residence"
                color="secondary"
                value={information.placeOfResidence}
                fullWidth
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
          </Grid>

          <Typography sx={{ my: 2 }}>Education</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Education Level"
                color="secondary"
                fullWidth
                value={information.education?.level}
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Education Institution"
                color="secondary"
                value={information.education?.institution}
                fullWidth
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Education Field"
                color="secondary"
                fullWidth
                value={information.education?.field}
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Graduation Year"
                color="secondary"
                value={information.education?.graduationYear}
                fullWidth
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
          </Grid>

          <Typography sx={{ my: 2 }}>Documments</Typography>

          <Stack direction="row" spacing={1}>
            <a
              href={information.motivationLetter}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Chip
                clickable
                icon={<PictureAsPdfIcon />}
                label="Motivation Letter"
              />
            </a>
            <a
              href={information.cv}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Chip
                clickable
                icon={<PictureAsPdfIcon />}
                label="CV"
              />
            </a>
            {information.certificates?.map((certificate, index) => (
              <a
                href={information.cv}
                key={certificate}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Chip
                  clickable
                  icon={<PictureAsPdfIcon />}
                  label={`Certificate ${index + 1}`}
                />
              </a>
            ))}
          </Stack>

          <Typography sx={{ my: 2 }}>
            Professional referees
          </Typography>
          {information.referees?.map((referee, index) => (
            <Fragment key={index}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    color="secondary"
                    fullWidth
                    value={referee.name}
                    disabled
                    sx={{ my: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    color="secondary"
                    value={referee.email}
                    fullWidth
                    disabled
                    sx={{ my: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phonenumber"
                    color="secondary"
                    fullWidth
                    value={referee.phoneNumber}
                    disabled
                    sx={{ my: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Relationship"
                    color="secondary"
                    value={referee.relationship}
                    fullWidth
                    disabled
                    sx={{ my: 1 }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Position"
                    color="secondary"
                    fullWidth
                    value={referee.position}
                    disabled
                    sx={{ my: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Institution"
                    color="secondary"
                    value={`${referee.institution}`}
                    fullWidth
                    disabled
                    sx={{ my: 1 }}
                  />
                </Grid>
              </Grid>
            </Fragment>
          ))}
          {/* <Typography sx={{ my: 2 }}>Other Informations</Typography> */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography sx={{ my: 2, opacity: 0.5 }}>
                  Current Membership Plan
                </Typography>
                <Select
                  labelId="select-membership"
                  id="select-membership"
                  value={membership}
                  disabled={
                    loading ||
                    role === 'finance_admin' ||
                    !viewPaid.isPaid
                  }
                  onChange={e => {
                    if (e.target.value === membership) return;
                    handleEditMembership(e.target.value);
                  }}
                  label="Select Membership"
                  required
                  input={
                    <OutlinedInput error={membership === 'none'} />
                  }
                >
                  {PLANS.map((label, index) => {
                    return (
                      <MenuItem value={label} key={index}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {rejectReason.show && (
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={sentenceCase(`${rejectReason.action}
                Reason`)}
                  color="secondary"
                  value={rejectReason.message}
                  fullWidth
                  multiline
                  rows={5}
                  disabled={
                    loading ||
                    role === 'finance_admin' ||
                    (currentDecision === 'DISAPPROVED' &&
                      role !== 'admin') ||
                    (currentDecision === 'REJECTED' &&
                      role === 'admin')
                  }
                  sx={{ my: 1 }}
                  onChange={e =>
                    setRejectReason(prev => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                />
                {rejectReason.error && (
                  <Typography variant="caption" color={'error'}>
                    {rejectReason.error}
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
          {viewPaid.isPaid && (
            <Stack direction="row" sx={{ my: 4 }} spacing={4}>
              <Button
                variant="contained"
                disabled={
                  loading ||
                  currentDecision === 'ACCEPTED' ||
                  !(role === 'admin' || role === 'super_admin') ||
                  currentDecision === 'APPROVED' ||
                  currentDecision === 'none'
                }
                size="medium"
                color="secondary"
                onClick={() => handleDecision('ACCEPTED')}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                size="medium"
                color="error"
                disabled={
                  loading ||
                  currentDecision === 'REJECTED' ||
                  !(role === 'admin' || role === 'super_admin') ||
                  currentDecision === 'APPROVED'
                }
                onClick={() => handleDecision('REJECTED')}
              >
                Decline
              </Button>
              <Box sx={{ flexGrow: 1 }}></Box>
              {(role === 'super_admin' ||
                role === 'registrar_admin') && (
                <Button
                  variant="outlined"
                  size="medium"
                  color="success"
                  disabled={
                    loading ||
                    currentDecision === 'APPROVED' ||
                    currentDecision === 'REJECTED' ||
                    currentDecision === 'PENDING' ||
                    currentDecision === 'none'
                  }
                  onClick={() => handleDecision('APPROVED')}
                >
                  Approve
                </Button>
              )}
              {(role === 'super_admin' ||
                role === 'registrar_admin') && (
                <Button
                  variant="outlined"
                  size="medium"
                  color="error"
                  disabled={
                    loading ||
                    currentDecision === 'DISAPPROVED' ||
                    currentDecision === 'PENDING'
                  }
                  onClick={() => handleDecision('DISAPPROVED')}
                >
                  Disapprove
                </Button>
              )}
            </Stack>
          )}
        </Card>
      )}
      {hasCertificate &&
        viewPaid.isPaid &&
        (role === 'super_admin' || role === 'registrar_admin') && (
          <Card sx={{ my: 2, p: 1 }}>
            <Alert
              severity="info"
              action={
                <Button
                  variant="contained"
                  size="small"
                  disabled={loading}
                  onClick={handleAllowCertificateAccess}
                >
                  Allow
                </Button>
              }
            >
              Allow {information.firstName} to get a certificate again
            </Alert>
          </Card>
        )}
    </Container>
  );
}
