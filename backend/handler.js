'use strict';

const { dynamoTableName: TableName } = require('./constants');

const AWS = require('aws-sdk');
const uuid = require('uuid');

module.exports.hello = (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless v1.0! Your function executed successfully!',
            input: event,
        }),
    };

    callback(null, response);
};

module.exports.getRating = (event, context, callback) => {
    const docClient = new AWS.DynamoDB.DocumentClient();

    if (!event.queryStringParameters || !event.queryStringParameters.beer) {
        const errorResponse = {
            status: 400,
            errors: [{ code: 101, source: '/beer/rating', message: "Missing required query parameter 'beer'" }],
        };
        context.fail(errorResponse);
        // callback(JSON.stringify(myErrorObj));
    }

    const params = {
        TableName,
        FilterExpression: 'beer = :beer_name',
        ExpressionAttributeValues: { ':beer_name': event.queryStringParameters.beer },
    };

    docClient.scan(params, (error, data) => {
        if (error) {
            callback(error);
        }

        if (!data.Items || data.Items.length === 0) {
            callback(new Error(`No ratings present in table with TableName=${TableName}`));
        }

        const sum = data.Items.reduce((accumulated, current) => {
            return accumulated + current.rating;
        }, 0);

        const average = sum / data.Items.length;

        callback(null, {
            statusCode: 200,
            headers: {
                ContentType: 'application/json',
                'Access-Control-Allow-Origin': '*',
                // 'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify({ averageRating: average }),
        });
    });
};

module.exports.addRating = (event, context, callback) => {
    const dynamo = new AWS.DynamoDB.DocumentClient();

    const params = JSON.parse(event.body);
    const Item = {
        id: uuid.v4(),
        beer: params.beer,
        rating: Number(params.rating),
    };

    dynamo.put({ TableName, Item }, (error) => {
        if (error) {
            callback(error);
        }

        callback(null, {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                // 'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
        });
    });
};
