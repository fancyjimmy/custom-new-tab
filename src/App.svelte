<script lang="ts">
    import PageLayout from "./lib/pages/PageLayout.svelte";
    import {darkMode, defaultPage, pages} from "./store";

    let pageId = $defaultPage;
    $: currentPage = $pages[pageId];
    let background;
</script>
<div  class:dark={$darkMode}>

<main class="w-screen h-screen flex flex-col dark:bg-slate-800 bg-slate-200 duration-200 custom-bg" style="--background-svg: {background}">
    <button on:click={() => $darkMode = !$darkMode} class="absolute top-0 right-0 p-1 text-xl rounded-full z-[5]">{$darkMode ? '🌑' : '☀️'}</button>
    <div class="flex dark:text-white w-screen bg-slate-200/30 dark:bg-slate-900/30 border-b border-slate-400 dark:border-slate-900 backdrop-blur-[1px]">
        {#each $pages as page, i}
            <button on:click={()=>{pageId=i}} class="font-semibold p-2">
                {page.name}
            </button>
        {/each}
    </div>
    <PageLayout>
        <div class="flex-1">
            <svelte:component this={currentPage.page} bind:background={background}></svelte:component>
        </div>
    </PageLayout>
</main>

</div>


<style>

</style>

