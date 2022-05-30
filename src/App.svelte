<script>
	import DiscordView from './components/DiscordView.svelte';
	import ErrorView from './components/ErrorView.svelte';
	import { defaultText } from './constants/defaultText';

	import 'codemirror/lib/codemirror.css';
	import 'codemirror/theme/dracula.css';

	// import 'codemirror/mode/markdown/markdown';

	import 'codemirror/addon/edit/closebrackets';
	import 'codemirror/addon/edit/matchbrackets';
	import 'codemirror/addon/edit/trailingspace';
	// import 'codemirror/addon/edit/continuelist';
	import 'codemirror/addon/selection/active-line';

	import './autoIndent';

	import CodeMirror from 'codemirror';
	import { onMount } from 'svelte';
	// import Toolbar from './components/Toolbar.svelte';
	import Toolbar from './components/toolbar/Toolbar.svelte';
	import ScrollSync from 'scroll-sync'
	

	import autoformatText from './autoformat'; 

	// import { persist, localStorage } from '@macfja/svelte-persistent-store';
	// import { writable } from 'svelte/store';
	import { populateConstants } from './constants/discord';

	import TempComponent from './components/TempComponent.svelte';
	import { text } from './stores';

	let editor;
	// let text = defaultText;
	// let text = persist(writable(defaultText), localStorage(), 'text');
	let validText = $text;	//  bug: exiting last session with invalid text
	let cursor = 0; 
	let visibleText = validText;

	onMount(()=>{
		// const ss = new ScrollSync({
		// 	disabled: false, 
		// 	relative: true, 
		// 	doms: document.querySelectorAll('.scroll-container')
		// });
		// var el = document.getElementById("myel");
		// el.scrollTop = 100;

		editor = CodeMirror.fromTextArea(document.getElementById('input'), {
			theme: 'dracula',
			// mode: {name: 'markdown', highlightFormatting: false},
			lineNumbers: true,
			lineWrapping: true,
			autoCloseBrackets: true,
  			matchBrackets: true,
			autofocus: true,
			tabSize: 2,	
			cursorScrollMargin: 12,
			showTrailingSpace: true,
			styleActiveLine: true,
			// flattenSpans: false

			// viewportMargin: Infinity,
			// pollInterval: 5000
		});

		editor.setSize('100%', '100%');
		editor.on('change', updater);
		editor.on('scroll', viewportChanger);

		editor.setOption("extraKeys", {
			'Ctrl-B': bold,
			'Ctrl-I': italic,
			'Ctrl-U': underline,
			'Ctrl-Alt-S': strikethrough,
			'Enter': 'newlineAndIndentContinueMarkdownList',
			'Tab': 'autoIndentMarkdownList',
			'Shift-Tab': 'autoUnindentMarkdownList'
		});

		editor.setValue($text);
		validateText();
	});
	
	function validateText(){
		validText = $text;
		visibleText = getVisibleText(validText);
	}

	function selectionRangeFixedStartEnd() {
		const selectionRange = editor.listSelections()[0];
		let selection = Object();

		if ((selectionRange.anchor.line < selectionRange.head.line) || 
			(selectionRange.anchor.ch <= selectionRange.head.ch)) {
			selection.start = selectionRange.anchor;
			selection.end = selectionRange.head;
		}
		else {
			selection.start = selectionRange.head;
			selection.end = selectionRange.anchor;
		}
		// console.log(`start: (${selection.start.line}, ${selection.start.ch}), end: (${selection.end.line}, ${selection.end.ch})`);
		return selection;
	}

	function includeBeforeAfterText(fixedSelectionRange, lengthBefore, lengthAfter) {
		return editor.getRange(
			{
				line: fixedSelectionRange.start.line,
				ch: fixedSelectionRange.start.ch - lengthBefore
			},
			{
				line: fixedSelectionRange.end.line,
				ch: fixedSelectionRange.end.ch + lengthAfter
			}
		);
	}

	function isMultiLineSelection(fixedSelectionRange) {
		return fixedSelectionRange.end.line > fixedSelectionRange.start.line;
	}

	function insideItalicFormatting(fixedSelectionRange, lengthBefore, lengthAfter) {
		// workaround for *italic* and **bold**
		// avoids that when you bold "**highlight**" then italic, that it will remove italic "*highlight*"
		const selection = editor.getRange(
			{
				line: fixedSelectionRange.start.line,
				ch: fixedSelectionRange.start.ch - 3
			},
			{
				line: fixedSelectionRange.end.line,
				ch: fixedSelectionRange.end.ch
			}
		);
		// const endFormatting = selection.substring(selection.length - 3);
		// return endFormatting.startsWith('***') || (!endFormatting.startsWith('**') && endFormatting.startsWith('*'));
		if (selection.startsWith('***'))
			return true;
		
		if (selection.startsWith('**') || selection.startsWith('**', 1))
			return false;
		
		if (selection.startsWith('*') || selection.startsWith('*', 1) || selection.startsWith('*', 2))
			return true;
		
		return false;
	}

	function insideFormatting(fixedSelectionRange, formattingBefore, formattingAfter) {
		const lengthBefore = formattingBefore.length;
		const lengthAfter = formattingAfter.length;
		if (formattingBefore === '*') 
			return insideItalicFormatting(fixedSelectionRange, lengthBefore, lengthAfter);
	
		const containedText = includeBeforeAfterText(fixedSelectionRange, lengthBefore, lengthAfter);
		return containedText.startsWith(formattingBefore) && containedText.endsWith(formattingAfter);
	}

	function updateStyleFormat(textBeforeSelection, textAfterSelection){
		const selectionRange = selectionRangeFixedStartEnd();
		const selection = editor.getSelection();

		const lengthBefore = textBeforeSelection.length;
		const lengthAfter = textAfterSelection.length;
		if (insideFormatting(selectionRange, textBeforeSelection, textAfterSelection)) {
			// remove formatting
			editor.replaceRange(
				selection,
				{
					line: selectionRange.start.line,
					ch: selectionRange.start.ch - lengthBefore
				},
				{
					line: selectionRange.end.line,
					ch: selectionRange.end.ch + lengthAfter
				}
			);
		
			editor.setSelection(
				{
					line: selectionRange.start.line,
					ch: selectionRange.start.ch - lengthBefore
				},
				{
					line: selectionRange.end.line,
					ch: selectionRange.end.ch - (isMultiLineSelection(selectionRange) ? 0 : lengthBefore)
				}
			);
		}
		else {
			// add formatting
			editor.replaceSelection(textBeforeSelection + selection + textAfterSelection, selection);

			editor.setSelection(
				{
					line: selectionRange.start.line,
					ch: selectionRange.start.ch + lengthBefore
				},
				{
					line: selectionRange.end.line,
					ch: selectionRange.end.ch + (isMultiLineSelection(selectionRange) ? 0 : lengthBefore)
				}
			);
		}
		editor.focus();
	}

	function bold() {
		updateStyleFormat('**', '**');
	}

	function italic() {
		updateStyleFormat('*', '*');
	}

	function underline() {
		updateStyleFormat('__', '__');
	}

	function strikethrough() {
		updateStyleFormat('~~', '~~');
	}

	function updateSingleLineStyleFormat(lineStartText, lineEndText='') {
		const selection = selectionRangeFixedStartEnd();
		const selectedLineText = editor.getLine(selection.start.line);
		const lengthStartText = lineStartText.length;
		const lengthEndText = lineEndText.length;

		if (selectedLineText.startsWith(lineStartText) && selectedLineText.endsWith(lineEndText)) {
			editor.replaceRange(selectedLineText.substring(lengthStartText), 
				{
					line: selection.start.line, 
					ch: 0
				}, 
				{
					line: selection.start.line, 
					ch: selectedLineText.length
				}
			);
		}
		else {
			editor.replaceRange(lineStartText, 
				{
					line: selection.start.line, 
					ch: 0
				}
			);
		}
		editor.focus();
	}

	function h1() {
		updateSingleLineStyleFormat('> __**', '**__');	
	}

	function h2() {
		updateSingleLineStyleFormat('__**', '**__');
	}

	function inlineCode() {
		updateStyleFormat('\`', '\`');
	}

	function codeBlock() {
		updateStyleFormat('\`\`\`', '\`\`\`');
	}

	function unorderedList() {
		updateSingleLineStyleFormat('⬥ ');	
	}

	function orderedList() {
		// const selection = selectionRangeFixedStartEnd();
		// const selectedLineText = editor.getLine(selection.start.line);
		// if (selectedLineText.startsWith("1. ")) {
		// 	editor.replaceRange(selectedLineText.substring("1. ".length), {line: selection.start.line, ch: 0}, {line: selection.start.line, ch: selectedLineText.length});
		// }
		// else {
		// 	editor.replaceRange('1. ', {line: selection.start.line, ch: 0});

		// }
		// editor.focus();
		updateSingleLineStyleFormat('1. ');	
	}

	function setCursor(e) {
		cursor = e.target.selectionStart;
	}

	// function scrollPosition(e) {
	// 	const scrollView = document.getElementById('scrollView1');		
	// }

	// function cursorMoved(cm) {
	// 	// console.log(cm);
	// 	// cursor = cm.getCursor();
	// }

	function getVisibleText(text) {
		// console.log(editor.getViewport());
		const rect = editor.getWrapperElement().getBoundingClientRect();
		const topVisibleLine = editor.lineAtHeight(rect.top, "window");
		const bottomVisibleLine = editor.lineAtHeight(rect.bottom, "window");
		const lines = text.split('\n');
		let lineTop = topVisibleLine;
		let lineBottom = bottomVisibleLine;
		let insideEmbed = false;
		for (let i = topVisibleLine; i < lines.length; i++) {
			if (lines[i].startsWith('.')) {
				insideEmbed = lines[i].startsWith('.embed:json') ? true : false; 
				break;
			}
		}
		if (insideEmbed) {
			for (let i = topVisibleLine; i > 0; i--) {
				if (lines[i].startsWith('.')) {
					lineTop = i;
					break;
				}
			}
		}
		// } else {
		// 	if (lines[lineTop].startsWith('.embed')) {
		// 		console.log("embed start");
		// 	}
		// }
		for (let i = topVisibleLine; i > 0; i--) {
			if (lines[i].startsWith('.')) {
				lineTop = i;
				break;
			}
		}
		for (let i = bottomVisibleLine; i < lines.length; i++) {
			if (lines[i].startsWith('.')) {
				// lineBotom = bottomVisibleLine + i * 2;
				lineBottom = i + 1;
				// console.log(lines[i-1]);
				break;
			}
		}
		// console.log(`${topVisibleLine} + ${bottomVisibleLine} -> ${lineTop} + ${lineBottom}`);
		// return lines.slice(topVisibleLine, bottomVisibleLine).join('\n');
		let visLines = lines.slice(lineTop, lineBottom)
		// visLines += '\n.\nEND';
		// console.log(visLines);
		if (visLines[0].startsWith('.embed:json')) {
			visLines.shift();
		}
		return visLines.join('\n');
	}

	function updater(cm, change) {
		// console.log(change);
		const originalText = cm.getValue();
		// console.log(getVisibleText(originalText));
		// const visibleText = getVisibleText(cm.getValue());


		const { formattedText, newCursorPosition } = autoformatText(originalText, cm.getCursor());
		// const { formattedText, newCursorPosition } = autoformatText(visibleText, cm.getCursor());
		
		if (originalText != formattedText) {
		// if (visibleText != formattedText) {
			cm.setValue(formattedText);
			cm.setCursor(newCursorPosition);
		}
		$text = formattedText;
	}

	function viewportChanger(cm) {
		visibleText = getVisibleText(validText);
		// $text = visibleText;
	}

	function debug() {
		console.log("debug");
		
		// const line = editor.getLine(editor.getLineNumber());
		// if (line === '') {
		// 	editor.replaceRange('⬥ ', {line: line, ch: 0}, {line: line, ch: 2});
		// }
		// editor.focus();
		// const selection = selectionRangeFixedStartEnd();
		// editor.replaceRange('⬥ ', {line: selection.start.line, ch: 0}, {line: selection.start.line, ch: 0});

		editor.focus();
	}
</script>

<main>
	<div class='flex flex-col h-screen bg-indigo-400'>
		<!-- <div class='flex flex-col h-screen bg-cyan-800'> -->
		
			<!-- <Toolbar 
			on:bold={bold} 
			on:italic={italic} 
			on:underline={underline} 
			on:strikethrough={strikethrough} 
			on:inlineCode={inlineCode} 
			on:codeBlock={codeBlock} 
			on:unorderedList={unorderedList} 
			on:orderedList={orderedList} 
			on:generateToC={generateToC}/> -->
			<Toolbar on:h1={h1} on:h2={h2} on:unorderedList={unorderedList} on:orderedList={orderedList} on:debug={debug}></Toolbar>

			<div class='flex-grow flex flex-row overflow-auto'>
				<div class='w-1/2 ml-4 mr-2 mb-4 flex flex-col'>
					<!-- <textarea id="input" class=" scroll-container resize-none outline-none p-3 bg-slate-700 text-slate-50 text-clip">{text}</textarea> -->
					<textarea id="input"></textarea>
					<ErrorView text={$text} on:noCriticalErrors={validateText}/>
				</div>
				<div class='w-1/2 mr-4 ml-2 mb-4 overflow-auto'>
					{#await populateConstants()}
						<div class='w-1/2 bg-slate-50 flex-grow'>
							<p>Waiting for channels, users, and prices to load...</p>
						</div>
					{:then}
						<!-- <TempComponent text={validText}></TempComponent> -->
						<!-- <DiscordView text={visibleText}/> -->
					{:catch error}
						<p style="color: red">{error.message}</p>
					{/await}
				</div>
			</div>
    </div>
</main>

<style global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

/* ::-webkit-scrollbar {
  width: 10px;
} */

/* ::-webkit-scrollbar-track {
  background: #888; 
}
 
::-webkit-scrollbar-thumb {
  background: #555; 
}

::-webkit-scrollbar-thumb:hover {
  background: #555; 
} */

	.CodeMirror {
		/* font-family: Arial, monospace; */
		/* font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; */
		font-size: 14px;
		/* background-color: #2e3136 !important; */
		/* font-family: Consolas, Liberation Mono, Menlo, Courier, monospace; */
		/* color: hsla(0, 0%, 100%, .7) !important; */
		/* color: #f9f9f9 !important; */
		/* color: #839496 !important; */


		/* color: #d0d8dd !important; */
        /* font-family: Whitney, Helvetica Neue, Helvetica, Arial, sans-serif !important; */
		/* font-family: Menlo, Consolas, Monaco, monospace !important; */
		/* background-color: #36393e !important; */
		/* background-color: #2e3136 !important; */

	}

	/* .cm-s-material .CodeMirror-gutters {
		background: #2e3136 !important;
		color: #d0d8dd !important;
	}

	.cm-s-material .CodeMirror-linenumber {
		color: #839496 !important;
	} */
	.cm-s-dracula .CodeMirror-activeline-background { background: rgba(255,255,255,0.05) !important; }
	/* .cm-s-dracula .CodeMirror-selected { background: rgba(255, 255, 255, 0.25) !important; } */
	.cm-s-dracula div.CodeMirror-selected { background: #214283 !important; }

</style>