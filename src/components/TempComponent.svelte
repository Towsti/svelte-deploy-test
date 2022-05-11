<script>
    import TempMsg from "./TempMsg.svelte";

    export let text;
    let oldLines = lines; 
    $: lines = getLines(text);
    
    function getLines(text) {
        const newLines = []
        for (const [i, line] of text.split('\n').entries()) {
            // newLines.push({id: i, text: line});
            newLines.push(line);
        }
        // console.log(newLines);
        return newLines;
    }
</script>


<!-- {#each lines as i, line }
    {#if line != oldLines[i]}
        {line.text}
    {/if}
{/each} -->
{#each lines as line }
    <TempMsg content={line}></TempMsg>
{/each}