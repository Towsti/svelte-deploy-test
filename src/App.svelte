<script>
	import DiscordView from './components/DiscordView.svelte';
	import ErrorView from './components/ErrorView.svelte';

	import 'codemirror/lib/codemirror.css';
	import 'codemirror/addon/display/placeholder.js';
	import 'codemirror/theme/dracula.css';

	import 'codemirror/addon/edit/closebrackets';
	import 'codemirror/addon/edit/matchbrackets';
	import 'codemirror/addon/edit/trailingspace';

	import 'codemirror/addon/selection/active-line';

	import './autoIndent';

	import CodeMirror from 'codemirror';
	import { onMount } from 'svelte';
	import Toolbar from './components/toolbar/Toolbar.svelte';

	import { updateStyleFormat, updateSingleLineStyleFormat } from './styleFormat';
	import autoformatText from './autoformat';  

	import { populateConstants } from './constants/discord';

	import { text } from './stores';

	let editor;
	let validText = $text;	//  bug: exiting last session with invalid text
	let cursor = 0; 
	let visibleText = validText;
	let showView = true;

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
		editor.on('inputRead', newInput);

		editor.setOption("extraKeys", {
			'Ctrl-B': bold,
			'Ctrl-I': italic,
			'Ctrl-U': underline,
			'Ctrl-Alt-S': strikethrough,
			'Ctrl-Alt-1': h1,
			'Ctrl-Alt-2': h2,
			'Enter': 'newlineAndIndentContinueMarkdownList',
			'Tab': 'autoIndentMarkdownList',
			'Shift-Tab': 'autoUnindentMarkdownList'
		});

		editor.setValue($text);
		validateText();
	});
	
	function newInput(cm, change) {
		autoformatText(cm);
	}

	function validateText(){
		validText = $text;
		visibleText = getVisibleText(validText);
	}

	function updateInlineFormat(textBeforeSelection, textAfterSelection){
		updateStyleFormat(editor, textBeforeSelection, textAfterSelection);
		editor.focus();
	}

	function updateLineFormat(lineStartText, lineEndText='') {
		updateSingleLineStyleFormat(editor, lineStartText, lineEndText);
		editor.focus();
	}

	function bold() {
		updateInlineFormat('**', '**');
	}

	function italic() {
		updateInlineFormat('*', '*');
	}

	function underline() {
		updateInlineFormat('__', '__');
	}

	function strikethrough() {
		updateInlineFormat('~~', '~~');
	}

	function h1() {
		updateLineFormat('> __**', '**__');	
	}

	function h2() {
		updateLineFormat('__**', '**__');
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
		$text = cm.getValue();
	}

	function viewportChanger(cm) {
		visibleText = getVisibleText(validText);
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

	function command(event) {
		editor.replaceSelection(event.detail.command);
		editor.focus();
	}
</script>

<main>
	<div class='flex flex-col h-screen bg-indigo-400'>
		<Toolbar
			on:bold={bold} 
			on:italic={italic} 
			on:underline={underline} 
			on:strikethrough={strikethrough}
			on:h1={h1} 
			on:h2={h2}
			on:unorderedList={() => updateLineFormat('⬥ ')} 
			on:orderedList={() => updateLineFormat('1. ')} 
			on:inlineCode={() => updateInlineFormat('\`', '\`')} 
			on:codeBlock={() => updateInlineFormat('\`\`\`', '\`\`\`')} 
			on:debug={debug}
			on:command={command}
			on:toggleView={() => showView = !showView}
		/>
		<div class='flex-grow flex flex-row overflow-auto'>
			<div class='w-1/2 ml-4 mr-2 mb-4 flex flex-col' class:w-full="{showView === false}" class:mr-4="{showView === false}">
				<textarea id="input" placeholder="Click ❔ for tips on autoformatting..."></textarea>
				<ErrorView text={$text} on:noCriticalErrors={validateText}/>
			</div>
			{#await populateConstants()}
				<p class="ml-2">Waiting for channels, users, and prices to load...</p>	
			{:then}
				{#if showView}
					<div class='w-1/2 mr-4 ml-2 mb-4 overflow-auto'>
						<DiscordView text={validText}/>	
					</div>
				{/if}
			{:catch error}
					<p style="color: red">{error.message}</p>
			{/await}
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

	.cm-s-dracula.CodeMirror.CodeMirror-empty {color: rgb(182, 182, 182) !important;}
	/* .cm-s-dracula.CodeMirror-empty {background-color: antiquewhite !important; background: black !important;} */

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