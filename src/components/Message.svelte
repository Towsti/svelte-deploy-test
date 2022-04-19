<script>
    import markdownToHTML from '../markdown.js'
    import Embed from './Embed.svelte'

    export let message = Object();
    let oldMessage;
    let messageFormatted;
    // $: alwaysNew = formatMessage(message);
    // $: messageFormatted = toHTML(message);
    let oldMessageFormatted = '';
    let newMessage = true;
    // function formatMessage(message) {
    //     return `${JSON.stringify(message)} - ${Math.floor(Math.random() * 100)}`;
    // }

    $: if (JSON.stringify(message) !== JSON.stringify(oldMessage)) {
        // console.log(message.content);
        oldMessage = message;
        // content = `${JSON.stringify(message)} - ${Math.floor(Math.random() * 100)}`;
        if (message.command == '.embed:json')
            messageFormatted = {
                content: '',
                embed: JSON.parse(message.content).embed
            };
        else
            messageFormatted = {
                content: markdownToHTML(message.content),
                embed: undefined
            };
        
        newMessage = true;
        
    } else {
        newMessage = false;
    }

    // function toHTML(message) {
    //     // if (message.content != oldMessage.content) {
    //     //     oldMessage = message;
    //     //     console.log("change: " + message.content);
    //     // }


    //     if (message.command == '.embed:json')       
    //         return {
    //             content: '',
    //             embed: JSON.parse(message.content).embed
    //         }
        
    //     return {
    //         content: markdownToHTML(message.content),
    //         embed: undefined
    //     }
    // }
</script>


<!-- {#if newMessage} -->
<!-- <div> -->
<!-- {@html messageFormatted.content} -->
<!-- {messageFormatted.content}
</div> -->
<!-- {/if} -->

<div class='message-text'>
    <div class='markup'>
        {@html messageFormatted.content}
    </div>
</div>
{#if messageFormatted.embed}
    <Embed {...messageFormatted.embed}/>
{/if}