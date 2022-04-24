<script>
    import markdownToHTML from '../markdown.js';
    import Embed from './Embed.svelte';
    import Attachment from './Attachment.svelte'

    export let content;
    export let command;
    
    let oldContent;
    let oldCommand;
    let messageFormatted;

    function findUrls(text) {
        // add attachment for urls
        const regexp = /[^<](https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g
        const results = [...text.matchAll(regexp)];
        // console.log(results);
    }

    $: if (content !== oldContent || command !== oldCommand) {
        // console.log(message.content);
        oldContent = content;
        oldCommand = command;
        // content = `${JSON.stringify(message)} - ${Math.floor(Math.random() * 100)}`;
        if (command === '.embed:json')
            messageFormatted = {
                content: '',
                embed: JSON.parse(content).embed
            };
        else {
            // const urls = findUrls(content);
            messageFormatted = {
                content: markdownToHTML(content),
            };
            if (command.startsWith('.img'))
                messageFormatted.attachment = command.substring('.img:'.length);
        }
    }


</script>

<div class='message-text'>
    <div class='markup'>
        {@html messageFormatted.content}
    </div>
    <!-- todo confirm same as discord html -->
    {#if messageFormatted.attachment}
        <Attachment url={messageFormatted.attachment}/>
    {/if}
</div>
{#if messageFormatted.embed}
    <Embed {...messageFormatted.embed}/>
{/if}