/**
 * @param {string|string[]|{title?: string, pages: string|string[]}} _content
 * @returns {{title: string, html: string}}
 */
function parseContent(_content) {
    var result;
    const converter = new showdown.Converter();
    if (typeof _content === 'string') {
        const html = _content.trim() !== '' ? converter.makeHtml(_content) : converter.makeHtml('# Empty Document');
        result = {title: 'Untitled', html: `<div class="slide slide_0">${html}</div>`}
    }
    else if (isStringArray(_content)) {
        result = {
            title: 'Untitled',
            html: _content.map((v, i)=>{
                const html = v.trim() !== '' ? converter.makeHtml(v) : converter.makeHtml('# Empty Slide');
                return `<div class="slide slide_${i}">${html}</div>`
            }).join('')
        }
    }
    else if (_content instanceof Object) {
        result = {
            title: _content.title || 'Untitled',
            html: _content.pages.trim() !== '' ? parseContent(_content.pages).html : parseContent('# Empty Document').html
        }
    }
    return result;
}
function isStringArray(_array) {
    if (!(_array instanceof Array)) {return false}
    else {
        var onlyStrings = true;
        _array.forEach(v=>typeof v === 'string' ? '' : onlyStrings = false)
        return onlyStrings
    }
}


const hash = window.location.hash;
var content;
if (hash === '') {content = ''}
else {
    try {
        const json = atob(hash.slice(1));
        console.log(json);
        try {content = JSON.parse(json)}
        catch {content = '# Invalid hash value : Unable to parse JSON'}
    }
    catch {content = '# Invalid hash value. Please make sure it\'s encoded in base64.'}
}
const parsedContent = parseContent(content);
document.querySelector('.slides-container').innerHTML = parsedContent.html;
document.querySelector('title').textContent = parsedContent.title;

hljs.highlightAll();