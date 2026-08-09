import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import DashboardOutlined from '@mui/icons-material/DashboardOutlined';

export default function Header() {
  return (
        <AppBar
            position="static"
            color="inherit"
            elevation={0}
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper'
            }}>
            <Toolbar
                sx={{
                    px: { xs: 2, md: 3 },
                    minHeight: '48px !important'
                }}>
                <DashboardOutlined
                    color="primary"
                    sx={{
                        mr: 1,
                        fontSize: 21
                    }}
                />

                <Typography
                    variant="subtitle1"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        fontSize: '1.05rem'
                    }}>
                    Auction Dashboard
                </Typography>
            </Toolbar>
        </AppBar>
    );
}