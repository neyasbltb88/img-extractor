window.style = {
    'body': {
        'margin': '30px 0',
        'background-color': '#555',
    },

    '.container': {
        margin: '0 auto',
        backgroundColor: '#dedede',
        boxShadow: '0 0 20px 0px rgba(0, 0, 0, 0.5)',
        maxWidth: '1100px',
        padding: '15px',
        borderRadius: '3px',
    },

    '.inline': {
        display: 'inline-block',
        margin: 0,
        padding: 0,
    },

    'h2, h3': {
        textAlign: 'center'
    },

    '.rich_h3': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    '.section': {
        marginBottom: '15px',
        padding: '15px',
    },

    '.section:last-child': {
        marginBottom: 0,
    },

    '.pre_block': {
        border: '1px solid #bbb',
        borderRadius: '3px',
        padding: '1em',
        margin: '.5em 0',
        overflow: 'auto',
        boxShadow: '0 0 8px 0px rgba(0, 0, 0, 0.1)',
        maxHeight: '100vh',
        overflowY: 'auto',
    },

    'pre.inline': {
        display: 'inline-block',
        padding: '0 5px',
    },

    '.language-json .token.operator, .language-javascript .token.operator': {
        background: 'transparent',
    },
}


//////////////////////////////////////

const CssInJson = new CSSinJSON({
    // style: style,
    style: JSON.stringify(style),
    // scopedElem: 'body',
    // scopedElem: '.container',
    // scopedElem: '.section',
    scopedElem: ['.container', 'body'],
    // scopedElem: ['.section', 'body'],
    // scopedElem: '.section_2',
});


//////////////////////////////////////
let style_info = document.querySelector('.style_info');
let CSSinJSON_style = document.querySelector('.CSSinJSON_style');
let style_show = document.querySelector('.style_show');
let json_show = document.querySelector('.json_show');
let base_selector = document.querySelector('.base_selector')

style_info.textContent = `<style id="${CSSinJSON_style.id}" class="${CSSinJSON_style.className}"></style>`;
style_show.textContent = CSSinJSON_style.textContent;

json_show.textContent = JSON.stringify(window.style, ' ', 4);

let selectors = '';
CssInJson.elems_selector.forEach(sel => {
    selectors = (sel !== '') ? selectors += sel + ', ' : selectors;
});

selectors = selectors.slice(0, -2);

base_selector.textContent = selectors || 'Не указан';
//////////////////////////////////////

const CssInJson2 = new CSSinJSON({
    style: {
        '.scoped_class, .scoped_class2': {
            paddingLeft: '30px'
        },
        '.test': {
            color: 'red'
        },
        '.test:before, .test:after': {
            content: '" *** "',
        }
    },
    // style: { ".test": { "color": "red" } },
    scopedElem: ['.scoped_class', '.scoped_class2']
});

let test_result_style = document.querySelector('.test_result_style');
let test_style = document.querySelector('#' + CssInJson2.scopedId);
test_result_style.textContent = `<style id="${CssInJson2.scopedId}" class="CSSinJSON_style">
${test_style.textContent}</style>`

let test_result_html = document.querySelector('.test_result_html');
let test_scoped = document.querySelector('.test_scoped');
test_result_html.textContent = test_scoped.innerHTML;




// --- ВК Скачивание картинки при клике по ссылке ---
let download_link = document.querySelector('.download_link');
download_link.addEventListener('click', e => {
    e.preventDefault();
    let href = e.target.href;
    console.log(href);

    // let headers = new Headers({
    //     "Content-Type": "application/octet-stream",
    // });

    fetch(href, {
            mode: 'cors',
        })
        .then(res => {
            let ct = res.headers.get("content-type");
            console.log(ct);

            console.log(res);

            // let bl = new Blob([res.body], { type: 'application/octet-stream' });
            // console.log(bl);

            // return res.blob();
            return res.arrayBuffer();
        })
        .then(res => {
            // saveAs(res, "hello world.jpg");
            // console.log(res);

            let bl = new Blob([res], { type: 'application/octet-stream' });
            console.log(bl);


            // saveAs(bl, "12");
            window.saveAs(bl, "test_file", false);

            // let objectURL = URL.createObjectURL(bl);
            // // let objectURL = URL.createObjectURL(res);
            // let img = new Image();
            // img.src = objectURL;
            // let img_container = document.querySelector('.img_container');
            // img_container.appendChild(img);

            // let download_img = document.querySelector('.download_img');
            // download_img.href = objectURL;
            // download_img.setAttribute('download', '');
            // download_img.click();
        })
        .catch(err => {
            console.log(err);
        })


    return false;
})