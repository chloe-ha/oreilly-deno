import { Router } from 'https://deno.land/x/oak/mod.ts';

const router = new Router();

interface Todo {
  id: string;
  text: string;
}

let todos: Array<Todo> = [];

router.get('/', (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = { todos };
});

router.post('/todo', async (ctx) => {
  const data = await ctx.request.body();
  const value = await data.value;
  const todoText = value.text;

  if (!todoText) {
    ctx.response.status = 422;
    ctx.response.body = { message: 'Missing todo text' };
    return;
  }

  const newTodo: Todo = { id: new Date().toISOString(), text: todoText };
  todos.push(newTodo);

  ctx.response.status = 201;
  ctx.response.body = { message: 'Successful', todo: newTodo, todos };
});

router.put('/todo/:todoId', async (ctx) => {
  const tid = ctx.params.todoId;
  const todoIndex = todos.findIndex((t) => t.id === tid);
  if (todoIndex === -1) {
    ctx.response.status = 404;
    ctx.response.body = { message: 'Could not find todo for this id' };
    return;
  }

  const updatedTodo: Todo = todos[todoIndex];
  const data = await ctx.request.body();
  const value = await data.value;
  const todoText = value.text;
  updatedTodo.text = todoText;
  ctx.response.status = 200;
  ctx.response.body = { message: 'Successful', todo: updatedTodo, todos: todos };
});

router.delete('/todo/:todoId', async (ctx) => {
  const tid = await ctx.params.todoId;
  const todoIndex = todos.findIndex((t) => t.id === tid);
  if (todoIndex === -1) {
    ctx.response.status = 404;
    ctx.response.body = { message: 'Could not find todo for this id' };
  }

  const deletedTodo = todos.splice(todoIndex, 1)[0];
  ctx.response.status = 200;
  ctx.response.body = { message: 'Successful', todo: deletedTodo, todos: todos };
});

export default router;
