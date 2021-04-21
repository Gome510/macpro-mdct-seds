import React from "react";
import { Redirect, Switch } from "react-router-dom";
import Home from "../Home/Home";
import Login from "../Login/Login";
import NotFound from "../NotFound/NotFound";
import Signup from "../Signup/Signup";
import Profile from "../Profile/Profile";
import PrintPDF from "../Print/PrintPDF";
import AuthenticatedRoute from "../AuthenticatedRoute/AuthenticatedRoute";
import UnauthenticatedRoute from "../UnauthenticatedRoute/UnauthenticatedRoute";
import Users from "../Users/Users";
import EditUser from "../EditUser/EditUser";
import Example from "../Example/Example";
import Quarterly from "../Quarterly/Quarterly";
import UserAdd from "../AddUser/AddUser";
import Unauthorized from "../Unauthorized/Unauthorized";
import FormPage from "../FormPage/FormPage";

export default function Routes({ user, isAuthorized }) {
  if (!isAuthorized) {
    return (
      <Switch>
        <UnauthenticatedRoute exact path="/">
          <Redirect to="/login" />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute exact path="/login">
          <Login />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute exact path="/signup">
          <Signup />
        </UnauthenticatedRoute>
      </Switch>
    );
  }
  return (
    <Switch>
      {/*************** UNAUTHENTICATED ROUTES ***************/}
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/unauthorized">
        <Unauthorized />
      </UnauthenticatedRoute>
      {/*************** AUTHENTICATED ROUTES ***************/}
      <AuthenticatedRoute exact path="/">
        <Home user={user} />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/example">
        <Example />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/forms/:state/:year/:quarter/:formName">
        <FormPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/profile">
        <Profile user={user} />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/forms/:state/:year/:quarter">
        <Quarterly />
      </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/PrintPDF">
            <PrintPDF />
        </AuthenticatedRoute>
      {/*************** ADMIN ROUTES ***************/}
      {user.attributes["app-role"] === "admin" ? (
        <>
          <AuthenticatedRoute exact path="/users">
            <Users />
          </AuthenticatedRoute>
          <AuthenticatedRoute exact path="/users/add">
            <UserAdd />
          </AuthenticatedRoute>
          <AuthenticatedRoute exact path="/users/:id/edit">
            <EditUser />
          </AuthenticatedRoute>
        </>
      ) : null}
      <UnauthenticatedRoute>
        <NotFound />
      </UnauthenticatedRoute>
    </Switch>
  );
}
