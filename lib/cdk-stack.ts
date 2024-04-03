import * as cdk from 'aws-cdk-lib';
import { ApiGateway } from './ApiGateway';
import { Construct } from 'constructs';
import { Lambda } from './Lambda';


export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //api
    
    const api = new ApiGateway(this);

    // lambda steup
    const healthLambda = new Lambda(this, "health")

    // Add method to API
    api.addIntegration("GET", "/health", healthLambda)

  }
}
