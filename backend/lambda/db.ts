import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "MyTable";

export const handler = async (event: {
  routeKey: any;
  pathParameters: { id: any };
  body: string;
}) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    body = await dynamo.send(new ScanCommand({ TableName: tableName }));
    body = body.Items;
  } catch (err) {

    statusCode = 400;
    console.log(err);

    body = JSON.stringify("hiiiiii");
  } finally {

    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
