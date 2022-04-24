<script>
	import DiscordView from './components/DiscordView.svelte';
	import ErrorView from './components/ErrorView.svelte';
	import { defaultText, defaultEmbed } from './constants/defaultText';
	// import ScrollSync from "scroll-sync";
	import 'codemirror/lib/codemirror.css';
	import 'codemirror/theme/material.css';
	// import 'codemirror/mode/javascript/javascript';
	// import 'codemirror/mode/gfm/gfm';
	// import './codemirrorTheme/pvme/pvme';
	import 'codemirror/addon/edit/closebrackets';
	import 'codemirror/addon/edit/matchbrackets';
	import CodeMirror from 'codemirror';
	import { onMount } from 'svelte';
	// import { status } from './constants/discord';

	// import Fa from 'svelte-fa';
	// import { faBold, faItalic, faUnderline, faStrikethrough, faHeading, fa1, faListDots, faListNumeric, faCode, faCaretDown } from '@fortawesome/free-solid-svg-icons';
	// import "bootstrap-icons/font/bootstrap-icons.css";

	import GroupButton from './components/GroupButton.svelte';
	// import 'codemirror/mode/javascript/javascript';
	// import 'codemirror/mode/markdown/markdown';

	import CodeSquare from 'svelte-bootstrap-icons/lib/CodeSquare';
	import Code from 'svelte-bootstrap-icons/lib/Code';
	import TypeBold from 'svelte-bootstrap-icons/lib/TypeBold';
	import TypeItalic from 'svelte-bootstrap-icons/lib/TypeItalic';
	import TypeUnderline from 'svelte-bootstrap-icons/lib/TypeUnderline';
	import TypeStrikethrough from 'svelte-bootstrap-icons/lib/TypeStrikethrough';
	import TypeH1 from 'svelte-bootstrap-icons/lib/TypeH1';
	import TypeH2 from 'svelte-bootstrap-icons/lib/TypeH2';
	import ListUl from 'svelte-bootstrap-icons/lib/ListUl';
	import ListOl from 'svelte-bootstrap-icons/lib/ListOl';


	let editor;

	onMount(()=>{
		editor = CodeMirror.fromTextArea(document.getElementById('input'), {
			// mode: { name: 'text/javascript', json: true },
			// mode: {name: 'pvme', emoji: false, taskLists: false, gitHubSpice: false},
			theme: 'material',
			lineNumbers: true,
			lineWrapping: true,
			autoCloseBrackets: true,
  			matchBrackets: true,
			autofocus: true,
			// cursorScrollMargin: 40
			viewportMargin: Infinity
		});
		// console.log("Editor: ", editor);

		editor.setSize('100%', '100%');
		editor.on('change', updater);

		editor.setOption("extraKeys", {
			'Ctrl-B': bold,
			'Ctrl-I': italic,
			'Ctrl-U': underline,
			'Ctrl-Alt-S': strikethrough
		});
		
		
		// console.log(result);

		// editor.on('cursorActivity', cursorMoved);

		// const ss = new ScrollSync({
		// disabled: false, // [Boolean] Default value, allow to be empty.
		// relative: true, // [Boolean] Default value, allow to be empty.
		// doms: document.querySelectorAll('.scroll-container') // [Array] These elements must set scroll attributes.
		// });
	})

	


	let errorMessage = 'No errors!';
	let errorBackground = 'bg-green-400';
	let text = defaultText;
	let validText = text;
	let cursor = 0; 
	
	// function formatErrorMessage(error) {
	// 	const line = error.line[0] === error.line[1] ? `line: ${error.line[0]}` : `lines: ${error.line.join('-')}`;
	// 	const errorEmoji = error.type === 'error' ? '&#x2757' : error.type;
	// 	return `${errorEmoji} ${line} - ${error.text}`
	// }

	// function formatErrors(errors) {
	// 	// console.log(errors.detail.text);
	// 	if (errors.detail.text.length === 0) {
	// 		errorMessage = 'No errors!';
	// 		errorBackground = 'bg-green-400';
	// 	}
	// 	else {
	// 		let messages = [];
	// 		for (const error of errors.detail.text) {
	// 			messages.push(formatErrorMessage(error));
	// 		}
	// 		errorMessage = messages.join('<br>');
	// 		errorBackground = 'bg-red-400';
	// 	}
	// }
	
	function validateText(){
		validText = text;
	}

	function insertAtIndex(value, relCursorPosition) {
		// const textArea = document.getElementById('input');
		// textArea.value = text.substring(0, cursor) + value + text.substring(cursor);
		// textArea.setSelectionRange(cursor + relCursorPosition, cursor + relCursorPosition);
		// textArea.focus();
		const cursor = editor.getCursor();
		console.log(cursor);
		// editor.setValue(text.substring(0, cursor) + value + text.substring(cursor));
		editor.replaceRange(value, cursor);
		editor.setCursor(cursor.line, cursor.ch + relCursorPosition);
		// document.getElementById('input').setFocus();
		editor.focus();
		// editor.markText(cursor, {line: cursor.line, ch: cursor.ch + 10}, {className: 'bg-slate-500'});
		// editor.markText({line: cursor.line, ch: 0}, {line: cursor.line}, {className: 'bg-red-400 opacity-80'});
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
		text = cm.getValue();
		// console.log(event);
		// console.log(text);
		// text = event.detail;
	}

	// function h1() {
	// 	// insertAtIndex('> __****__', '> __**'.length);
	// 	// editor = CodeMirror.fromTextArea(document.getElementById('input'), {
	// 	// 	lineNumbers: true
	// 	// });
	// 	// editor.setSize('100%', '100%');
	// }

	// function h2() {
	// 	insertAtIndex('__****__', '__**'.length);
	// }

	function debug() {
		console.log("debug");
	}
</script>

<main>
	
	<!-- <div class='flex flex-col bg-slate-800 h-screen'>
		<div class="flex justify-left mt-4 mb-2 mx-2 flex-wrap">
			<div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">
				<button on:click={h1} type="button" class="rounded-l inline-block px-2 py-2 bg-slate-500 text-white leading-tight hover:bg-slate-600 focus:bg-slate-600 focus:outline-none focus:ring-0 active:bg-slate-900 transition duration-150 ease-in-out">H1</button>
			</div>
		</div>
		<div class='flex flex-row flex-grow'>
			<div class='ml-4 mr-2 mb-4 flex flex-col w-1/2'>
				<textarea id="input" class="resize-none outline-none flex-grow h-full p-3 bg-slate-700 text-slate-50">{text}</textarea>		
				<div class='{errorBackground} opacity-70 h-24 mt-4 overflow-auto'>
					{#if errorMessage !== ''}
						<p class='p-2 pb'>
							{@html errorMessage}
						</p>
					{/if}
				</div>
			</div>
			<div class='mr-4 ml-2 mb-4 w-1/2 overflow-auto'>
					<DiscordView text={text} on:errors={formatErrors}/>		
			</div>
		</div>
	</div> -->
	<!-- <div class='flex flex-col h-screen' style='background: #7289da'> -->
	<div class='flex flex-col h-screen bg-indigo-400'>
		<div class="flex justify-left mt-4 mb-2 mx-2 flex-wrap">
            <div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">                
				<GroupButton on:click={bold} title='Bold - Ctrl+B' corner={'rounded-l'} ><TypeBold/></GroupButton>
				<GroupButton on:click={italic} title='Italic - Ctrl+I'><TypeItalic/></GroupButton>
				<GroupButton on:click={underline} title='Italic - Ctrl+U'><TypeUnderline/></GroupButton>
				<GroupButton on:click={strikethrough} title='Strikethrough - Ctrl+Alt+S' corner={'rounded-r'}><TypeStrikethrough/></GroupButton>
			</div>
			<div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">
				<GroupButton on:click={h1} title='Header 1' corner={'rounded-l'}><TypeH1/></GroupButton>
				<GroupButton on:click={h2} title='Header 2' corner={'rounded-r'}><TypeH2/></GroupButton>
			</div>
			<div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">
				<GroupButton on:click={debug} corner={'rounded-l'}><ListUl/></GroupButton>
				<GroupButton on:click={debug} corner={'rounded-r'}><ListOl/></GroupButton>
			</div>
			<div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">
				<GroupButton on:click={inlineCode} title='Inline Code' corner={'rounded-l'}><Code/></GroupButton>
				<GroupButton on:click={debug} corner={'rounded-r'}><CodeSquare/></GroupButton>
			</div>
        </div>
        <div class='flex-grow flex flex-row overflow-auto'>
            <div class='w-1/2 ml-4 mr-2 mb-4 flex flex-col'>
                <!-- <textarea id="input" bind:value={text} on:scroll={scrollPosition} on:input={setCursor} on:click={setCursor} on:keyup={setCursor} class="resize-none outline-none h-full p-3 w-full bg-slate-700 text-slate-50 scrollbar scrollbar-thumb-slate-800 scroll-container"/>     -->
                <textarea id="input" class="resize-none outline-none p-3 bg-slate-700 text-slate-50 text-clip">{text}</textarea>    
                <!-- <div class='h-full overflow-visible'> -->
                    
                <!-- <CodeMirrorComponent bind:Editor={editor} bind:Value={text} Mode={'json'} closeBrackets={true}/> -->
                <!-- </div> -->
                
				

                <!-- <div class='{errorBackground} opacity-70 h-24 mt-4 overflow-auto'>
                {#if errorMessage !== ''}
                        <p class='p-2 pb'>
                            {@html errorMessage}
                        </p>
                {/if}
				</div>
			-->
				<ErrorView {text} on:noCriticalErrors={validateText}/>
            </div>
            <div class='w-1/2 mr-4 ml-2 mb-4 overflow-auto'>
                <!-- <DiscordView text={text} on:errors={formatErrors}/>                                             -->
				<DiscordView text={validText}/>
            </div>
        </div>
    </div>
</main>

<style global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
/* 
	.CodeMirror {
		--tw-bg-opacity: 1;
    	background-color: rgb(54 57 62) !important;
		color: white !important;
	} */

	.CodeMirror {
		/* font-family: Arial, monospace; */
		font-size: 14px;
		/* background-color: #2e3136 !important; */
		/* font-family: Consolas, Liberation Mono, Menlo, Courier, monospace; */
		/* color: hsla(0, 0%, 100%, .7) !important; */
		/* color: #f9f9f9 !important; */
		/* color: #839496 !important; */
	}
</style>