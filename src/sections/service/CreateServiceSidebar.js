import PropTypes from "prop-types";
import { useEffect, useState } from "react";
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
} from "@mui/material";
// components
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import { ADD_SERVICE, EDIT_SERVICE } from "src/redux/actionTypes";

// ----------------------------------------------------------------------

CreateServiceSidebar.propTypes = {
  openSidebar: PropTypes.bool,
  onOpenSidebar: PropTypes.func,
  onCloseSidebar: PropTypes.func,
};

export default function CreateServiceSidebar({
  openSidebar,
  onOpenSidebar,
  onCloseSidebar,
  onSubmit,
  data,
  errorApi,
  message,
}) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  //Error state
  const [error, setError] = useState();
  //Loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError();
    if (!title || !details) {
      setError("Title and details are required");
      return;
    }

    setError();
    setLoading(true);
    if (!data) {
      onSubmit({
        create: true,
        data: { serviceTitle: title, serviceDescription: details },
      });
    } else {
      onSubmit({
        create: false,
        data: { serviceTitle: title, serviceDescription: details },
      });
    }
  };

  useEffect(() => {
    setLoading(false);
    if (message?.action === ADD_SERVICE && !data) {
      setTitle("");
      setDetails("");
    }
    if (message?.action === EDIT_SERVICE) {
      setTitle("");
      setDetails("");
    }
    if (data) {
      setTitle(data.serviceTitle);
      setDetails(data.serviceDescription);
    } else {
      setTitle("");
      setDetails("");
    }
  }, [data, message]);

  useEffect(() => {
    setError(
      errorApi?.action === ADD_SERVICE || errorApi?.action === EDIT_SERVICE
        ? errorApi?.message
        : ""
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
        Add Service
      </Button>

      <Drawer
        anchor="right"
        open={openSidebar}
        onClose={onCloseSidebar}
        PaperProps={{
          sx: { width: 320, border: "none", overflow: "hidden" },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            {data ? "Update" : "Create"} Service
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
              label="Title"
              color="secondary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Details"
              color="secondary"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              fullWidth
              required
              multiline
              rows={5}
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
              {data ? "Update" : "Submit"}
            </Button>
          ) : (
            <Button fullWidth size="large" color="inherit" variant="outlined">
              <CircularProgress color="inherit" size={20} />
              &nbsp; {data ? "Updating" : "Creating"}
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
}
