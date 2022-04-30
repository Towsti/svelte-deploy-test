<script>
	import 'codemirror/lib/codemirror.css';
	import 'codemirror/theme/material.css';
	import 'codemirror/addon/edit/closebrackets';
	import 'codemirror/addon/edit/matchbrackets';
	import CodeMirror from 'codemirror';
	import { onMount } from 'svelte';
	
    import { defaultText, defaultEmbed } from './constants/defaultText';
    import ErrorView from './ErrorView.svelte';
    import GroupButton from './GroupButton.svelte';
    import ButtonGroup from './ButtonGroup.svelte';
    import DiscordView from './DiscordView.svelte';

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
    let text = defaultText;
	let validText = text;
	let cursor = 0; 

    onMount(()=>{
		editor = CodeMirror.fromTextArea(document.getElementById('input'), {
			theme: 'material',
			lineNumbers: true,
			lineWrapping: true,
			autoCloseBrackets: true,
  			matchBrackets: true,
			autofocus: true,
			viewportMargin: Infinity
		});

		editor.setSize('100%', '100%');
		editor.on('change', updater);

		editor.setOption("extraKeys", {
			'Ctrl-B': bold,
			'Ctrl-I': italic,
			'Ctrl-U': underline,
			'Ctrl-Alt-S': strikethrough
		});
    });

    function validateText(){
		validText = text;
	}

    function updater(cm, change) {
		text = cm.getValue();
	}

</script>

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
        <ErrorView {text} on:noCriticalErrors={validateText}/>
    </div>
</div>

