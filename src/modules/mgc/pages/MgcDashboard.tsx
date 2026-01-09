import React, { useState, useEffect } from 'react';
import { 
  AppBar, Typography, Box, Container, Paper, Grid as Grid, 
  LinearProgress, Button, Card, CardContent, Menu, MenuItem, ListItemText,
  List, ListItem, Divider, Fade, useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
//import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'; 
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArticleIcon from '@mui/icons-material/Article';

// --- IMPORTACIONES DE IMÁGENES LOCALES ---
import logoDeacero from '../assets/deacero.png';
import sgcd from '../assets/logo1.png';
import gestion from '../assets/gestion.jpg';
import shingo from '../assets/shingo.png';
import img1 from '../assets/carrousel/1.png';
import img2 from '../assets/carrousel/2.png';
import img3 from '../assets/carrousel/3.png';
import img4 from '../assets/carrousel/4.png';

// ==========================================
// DATOS SIMULADOS (Carrusel y Noticias)
// ==========================================

const carouselImages = [
    img1, 
    img2, 
    img3,
    img4,
];

const simulatedNews = [
    { id: 1, title: "Nueva certificación ISO 50001 obtenida en Planta Celaya", date: "09/01/2026", summary: "Reforzando nuestro compromiso con la eficiencia energética." },
    { id: 2, title: "Récord de producción mensual superado en Laminación", date: "05/01/2026", summary: "Gracias al esfuerzo conjunto y las mejoras en el proceso." },
    { id: 3, title: "Próxima auditoría de seguimiento programada", date: "28/12/2025", summary: "Preparativos para la visita de auditores externos el próximo mes." },
    { id: 4, title: "Implementación de nuevas tecnologías de IA en Acería", date: "15/12/2025", summary: "Optimizando la detección temprana de defectos." },
];

interface MenuOption {
  label: string;
  subOptions?: MenuOption[];
  url?: string;
}

const kpiConfig: { id: number; title: string; value: string; trend: string; btnLabel: string; menuOptions: MenuOption[] }[] = [
  { 
    id: 1, 
    title: "Voz del Cliente", value: "95%", trend: "up", 
    btnLabel: "Requerimientos /\nEspecificaciones",      
    menuOptions: [ 
        { 
            label: "Protocolos", 
            subOptions: [
                { label: "México" },
                { label: "Internacionales" },
                { label: "Canadá" },
                { label: "Latinoamérica" },
            ] 
        },
        {
            label: "Normas",
            subOptions: [
                { label: "México",
                    subOptions: [
                        { label: "Varilla",
                            subOptions: [
                                { label: "NMX-B-506-CANACERO-2019" },
                                { label: "NMX-B-457-CANACERO-2019" },
                            ]
                        },
                        { label: "Alambrón",
                            subOptions: [
                                { label: "NMX-B-365-CANACERO-2017" },
                            ]
                        },
                        { label: "Perfiles",
                            subOptions: [
                                { label: "NMX-B-252-1988" },
                            ]
                        },
                        { label: "Laboratorio"},
                    ]
                },
                { label: "Internacional",
                    subOptions: [
                        { label: "Varilla",
                            subOptions: [
                                { label: "A615/A615M-24 (No soldable)" },
                                { label: "A706/A706M-24 (Soldable)" },
                            ]
                        },
                        { label: "Alambrón",
                            subOptions: [
                                { label: "ASTM A510-2025" },
                            ]
                        },
                        { label: "Perfiles" },
                        { label: "Laboratorio"},
                    ]
                },
                { label: "Canadá",
                    subOptions: [
                        { label: "Varilla",
                            subOptions: [
                                { label: "CAN.CSA G30.18-21" },
                                { label: "CSA G40.21-13" },
                            ]
                        },
                    ]
                },
                { label: "Latinoamérica",
                    subOptions: [
                        { label: "Varilla" },
                    ]
                },
                { label: "Certificación",
                    subOptions: [
                        { label: "ISO 9001" },
                        { label: "ISO 17025" },
                        { label: "ISO 14001" },
                        { label: "ISO 45001" },
                    ]
                },
            ]
        },
        { label: "Solicitudes de desarrollo",
            subOptions: [
                { label: "Nuevo producto",
                    subOptions: [
                        { label: "Palanquilla" },
                        { label: "Varilla" },
                        { label: "Alambrón" },
                    ]
                },
                { label: "Mejora de producto",
                    subOptions: [
                        { label: "Palanquilla" },
                        { label: "Varilla" },
                        { label: "Alambrón" },
                    ]
                },
                { label: "Cambio de proceso",
                    subOptions: [
                        { label: "Acería",
                            subOptions: [
                                { label: "Acería 1" },
                                { label: "Acería 2" },
                            ]
                        },
                        { label: "Laminación",
                            subOptions: [
                                { label: "Laminador 0" },
                                { label: "Laminador 1" },
                                { label: "Laminador 2" },
                                { label: "Laminador 3" },
                            ]
                        },
                        { label: "Embarques",
                            subOptions: [
                                { label: "Varilla" },
                                { label: "Alambrón" },
                            ]
                        },
                    ]
                },
            ]
        },
        { label: "Especificaciones",
            subOptions: [
                { label: "Químicas",
                    subOptions: [
                        { label: "Banda roja" },
                        { label: "Banda verde" },
                    ]
                },
                { label: "Mecánicas",
                    subOptions: [
                        { label: "Varilla" },
                        { label: "Alambrón" },
                        { label: "Perfiles" },
                    ]
                },
            ]
        }
    ]
  },
  { 
    id: 2, 
    title: "Diseño de Proceso", value: "82%", trend: "up",
    btnLabel: "Entradas para el\nproceso",
    menuOptions: [
        { label: "Hojas de operación",
            subOptions: [
                { label: "Acería",
                    subOptions: [
                        { label: "Acería 1",
                            subOptions: [
                                { label: "Patio de materia prima" },
                                { label: "Acería" },
                                { label: "Horno de afino" },
                                { label: "Horno de fusión" },
                                { label: "Máquina de colada continua" },
                            ]
                        },
                        { label: "Acería 2",
                            subOptions: [
                                { label: "Patio de materia prima" },
                                { label: "Acería" },
                                { label: "Horno de afino" },
                                { label: "Horno de fusión" },
                                { label: "Máquina de colada continua" },
                            ]
                        },
                    ]
                },
                { label: "Laminación",
                    subOptions: [
                        { label: "Varilla",
                            subOptions: [
                                { label: "Calidad",
                                    subOptions: [
                                        { label: "Redondo-liso carretero" },
                                        { label: "Varilla recta" },
                                        { label: "Varilla rollo" },
                                    ]
                                },
                                { label: "Patio de palanquilla", },
                                { label: "Producción",
                                    subOptions: [
                                        { label: "Prácticas de enfriamiento" },
                                    ]
                                },
                                { label: "Mantenimiento" },
                                { label: "Embarques" },
                            ]
                        },
                        { label: "Alambrón",
                            subOptions: [
                                { label: "Calidad"},
                                { label: "Patio de palanquilla" },
                                { label: "Producción" },
                                { label: "Mantenimiento" },
                                { label: "Embarques" },
                            ]
                        },
                        { label: "Variables críticas y parámetros del proceso" },
                        { label: "Ayudas visuales" },
                    ]
                },
            ]
        },
        { label: "VSM",
            subOptions: [
                { label: "VSM general" },
                { label: "VSM por proceso" },
            ]
        },
        { label: "Solicitud de prueba",
            subOptions: [
                { label: "Palanquilla" },
                { label: "Alambrón" },
                { label: "Varilla" },
            ]
        },
        { label: "Gestión de riesgos",
            subOptions: [
                { label: "AMEF",
                    subOptions: [
                        { label: "Acería",
                            subOptions: [
                                { label: "PMP" },
                                { label: "HF" },
                                { label: "HA" },
                                { label: "MCC" },
                            ]
                        },
                        { label: "Laminación",
                            subOptions: [
                                { label: "Laminación alambrón" },
                                { label: "Laminación varilla" },
                                { label: "HR" },
                                { label: "TGYR" },
                                { label: "Taller BGV" },
                            ]
                        },
                        { label: "Administración",
                            subOptions: [
                                { label: "Embarques alambrón" },
                                { label: "Embarques varilla" },
                                { label: "Patio pg" },
                            ]
                        },
                    ]
                },
                { label: "Matriz de riesgos",
                    subOptions: [
                        { label: "Dirección" },
                        { label: "Calidad",
                            subOptions: [
                                { label: "Calidad" },
                                { label: "SGCD" },
                                { label: "EOD" },
                                { label: "TE" },
                            ]
                        },
                        { label: "Acería",
                            subOptions: [
                                { label: "Taller de refractarios" },
                            ]
                        },
                        { label: "Administración",
                            subOptions: [
                                { label: "Plan y programa de producción" },
                                { label: "Almacén de insumos y aditivos" },
                                { label: "Básculas" },
                                { label: "Logística interna" },
                                { label: "Pagos" },
                                { label: "Almacén de refacciones" },
                                { label: "Sistemas" },
                            ]
                        },
                        { label: "Seguridad" },
                        { label: "Mantenimiento",
                            subOptions: [
                                { label: "Sistema de humos" },
                                { label: "Planta de aguas" },
                            ]
                        },
                        { label: "RH",
                            subOptions: [
                                { label: "Seguridad patrimonial" },
                                { label: "RH" },
                                { label: "Capacitación" },
                            ]
                        },
                    ]
                },
                { label: "MTD Gestión de riesgos" },
            ]
        }
    ]
  },
  { 
    id: 3, 
    title: "Aseguramiento de Calidad", value: "91%", trend: "up", 
    btnLabel: "Gestión de cumplimiento",
    menuOptions: [
        { 
            label: "Plan de Control", 
            subOptions: [
                { label: "Acería",
                    subOptions: [
                        { label: "PMP", url: "https://deacero0.sharepoint.com/sites/Calidad142/Shared Documents/General/Indicadores SEMANALES Calidad/../../../../../:x:/r/sites/PACC/SGCD/Patio%20MP/Documentos/05%20Plan%20de%20Control/Plan%20de%20Control%20Patio%20de%20Materia%20Prima.xlsx?d=wf546a0a2e9db48e7ac1b1413296db127&csf=1&web=1&e=qeP9Ww" },
                        { label: "HF", url: "https://deacero0.sharepoint.com/sites/Calidad142/Shared Documents/General/Indicadores SEMANALES Calidad/../../../../../:x:/r/sites/PACC/SGCD/HF/Documentos/04%20Plan%20de%20Control/Plan%20de%20Control%20Horno%20de%20Fusion.xlsx?d=wa4cdcfa8e38041a2a51e8aeaf5b23e2b&csf=1&web=1&e=wDHacS" },
                        { label: "HA", url: "https://deacero0.sharepoint.com/sites/Calidad142/Shared Documents/General/Indicadores SEMANALES Calidad/../../../../../:x:/r/sites/PACC/SGCD/Horno%20Afino/Documentos/04%20Plan%20de%20Control/Plan%20de%20Control%20Horno%20de%20Afino.xlsx?d=wafba28037e2a4a3a9712305ceb5f7f96&csf=1&web=1&e=dFbami" },
                        { label: "MCC", url: "https://deacero0.sharepoint.com/sites/Calidad142/Shared Documents/General/Indicadores SEMANALES Calidad/../../../../../:x:/r/sites/PACC/SGCD/Maquina%20Colada%20Continua/Documentos/04%20Plan%20de%20Control/Plan%20de%20Control%20M%C3%A1quina%20de%20Colada%20Continua.xlsx?d=w657716d4c4f74afb8be19b92d763c0b6&csf=1&web=1&e=CAh1KZ"},
                    ]
                }, 
                { label: "Laminación",
                    subOptions: [
                        { label: "Alambrón", url: "https://deacero0.sharepoint.com/sites/Calidad142/Shared Documents/General/Indicadores SEMANALES Calidad/../../../../../:x:/r/sites/PACC/SGCD/W/Alambr%C3%B3n/Documentos/04%20Plan%20de%20Control/Plan%20de%20Control%20Laminaci%C3%B3n%20Alambr%C3%B3n.xls?d=w6a87f76932204b5fbeba6fdd1fa65670&csf=1&web=1&e=4xtea2"},
                        { label: "Varilla", url: "https://deacero0.sharepoint.com/sites/Calidad142/Shared Documents/General/Indicadores SEMANALES Calidad/../../../../../:x:/r/sites/PACC/SGCD/W/Varilla/Documentos/04%20Plan%20de%20Control/Plan%20de%20Control%20Laminaci%C3%B3n%20Varilla.xlsx?d=web78c81ba0ca4b42b4b24522883088ab&csf=1&web=1&e=2IbYVA"},
                        { label: "HR", url: "https://deacero0.sharepoint.com/sites/Calidad142/Shared Documents/General/Indicadores SEMANALES Calidad/../../../../../:x:/r/sites/PACC/SGCD/W/Hornos%20de%20recalentamiento/Documentos/03%20Plan%20de%20Control/Plan%20de%20Control%20Horno%20de%20Recalentamiento.xlsx?d=w393c3f5ac5924fe7b4d98cfd14d9e22f&csf=1&web=1&e=TENwT7"},
                        { label: "TGYR", url: "https://deacero0.sharepoint.com/sites/Calidad142/Shared Documents/General/Indicadores SEMANALES Calidad/../../../../../:x:/r/sites/PACC/SGCD/TGyR/Montaje/Documentos/11%20Plan%20de%20Control/Plan%20de%20control%20TGyR.xlsx?d=w95e649ffb08e45bab9db94df921343cb&csf=1&web=1&e=eKSn8h"},
                        { label: "Taller BGV", url: "https://deacero0.sharepoint.com/sites/Calidad142/Shared Documents/General/Indicadores SEMANALES Calidad/../../../../../:x:/r/sites/PACC/SGCD/Taller%20BGV/Documentos/04%20Plan%20de%20Control/Plan%20de%20Control%20Taller%20BGV.xlsx?d=w3a2a8c3fb4204aa5a1f0d300a88c90ee&csf=1&web=1&e=LqeUDt"},
                    ]
                },
                { label: "Administración",
                    subOptions: [
                        { label: "Embarques Alambrón", url: "https://deacero0.sharepoint.com/sites/Calidad142/Shared Documents/General/Indicadores SEMANALES Calidad/../../../../../:x:/r/sites/PACC/SGCD/Embarques/Alambr%C3%B3n/Documentos/04%20Plan%20de%20Control/Plan%20de%20Control%20Embarques%20Alambr%C3%B3n.xlsx?d=w48909d0aee42449b9508df558a732bfe&csf=1&web=1&e=5pVgua"},
                        { label: "Embarques Varilla", url: "https://deacero0.sharepoint.com/sites/Calidad142/Shared Documents/General/Indicadores SEMANALES Calidad/../../../../../:x:/r/sites/PACC/SGCD/Embarques/Varilla_Perfiles/Documentos/04%20Plan%20de%20Control/Plan%20de%20Control%20Embarques%20Varilla.xlsx?d=wa96deed1726b4521b4e8964f8dba8dd2&csf=1&web=1&e=kONwBG"},
                        { label: "Patio pg", url: "https://deacero0.sharepoint.com/sites/Calidad142/Shared Documents/General/Indicadores SEMANALES Calidad/../../../../../:x:/r/sites/PACC/SGCD/Patio%20PQ/Documentos/04%20Plan%20de%20Control/Plan%20de%20Control%20de%20Patio%20de%20Palanquilla.xlsx?d=w77cc2a2843cf4941ac55e68c05615b57&csf=1&web=1&e=k124zJ"},
                    ]
                },
            ] 
        },
        { label: "Auditorías",
            subOptions: [
                { label: "Proceso",
                    subOptions: [
                        { label: "Cumplimiento" },
                        { label: "Check list",
                            subOptions: [
                                { label: "Acería" },
                                { label: "Laminación",
                                    subOptions: [
                                        { label: "Laminador 0" },
                                        { label: "Laminador 1" },
                                        { label: "Laminador 2" },
                                        { label: "Laminador 3" },
                                    ]
                                },
                                { label: "Calidad",
                                    subOptions: [
                                        { label: "inspectores Calidad Alambrón" },
                                        { label: "Inspectores Calidad Varilla" },
                                    ]
                                },
                            ]
                        },
                        { label: "Bitácora de acciones" },
                    ]
                },
                { label: "Producto",
                    subOptions: [
                        { label: "Cumplimiento",
                            subOptions: [
                                { label: "Acería" },
                            ]
                        },
                    ]
                },
                { label: "SGCD",
                    subOptions: [
                        { label: "Auditoría Interna ISO 9001",
                            subOptions: [
                                { label: "Cumplimiento" },
                                { label: "Reporte de hallazgos" },
                                { label: "Análisis 5 por qués" },
                            ]
                        },
                        { label: "Auditorías en piso" },
                    ]
                },
                { label: "Auditoría Interna ISO IEC 17025",
                    subOptions: [
                        { label: "Reporte de hallazgos" },
                    ]
                },
                { label: "Tecnología (MTD)" },
            ]
        },
        { label: "Documentación",
            subOptions: [
                { label: "Hoja de Operación" },
                { label: "Lista de Verificación" },
                { label: "Ayudas Visuales" },
                { label: "Mejores practicas" },
                { label: "Métodos de trabajo" },
                { label: "Protocolo andon jikoda",
                    subOptions: [
                        { label: "Acería",
                            subOptions: [
                                { label: "PMP" },
                                { label: "HF" },
                                { label: "HA" },
                                { label: "MCC" },
                            ]
                        },
                        { label: "Laminación",
                            subOptions: [
                                { label: "Alambrón" },
                                { label: "Varilla" },
                            ]
                        },
                    ]
                },
                { label: "Protocolo de escalación" },
            ]
        },
        { label: "Trabajo Estándar",
            subOptions: [
                { label: "Documentos",
                    subOptions: [
                        { label: "Formatos",
                            subOptions: [
                                { label: "Hoja de Instrucción de Trabajo Estándar" },
                                { label: "Hoja de Proceso" },
                                { label: "Hoja de estación" },
                            ]
                        },
                        { label: "ITEs",
                            subOptions: [
                                { label: "Acería" },
                                { label: "Acería 1",
                                    subOptions: [
                                        { label: "PMP1" },
                                        { label: "HF1" },
                                        { label: "HA1" },
                                        { label: "MCC1" },
                                        { label: "Refractarios" },
                                        { label: "Servicio de ollas" },
                                    ]
                                },
                                { label: "Acería 2",
                                    subOptions: [
                                        { label: "PMP2" },
                                        { label: "HF2" },
                                        { label: "HA2" },
                                        { label: "MCC2" },
                                    ]
                                },
                                { label: "Laminación",
                                    subOptions: [
                                        { label: "Laminación Alambrón" },
                                        { label: "Laminación Varilla" },
                                        { label: "HR" },
                                        { label: "TGYR"},
                                        { label: "Taller BGV" },
                                        { label: "Taller de maquinados" },
                                        { label: "Taller de montaje de cartuchos" },
                                    ]
                                },
                                { label: "Calidad",
                                    subOptions: [
                                        { label: "Calidad Acería" },
                                        { label: "Calidad Laminación" },
                                        { label: "Sistema de Gestión de Calidad" },
                                    ]
                                },
                                { label: "Administración",
                                    subOptions: [
                                        { label: "Almacén de Insumos y Aditivos" },
                                        { label: "Embarques Alambrón" },
                                        { label: "Embarques Varilla" },
                                        { label: "Logística FFCC" },
                                        { label: "Patio de pg" },
                                        { label: "Patio de corte" },
                                        { label: "Procesamiento de escoria" },
                                    ]
                                },
                                { label: "Mantenimiento",
                                    subOptions: [
                                        { label: "Mecánico",
                                            subOptions: [
                                                { label: "Sistema de humos" },
                                                { label: "Planta de aguas" },
                                            ]
                                        },
                                    ]
                                },
                            ]
                        },
                    ]
                },
                { label: "Resultados",
                    subOptions: [
                        { label: "Certificaciones",
                            subOptions: [
                                { label: "Matriz de certificaciones puestos similares" },
                            ]
                        },
                    ]
                },
                { label: "Pendiente",
                    subOptions: [
                        { label: "Matriz de Multihabilidad" },
                    ]
                },
                { label: "Auditoría al método" },
            ]
        },
    ]
  },
  { 
    id: 4, 
    title: "Control de Proceso", value: "78%", trend: "down",
    btnLabel: "Por definir",
    menuOptions: [
        { label: "Control estadístico de proceso",
            subOptions: [
                { label: "Capacitación de proceso CPKs" },
                { label: "Gráficas de control" },
                { label: "Protocolo andon jidoka" },
            ]
        },
        { label: "A1",
            subOptions: [
                { label: "Reporte A1 Dirección" },
                { label: "Seguimiento a acciones" },
            ]
        },
        { label: "Costos de No Calidad",
            subOptions: [
                { label: "Desviaciones Acería",
                    subOptions: [
                        { label: "Bitácora de acciones costos no calidad" },
                        { label: "Análisis 5 por qués" },
                    ]
                },
                { label: "Desviaciones Laminación",
                    subOptions: [
                        { label: "Bitácora de acciones costos no calidad" },
                        { label: "Análisis 5 por qués" },
                    ]
                },
            ]
        },
    ]
  },
  { 
    id: 5, 
    title: "Satisfacción del Cliente", value: "85%", trend: "up",
    btnLabel: "Relación\nClientes",
    menuOptions: [
        { label: "Certificaciones",
            subOptions: [
                { label: "ISO 9001",
                    subOptions: [
                        { label: "Certificado" },
                        { label: "No conformidades auditoría externa" },
                    ]
                },
                { label: "ISO 17025",
                    subOptions: [
                        { label: "Certificado" },
                        { label: "No conformidades auditoría externa" },
                    ]
                },
                { label: "ISO 14001",
                    subOptions: [
                        { label: "Certificado" },
                    ]
                },
                { label: "ISO 45001" },
                { label: "De producto",
                    subOptions: [
                        { label: "ICONTEC",
                            subOptions: [
                                { label: "Certificados",
                                    subOptions: [
                                        { label: "NTC 2289" },
                                        { label: "Resolución 2003" },
                                    ]
                                },
                            ]
                        },
                        { label: "Nacional",
                            subOptions: [
                                { label: "Certificados",
                                    subOptions: [
                                        { label: "NMX-B-506" },
                                        { label: "NMX-B-457" },
                                    ]
                                },
                            ]
                        },
                    ]
                },
            ]
        },
        { label: "Evaluaciones de desempeño PT" },
        { label: "Sistema de RMA" },
        { label: "Costos No Calidad",
            subOptions: [
                { label: "Reclamaciones externas",
                    subOptions: [
                        { label: "CPF" },
                        { label: "CLPP" },
                    ]
                },
                { label: "Reclamaciones internas",
                    subOptions: [
                        { label: "CPF" },
                        { label: "CLPP" },
                    ]
                },
                { label: "Bitácora de acciones" },
            ]
        },
        { label: "Encuestas Clientes (NPS)" },
        { label: "Desempeño de producto" },
        { label: "Benchmark" },
        { label: "Evaluación del servicio" },
        { label: "Estrategia conjunta ventas y operaciones (Comités)" },
    ]
  },
  { 
    id: 6, 
    title: "Administración de Mejora", value: "70%", trend: "up",
    btnLabel: "Sistema de\nmejora continua",
    menuOptions: [
        { label: "Proyectos PDCA",
            subOptions: [
                { label: "Acería",
                    subOptions: [
                        { label: "Portafolio de proyectos de Acería" },                    
                    ]
                 },
                { label: "Laminación",
                    subOptions: [
                        { label: "Portafolio de proyectos de Laminación" },                    
                    ]
                },
            ]
        },
        { label: "Agenda 3G+K",
            subOptions: [
                { label: "Acería",
                    subOptions: [
                        { label: "Disponibilidad" },
                        { label: "Eficiencia" },
                        { label: "Servicio" },
                    ]
                },
                { label: "Laminación",
                    subOptions: [
                        { label: "Varilla" },
                        { label: "Alambrón" },
                        { label: "Seguridad" },
                        { label: "Mantenimiento" },
                    ]
                },
                { label: "Calidad",
                    subOptions: [
                        { label: "Acería" },
                        { label: "Alambrón" },
                        { label: "Varilla" },
                    ]
                },
            ]
        },
        { label: "Ideas A2",
            subOptions: [
                { label: "Reporte de cumplimiento" },
            ]
        },
        { label: "Compromisos (sistema EAD)",
            subOptions: [
                { label: "Reporte de cumplimiento" },
            ]
         },
        { label: "EADs",
            subOptions: [
                { label: "Dirección",
                    subOptions: [
                        { label: "Minuta" },
                    ]
                },
                { label: "Gerencial",
                    subOptions: [
                        { label: "Minuta" },
                    ]
                },
                { label: "Área",
                    subOptions: [
                        { label: "Minuta" },
                    ]
                },
            ]
        },
        { label: "Reingerniería de productos" },
        { label: "Productos No Maduros" },
    ]
  },
];

// ==========================================
// ESTILOS (Styled Components usando THEME)
// ==========================================

const CategoryCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.primary.main, 
    fontWeight: 900,
    cursor: 'pointer',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: (theme.shape.borderRadius as number) * 1.5, 
    height: '100%', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: '0.3s',
    '&:hover': {
        borderColor: theme.palette.secondary.main,
        color: theme.palette.secondary.main,
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }
}));

const NavBar = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Usa Primary
  color: theme.palette.primary.contrastText, // Color de texto automático para contraste (blanco)
  padding: 0,
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: 0, 
  overflow: 'hidden',
  marginBottom: theme.spacing(3)
}));

const NavItem = styled(Box)(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
  fontWeight: 700,
  fontSize: '0.85rem',
  cursor: 'default', 
  padding: theme.spacing(1.5),
  borderRight: '1px solid rgba(255,255,255,0.1)',
  textTransform: 'uppercase',
  '&:last-child': { borderRight: 'none' },
}));

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 12, 
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: theme.palette.secondary.main, // Usa Secondary (Naranja)
      borderRadius: 6,
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    width: '100%',
    height: '80px',
    textTransform: 'none', // Del theme (aunque aquí forzamos, el theme global ya lo tiene)
    fontWeight: 700,
    fontSize: '0.8rem',
    lineHeight: 1.2,
    padding: theme.spacing(1),
    border: `2px solid ${theme.palette.primary.main}`, // Usa Primary
    borderRadius: theme.shape.borderRadius, // Del theme (8px)
    color: theme.palette.primary.main, // Usa Primary
    backgroundColor: 'white',
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    whiteSpace: 'pre-line',
    '&:hover': {
        backgroundColor: '#f5f5f5', // O un color muy suave del theme
        borderColor: theme.palette.secondary.main, // Usa Secondary
        color: theme.palette.secondary.main,
    }
}));

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================

interface KpiCardProps {
    title: string;
    value: string;
    trend: 'up' | 'down' | string;
}

const KpiCard = ({ title, value }: KpiCardProps) => {
    const theme = useTheme(); // Hook para acceder a los colores dentro del componente funcional
    
    // Gráfica naranja (secondary)
    const graphPath = "M0,25 C20,5 40,35 60,15 C80,0 100,30 120,20";
    
    return (
        <Card elevation={0} sx={{ height: '100%', border: '1px solid #eee', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 1 }}>
            <CardContent sx={{ textAlign: 'center', p: 1, '&:last-child': { pb: 1 }, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="caption" color="textSecondary" fontWeight={700} sx={{ fontSize: '0.65rem', display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                    {title}
                </Typography>
                <Typography variant="h5" color="textPrimary" fontWeight={800} sx={{ mb: 1 }}>
                    {value}
                </Typography>
                <Box sx={{ height: 25, display: 'flex', justifyContent: 'center', mt: 'auto' }}>
                    <svg width="80" height="25" viewBox="0 0 120 40" preserveAspectRatio="none">
                        <path d={graphPath} fill="none" stroke={theme.palette.secondary.main} strokeWidth="3" vectorEffect="non-scaling-stroke" />
                    </svg>
                </Box>
            </CardContent>
        </Card>
    );
};

const RecursiveMenuItem = ({ option, handleCloseAll }: { option: MenuOption, handleCloseAll: () => void }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleEnter = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLeave = () => {
        setAnchorEl(null);
    };

    const handleLeafClick = () => {
        if (option.url) {
            window.open(option.url, '_blank'); 
        }
        handleCloseAll();
    };

    return (
        <React.Fragment>
            {option.subOptions && option.subOptions.length > 0 ? (
                <MenuItem 
                    onMouseEnter={handleEnter}
                    onMouseLeave={handleLeave}
                    onClick={handleEnter}
                    sx={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', position: 'relative' }}
                >
                    <ListItemText primary={option.label} />
                    <ArrowRightIcon fontSize="small" color="action" />
                    
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleLeave}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        style={{ pointerEvents: 'none' }}
                        PaperProps={{
                            elevation: 4,
                            sx: { 
                                border: `1px solid ${theme.palette.secondary.main}`, // Borde naranja del submenú
                                borderRadius: 2,
                                minWidth: 150,
                                ml: 1,
                                maxHeight: '300px',
                                overflow: 'auto',
                                pointerEvents: 'auto'
                            }
                        }}
                    >
                        <Box onMouseLeave={handleLeave}>
                            {option.subOptions.map((subOption, index) => (
                                <RecursiveMenuItem 
                                    key={index} 
                                    option={subOption} 
                                    handleCloseAll={handleCloseAll} 
                                />
                            ))}
                        </Box>
                    </Menu>
                </MenuItem>
            ) : (
                <MenuItem onClick={handleLeafClick} sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    <ListItemText primary={option.label} />
                </MenuItem>
            )}
        </React.Fragment>
    );
};

const DynamicMenuButton = ({ label, options }: { label: string, options: MenuOption[] }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <ActionButton onClick={handleClick}>
                {label}
            </ActionButton>
            
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 4,
                    sx: { 
                        border: `2px solid ${theme.palette.primary.main}`, // Borde Azul del menú principal
                        borderRadius: 2,
                        mt: 0.5,
                        minWidth: 180,
                        maxHeight: '400px',
                        overflow: 'auto'
                    }
                }}
            >
                {options.map((option, index) => (
                    <RecursiveMenuItem 
                        key={index} 
                        option={option} 
                        handleCloseAll={handleClose} 
                    />
                ))}
            </Menu>
        </>
    );
};

// Componente de Carrusel
const ImageCarousel = () => {
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = carouselImages.length;

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
        }, 5000); 

        return () => {
            clearInterval(timer);
        };
    }, [maxSteps]);

    return (
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', height: '100%', position: 'relative', bgcolor: '#eee' }}>
             {carouselImages.map((step, index) => (
                <Fade key={index} in={activeStep === index} timeout={1000}>
                    <Box
                        component="img"
                        sx={{
                            height: '100%',
                            display: 'block',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            width: '100%',
                            objectFit: 'cover',
                            position: activeStep === index ? 'relative' : 'absolute',
                            top: 0,
                            left: 0,
                        }}
                        src={step}
                        alt={`Carrusel ${index + 1}`}
                    />
                </Fade>
            ))}
        </Paper>
    );
}

// Componente de Sección de Noticias
const NewsSection = () => {
    const theme = useTheme();

    return (
        <Paper elevation={0} sx={{ height: '100%', borderRadius: 2, border: '1px solid #eee', bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: `2px solid ${theme.palette.primary.main}`, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center' }}>
                 <ArticleIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight={800} color={theme.palette.primary.main}>
                    Noticias Relevantes
                </Typography>
            </Box>
            <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                {simulatedNews.map((news, index) => (
                    <React.Fragment key={news.id}>
                        <ListItem alignItems="flex-start" sx={{ py: 1.5, '&:hover': { bgcolor: '#fafafa' } }}>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" fontWeight={700} color={theme.palette.primary.main}>
                                        {news.title}
                                    </Typography>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'block', mb: 0.5 }}
                                            component="span"
                                            variant="caption"
                                            color="secondary" // Usará el color secondary del theme
                                            fontWeight={600}
                                        >
                                            {news.date}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                             {news.summary}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        {index < simulatedNews.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
}


// ==========================================
// COMPONENTE PRINCIPAL (MgcDashboard)
// ==========================================

export const MgcDashboard = () => {
  const theme = useTheme(); // Obtenemos el theme para usarlo en estilos inline si hace falta

  return (
    // Usamos theme.palette.background.default en lugar de #f8f9fa
    <Box sx={{ flexGrow: 1, backgroundColor: theme.palette.background.default, minHeight: '100vh', pb: 4 }}>
      
      {/* --- APP BAR SUPERIOR --- */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: theme.palette.primary.main, py: 1.5 }}>
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '200px' }}>
                    <img src={logoDeacero} alt="DEACERO" style={{ height: 35 }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 800, letterSpacing: 2, fontSize: '1.5rem', mb: 1, textTransform: 'uppercase' }}>
                        SISTEMA DE GESTIÓN DE CALIDAD
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '600px' }}>
                        <Typography variant="caption" color="inherit" sx={{ mr: 2, fontWeight: 700, opacity: 0.8 }}>
                            CUMPLIMIENTO GLOBAL SGC
                        </Typography>
                        <Box sx={{ flexGrow: 1, mr: 2 }}>
                            <CustomLinearProgress variant="determinate" value={88.5} />
                        </Box>
                        <Typography variant="h6" color="inherit" fontWeight={900} sx={{ fontSize: '1rem' }}>
                            88.5%
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '200px', gap: 0.5 }}>
                    <img src={sgcd} alt="SGCD" style={{ height: 30 }} />
                     <Button 
                        variant="contained" 
                        color="secondary" // Usará el Naranja del theme automáticamente
                        size="small"
                        endIcon={<ArrowDropDownIcon />} 
                        sx={{ borderRadius: 20, px: 2, py: 0.2, fontSize: '0.7rem', fontWeight: 'bold', minHeight: 0 }}
                    >
                        CELAYA
                    </Button>
                </Box>
            </Box>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3 }}>
          
        {/* --- SECCIÓN DE MISIÓN --- */}
        <Paper elevation={1} sx={{ p: 3, mb: 0, borderRadius: 2, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 2 }}>
                    <Box sx={{ borderLeft: `4px solid ${theme.palette.secondary.main}`, pl: 2 }}>
                        <Typography variant="h6" fontWeight={800} color="secondary" sx={{ lineHeight: 1 }}>Misión</Typography>
                        <Typography variant="body2" fontWeight={700} color="textPrimary">Gerencia Calidad</Typography>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 10 }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.6, color: 'text.secondary' }}>
                        Promover una cultura de <b>productividad</b> a través de la interdependencia, que nos permita incrementar la <b>rentabilidad</b> maximizando la capacidad de los procesos, siendo ágiles y flexibles a las necesidades en los cambios de mercado, ofreciendo desarrollos, servicios y soluciones integrales soportados por un <b>sistema de manufactura integrado</b>, que asegure tanto la perdurabilidad como el <b>mejoramiento continuo</b> en un ambiente de trabajo sano y seguro.
                    </Typography>
                </Grid>
            </Grid>
        </Paper>

        {/* --- BARRA DE NAVEGACIÓN --- */}
        <NavBar elevation={0}>
            <NavItem>PLANEACIÓN</NavItem>
            <NavItem>OPERACIÓN</NavItem>
            <NavItem>MEJORA CONTINUA</NavItem>
        </NavBar>

        {/* --- FILA SUPERIOR: CARDS Y BOTONES DE MENÚ --- */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpiConfig.map((item) => (
                <Grid key={item.id} size={{ xs: 6, md: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ flex: 1 }}>
                            <KpiCard 
                                title={item.title} 
                                value={item.value} 
                                trend={item.trend} 
                            />
                        </Box>
                        <DynamicMenuButton 
                            label={item.btnLabel} 
                            options={item.menuOptions}
                        />
                    </Box>
                </Grid>
            ))}
        </Grid>

        {/* --- FILA MEDIO: CATEGORÍAS, TÍTULO KPI Y DIAGRAMA --- */}
        <Grid container spacing={2} sx={{ height: '450px', mb: 8 }}> 
            <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ flex: 1 }}><CategoryCard>PERSONAS</CategoryCard></Box>
                <Box sx={{ flex: 1 }}><CategoryCard>PROCESO</CategoryCard></Box>
                <Box sx={{ flex: 1 }}><CategoryCard>TECNOLOGÍA</CategoryCard></Box>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <Paper elevation={0} sx={{ height: '100%', bgcolor: theme.palette.primary.main, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: 2 }}>
                        KPIS
                    </Typography>
                </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
                <Paper elevation={0} sx={{ height: '100%', bgcolor: 'white', borderRadius: 2, border: '1px solid #eee', overflow: 'hidden', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img 
                            src={gestion} 
                            alt="GESTION" 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    </Box>
                </Paper>
            </Grid>
        </Grid>

        {/* --- NUEVA SECCIÓN 1: IMAGEN DE DIAGRAMA CENTRADA --- */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, mt: 4 }}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, maxWidth: '90%', display: 'flex', justifyContent: 'center', bgcolor: 'white' }}>
                 <img 
                    src={shingo} 
                    alt="Diagrama Centrado" 
                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain' }}
                />
            </Paper>
        </Box>

        {/* --- NUEVA SECCIÓN 2: CARRUSEL (IZQ) Y NOTICIAS (DER) --- */}
        <Grid container spacing={3} sx={{ height: '400px' }}>
             <Grid size={{ xs: 12, md: 6 }} sx={{ height: '100%' }}>
                <ImageCarousel />
             </Grid>
             <Grid size={{ xs: 12, md: 6 }} sx={{ height: '100%' }}>
                <NewsSection />
             </Grid>
        </Grid>

      </Container>
    </Box>
  );
};