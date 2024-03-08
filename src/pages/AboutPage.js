import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import {
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
} from '@mui/material';
import DataWidget from 'src/components/widgets/DataWidget';
import ChooseFileImage from 'src/components/Global/files/ChooseFileImage';
import { useFetcher } from 'src/api/fetcher';
import API from 'src/api/_api_';
import toast from 'react-hot-toast';

const initState = { loading: false, error: null };

const initialFormData = {
  description: '',
  yearsOfExperience: '',
  completedProjects: '',
  companiesWork: '',
  cv: '',
  image: '',
};

const AboutPage = () => {
  const { data, isLoading, isSuccess, isError, refetch } = useFetcher(
    '/about/getAboutContent',
  );
  const [aboutContent, setAboutContent] = useState(null);
  const [state, setState] = useState(initState);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isSuccess) {
      setAboutContent(data?.aboutContent[0]);
    }
  }, [isSuccess]);
  
  useEffect(() => {
    if (aboutContent) {
      setFormData({
        description: aboutContent?.description,
        yearsOfExperience: aboutContent?.yearsOfExperience,
        completedProjects: aboutContent?.completedProjects,
        companiesWork: aboutContent?.companiesWork,
        cv: aboutContent?.cv,
        image: aboutContent?.image,
      });
    }
  }, [aboutContent]);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true }));
    try {
      if (aboutContent) {
        await toast.promise(
          API.patch(`/about/updateAbout?id=${aboutContent?._id}`, formData),
          {
            loading: `Updating content, please wait...`,
            success: `Content updated successfully!`,
            error: `There was an error while updating this content!`,
          },
          { position: 'top-center' },
        );
        refetch();
      } else {
        await toast.promise(
          API.post(`/about/addAbout`, formData),
          {
            loading: `Adding content, please wait...`,
            success: `Content added successfully!`,
            error: `There was an error while adding about content!`,
          },
          { position: 'top-center' },
        );
        refetch();
      }
    } catch (e) {
      setState(prev => ({
        ...prev,
        error:
          e.message || 'Unknown error occured, please try again.',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: About | MUGEMA </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          spacing={1}
          flexShrink={0}
          sx={{ my: 1, mb: 5 }}
          justifyContent="space-between"
        >
          <Typography variant="h4">About Content</Typography>
        </Stack>
        <DataWidget
          title={'About Content'}
          isLoading={isLoading}
          isError={isError}
        >
          <Stack spacing={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
            <Grid item xs={6}>
                <TextField
                  name='description'
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  required
                  multiline
                  rows={12}
                />
              </Grid>
              <Grid item xs={6}>
                <ChooseFileImage
                  title="Image"
                  onSelect={e =>
                    setFormData(prev => ({ ...prev, image: e }))
                  }
                  selected={formData.image}
                  error={isError}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name='yearsOfExperience'
                  label="Years of Experience"
                  type='number'
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name='completedProjects'
                  label="Completed Projects"
                  type='number'
                  value={formData.completedProjects}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name='companiesWork'
                  label="Companies Work"
                  type='number'
                  value={formData.companiesWork}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <ChooseFileImage
                  title="CV"
                  onSelect={e =>
                    setFormData(prev => ({ ...prev, cv: e }))
                  }
                  selected={formData.cv}
                  error={isError}
                />
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={6}>
                {!state.loading ? (
                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    color="primary"
                    onClick={handleSubmit}
                    variant="outlined"
                  >
                    Update Content
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    size="large"
                    color="primary"
                    variant="outlined"
                  >
                    <CircularProgress color="primary" size={20} />
                    &nbsp; Update Content
                  </Button>
                )}
              </Grid>
            </Grid>
          </Stack>
        </DataWidget>
      </Container>
    </>
  );
};

export default AboutPage;
