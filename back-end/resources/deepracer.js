const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-1"});

function getResponse(data) {
    return {
        body: JSON.stringify(data),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        statusCode: 200
    };
}

async function getRecords(resolve, reject) {
    const TableName = process.env.TABLE_NAME;
        var params = {
          TableName: TableName
        };

        var result = await docClient.scan(params).promise();
        const list = result.Items.sort((a,b) => a.time - b.time);
        resolve(getResponse({data: list}));
};


async function postRecords(resolve,reject, data) {
    const TableName = process.env.TABLE_NAME;
    var params = {
        TableName: TableName,
        Key: {
            "name": data.name
        },
        UpdateExpression: "set #t = :t",
        ConditionExpression: 'attribute_exists(#n) AND #t > :t ',
        ExpressionAttributeNames: { 
            "#t": "time",
            "#n": "name"
         },
        ExpressionAttributeValues: {
            ":t": data.time
        }
      };
      
     // console.log(params);
      docClient.update(params, function(err, res) {
        if (err) {
          console.log("Error", err);
        }
          resolve(getResponse({msg: 'POST Hello World Get Racer'}));
      });
    
    
    
}

exports.main = async function(event, context) {
    return new Promise((resolve,reject)=> {
        try {
              var method = event.httpMethod;
            // Get name, if present
            var widgetName = event.path.startsWith('/') ? event.path.substring(1) : event.path;
            
            if (method === "GET") {
                getRecords(resolve,reject);
            } else if (method === "POST") {
                postRecords(resolve,reject, JSON.parse(event.body));
            } else {
                resolve(getResponse({msg: 'Unknown Request'}));
            }
            
            
        } catch (err) {
            console.log(err);
            resolve(getResponse({msg: 'Error Occurred'}));

        }
    });
}
    
   