import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-dropdown";
import { Auth } from "aws-amplify";
import { obtainAvailableForms, obtainUserByEmail } from "../../libs/api";
import { onError } from "../../libs/errorLib";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  compileStatesForDropdown,
  compileSimpleArrayStates,
  buildSortedAccordionByYearQuarter
} from "../../utility-functions/sortingFunctions";
import { Accordion } from "@trussworks/react-uswds";
import "./HomeAdmin.scss";

const HomeAdmin = ({ stateList }) => {
  const [selectedState, setSelectedState] = useState();
  const [availableStates, setAvailableStates] = useState([]);
  const [stateError, setStateError] = useState(true);
  const [accordionItems, setAccordionItems] = useState("");
  const [role, setRole] = useState();

  useEffect(() => {
    const onLoad = async () => {
      let currentUserInfo;
      try {
        // Get user information
        const AuthUserInfo = (await Auth.currentSession()).getIdToken;
        console.log(AuthUserInfo, "user Email");

        currentUserInfo = await obtainUserByEmail({
          email: AuthUserInfo.payload.email
        });
        console.log(currentUserInfo, "This is the currrent user info")
      } catch (e) {
        onError(e);
      }

      console.log(Auth);

      console.log("retrieved: ");
      console.log(currentUserInfo);

      if (currentUserInfo["Items"]) {
        const userRole = currentUserInfo["Items"][0].role;
        let userStates = currentUserInfo["Items"][0].states;
        let selectedStates;

        setRole(userRole);

        // If using all states, create a simple array of states for use in compileStatesForDropdown
        if (userRole === "admin") {
          userStates = compileSimpleArrayStates(stateList);
        }

        if (userStates && userStates !== "null" && userStates.length > 0) {
          // Convert simple array into array of objects for dropdown
          selectedStates = compileStatesForDropdown(stateList, userStates);
          // Remove default error
          setStateError(false);
        }

        setAvailableStates(selectedStates);
      }
    };

    onLoad();
  }, [stateList]);

  const updateUsState = async e => {
    setSelectedState(e.value);

    // Get list of all state forms
    let forms;
    try {
      forms = await obtainAvailableForms({
        stateId: e.value
      });
    } catch (e) {
      forms = [];
    }

    // Build Accordion items and set to local state
    setAccordionItems(buildSortedAccordionByYearQuarter(forms, e.value));
  };

  return (
    <div className="HomeAdmin" data-testid="HomeAdmin">
      {role === "admin" ? (
        <>
          <h1 className="page-header">Home Admin User Page</h1>
          <div className="padding-left-9 margin-left-9 list-display-container">
            <ul>
              <li className="user-view-edit">
                <Link to="/users" className="text-bold">
                  View / Edit Users
                </Link>
              </li>
              <li className="user-add">
                <Link to="/users/add" className="text-bold">
                  Create User
                </Link>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <h1 className="page-header">Home Business User Page</h1>
      )}
      <div className="state-coreset-container margin-bottom-2">
        <div className="state-selector">
          <h3>Select Your State</h3>
          {stateError ? (
            <>
              <p>This account is not associated with any states.</p>
              <p>
                If you feel this is an error, please contact the helpdesk{" "}
                <a href="mailto:sedshelp@cms.hhs.gov">SEDSHelp@cms.hhs.gov</a>
              </p>
            </>
          ) : (
            <Dropdown
              options={availableStates}
              onChange={e => updateUsState(e)}
              value={selectedState ? selectedState : ""}
              placeholder="Select a state"
              autosize={false}
              className="state-select-list"
            />
          )}
        </div>

        <div className="year-coreset-selector">
          {accordionItems && accordionItems.length !== 0 ? (
            <>
              <p className="instructions">
                Welcome to SEDS! Please select a Federal Fiscal Year and quarter
                below to view available reports.
              </p>

              <div className="quarterly-report-list">
                <Accordion bordered={true} items={accordionItems} />
              </div>
            </>
          ) : (
            "There are no forms available for the selected state"
          )}
        </div>
      </div>
    </div>
  );
};

HomeAdmin.propTypes = {
  stateList: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  stateList: state.global.states.map(element => {
    return { label: element.state_name, value: element.state_id };
  })
});

export default connect(mapStateToProps)(HomeAdmin);
