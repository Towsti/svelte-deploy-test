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

    import Button from './Button.svelte';
    import ButtonGroup from './ButtonGroup.svelte';
    import ToCDropdown from './ToCDropdown.svelte';
    import TemplateMenu from './TemplateMenu.svelte';
    import CommandMenu from './CommandMenu.svelte';
    import Help from './Help.svelte';
    import Info from './Info.svelte';
    import ToggleView from './ToggleView.svelte';

    const dispatch = createEventDispatcher();
</script>

<div class="flex flex-wrap mt-4 mb-2 mx-2">
    <ButtonGroup>
        <Button on:click={() => dispatch('bold')} title='Bold - Ctrl+B' corner='rounded-l' ><TypeBold/></Button>
        <Button on:click={() => dispatch('italic')} title='Italic - Ctrl+I'><TypeItalic/></Button>
        <Button on:click={() => dispatch('underline')} title='Italic - Ctrl+U'><TypeUnderline/></Button>
        <Button on:click={() => dispatch('strikethrough')} title='Strikethrough - Ctrl+Alt+S' corner='rounded-r'><TypeStrikethrough/></Button>
    </ButtonGroup>
    <ButtonGroup>
        <Button on:click={() => dispatch('h1')} title='Header 1 - Ctrl+Alt+1' corner='rounded-l'><TypeH1/></Button>
		<Button on:click={() => dispatch('h2')} title='Header 2  - Ctrl+Alt+2' corner='rounded-r'><TypeH2/></Button>
    </ButtonGroup>

    <ButtonGroup>
        <Button on:click={() => dispatch('unorderedList')} title='Unordered list' corner='rounded-l'><ListUl/></Button>
		<Button on:click={() => dispatch('orderedList')} title='Ordered list' corner='rounded-r'><ListOl/></Button>
    </ButtonGroup>

    <ButtonGroup>
        <Button on:click={() => dispatch('inlineCode')} title='Inline Code' corner='rounded-l'><Code/></Button>
		<Button on:click={() => dispatch('codeBlock')} title='Code block' corner='rounded-r'><CodeSquare/></Button>
    </ButtonGroup>

    <ButtonGroup>
        <CommandMenu {dispatch}></CommandMenu>
    </ButtonGroup>

    <ButtonGroup>
        <TemplateMenu></TemplateMenu>
    </ButtonGroup>

    <ButtonGroup>
        <ToCDropdown></ToCDropdown>
    </ButtonGroup>
    
    <ButtonGroup ml='auto'>
        <ToggleView {dispatch}/>
        <Help></Help>
        <Info></Info>
    </ButtonGroup>
</div>
