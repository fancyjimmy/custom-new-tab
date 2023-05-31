<script lang='ts'>
  export let light;
  export let dark;
  export let middle;


  export let x;
  export let y;
</script>

<g xmlns='http://www.w3.org/2000/svg'>
  <title>Coin</title>
  <ellipse stroke-width='5' stroke='{dark}' ry='54' rx='100' id='svg_1' cy='{y + 20}' cx='{x}' fill='{middle}' />
  <ellipse stroke-width='5' stroke='{dark}' ry='50' rx='100' id='svg_2' cy='{y}' cx='{x}' fill='{light}' />
</g>

<style>
    g {
        transform: translateY(0);
        animation: .2s fall;
    }


    @keyframes fall {
        0% {
            transform: translateY(-1000px);
        }
        100% {
            transform: translateY(0);
        }
    }
</style>