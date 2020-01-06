let radio = document.querySelectorAll('input[type=radio]');
let reset = document.querySelector('#reset');
let out = document.querySelector('.out');

document.getElementById('btn-1').onclick = () => {
    let gend, stat, spec;
    radio.forEach(el => {
        if (el.checked) {
            switch (el.name) {
                case 'Gender':
                    gend = el.value;
                    break;
                case 'Status':
                    stat = el.value;
                    break;
                case 'Species':
                    spec = el.value;
                    break;
            }
        }
    })
    fetch('https://rickandmortyapi.com/api/character/')
        .then(res => res.json())
        .then(res => {
            const { pages } = res.info;
            const link = 'https://rickandmortyapi.com/api/character/?page=';
            const linkArr = [...new Array(pages)].map((el, i) => link + (i + 1));

            Promise.all(linkArr.map(el => axios.get(el)))
                .then(res => {
                    let dataArr = res.map(el => el.data.results);
                    let allCharArray = [];
                    dataArr.map(item => item.map(el => allCharArray.push(el)));
                    // for (let k = 0; k < dataArr.length; k++) {
                    //     for (let j = 0; j < dataArr[k].length; j++) {
                    //         allCharArray.push(dataArr[k][j]);
                    //     }
                    // }
                    let resArr = [];
                    allCharArray.forEach(el => {
                        if ((gend == 'All' ? true : el.gender == gend)
                            && (stat == 'All' ? true : el.status == stat)
                            && (spec == 'All' ? true : el.species == spec)) {
                            resArr.push(el)
                        }
                    })
                    console.log(resArr);

                    let outRes = `Найдено персонажей - ${resArr.length}<br><br>`;
                    reset.onclick = () => out.innerHTML = '';
                    resArr.forEach((el, i) => {
                        outRes += `${i + 1}. ${el.name} <br>`
                    })
                    out.innerHTML = outRes;
                })
        });
}