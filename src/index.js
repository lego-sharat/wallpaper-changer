const wallpaper = require('wallpaper');
const axios = require('axios');
const fs = require('fs');
let fileName = '';

axios.get("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1539081724160&pid=hp&cc=in")
    .then(res => {
        fileName = generateFileNameFromCaption(res.data.images[0].caption)
        return axios({
            method: 'get',
            url: `https://bing.com${res.data.images[0].url}`,
            responseType: 'stream'
        })
    })
    .then(function (response) {
        response.data.pipe(fs.createWriteStream(`${fileName}.jpg`)).on('close', _ => {
            wallpaper.set(`${fileName}.jpg`);
        })
    })
    .catch(err => console.log(err));

/**
 * 
 * @param {String} caption 
 */
function generateFileNameFromCaption(caption) {
    let tmp = caption.toLowerCase();
    while (tmp.indexOf(",") > 0) {
        tmp = tmp.replace(",", "");
    }
    while (tmp.indexOf("  ") > 0) {
        tmp = tmp.replace("  ", " ");
    }
    while (tmp.indexOf(" ") > 0) {
        tmp = tmp.replace(" ", "-");
    }
    return tmp;
}