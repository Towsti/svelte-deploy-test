<script>
	import DiscordView from './components/DiscordView.svelte';
	import ErrorView from './components/ErrorView.svelte';
	import { defaultText } from './constants/defaultText';

	import 'codemirror/lib/codemirror.css';
	import 'codemirror/theme/material.css';
	import 'codemirror/theme/monokai.css';
	import 'codemirror/theme/zenburn.css';
	import 'codemirror/theme/dracula.css';	// best so far
	import 'codemirror/theme/darcula.css';

	import 'codemirror/addon/edit/closebrackets';
	import 'codemirror/addon/edit/matchbrackets';
	import CodeMirror from 'codemirror';
	import { onMount } from 'svelte';
	import Toolbar from './components/Toolbar.svelte';
	import ScrollSync from 'scroll-sync'

	import autoformatText from './autoformat'; 

	import { persist, localStorage } from '@macfja/svelte-persistent-store';
	import { writable } from 'svelte/store';


	let editor;
	// let text = defaultText;
	let text = persist(writable(defaultText), localStorage(), 'text');
	let validText = $text;
	let cursor = 0; 
	

	onMount(()=>{
		const ss = new ScrollSync({
			disabled: false, 
			relative: true, 
			doms: document.querySelectorAll('.scroll-container')
		});
		var el = document.getElementById("myel");
		el.scrollTop = 100;

		editor = CodeMirror.fromTextArea(document.getElementById('input'), {
			theme: 'dracula',
			lineNumbers: true,
			lineWrapping: true,
			autoCloseBrackets: true,
  			matchBrackets: true,
			autofocus: true,
			// tabSize: 4	
			// cursorScrollMargin: 40
			// viewportMargin: Infinity,
			// pollInterval: 5000
		});

		editor.setSize('100%', '100%');
		editor.on('change', updater);

		editor.setOption("extraKeys", {
			'Ctrl-B': bold,
			'Ctrl-I': italic,
			'Ctrl-U': underline,
			'Ctrl-Alt-S': strikethrough
		});

		
	})
	
	function validateText(){
		validText = $text;
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

	function updateStyleFormat(textBeforeSelection, textAfterSelection){
		const selectionRange = selectionRangeFixedStartEnd();
		const selection = editor.getSelection();

		const lengthBefore = textBeforeSelection.length;
		const lengthAfter = textAfterSelection.length;
		const containedText = includeBeforeAfterText(selectionRange, lengthBefore, lengthAfter);

		if (containedText.startsWith(textBeforeSelection) && containedText.endsWith(textAfterSelection)) {
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

	function h1() {
		updateStyleFormat('> __**', '**__');
	}

	function h2() {
		updateStyleFormat('__**', '**__');
	}

	function inlineCode() {
		updateStyleFormat('\`', '\`');
	}

	function setCursor(e) {
		cursor = e.target.selectionStart;
	}

	function scrollPosition(e) {
		const scrollView = document.getElementById('scrollView1');		
	}

	function cursorMoved(cm) {
		// console.log(cm);
		// cursor = cm.getCursor();
	}

	function updater(cm, change) {
		// console.log(change);
		const originalText = cm.getValue();
		const { formattedText, newCursorPosition } = autoformatText(originalText, cm.getCursor());
		// text = formattedText;
		$text = formattedText;
		if (originalText != formattedText) {
			cm.setValue(formattedText);
			cm.setCursor(newCursorPosition);
		}
	}

	function debug() {
		console.log("debug");
	}

	function generateToC() {
		// .tag:introduction
		const regexp = /\n.tag:([^\n]+)/g;
		const results = [...text.matchAll(regexp)];
		let fields = [];
		for (const result of results){
			fields.push(`      {
        "name": "__${result[1]}__",
        "value": "[Link]($linkmsg_${result[1]}$)",
        "inline": true
      }`);
		}
		
		let tocEmbed = `
{
  "embed": {
    "title": "Table of Contents",
    "color": 39423,
    "fields": [
${fields.join(',\n')}
    ]
  }
}
.embed:json`;
		editor.setCursor({line: editor.lastLine()});
		editor.setValue(text + tocEmbed);
		editor.setCursor({line: editor.lastLine()});
		editor.focus();
	}
</script>

<main>
	<div class='flex flex-col h-screen bg-indigo-400'>
		<!-- <div class='flex flex-col h-screen bg-cyan-800'> -->
		<Toolbar on:bold={bold} on:italic={italic} on:generateToC={generateToC} />
        <div class='flex-grow flex flex-row overflow-auto'>
            <div class='w-1/2 ml-4 mr-2 mb-4 flex flex-col'>
                <!-- <textarea id="input" class=" scroll-container resize-none outline-none p-3 bg-slate-700 text-slate-50 text-clip">{text}</textarea> -->
				<textarea id="input" class="">{$text}</textarea>
				<ErrorView text={$text} on:noCriticalErrors={validateText}/>
            </div>
            <div id='myel' class='w-1/2 mr-4 ml-2 mb-4 overflow-auto scroll-container'>
				<DiscordView text={validText}/>
            </div>
        </div>
    </div>
</main>

<style global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

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

</style>