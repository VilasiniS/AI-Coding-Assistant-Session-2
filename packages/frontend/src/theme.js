import { createTheme } from '@mui/material/styles';

// Pastel color palette based on UI guidelines
const theme = createTheme({
  palette: {
    primary: {
      main: '#A8D8FF',
      light: '#C8E6FE',
      dark: '#7EBEE6',
      contrastText: '#333333'
    },
    secondary: {
      main: '#D4A5FF',
      light: '#E5C8FF',
      dark: '#B680FF',
      contrastText: '#333333'
    },
    success: {
      main: '#B8E6D5',
      light: '#D4F2E8',
      dark: '#88D0B7'
    },
    warning: {
      main: '#FFF4A8',
      light: '#FFFDD0',
      dark: '#FFE680'
    },
    error: {
      main: '#FFD4E5',
      light: '#FFE8F0',
      dark: '#FFA8C8'
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#333333',
      secondary: '#666666'
    },
    divider: '#D0D0D0'
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h1: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h3: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.2
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5
    },
    button: {
      fontSize: '14px',
      fontWeight: 600,
      textTransform: 'none'
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.4
    }
  },
  spacing: (factor) => `${4 * factor}px`,
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 12px',
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '14px',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(168, 216, 255, 0.3)'
          }
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:active': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            padding: '8px 12px',
            fontSize: '16px'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 'auto',
          padding: '4px 8px',
          fontSize: '12px'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid #333333`,
            outlineOffset: '2px'
          }
        }
      }
    }
  }
});

export default theme;
