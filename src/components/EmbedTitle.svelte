<script>
    import markdownToHTML from "../markdown";

    export let title;
    export let url = null;
</script>

{#if url}
    <!-- some rules do not apply -->
    <a target='_blank' rel='noreferrer' href={url} class='embed-title'>{@html markdownToHTML(title)}</a>
{:else}
    <!-- some rules do not apply -->
    <div class='embed-title'>{@html markdownToHTML(title).content}</div>
{/if}