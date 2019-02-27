function prepareSelector(selector) {
    return selector.replace(/([\.\#])/gmi, '\\$1');
}

function scopeSelector(selector, str) {
    if (selector === prepareSelector(selector)) {
        return {
            input: str,
            selector: str
        }
    }
    let input = str;
    let reg_str = `(?:^|[^\\ \\t])(${prepareSelector(selector)})(?=$|[\\s\\.\\#>])`;
    let regex = new RegExp(reg_str, 'gm');

    let match, matches, str_before, str_after, lastIndex;
    while ((match = regex.exec(str)) !== null) {
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        matches = match.slice();

        lastIndex = regex.lastIndex;
        str_before = str.slice(0, regex.lastIndex - match[1].length);
        str_after = str.slice(regex.lastIndex);

        str = str_before + match[1].replace(regex, '$1' + id) + str_after;
        regex.lastIndex += id.length;
    }

    return {
        input: input,
        regex: regex,
        selector: str,
        str_before: str_before,
        str_after: str_after,
        matches: matches,
        lastIndex: lastIndex
    }
}

// console.log(scopeSelector(sel, str));


function test(selector, strings, id) {
    let browser, pre, code;
    try {
        if (window && document) {
            browser = true;
            pre = document.createElement('pre');
            pre.id = 'test_results';
            code = document.createElement('code');
            code.className = 'language-json';
            pre.appendChild(code);
            document.body.appendChild(pre);
        }
    } catch (err) {
        browser = false;
    }

    let test_counter = 0,
        test_pass = 0;
    for (let str in strings) {
        test_counter++;
        let result = scopeSelector(selector, str);
        if (result.selector === strings[str]) {
            test_pass++;
            let test_result = `[Pass ${test_counter}] [selector: ${selector}] (${result.input} -> ${result.selector})`

            if (browser) {
                code.textContent += test_result + '\n';
                console.log(test_result, result);
            } else {
                console.log(test_result);
            }
        } else {
            let test_result = `[-Fail ${test_counter}-] [selector: ${selector}] (${result.input} -> ${result.selector})`;
            let separator = '-'.repeat(test_result.length);
            console.log(separator);
            console.log(test_result);
            console.log(result);
            console.log(separator);

            if (browser) {
                code.textContent += separator + '\n';
                code.textContent += test_result + '\n';
                code.textContent += JSON.stringify(result, ' ', 4) + '\n';
                code.textContent += separator + '\n';
            }
        }
    }

    let tests_result = `| Tests: ${test_pass}/${test_counter} |`;
    let separator = '-'.repeat(tests_result.length);
    console.log(separator);
    console.log(tests_result);
    console.log(separator);

    if (browser) {
        code.textContent += separator + '\n';
        code.textContent += tests_result + '\n';
        code.textContent += separator + '\n';
    }


}


// --------------------------------------
let str = '.test';
// let str = '.test3.test2.test';
// let str = '.test3.test.test2';

let sel = '.test';
let sel2 = '#test';
let sel3 = 'test';

// console.log(sel + ' -> ', prepareSelector(sel));
// console.log(sel2 + ' -> ', prepareSelector(sel2));
// console.log(sel3 + ' -> ', prepareSelector(sel3));

let id = '[data-scope="qwe"]';

const strings1 = {
    '.test': `.test${id}`,
    '.test3.test2.test': `.test3.test2.test${id}`,
    '.test3.test.test2': `.test3.test${id}.test2`,
    '.test#test ': `.test${id}#test `,
    '#test.test ': `#test.test${id} `,
    '.test > .test2': `.test${id} > .test2`,
    '.test>.test2': `.test${id}>.test2`,
    '.test .test2': `.test${id} .test2`,
    '.test  .test ': `.test${id}  .test `,
    '.test  .test': `.test${id}  .test`,
    '.test3  .test.test2': `.test3  .test.test2`,
}

const strings2 = {
    '.test': `.test`,
    '.test3.test2.test': `.test3.test2.test`,
    '.test3.test.test2': `.test3.test.test2`,
    '.test#test ': `.test#test${id} `,
    '#test.test ': `#test${id}.test `,
    '.test > .test2': `.test > .test2`,
    '.test>.test2': `.test>.test2`,
    '.test .test2': `.test .test2`,
    '.test  .test ': `.test  .test `,
    '.test  .test': `.test  .test`,
    '.test  #test': `.test  #test`,
    '#test  .test': `#test${id}  .test`,
    '.test3  .test.test2': `.test3  .test.test2`,
}

const strings3 = {
    '.test': `.test`,
    '.test3.test2.test': `.test3.test2.test`,
    '.test3.test.test2': `.test3.test.test2`,
    'test#test ': `test#test `,
    '#test.test ': `#test.test `,
    'test > .test2': `test > .test2`,
    'test>.test2': `test>.test2`,
    '.test .test2': `.test .test2`,
    'test  .test ': `test  .test `,
    '.test  .test': `.test  .test`,
    '.test  #test': `.test  #test`,
    '#test  test': `#test  test`,
    '.test3  .test.test2': `.test3  .test.test2`,
}

const strings4 = {
    '.test': `.test`,
    '.test3.test2.test': `.test3.test2.test`,
    '.test3.test.test2': `.test3.test.test2`,
    'test#test ': `test#test `,
    '#test.test ': `#test.test `,
    'test > .test2': `test > .test2`,
    'test>.test2': `test>.test2`,
    '.test .test2': `.test .test2`,
    'test  .test ': `test  .test `,
    '.test  .test': `.test  .test`,
    '.test  #test': `.test  #test`,
    '#test  test': `#test  test`,
    '.test3  .test.test2': `.test3  .test.test2`,
    '.test.test1': `.test.test1${id}`,
    '.test.test1.test2': `.test.test1${id}.test2`,
    '.test.test1 .test2': `.test.test1${id} .test2`,
    '.test0.test.test1 .test2': `.test0.test.test1${id} .test2`,
    '.test0 .test.test1 .test2': `.test0 .test.test1 .test2`,
}

let sel4 = '.test.test1';

// console.log(strings);
// --------------------------------------


test(sel, strings1, id);
test(sel2, strings2, id);
test(sel3, strings3, id);
test(sel4, strings4, id);