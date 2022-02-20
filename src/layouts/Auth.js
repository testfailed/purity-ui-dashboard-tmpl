// chakra imports
import { Box, ChakraProvider, Portal } from "@chakra-ui/react";
import Footer from "components/Footer/Footer.js";
// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "routes.js";
import theme from "theme/theme.js";

export default function Pages() {

  // ref for the wrapper div
  const wrapper = React.createRef();

  React.useEffect(() => {
    document.body.style.overflow = "unset";
  });

  const getActiveRoute = (routes) => {
    let activeRoute = "Default Brand Text";
    for (let route of routes) {
      if (route.collapse) {
        let collapseActiveRoute = getActiveRoute(route.views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (route.category) {
        let categoryActiveRoute = getActiveRoute(route.views);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(route.layout + route.path) !== -1
        ) {
          return route.name;
        }
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let route of routes) {
      if (route.category) {
        let categoryActiveNavbar = getActiveNavbar(route.views);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(route.layout + route.path) !== -1
        ) {
          if (route.secondaryNavbar) {
            return route.secondaryNavbar;
          }
        }
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.category === "account") {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        return (
          <Route
            key={key}
            path={prop.layout + prop.path}
            component={prop.component}
          />
        );
      } else {
        return null;
      }
    });
  };
  const navRef = React.useRef();
  document.documentElement.dir = "ltr";
  return (
    <ChakraProvider theme={theme} resetCss={false} w="100%">
      <Box ref={navRef} w="100%">
        <Portal containerRef={navRef}>
          <AuthNavbar
            secondary={getActiveNavbar(routes)}
            logoText="PURITY UI DASHBOARD"
          />
        </Portal>
        <Box w="100%">
          <Box ref={wrapper} w="100%">
            <Switch>
              {getRoutes(routes)}
              <Redirect from="/auth" to="/auth/login-page" />
            </Switch>
          </Box>
        </Box>
        <Box px="24px" mx="auto" width="1044px" maxW="100%">
          <Footer />
        </Box>
      </Box>
    </ChakraProvider>
  );
}
