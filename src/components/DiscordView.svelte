<script>
    import Message from './Message.svelte';
    import Avatar from './Avatar.svelte';
    import Bot from './Bot.svelte';
    import { createEventDispatcher } from 'svelte';
    import findStyleErrors from '../style';
    import findSyntaxErrors from '../syntax';


    // debug
    const dispatch = createEventDispatcher();

    

   

    export let text;

    $: discordMessages = getDiscordMessages(text);

    function reportErrors(errors) {
        dispatch('errors', {
            text: errors
        });
    }

    function reportNoErrors() {
        dispatch('errors', {
            text: []
        });
    }

    function syntaxChecker(text) {
        // dispatch('error')
    }

    function embedParser(content) {

    }

    function getDiscordMessages(text) {
        // const errors = findStyleErrors(text).concat(findStyleErrors(text));
        const errors = [...findStyleErrors(text), ...findSyntaxErrors(text)];

        if (errors.length > 0) {
            reportErrors(errors);
            return discordMessages;
        }

        reportNoErrors();

        return splitMessages(text);
        // return [];
    }

    
    // $: discordMessages = splitMessages(text);

    function splitMessages(text) {
        let messages = [];
        let message = {
            content: '',
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

<div class='h-full'>
    <div class='discord-view'>
        <div class='flex-vertical whitney theme-dark'>
            <div class='chat flex-vertical flex-spacer'>
                <div class='content flex-spacer flex-horizontal'>
                    <div class='flex-spacer flex-vertical messages-wrapper'>
                        <div class='scroller-wrap'>
                            <div class='scroller messages'>
                                <div class='message-group hide-overflow'>
                                    <Avatar/>
                                    <div class='comment'>
                                        <div class='message first'>
                                            <Bot/>
                                            {#if discordMessages}
                                                {#each discordMessages as message}
                                                    <Message message={message}/>
                                                {/each}
                                            {/if}
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
</div>

<!-- <div class='overflow-auto w-full h-full rounded-lg border-2 border-slate-900 scrollbar-thin scrollbar-thumb-slate-900'>
<div class='discord-view'>
    <div class='h-full flex-vertical whitney theme-dark'>
        <div class='chat  flex-spacer'>
            <div class='content flex-spacer flex-horizontal'>
                <div class='flex-spacer flex-vertical messages-wrapper'>
                    <div class='scroller-wrap'>
                        <div class='scroller messages'>
                            <div class='message-group hide-overflow'>
                                <Avatar/>
                                <div class='comment'>
                                    <div class='message first'>
                                        <Bot/>
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
</div> -->