import Download from 'downloadjs';
import ImgExtractorInterface from './interface'

export default class ImgExtractor {
    constructor(params = {}) {
        this.container = params.container ? document.querySelector(params.container) : document;
        this.name_prefix = (params.rename && params.rename.prefix) ? params.rename.prefix : '';
        this.name_suffix = (params.rename && params.rename.suffix) ? params.rename.suffix : '';
        this.default_name_ext = 'svg';
        this.name_index = 0;

        this.autodownload = params.autodownload;

        this.elems = {};
        this.items = [];

        this.mime_type = {
            svg: 'image/svg+xml',
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            tiff: 'image/tiff',
            webp: 'image/webp',
        }

        this.interface = null;


        this.init();
    }

    _getTypeFilter() {
        let filter = {};

        for (let type in this.elems) {
            filter[type] = true;
        }

        return filter;
    }

    _buildName(elem, ext = this.default_name_ext) {
        let name = '';

        if (elem.id) {
            name = elem.id;
        } else if (elem.classList.value !== '') {
            name = elem.classList.value;
        } else {
            name = this.name_index++;
        }

        return `${this.name_prefix}${name}${this.name_suffix}.${ext}`;
    }

    // Метод, собирающий инлайновые svg со страницы
    _collectInlineSvg() {
        let ext = 'svg';
        this.elems[ext] = this.container.querySelectorAll('svg');

        this.elems[ext].forEach(elem => {
            let item = {};

            item.name = this._buildName(elem, ext);
            item.content = elem.outerHTML;
            item.ext = ext;

            this.items.push(item);
        });
    }

    // Метод загрузки всех собранных картинок
    downloadAll() {
        this.items.forEach(item => {
            Download(item.content, item.name, this.mime_type[item.ext]);
        })
    }

    // Метод получения элементов, содержащих картинки
    getElements() {
        return this.elems;
    }

    // Метод получения айтомов, содержащих объекты картинок, подготовленные к загрузке
    getItems() {
        return this.items;
    }

    init() {
        // Запуск сбора инлайновых svg
        this._collectInlineSvg();


        // Если автоматический запуск скачивания всех найденных картинок включен,
        if (this.autodownload) {
            // то просто скачиваем их
            this.downloadAll();

            // Если автоматическое скачивание выключено, 
        } else {
            // То инициализируем интерфейс
            this.interface = new ImgExtractorInterface({
                layout_id: 'img_extractor_interface',
                items: this.getItems(),
                filter: this._getTypeFilter(),
            });

            console.log(this.interface);

        }

    }
}