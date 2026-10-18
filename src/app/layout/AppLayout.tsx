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
  ListSubheader,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  AccountCircle,
  Analytics,
  Assignment,
  Business,
  Groups,
  Logout,
  Menu,
  Person,
  Psychology,
  School,
  Work,
} from '@mui/icons-material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth/context/AuthContext';
import NotificationsPopover from '../../features/notifications/components/NotificationsPopover';

type NavMenuItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
};

const employeeMenuItems: NavMenuItem[] = [
  { label: 'nav.profile', to: '/profile', icon: <AccountCircle /> },
  { label: 'nav.requests', to: '/requests', icon: <Assignment /> },
  { label: 'nav.academy', to: '/academy', icon: <School /> },
  { label: 'nav.aiAssistant', to: '/ai-assistant', icon: <Psychology /> },
];

const hrMenuItems: NavMenuItem[] = [
  { label: 'nav.analytics', to: '/analytics', icon: <Analytics /> },
  { label: 'nav.employees', to: '/employees', icon: <Groups /> },
  { label: 'nav.departments', to: '/departments', icon: <Business /> },
  { label: 'nav.vacancies', to: '/vacancies', icon: <Work /> },
  { label: 'nav.candidates', to: '/candidates', icon: <Person /> },
  { label: 'nav.onboarding', to: '/onboarding', icon: <School /> },
];

const drawerWidth = 272;

export default function AppLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHrOrAdmin = useMemo(() => {
    const role = user?.role;
    return ['HR', 'SUPER_ADMIN', 'DIRECTOR', 'CITY_MANAGER', 'FRANCHISE_OWNER'].includes(role ?? '');
  }, [user?.role]);

  const allItems = useMemo(() => [...employeeMenuItems, ...hrMenuItems], []);

  const pageTitle = useMemo(() => {
    const current = allItems.find((item) => item.to === location.pathname);
    return t(current?.label ?? 'nav.profile');
  }, [allItems, location.pathname, t]);

  const handleLanguageChange = (value: string) => {
    void i18n.changeLanguage(value);
    localStorage.setItem('digital-hr-language', value);
  };

  const renderMenuItems = (items: NavMenuItem[]) =>
    items.map((item) => {
      const isActive = location.pathname === item.to;

      return (
        <ListItem key={item.to} disablePadding sx={{ mb: 0.25 }}>
          <ListItemButton
            component={Link}
            to={item.to}
            selected={isActive}
            sx={{
              borderRadius: 2,
              py: 1.1,
              px: 1.25,
              color: isActive ? 'primary.main' : '#1f2937',
              '&.Mui-selected': {
                background: 'linear-gradient(90deg, rgba(22, 139, 72, 0.12) 0%, rgba(22, 139, 72, 0.04) 100%)',
                color: 'primary.main',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
              },
              '&:hover': { backgroundColor: 'rgba(15, 23, 42, 0.02)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 38, color: isActive ? 'primary.main' : '#64748b' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: '0.9rem', fontWeight: isActive ? 700 : 600 }}>
                  {t(item.label)}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      );
    });

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
      <Toolbar sx={{ px: 2.25, py: 1.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
          <Avatar
            sx={{
              width: 38,
              height: 38,
              background: 'linear-gradient(135deg, #168B48 0%, #1EA657 100%)',
              color: '#fff',
              fontWeight: 800,
              boxShadow: '0 12px 22px rgba(22, 139, 72, 0.24)',
            }}
          >
            J
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              JanaPost HR
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('nav.unifiedPlatform')}
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.25, py: 1.75 }}>
        <List
          subheader={
            <ListSubheader
              disableSticky
              sx={{
                bgcolor: 'transparent',
                lineHeight: '28px',
                fontSize: '0.68rem',
                fontWeight: 800,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                px: 1.25,
                pb: 0.8,
                pt: 0.8,
              }}
            >
              {t('nav.employeeServices')}
            </ListSubheader>
          }
        >
          {renderMenuItems(employeeMenuItems)}
        </List>

        {isHrOrAdmin && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <List
              subheader={
                <ListSubheader
                  disableSticky
                  sx={{
                    bgcolor: 'transparent',
                    lineHeight: '28px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    px: 1.25,
                    pb: 0.8,
                    pt: 0.8,
                  }}
                >
                  {t('nav.hrManagement')}
                </ListSubheader>
              }
            >
              {renderMenuItems(hrMenuItems)}
            </List>
          </>
        )}
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(148, 163, 184, 0.2)', bgcolor: '#f8fafc' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#0f172a', fontSize: '0.85rem', fontWeight: 700 }}>
            {user?.email?.charAt(0).toUpperCase() ?? 'U'}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem' }}>
              {user?.email ?? t('common.user')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role ?? 'EMPLOYEE'}
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<Logout />}
          onClick={logout}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            borderColor: 'rgba(148, 163, 184, 0.45)',
            color: '#1f2937',
            fontWeight: 700,
            '&:hover': { borderColor: 'rgba(255, 106, 61, 0.5)', backgroundColor: 'rgba(255, 106, 61, 0.04)' },
          }}
        >
          {t('common.logout')}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #f5f7fb 0%, #eef5ff 100%)' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          color: '#0f172a',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 78 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" edge="start" sx={{ mr: 1, display: { sm: 'none' } }} onClick={() => setMobileOpen((prev) => !prev)}>
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
              {pageTitle}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Select
              size="small"
              value={i18n.resolvedLanguage || 'ru'}
              onChange={(event) => handleLanguageChange(event.target.value)}
              sx={{
                minWidth: 92,
                height: 38,
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(22, 139, 72, 0.4)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#168B48' },
              }}
            >
              <MenuItem value="ru">RU</MenuItem>
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="kk">KK</MenuItem>
            </Select>

            <NotificationsPopover />

            <Divider orientation="vertical" flexItem sx={{ my: 1.5, mx: 0.5 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {user?.email ?? t('common.user')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role ?? 'EMPLOYEE'}
                </Typography>
              </Box>
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#168B48', fontWeight: 700 }}>
                {user?.email?.charAt(0).toUpperCase() ?? 'U'}
              </Avatar>
            </Box>
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
          p: { xs: 2, md: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
