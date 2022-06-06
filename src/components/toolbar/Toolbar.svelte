<script>
    import { createEventDispatcher } from 'svelte';

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

    import InfoCircle from 'svelte-bootstrap-icons/lib/InfoCircle';
    import QuestionCircle from 'svelte-bootstrap-icons/lib/QuestionCircle';

    import Button from './Button.svelte';
    import ButtonGroup from './ButtonGroup.svelte';
    import ToCDropdown from './ToCDropdown.svelte';
    import Dropdown from './Dropdown.svelte';
    import CommandMenu from './CommandMenu.svelte';

    const dispatch = createEventDispatcher();
</script>

<!-- <div class="flex justify-left mt-4 mb-2 mx-2 flex-wrap"> -->
<div class="flex flex-wrap mt-4 mb-2 mx-2">
    <ButtonGroup>
        <Button on:click={() => dispatch('bold')} title='Bold - Ctrl+B' corner={'rounded-l'} ><TypeBold/></Button>
        <Button on:click={() => dispatch('italic')} title='Italic - Ctrl+I'><TypeItalic/></Button>
        <Button on:click={() => dispatch('underline')} title='Italic - Ctrl+U'><TypeUnderline/></Button>
        <Button on:click={() => dispatch('strikethrough')} title='Strikethrough - Ctrl+Alt+S' corner={'rounded-r'}><TypeStrikethrough/></Button>
    </ButtonGroup>
    <ButtonGroup>
        <Button on:click={() => dispatch('h1')} title='Header 1 - Ctrl+Alt+1' corner={'rounded-l'}><TypeH1/></Button>
		<Button on:click={() => dispatch('h2')} title='Header 2  - Ctrl+Alt+2' corner={'rounded-r'}><TypeH2/></Button>
    </ButtonGroup>

    <ButtonGroup>
        <Button on:click={() => dispatch('unorderedList')} title='Unordered list' corner={'rounded-l'}><ListUl/></Button>
		<Button on:click={() => dispatch('orderedList')} title='Ordered list' corner={'rounded-r'}><ListOl/></Button>
    </ButtonGroup>

    <ButtonGroup>
        <Button on:click={() => dispatch('inlineCode')} title='Inline Code' corner={'rounded-l'}><Code/></Button>
		<Button on:click={() => dispatch('codeBlock')} title='Code block' corner={'rounded-r'}><CodeSquare/></Button>
    </ButtonGroup>

    <!-- <ButtonGroup>
        <Button on:click={() => dispatch('pvmeSpreadsheet')} title='PVME Spreadsheet' corner={'rounded'}><Table/></Button>
    </ButtonGroup> -->

    <ButtonGroup>
        <ToCDropdown></ToCDropdown>
    </ButtonGroup>

    <ButtonGroup>
        <!-- <Button on:click={() => dispatch('debug')} title='PVME Spreadsheet' corner={'rounded'}>Command ▼</Button> -->
        <!-- <Dropdown></Dropdown> -->
        <CommandMenu {dispatch}></CommandMenu>
    </ButtonGroup>

    <ButtonGroup>
        <!-- <Button on:click={() => dispatch('debug')} title='PVME Spreadsheet' corner={'rounded'}>Template ▼</Button> -->
        <Dropdown></Dropdown>
    </ButtonGroup>

    

    <div class="inline-flex rounded-md shadow-sm mb-2 mx-2 ml-auto" role="group">
        <Button on:click={() => dispatch('debug')} corner={'rounded-l'}><QuestionCircle/></Button>
        <Button on:click={() => dispatch('debug')} corner={'rounded-r'}><InfoCircle/></Button>
    </div>
</div>
