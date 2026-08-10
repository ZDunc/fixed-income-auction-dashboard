import { alpha, createTheme } from '@mui/material/styles';
import { themeQuartz } from 'ag-grid-community';

export const appColors = {
    brand: {
        primary: '#1F4DB8',
        primaryDark: '#173E96',
        primarySoft: '#EAF0FC'
    },

    surface: {
        page: '#F1F3F6',
        paper: '#FFFFFF',
        subtle: '#F8FAFD',
        gridHeader: '#F5F7FA',
        gridChrome: '#FAFBFC',
        border: '#D6DEE8',
    },

    text: {
        primary: '#172033',
        secondary: '#5F6F86'
    },

    kpi: {
        auctions: '#2457C5',
        size: '#0F766E',
        price: '#5B6DCC',
        averageSize: '#64748B'
    },

    dataViz: {
        bid: '#2563EB',
        offer: '#14B8A6',

        corporate: '#6B5CCB',
        municipal: '#B5658A',

        upcoming: '#3B82F6',
        active: '#16A34A',
        concluded: '#7A8699',
        expired: '#A3ADBA'
    }
};

const controlBorder = alpha(
    appColors.text.primary,
    0.22
);

const controlBorderHover = alpha(
    appColors.text.primary,
    0.38
);

interface KpiColors {
    auctions: string;
    size: string;
    price: string;
    averageSize: string;
}

interface DataVizColors {
    bid: string;
    offer: string;
    corporate: string;
    municipal: string;
    upcoming: string;
    active: string;
    concluded: string;
    expired: string;
}

declare module '@mui/material/styles' {
    interface Theme {
        kpi: KpiColors;
        dataViz: DataVizColors;
    }

    interface ThemeOptions {
        kpi?: Partial<KpiColors>;
        dataViz?: Partial<DataVizColors>;
    }
}

const fontFamily = [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'Helvetica',
    'Arial',
    'sans-serif'
].join(',');

export const theme = createTheme({
    palette: {
        mode: 'light',

        primary: {
            main: appColors.brand.primary,
            dark: appColors.brand.primaryDark
        },

        background: {
            default: appColors.surface.page,
            paper: appColors.surface.paper
        },

        text: {
            primary: appColors.text.primary,
            secondary: appColors.text.secondary
        },

        divider: appColors.surface.border,

        action: {
            hover: appColors.surface.subtle,
            selected: appColors.brand.primarySoft
        }
    },

    kpi: appColors.kpi,
    dataViz: appColors.dataViz,

    shape: {
        borderRadius: 10
    },

    typography: {
        fontFamily,

        button: {
        fontWeight: 600
        }
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: appColors.surface.page
                }
            }
        },

        MuiCard: {
            styleOverrides: {
                root: {
                borderColor: appColors.surface.border,
                boxShadow:
                    '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.05)'
                }
            }
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    fontWeight: 600
                },

                contained: {
                    boxShadow: 'none',

                    '&:hover': {
                        boxShadow: 'none'
                    }
                }
            }
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: appColors.surface.paper,

                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: controlBorder
                    },

                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: controlBorderHover
                    },

                    '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(31, 77, 184, 0.10)'
                    },

                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 1,
                        borderColor: appColors.brand.primary
                    }
                },

                input: {
                    fontSize: '0.875rem'
                }
            }
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '0.875rem'
                }
            }
        },

        MuiToggleButton: {
            styleOverrides: {
                root: {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    color: appColors.text.secondary,
                    borderColor: controlBorder,

                    '&.Mui-selected': {
                        fontWeight: 600,
                        color: appColors.brand.primaryDark,
                        backgroundColor: appColors.brand.primarySoft,

                        '&:hover': {
                            backgroundColor: '#DFE8FB'
                        }
                    }
                }
            }
        },

        MuiChip: {
            styleOverrides: {
                root: {
                fontWeight: 600
                }
            }
        },

        MuiDivider: {
            styleOverrides: {
                root: {
                borderColor: appColors.surface.border
                }
            }
        }
    }
});

export const auctionGridTheme = themeQuartz.withParams({
    accentColor: appColors.brand.primary,
    backgroundColor: appColors.surface.paper,
    foregroundColor: appColors.text.primary,
    borderColor: appColors.surface.border,

    chromeBackgroundColor: appColors.surface.gridChrome,
    headerBackgroundColor: appColors.surface.gridHeader,
    headerTextColor: appColors.text.primary,

    oddRowBackgroundColor: '#FBFCFE',
    rowHoverColor: '#F2F6FC',
    selectedRowBackgroundColor: appColors.brand.primarySoft,

    fontFamily,
    fontSize: 14,
    headerFontWeight: 700,
    rowHeight: 38,
    headerHeight: 40,
    paginationPanelHeight: 38,
    spacing: 6,
    wrapperBorder: false,
    wrapperBorderRadius: 0
});