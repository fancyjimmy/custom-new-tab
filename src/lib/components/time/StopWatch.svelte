<script lang='ts'>
  import {createTimer} from '../../../store';
  import {createEventDispatcher, onMount} from 'svelte';
  import BaseClock from './Clock.svelte';
  import Icon from '@iconify/svelte';

  export let name: string;

  let timer, timerState, remove;


  const dispatch = createEventDispatcher();

  let currentTime = Date.now();

  onMount(() => {
    let createdTimer = createTimer(name);
    timer = createdTimer.timer;
    timerState = createdTimer.timerState;
    remove = createdTimer.remove;

    const intervall = setInterval(() => {
      currentTime = Date.now();
    }, 1000);



    return () => {
      clearInterval(intervall);
    };
  });


  $: timeDifferenz = Math.max(1, 1 + currentTime - $timer);

  $: seconds = Math.floor((timeDifferenz % 60000) / 1000);
  $: minutes = Math.floor((timeDifferenz % 3600000) / 60000);
  $: hours = Math.floor(timeDifferenz / 3600000);

  function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = '0' + num;
    return num;
  }
</script>


<div class='bg-slate-200 border-2 dark:bg-slate-800 flex flex-col p-2 border-slate-600/40 dark:border-slate-600/40 rounded-lg dark:text-white'>
  <div class='flex justify-between'>
    <p class='font-bold font-mono text-lg dark:text-slate-200 text-slate-700'>{name}</p>

    <div
      class='flex flex-col justify-center items-center font-semibold font-mono text-lg dark:text-slate-200 text-slate-700'>
      {#if $timerState}
        <p>{pad(hours, 2)}:{pad(minutes, 2)}:{pad(seconds, 2)}</p>
      {:else}
        <p>--:--:--</p>
      {/if}
    </div>
  </div>

  <div class='text-2xl pt-2 dark:text-slate-300 text-slate-800 flex justify-end gap-2 mt-[-0.3rem]'>
    <button on:click={() => {timer.stop()}}>
      <Icon icon='material-symbols:stop' />
    </button>
    <button on:click={() => {timer.start()}}>
      <Icon icon={$timerState ? 'uil:redo' : 'material-symbols:play-arrow'} />
    </button>
    <button on:click={() => {remove(); dispatch("remove");}}>
      <Icon icon='mdi:trash-can' />
    </button>
  </div>

</div>

