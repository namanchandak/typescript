import { DynamoDBClient, ScanCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "MyTable";

export const handler = async (event: {
  routeKey: any;
  pathParameters: { id: string | undefined };
  body: string;
}) => {
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  let body2: any[] = []; 

  try {

    const scanOutput = await dynamo.send(new ScanCommand({ TableName: tableName }));
    body2 = scanOutput.Items || []; 

    const givenId = event.pathParameters?.id ? parseInt(event.pathParameters.id) : undefined;

    if (givenId === undefined || isNaN(givenId)) {
      statusCode = 400;
      return {
        statusCode,
        body: JSON.stringify({ message: "Invalid id parameter" }),
        headers,
      };
    }

    const matchedItem = body2.find(item => parseInt(item.id.N) === givenId);

    let responseBody;

    if (matchedItem) {
      responseBody = matchedItem;

      // If the item exists, delete it from the DynamoDB table
      await dynamo.send(new DeleteItemCommand({
        TableName: tableName,
        Key: { id: matchedItem.id }
      }));

      responseBody = { message: "Item removed successfully" };
    } else {
      statusCode = 404;
      responseBody = { message: "Item not found" };
    }

    return {
      statusCode,
      body: JSON.stringify(responseBody),
      headers,
    };
  } catch (err) {
    statusCode = 500;
    return {
      statusCode,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers,
    };
  }
};
