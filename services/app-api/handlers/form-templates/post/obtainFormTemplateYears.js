import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";
import { authorizeAdmin } from "../../../auth/authConditions";

export const main = handler(async (event, context) => {
  await authorizeAdmin(event);

  const params = {
    TableName:
      process.env.FORM_TEMPLATES_TABLE_NAME ??
      process.env.FormTemplatesTableName,
    ExpressionAttributeNames: {
      "#theYear": "year",
    },
    ProjectionExpression: "#theYear",
  };

  const result = await dynamoDb.scan(params);

  if (result.Count === 0) {
    return [];
  }

  const resultsArray = result.Items.map((i) => i.year);

  return resultsArray.sort((a, b) => b - a);
});
