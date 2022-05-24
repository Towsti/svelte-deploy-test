<script>
    // import { Tooltip } from 'flowbite';
    import 'flowbite';
    import { fade } from 'svelte/transition';

    import Button from './Button.svelte';
    import ButtonGroup from './ButtonGroup.svelte';
    // import { persist, localStorage } from '@macfja/svelte-persistent-store';
	// import { writable } from 'svelte/store';
    import { text } from '../../stores';
    import Clipboard from 'svelte-bootstrap-icons/lib/Clipboard';
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    // let text = persist(writable(''), localStorage(), 'text');
    export let dispatch;
    let toc = '';
    // let dropdown;
    let clicked = false;
    // let text = "";
    // let text = "hi"
    
    // onMount(()=>{
    //     dropdown = new Dropdown(document.getElementById('dropdownInformation'), document.getElementById('dropdownToC'));
    // });
    let copy = copyToClipboard;

    async function copyToClipboard() {
        await new Promise(r => setTimeout(r, 400));
        const dropdown = new Dropdown(document.getElementById('ToCInformation'), document.getElementById('ToCButton'));
        dropdown.hide();
        navigator.clipboard.writeText(toc);
        dispatch('debug');
    }

	function generateToC() {
		// .tag:introduction
		const regexp = /\n.tag:([^\n]+)/g;
		const results = [...$text.matchAll(regexp)];
		let fields = [];
		for (const result of results){
			fields.push(`      {
        "name": "__${result[1]}__",
        "value": "[Link]($linkmsg_${result[1]}$)",
        "inline": true
      }`);
		}
		
		toc = `
{
  "embed": {
    "title": "Table of Contents",
    "color": 39423,
    "fields": [
${fields.join(',\n')}
    ]
  }
}
.embed:json
.pin:delete`;
    }

    function copy1() {
        // console.log(dropdown);
        // dropdown.hide();

        // const dropdown = new Dropdown(document.getElementById('dropdownInformation'), document.getElementById('dropdownToC'));
        // dropdown.hide();
        
        clicked = true;
        // document.getElementById("dropdownInformation").style.visibility='hidden';
        // document.getElementById("dropdownInformation").style.visibility='visible';
        // alert("Copied to clipboard");
        // clicked = true;
        // var element = document.getElementById("dropdownInformation");
        // element.classList.remove('block');
        // element.classList.add('hidden');
        dispatch('debug');
    }

    function transitionEnd() {
        // console.log("end");
        clicked = false;
        const dropdown = new Dropdown(document.getElementById('ToCInformation'), document.getElementById('ToCButton'));
        dropdown.hide();
        
    }
</script>


<!-- <button  data-dropdown-toggle="dropdownInformation" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown header <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button> -->
<button id="ToCButton" data-dropdown-toggle="ToCInformation" on:click={generateToC} type="button" class='rounded bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-2 active:bg-indigo-800 text-sm border border-indigo-700' title="Generate table of contents">
    Table of contents
</button>


<div id="ToCInformation" class="z-10 hidden rounded shadow bg-slate-700 border border-slate-800">
  <div class="px-4 py-4 text-sm text-white">
    <pre class="overflow-auto bg-slate-800 px-2" style="max-height: 50vh;">
      {toc}
    </pre>
  </div>

  <div class="flex items-center mx-4 mb-4 text-white">
    <!-- <button on:click={() => {copy = copyToClipboard()}} class='inline-flex items-center rounded bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-2 active:bg-indigo-800 text-sm border border-indigo-700' title="Copy to clipboard"> -->
    <Button on:click={() => {copy = copyToClipboard()}} corner={"rounded"} title="ddd">
      <Clipboard></Clipboard>
      &nbsp;Copy
    </Button>
    <!-- </button> -->
      {#await copy}
          <p class="ml-2">☑️ Copied</p>
      {/await}
  </div>
</div>