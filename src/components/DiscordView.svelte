<script>
    import Message from './Message.svelte'
    
    export let text;

    const avatarURL = 'https://cdn.discordapp.com/avatars/689197754584399963/51fc3581cac941e4adbafd41e7ae2ec3.webp?size=80';
    const username = 'PvM Encyclopedia';
    
    $: messages = splitMessages(text);

    function splitMessages(text) {
        let messages = [];
        let message = {
            content: '',
            embed: '',
            command: ''
        };
        const lines = text.split('\n');
        for (const line of lines) {
            if (message.content != '') message.content += '\n';

            if (line.startsWith('..')) {
                message.content += line.substring(1);
            }
            else if (line.startsWith('.')) {
                message.command = line
                messages.push(message);
                message = {
                    content: '',
                    embed: '',
                    command: ''
                };
            }
            else {
                message.content += line;
            }
        }

        if (message.content != '') messages.push(message);

        return messages
    }

</script>

<!-- <div class='w-100 h-100 br2 flex flex-column white overflow-hidden'> -->
<!-- <div class='w-100 h-100 overflow-auto pa2 discord-view'> -->
<div class='w-full h-full rounded-lg border-2 border-slate-900 overflow-auto pa2 discord-view'>
<div class='h-full flex-vertical whitney theme-dark'>
<div class='chat flex-vertical flex-spacer'>
<div class='content flex-spacer flex-horizontal'>
<div class='flex-spacer flex-vertical messages-wrapper'>
<div class='scroller-wrap'>
<div class='scroller messages'>

<div class='message-group hide-overflow'>
<div class='avatar-large animate' style='background-image:url({avatarURL});'/>
<div class='comment'>
<div class='message first'>
    <h2 style='line-height: 16px;'>
        <span class='username-wrapper v-btm'>
            <strong class='user-name'>{username}</strong>
            <span class='bot-tag'>BOT</span>
        </span>
    </h2>
    {#each messages as message}
        <Message message={message}/>
    {/each}
</div>
</div>
</div>


</div>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- </div> -->