<script lang='ts'>

  import {noteManager} from '../../store';
  import Note from '../components/note/Note.svelte';
  import Icon from '@iconify/svelte';


  let selectedNote = null;
  let note = '';
</script>

<div class='w-full h-full bg-slate-300 dark:bg-slate-900 flex'>
  <div class='w-60 bg-slate-100 dark:bg-slate-800 relative h-full'>
    <div class='absolute inset-0 margin-0 overflow-y-auto scrollbar-hidden'>
      <div class='flex flex-col justify-start items-start'>
        {#each $noteManager as noteName, i}
          <button on:click={() => {selectedNote = null; setTimeout(() => {selectedNote = noteName;})}} class='text-left text-1xl border-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-500 mx-[2%] w-[96%] p-1 truncate px-2 font-semibold dark:text-slate-300'>
            {noteName}
          </button>
        {/each}
      </div>
      <form on:submit|preventDefault={() => {
      if (note.trim() !== '') {
        noteManager.addNote(note.trim());
        note = '';
      }
    }}
            class='better-input m-1 rounded-none'
      >
        <input type='text' bind:value={note} class='text-1xl flex-1 placeholder-slate-600 dark:placeholder-slate-400 focus:outline-0 bg-transparent'
               placeholder='Create Note...'
        spellcheck='false'>
        <button class='text-xl'>
          <Icon icon='mdi:add' />
        </button>

      </form>
    </div>
  </div>
  <p class='flex-1'>
    {#if selectedNote !== null}
      <Note name={selectedNote} on:remove={() => {
        noteManager.removeNote(selectedNote);
        selectedNote = null;
      }} />
    {:else}
      <div class='w-full h-full flex items-center justify-center'>
        <p class='text-slate-700 dark:text-slate-200 text-3xl font-semibold'>Select A Note</p>
      </div>
    {/if}
  </p>
</div>