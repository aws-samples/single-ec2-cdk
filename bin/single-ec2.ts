#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SingleEc2Stack } from '../lib/single-ec2-stack';

const app = new cdk.App();
new SingleEc2Stack(app, 'SingleEc2Stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  stackName: process.env.STACKNAME
});
