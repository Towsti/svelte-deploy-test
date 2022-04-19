<script>
    export let corner = '';
    export let title = '';
    export let selected = '';
</script>

<!-- <button on:click class='text-white py-1 px-2 {corner}'> -->
<button on:click class='{corner} bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 active:bg-slate-400 selected' title={title}>
    <slot />
</button>

<style>
    button {
        white-space: nowrap;
        text-align: center;
    }
</style>