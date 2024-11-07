import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Avatar, IconButton, Box, CssBaseline, Menu, MenuItem } from "@mui/material";
import { auth } from "../services/firebase"; 

function Header() {
  const [user, setUser] = useState<any>(null);  // Estado para armazenar o usuário logado
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); 
  const [openMenu, setOpenMenu] = useState(false); 


  const handleLogout = async () => {
    try {
      await auth.signOut(); 
      setUser(null); 
      setOpenMenu(false); 
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  // Efeito para atualizar o estado do usuário
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);  // Atualiza o estado do usuário quando o estado de autenticação mudar
    });

    return () => unsubscribe();  
  }, []);


  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };


  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  return (
    <div>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>TAUGOR</Link>
          </Typography>

          {/* Verifica se o usuário está logado */}
          {user && user.photoURL ? (
            <Box>
              <IconButton onClick={handleMenuClick}>
                <Avatar alt={user.displayName} src={user.photoURL} />
              </IconButton>
            </Box>
          ) : (
            <Box>
              <IconButton onClick={handleMenuClick}>
                <Avatar>{user?.displayName?.charAt(0)}</Avatar>
              </IconButton>
            </Box>
          )}

          {/* Menu de opções */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;