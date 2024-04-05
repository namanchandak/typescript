import { DynamoDBClient, ScanCommand, PutItemCommand, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "MyTable";

export const handler = async (event: {
  pathParameters: any;
  body: string;
  httpMethod: string;
}) => {
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    if (event.httpMethod === "POST") {
      const data = JSON.parse(event.body);
      if (typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Invalid data format");
      }
    
      if (!data.id || typeof data.id !== "number") {
        throw new Error("Invalid or missing 'id' field");
      }
          const existingItem = await dynamo.send(new GetItemCommand({
        TableName: tableName,
        Key: {
          id: { N: String(data.id) }
        }
      }));
    
      if (existingItem.Item) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "User already exists" }),
          headers,
        };
      }
    
      await dynamo.send(new PutItemCommand({
        TableName: tableName,
        Item: {
          id: { N: String(data.id) },
          ...(data.name && { name: { S: data.name } }),
        },
      }));
    
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Data added successfully" }),
        headers,
      };
    }
     else if (event.httpMethod === "PUT") {

      const data = JSON.parse(event.body);
      if (typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

      // if (!event.pathParameters.id || typeof event.pathParameters.id !== "number") {
      //   throw new Error("Invalid or missing 'id' field");
      // }

      const existingItem = await dynamo.send(new GetItemCommand({
        TableName: tableName,
        Key: {
          id: { N: String(event.pathParameters.id) }
        }
      }));

      await dynamo.send(new UpdateItemCommand({
        TableName: tableName,
        Key: {
          id: { N: String(event.pathParameters.id) }
        },
        UpdateExpression: "SET #name = :name",
        ExpressionAttributeNames: {
          "#name": "name",
        },
        ExpressionAttributeValues: {
          ":name": { S: data.name },
        },
      }));


      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Data updated successfully" }),
        headers,
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Unsupported HTTP method" }),
        headers,
      };
    }
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify(err+  "hiii" + event.httpMethod),
      headers,
    };
  }
};
