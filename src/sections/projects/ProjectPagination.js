import { Circle } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import React from "react";

const ProjectPagination = ({ details, onPrev, onNext }) => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      sx={{ my: 4 }}
      spacing={0.5}
    >
      <Button
        variant="contained"
        size="small"
        sx={{
          backgroundColor: "#008D41",
          "&:hover": { backgroundColor: "#008D41" },
        }}
        disabled={1 === details.currentPage}
        onClick={() => onPrev(details.currentPage - 1)}
      >
        Prev
      </Button>
      {new Array(details.totalPages).fill(0).map((_, index) => {
        return (
          <Circle
            key={index}
            sx={{
              width: 18,
              color: details.currentPage === index + 1 ? "#008D41" : "#d2d2d2",
            }}
            onClick={
              details.currentPage === index + 1 ? null : () => onNext(index + 1)
            }
          />
        );
      })}

      <Button
        variant="contained"
        size="small"
        sx={{
          backgroundColor: "#008D41",
          "&:hover": { backgroundColor: "#008D41" },
        }}
        disabled={details.totalPages === details.currentPage}
        onClick={() => onNext(details.currentPage + 1)}
      >
        Next
      </Button>
    </Stack>
  );
};

export default ProjectPagination;
