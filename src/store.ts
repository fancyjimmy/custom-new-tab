import {writable} from "svelte/store";

type Todo = {
    id: number;
    text: string;
    done: boolean;
    date: Date;
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
        update,
    }

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
    }

    const removeBoard = (name: string) => {
        manager.update(items => {
            return items.filter(item => item !== name);
        });
    }

    const boards = () => {
        return existing.map(name => createTodos(name));
    }

    return {
        subscribe: manager.subscribe,
        addBoard,
        get boards() {
            return boards();
        },
        removeBoard,
    }
}

export const bordManager = createBordManager();

export function createTodos(name: string) {
    const stored = localStorage.getItem("todo:" + name);
    let existing: Todo[] = [];

    if (stored) {
        existing = JSON.parse(stored);
    }
    const todos = writable(existing);


    todos.subscribe(items => {
        localStorage.setItem("todo:" + name, JSON.stringify(items));
        if (items.length === 0) {
            localStorage.removeItem("todo:" + name);
        }
    })

    const addTodo = (todo: Todo) => {
        todos.update(items => {
            return [...items, todo];
        });
    }

    const removeTodo = (id: number) => {
        todos.update(items => {
            return items.filter(item => item.id !== id);
        });
    }

    const finishTodo = (id: number) => {
        todos.update(items => {
            return items.map(item => {
                if (item.id === id) {
                    item.done = true;
                }
                return item;
            });
        });
    }

    const deleteTodo = (id: number) => {
        todos.update(items => {
            return items.filter(item => item.id !== id);
        });
    }
    const clearTodos = () => {
        todos.set([]);
    }

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
    }
}


export const darkmode = serializable("darkmode", true);
export const defaultPage = serializable("defaultPage", 0);
