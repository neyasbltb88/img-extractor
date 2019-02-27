import download from 'downloadjs';

class SVGCollector {
    constructor(params = {}) {
        this.container = params.container ? document.querySelector(params.container) : document;
        this.name_prefix = (params.rename && params.rename.prefix) ? params.rename.prefix : '';
        this.name_suffix = (params.rename && params.rename.suffix) ? params.rename.suffix : '';
        this.name_ext = 'svg';
        this.name_index = 0;

        this.svg_elems = null;
        this.svg_items = {};

        this.mime_type = {
            svg: 'image/svg+xml'
        }


        this.init();
    }

    _collectItems() {
        this.svg_elems.forEach(elem => {
            let name;

            if (elem.id) {
                name = elem.id;
            } else if (elem.classList.value !== '') {
                name = elem.classList.value;
            } else {
                name = this.name_index++;
            }

            this.svg_items[this.name_prefix + name + this.name_suffix + '.' + this.name_ext] = elem.outerHTML;
        });
    }

    downloadAll() {
        for (const item in this.svg_items) {
            download(this.svg_items[item], item, this.mime_type[this.name_ext])
        }
    }

    init() {
        this.svg_elems = this.container.querySelectorAll('svg');
        console.log(this.svg_elems);

        this._collectItems();

        this.downloadAll();
    }
}

window.svgCollector = new SVGCollector({
    // container: '.item.first',
    rename: {
        // prefix: 'pref_',
        // suffix: '_suf'
    }
});