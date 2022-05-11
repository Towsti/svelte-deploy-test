<script>
    import { beforeUpdate, afterUpdate } from 'svelte';

    export let content;
    let oldContent;
    let contentFormatted;


    // beforeUpdate(() => {
	// 	console.log('update');
	// });

    $: if (content !== oldContent) {
        // console.log("update");
        oldContent = content;
        contentFormatted = content;
    } else {
        // console.log("not update");
    }

    
</script>

<p>{contentFormatted}</p>

