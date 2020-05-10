# Serverless Ratings

Backend loosely based on https://www.netlify.com/blog/2016/09/15/serverless-jam-a-serverless-framework-tutorial/

## Prerequisites

1. Make sure you have the AWS CLI installed and your keys configured for an account
   with sufficient privileges to create the stack on AWS

## Backend

### Deploy

1. Run `yarn install`
1. Run `yarn deploy`
1. Go to the CloudFormation in the AWS Console
1. The load balancer URL is the the stack Outputs

### Delete

1. Run `yarn delete`

## Frontend

1. Run `yarn install`
1. Run `yarn start`
