import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "MyTable"; // Replace with your actual table name

export const handler = async (event: {
  routeKey: any;
  pathParameters: { id: number }; // Ensure id is a number
  body: any;
}) => {
  const statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  // Check for missing ID
  if (!event.pathParameters?.id) {
    return {
      statusCode: 400,
      body: JSON.stringify('Missing required parameter: "id"'),
      headers,
    };
  }

  try {
    const id = event.pathParameters.id; // No conversion needed for numbers

    const result = await dynamo.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          id, // Use id directly as the partition key value
        },
      })
    );

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify('Item not found for the provided ID'),
        headers,
      };
    }

    return {
      statusCode,
      body: JSON.stringify(result.Item),
      headers,
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify(err),
      headers,
    };
  }
};
