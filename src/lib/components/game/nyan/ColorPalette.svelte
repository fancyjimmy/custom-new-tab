<script lang="ts">
  export let colorPalette;
  let newColor = '#ffffff';
</script>

<div class='flex flex-col gap-3 w-48'>
  <div class="flex flex-col gap-1">
  {#each colorPalette as color, index}
    <div
      style="background-color: {color};"
      class="font-semibold text-lg p-1 border-4 border-black"
      on:click={() => {
        colorPalette = colorPalette.filter((_, i) => i !== index);
      }}
    >
      {color}
    </div>
  {/each}
</div>

<div class='flex gap-2'>
  <input class='inset-0 border-0 w-24 h-8' type="color" bind:value={newColor} />
  <button
    class='bg-white border-4 border-black font-semibold flex-1'
    on:click={() => {
      colorPalette = [...colorPalette, newColor + ''];
    }}
    >Add
  </button>
</div>

</div>