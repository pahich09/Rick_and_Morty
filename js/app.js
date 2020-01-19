const reset = document.querySelector('button[type=reset]');
const btn = document.getElementById('btn-1');
const columns = ['id', 'name', 'gender', 'status', 'species'];
const objSort = new Object;

const createObjSort = () => {
    document.querySelectorAll('#gender>option').forEach(el => el.selected ? objSort.gender = el.value : null);
    document.querySelectorAll('#status>option').forEach(el => el.selected ? objSort.status = el.value : null);
    document.querySelectorAll('#species>option').forEach(el => el.selected ? objSort.species = el.value : null);
}

const createHTMLNode = (tag, attrs, inner) => {
    const element = document.createElement(tag);
    attrs.forEach(attr => { element.setAttribute(attr.name, attr.value.join(' ')) });
    inner ? element.innerHTML = inner : null;
    return element;
}

btn.onclick = () => {
    btn.disabled = true;
    reset.disabled = false;
    createObjSort();
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
                    let resArr = [];
                    allCharArray.forEach(el => {
                        if ((objSort.gender == 'All' ? true : el.gender == objSort.gender)
                            && (objSort.status == 'All' ? true : el.status == objSort.status)
                            && (objSort.species == 'All' ? true : el.species == objSort.species)) {
                            resArr.push(el)
                        }
                    })
                    const table = createHTMLNode('table', [{ name: 'class', value: ['table', 'table-striped'] }], null);
                    const thead = createHTMLNode('thead', [], null);
                    const tr = createHTMLNode('tr', [], null);
                    const tbody = createHTMLNode('tbody', [], null);

                    columns.forEach(el => tr.append(createHTMLNode('th', [{ name: 'class', value: ['text-uppercase'] }], el)));
                    document.getElementById('app').append(table);
                    table.append(thead);
                    thead.append(tr);
                    table.append(tbody);

                    resArr.forEach(el => {
                        const trBody = createHTMLNode('tr', [], null);
                        tbody.append(trBody);
                        columns.forEach(item => trBody.append(createHTMLNode('td', [], (el[item]))))
                    });
                    reset.onclick = () => {
                        table.remove();
                        btn.disabled = false;
                        reset.disabled = true;
                    }
                })
        });
}