import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMediaQuery } from '@mui/material';
import { newsService } from './services/newsService';
import { jobService } from './services/jobService';
import { careerAdvisor } from './services/aiAgents';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import NewsFeed from './components/NewsFeed';
import JobBoard from './components/JobBoard';
import CareerPath from './components/CareerPath';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Create responsive theme
const createResponsiveTheme = (prefersDarkMode: boolean) => createTheme({
  palette: {
    mode: prefersDarkMode ? 'dark' : 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '16px',
          '@media (max-width:600px)': {
            padding: '8px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          margin: '16px 0',
          '@media (max-width:600px)': {
            margin: '8px 0',
          },
        },
      },
    },
  },
});

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize services
        await Promise.all([
          newsService.fetchAndStoreNews(),
          jobService.fetchAndStoreJobs()
        ]);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          color: prefersDarkMode ? '#fff' : '#000'
        }}>
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={createResponsiveTheme(prefersDarkMode)}>
        <CssBaseline />
        <Router>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            maxWidth: '100vw',
            overflowX: 'hidden'
          }}>
            <ResponsiveAppBar />
            <main style={{ 
              flex: 1, 
              padding: '20px',
              '@media (max-width:600px)': {
                padding: '10px',
              }
            }}>
              <Routes>
                <Route path="/" element={<NewsFeed />} />
                <Route path="/jobs" element={<JobBoard />} />
                <Route path="/career" element={<CareerPath />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
