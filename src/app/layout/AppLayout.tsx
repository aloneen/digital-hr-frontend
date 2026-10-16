import { useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Analytics,
  BarChart,
  Business,
  Groups,
  Logout,
  Menu,
  Person,
  School,
  Work,
} from '@mui/icons-material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';

const menuItems = [
  { label: 'Dashboard', to: '/dashboard', icon: <BarChart /> },
  { label: 'Employees', to: '/employees', icon: <Groups /> },
  { label: 'Departments', to: '/departments', icon: <Business /> },
  { label: 'Vacancies', to: '/vacancies', icon: <Work /> },
  { label: 'Candidates', to: '/candidates', icon: <Person /> },
  { label: 'Onboarding', to: '/onboarding', icon: <School /> },
  { label: 'Analytics', to: '/analytics', icon: <Analytics /> },
];

const drawerWidth = 240;

export default function AppLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = useMemo(() => {
    const current = menuItems.find((item) => item.to === location.pathname);
    return current?.label ?? 'Dashboard';
  }, [location.pathname]);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>D</Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Digital HR
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Workspace
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Divider />

      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.to}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(31, 111, 235, 0.08)',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
            {user?.email?.charAt(0).toUpperCase() ?? 'U'}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {user?.email ?? 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role ?? 'Employee'}
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<Logout />}
          onClick={logout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(12px)',
          color: '#0f172a',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              sx={{ mr: 1, display: { sm: 'none' } }}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {pageTitle}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              {user?.role ?? 'User'}
            </Typography>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.email?.charAt(0).toUpperCase() ?? 'U'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f3f6fb',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
