import * as React from "react";
import "./appbar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import logo from "./logo3.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { Collapse, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { AccountCircle, ExpandLess, ExpandMore, Logout, StarBorder } from "@mui/icons-material";
const pages = ["Products", "Pricing", "Blog"];

function Appbar() {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openListItem, setOpenListItem] = React.useState(false);
  const [openListItemTwo, setOpenListItemTwo] = React.useState(false);
  const [serial, setSerial] = React.useState(null);
  const open = Boolean(serial);
  const [account, setAccount] = React.useState(null);
  const openAccount = Boolean(account);
  const [scanning, setScanning] = React.useState(null);
  const openScanning = Boolean(scanning);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setOpenDrawer(true);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  let navigate = useNavigate();

  return (
    <div className="navbar">
      <AppBar sx={{ padding: "4px" }} color="primary" position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img src={logo} height="60px" alt="" />

            <Box sx={{ flexGrow: 1, justifyContent: "flex-end", display: { xs: "flex", md: "none" } }}>
              <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  justifyContent: "flex-end",
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, gap: "25px", justifyContent: "flex-end", display: { xs: "none", md: "flex" } }}>
              <div>
                <Button
                  sx={{
                    minWidth: "110px",
                    color: "white",
                    "&:hover": {
                      background: "#0000004d",
                    },
                  }}
                  endIcon={<KeyboardArrowDownIcon />}
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={(e) => {
                    setSerial(e.currentTarget);
                  }}
                >
                  Sevices
                </Button>
                <Menu
                  sx={{ minWidth: "100px" }}
                  id="basic-menu"
                  anchorEl={serial}
                  open={open}
                  onClose={() => {
                    setSerial(null);
                  }}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  {JSON.parse(localStorage.getItem("module_access"))?.qr_gen ? (
                    <MenuItem
                      onClick={() => {
                        setSerial(null);
                        navigate("/");
                      }}
                    >
                      Qr Generate
                    </MenuItem>
                  ) : null}
                  {JSON.parse(localStorage.getItem("module_access"))?.scan_to_qr ? (
                    <MenuItem
                      onClick={() => {
                        setSerial(null);
                        navigate("/makeqr");
                      }}
                    >
                      Scan Barcode
                    </MenuItem>
                  ) : null}
                </Menu>
              </div>
              <div>
                <Button
                  sx={{
                    minWidth: "110px",
                    color: "white",
                    "&:hover": {
                      background: "#0000004d",
                    },
                  }}
                  endIcon={<KeyboardArrowDownIcon />}
                  id="account-menus"
                  aria-controls={openAccount ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openAccount ? "true" : undefined}
                  onClick={(e) => {
                    setAccount(e.currentTarget);
                  }}
                >
                  Account
                </Button>
                <Menu
                  id="account-menu"
                  anchorEl={account}
                  open={openAccount}
                  onClose={() => {
                    setAccount(null);
                  }}
                  MenuListProps={{
                    "aria-labelledby": "account-menus",
                  }}
                >
                  <MenuItem>{localStorage.getItem("fullname")}</MenuItem>
                  {/*   <MenuItem
                    onClick={() => {
                      window.open("https://microtek.tech/ess/forget-password", "_blank");
                    }}
                  >
                    Change Password
                  </MenuItem> */}
                  <MenuItem
                    onClick={() => {
                      localStorage.clear();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer onClose={() => setOpenDrawer(false)} anchor="right" open={openDrawer}>
        <Box sx={{ width: "300px" }}>
          <List>
            <ListItem>
              <ListItemButton
                onClick={() => {
                  setOpenListItemTwo((data) => !data);
                }}
              >
                <ListItemText primary="Services" />
                {openListItem ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openListItemTwo} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {JSON.parse(localStorage.getItem("module_access"))?.qr_gen ? (
                  <ListItemButton
                    onClick={() => {
                      setSerial(null);
                      navigate("/");
                      setOpenDrawer(false);
                    }}
                    sx={{ pl: 6 }}
                  >
                    <ListItemText primary="QR Generate" />
                  </ListItemButton>
                ) : null}
                {JSON.parse(localStorage.getItem("module_access"))?.scan_to_qr ? (
                  <ListItemButton
                    onClick={() => {
                      setSerial(null);
                      navigate("/makeqr");
                      setOpenDrawer(false);
                    }}
                    sx={{ pl: 6 }}
                  >
                    <ListItemText primary="Scan Barcode" />
                  </ListItemButton>
                ) : null}
              </List>
            </Collapse>
            <ListItem>
              <ListItemButton
                onClick={() => {
                  setOpenListItem((data) => !data);
                }}
              >
                <ListItemText primary="Account" />
                {openListItem ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openListItem} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 6 }}>
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary={localStorage.getItem("fullname")} />
                </ListItemButton>
                <ListItemButton
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  sx={{ pl: 6 }}
                >
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>
    </div>
  );
}
export default Appbar;
