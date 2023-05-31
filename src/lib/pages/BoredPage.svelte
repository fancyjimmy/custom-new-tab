<script lang='ts'>
  import PageLayout from './PageLayout.svelte';
  import {gamePages, serializable} from '../../store.js';

  let pageId = serializable('gamePageId', 1);

  $: currentPage = $gamePages[$pageId];

</script>

<div class='flex flex-col h-full'>
  <div
    class='flex dark:text-white w-screen border-b border-slate-400 dark:border-slate-900 backdrop-blur-[1px]'>
    {#each $gamePages as page, i}
      <button on:click={()=>{$pageId=i}} class='font-semibold text-slate-600 dark:text-slate-400 px-2 py-1'>
        {page.name}
      </button>
    {/each}
  </div>
  <PageLayout>
    <div class='flex-1 relative'>
      <div class='absolute inset-0'>
        <svelte:component this={currentPage.page}></svelte:component>
      </div>
    </div>
  </PageLayout>
</div>
