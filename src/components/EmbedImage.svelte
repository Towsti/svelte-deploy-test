<script>
    export let url = null;
    
</script>

{#if url}
    <a className='embed-thumbnail embed-thumbnail-rich'>
        <img className='image' role='presentation' src={url}/>
    </a>
{/if}