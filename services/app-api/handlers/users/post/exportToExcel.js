import handler from "../../../libs/handler-lib";
//import dynamoDb from "../../../libs/dynamodb-lib";
import { Workbook } from "exceljs";

/*const unstream = require("unstream");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));*/

export const main = handler(async (event, context) => {
  // If this invokation is a prewarm, do nothing and return.
  if (event.source === "serverless-plugin-warmup") {
    console.log("Warmed up!");
    return null;
  }

  // *** create workbook
  const workbook = new Workbook();

  // *** add worksheed
  const worksheet = workbook.addWorksheet("test worksheet");

  const titleRow = worksheet.addRow(["Test title"]);
  titleRow.font = { name: "Calibri", family: 2, size: 16, bold: true };

  return await workbook.xlsx.writeBuffer();
});

// ** individual functions
