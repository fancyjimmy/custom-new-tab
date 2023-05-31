<script lang='ts'>
  import Game from '../components/game/GameComponent.svelte';
  import {onMount} from 'svelte';
  import {serializable} from '../../store';
  import CoinStack from '../components/game/CoinStack.svelte';
  import {get} from 'svelte/store';
  import Coin from '../components/game/Coin.svelte';

  let element: HTMLDivElement;
  let loaded = false;
  onMount(() => {
    loaded = true;
  });

  function switchColor(color: string) {
    element.style.backgroundColor = color;
    //element.style.backgroundColor = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
  }

  function getUpgradeCost(level: number) {
    return Math.floor((level + 3) * 200 * (level * 0.3) ** 1.7);
  }

  let clicks, coins, upgradeLevel;
  let sessionClicks;

  clicks = serializable('life-time-clicks', 0, localStorage);
  upgradeLevel = serializable('upgrade-level', 1, localStorage);
  coins = serializable('coins', 0, localStorage);
  sessionClicks = serializable('session-clicks', 0, sessionStorage);
  onMount(() => {
  });

  $: tenthousands = Math.floor($coins / 10000);
  $: thousands = Math.floor($coins / 1000) % 10;
  $: hundreds = Math.floor($coins / 100) % 10;
  $: tens = Math.floor($coins / 10) % 10;
  $: ones = $coins % 10;

</script>

<div
  class='w-full h-full flex items-center justify-center duration-500 relative'
  bind:this={element}
>
  <div class='flex items-center flex-col absolute'>
    <p>{$clicks}</p>
    <p>{$sessionClicks}
      <p>Upgrade Level {$upgradeLevel}</p>
    <button
      class='bg-primary-400 p-2 rounded text-2xl'
      on:click={() => {
        $clicks++;
        $sessionClicks++;
        $coins += Math.round($upgradeLevel);
      }}>Click
    </button
    >

    <button disabled={$coins < getUpgradeCost($upgradeLevel)} on:click={ () => {
      if ($coins >= getUpgradeCost($upgradeLevel)) {
        $coins -= getUpgradeCost($upgradeLevel);
        $upgradeLevel++;
      }

    }} class='bg-primary-400 p-2 rounded text-2xl disabled:bg-slate-500'>
      Upgrade {getUpgradeCost($upgradeLevel)}</button>
  </div>
  <div class='flex'>
    <CoinStack count={ones} color='#723A12'></CoinStack>
    <CoinStack count={tens} color='#e0e0e0'></CoinStack>
    <CoinStack count={hundreds} color='#ffc500'></CoinStack>
    <CoinStack count={thousands} color='#0bf3e0'></CoinStack>
    {#if tenthousands > 0}
      <div>
        {tenthousands} x
        <CoinStack count='1' color='#51009d' />
      </div>
    {/if}
  </div>
</div>
