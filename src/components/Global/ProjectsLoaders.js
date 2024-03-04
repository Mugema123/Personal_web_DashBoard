import { Box, CardActions, Grid, Skeleton } from '@mui/material';

const ProjectsLoaders = () => {
    return (
        <Grid container spacing={3} sx={{ my: 1 }}>
            {new Array(16).fill(0).map((_, index) => {
                return (
                    <Grid key={index} item xs={12} sm={6} md={3}>
                        <Box key={index} sx={{ width: '100%' }}>
                            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} animation="wave" />
                            <Box sx={{ pt: 0.5 }}>
                                <Skeleton height={25} />
                                <Skeleton width="60%" height={25} />
                            </Box>
                            <CardActions sx={{ py: 1, px: 0 }}>
                                <Skeleton width="35%" height={40} />
                                <Skeleton width="35%" height={40} />
                            </CardActions>
                        </Box>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default ProjectsLoaders;
