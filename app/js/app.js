import ImgExtractor from './modules/img-extractor.js'

/////////////////////////////////////////////////////////
// https://ru.wikipedia.org/wiki/Список_MIME-типов



window.imgExtractor = new ImgExtractor({
    // container: '.item.first',
    rename: {
        // prefix: 'pref_',
        // suffix: '_suf'
    },
    // autodownload: true
});

// console.log(window.imgExtractor.getElements());
// console.log(window.imgExtractor.getItems());


console.log(imgExtractor);

// window.imgExtractor.downloadAll();