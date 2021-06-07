import handler from "./../../libs/handler-lib";
import {
  getUsersEmailByRole,
  getUncertifiedStates,
} from "../shared/sharedFunctions";

var AWS = require("aws-sdk");
var ses = new AWS.SES({ region: "us-east-1" });

/**
 * Handler responsible for sending notification to state users At the end of each Quarter.
 * At the end of each Quarter, as a State User, I want to know if my state has NOT certified its data yet.
 */

export const main = handler(async (event, context) => {
  const email = await stateUsersTemplate();
  console.log("emailTemplate: ", email);
  // ses.sendEmail(email, function (err, data) {
  //   if (err) {
  //     console.log(err);
  //     context.fail(err);
  //   } else {
  //     console.log(data);
  //     context.succeed(event);
  //   }
  // });
  return {
    status: "success",
    message: "quartly Businness owners email sent",
  };
});

let date = {
  year: new Date().getFullYear(),
  quarter: new Date().getMonth(),
};

// returns a list of state users emails whose state isnt fully certified
async function certifiedStateUsersEmail() {
  const allStateEmails = await getUsersEmailByRole("state");
  const uncertifiedStateList = await getUncertifiedStates();
  console.log("uncertified states: ",uncertifiedStateList);

  let stateUsersToEmail = [];
  allStateEmails.map((e) => {
    if (uncertifiedStateList.includes(e.state[0])) {
      stateUsersToEmail.push(e.email);
    }
  });
  return stateUsersToEmail;
}

// creates a template for stateUsers
async function stateUsersTemplate() {
  // Email of state users whose state isnt certified yet
  const stateUsersToEmail = await certifiedStateUsersEmail();
  const fromEmail = "mdct@cms.hhs.gov";
  let todayDate = new Date().toISOString().split("T")[0];

  const recipient = {
    TO: stateUsersToEmail,
    SUBJECT: `Reminder: [State] FFY${year} Q${quarter} SEDS Enrollment Data Overdue`,
    FROM: fromEmail,
    MESSAGE: `
    Hello State user,

    We are reaching out to check on the status of your state's FFY${year}
    Q${quarter} child enrollment data submission in the Statistical Enrollment Data System (SEDS).

    FFY${year} Q${quarter} reporting of enrollment data to the SEDS was
    due on ${todayDate}. Our records indicate that [State] has not yet submitted
    the required enrollment data to SEDS at this time. Please let us know when
    we can expect your submission.

    If your state has any other outstanding Quarter(s) of data, please submit
    that information along with your FFY${year} Q${quarter} data.

    If your state allows retroactive eligibility, you may certify the FFY${year} Q${quarter}
    enrollment reports as preliminary in the system. When you have the final enrollment data, you may 
    update and certify the final reports thirty (30) days after the end of the next quarter 
    (with next quarter's preliminary report). The final reports should include information about children whose eligibility 
    was retroactive to the earlier quarter.

    If you have any questions,
    please send an email to: MDCT_Help@cms.hhs.gov

    CMS SEDS TEAM

    `,
  };
  return {
    Destination: { ToAddresses: recipient.TO },
    Message: {
      Body: {
        Text: {
          Data: recipient.MESSAGE,
        },
      },
      Subject: {
        Data: recipient.SUBJECT,
      },
    },
    Source: recipient.FROM,
  };
}
