import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as SingleEc2 from '../lib/single-ec2-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SingleEc2.SingleEc2Stack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    "Resources": {}
  }, MatchStyle.EXACT))
});
