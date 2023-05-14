<script lang='ts'>

  import {bordManager} from '../store.js';
  import Board from './Board.svelte';
  import Icon from '@iconify/svelte';

  let boardName = '';

  $: boards = [...$bordManager].map((board, i) => {
    if (i === 0) {
      return {name: board, active: true};
    }
    return {name: board, active: false};
  });

  function isOnlyActiveBoard() {
    return boards.filter((board) => board.active).length === 1;
  }

  let lastLeft = {};
</script>

<div class='flex flex-col p-3 gap-3 h-full'>

  <div class='flex gap-3 flex-1'>
    {#each boards as board}
      <div class="{board.active ? 'flex-1' : ''} duration-200">
        <Board name={board.name} bind:active={board.active} on:mouseenter={() => {
                lastLeft.active = false;
                board.active = true;
            }}
               on:mouseleave={() => {
                       lastLeft = board;
                       if (!isOnlyActiveBoard()) {
                           board.active = false;
                       }

                   }}></Board>
      </div>

    {/each}
  </div>


  <form on:submit|preventDefault={() => {
                        bordManager.addBoard(boardName);
                                    boardName = "";

                    }}
        class='better-input'>
    <input type='text' bind:value={boardName}
           class='flex-1 placeholder-slate-600 focus:outline-0 bg-transparent'
           placeholder='Add a board...'
    >
    <button type='submit' class='font-bold bg-primary-400 rounded p-1'>
      <Icon icon='mdi:add'></Icon>
    </button>
  </form>

</div>
