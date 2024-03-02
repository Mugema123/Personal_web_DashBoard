import PropTypes from "prop-types";

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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
} from "@mui/material";
// components
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
import ChooseMultipleImages from "src/components/Global/files/ChooseMultipleImages";
import { useEffect, useState } from "react";
import { ADD_PROJECT, EDIT_PROJECT } from "src/redux/actionTypes";

const categories = [
  "Urban Planning",
  "Technology",
  "GIS & Remote sensing",
  "Infographic and Design",
  "Other",
];

//Comparing two objects and return new
function compareObj(obj1, obj2) {
  const uniqueObj = Object.entries(obj2).reduce((acc, [key, value]) => {
    if (obj1[key] !== value) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return {
    ...uniqueObj,
    otherProjectImages:
      arraysEqual(obj1.otherProjectImages, obj2.otherProjectImages) === true
        ? undefined
        : obj2.otherProjectImages,
  };
}

function arraysEqual(arr1, arr2) {
  // Check if arrays have same length
  if (arr1?.length !== arr2.length) {
    return false;
  }

  // Check if all elements are equal
  return arr1.every((element, index) => element === arr2[index]);
}
// ----------------------------------------------------------------------

CreateProjectSidebar.propTypes = {
  openSidebar: PropTypes.bool,
  onOpenSidebar: PropTypes.func,
  onCloseSidebar: PropTypes.func,
};

export default function CreateProjectSidebar({
  openSidebar,
  onOpenSidebar,
  onCloseSidebar,
  onSubmit,
  errorApi,
  message,
  data,
  onEditSubmitted,
}) {
  //Declaring states varibales
  const [projectName, setProjectName] = useState("");
  const [projectCategory, setProjectCategory] = useState({
    value: "",
    labels: categories,
  });
  const [projectEmployer, setProjectEmployer] = useState("");
  const [projectClient, setProjectClient] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectYear, setProjectYear] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectActivities, setProjectActivities] = useState("");
  const [projectResults, setProjectResults] = useState("");
  const [projectImages, setProjectImages] = useState([]);

  //Error state
  const [error, setError] = useState();
  //Loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError();
    if (
      !projectName ||
      !projectCategory ||
      !projectEmployer ||
      !projectClient ||
      !projectLocation ||
      !projectYear ||
      !projectDescription ||
      !projectActivities
    ) {
      setError("All fields are required please");
      return;
    }
    if (projectImages.length < 2) {
      setError("Please upload project images (2)");
      return;
    }
    setError();
    setLoading(true);
    if (!data) {
      onSubmit({
        title: projectName,
        description: projectDescription,
        activitiesPerformed: projectActivities,
        result: projectResults,
        employer: projectEmployer,
        year: projectYear,
        location: projectLocation,
        client: projectClient,
        category: projectCategory.value,
        projectImage: projectImages[0],
        otherProjectImages: projectImages.filter((_, index) => index !== 0),
      });
    } else {
      const editedData = {
        title: projectName,
        description: projectDescription,
        activitiesPerformed: projectActivities,
        result: projectResults,
        employer: projectEmployer,
        year: projectYear,
        location: projectLocation,
        client: projectClient,
        category: projectCategory.value,
        projectImage: projectImages[0] || undefined,
        otherProjectImages:
          projectImages.filter((_, index) => index !== 0) || undefined,
      };

      onEditSubmitted(compareObj(data, editedData));
    }
  };

  useEffect(() => {
    setLoading(false);
    if (message?.action === ADD_PROJECT && !data) {
      setProjectName("");
      setProjectCategory({ value: "", labels: projectCategory.labels });
      setProjectEmployer("");
      setProjectClient("");
      setProjectLocation("");
      setProjectYear("");
      setProjectDescription("");
      setProjectActivities("");
      setProjectResults("");
      setProjectImages([]);
    }
    if (message?.action === EDIT_PROJECT) {
      setProjectName("");
      setProjectCategory({ value: "", labels: projectCategory.labels });
      setProjectEmployer("");
      setProjectClient("");
      setProjectLocation("");
      setProjectYear("");
      setProjectDescription("");
      setProjectActivities("");
      setProjectResults("");
      setProjectImages([]);
    }
    if (data) {
      setProjectName(data.title);
      setProjectCategory({
        value: data.category,
        labels: [data.category, ...projectCategory.labels].filter(
          (_, i) => projectCategory.labels.indexOf(i) !== i
        ),
      });
      setProjectEmployer(data.employer);
      setProjectClient(data.client || "");
      setProjectLocation(data.location);
      setProjectYear(data.year);
      setProjectDescription(data.description);
      setProjectActivities(data.activitiesPerformed);
      setProjectResults(data.result);
      if (data.otherProjectImages?.length > 0) {
        setProjectImages([data.projectImage, ...data.otherProjectImages] || []);
      } else {
        setProjectImages([data.projectImage] || []);
      }
    } else {
      setProjectName("");
      setProjectCategory({ value: "", labels: categories });
      setProjectEmployer("");
      setProjectClient("");
      setProjectLocation("");
      setProjectYear("");
      setProjectDescription("");
      setProjectActivities("");
      setProjectResults("");
      setProjectImages([]);
    }
  }, [message, data]);

  useEffect(() => {
    setError(
      errorApi?.action === ADD_PROJECT || errorApi?.action === EDIT_PROJECT
        ? errorApi?.message
        : ""
    );
    setLoading(false);
  }, [errorApi]);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={() => onOpenSidebar()}
      >
        New Project
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
            {data ? "Edit" : "Create"} Project
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
              label="Project Name"
              color="secondary"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              fullWidth
              required
            />

            <FormControl fullWidth sx={{ my: 1 }}>
              <InputLabel id="demo-simple-select-label">
                Project Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={projectCategory.value}
                onChange={(e) =>
                  setProjectCategory({
                    ...projectCategory,
                    value: e.target.value,
                  })
                }
                label="Select Category"
                required
              >
                {projectCategory.labels.map((label, index) => {
                  return (
                    <MenuItem value={label} key={index}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <TextField
              label="Project Employer"
              color="secondary"
              value={projectEmployer}
              onChange={(e) => setProjectEmployer(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Project Client"
              color="secondary"
              value={projectClient}
              onChange={(e) => setProjectClient(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Project Location"
              color="secondary"
              value={projectLocation}
              onChange={(e) => setProjectLocation(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Project Year"
              type="number"
              color="secondary"
              value={projectYear}
              onChange={(e) => setProjectYear(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Project Description"
              color="secondary"
              fullWidth
              required
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              multiline
              rows={6}
            />
            <TextField
              label="What We Did"
              color="secondary"
              fullWidth
              value={projectActivities}
              onChange={(e) => setProjectActivities(e.target.value)}
              required
              multiline
              rows={6}
            />
            <TextField
              label="Results"
              color="secondary"
              value={projectResults}
              onChange={(e) => setProjectResults(e.target.value)}
              fullWidth
              required
              multiline
              rows={6}
            />
            <ChooseMultipleImages
              selected={projectImages || []}
              imagesSelected={(images) => setProjectImages(images)}
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
              {data ? "Update" : "Submit"} Project
            </Button>
          ) : (
            <Button fullWidth size="large" color="inherit" variant="outlined">
              <CircularProgress color="inherit" size={20} />
              &nbsp; {data ? "Updating" : "Creating"} Project
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
}
