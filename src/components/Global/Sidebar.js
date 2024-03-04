import PropTypes from "prop-types";
import {
  Box,
  Stack,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { IconCirclePlus, IconSquareRoundedX } from "@tabler/icons-react";
import Scrollbar from "./scrollbar/Scrollbar";

// ----------------------------------------------------------------------

Sidebar.propTypes = {
  openSidebar: PropTypes.bool,
  onOpenSidebar: PropTypes.func,
  onCloseSidebar: PropTypes.func,
};

export default function Sidebar({
  openSidebar,
  onOpenSidebar,
  onCloseSidebar,
  children,
  handleSubmit = () => {},
  title = "Add Data",
  state = {},
  hideButton = false,
}) {
  return (
    <>
      {!hideButton && (
        <Button
          sx={{ mt: 2 }}
          onClick={onOpenSidebar}
          variant="outlined"
          startIcon={<IconCirclePlus />}
          color="secondary"
        >
          {title}
        </Button>
      )}

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
          <Typography variant="h4" sx={{ ml: 1 }}>
            {title}
          </Typography>
          <IconButton onClick={onCloseSidebar}>
            <IconSquareRoundedX />
          </IconButton>
        </Stack>
        {state.error && (
          <Alert variant="standard" severity="error" sx={{}}>
            {state.error}
          </Alert>
        )}
        <Divider />
        <Scrollbar>
          <Stack spacing={2} sx={{ p: 2 }}>
            {children}
          </Stack>
        </Scrollbar>
        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={state.loading ? null : handleSubmit}
            startIcon={
              state.loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : undefined
            }
          >
            {state.loading ? "Loading..." : title}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
