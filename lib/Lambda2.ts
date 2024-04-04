import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import * as path from "path";

export class Lambda2 extends NodejsFunction{
    constructor(scope: Construct,filename :string ){
        super(scope, filename, {
            architecture: Architecture.ARM_64, 
            runtime:Runtime.NODEJS_18_X,
            entry: path.join(__dirname, `../backend/lambda/db2.ts`),
            logRetention: RetentionDays.ONE_DAY
        })
    }
}