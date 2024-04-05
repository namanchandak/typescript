import * as cdk from 'aws-cdk-lib';
import { ApiGateway } from './ApiGateway';
import { Construct } from 'constructs';
import { getAllUsers } from './getAllUserslambda';
import { getByIdLambda } from './getByIdLambda';
import { deleteLambda } from './deleteLambda';
import { crud } from './crud';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'; 

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //api
    
    const api = new ApiGateway(this);

    const getAllUserslambda = new getAllUsers(this, "getAllUsers");
    const getByIdlambda = new getByIdLambda(this, "getById");
    const deletelambda = new deleteLambda(this, "delete");
    const Crud= new crud(this, "crud");


    // // Integrate Lambda function with API Gateway
    api.addIntegration("GET", "/items/{id}", getByIdlambda);
    api.addIntegration("GET", "/items", getAllUserslambda);
    api.addIntegration("PUT", "/items/{id}", Crud);
    api.addIntegration("POST", "/items", Crud);
    api.addIntegration("DELETE", "/items/{id}", deletelambda);
    
    const table = new Table(this, 'MyTable', {
      tableName: "MyTable",
      partitionKey: { name: 'id', type: AttributeType.NUMBER },
      
    });
    table.addGlobalSecondaryIndex({
      indexName: 'Index1',
      partitionKey: { name: 'name', type: AttributeType.STRING },
    });
    
    table.addGlobalSecondaryIndex({
      indexName: 'Index2',
      partitionKey: { name: 'attribute3', type: AttributeType.STRING },
    });

    table.grantReadWriteData(getAllUserslambda);
    table.grantReadWriteData(getByIdlambda);
    table.grantReadWriteData(deletelambda);
    table.grantReadWriteData(Crud);

  }
}
