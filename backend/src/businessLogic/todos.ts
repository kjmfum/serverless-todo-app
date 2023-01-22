
import * as uuid from 'uuid'
import { TodoAccess } from "../dataLayer/todosAccess";
import { Attachment } from '../helpers/attachmentUtils';
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';


const todoAccess = new TodoAccess()


export async function getTodosForUser(userId: string) : Promise<TodoItem[]> {
    return todoAccess.getAllTodos(userId)
    
}

export async function createTodoForUser( userId: string, createTodoRequest : CreateTodoRequest) : Promise<TodoItem> {
        const todoItemId = uuid.v4()
        const item : TodoItem  = await todoAccess.createTodo({
            userId: userId,
            todoId: todoItemId,
            createdAt: new Date().toISOString(),
            name: createTodoRequest.name,
            dueDate: createTodoRequest.dueDate,
            done: false,
            attachmentUrl: null
          }
        )
        return item;
}

export async function updateTodo( userId: string, todoId: string, updatedTodo: UpdateTodoRequest) : Promise<TodoUpdate> {
    return todoAccess.updateTodo(userId, todoId, updatedTodo)
}

export async function deleteTodo( userId: string, todoId: string) : Promise<void> {
  return todoAccess.deleteTodo(userId, todoId)
}

export async function getUploadUrl(userId: string, todoId: string, attachmentId: string) {
  const attachmentData = await Attachment(attachmentId)
  const fileUrl =  await todoAccess.getUploadUrl(userId, todoId, attachmentData.uploadUrl)
  console.log(fileUrl);
  
  return attachmentData.putObject
}

