import Extend from './modules/extend';


class CSSinJSON {
    constructor(options = {}) {
        this.elems_selector = []; // Селекторы базовых элементов
        this.scoped_elems = []; // Сами базовые элементы
        this.scoped = false; // Флаг изоляции стилей
        this.style_obj = {}; // Объект стилей
        this.scopedId = ''; // Здесь будет сгенерированный id для изоляции стилей
        this.style_string = ''; // Здесь будут сгенерированные стили в виде строки
        this.indent = 4;


        this.Extend = Extend; // Плагин объединения объектов


        // Точка входа, принимает селектор(ы) базовых элементов
        this.init(options.scopedElem, options.style);
    }

    // Генератор рандомного числа
    rand(min, max) {
        let rand = Math.floor(min + Math.random() * (max + 1 - min));
        return rand;
    }

    // Конвертер camelCase в cebab-case
    camelToKebab(camel) {
        return camel.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    // TODO: разобраться с этим методом
    // Метод расширения стилей, пока работает не правильно
    extend(obj1, obj2) {
        this.style_obj = this.Extend(obj1, obj2);
        this.style_string = this.jsonToStyle(this.style_obj, this.scopedId);
        this.updateStyleInject(this.style_string, this.scopedId);

        return this.style_string;
    }

    // Вставка новых стилей в готовый элемент style
    updateStyleInject(style_content, scoped) {
        let stl = document.querySelector(`#${scoped}`);
        stl.textContent = style_content;
    }

    removeStyle(parent = document.head, scoped = this.scopedId) {
        let style_elem = document.querySelector(`#${scoped}`);
        if (style_elem) {
            parent.removeChild(style_elem);
            this.scoped_elems.forEach(elem => elem.removeAttribute('data-scoped'));
            return true;
        }

        return false;
    }

    addStyle() {
        let style_elem = document.querySelector(`#${this.scopedId}`);
        if (!style_elem) {
            this.injectStyle(this.style_string, document.head, 'CSSinJSON_style', this.scopedId);
            this.addScopedAttr(this.scoped_elems);
            return true;
        }

        return false;
    }

    // Создание нового элемента style и заполнение его атрибутами и стилями
    injectStyle(style_content = this.style_string, elem = document.head, class_name = 'CSSinJSON_style', scoped = this.scopedId) {
        let stl = document.createElement('style');
        stl.id = scoped;
        stl.className = class_name;
        stl.textContent = style_content;
        elem.appendChild(stl);
    }

    // Подготовка селектора к использованию в регулярке
    prepareSelector(selector) {
        return selector.replace(/([\.\#])/gmi, '\\$1');
    }

    // Метод обработки селекторов для scoped-режима
    // Если селектор соответствует базовому, к нему допишется атрибут scoped
    // Если селектор не соответствует базовому, то он будет наследоваться от атрибута scoped
    scopeSelector(selector, str, scoped_attr) {
        if (selector === this.prepareSelector(selector) && str !== 'body') {
            return `${scoped_attr} ${str}`;
        } else if (str === 'body') {
            return str;
        }
        let reg_str = `(?:^|[^\\ \\t])(${this.prepareSelector(selector)})(?=$|[\\s\\.\\#>])`;
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

            str = str_before + match[1].replace(regex, '$1' + scoped_attr) + str_after;
            regex.lastIndex += scoped_attr.length;
        }

        // console.log('lastIndex: ', lastIndex);
        str = (lastIndex === undefined) ? `${scoped_attr} ${str}` : str;


        return str;
    }

    // Метод для генерации селекторов с атрибутом scoped.
    // Разбирает несколько селекторов, указанных через запятую
    scopedSelectorGenerate(selector) {
        let regex = /(,\s*\n*\t*)/gm;
        let selector_arr = selector.split(regex).filter(selector => (selector.search(regex) === -1) ? true : false);
        let scoped_attr = `[data-scoped=${this.scopedId}]`;
        let new_selector = '';

        // Цикл по селекторам, указанным в стилях через запятую
        selector_arr.forEach(selector => {
            // Если надо генерировать изолированные стили
            if (this.scoped) {

                // Цикл по каждому базовому селектору
                let prev_inner_new_selector = '';
                this.elems_selector.forEach(scoped_elem => {
                    let inner_new_selector = '';
                    inner_new_selector = this.scopeSelector(scoped_elem, selector, scoped_attr) + ',\n';

                    // Проверка на то, чтобы не дублировались селекторы, если они совпадают во внутреннем цикле
                    if (prev_inner_new_selector !== inner_new_selector) {
                        new_selector += inner_new_selector;
                        prev_inner_new_selector = inner_new_selector;
                    }
                });

                // Если НЕ надо генерировать изолированные стили
            } else {
                new_selector += `${selector},\n`;
            }
        })

        return new_selector.slice(0, -2);
    }

    // Генерирует строковые стили для одного селектора
    objToStyle(selector, obj) {
        let style = '';
        for (let prop in obj) {
            style += `\n${' '.repeat(this.indent)}${this.camelToKebab(prop)}: ${obj[prop]};`
        }

        return `${this.scopedSelectorGenerate(selector)} {${style}\n}`;


    }

    // Генерирует полные стили по входящему объекту
    jsonToStyle(json) {
        let style = '';
        for (let selector in json) {
            style += this.objToStyle(selector, json[selector]) + '\n\n';
        }

        return style;
    }

    // Вешает на базовые элементы scoped-атрибут для изоляции стилей
    addScopedAttr(elems) {
        elems.forEach(elem => elem.dataset.scoped = this.scopedId)
    }

    // Находит все элементы, указанные в качестве базовых, собирает эти элементы и
    // их селекторы в соответствующие массивы 
    findScopedElems(selector) {
        let elems_of_selector;
        if (typeof selector === 'object') {
            selector.forEach(element => {
                this.elems_selector.push(element);
                elems_of_selector = document.querySelectorAll(element);
                if (elems_of_selector !== null) {
                    elems_of_selector.forEach(elem => {
                        // elem.dataset.scoped = this.scopedId;
                        this.scoped_elems.push(elem);
                    })
                }
            });
        } else if (typeof selector === 'string') {
            this.elems_selector.push(selector);
            elems_of_selector = document.querySelectorAll(selector);

            if (elems_of_selector !== null) {
                elems_of_selector.forEach(elem => {
                    // elem.dataset.scoped = this.scopedId;
                    this.scoped_elems.push(elem);
                })
            }
        }
    }

    scopedInit(selector) {
        this.findScopedElems(selector);
        if (this.scoped_elems.length > 0) {
            this.scoped = true;
            this.addScopedAttr(this.scoped_elems);
        }
    }

    // Генератор id для изоляции стилей - строка 10 символов в диапазоне a-z
    scopedIdGenerate() {
        let id = '';
        for (let i = 0; i < 10; i++) {
            id += String.fromCharCode(this.rand(97, 122));
        }

        return id;
    }

    // Если получен JSON, то он парсится в объект
    prepareStyle(style) {
        if (typeof style === 'string') {
            try { this.style_obj = JSON.parse(style) } catch (err) { console.error('CSSinJSON: JSON.parse(style) error') }
        } else if (typeof style === 'object') {
            this.style_obj = style;
        }
    }


    init(selector, style) {
        // Если получен JSON, то он парсится в объект
        this.prepareStyle(style)
            // Сгенерировать scopedId
        this.scopedId = this.scopedIdGenerate();
        // Если нужно, инициализирует scoped-систему
        this.scopedInit(selector);

        // Сгенерировать строку стилей из полученного объекта
        this.style_string = this.jsonToStyle(this.style_obj);

        // Вставить сгенерированные стили на страницу
        this.injectStyle(this.style_string, document.head, 'CSSinJSON_style', this.scopedId);
    }
}

window.CSSinJSON = CSSinJSON;