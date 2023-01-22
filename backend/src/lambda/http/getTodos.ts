import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

// import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
// import { getUserId } from '../utils';
import { getTodosForUser } from '../../businessLogic/todos';
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user

// const docClient = new AWS.DynamoDB.DocumentClient()

// const todosTable = process.env.todosTable
// const todosIndexName = process.env.TODOS_CREATED_AT_INDEX


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    const todos = await getTodosForUser(userId)
    console.log(`Getting stuff 1: ${todos}`);
    console.log(`Getting stuff 2: ${todos[0].name}`);
    console.log(`Getting stuff 3: ${todos[0].userId}`);
    console.log(`Getting stuff 4: ${todos[0]["name"]}`);
    
    // google-oauth2|101675378332843725088
    // const todos = getTodosForUser(userId)
    // const todos = getTodosForUser("google-oauth2|101675378332843725088")
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: [
                ...todos
        ]
      })
    }

  //   async function  getTodosForUser(userId: string){
  //     const result = await docClient.query(
  //       {
  //         TableName: todosTable,
  //         IndexName: todosIndexName,
  //         KeyConditionExpression: 'userId = :userId',
  //         ExpressionAttributeValues: {
  //           ':userId' : userId
  //         },
  //         ScanIndexForward:false
  //       }
  //     ).promise()

  //     return result.Items;
  // }
  },
 
  
  )

handler.use(
  cors({
    credentials: true
  })
)
