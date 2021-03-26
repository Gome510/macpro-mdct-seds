import React, { useState } from "react";
import { connect } from "react-redux";
import "react-tabs/style/react-tabs.css";
import { Button, Alert, GridContainer, Grid } from "@trussworks/react-uswds";
import {
  certifyAndSubmitFinal,
  certifyAndSubmitProvisional
} from "../../store/actions/certify";
import PropTypes from "prop-types";
import {Auth} from "aws-amplify";

const CertificationTab = ({
                            status,
                            notApplicable,
                            lastModified,
                            lastModifiedBy,
                            isFinal,
                            isProvisional,
                            certifyAndSubmitFinal,
                            certifyAndSubmitProvisional
                          }) => {
  const [provisionalButtonStatus, setprovisionalButtonStatus] = useState(
      isFinal === true ? true : isProvisional
  );

  const [finalButtonStatus, setfinalButtonStatus] = useState(isFinal);


  const submitProvisional = async () => {
    certifyAndSubmitProvisional();//*** Need to add proper way to pull user information
    setprovisionalButtonStatus(true);
  };
  const submitFinal = () => {
    certifyAndSubmitFinal();
    setprovisionalButtonStatus(true);
    setfinalButtonStatus(true);
  };
  const certifyInformation = (
      <div>
        <p>
          Double check that everything in your SEDS report is accurate. You will
          have to uncertify your report to make any edits to your final data after
          submitting.
        </p>
        <p>
          Once you have reviewed your report, certify that it’s accurate and in
          compliance with Title XXI of the Social Security Act (Section 2109(a)
          and Section 2108(e)).
        </p>
        <>
          This report was updated to <b>{status}</b> on <b>{lastModified}</b> by{" "}
          <b>{lastModifiedBy}</b>
        </>
      </div>
  );

  let certifyText = <></>;
  if (isFinal) {
    certifyText = (
        <>
          <b> Thank you for submitting your SEDS data!</b>
          <p>
            Submitted on {lastModified} by {lastModifiedBy}
          </p>
        </>
    );
  } else if (isProvisional) {
    certifyText = (
        <div>
          <b>Ready to final certify?</b> + {certifyInformation.toString()} +{" "}
        </div>
    );
  } else {
    certifyText = (
        <div>
          <b>Ready to certify?</b> {certifyInformation}{" "}
        </div>
    );
  }
  return (
      <>
        {test}
        {isFinal ? (
            <div>
              <Alert
                  type="success"
                  heading="Thank you for submitting your SEDS data!"
              >
                <b> What to expect next:</b> You will hear from CMS if they have any
                questions about your report.
              </Alert>
            </div>
        ) : null}

        {isProvisional ? (
            <div>
              <Alert
                  type="info"
                  heading="You have submitted provisional SEDS data"
              />
            </div>
        ) : null}

        <h3> Certify and Submit</h3>
        {certifyText}

        <GridContainer>
          <Grid row>
            <Grid col={6} className="certify-btn provisional">
              <Button
                  onClick={() => submitProvisional()}
                  type="button"
                  disabled={provisionalButtonStatus}
              >
                {"Certify & Submit Provisional Data"}
              </Button>
            </Grid>
            <Grid col={6} className="certify-btn final">
              <Button
                  onClick={() => submitFinal()}
                  type="button"
                  disabled={finalButtonStatus}
              >
                {"Certify & Submit Final Data"}
              </Button>
            </Grid>
          </Grid>
        </GridContainer>
      </>
  );
};

CertificationTab.propTypes = {
  certifyAndSubmitFinal: PropTypes.func.isRequired,
  certifyAndSubmitProvisional: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  notApplicable: PropTypes.bool.isRequired,
  lastModified: PropTypes.string.isRequired,
  lastModifiedBy: PropTypes.string,
  isFinal: PropTypes.bool.isRequired,
  isProvisional: PropTypes.bool.isRequired
};

const mapState = state => ({
  status: state.currentForm.statusData.status,
  notApplicable: state.currentForm.statusData.not_applicable,
  lastModified: state.currentForm.statusData.last_modified,
  lastModifiedBy: state.currentForm.statusData.last_modified_by,
  isFinal: state.currentForm.statusData.status === "final",
  isProvisional: state.currentForm.statusData.status === "Provisional Data Certified and Submitted"
});

const mapDispatch = {
  certifyAndSubmitFinal,
  certifyAndSubmitProvisional
};
export default connect(mapState, mapDispatch)(CertificationTab);
