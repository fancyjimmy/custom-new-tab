<script lang="ts">
  import {onMount} from 'svelte';

  export let html;
  let iframe;
  onMount(() => {
    iframe.contentDocument.write(html);
  });
</script>


<iframe bind:this={iframe} class='{$$props.class}'></iframe>