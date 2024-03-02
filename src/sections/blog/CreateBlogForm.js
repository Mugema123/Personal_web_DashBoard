import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';
import RichTextEditor from 'src/components/blog/RichTextEditor';
import ChooseFileImage from 'src/components/Global/files/ChooseFileImage';
import { useMemo, useState, useRef } from 'react';
import { useFetcher } from 'src/api/fetcher';

const CreateBlogForm = ({ onCreate, loading, data: editData }) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useMemo(() => {
    if (editData) {
      // console.log(editData);
      setTitle(editData.title);
      setCategory(editData.categoryDetails._id);
      setBody(editData.postBody);
      setImage(editData.postImage);
      setIsPublic(editData.isPublic || false);
    }
  }, [editData]);

  //Errors
  const [formError, setFormError] = useState(null);

  const {
    data: categoriesData,
    isError,
    isLoading,
  } = useFetcher(`/posts/getAllCategories`);

  const categories = useMemo(() => {
    return categoriesData?.allCategories || [];
  }, [categoriesData?.allCategories]).map(item => {
    return {
      id: item._id,
      name: item.name,
    };
  });

  const handleSubmit = e => {
    e.preventDefault();
    const validation = {
      title: !title ? 'Title required' : false,
      image: !image ? 'Featured image required' : false,
      category: !category ? true : false,
      body:
        !body || body.length < 10 ? 'Blog details required' : false,
    };

    if (!Object.values(validation).every(val => !val)) {
      setFormError(validation);
      return;
    }

    const blogData = {
      title,
      postImage: image,
      postBody: body,
      category,
      isPublic,
    };
    if (editData) {
      onCreate({
        ...blogData,
        postImage:
          blogData.postImage === editData.postImage
            ? undefined
            : blogData.postImage,
      });
      return;
    }
    onCreate(blogData);
  };

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <TextField
        label="Blog Title"
        color="secondary"
        fullWidth
        required
        sx={{ my: 1 }}
        value={title}
        onChange={e => setTitle(e.target.value)}
        error={Boolean(formError?.title)}
      />
      <FormControl fullWidth sx={{ my: 1 }}>
        <InputLabel id="demo-simple-select-label">
          Blog Category
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
          label="Select Category"
          error={Boolean(formError?.category)}
        >
          {categories.map((item, index) => {
            return (
              <MenuItem value={item.id} key={index}>
                {item.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Typography variant="caption" sx={{ mx: 2, mb: 1 }}>
        Blog Details
      </Typography>

      <RichTextEditor
        onChange={html => setBody(html)}
        placeholder="Start typing blog details..."
        html={body}
      />

      {formError?.body && (
        <Typography variant="caption" color="error">
          {formError.body}
        </Typography>
      )}

      <ChooseFileImage
        title="Feature Image"
        selected={image}
        onSelect={sel => setImage(sel)}
        error={formError?.image}
      />

      <div></div>

      <FormControl sx={{ my: 1 }}>
        <FormLabel>Choose option</FormLabel>
        <RadioGroup
          value={isPublic}
          onChange={e => setIsPublic(e.target.value)}
        >
          <FormControlLabel
            value={false}
            control={<Radio />}
            label="Save privately"
          />
          <FormControlLabel
            value={true}
            control={<Radio />}
            label="Publish immediately"
          />
        </RadioGroup>
      </FormControl>
      <div></div>
      <Button
        type="submit"
        color="secondary"
        variant="contained"
        endIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <KeyboardArrowRight />
          )
        }
      >
        Submit
      </Button>
    </form>
  );
};

export default CreateBlogForm;
