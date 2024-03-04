import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  Alert,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Scrollbar from '../components/scrollbar';
// sections
import {
  UserListHead,
  UserListTile,
  UserListToolbar,
} from '../sections/user';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  getUsers,
  deleteUser,
  editRole,
} from 'src/redux/actions/user';
import { DELETE_USER } from 'src/redux/actionTypes';
import EmailUsersSidebar from 'src/sections/user/EmailUsersSidebar';
import DataWidget from 'src/components/widgets/DataWidget';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'type', label: 'Account Type', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
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

const UsersPage = ({
  users,
  getUsers,
  deleteUser,
  message,
  editRole,
  loading,
  error,
  currentUser,
}) => {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (users.length === 0) {
      getUsers();
    }
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = users.map(n => n.name);
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

  useEffect(() => {
    if (message?.action === DELETE_USER) {
      setSuccess(message.success);
      // console.log(message.success);
    }
  }, [message]);

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - users.length)
      : 0;

  const filteredUsers = applySortFilter(
    users,
    getComparator(order, orderBy),
    filterName,
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  const [openAuthorSidebar, setOpenAuthorSidebar] = useState(false);

  const handleOpenAuthorSidebar = () => {
    setOpenAuthorSidebar(true);
  };

  const handleCloseAuthorSidebar = () => {
    setOpenAuthorSidebar(false);
  };

  return (
    <>
      <Helmet>
        <title> Users | MUGEMA</title>
      </Helmet>

      <Container>
        {success && (
          <Alert variant="standard" severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
          <EmailUsersSidebar
            openSidebar={openAuthorSidebar}
            onOpenSidebar={handleOpenAuthorSidebar}
            onCloseSidebar={handleCloseAuthorSidebar}
          />
        </Stack>

        <Card>
          <DataWidget
            title={'Users'}
            isLoading={loading && !users.length && !error}
            isError={
              !loading && error && !users.length ? error : null
            }
            isEmpty={!error && !loading && !users.length}
          >
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={users.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map(row => {
                        const selectedUser =
                          selected.indexOf(row.name) !== -1;

                        return (
                          <UserListTile
                            user={row}
                            selectedUser={selectedUser}
                            key={row._id}
                            onCheckBoxClicked={event =>
                              handleClick(event, row.name)
                            }
                            editRole={editRole}
                            currentUserId={currentUser._id}
                            currentUserRole={currentUser.role}
                            deleteUser={deleteUser}
                          />
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
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

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </DataWidget>
        </Card>
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  users: state.user.users,
  message: state.user.message,
  loading: state.user.loading,
  error: state.user.error,
  currentUser: state.auth.isAuthenticated.currentUser,
});

const mapDispatchToProps = dispatch => {
  return {
    getUsers: () => dispatch(getUsers()),
    deleteUser: id => dispatch(deleteUser(id)),
    editRole: (id, body) => dispatch(editRole(id, body)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UsersPage);
