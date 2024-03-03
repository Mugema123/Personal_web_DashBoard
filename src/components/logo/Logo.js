import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Link } from "@mui/material";

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const logo = (
    <Box
      ref={ref}
      component="div"
      style={{
        display: "inline-flex",
        ...sx,
      }}
      {...other}
    >
      <h4 style={{ fontSize: "2.5rem", textTransform: "uppercase", fontWeight: "bold", height: "10px", marginTop: "0px", color: "#0891B2" }}>
        Mu<span style={{ color: "#2065D1" }}>ge</span>ma
      </h4>
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
