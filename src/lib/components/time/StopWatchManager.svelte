<script lang='ts'>

  import {defaultTimerManager} from '../../../store.js';
  import StopWatch from './StopWatch.svelte';
  import Icon from '@iconify/svelte';

  let timerValue;
</script>

<div class='grid grid-rows-[auto,1fr,auto] min-h-min {$$props.class}'>
  <h3 class='text-sm font-bold uppercase dark:text-slate-200 text-slate-700'>Stopwatch</h3>

  <div class='relative'>
    <div class='absolute inset-0 margin-0 flex flex-col gap-2 overflow-y-scroll scrollbar-hidden py-3'>
      {#each $defaultTimerManager as timerName}
        <StopWatch name={timerName} on:remove={() => {defaultTimerManager.removeTimer(timerName)}}></StopWatch>
      {/each}
    </div>

  </div>

  <form on:submit|preventDefault={() => {defaultTimerManager.addTimer(timerValue); timerValue = "";}}
        class='better-input'
  >
    <input type='text' bind:value={timerValue} class='flex-1 placeholder-slate-600 focus:outline-0 bg-transparent'
           placeholder='Add Timer...'>
    <button class='text-xl'>
      <Icon icon='mdi:add' />
    </button>

  </form>
</div>
