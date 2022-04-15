<script>
	import DiscordView from './components/DiscordView.svelte';
	import { defaultText, defaultEmbed } from './constants/defaultText';

	// debug section
	// let errorLog = 'no errors<br>asdad<br>dasd<br>asdad<br>asdad<br>asdad';
	// $: result = embedValidate(text);

	// function embedValidate(embed) {
	// 	try {
	// 		let embedParse = JSON.parse(embed);
	// 	} catch (error) {
	// 		console.log(error.toString());
	// 		errorLog = error.toString();
	// 	}
		
	// }

	let errorMessage = 'No errors!';
	let errorBackground = 'bg-green-400';
	let text = defaultEmbed;
	// let text = defaultEmbed;
	let cursor = 0; 
	
	function formatErrors(errors) {
		// console.log(errors.detail.text);
		if (errors.detail.text.length === 0) {
			errorMessage = 'No errors!';
			errorBackground = 'bg-green-400';
		}
		else {
			let message = '';
			for (const error of errors.detail.text) {
				const line = error.line[0] === error.line[1] ? `line: ${error.line[0]}` : `lines: ${error.line.join('-')}`;
				message += `${line} - ${error.type} - ${error.text}<br>`;
			}
			errorMessage = message;
			errorBackground = 'bg-red-400'
		}
	}

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
	<div class='flex flex-col bg-slate-800 h-screen'>
		<div class="flex justify-left mt-4 mb-2 mx-2 flex-wrap">
			<div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">
				<button type="button" class="on:click={h1} rounded-l inline-block px-2 py-2 bg-slate-500 text-white leading-tight hover:bg-slate-600 focus:bg-slate-600 focus:outline-none focus:ring-0 active:bg-slate-900 transition duration-150 ease-in-out">H1</button>
				<!-- <button type="button" class="rounded-l inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Left</button>
				<button type="button" class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Middle</button>
				<button type="button" class="rounded-r inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Right</button> -->
			</div>
		</div>
		<div class='flex-grow flex flex-row overflow-auto'>
			<div class='w-1/2 ml-4 mr-2 mb-4 flex flex-col'>
				<textarea id="input" bind:value={text} on:input={setCursor} on:click={setCursor} on:keyup={setCursor} class="resize-none outline-none h-full p-3 w-full bg-slate-700 text-slate-50 scrollbar scrollbar-thumb-slate-800"/>					
				<div class='{errorBackground} opacity-70 h-24 mt-4 overflow-auto scrollbar scrollbar-thumb-slate-800'>
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



	<!-- <div class='flex flex-col bg-slate-800 h-screen'>
		<div class="flex justify-left mt-4 mb-2 mx-2 flex-wrap">
			<div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">
				<button type="button" class="rounded-l inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Left</button>
				<button type="button" class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Middle</button>
				<button type="button" class="rounded-r inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Right</button>
			</div>
			<div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">
				<button type="button" class="rounded-l inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Left</button>
				<button type="button" class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Middle</button>
				<button type="button" class="rounded-r inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Right</button>
			</div>
			<div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">
				<button type="button" class="rounded-l inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Left</button>
				<button type="button" class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Middle</button>
				<button type="button" class="rounded-r inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Right</button>
			</div>
		</div>
		<div class='flex-grow flex flex-row overflow-auto'>
			<div class='w-1/2 ml-4 mr-2 mb-4'>
				<textarea id="input" bind:value={text} on:input={setCursor} on:click={setCursor} on:keyup={setCursor} class="resize-none outline-none rounded-lg h-full p-3 w-full border-2 border-slate-900 bg-slate-700 text-slate-50 scrollbar-thin scrollbar-thumb-slate-900" autofocus/>					
			</div>
			<div class='w-1/2 mr-4 ml-2 mb-4 overflow-auto'>
				<DiscordView text={text}/>											
			</div>
		</div>
		<div class='bg-red-400 rounded-lg h-40 overflow-auto mb-4 mx-4 scrollbar-thin scrollbar-thumb-red-700 border-2 border-red-700'>
		<p class='p-1'>
			{errorLog}
		</p>
		</div>
	</div> -->




	<!-- <div class='flex flex-col bg-slate-800'>
		
			<div class='h-fit'>
			<div class="flex justify-left mt-4 mb-2 mx-2 flex-wrap">
				<div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">
					<button type="button" class="rounded-l inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Left</button>
					<button type="button" class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Middle</button>
					<button type="button" class="rounded-r inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Right</button>
				</div>
				<div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">
					<button type="button" class="rounded-l inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Left</button>
					<button type="button" class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Middle</button>
					<button type="button" class="rounded-r inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Right</button>
				</div>
				<div class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-2 mx-2" role="group">
					<button type="button" class="rounded-l inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Left</button>
					<button type="button" class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Middle</button>
					<button type="button" class="rounded-r inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">Right</button>
				</div>
			</div>
		</div>
		
		<div class='grid grid-cols-2 h-100'>
			<div class="flex-grow">
				<textarea id="input" bind:value={text} on:input={setCursor} on:click={setCursor} on:keyup={setCursor} class="resize-none outline-none rounded-lg h-full p-3 w-full border-2 border-slate-900 bg-slate-700 text-slate-50 scrollbar-thin scrollbar-thumb-slate-900"/>
			</div>
			<div class='h-screen'>
				<DiscordView text={text}/>
			</div>	
		</div>
		<div class='bg-slate-400 h-fit'>
			hi
			<br>
			awdwad
		</div> -->
		
		<!-- <div class="flex flex-wrap"> -->
			<!-- <div class="flex"> -->
				<!-- <div class="flex justify-left rounded-lg px-2 flex-wrap" role="group">
					<button on:click={h1} class="bg-slate-700 text-white hover:bg-slate-900 border-slate-900 border-2 rounded-l-lg px-3 py-2 mx-0 mt-2 outline-none focus:shadow-outline">H1</button>
					<button on:click={h2} class="bg-slate-700 text-white hover:bg-slate-900 border-slate-900 border-2 rounded-r-lg px-3 py-2 mx-0 mt-2 outline-none focus:shadow-outline">H2</button>
					
					<button on:click={h1} class="bg-slate-700 text-white hover:bg-slate-900 border-slate-900 border-2 rounded-l-lg px-3 py-2 mx-0 mt-2 outline-none focus:shadow-outline">H1</button>
					<button on:click={h2} class="bg-slate-700 text-white hover:bg-slate-900 border-slate-900 border-2 rounded-r-lg px-3 py-2 mx-0 mt-2 outline-none focus:shadow-outline">H2</button>
					<button on:click={h2} class="bg-slate-700 text-white hover:bg-slate-900 border-slate-900 border-2 rounded-r-lg px-3 py-2 mx-0 mt-2 outline-none focus:shadow-outline">Hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh2</button>
					<button on:click={h2} class="bg-slate-700 text-white hover:bg-slate-900 border-slate-900 border-2 rounded-r-lg px-3 py-2 mx-0 mt-2 outline-none focus:shadow-outline">Hssssddddssssssssssss2</button>
					<button on:click={h2} class="bg-slate-700 text-white hover:bg-slate-900 border-slate-900 border-2 rounded-r-lg px-3 py-2 mx-0 mt-2 outline-none focus:shadow-outline">Hssssddddssssssssssss2</button>
				</div> -->
			<!-- </div> -->
		<!-- </div> -->
		<!-- <div class='grid grid-cols-2'>
			<div class="">
				<textarea id="input" bind:value={text} on:input={setCursor} on:click={setCursor} on:keyup={setCursor} class="resize-none outline-none rounded-lg h-full p-3 w-full border-2 border-slate-900 bg-slate-700 text-slate-50 scrollbar-thin scrollbar-thumb-slate-900"/>
			</div>
			<div class=''>
				<DiscordView text={text}/>
			</div>	
		</div>
		<div>
			hi
			<br>
			awdwad
		</div> -->


	<!-- <div class="grid grid-cols-2 bg-slate-800 ">
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
	</div> -->
</main>

<style global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>