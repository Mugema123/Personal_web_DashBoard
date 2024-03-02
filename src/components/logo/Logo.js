import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Box, Link } from "@mui/material";
import logoImg from "../../assets/logo/logo.png";

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 150,

        display: "inline-flex",
        ...sx,
      }}
      {...other}
    >
      <img src={logoImg} alt="Logo Logo" />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link
      to="/"
      component={RouterLink}
      sx={{ display: "contents", background: "#000" }}
    >
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
