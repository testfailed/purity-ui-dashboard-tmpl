// Chakra imports
import { ChakraProvider, Portal, useDisclosure } from "@chakra-ui/react";
import Configurator from "components/Configurator/Configurator";
import Footer from "components/Footer/Footer.js";
// Layout components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "routes.js";
// Custom Chakra theme
import theme from "theme/theme.js";
import FixedPlugin from "../components/FixedPlugin/FixedPlugin";
// Custom components
import MainPanel from "../components/Layout/MainPanel";
import PanelContainer from "../components/Layout/PanelContainer";
import PanelContent from "../components/Layout/PanelContent";
export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const [sidebarVariant, setSidebarVariant] = useState("transparent");
  const [fixed, setFixed] = useState(false);
  // ref for main panel div
  const mainPanel = React.createRef();
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
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
  // This changes navbar state(fixed or not)
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
      if (prop.layout === "/admin") {
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  document.documentElement.dir = "ltr";
  // Chakra Color Mode
  return (
    <ChakraProvider theme={theme} resetCss={false}>
      <Sidebar
        routes={routes}
        logoText={"PURITY UI DASHBOARD"}
        display="none"
        sidebarVariant={sidebarVariant}
        {...rest}
      />
      <MainPanel
        ref={mainPanel}
        w={{
          base: "100%",
          xl: "calc(100% - 275px)",
        }}
      >
        <Portal>
          <AdminNavbar
            onOpen={onOpen}
            logoText={"PURITY UI DASHBOARD"}
            brandText={getActiveRoute(routes)}
            secondary={getActiveNavbar(routes)}
            fixed={fixed}
            {...rest}
          />
        </Portal>
        {getRoute() ? (
          <PanelContent>
            <PanelContainer>
              <Switch>
                {getRoutes(routes)}
                <Redirect from="/admin" to="/admin/dashboard" />
              </Switch>
            </PanelContainer>
          </PanelContent>
        ) : null}
        <Footer />
        <Portal>
          <FixedPlugin
            secondary={getActiveNavbar(routes)}
            fixed={fixed}
            onOpen={onOpen}
          />
        </Portal>
        <Configurator
          secondary={getActiveNavbar(routes)}
          isOpen={isOpen}
          onClose={onClose}
          isChecked={fixed}
          onSwitch={(value) => {
            setFixed(value);
          }}
          onOpaque={() => setSidebarVariant("opaque")}
          onTransparent={() => setSidebarVariant("transparent")}
        />
      </MainPanel>
    </ChakraProvider>
  );
}
