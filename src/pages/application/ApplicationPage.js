import { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';

import momoLogo from '../../assets/momo.png';
import cardsLogo from '../../assets/master-card.png';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Alert,
  CircularProgress,
  Button,
  useMediaQuery,
} from '@mui/material';

// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead } from '../../sections/user';
// mock
// import APPLICATIONLIST from '../../_mock/applicaton';
import ApplicationListToolbar from 'src/sections/application/ApplicationListToolbar';
import {
  Mail,
  Payment,
  PictureAsPdf,
  RemoveRedEyeOutlined,
  Report,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFetcher } from 'src/api/fetcher';
import DataWidget from 'src/components/widgets/DataWidget';
import ModalDialog from 'src/components/Global/ModalDialog';
import { ApplicationService, paymentService } from 'src/api';
import { getPayments } from 'src/redux/actions/payment';
import { connect } from 'react-redux';
import { isExpired } from 'src/utils/expiredDate';
import MessageAlert from 'src/components/widgets/MessageAlert';
import { LEVELS } from 'src/sections/user/UserListTile';
// ------------------------------------------------------------------------
const PLANS = [
  'all',
  'Junior',
  'Professional',
  'Consulting',
  'Company',
];

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'category', label: 'Category', alignRight: false },
  { id: 'certificate', label: 'Certificate', alignRight: false },
  { id: 'paid', label: 'App. Fee', alignRight: false },
  { id: 'membership', label: 'Membership', alignRight: false },
  { id: 'createdAt', label: 'Joined At', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      _user =>
        _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1,
    );
  }
  return stabilizedThis.map(el => el[0]);
}

const ApplicationPage = ({ payments, getPayments, currentUser }) => {
  const currentUserRoleLevel = LEVELS[currentUser.role];
  const [open, setOpen] = useState(null);
  const nav = useNavigate();
  const [currentCategory, setCurrentCategory] = useState('all');
  const [currentPlan, setCurrentPlan] = useState(PLANS[0]);
  const [currentApplication, setCurrentApplication] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleted, setDeleted] = useState([]);
  const [numbers, setNumbers] = useState(null);

  const {
    data: applicationData,
    isError: applicationError,
    isLoading: applicationLoading,
  } = useFetcher(
    `/api/applications?page=${
      page + 1
    }&limit=${rowsPerPage}&sortBy=recent&category=${currentCategory}&membership=${currentPlan}`,
  );

  const applicationList = useMemo(() => {
    const arr = applicationData?.data || [];
    if (currentPlan === 'all') {
      setNumbers({
        all: arr.length,
        Junior: arr.filter(app => app.membership === 'Junior').length,
        Professional: arr.filter(
          app => app.membership === 'Professional',
        ).length,
        Consulting: arr.filter(app => app.membership === 'Consulting')
          .length,
        Company: arr.filter(app => app.membership === 'Company')
          .length,
      });
    }
    if (deleted.length === 0) {
      return arr;
    }
    setNumbers(prev => {
      if (prev === null) return null;
      const newCount = { ...prev, all: Number(prev.all) - 1 };
      newCount[currentPlan] = Number(prev[currentPlan]) - 1;
      return newCount;
    });
    return arr.filter(m => !deleted.includes(m._id));
  }, [applicationData?.data, deleted]).map(item => {
    return {
      ...item,
      id: item._id,
      email: item.information?.email,
      name:
        item.information?.name ||
        `${item.information?.firstName} ${item.information?.lastName}`,
      status: (item.status || 'pending').toLowerCase(),
      membershipStatus: isExpired(item.lastPaidMembership)
        ? 'expired'
        : item.lastPaidMembership
        ? 'active'
        : 'inactive',
      lastPaidMembership: item.lastPaidMembership,
      isPersonal: item.category !== 'company',
      paid: !!item.paid,
      hasCertificate: item.hasCertificate,
      createdAt: new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
      }).format(new Date(item.createdAt)),
    };
  });

  const count = useMemo(
    () =>
      applicationData?.pagination?.count || applicationList.length,
    [applicationList.length, applicationData?.pagination?.count],
  );

  const [order, setOrder] = useState('desc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('createdAt');

  const [filterName, setFilterName] = useState('');

  const handleOpenMenu = (event, item) => {
    setOpen(event.currentTarget);
    setCurrentApplication(item);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    handleCloseMenu();
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = applicationList.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = event => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const applications = applySortFilter(
    applicationList,
    getComparator(order, orderBy),
    filterName,
  );

  const isNotFound = !applications.length && !!filterName;

  //Deleting application
  const [deleting, setDeleting] = useState();
  const [deleteError, setDeleteError] = useState();
  const [deleteSuccess, setDeleteSuccess] = useState();
  const isSmallScreen = useMediaQuery('(max-width: 730px)');

  return (
    <>
      <Helmet>
        <title>Members | MUGEMA Admin</title>
      </Helmet>

      <Container>
        {deleteError && (
          <Alert variant="standard" severity="error" sx={{ mt: 2 }}>
            {deleteError}
          </Alert>
        )}
        {deleteSuccess && (
          <Alert variant="standard" severity="success" sx={{ mt: 2 }}>
            {deleteSuccess}
          </Alert>
        )}
        {deleting && (
          <Alert
            variant="standard"
            severity="info"
            icon={<CircularProgress size={20} />}
            sx={{ mt: 2 }}
          >
            {deleting === 'delete' ? 'Deleting' : 'Notifying'}{' '}
            <strong>"{currentApplication.name}"</strong> member ...
          </Alert>
        )}
        <Stack
          direction={isSmallScreen ? 'column' : 'row'}
          alignItems={isSmallScreen ? '' : 'center'}
          justifyContent="space-between"
          // mb={2}
        >
          <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
            Members
          </Typography>
          {currentUserRoleLevel >= 2 &&
            currentUser.role != 'registrar_admin' && (
              <>
                <Button
                  variant="outlined"
                  href="/dashboard/reports"
                  target="_blank"
                  component="a"
                  sx={isSmallScreen ? { mb: 2 } : { mr: 2 }}
                >
                  Payments Report
                </Button>
                <Button
                  variant="outlined"
                  startIcon={
                    <img
                      src={momoLogo}
                      alt="mobile payments"
                      height={25}
                      width={25}
                    />
                  }
                  href={
                    'https://opay-web.oltranz.com/admin/dashboard'
                  }
                  target="_blank"
                  component="a"
                  sx={isSmallScreen ? { mb: 2 } : { mr: 2 }}
                >
                  MOMO / Airtel Money Dashboard
                </Button>
                <Button
                  variant="outlined"
                  href={'https://portal.esicia.com/'}
                  target="_blank"
                  component="a"
                  startIcon={
                    <img
                      src={cardsLogo}
                      alt="bank payments"
                      height={25}
                      width={30}
                    />
                  }
                >
                  Card Payments Dashboard
                </Button>
              </>
            )}
        </Stack>
        <Card sx={{ my: 2 }}>
          <Stack direction={isSmallScreen ? 'column' : 'row'}>
            {PLANS.map(plan => {
              return (
                <Container
                  key={plan}
                  sx={{
                    p: 1,
                    backgroundColor:
                      currentPlan !== plan ? undefined : '#008D41',
                    color: currentPlan !== plan ? undefined : 'white',
                    cursor: 'pointer',
                    boxShadow: 'none',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    '&:hover': {
                      backgroundColor:
                        currentPlan !== plan ? '#d5d5d5' : '#008D41',
                    },
                  }}
                  onClick={() => setCurrentPlan(plan)}
                >
                  {plan === 'all' ? 'All Members' : plan} (
                  {numbers ? numbers[plan] : 0})
                </Container>
              );
            })}
          </Stack>
        </Card>

        <Card>
          <ApplicationListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <DataWidget
            title={
              currentPlan == 'all'
                ? 'members'
                : currentPlan + ' members'
            }
            isLoading={
              applicationLoading &&
              !applicationData?.data?.length &&
              !applicationError
            }
            isError={
              !applicationLoading &&
              !applicationData?.data?.length &&
              applicationError
                ? applicationError
                : null
            }
            isEmpty={
              !applicationLoading &&
              !applicationData?.data?.length &&
              !applicationError
            }
          >
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={applicationList.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {applications.map(row => {
                      const {
                        id,
                        name,
                        status,
                        hasCertificate,
                        isPersonal,
                        createdAt,
                        membershipStatus,
                        paid,
                      } = row;
                      const selectedApplication =
                        selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedApplication}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedApplication}
                              onChange={event =>
                                handleClick(event, name)
                              }
                            />
                          </TableCell>

                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              {/* <Avatar alt={name} src={avatarUrl} /> */}
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          {/* <TableCell align="left">{company}</TableCell> */}

                          <TableCell align="left">
                            <Label
                              color={
                                status === 'rejected' ||
                                status === 'disapproved'
                                  ? 'error'
                                  : status === 'pending'
                                  ? 'info'
                                  : status === 'accepted'
                                  ? 'warning'
                                  : 'success'
                              }
                            >
                              {sentenceCase(status)}
                            </Label>
                          </TableCell>

                          <TableCell align="left">
                            {isPersonal ? 'Personal' : 'Company'}
                          </TableCell>

                          <TableCell align="left">
                            <Label
                              color={
                                hasCertificate ? 'success' : 'error'
                              }
                            >
                              {hasCertificate == true
                                ? 'True'
                                : 'False'}
                            </Label>
                          </TableCell>

                          <TableCell align="left">
                            <Label color={paid ? 'success' : 'error'}>
                              {paid ? 'Paid' : 'Not Paid'}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label
                              color={
                                !paid
                                  ? 'warning'
                                  : membershipStatus === 'active'
                                  ? 'success'
                                  : membershipStatus === 'inactive'
                                  ? 'info'
                                  : 'error'
                              }
                            >
                              {!paid
                                ? 'Not allowed'
                                : membershipStatus}
                            </Label>
                          </TableCell>

                          <TableCell align="left">
                            {createdAt}
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={event =>
                                handleOpenMenu(event, row)
                              }
                            >
                              <Iconify
                                icon={'eva:more-vertical-fill'}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell
                          align="center"
                          colSpan={6}
                          sx={{ py: 3 }}
                        >
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>

                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>
                                &quot;{filterName}&quot;
                              </strong>
                              .
                              <br /> Try checking for typos or using
                              complete words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>
          </DataWidget>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
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
        <MenuItem
          sx={{ color: '#008D41' }}
          onClick={() =>
            nav(`/dashboard/application/${currentApplication.id}`)
          }
        >
          <RemoveRedEyeOutlined sx={{ mr: 2, width: 20 }} />
          Details
        </MenuItem>
        {currentUserRoleLevel >= 2 &&
          currentUser.role !== 'registrar_admin' && (
            <MenuItem
              sx={{ color: 'primary.main' }}
              onClick={() =>
                nav(
                  `/dashboard/application/${currentApplication.id}/payments`,
                )
              }
            >
              <Payment sx={{ mr: 2, width: 20 }} />
              Payments
            </MenuItem>
          )}

        {currentApplication?.paid &&
          currentApplication?.membershipStatus === 'expired' && (
            <MenuItem
              sx={{ color: 'warning.main' }}
              onClick={async () => {
                handleCloseMenu();
                try {
                  setDeleteError();
                  setDeleteSuccess();
                  setDeleting('notify');
                  const result = await paymentService.notifyUser({
                    name: currentApplication.name,
                    email: currentApplication.email,
                    lastPaidMembership:
                      currentApplication.lastPaidMembership,
                  });
                  if (result.status === 200) {
                    setDeleteSuccess(result.data.message);
                  }
                } catch (error) {
                  setDeleteError(
                    error.response?.data?.message ||
                      error.response?.data?.invalidToken ||
                      error.message ||
                      'Something went wrong!',
                  );
                } finally {
                  setDeleting(false);
                }
              }}
            >
              <Mail sx={{ mr: 2, width: 20 }} />
              Notify
            </MenuItem>
          )}

        {(currentApplication?.status === 'disapproved' ||
          currentApplication?.status === 'pending') && (
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={handleOpenModal}
          >
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        )}
      </Popover>
      <ModalDialog
        title="Delete Member?"
        subTitle={`Are you sure do you want to delete this member? `}
        hardWarning={`This action will affect associated membership and payments.`}
        item={currentApplication?.name}
        open={openModal}
        handleClose={handleCloseModal}
        handleClickOk={async () => {
          handleCloseModal();
          try {
            setDeleteError();
            setDeleteSuccess();
            setDeleting('delete');
            const result = await ApplicationService.deleteApplication(
              currentApplication?.id,
            );
            if (result.status === 200) {
              setDeleteSuccess(result.data.message);
              setDeleted(prev => [...prev, currentApplication.id]);
            }
          } catch (error) {
            setDeleteError(
              error.response?.data?.message ||
                error.response?.data?.invalidToken ||
                error.message ||
                'Something went wrong!',
            );
          } finally {
            setDeleting(false);
          }
        }}
      />
    </>
  );
};

const mapStateToProps = state => ({
  payments: state.payment.allApplicationPayments,
  currentUser: state.auth.isAuthenticated.currentUser,
});

const mapDispatchToProps = dispatch => {
  return {
    getPayments: applicationId =>
      dispatch(getPayments(applicationId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApplicationPage);
