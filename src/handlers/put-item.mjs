// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const aleatorio=Math.floor(Math.random() * 1000000);

    const id = aleatorio;
    const name = body.name;
    const surname= body.surname;

    if(name.length<3){
        //aqui tengo que hacer la respuesta de error 
        return {
            statusCode: 403,
            body: "Introduce un nombre mayor con más longitud"
        }

    }else{
            //inserto en bbdd y devolver 200
            var params = {
                TableName : tableName,
                Item: { id : aleatorio.toString(), name: name , surname: surname}
            };
        
            try {
                const data = await ddbDocClient.send(new PutCommand(params));
                console.log("Success - item added or updated", data);
              } catch (err) {
                console.log("Error", err.stack);
              }
        
           return {
                statusCode: 200,
                body: JSON.stringify(body)
            };
        
          
        }

   
    
    
};
