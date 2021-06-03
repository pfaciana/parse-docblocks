# Parse DocBlocks
A lightweight DocBlock parser. Can work with both PHPDoc and JSDoc style docblocks. Attempts to clean up improperly formatted DocBlocks as best as it can. Can be used in Node and in the browser (MS Edge support starting with version 79).

## Example Use

```js

const parseComments = require('parse-docblocks')

const input = `
/**
 * Summary
 *
 * Description Line 1
 * Description Line 2
 *
 * Description Line 3
 *
 * @param string $name Name. Default 'post'.
 * @return bool true on success
 */`;

const output = parseComments(input, {
    prefixPragmas: true, // Should `tagName` in the output keep the pragma prefix `@` or strip it out
    prefixVariables: true, // Should `name` in the output keep the prefix '$' or strip it out
    defaultObj: true, // If the @param or @type pragma includes nested values, should those be converted to a default object value
    typeToArray: true, // Should types be split on pipes (|) into array values, i.e bool|int => ["bool", "int"]
});

```

### JSON Output

```json
{
    "summary": "Summary",
    "description": "Description Line 1 Description Line 2\n\nDescription Line 3",
    "tags": [
        {
            "tagName": "@param",
            "type": ["string"],
            "name": "$name",
            "desc": "Name",
            "optional": false,
            "defaultValue": "post",
        },
        {
            "tagName": "@return",
            "type": ["bool"],
            "name": null,
            "desc": "true on success"
        }
    ]
}
```