import '../libs/CSSinJSON/app/js/css-in-json';
import ImgExtractorInterfaceTemplates from './interface-templates';

// TODO: По возможности реализовать два метода:
// setItems и setFilter, их будет вызывать основной класс при переинициализации
// Но может быть проще будет убивать интерфейс полностью и создавать новый

export default class ImgExtractorInterface {
    constructor(params = {}) {
        let that = this;

        this.layout_id = params.layout_id;
        this.items = params.items;
        this._filter = params.filter;

        this.filter_attr = 'imgextractorfilter';
        this.list_item_slected = 'selected';
        this.list_item_id = 'imgextractorid';

        this.parts = {
            layout: null,
            header: null,
            content: null,
            filter: null,
            list: null
        };

        this.cssinjs = null;
        this.template = new ImgExtractorInterfaceTemplates();

        this.state = {
            // Показан/скрыт интерфейс
            _opened: true,
            set opened(val) {
                if (typeof val === 'boolean') {
                    this._opened = val;
                    if (that.parts.layout) {
                        val ? that.parts.layout.classList.remove('close') :
                            that.parts.layout.classList.add('close');
                    }
                }
            },
            get opened() {
                return this._opened;
            },

            // Количество выбранных айтомов
            _selected_items: 0,
            set selected_items(val) {
                if (typeof val === 'number' && val >= 0 && val <= this._total_items) {
                    this._selected_items = val;

                    // TODO: Тут надо запускать рендер количества айтемов для шапки
                    that._renderDownloadCounter();
                }
            },
            get selected_items() {
                return this._selected_items;
            },

            // Всего айтемов
            _total_items: 0,
            set total_items(val) {
                if (typeof val === 'number' && val >= 0) {
                    this._total_items = val;

                    // TODO: Тут надо запускать рендер количества айтемов для шапки
                    that._renderDownloadCounter();
                }
            },
            get total_items() {
                return this._total_items;
            }

        };


        // Точка входа
        this.init();
    }

    _totalCounter() {
        this.state.total_items = this.items.length;
    }

    _selectedCounter() {
        let count = 0;
        this.items.forEach(item => {
            if (item.selected && this._filter[item.ext]) {
                count++;
            }
        });

        this.state.selected_items = count;
    }

    _renderDownloadCounter() {
        let counter_wrap = this.parts.header.querySelector('.download_counter');

        counter_wrap.innerHTML = this.template.getDownloadCounterTemplate({
            selected: this.state.selected_items,
            total: this.state.total_items
        });
    }

    // TODO: Доделать метод выбора айтема
    _handlerListItemSelect(item) {
        // item.classList.toggle(this.list_item_slected);
        // получаем из атрибута ID айтема
        let item_id = +item.dataset[this.list_item_id];
        // По ID находим индекс айтема в массиве
        let item_index = this.items.findIndex(item => item.id === item_id);

        // Меняем значение свойства selected у айтема
        this.items[item_index].selected = !this.items[item_index].selected;

        // Отображаем состояние selected в виде класса на айтеме
        if (this.items[item_index].selected) {
            item.classList.add(this.list_item_slected);
        } else {
            item.classList.remove(this.list_item_slected);
        }

        // TODO: Здесь надо будет вызывать фильтрацию выбранных айтомов
        this._selectedCounter();
    }

    _makeList() {
        this.parts.list = document.createElement('div');
        this.parts.list.className = 'list_wrap';

        this.parts.content.appendChild(this.parts.list);
    }

    _renderListItems(category) {
        let items = this.items.filter(item => item.ext === category);

        items.forEach(item => {
            let list_item = document.createElement('div');
            list_item.className = `list_item ${item.selected ? this.list_item_slected : ''}`;
            list_item.dataset[this.list_item_id] = item.id;
            list_item.innerHTML = this.template.getListItem(item);

            list_item.addEventListener('click', e => {
                this._handlerListItemSelect(e.currentTarget);
            });

            this.parts.list.appendChild(list_item);
        });
    }

    _clearListItems() {
        this.parts.list.innerHTML = '';
    }

    listRender(filter_name, clear = true) {
        if (clear) this._clearListItems();

        if (filter_name && this._filter[filter_name]) {
            this._renderListItems(filter_name);
        } else if (!filter_name) {
            this._clearListItems();

            for (let category in this._filter) {
                if (this._filter[category]) {
                    this._renderListItems(category);
                }
            }
        }

    }

    // Метод, создающий блок с кнопками фильтра
    _makeFilter() {
        this.parts.filter = document.createElement('div');
        this.parts.filter.className = 'filter_wrap';

        // Создаем кнопки по объекту фильтра
        for (let filter_name in this._filter) {
            let btn = this.template.getFilterBtnTemplate(filter_name, this.filter_attr);

            // Вешаем на полученные кнопки обработчик переключения фильтра
            btn.addEventListener('click', e => {
                let elem = e.currentTarget;
                let res = this.filter(elem.dataset[this.filter_attr]);
                res ? elem.classList.add('active') : elem.classList.remove('active')
            });

            // Добавляем кнопку в контейнер
            this.parts.filter.appendChild(btn);
        }

        // вставляем контейнер фильтра в интерфейс
        this.parts.content.appendChild(this.parts.filter);
    }

    // Метод для изменения состояния фильтра
    filter(name, val) {
        if (val && typeof val === 'boolean') {
            this._filter[name] = val;
        } else if (val === undefined) {
            this._filter[name] = !this._filter[name];
        }

        // TODO: Тут надо будет запускать рендер фильтрации
        this.listRender();
        this._selectedCounter();

        return this._filter[name];
    }

    // Метод для сворачивания/разворачивания интерфейса
    openToggle(e) {
        this.state.opened = !this.state.opened;

        if (e && this.state.opened) {
            e.currentTarget.setAttribute('title', 'Свернуть ImgExtractor');
        } else if (e && !this.state.opened) {
            e.currentTarget.setAttribute('title', 'Развернуть ImgExtractor');
        }
    }

    // Метод создания контейнера интерфейса
    _makeLayout() {
        this.parts.layout = document.createElement('div');
        this.parts.layout.id = this.layout_id;
        this.parts.layout.innerHTML = this.template.getLayoutTemplate();

        // Сохраним в свойства шапку и контент интерфейса
        this.parts.header = this.parts.layout.querySelector('.interface_header');
        this.parts.content = this.parts.layout.querySelector('.interface_content');

        // Вешаем обработчик на кнопку сворачивания/разворачивания интерфейса
        this.parts.layout.querySelector('.interface_hide').addEventListener('click', e => {
            this.openToggle(e);
        });

        document.body.appendChild(this.parts.layout);
    }

    init() {
        // Создать контейнер интерфейса
        this._makeLayout();

        // Отобразим счетчик выбранных айтемов
        this._totalCounter();
        this._selectedCounter();

        // Создаем блок фильтра
        this._makeFilter();

        // Создаем блок списка изображений
        this._makeList();

        // Заполняем блок списка айтемами
        this.listRender();


        // Добавить стили интерфейса на страницу, всегда в конце
        this.cssinjs = new CSSinJSON({
            style: this.template.getCommonStyle({
                layout_id: '#' + this.layout_id,
                list_item_slected: '.' + this.list_item_slected
            }),
            scopedElem: '#' + this.layout_id
        });
    }

}