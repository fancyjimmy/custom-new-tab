<script lang="ts">
    import {createTodos} from "../store";
    import {bordManager} from "../store";

    import Icon from '@iconify/svelte';
    import {createEventDispatcher} from "svelte";

    export let name;

    const board = createTodos(name);

    const dispatcher = createEventDispatcher();

    let text = "";
    let form;
    export let active = false;
</script>

<div class="relative bg-slate-400/30 duration-200 dark:bg-slate-900/30 border shadow border-slate-200/60 dark:border-slate-700/60 p-2 rounded h-min backdrop-blur-[3px]"
     on:mouseenter={() => dispatcher("mouseenter")} on:mouseleave={() => dispatcher("mouseleave")}>
    <h3 class="text-slate-900 text-2xl dark:text-slate-200 font-bold {!active ? 'rotate-text py-9' : ''}">{name}</h3>
    {#if active}

        <button class="absolute top-2 right-2 text-slate-600 hover:text-slate-400 text-xl duration-500" on:click={() => {bordManager.removeBoard(name);
    board.clearTodos();
    }}>
            <Icon icon="mdi:trash"/>
        </button>
        <div class="flex flex-col">
            {#each $board as todo}
                <div class="flex items-center">
                    <label class="p-2 flex-1 inline-flex justify-between font-semibold dark:text-white text-slate-800 truncate">
                        {todo.text}
                        <input type="checkbox" class="dark:bg-slate-700" bind:checked={todo.done}
                               on:change={() => board.updateTodo(todo)}>
                    </label>
                    <button
                            class="text-slate-600 hover:text-slate-400 text-xl duration-500 "
                            on:click={() => board.deleteTodo(todo.id)}>
                        <Icon icon="mdi:trash"/>
                    </button>
                </div>
            {/each}
        </div>


        <form bind:this={form} on:submit|preventDefault={() => {
                        board.addTodo({text: text, date: new Date().toISOString(), id: Math.floor(Math.random() * 10000), done: false});
                                    text = "";

                    }}
              class="bg-slate-200 border-2 dark:bg-slate-900 flex p-2 border-slate-600/40 dark:border-slate-600/40 rounded-lg dark:text-white">
            <input type="text" bind:value={text}
                   class="flex-1 placeholder-slate-600 focus:outline-0 bg-transparent"
                   placeholder="Add a todo..."
            >
            <button type="submit" class="font-bold bg-primary-400 rounded p-1">
                <Icon icon="mdi:add"></Icon>
            </button>
        </form>
    {/if}


</div>


<style>
    .rotate-text{
        writing-mode: vertical-rl;
        text-orientation: mixed;
    }
</style>