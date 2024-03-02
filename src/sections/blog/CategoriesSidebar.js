import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';

import { useFetcher } from 'src/api/fetcher';
import { BlogService } from 'src/api';
import CategoriesList from './CategoriesList';

// ----------------------------------------------------------------------

CategoriesSidebar.propTypes = {
  openSidebar: PropTypes.bool,
  onOpenSidebar: PropTypes.func,
  onCloseSidebar: PropTypes.func,
};

export default function CategoriesSidebar({
  openSidebar,
  onOpenSidebar,
  onCloseSidebar,
}) {
  //----------------------------------------------------------------
  const [categories, setCategories] = useState([]);
  const {
    data: categoriesData,
    isError,
    isLoading,
  } = useFetcher(`/posts/getAllCategories`);

  useMemo(() => {
    return setCategories(categoriesData?.allCategories || []);
  }, [categoriesData?.allCategories]);

  //----------------------------------------------------------------
  const [editing, setEditing] = useState(null);
  //----------------------------------------------------------------
  const [name, setName] = useState('');

  //Error state
  const [error, setError] = useState();
  //Loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError();
    if (!name) {
      setError('Category name is required');
      return;
    }
    setError();
    if (editing) {
      handleEdit(editing, name);
      return;
    }
    try {
      setLoading(true);
      const res = await BlogService.addCategory({ name });
      setName('');
      setCategories(prev => [...prev, res.data.categoryContent]);
    } catch (error) {
      setError('Failed to add new category, try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      setError(null);
      const res = await BlogService.deleteCategory(id);
      if (res.data.successMessage) {
        setCategories(prev => prev.filter(c => c._id !== id));
      }
    } catch (error) {
      setError('Delete failed, try again later');
    }
  };

  const handleEdit = async (id, newCategoryName) => {
    try {
      setError(null);
      setLoading(true);
      const res = await BlogService.editCategory(id, newCategoryName);
      if (res.data.successMessage) {
        setCategories(prev =>
          prev.map(category =>
            category._id === res.data.categoryContent._id
              ? res.data.categoryContent
              : category,
          ),
        );
      }
      setEditing(null);
    } catch (error) {
      setError('Edit category failed, try again later');
    } finally {
      setLoading(false);
    }
  };

  useMemo(() => {
    if (editing) {
      setName(
        categories.filter(category => category._id === editing)[0]
          .name,
      );
    } else {
      setName('');
    }
  }, [editing]);

  return (
    <>
      <Button
        onClick={onOpenSidebar}
        variant="outlined"
        color="secondary"
        size="small"
      >
        Categories
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
            Categories
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
          <Stack spacing={3} sx={{ px: 3 }}>
            <CategoriesList
              categories={categories}
              disabled={editing}
              onDelete={categoryId => {
                handleDelete(categoryId);
              }}
              onEdit={categoryId => {
                if (editing) return;
                setEditing(categoryId);
              }}
            />
            <form onSubmit={handleSubmit}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {!editing ? 'Add new' : 'Edit'} category
              </Typography>
              <TextField
                label="Name"
                color="secondary"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                required
              />
              <Box sx={{ py: 2 }}>
                <Stack direction="row" spacing={2}>
                  {editing && !loading && (
                    <Button
                      color="error"
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => {
                        setError('');
                        setEditing(null);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  {!loading ? (
                    <Button
                      fullWidth
                      size="large"
                      type="submit"
                      color="inherit"
                      variant="outlined"
                    >
                      {editing ? 'Update' : 'Submit'}
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      size="large"
                      color="inherit"
                      variant="outlined"
                    >
                      <CircularProgress color="inherit" size={20} />
                      &nbsp; {editing ? 'Updating...' : 'Creating'}
                    </Button>
                  )}
                </Stack>
              </Box>
            </form>
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
