<script>
    import markdownToHTML from '../markdown.js';
    import Embed from './Embed.svelte';
    import Attachment from './Attachment.svelte'

    export let content;
    export let command;
    
    let oldContent;
    let oldCommand;
    let messageFormatted;

    $: if (content !== oldContent || command !== oldCommand) {
        oldContent = content;
        oldCommand = command;
        
        // content = `${JSON.stringify(message)} - ${Math.floor(Math.random() * 100)}`;
        if (command === '.embed:json') {
            messageFormatted = {
                content: '',
                embed: JSON.parse(content).embed
            };
        }
        else {
            // const urls = findUrls(content);
            // const { formattedContent, attachmentUrls } = markdownToHTML(content);
            // messageFormatted = {
            //     content: formattedContent,
            //     attachmentUrls: attachmentUrls
            // };
            messageFormatted = markdownToHTML(content);
            // console.log(messageFormatted.attachments);
            if (command.startsWith('.img'))
                messageFormatted.commandAttachment = command.substring('.img:'.length);
        }
    }
</script>


<!-- todo: don't use nested object -->
<div class='message-text hover:message-selected'>
    <div class='markup'>
        {@html messageFormatted.content}
    </div>
    {#if messageFormatted.messageAttachments}
        {#each messageFormatted.messageAttachments as attachment}
            <!-- {#if attachment.embed}
                <Embed {...attachment.embed}/>
            {/if} -->
            <Attachment url={attachment}/>
        {/each}
    {/if}
    {#if messageFormatted.commandAttachment}
        <Attachment url={messageFormatted.commandAttachment}/>
    {/if}
</div>
<!-- {#if messageFormatted.attachments}
    {#each messageFormatted.attachments as attachment}
        {#if attachment.embed}
            <Embed {...attachment.embed}/>
        {/if}
    {/each}
{/if} -->
<!-- todo confirm same as discord html -->

{#if messageFormatted.embed}
    <Embed {...messageFormatted.embed}/>
{/if}

<style>
    .hover\:message-selected:hover {
        /* background-color: #36393f; */
        background-color: #2f3136;
    }
</style>