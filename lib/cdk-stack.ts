import * as cdk from 'aws-cdk-lib';
import { ApiGateway } from './ApiGateway';
import { Construct } from 'constructs';
import { Lambda } from './Lambda';
import { handler } from "./db";
import iam = require('aws-sdk/clients/iam');
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'; 



export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //api
    
    const api = new ApiGateway(this);

    // lambda steup
    // const healthLambda = new Lambda(this, "health")

    // // Add method to API
    // api.addIntegration("GET", "/health", healthLambda)

    ///database

    const lambdaFunction = new Lambda(this, "db");


    // // Integrate Lambda function with API Gateway
    api.addIntegration("GET", "/items/{id}", lambdaFunction);
    api.addIntegration("GET", "/items", lambdaFunction);
    api.addIntegration("PUT", "/items", lambdaFunction);
    api.addIntegration("DELETE", "/items/{id}", lambdaFunction);
    
    const table = new Table(this, 'MyTable', {
      tableName: "MyTable",
      partitionKey: { name: 'id', type: AttributeType.NUMBER },
      sortKey: { name: 'name', type: AttributeType.STRING }
    });
    table.grantReadWriteData(lambdaFunction);

  }
}
