import React, { useState } from 'react';
import { Box, Tabs, Tab, Container, Typography } from '@mui/material';
import { Flame, History, HardHat, FileText } from 'lucide-react';
import { CapturaForm } from '../components/CapturaForm';
import { HistorialView } from '../components/HistorialView';
// IMPORTAR LOS NUEVOS COMPONENTES
import { ParticipacionView } from '../components/ParticipacionView';
import { FasesAfinoView } from '../components/FasesAfinoView';

interface TabPanelProps {
  readonly children?: React.ReactNode;
  readonly index: number;
  readonly value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other} className="py-6">
      {value === index && (
        <Box className="animate-fadeIn">
          {children}
        </Box>
      )}
    </div>
  );
}

export const AceriaPage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box className="mb-6 border-b border-gray-200">
          <Typography variant="h4" className="font-black text-deacero-blue mb-2">
              Bitácora EAD - Fusión HF 1 y 2
          </Typography>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="aceria tabs" 
            sx={{ 
                '& .MuiTab-root': { fontWeight: 'bold', textTransform: 'none', fontSize: '1rem' },
                '& .Mui-selected': { color: '#FF6B00 !important' },
                '& .MuiTabs-indicator': { backgroundColor: '#FF6B00' }
            }}
          >
            <Tab icon={<FileText size={20}/>} iconPosition="start" label="Captura (Técnico)" />
            <Tab icon={<History size={20}/>} iconPosition="start" label="Historial" />
            <Tab icon={<HardHat size={20}/>} iconPosition="start" label="Participación" />
            <Tab icon={<Flame size={20}/>} iconPosition="start" label="Fases Afino" />
          </Tabs>
      </Box>

      {/* PESTAÑA 1: CAPTURA */}
      <TabPanel value={tabIndex} index={0}>
        <CapturaForm />
      </TabPanel>

      {/* PESTAÑA 2: HISTORIAL */}
      <TabPanel value={tabIndex} index={1}>
        <HistorialView />
      </TabPanel>

      {/* PESTAÑA 3: PARTICIPACIÓN (NUEVO) */}
      <TabPanel value={tabIndex} index={2}>
        <ParticipacionView />
      </TabPanel>

      {/* PESTAÑA 4: FASES AFINO (NUEVO) */}
      <TabPanel value={tabIndex} index={3}>
        <FasesAfinoView />
      </TabPanel>
    </Container>
  );
};