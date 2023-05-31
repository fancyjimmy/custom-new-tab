<script lang="ts">
  import {onMount} from 'svelte';
  import Cat from '../../components/game/nyan/Cat.svelte';
  import Rainbow from '../../components/game/nyan/Rainbow.svelte';
  import ColorPalette from '../../components/game/nyan/ColorPalette.svelte';

  let mouseX;
  let mouseY;
  onMount(() => {
    const bind = event => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    window.addEventListener('mousemove', bind);
    return () => {
      window.removeEventListener('mousemove', bind);
    };
  });

  function getSpeed(mouseX: number): string {
    let relativeX = window.innerWidth - mouseX;

    let speed = 'normal';
    let relativeSpeed = relativeX / window.innerWidth;

    if (relativeSpeed > 0.8) {
      speed = 'slow';
    } else if (relativeSpeed > 0.6) {
      speed = 'normal';
    } else if (relativeSpeed > 0.4) {
      speed = 'fast';
    } else {
      speed = 'super-fast';
    }

    return speed;
  }

  function createRainbowPalette(name: string) {}

  let currentColorPalette = [
    '#ff0000',
    '#ff8100',
    '#ffa11f',
    '#fdd648',
    '#fff7bc',
    '#ffffff'
  ];
  let segmentWidth = 20;

  let options = ['trailing', 'rainbow', 'flickering', 'tapering'];

  let currentOptionIndex = 0;
  $: currentOption = options[currentOptionIndex];
</script>

<div class="relative h-full w-full">
  <Cat speed={getSpeed(mouseX)} x={mouseX} y={mouseY} />
  <Rainbow colors={currentColorPalette} {segmentWidth} mode={currentOption}/>

  <div class="absolute top-2 left-2 border-4 border-black bg-white p-2">
    <p class="font-bold">Colors</p>
    <ColorPalette bind:colorPalette={currentColorPalette}/>
    <div class='flex flex-col gap-2 mt-2'>
      <input
        type="range"
        min="1"
        max="100"
        bind:value={segmentWidth}
      />
      <button
        on:click={() => {
        currentOptionIndex = (currentOptionIndex + 1) % options.length;
      }}
        class='bg-white border-4 border-black font-semibold flex-1 p-2'
      >Mode {currentOption}</button>
    </div>

  </div>
</div>
