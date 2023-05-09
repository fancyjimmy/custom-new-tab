<script lang="ts">
    import Clock from "../components/Clock.svelte";
    import {onMount} from "svelte";

    let time = new Date();

    onMount(() => {
        const interval = setInterval(() => {
            time = new Date();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

    $: hours = time.getHours();
    $: minutes = time.getMinutes();
    $: seconds = time.getSeconds();

    function pad(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }
</script>

<div class="h-full w-full flex items-center justify-center">
    <div class="flex items-center justify-center flex-col">

    <div class="w-96 h-96">
        <Clock></Clock>
    </div>

    <div class="bg-primary-300 dark:bg-primary-700 p-6 rounded-full">
        <p class="text-8xl font-bold font-mono dark:text-white text-slate-900">{pad(hours,2 )}:{pad(minutes, 2)}:{pad(seconds, 2)}</p>
    </div>
    </div>

</div>
