<script lang='ts'>
  import {EventStates, Game, MouseButtons} from './Game';
  import {createEventDispatcher, onMount} from 'svelte';



  function randomColor() {
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 16).toString(16);
    }
    return color;
  }

  let element = {x: 0, y: 0, xSpeed: 3, ySpeed: 3, sizeX: 40, sizeY: 40, color: randomColor()};

  let values = [element];

  export let trail = true;

  export let width = 100;
  export let height = 100;

  const dispatch = createEventDispatcher();
  export let spawnNew = false;

  onMount(() => {
    const game = new Game(width, height);


    game.update = (canvas, input, frames) => {

      if (trail) {
        canvas.clear();
      }


      const mousePosition = input.mousePos;

      values.forEach((element) => {
        canvas.drawRectFilled(element.x, element.y, element.sizeX, element.sizeY, element.color);
        canvas.drawRectOutlined(element.x, element.y, element.sizeX, element.sizeY, 2, '#000000');

        element.y += element.ySpeed;
        element.x += element.xSpeed;

        //strave element


        let hit = 0;

        if (element.x + element.sizeX > canvas.width || element.x < 0) {
          dispatch("hit", element.color);
          element.xSpeed *= -1;
          hit++;
        }

        if (element.y + element.sizeY > canvas.height || element.y < 0) {
          element.ySpeed *= -1;
          hit++;

          dispatch("hit", element.color);
        }

        if (hit === 2){
          console.log("hit");
        }

      });


      if (spawnNew) {
        input.onMouse(MouseButtons.left, EventStates.RELEASED, () => {
          const xSize = 40;
          const ySize = 40;

          let xSpeed = 3;
          let ySpeed = 3;

          values.push({
            x: mousePosition.x - xSize / 2,
            y: mousePosition.y - ySize / 2,
            sizeX: xSize,
            sizeY: ySize,
            xSpeed: Math.random() > 0.5 ? xSpeed : -xSpeed,
            ySpeed: Math.random() > 0.5 ? ySpeed : -ySpeed,
            color: randomColor()
          });
        });
      }


      input.onKey('s', EventStates.RELEASED, () => {
        values = [];
      });

      input.onKey('d', EventStates.RELEASED, () => {
        canvas.clear();
      });

    };
    game.mount('#game');
    game.start();

  });


</script>

<div id='game' class='bg-white dark:bg-slate-800'>

</div>