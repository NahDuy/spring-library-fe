import { createTheme } from "@mui/material/styles";

// Define colors separately to avoid circular references
const COLORS = {
  primary: {
    main: "#1a237e", // Deep Royal Blue
    light: "#534bae",
    dark: "#000051",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#ffca28", // Amber/Gold
    light: "#fffd61",
    dark: "#c79a00",
    contrastText: "#000000",
  },
  background: {
    default: "#f0f2f5", // Light Gray for contrast
    paper: "#ffffff",
  },
  text: {
    primary: "#1a237e", // Dark Blue text for readability
    secondary: "#5c6bc0",
  }
};

const theme = createTheme({
  palette: COLORS,
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 800, color: COLORS.primary.main },
    h2: { fontWeight: 800, color: COLORS.primary.main },
    h3: { fontWeight: 700, color: COLORS.primary.main },
    h4: { fontWeight: 700, color: COLORS.primary.main },
    h5: { fontWeight: 600, color: COLORS.primary.main },
    h6: { fontWeight: 600, color: COLORS.primary.main },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16, // Modern rounded corners
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30, // Pill shape
          padding: "10px 24px",
          boxShadow: "0 4px 6px rgba(26, 35, 126, 0.1)",
          transition: "all 0.3s ease",
          fontSize: "1rem",
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${COLORS.primary.main} 30%, ${COLORS.primary.light} 90%)`,
          "&:hover": {
            boxShadow: "0 6px 12px rgba(26, 35, 126, 0.3)",
            transform: "translateY(-2px)",
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          "&:hover": { borderWidth: 2 },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)", // Glass shadow
          backdropFilter: "blur(8px)",
          background: "rgba(255, 255, 255, 0.8)", // Glass effect
          border: "1px solid rgba(255, 255, 255, 0.18)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // Disable default dark mode overlay
          borderRadius: 20,
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          color: COLORS.primary.main,
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

export default theme;
