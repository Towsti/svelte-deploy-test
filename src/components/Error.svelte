<script>
    export let error;

    function formatErrorLine(line) {
        return line[0] === line[1] ? `line: ${line[0]}` : `lines: ${line.join('-')}`;
        // return line[0] === line[1] ? line[0] : line.join('-');
    }

    function formatErrorEmoji(errorType) {
        let emoji = '';
        switch (errorType) {
            case 'error': 
                emoji = '❌';
                break;
            case 'warn':
            case 'warning':
                emoji = '⚠';
                break;
            default:
                emoji = errorType;
        }
        return emoji;
    }
</script>

<!-- todo: individual line, type, text variable -->
<!-- {@html formatErrorEmoji(error.type)} {formatErrorLine(error.line)} - {error.text}<br> -->

<tr>
    <!-- <td>{@html formatErrorEmoji(error.type)}</td>
    <td>{formatErrorLine(error.line)}</td>
    <td>{error.text}</td> -->
    <td>{formatErrorLine(error.line)}</td>
    <td>{@html formatErrorEmoji(error.type)} {error.text}</td>
</tr>
