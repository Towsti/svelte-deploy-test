<script>
    export let url;

    $: urlHTML = urlToHTML(url);

    function urlToHTML(url) {
        if (url.match(/https?:\/\/i?\.?imgur\.com\/([a-zA-Z0-9]+)\.png/))
            return `<img class='media' src='${url}'>`;
        
        if (url.match(/https?:\/\/i?\.?imgur\.com\/([a-zA-Z0-9]+)\.jpg/))
            return `<img class='media' src='${url}'>`;
        
        if (url.match(/https?:\/\/i?\.?imgur\.com\/([a-zA-Z0-9]+)\.mp4/))
            return `<video class='media' controls><source src='${url}' type='video/mp4' />`;
    }
</script>

{@html urlHTML}