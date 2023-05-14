<script lang='ts'>
  import {createNote} from '../../../store';
  import {createEventDispatcher} from 'svelte';
  import Icon from '@iconify/svelte';

  export let name;

  const dispatch = createEventDispatcher();
  const note = createNote(name);
</script>


<div class='flex flex-col h-full relative'>
  <p class='text-2xl font-semibold p-2 dark:text-slate-100 text-slate-900'>{name}</p>

  <button on:click={() => {dispatch("remove"); note.set(null);}}
    class='absolute top-3 right-3 dark:text-white text-2xl'>
    <Icon icon='mdi:trash-can' />
  </button>

  <textarea bind:value={$note} class ='flex-1 bg-transparent focus:outline-0 dark:text-slate-100 text-slate-900 p-2 scrollbar-hidden' spellcheck='false'></textarea>
</div>


<style>
    textarea {
        resize: none;
    }
</style>