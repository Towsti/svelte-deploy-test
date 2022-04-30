<script>
    export let corner = '';
    export let title = '';
</script>

<button on:click class='{corner} bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-2 active:bg-indigo-800' title={title}>
    <!-- <strong> -->
    <slot />
    <!-- </strong> -->
</button>

<style>
    button {
        white-space: nowrap;
        text-align: center;
    }
</style>