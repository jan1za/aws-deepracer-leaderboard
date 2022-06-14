import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { AttributeType, Table, BillingMode } from "aws-cdk-lib/aws-dynamodb";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DeepracerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const driverStandings = "deepracerdrivers";
    const name = id + "-api"

    const table = new Table(this, `${name}-driver-standings-table`, {
            tableName: driverStandings,
            partitionKey: {
                name: "name",
                type: AttributeType.STRING,
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY
    });
    
    const handler = new lambda.Function(this, "DeepRacerHandler", {
      runtime: lambda.Runtime.NODEJS_16_X, // So we can use async in widget.js
      code: lambda.Code.fromAsset("resources"),
      handler: "deepracer.main",
      environment: {
         "TABLE_NAME": driverStandings,
      }
    });
    
    table.grantReadWriteData(handler);

    const apiGet = new apigateway.RestApi(this, "deep-racer-api", {
      restApiName: "Deep Racer Service",
      description: "This service managers the deep racer event.",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS
      }
    });
    
    const getDeepRacerIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });
    
    const postDeepRacerIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    apiGet.root.addMethod("GET", getDeepRacerIntegration); // GET /
    apiGet.root.addMethod("POST", getDeepRacerIntegration); // POST /

  }
}
