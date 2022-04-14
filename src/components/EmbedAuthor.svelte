<!-- <script>
    export let name, url, icon_url;
    let authorName;

    $: if (name) {
        if (url) {
            authorName = <Link href={url} className='embed-author-name'>{name}</Link>;
        }
    }

    function extractRGB(i) {
        return {
            r: (i >> 16) & 0xFF,
            g: (i >> 8) & 0xFF,
            b: i & 0xFF,
        };
    }
</script>

<div class='embed-color-pill' style="backgroundColor: {computed !== undefined ? computed : ''}"/> -->