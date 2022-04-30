<script>
    import { createEventDispatcher } from 'svelte';
    import findStyleErrors from './../style';
    import findSyntaxErrors from './../syntax';
    import Error from './Error.svelte';

    export let text;
    const dispatch = createEventDispatcher();
    $: errors = findErrors(text);
    
    $: if (checkNoCriticalErrors(errors)) {
        dispatch('noCriticalErrors');
    }

    function checkNoCriticalErrors(errors) {
        for (const error of errors) {
            if (error.type == 'error')
                return false;
        }
        return true;
    }

    function findErrors(text) {
        return [...findStyleErrors(text), ...findSyntaxErrors(text)];;
    }
</script>

<!-- <div class='errorView h-24 mt-4 overflow-auto'>
    <p class='p-2 errorMessages'>
        {#each errors as error}
            <Error {error}/>
        {/each}
    </p>
</div> -->

<div class='errorView h-28 mt-4 overflow-auto p-1'>
    <table class="table-auto text-left w-full">
        <!-- <thead>
            <tr>
                <th>Type</th>
                <th>Lines</th>
                <th>Warning</th>
            </tr>
        </thead> -->
        <tbody>
            {#each errors as error}
                <Error {error}/>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .errorView {
        /* background-color: #263238 */
        /* background-color: rgb(79 84 92); */
        /* background-color: #36393e; */
        /* background-color: #2e3136; */

        background-color: #282a36;
    }

    /* .errorMessages {
        color: #EEFFFF;
    } */

</style>