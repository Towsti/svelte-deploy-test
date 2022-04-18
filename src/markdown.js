import { toHTML } from 'discord-markdown';
import { channels, users } from './constants/discord';

export default function markdownToHTML(messageContent, embed=false) {
    // convert discord markdown to HTML
    let content = toHTML(messageContent, {
        discordCallback: {
            channel: node => '#' + channels[node.id],
            user: node => '@' + users[node.id]
        },
        embed: embed    // allow for named links
    });
    
    // modify <blockquote/> to use correct css
    content = content.replaceAll('<blockquote>', '<div class="blockquoteContainer"><div class="blockquoteDivider"></div><blockquote>');
    content = content.replaceAll('</blockquote>', '</blockquote></div>');
    
    // modify <code> -> <code class="inline">
    content = content.replaceAll('<code>', '<code class="inline">')    
     
    return content;
}