<script>
    export let corner = '';
    export let title = '';
</script>

<!-- <button type="button" class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
    Profile
  </button> -->

<button on:click class='{corner} inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-2 active:bg-indigo-800 text-sm border border-indigo-700' title={title} type="button">
    <slot />
</button>

<style>
    /* button {
        white-space: nowrap;
        text-align: center;
    } */
</style>