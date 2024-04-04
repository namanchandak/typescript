import * as cdk from 'aws-cdk-lib';
import { ApiGateway } from './ApiGateway';
import { Construct } from 'constructs';
import { Lambda } from './Lambda';
import { Lambda2 } from './Lambda2';
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
    const lambdaFunction2 = new Lambda2(this, "db2");


    // // Integrate Lambda function with API Gateway
    api.addIntegration("GET", "/items/{id}", lambdaFunction2);
    api.addIntegration("GET", "/items", lambdaFunction);
    api.addIntegration("PUT", "/items", lambdaFunction);
    api.addIntegration("DELETE", "/items/{id}", lambdaFunction);
    
    const table = new Table(this, 'MyTable', {
      tableName: "MyTable",
      partitionKey: { name: 'id', type: AttributeType.NUMBER },
      sortKey: { name: 'name', type: AttributeType.STRING }
    });
    table.grantReadWriteData(lambdaFunction);
    table.grantReadWriteData(lambdaFunction2);

  }
}
