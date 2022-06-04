import { channelsFormat, rolesFormat, emojisFormat } from './constants/discord';



function formatEmojis(cm) {
    /* Format named emojis (or aliases) to emoji ID's. 
    INPUT: "text ;gbarge; more text ;greaterbarge;" 
    OUTPUT: "text <:gbarge:1234> more text <:gbarge:1234>" */
    const formattedText = cm.getValue();
    const regexp = /;([^;]+);/g;
    const results = [...formattedText.matchAll(regexp)];
    for (const result of results.reverse()) {
        const [match, name] = result;
        const emoji = emojisFormat[name.toLowerCase()];
        if (emoji) {
            const cursor = getCursorFromIndex(formattedText, result.index);
            cm.replaceRange(emoji, cursor, {line: cursor.line, ch: cursor.ch + match.length});
        }
    }
}

function formatChannels(cm) {
    /* Format named channels to channel ID's. 
    INPUT: "text ;#eD2-hydrix-drAgOns; more text" 
    OUTPUT: "text <#1234> more text" */
    const formattedText = cm.getValue();
    const regexp = /;#([^;]+);/g;
    const results = [...formattedText.matchAll(regexp)];
    for (const result of results.reverse()) {
        const [match, name] = result;
        const channelID = channelsFormat[name.toLowerCase()];
        if (channelID) {
            const cursor = getCursorFromIndex(formattedText, result.index);
            cm.replaceRange(`<#${channelID}>`, cursor, {line: cursor.line, ch: cursor.ch + match.length});
        }
    }
}

function formatRoles(cm) {
    /* Format named roles to role ID's. 
    INPUT: "text ;@&helPer; more text" 
    OUTPUT: "text <@&1234> more text" */
    const formattedText = cm.getValue();
    const regexp = /;@&([^;]+);/g;
    const results = [...formattedText.matchAll(regexp)];
    for (const result of results.reverse()) {
        const [match, name] = result;
        const roleID = rolesFormat[name.toLowerCase()];
        if (roleID) {
            const cursor = getCursorFromIndex(formattedText, result.index);
            cm.replaceRange(`<@&${roleID}>`, cursor, {line: cursor.line, ch: cursor.ch + match.length});
        }
    }
    return formattedText;
}

function formatArrows(cm) {
    let formattedText = cm.getValue();
    const regexp = /->/g;
    const results = [...formattedText.matchAll(regexp)];
    for (const result of results.reverse()) {
        const cursor = getCursorFromIndex(formattedText, result.index)
        cm.replaceRange('→', cursor, {line: cursor.line, ch: cursor.ch + result.length + 1})
    }
}

function getCursorFromIndex(text, index) {
    /* Get codemirror cursor object { line, ch } from a string index.
    INPUT: text = "hello\nworld", index = 7
    OUTPUT: {line: 1, ch: 1} */
    const lines = text.split('\n');
    let cursorChar = index;
    let cursorLine;
    for (let [i, line] of lines.entries()) {
        cursorLine = i;
        if (i < lines.length - 1)
            line += '\n';
        if (cursorChar <= line.length)
            break;
        cursorChar -= line.length; 
    }
    return {line: cursorLine, ch: cursorChar};
}

function reverse(str) {
    /* Reverse a string.
    INPUT: str = "hello world"
    OUTPUT: "dlrow olleh" */
    let reversed = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}

// function getNewCursorPosition(originalText, formattedText, originalCursor) {
//     if (originalText == formattedText)
//         return originalCursor;
    
//     const originalTextReversed = reverse(originalText);
//     const formattedTextReversed = reverse(formattedText);
//     let changeIndex;
//     for (let i=0; i < formattedTextReversed.length; i++) {
//         if (formattedTextReversed[i] != originalTextReversed[i]) {
//             changeIndex = formattedText.length - i;
//             break;
//         }
//     }
//     return getCursorFromIndex(formattedText, changeIndex);
// }

export default function autoformatText(cm) {
    // ordered so that there are no false results (not mandatory but faster)
    formatArrows(cm);
    formatRoles(cm);
    formatChannels(cm);
    formatEmojis(cm);
}