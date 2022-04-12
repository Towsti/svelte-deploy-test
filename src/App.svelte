<script>
	import DiscordView from './components/DiscordView.svelte';
	import { defaultText } from './constants/defaultText';

	let text = defaultText;
	let cursor = 0; 
	
	function insertAtIndex(value, relCursorPosition) {
		const textArea = document.getElementById('input');
		textArea.value = text.substring(0, cursor) + value + text.substring(cursor);
		textArea.setSelectionRange(cursor + relCursorPosition, cursor + relCursorPosition);
		textArea.focus();
	}

	function setCursor(e) {
		cursor = e.target.selectionStart;
	}

	function h1() {
		insertAtIndex('> __****__', '> __**'.length);
	}

	function h2() {
		insertAtIndex('__****__', '__**'.length);
	}
</script>

<main>
	<div class="grid grid-cols-2 bg-slate-800 ">
		<div class="flex flex-col">
			<div class="h-fit p-2">
				<div class="flex flex-grid">
					<div class="flex justify-left rounded-lg text-lg p-2" role="group">
						<button on:click={h1} class="bg-slate-700 text-white hover:bg-slate-900 border-slate-900 border-2 rounded-l-lg px-3 py-2 mx-0 outline-none focus:shadow-outline">H1</button>
						<button on:click={h2} class="bg-slate-700 text-white hover:bg-slate-900 border-slate-900 border-2 rounded-r-lg px-3 py-2 mx-0 outline-none focus:shadow-outline">H2</button>
					</div>
		    	</div>
			</div>
			<div class="flex-grow p-2">
				<textarea id="input" bind:value={text} on:input={setCursor} on:click={setCursor} on:keyup={setCursor} class="resize-none outline-none rounded-lg h-full p-3 w-full border-2 border-slate-900 bg-slate-700 text-slate-50 scrollbar-thin scrollbar-thumb-slate-900"/>
			</div>
		</div>		
		<div class="h-screen p-2">
			<DiscordView text={text}/>
		</div>	
	</div>
</main>

<style global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>