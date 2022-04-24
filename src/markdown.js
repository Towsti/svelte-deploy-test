import { toHTML } from 'discord-markdown';
import { channels, users, roles, pvmeSpreadsheet } from './constants/discord';


function formatPVMESpreadsheet(originalContent) {
    // const regexp = /[^<](https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g
    // const results = [...text.matchAll(regexp)];
    // $data_pvme:Bosses!E653$
    let content = originalContent;
    const regexp = /\$data_pvme:([^!]+)!([a-zA-Z]{1})([^$]+)\$/g;
    const results = [...content.matchAll(regexp)];
    for (const result of results) {
        // cell = pvmeSpreadsheet[result[1]][result[2]][result[3]];
        // print(cell)
        // console.log(pvmeSpreadsheet[result[1]]);
        // console.log(_.getPath(pvmeSpreadsheet, `${result[1]}`));
        if (pvmeSpreadsheet[result[1]] && pvmeSpreadsheet[result[1]][result[2]] && pvmeSpreadsheet[result[1]][result[2]][result[3]]) {
            const cellValue = pvmeSpreadsheet[result[1]][result[2]][result[3]];
            content = content.replaceAll(result[0], cellValue);
        }
    }
    // console.log(results);
    return content;
}

export default function markdownToHTML(messageContent, embed=false) {
    // convert discord markdown to HTML
    let content = toHTML(messageContent, {
        discordCallback: {
            channel: node => '#' + channels[node.id],
            user: node => '@' + users[node.id],
            role: node => '@' + roles[node.id]
        },
        embed: embed    // allow for named links
    });
    
    // modify <blockquote/> to use correct css
    content = content.replaceAll('<blockquote>', '<div class="blockquoteContainer"><div class="blockquoteDivider"></div><blockquote>');
    content = content.replaceAll('</blockquote>', '</blockquote></div>');
    
    // modify <code> -> <code class="inline">
    content = content.replaceAll('<code>', '<code class="inline">')    
    
    content = formatPVMESpreadsheet(content);

    return content;
}