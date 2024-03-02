import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  Container,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import Label from 'src/components/label/Label';
import Iconify from 'src/components/iconify/Iconify';
import {
  AccountCircle,
  AlignVerticalTopSharp,
  ArrowBack,
  PeopleAltOutlined,
  PeopleOutline,
  Person,
  PersonOutline,
  RemoveRedEyeOutlined,
} from '@mui/icons-material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import DataWidget from 'src/components/widgets/DataWidget';
import { useFetcher } from 'src/api/fetcher';
import { isExpired } from 'src/utils/expiredDate';
import { paymentService } from 'src/api';

const headLabel = [
  'Transaction ID',
  'Membership Plan',
  'Payment Method',
  'Amount',
  'Status',
  'Time',
  '',
];

const MembershipPayments = () => {
  const { id: applicationId } = useParams();
  const navigate = useNavigate();
  //---------------------------------------------
  const { data, isError, isLoading } = useFetcher(
    `/payment/getApplicationPayments/${applicationId}`,
  );

  const [applicationPayments, setApplicationPayments] = useState({
    application: {},
    payments: [],
  });

  useMemo(() => {
    if (data?.application) {
      setApplicationPayments({
        application: {
          category: data?.application.category,
          name:
            data?.application.category === 'individual'
              ? `${data?.application.information.firstName} ${data?.application.information.lastName}`
              : data?.application.information.name,
          email: data?.application.information.email,
          lastPaidMembership: data?.application.lastPaidMembership,
          isExpired: isExpired(data?.application.lastPaidMembership),
        },
        payments: data?.allAvailablePayments || [],
      });
    }
  }, [data?.application, data?.allAvailablePayments]);

  const [state, setState] = useState({
    loading: false,
    error: null,
  });

  const [currentPayment, setCurrentPayment] = useState(null);

  const handleEditPaymentStatus = async newStatus => {
    try {
      setState({ loading: true, error: null, message: null });
      await paymentService.decideOnPayments(currentPayment.id, {
        transactionStatus: newStatus,
      });
      setApplicationPayments(prev => ({
        ...prev,
        application: { ...prev.application, isExpired: false },
        payments: prev.payments.map(pay =>
          pay.id === currentPayment.id
            ? { ...pay, transactionStatus: newStatus }
            : pay,
        ),
      }));
      setCurrentPayment(null);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Something went wrong!',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleNotify = async () => {
    try {
      setState({ loading: true, error: null, message: null });
      const result = await paymentService.notifyUser({
        email: applicationPayments.application.email,
        name: applicationPayments.application.name,
        lastPaidMembership:
          applicationPayments.application.lastPaidMembership,
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
  //----------------------------------------------------------------
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event, item) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <Helmet>
        <title>Membership Fee Payments | MUGEMA Admin</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" mb={2}>
          <Link to={'../application/' + applicationId}>
            <IconButton aria-label="delete" size="medium">
              <ArrowBack fontSize="small" />
            </IconButton>
          </Link>
          <Typography variant="h4" gutterBottom>
            Membership Fee Payments
          </Typography>
          <Typography
            variant="body"
            color="primary"
            gutterBottom
          ></Typography>
        </Stack>
        {applicationPayments.application.isExpired &&
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
              <strong>NOTIFY</strong> to ask{' '}
              {applicationPayments.application.name} to repay again.
            </Alert>
          )}
        {(state.error || state.message) && (
          <Alert severity={state.error ? 'error' : 'success'}>
            {state.message ? (
              <span>{state.message}</span>
            ) : (
              <span>
                ERROR: <strong>{state.error}</strong>, try again
                later.
              </span>
            )}
          </Alert>
        )}
        {applicationPayments.application.name && (
          <Alert
            severity="info"
            sx={{ my: 2 }}
            icon={
              applicationPayments.application.category ===
              'individual' ? (
                <PersonOutline />
              ) : (
                <PeopleAltOutlined />
              )
            }
          >
            <AlertTitle>
              {applicationPayments.application.name}
            </AlertTitle>
            {applicationPayments.application.email}
          </Alert>
        )}

        <DataWidget
          title={'Payments for this application'}
          isLoading={
            isLoading &&
            !applicationPayments.payments.length &&
            !isError
          }
          isError={
            !isLoading &&
            !applicationPayments.payments.length &&
            isError
              ? isError
              : null
          }
          isEmpty={
            !isLoading &&
            !applicationPayments.payments.length &&
            !isError
          }
        >
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {headLabel.map((headCell, index) => (
                        <TableCell
                          key={index}
                          align={'left'}
                          sortDirection={false}
                        >
                          {headCell}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applicationPayments.payments.map(row => {
                      const {
                        id,
                        transactionId,
                        paymentPlan,
                        paymentMethod,
                        transactionStatus,
                        createdAt,
                        amountPaid,
                      } = row;

                      const formatter = new Intl.NumberFormat('en-RW', {
                        style: 'currency',
                        currency: 'RWF',
                        currencyDisplay: 'symbol',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                      }); 
                      const formattedValue = formatter.format(amountPaid).replace("RF", "");
                      const amount = formattedValue.replace("RWF", "").trim();
                      const formattedAmount = `${amount} Rwf`;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                        >
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2" noWrap>
                              {transactionId}
                            </Typography>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2" noWrap>
                              {paymentPlan}
                            </Typography>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2" noWrap>
                              {paymentMethod}
                            </Typography>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2" noWrap>
                              {formattedAmount}
                            </Typography>
                          </TableCell>

                          <TableCell align="left">
                            <Label
                              color={
                                transactionStatus === 'Pending'
                                  ? 'success'
                                  : transactionStatus === 'Success'
                                  ? 'success'
                                  : 'error'
                              }
                            >
                              {transactionStatus}
                            </Label>
                          </TableCell>

                          <TableCell align="left">
                            {createdAt}
                          </TableCell>

                          {/* <TableCell align="right">
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={event => {
                                setCurrentPayment({
                                  id,
                                  transactionStatus,
                                  paymentPlan,
                                });
                                handleOpenMenu(event, row);
                              }}
                            >
                              <Iconify
                                icon={'eva:more-vertical-fill'}
                              />
                            </IconButton>
                          </TableCell> */}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>{' '}
            </Scrollbar>
          </Card>
        </DataWidget>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 150,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {currentPayment?.transactionStatus !== 'Success' && (
          <MenuItem
            sx={{ color: '#008D41' }}
            onClick={event => {
              handleEditPaymentStatus('Success');
              handleCloseMenu(event);
            }}
          >
            <RemoveRedEyeOutlined sx={{ mr: 2, width: 20 }} />
            Received
          </MenuItem>
        )}

        {currentPayment?.transactionStatus !== 'Rejected' && (
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={event => {
              handleEditPaymentStatus('Rejected');
              handleCloseMenu(event);
            }}
            disabled={
              currentPayment?.transactionStatus === 'Success' &&
              currentPayment?.paymentPlan === 'Application Fee' &&
              applicationPayments.payments.length > 1
            }
          >
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Not received
          </MenuItem>
        )}
      </Popover>
    </>
  );
};

export default MembershipPayments;
