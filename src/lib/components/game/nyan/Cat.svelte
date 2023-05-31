<script lang='ts'>

  const speeds: ['normal', 'slow', 'fast', 'fastest'] = ['normal', 'slow', 'fast', 'fastest'];
  export let speed: 'normal' | 'slow' | 'fast' | 'super-fast' = 'normal';
  export let x;
  export let y;

  export let size = 100;
</script>


<div class='absolute' style='top: {Math.max(Math.min(y- 180, window.innerHeight - size - 150), 0)}px; left: {Math.max(Math.min(x - 180, window.innerWidth - 280), 0)}px; height: {size}px;'>

{#if speed === "normal"}
  <img src='./assets/nyanCat/original.gif' alt='NyanCat'>
{:else if speed === "slow"}
  <img src='./assets/nyanCat/slow.gif' alt='NyanCat'>
{:else if speed === "fast"}
  <img src='./assets/nyanCat/faster.gif' alt='NyanCat'>
{:else if speed === "super-fast"}
  <img src='./assets/nyanCat/fast.gif' alt='NyanCat'>
{/if}
</div>

<style>
    @keyframes kitzeln {
        0% {
            cursor: grab;
        }

        100% {
            cursor: grabbing;
        }
    }
  img{
      animation: kitzeln 0.2s infinite alternate;
      user-select: none;
      user-drag: none;
      -webkit-user-drag: none;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
  }
</style>