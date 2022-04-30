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

    import GroupButton from './GroupButton.svelte';
    import ButtonGroup from './ButtonGroup.svelte';

    const dispatch = createEventDispatcher();
</script>

<div class="flex justify-left mt-4 mb-2 mx-2 flex-wrap">
    <ButtonGroup>
        <GroupButton on:click={() => dispatch('bold')} title='Bold - Ctrl+B' corner={'rounded-l'} ><TypeBold/></GroupButton>
        <GroupButton on:click={() => dispatch('italic')} title='Italic - Ctrl+I'><TypeItalic/></GroupButton>
        <GroupButton on:click={() => dispatch('underline')} title='Italic - Ctrl+U'><TypeUnderline/></GroupButton>
        <GroupButton on:click={() => dispatch('strikethrough')} title='Strikethrough - Ctrl+Alt+S' corner={'rounded-r'}><TypeStrikethrough/></GroupButton>
    </ButtonGroup>

    <ButtonGroup>
        <GroupButton on:click={() => dispatch('h1')} title='Header 1' corner={'rounded-l'}><TypeH1/></GroupButton>
		<GroupButton on:click={() => dispatch('h2')} title='Header 2' corner={'rounded-r'}><TypeH2/></GroupButton>
    </ButtonGroup>

    <ButtonGroup>
        <GroupButton on:click={() => dispatch('debug')} corner={'rounded-l'}><ListUl/></GroupButton>
		<GroupButton on:click={() => dispatch('debug')} corner={'rounded-r'}><ListOl/></GroupButton>
    </ButtonGroup>

    <ButtonGroup>
        <GroupButton on:click={() => dispatch('debug')} title='Inline Code' corner={'rounded-l'}><Code/></GroupButton>
		<GroupButton on:click={() => dispatch('debug')} corner={'rounded-r'}><CodeSquare/></GroupButton>
    </ButtonGroup>

    <ButtonGroup>
        <GroupButton on:click={() => dispatch('generateToC')} corner={'rounded'}>Generate table of contents</GroupButton>
    </ButtonGroup>
</div>


