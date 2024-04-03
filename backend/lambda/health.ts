import { ApiGateway } from "aws-cdk-lib/aws-events-targets";
import { APIGatewayEvent, APIGatewayProxyCallback, APIGatewayProxyResult } from "aws-lambda";
import { promises } from "dns";

export const handler = async(event : APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    console.log("lambda from health", event);

    return{
        body: "OK",
        statusCode:200
    }
}