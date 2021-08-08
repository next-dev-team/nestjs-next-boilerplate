import { Document } from 'mongoose';
import { Todo } from 'src/todo.ts';
export type TodoDocument = Todo & Document;
