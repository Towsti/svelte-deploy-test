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

<div class='bg-slate-400 h-24 mt-4 overflow-auto'>
    <p class='p-2'>
        {#each errors as error}
            <Error {error}/>
        {/each}
    </p>
</div>