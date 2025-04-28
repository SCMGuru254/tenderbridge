import { Card, CardContent, CardMedia, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  id: string;
}

const NewsCard = ({ title, description, imageUrl, date, id }: NewsCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card 
      component={RouterLink}
      to={`/news/${id}`}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      <CardMedia
        component="img"
        height={isMobile ? 140 : 200}
        image={imageUrl}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          gutterBottom 
          variant={isMobile ? "h6" : "h5"} 
          component="h2"
          sx={{ 
            fontWeight: 'bold',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
          }}
        >
          {description}
        </Typography>
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary">
            {new Date(date).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewsCard; 