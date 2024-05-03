/**
 * @param {string|string[]|{title?: string, pages: string|string[]}} _content
 * @returns {{title: string, html: string}}
 */
function parseContent(_content) {
    var result;
    const converter = new showdown.Converter();
    if (typeof _content === 'string') {
        const html = _content.trim() !== '' ? converter.makeHtml(_content) : converter.makeHtml('# Empty Document');
        if (_content.trim().startsWith("'use title';")) {
            const slicedContent = _content.trim().slice(13).trim();
            const html = slicedContent !== '' ? converter.makeHtml(slicedContent) : converter.makeHtml('# Empty Document');
            result = {title: 'Untitled', html: `<div class="slide slide_title slide_0 current">${html}</div>`}
        }
        else {
            const html = _content !== '' ? converter.makeHtml(_content) : converter.makeHtml('# Empty Document');
            result = {title: 'Untitled', html: `<div class="slide slide_0 current">${html}</div>`}
        }
    }
    else if (isStringArray(_content)) {
        result = {
            title: 'Untitled',
            html: _content.map((v, i)=>{
                if (v.trim().startsWith("'use title';")) {
                    const slicedContent = v.trim().slice(13).trim();
                    const html = slicedContent !== '' ? converter.makeHtml(slicedContent) : converter.makeHtml('# Empty Document');
                    return `<div class="slide slide_title slide_${i} ${i===0?'current':''}">${html}</div>`
                }
                else {
                    const html = v.trim() !== '' ? converter.makeHtml(v) : converter.makeHtml('# Empty Slide');
                    return `<div class="slide slide_${i} ${i===0?'current':''}">${html}</div>`
                }
            }).join('')
        }
    }
    else if (_content instanceof Object) {
        result = {
            title: _content.title || 'Untitled',
            html: typeof _content === "string" && _content.pages.trim() === '' ? parseContent('# Empty Document').html : parseContent(_content.pages).html
        }
    }
    return result;
}
/**
 * @param {*} _array
 * @return {_array is string[]}
 */
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

var currentPage = 0;
var pageCount = document.querySelectorAll('.slide').length;

const wait = ms => new Promise(resolve=>setTimeout(resolve, ms));

/**
 * @param {KeyboardEvent} e
 */
async function showNextSlide(e) {
    e.preventDefault();
    if (currentPage < pageCount - 1) {
        currentPage++;
        for (let i=0; i < 99; i++) {await wait(.5); document.querySelector(`.slide.slide_${currentPage-1}`).style.marginLeft = '-'+i+'vw'}
        document.querySelector(`.slide.slide_${currentPage-1}`).classList.remove('current');
        document.querySelector(`.slide.slide_${currentPage-1}`).style.marginLeft = 'unset';
        document.querySelector(`.slide.slide_${currentPage}`).classList.add('current');
    }
}
/**
 * @param {KeyboardEvent} e
*/
async function showPreviousSlide(e) {
    e.preventDefault();
    if (currentPage > 0) {
        currentPage--;
        for (let i=0; i < 99; i++) {await wait(.5); document.querySelector(`.slide.slide_${currentPage+1}`).style.marginLeft = i+'vw'}
        document.querySelector(`.slide.slide_${currentPage+1}`).classList.remove('current');
        document.querySelector(`.slide.slide_${currentPage+1}`).style.marginLeft = 'unset';
        document.querySelector(`.slide.slide_${currentPage}`).classList.add('current');
    }
}

document.addEventListener('keyup', e=>{
    if (e.key === ' ') {e.shiftKey ? showPreviousSlide(e) : showNextSlide(e)}
    else if (e.key === 'ArrowUp') {showPreviousSlide(e)}
    else if (e.key === 'ArrowRight') {showNextSlide(e)}
    else if (e.key === 'ArrowDown') {showNextSlide(e)}
    else if (e.key === 'ArrowLeft') {showPreviousSlide(e)}
    else {console.log(e.key)}
});