import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00F5D4",
      light: "#69fff9",
      dark: "#00c1a3",
    },
    secondary: {
      main: "#FF00E1",
      light: "#ff69f5",
      dark: "#c600af",
    },
    background: {
      default: "#0D0C1D",
      paper: "#1A1A2E",
    },
    text: {
      primary: "#F0F0F0",
      secondary: "#A9A9A9",
    },
    success: {
      main: "#2EFF7B",
    },
    warning: {
      main: "#FFD60A",
    },
    error: {
      main: "#FF4D6D",
    },
  },
  typography: {
    fontFamily: "var(--font-noto-sans-jp)",
    h1: {
      fontFamily: "var(--font-orbitron)",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "var(--font-orbitron)",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "var(--font-orbitron)",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          borderRadius: "6px",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        containedPrimary: {
          boxShadow: "0 0 15px 0 rgba(0, 245, 212, 0.5)",
          "&:hover": {
            boxShadow: "0 0 25px 5px rgba(0, 245, 212, 0.5)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1A1A2E",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          transition: "border-color 0.3s ease",
          "&:hover": {
            borderColor: "rgba(0, 245, 212, 0.5)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            borderRadius: "8px",
            transition: "box-shadow 0.3s ease",
            "&.Mui-focused": {
              boxShadow: `0 0 10px 2px rgba(0, 245, 212, 0.6)`,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(13, 12, 29, 0.8)",
          backdropFilter: "blur(12px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
});
