import {
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Chip,
  TextField,
  Typography,
  Link,
  Box,
  Alert,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LinkSharpIcon from '@mui/icons-material/LinkSharp';
import { Fragment, useState } from 'react';
import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
import API from 'src/api/_api_';
import Label from '../../../components/label';
import { isExpired } from 'src/utils/expiredDate';
import { paymentService } from 'src/api';
import { toast } from 'react-hot-toast';

export default function CompanyDetails({ application, currentUser }) {
  const { information } = application || {};
  const status = (application?.status || 'pending').toLowerCase();
  const { role } = currentUser;
  const hasCertificate = application?.hasCertificate;
  const navigate = useNavigate();
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

  const [state, setState] = useState({
    loading: false,
    error: null,
  });

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
      alert(error.response?.data?.message || 'Something went wrong');
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
          loading: `Allowing ${information.name} to get certificate again, please wait...`,
          success: `${information.name} allowed to get certificate again!`,
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
        name: information.name,
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
  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          Application Details - {information.name}{' '}
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
          <Typography sx={{ my: 2 }}>Company Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                color="secondary"
                fullWidth
                value={information.name}
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                color="secondary"
                value={information.location}
                fullWidth
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Years of Experience"
                color="secondary"
                fullWidth
                value={information.yearsOfExperience}
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
                label="Staff Size"
                color="secondary"
                fullWidth
                value={information.staffSize}
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Completed Projects"
                color="secondary"
                value={information.completedProjects}
                fullWidth
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
          </Grid>

          <Typography sx={{ my: 2 }}>
            Company’s CEO Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                color="secondary"
                fullWidth
                value={information.ceo?.name}
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                color="secondary"
                value={information.ceo?.email}
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
                value={information.ceo?.phoneNumber}
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Relationship"
                color="secondary"
                value={information.ceo?.position}
                fullWidth
                disabled
                sx={{ my: 1 }}
              />
            </Grid>
          </Grid>
          <Typography sx={{ my: 2 }}>Recent Project</Typography>

          <Stack direction="row" spacing={1}>
            <a
              href={information.recentProject?.link}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Chip
                clickable
                icon={<LinkSharpIcon />}
                label="Project Link"
              />
            </a>
            {information.recentProject?.files?.map((file, index) => (
              <a
                href={file}
                key={file}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Chip
                  clickable
                  icon={<PictureAsPdfIcon />}
                  label={`File ${index + 1}`}
                />
              </a>
            ))}
          </Stack>

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
                  // color="success"
                  disabled={loading}
                  onClick={handleAllowCertificateAccess}
                >
                  Allow
                </Button>
              }
            >
              Allow {information.name} to get a certificate again
            </Alert>
          </Card>
        )}
    </Container>
  );
}
