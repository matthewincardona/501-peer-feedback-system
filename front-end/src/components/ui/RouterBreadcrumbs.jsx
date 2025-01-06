import * as React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Link as RouterLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import "./RouterBreadcrumbs.css";

const breadcrumbNameMap = {
  "/groups": "Groups",
  "/groups/teams": "Teams",
  "/groups/teams/results": "Results",
  "/form": "Form",
  "/reform": "Complete Form",
  "/editgroup": "Edit Group",
  "/editgroup/editusers": "Edit Users",
  "/editgroup/editusers/editcreator": "Edit Creator Permissions",
  "/editgroup/editusers/editcreator/editdatepicker": "Edit Date Picker",
  "/editgroup/editusers/editcreator/editdatepicker/editnewform":"Form",
  "/editgroup/editusers/editcreator/editdatepicker/editform":"Edit Form",
  "/results": "Results",
  "/adminview": "User Management",
  "/creategroup": "Create Group",
  "/creategroup/addusers": "Assign Users",
  "/creategroup/addusers/creator": "Creators",
  "/creategroup/addusers/creator/datepicker": "Date Picker",
  "/creategroup/addusers/creator/datepicker/form": "Form",
  "/creategroup/addusers/creator/datepicker/newform": "Form",
};

function getBreadcrumbName(path) {
  return breadcrumbNameMap[path] || "Unknown";
}

function LinkRouter(props) {
  return <Link {...props} component={RouterLink} />;
}

function Page() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbList = [];
  let path = "";

  pathnames.forEach((segment) => {
    if (isNaN(Number(segment))) {
      // If the segment is not a number (not an ID), include it
      path += `/${segment}`;
      const breadcrumbName = getBreadcrumbName(path);
      if (breadcrumbName) {
        breadcrumbList.push({ breadcrumb: breadcrumbName, path });
      }
    }
  });

  // Define the maximum number of visible breadcrumbs
  const maxVisible = 3;
  const visibleBreadcrumbs = breadcrumbList.slice(0, maxVisible);
  const hiddenBreadcrumbs = breadcrumbList.slice(maxVisible);

  // State for menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Build the Breadcrumbs children array
  const breadcrumbsChildren = [
    <LinkRouter underline="hover" color="inherit" to="/" key="dashboard">
      Dashboard
    </LinkRouter>,
    ...visibleBreadcrumbs.map((crumb, index) => {
      const isLast =
        index === visibleBreadcrumbs.length - 1 && hiddenBreadcrumbs.length === 0;
      return isLast ? (
        <Typography key={crumb.path} sx={{ color: "text.primary" }}>
          {crumb.breadcrumb}
        </Typography>
      ) : (
        <LinkRouter
          underline="hover"
          color="inherit"
          to={crumb.path}
          key={crumb.path}
        >
          {crumb.breadcrumb}
        </LinkRouter>
      );
    }),
  ];

  if (hiddenBreadcrumbs.length > 0) {
    breadcrumbsChildren.push(
      <IconButton
        key="more"
        color="inherit"
        size="small"
        onClick={handleMenuClick}
        aria-controls={open ? "breadcrumb-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <MoreHorizIcon />
      </IconButton>
    );
  }

  return (
    <Box>
      <Breadcrumbs separator=">" aria-label="breadcrumb">
        {breadcrumbsChildren}
      </Breadcrumbs>

      {/* Render the Menu outside of Breadcrumbs */}
      {hiddenBreadcrumbs.length > 0 && (
        <Menu
          id="breadcrumb-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {hiddenBreadcrumbs.map((crumb) => (
            <MenuItem
              key={crumb.path}
              onClick={handleMenuClose}
              component={RouterLink}
              to={crumb.path}
            >
              {crumb.breadcrumb}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Box>
  );
}

export default function RouterBreadcrumbs() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Routes>
        <Route path="*" element={<Page />} />
      </Routes>
      <Box
        sx={{ bgcolor: "background.paper", mt: 1 }}
        component="nav"
        aria-label="breadcrumbs"
      ></Box>
    </Box>
  );
}
