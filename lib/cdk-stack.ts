import * as cdk from 'aws-cdk-lib';
import { ApiGateway } from './ApiGateway';
import { Construct } from 'constructs';
import { Lambda } from './Lambda';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import iam = require('aws-sdk/clients/iam');


export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaRole = new Role(this, 'LambdaExecutionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      effect : iam.Effect.ALLOW,
      actions: [ 'logs:CreateLogStream', 'logs:PutLogEvents', 'logs:CreateLogGroup'],
      resources: ['*'] 
    }));

    const apiGatewayRole = new Role(this, 'ApiGatewayExecutionRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });
    

    
    //api
    
    const api = new ApiGateway(this);

    // lambda steup
    const healthLambda = new Lambda(this, "health")

    // Add method to API
    api.addIntegration("GET", "/health", healthLambda)

  }
}
