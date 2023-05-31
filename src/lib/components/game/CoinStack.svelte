<script lang="ts">
  import Coin from './Coin.svelte';

  export let count = 0;
  export let color = '#e0bb40';

  function hexToHSL(hex: string): {h: number; s: number; l: number} {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let cmin = Math.min(r, g, b);
    let cmax = Math.max(r, g, b);
    let delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;

    if (delta == 0) {
      h = 0;
    } else if (cmax == r) {
      h = ((g - b) / delta) % 6;
    } else if (cmax == g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);

    if (h < 0) {
      h += 360;
    }

    l = (cmax + cmin) / 2;

    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {h, s, l};
  }




  function changeLightness(hsl: {h: number, s: number, l:number}, value: number){
    let color = {...hsl};
    color.l = value;
    return color;
  }

  function HSLToHex(hsl: {h: number, s: number, l: number}) {
    let s = hsl.s,
      l = hsl.l,
      h = hsl.h;

    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    // Having obtained RGB, convert channels to hex
    let rR = Math.round((r + m) * 255).toString(16);
    let rG = Math.round((g + m) * 255).toString(16);
    let rB = Math.round((b + m) * 255).toString(16);

    // Prepend 0s, if necessary
    if (rR.length == 1)
      rR = "0" + rR;
    if (rG.length == 1)
      rG = "0" + rG;
    if (rB.length == 1)
      rB = "0" + rB;

    return "#" + rR + rG + rB;
  }

  $: light = HSLToHex(changeLightness(hexToHSL(color), 60));
  $: dark = HSLToHex(changeLightness(hexToHSL(color), 10));
  $: middle = HSLToHex(changeLightness(hexToHSL(color), 40));


</script>

<svg width='240' height='500'>
  {#each Array.from({length: count}) as _, i}
    <Coin {dark} {light} {middle} x='{120 + Math.random() * 20 - 10}' y='{400 - ((i) + 1) * 30}'></Coin>
  {/each}
</svg>
