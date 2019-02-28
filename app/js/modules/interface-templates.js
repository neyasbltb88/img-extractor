export default class ImgExtractorInterfaceTemplates {
    constructor(params = {}) {
        this.colors = {
            bg_container: 'rgba(0, 0, 0, .7)',
            text: 'rgb(195, 207, 224)',
            border: 'rgba(105, 109, 125, 0.4)',
            accent: '#ffc000',
            accent_alfa: 'rgba(255, 192, 0, .3)',
        };

    }

    // Возвращает главный шаблон для всего интерфейса
    getLayoutTemplate() {
        return `
            <div class="interface_header">
                <div class="header_row">
                    <div class="interface_hide" title="Свернуть панель скачивания">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                stroke="${this.colors.text}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="4" y1="12" x2="20" y2="12"/>
                            <polyline points="14 6 20 12 14 18"/>
                        </svg>
                    </div>
                    <div class="header_text">Выберите изображения для скачивания</div>
                </div>
                <div class="header_row">
                    <div class="download_counter"></div>
                </div>
            </div>
            
            <div class="interface_content"></div>`;
    }

    // TODO: Тут должны быть иконки в base64
    getIcons() {
        let icons = {
            circleEmpty: '',
            okCircled: '',
        }
    }

    // Возвращает шаблон счетчика выбранных айтемов
    getDownloadCounterTemplate(params) {
        return `
            <div>Выбрано ${params.selected} из ${params.total}</div>`;
    }

    // Возвращает шаблон кнопки фильтра
    getFilterBtnTemplate(filter_name, attr) {
        let btn = document.createElement('div');
        btn.className = 'filter_btn active';
        btn.dataset[attr] = filter_name;
        btn.textContent = `.${filter_name}`;

        return btn;
    }

    // Возвращает шаблон одного пункта из списка айтемов
    getListItem(item) {
        return `<div class="item_name">${item.name}</div>`;
    }

    // Возвращает стили для всего интерфейса
    getCommonStyle(vars) {
        return {
            // Контейнер интерфейса
            [vars.layout_id]: {
                backgroundColor: this.colors.bg_container,
                boxShadow: `0 0 20px ${this.colors.bg_container}`,
                color: this.colors.text,
                fontFamily: 'sans-serif',
                position: 'fixed',
                maxWidth: '500px',
                minWidth: '320px',
                width: '40%',
                height: '100vh',
                boxSizing: 'border-box',
                right: 0,
                top: 0,
                padding: '10px 15px',
                transform: 'translate3d(0, 0, 1px)',
                willChange: 'transform',
                transition: 'all .25s ease-in-out',
            },
            [`${vars.layout_id}.close`]: {
                transform: 'translate3d(100%, 0, 1px)',
                boxShadow: 'none',
            },

            // Хедер интерфейса
            '.interface_header': {
                display: 'flex',
                flexDirection: 'column',
                borderBottom: '1px solid ' + this.colors.border,
                marginBottom: '10px'
            },
            '.header_row': {
                display: 'flex',
            },
            '.interface_hide': {
                padding: '10px',
                width: '28px',
                display: 'flex',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform .25s ease-in-out',
            },
            '.interface_hide svg': {
                transition: 'transform .25s ease-in-out',
            },
            '.interface_hide:hover svg': {
                stroke: '#fff'
            },
            [`${vars.layout_id}.close .interface_hide`]: {
                'background-color': this.colors.bg_container,
                'border-radius': '5px 0 0 5px',
                transform: 'translate3d(calc(-100% - 15px), 0, 1px)',
            },
            [`${vars.layout_id}.close .interface_hide svg`]: {
                transform: 'rotate(180deg)',
            },
            '.header_text': {
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
            },
            '.download_counter': {
                display: 'flex',
            },

            // Фильтр
            '.filter_wrap': {
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
            },
            '.filter_btn': {
                border: '1px solid',
                borderColor: this.colors.border,
                borderRadius: '2px',
                padding: '5px 10px',
                cursor: 'pointer',
                opacity: 0.8,
                userSelect: 'none'
            },
            '.filter_btn.active': {
                borderColor: this.colors.accent,
                color: this.colors.accent,
            },

            // Контент
            '.interface_content': {
                overflowY: 'auto',
            },

            // Список айтемов картинок
            '.list_item': {
                border: `1px solid`,
                borderColor: 'transparent',
                borderRadius: '3px',
                padding: '15px',
                marginBottom: '5px',
                backgroundColor: this.colors.bg_container,
                cursor: 'pointer',
                opacity: 0.5
            },
            [`.list_item${vars.list_item_slected}`]: {
                borderColor: this.colors.border,
                opacity: 1,
            }


        } // Конец стилей
    }
}