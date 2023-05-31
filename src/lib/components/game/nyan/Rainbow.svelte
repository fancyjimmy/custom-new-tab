<script lang='ts'>
  import {onMount} from 'svelte';

  /*
  colors = [
    '#ff0000',
    '#ff8000',
    '#ffea00',
    '#7bff00',
    '#00bbff',
    '#002aff',
  ];

  Rainbow
   */
  export let colors = [
    '#ff0000',
    '#ff8100',
    '#ffa11f',
    '#fdd648',
    '#fff7bc',
    '#ffffff'
  ];
  export let height = 30;
  export let segmentWidth = 20;

  export const offsetX = 0;
  export const offsetY = -3;

  let segmentCount, segmentHeight;
  $: segmentCount = Math.round(mouseX / segmentWidth);
  $: segmentHeight = Math.ceil(height / colors.length);
  let canvas;

  let mouseX;
  let mouseY;
  let screenX;
  let screenY;
  let animationFinished = false;

  export let mode;


  const fullRainbow = () => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startY = mouseY - height / 2 + offsetY;
    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      ctx.fillStyle = color;
      ctx.fillRect(0, startY + i * segmentHeight, mouseX, segmentHeight);
    }
  };

  const taperingRainbow = () => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    segmentCount = Math.round(mouseX / segmentWidth);
    segmentHeight = Math.ceil(height / colors.length);

    for (let i = 0; i < segmentCount; i++) {
      let currentSegmentHeight = segmentHeight * (segmentCount - i) * 0.2;
      let startY = mouseY - (currentSegmentHeight * colors.length) / 2 + offsetY;

      let currentStartY = startY + (segmentCount - i) * (Math.floor(frame / 8 + i) % 2) * 0.2;
      for (let j = 0; j < colors.length; j++) {
        const color = colors[j];
        ctx.fillStyle = color;
        ctx.fillRect(
          i * segmentWidth,
          currentStartY + j * currentSegmentHeight + offsetY,
          segmentWidth,
          currentSegmentHeight
        );
      }
    }
  };

  const flickeringRainbow = () => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startY = mouseY - height / 2 + offsetY;

    /*
    // Tapering

     */

    segmentCount = Math.round(mouseX / segmentWidth);
    segmentHeight = Math.ceil(height / colors.length);

    for (let i = 0; i < segmentCount; i++) {
      let currentStartY = startY + (Math.floor(frame / 8 + i) % 2) * 2;
      for (let j = 0; j < colors.length; j++) {
        const color = colors[j];
        ctx.fillStyle = color;
        ctx.fillRect(
          i * segmentWidth,
          currentStartY + j * segmentHeight + offsetY,
          segmentWidth,
          segmentHeight
        );
      }

    }
  }

  export const trailingFrames = 10;
  let trail = [];

  const trailingRainbow = () => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startY = mouseY - height / 2 + offsetY;

    /*
    // Tapering

     */

    segmentCount = Math.round(mouseX / segmentWidth);
    segmentHeight = Math.ceil(height / colors.length);

    for (let i = 0; i < segmentCount; i++) {
      if (i % 2 == 0 ) continue;
      let currentStartY = startY + (Math.floor(frame / 8 + i) % 2) * 2;
      for (let j = 0; j < colors.length; j++) {
        const color = colors[j];
        ctx.fillStyle = color;
        ctx.fillRect(
          i * segmentWidth - (frame % segmentWidth * segmentWidth / trailingFrames),
          currentStartY + j * segmentHeight + offsetY,
          segmentWidth,
          segmentHeight
        );
      }

    }

  }
  let frame = 0;
  onMount(() => {

    const trail = () => {
      if (mode === "trailing"){
        trailingRainbow();
      } else if (mode === "tapering") {
        taperingRainbow();
      } else if (mode === "flickering") {
        flickeringRainbow();
      } else {
        fullRainbow();
      }
    };

    const animate = () => {
      frame++;
      trail();
      if (!animationFinished) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    const bindMouse = event => {
      let rect = canvas.getBoundingClientRect();
      mouseX = (event.clientX - rect.left) * (canvas.width / rect.width);
      mouseY = (event.clientY - rect.top) * (canvas.height / rect.height);
      mouseX = Math.max(Math.min(mouseX, canvas.width - 40), 20);
      mouseY = Math.max(Math.min(mouseY, canvas.height - 10), 20);

    };

    const bindScreen = event => {
      screenX = canvas.clientWidth;
      screenY = canvas.clientHeight;
    };

    window.addEventListener('mousemove', bindMouse);
    window.addEventListener('resize', bindScreen);
    return () => {
      animationFinished = true;
      window.removeEventListener('mousemove', bindMouse);
      window.removeEventListener('resize', bindScreen);
    };
  });
</script>

<canvas bind:this={canvas} width={screenX} height={screenY} />

<style>
    canvas {
        width: 100%;
        height: 100%;
        image-rendering: pixelated;
    }
</style>
