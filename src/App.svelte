<script>
	import DiscordView from './components/DiscordView.svelte';
	import { defaultText, defaultEmbed } from './constants/defaultText';
	// import ScrollSync from "scroll-sync";
	import CodeMirror from 'codemirror';
	import { onMount } from 'svelte';
	
	// import 'codemirror/mode/javascript/javascript';
	// import 'codemirror/mode/markdown/markdown';


	let editor;

	onMount(()=>{
		// editor = CodeMirror.fromTextArea(document.getElementById('input'), {
		// 	lineNumbers: true
		// });
		// console.log("Editor: ", editor);

		// editor.setSize(null, '100%');
		// editor.on('change', updater);
		// editor.on('cursorActivity', cursorMoved);

		// const ss = new ScrollSync({
		// disabled: false, // [Boolean] Default value, allow to be empty.
		// relative: true, // [Boolean] Default value, allow to be empty.
		// doms: document.querySelectorAll('.scroll-container') // [Array] These elements must set scroll attributes.
		// });
	})

	


	let errorMessage = 'No errors!';
	let errorBackground = 'bg-green-400';
	var text = defaultText;
	let cursor = 0; 
	
	function formatErrorMessage(error) {
		const line = error.line[0] === error.line[1] ? `line: ${error.line[0]}` : `lines: ${error.line.join('-')}`;
		const errorEmoji = error.type === 'error' ? '&#x2757' : error.type;
		return `${errorEmoji} ${line} - ${error.text}`
	}

	function formatErrors(errors) {
		// console.log(errors.detail.text);
		if (errors.detail.text.length === 0) {
			errorMessage = 'No errors!';
			errorBackground = 'bg-green-400';
		}
		else {
			let messages = [];
			for (const error of errors.detail.text) {
				messages.push(formatErrorMessage(error));
			}
			errorMessage = messages.join('<br>');
			errorBackground = 'bg-red-400';
		}
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
		editor.markText({line: cursor.line, ch: 0}, {line: cursor.line}, {className: 'bg-red-400 opacity-80'});
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

	function h1() {
		// insertAtIndex('> __****__', '> __**'.length);
		// editor = CodeMirror.fromTextArea(document.getElementById('input'), {
		// 	lineNumbers: true
		// });
		// editor.setSize('100%', '100%');
	}

	function h2() {
		insertAtIndex('__****__', '__**'.length);
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
	<div class='flex flex-col bg-slate-800 h-screen'>
        <div class="flex justify-left mt-4 mb-2 mx-2 flex-wrap">
            <div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">
                <button on:click={h1} type="button" class="rounded-l inline-block px-2 py-2 bg-slate-500 text-white leading-tight hover:bg-slate-600 focus:bg-slate-600 focus:outline-none focus:ring-0 active:bg-slate-900 transition duration-150 ease-in-out">H1</button>
            </div>
        </div>
        <div class='flex-grow flex flex-row overflow-auto'>
            <div id="scrollView-m" class='w-1/2 ml-4 mr-2 mb-4 flex flex-col'>
                <!-- <textarea id="input" bind:value={text} on:scroll={scrollPosition} on:input={setCursor} on:click={setCursor} on:keyup={setCursor} class="resize-none outline-none h-full p-3 w-full bg-slate-700 text-slate-50 scrollbar scrollbar-thumb-slate-800 scroll-container"/>     -->
                <textarea id="input"  bind:value={text} class="resize-none outline-none p-3 h-full bg-slate-700 text-slate-50"></textarea>    
                <!-- <div class='h-full overflow-visible'> -->
                    
                <!-- <CodeMirrorComponent bind:Editor={editor} bind:Value={text} Mode={'json'} closeBrackets={true}/> -->
                <!-- </div> -->
                
                <div class='{errorBackground} opacity-70 h-24 mt-4 overflow-auto'>
                {#if errorMessage !== ''}
                        <p class='p-2 pb'>
                            {@html errorMessage}
                        </p>
                {/if}
            </div>
            </div>
            <div class='w-1/2 mr-4 ml-2 mb-4 overflow-auto'>
                <DiscordView text={text} on:errors={formatErrors}/>                                            
            </div>
        </div>
    </div>
</main>

<style global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
