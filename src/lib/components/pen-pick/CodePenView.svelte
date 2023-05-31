<script lang='ts'>
  import {onMount} from 'svelte';
  import Frame from './Frame.svelte';

  export let url;

  let jsText;
  let cssText;
  let htmlText;

  async function loadJS() {
    const response = await fetch(url + '.js');

    return await response.text();
  }

  async function loadCSS() {
    const response = await fetch(url + '.css');

    return await response.text();
  }

  async function loadHTML() {
    const response = await fetch(url + '.html');

    return await response.text();
  }


  let loaded = false;
  onMount(async () => {
    htmlText = await loadHTML();
    jsText = await loadJS();
    cssText = await loadCSS();
    loaded = true;

    html = `
    <head>
      <style>${cssText}</style>
    </head>
    <body>
    ${htmlText}
    </body>
    <script defer>${jsText}</ script>
    `;
  });
  let html;
</script>

{#if loaded}
  <Frame html={html} class={$$props.class}/>
{/if}
