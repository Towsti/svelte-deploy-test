<script>
    import { toHTML } from 'discord-markdown';
    import { channels, users } from './../constants/discord';

    export let message = Object();

    $: messageHTML = markdownToHTML(message.content);

    function markdownToHTML(contentRaw) {
        // convert discord markdown to HTML
        let contentHTML = toHTML(contentRaw, {
            discordCallback: {
                channel: node => '#' + channels[node.id],
                user: node => '@' + users[node.id]
            }
        });
        
        // modify <blockquote/> to use correct css
        contentHTML = contentHTML.replaceAll('<blockquote>', '<div class="blockquoteContainer"><div class="blockquoteDivider"></div><blockquote>');
        contentHTML = contentHTML.replaceAll('</blockquote>', '</blockquote></div>');
        
        // modify <code> -> <code class="inline">
        contentHTML = contentHTML.replaceAll('<code>', '<code class="inline">')    

        return contentHTML
    }
</script>

<div class='message-text'>
    <div class='markup'>
        {@html messageHTML}
    </div>
</div>