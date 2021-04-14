import React from "react";
import { connect } from "react-redux";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CertificationTab from "../CertificationTab/CertificationTab";
import SummaryTab from "../SummaryTab/SummaryTab";
import PropTypes from "prop-types";
import QuestionComponent from "../Question/Question";

import "./TabContainer.scss";

const TabContainer = ({
  tabDetails,
  questions,
  answers,
  disabled,
  currentTabs,
  quarter
}) => {
  return (
    <Tabs className="tab-container-main padding-x-5">
      <TabList>
        {currentTabs.map((tab, idx) => {
          const rangeDetails = tabDetails.find(
            element => tab === element.range_id
          );

          // Custom tab label from age range ID
          const tabLabel = rangeDetails
            ? rangeDetails.age_range
            : `Ages ${tab.slice(0, 2)} - ${tab.slice(-2)}`;
          return <Tab key={idx}>{tabLabel}</Tab>;
        })}
        <Tab>Summary</Tab>
        <Tab>Certification</Tab>
      </TabList>

      {currentTabs.map((tab, idx) => {
        // Filter out just the answer objects that belong in this tab
        const tabAnswers = answers.filter(element => element.rangeId === tab);

        const ageRangeDetails = tabDetails.find(
          element => tab === element.range_id
        );
        return (
          <TabPanel key={idx} className="react-transition fade-in">
            {ageRangeDetails ? (
              <div className="age-range-description padding-y-2">
                <h3>{ageRangeDetails.age_description}:</h3>
              </div>
            ) : null}

            {questions.map((singleQuestion, idx) => {
              // Extract the ID from each question and find its corresponding answer object
              const questionID = singleQuestion.question;
              const questionAnswer = tabAnswers.find(
                element => element.question === questionID
              );

              let returnComponent = "";
              let activeContextData = false;
              let tempContextData = {};

              if (singleQuestion.context_data) {
                tempContextData =
                  singleQuestion.context_data.show_if_quarter_in;
                activeContextData = true;
              }
              //Conditional display only works with single quarters and equals (so far)
              if (
                activeContextData === false ||
                (activeContextData && tempContextData === quarter)
              ) {
                returnComponent = (
                  <QuestionComponent
                    key={idx}
                    rangeID={tab}
                    questionData={singleQuestion}
                    answerData={questionAnswer}
                    disabled={disabled}
                  />
                );
              }
              return returnComponent;
            })}
          </TabPanel>
        );
      })}

      <TabPanel>
        <SummaryTab />
      </TabPanel>
      <TabPanel>
        <CertificationTab />
      </TabPanel>
    </Tabs>
  );
};

TabContainer.propTypes = {
  currentTabs: PropTypes.array.isRequired,
  tabDetails: PropTypes.array.isRequired,
  questions: PropTypes.array.isRequired,
  answers: PropTypes.array.isRequired,
  disabled: PropTypes.bool.isRequired
};

const mapState = state => ({
  disabled:
    state.currentForm.statusData.not_applicable ||
    state.currentForm.statusData.status === "final",
  currentTabs: state.currentForm.tabs,
  tabDetails: state.global.age_ranges,
  questions: state.currentForm.questions,
  answers: state.currentForm.answers
});

export default connect(mapState)(TabContainer);
