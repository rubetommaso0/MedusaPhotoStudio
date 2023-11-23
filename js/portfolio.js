
const urlParams = new URLSearchParams(window.location.search);
const page = urlParams.get('page');
document.title = page;

mc = document.body.querySelector('#main-container');
test = [1,2,3,4,5,6,7,8,9,10,11];
str = '';
i = 0;
test.forEach(element => {
    if (i == 0 || i == 3 || i == 7) {
        str = str + `
        <div class = 'img-container-vertical'>
        ${page + ' - ' + test[i]}
        </div>
        `

    } else {
        str = str + `
        <div class = 'img-container-horizontal'>
        ${page + ' - ' + test[i]}
        </div>
        `
    }
    i++;
});

mc.innerHTML = str;
