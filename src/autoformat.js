// todo: duplicate code and shared code with markdown.js
import { channelsFormat, rolesFormat, emojisFormat } from './constants/discord';


String.prototype.replaceAt = function(startIndex, replacement, endIndex) {
    return this.substring(0, startIndex) + replacement + this.substring(endIndex);
}

function formatEmojis(text) {
    /* Format named emojis (or aliases) to emoji ID's. 
    INPUT: "text ;gbarge; more text ;greaterbarge;" 
    OUTPUT: "text <:gbarge:1234> more text <:gbarge:1234>" */
    let formattedText = text;
    const regexp = /;([^;]+);/g;
    const results = [...formattedText.matchAll(regexp)];
    for (const result of results.reverse()) {
        const [match, name] = result;
        const startIndex = result.index;
        const endIndex = startIndex + match.length;
        const emoji = emojisFormat[name.toLowerCase()];
        if (emoji)
            formattedText = formattedText.replaceAt(startIndex, emoji, endIndex);
    }
    return formattedText;
}

function formatChannels(text) {
    /* Format named channels to channel ID's. 
    INPUT: "text ;#eD2-hydrix-drAgOns; more text" 
    OUTPUT: "text <#1234> more text" */
    let formattedText = text;
    const regexp = /;#([^;]+);/g;
    const results = [...formattedText.matchAll(regexp)];
    for (const result of results.reverse()) {
        const [match, name] = result;
        const startIndex = result.index;
        const endIndex = startIndex + match.length;
        const channelID = channelsFormat[name.toLowerCase()];
        if (channelID)
            formattedText = formattedText.replaceAt(startIndex, `<#${channelID}>`, endIndex);
    }
    return formattedText;
}

function formatRoles(text) {
    /* Format named roles to role ID's. 
    INPUT: "text ;@&helPer; more text" 
    OUTPUT: "text <@&1234> more text" */
    let formattedText = text;
    const regexp = /;@&([^;]+);/g;
    const results = [...formattedText.matchAll(regexp)];
    for (const result of results.reverse()) {
        const [match, name] = result;
        const startIndex = result.index;
        const endIndex = startIndex + match.length;
        const roleID = rolesFormat[name.toLowerCase()];
        if (roleID)
            formattedText = formattedText.replaceAt(startIndex, `<@&${roleID}>`, endIndex);
    }
    return formattedText;
}

function formatArrows(text) {
    return text.replace(/->/g, '→');
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

function getNewCursorPosition(originalText, formattedText, originalCursor) {
    if (originalText == formattedText)
        return originalCursor;
    
    const originalTextReversed = reverse(originalText);
    const formattedTextReversed = reverse(formattedText);
    let changeIndex;
    for (let i=0; i < formattedTextReversed.length; i++) {
        if (formattedTextReversed[i] != originalTextReversed[i]) {
            changeIndex = formattedText.length - i;
            break;
        }
    }
    return getCursorFromIndex(formattedText, changeIndex);
}

export default function autoformatText(text, cursor) {
    let formattedText = text;
    
    // ordered so that there are no false results (not mandatory but faster)
    formattedText = formatArrows(formattedText);
    formattedText = formatRoles(formattedText);
    formattedText = formatChannels(formattedText);
    formattedText = formatEmojis(formattedText);
    
    const newCursorPosition = getNewCursorPosition(text, formattedText, cursor);
    return { formattedText, newCursorPosition}
}