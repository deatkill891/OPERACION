import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  typography: {
    fontFamily: ['Infra', 'Arial', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: '#002D6F', // El Azul Deacero será el color "Primary"
    },
    secondary: {
      main: '#FF6B00', // El Naranja será el "Secondary" (para botones de acción)
    },
    text: {
      primary: '#4B4A4B', // Gris oscuro para lectura cómoda
      secondary: '#808081',
    },
    background: {
      default: '#F5F5F5', // Un fondo muy suave para que resalte el contenido
    }
  },
  // Opcional: Redondear un poco menos los botones para que se vea más industrial/serio
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, 
          textTransform: 'none', // Quita las mayúsculas forzadas
          fontWeight: 600
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        }
      }
    }
  },
});