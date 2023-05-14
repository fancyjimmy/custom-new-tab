<script lang='ts'>

  import Game from '../components/game/GameComponent.svelte';
  import {onMount} from 'svelte';

  let element: HTMLDivElement;
  let loaded = false;
  onMount(() => {
    loaded = true;
  });

  function switchColor(color: string) {
    element.style.backgroundColor = color;
    //element.style.backgroundColor = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
  }
</script>

<div class='w-full h-full flex items-center justify-center bg-primary-400 duration-500' bind:this={element}>

  {#if loaded}
    <Game width={element.clientWidth -30} height={element.clientHeight - 30} trail={false} on:hit={(event) => switchColor(event.detail)} spawnNew={true}></Game>
  {/if}
</div>
