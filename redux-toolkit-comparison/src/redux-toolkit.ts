import {
  applyMiddleware,
  configureStore,
  createSlice,
  getDefaultMiddleware,
  PayloadAction
} from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"
import logger from "redux-logger"

import { Todo } from "./type"
import {log} from "util";

const todosInitialState: Todo[] = [
  {
    id: uuidv4(),
    desc: "Learn React",
    isComplete: true
  },
  {
    id: uuidv4(),
    desc: "Learn Redux",
    isComplete: true
  },
  {
    id: uuidv4(),
    desc: "Learn Redux-ToolKit",
    isComplete: false
  }
]

const todosSlice = createSlice({
  name: 'todos',
  initialState: todosInitialState,
  reducers: {
    create: {
      reducer: (state,
        {
          payload
        }: PayloadAction<{ id: string, desc: string, isComplete: boolean }>) => {
        state.push(payload)
      },
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuidv4(),
          desc,
          isComplete: false
        }
      })
      }
    ,
    edit: (state, { payload }: PayloadAction<{ id: string, desc: string }>) => {
      const todoToEdit = state.find(todo => todo.id === payload.id)
      if (todoToEdit) {
        todoToEdit.desc = payload.desc
      }
    },
    toggle: (state, { payload }: PayloadAction<{ id: string, isComplete: boolean}>) => {
      const toggleTodo = state.find(todo => todo.id === payload.id)
      if (toggleTodo) {
        toggleTodo.isComplete = payload.isComplete
      }
    },
    remove: (state, { payload }: PayloadAction<{ id: string }>) => {
      const index = state.findIndex(todo => todo.id === payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }
  }
})

// state = payload.id -> is not working with primitives in InitialState!
const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  initialState: null as string | null,
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: string }>) => payload.id
  }
})

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: state => state + 1,
    [todosSlice.actions.edit.type]: state => state + 1,
    [todosSlice.actions.toggle.type]: state => state + 1,
    [todosSlice.actions.remove.type]: state => state + 1
  }
})

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator
} = todosSlice.actions

export const {
  select: selectTodoActionCreator
} = selectedTodoSlice.actions

const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer
}

const middleware = [...getDefaultMiddleware(), logger]
export default configureStore({
  reducer,
  middleware
})