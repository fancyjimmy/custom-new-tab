import {derived, get, readable, writable} from 'svelte/store';
import StartingPage from "./lib/pages/StartingPage.svelte";
import TodoPage from "./lib/pages/TodoPage.svelte";
import BoredPage from "./lib/pages/BoredPage.svelte";
import NotePage from "./lib/pages/NotePage.svelte";
import TimePage from "./lib/pages/TimePage.svelte";
import SettingsPage from "./lib/pages/SettingsPage.svelte";
import {SvelteComponent} from "svelte";
import PenPage from './lib/pages/PenPage.svelte';

type Todo = {
  id: number;
  text: string;
  done: boolean;
  date: Date;
}


export function createBordManager() {
  const stored = localStorage.boardManager;
  let existing: string[] = [];

  if (stored) {
    existing = JSON.parse(stored);
  }

  let manager = writable<string[]>(existing);

  manager.subscribe(items => {
    localStorage.boardManager = JSON.stringify(items);
  });

  const addBoard = (name: string) => {
    if (existing.some(item => item === name)) {
      return;
    }
    manager.update(items => {
      return [...items, name];
    });
  };

  const removeBoard = (name: string) => {
    manager.update(items => {
      return items.filter(item => item !== name);
    });
  };

  const boards = () => {
    return existing.map(name => createTodos(name));
  };

  return {
    subscribe: manager.subscribe,
    addBoard,
    get boards() {
      return boards();
    },
    removeBoard
  };
}

export function serializable<T>(name: string, defaultValue: T, storage: Storage = localStorage) {
  const stored = storage.getItem(name);
  if (stored) {
    defaultValue = JSON.parse(stored);
  }

  const {subscribe, set, update} = writable<T>(defaultValue);

  subscribe(value => {
    if (value !== null) {
      storage.setItem(name, JSON.stringify(value));
    } else {
      storage.removeItem(name);
    }
  });

  return {
    subscribe,
    set,
    update
  };

}

export const bordManager = createBordManager();

export function createTodos(name: string) {
  const stored = localStorage.getItem('todo:' + name);
  let existing: Todo[] = [];

  if (stored) {
    existing = JSON.parse(stored);
  }
  const todos = writable(existing);


  todos.subscribe(items => {
    localStorage.setItem('todo:' + name, JSON.stringify(items));
    if (items.length === 0) {
      localStorage.removeItem('todo:' + name);
    }
  });

  const addTodo = (todo: Todo) => {
    todos.update(items => {
      return [...items, todo];
    });
  };

  const removeTodo = (id: number) => {
    todos.update(items => {
      return items.filter(item => item.id !== id);
    });
  };

  const finishTodo = (id: number) => {
    todos.update(items => {
      return items.map(item => {
        if (item.id === id) {
          item.done = true;
        }
        return item;
      });
    });
  };

  const deleteTodo = (id: number) => {
    todos.update(items => {
      return items.filter(item => item.id !== id);
    });
  };
  const clearTodos = () => {
    todos.set([]);
  };

  return {
    subscribe: todos.subscribe,
    set: todos.set,
    update: todos.update,
    addTodo,
    get name() {
      return name;
    },
    removeTodo,
    deleteTodo,
    clearTodos,
    finishTodo,
    updateTodo(todo) {
      todos.update(items => {
        return items.map(item => {
          if (item.id === todo.id) {
            item = todo;
          }
          return item;
        });
      });
    }
  };
}


export const darkMode = serializable('darkmode', true);
export const defaultPage = serializable('defaultPage', 0);

export const pages = readable<{ name: string, page: typeof SvelteComponent }[]>( [
  {name: "Blank", page: StartingPage},
  {name: "Todo", page: TodoPage},
  {name: "Time", page: TimePage},
  {name: "Note", page: NotePage},
  {name: "Bored", page: BoredPage},
  {name: "🔧", page: SettingsPage}
]);

export function createTimer(name: string) {
  const timer = serializable('timer:' + name, Date.now());


  const timerState = serializable('timerState:' + name, false);


  const start = () => {
    timerState.set(true);
    timer.set(Date.now());
  };

  const stop = () => {
    timerState.set(false);
    timer.set(null);
  };

  return {
    timer: {
      ...timer,
      start,
      stop
    },
    timerState: {
      ...timerState
    },
    remove() {
      timerState.set(null);
      timer.set(null);
    }
  };
}

export function createTimerManager(name: string) {
  const timer = serializable(`timerManager:${name}`, []);

  return {
    ...timer,
    addTimer(name: string) {
      timer.update(items => {
        return [...items, name];
      });
    },
    removeTimer(name: string) {
      timer.update(items => {
        const test = createTimer(name);
        test.remove();
        return items.filter(item => item !== name);
      });
    }
  };
}

export function createNote(name: string) {
  const note = serializable(`note:${name}`, '');

  return note;
}

export function createNoteManager(name: string) {
  const noteManager = serializable(`noteManager:${name}`, []);

  return {
    ...noteManager,
    addNote(name: string) {
      noteManager.update(items => {
        if (items.some(item => item === name)) {
          return items;
        }
        return [...items, name];
      });
    },
    removeNote(name: string) {
      const createdNote = createNoteManager(name);
      createdNote.set(null);
      noteManager.update(items => {
        return items.filter(item => item !== name);
      });
    }
  };
}


export const noteManager = createNoteManager('default');
export const defaultTimerManager = createTimerManager('defaultTimerManager');
