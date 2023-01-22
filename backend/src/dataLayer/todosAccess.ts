
import * as AWS from "aws-sdk";
import * as AWSXRAY from 'aws-xray-sdk';
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";
import { createLogger } from "../utils/logger";


const XAWS = AWSXRAY.captureAWS(AWS)

const logger = createLogger('TodoAccess')

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE
    ){}
    async getAllTodos(userId: string): Promise<TodoItem[]> {
      logger.info(`Getting all todo for user id: `, {userId})
        const result = await this.docClient.query(
            {
              TableName: this.todosTable,
              IndexName: process.env.TODOS_CREATED_AT_INDEX,
              KeyConditionExpression: 'userId = :userId',
              ExpressionAttributeValues: {
                ':userId' : userId
              },
              ScanIndexForward:false
            }
          ).promise()
          const items = result.Items
          console.log(`My results ${userId}`);
          
          return items as TodoItem[];
    }

    async createTodo(todo: TodoItem) : Promise<TodoItem> {
      logger.info(`Creating Info: `, {todo})
      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise();

      return todo
    }

    async updateTodo(userId: string, todoId: string, todosUpdate: TodoUpdate) : Promise<TodoUpdate> {
     await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set #name = :name, dueDate =:dueDate, done = :done',
        ExpressionAttributeNames: {
           '#name' : 'name'
        },
        ExpressionAttributeValues : {
          ':name' : todosUpdate.name,
          ':dueDate' : todosUpdate.dueDate,
          ':done' : todosUpdate.done,
        }
      }).promise()

      console.log(`Updated info: ${todosUpdate}`);
      
      return todosUpdate
    }

    async deleteTodo(userId: string, todoId: string) : Promise<void> {
      logger.info(`Deleting Info: `, {todoId, userId})
        await this.docClient.delete({
          TableName:this.todosTable,
          Key: {userId,
            todoId}
        }).promise()
      
    }

    async getUploadUrl(userId: string, todoId: string, attachmentUrl: string) : Promise<void> {
      const updateData = await this.docClient.update({
        TableName: this.todosTable,
        Key: {userId, todoId},
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
      }).promise()
      logger.info(`UpdatedTodo Info: `, {updateData})
      console.log(updateData);
    }

}
