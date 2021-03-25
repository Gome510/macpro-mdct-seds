import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import "./App.scss";
import "./animations/transitions.scss";
import {
  ascertainUserPresence,
  determineRole
} from "../src/utilityFunctions/initialLoadFunctions";
import config from "./config";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState();

  async function onLoad() {
    try {
      let user = await Auth.currentAuthenticatedUser();

      // *** LOCAL ONLY ADMIN OVERRIDE
      if (config.REMOTE_WORKFLOW === true) {
        user.attributes["ismemberof"] = "CHIP_D_USER_GROUP_ADMIN";
      }

      determineRole(user.attributes["ismemberof"]);
      setUser(user);
      setIsAuthenticated(true);
      setIsAuthenticating(false);
      setIsAuthorized(true);
      await ascertainUserPresence(user);
    } catch (error) {
      setIsAuthenticating(false);
    }
  }
  useEffect(() => {
    onLoad();
  }, [isAuthenticated]);

  return (
    !isAuthenticating && (
      <div className="App react-transition scale-in">
        <Header user={user} />
        <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
          <div className="main">
            <Routes user={user} isAuthorized={isAuthorized} />
          </div>
        </AppContext.Provider>
        <Footer />
      </div>
    )
  );
}

export default App;
