const listaRituais = document.getElementById('lista-rituais');
const filtroElemento = document.getElementById('filtro-elemento');
const filtroCirculo = document.getElementById('filtro-circulo');
const inputPesquisa = document.getElementById('pesquisa');

let rituaisData = [];

let rituaisAprendidos = [];

let mostrandoAprendidos = false;

const mostrarSelecionadosBtn = document.getElementById('mostrar-selecionados');

mostrarSelecionadosBtn.addEventListener('click', () => {
    mostrandoAprendidos = !mostrandoAprendidos; 

    inputPesquisa.value = ''; 

    if (mostrandoAprendidos) {
        filtroElemento.value = 'todas';
        filtroCirculo.value = 'todos';
        mostrarRituaisAprendidos(); 
        mostrarSelecionadosBtn.textContent = 'Todos'; 
    } else {
        filtroElemento.value = 'todas';
        filtroCirculo.value = 'todos'; 
        mostraRitual(rituaisData);
        mostrarSelecionadosBtn.textContent = 'Aprendidos';
    }
});

filtroElemento.addEventListener('change', () => {
    mostrandoAprendidos = false; // Desativar modo "Aprendidos"
    mostrarSelecionadosBtn.textContent = 'Aprendidos';
    ritualFiltrado();
});

filtroCirculo.addEventListener('change', () => {
    mostrandoAprendidos = false; // Desativar modo "Aprendidos"
    mostrarSelecionadosBtn.textContent = 'Aprendidos';
    ritualFiltrado();
});

function mostraRitual(ritualFiltrado) {
    listaRituais.innerHTML = ''
    ritualFiltrado.forEach( ritual => {
        const ritualItem = document.createElement('li');
        ritualItem.classList.add('ritual-item');

        const corElemento = getElementoClass(ritual.elementos);

        ritualItem.innerHTML = `
            <div class="container">
                <div class="containerEs">
                    <div class="rtitle"><h1 class="eb-garamond">${ritual.nome}</h1><h3 class="${corElemento}" id="eb-garamond2">${ritual.elementos.join(', ')} ${ritual.circulo}</h3></div>
                    <div class="simbolo"><img src="${ritual.imagem}" alt="Simbolo do Ritual"></div>
                </div>
                <div class="containerDi">
                    <div class="poppins-light" id="infos"><p>${ritual.execução} | ${ritual.alcance} | ${ritual.efeito} | ${ritual.duracao} | ${ritual.resistencia}</p></div>
                    <div class="descricao" id="poppins-regular"><p>${ritual.descricao}</p></div>
                    <div class="poppins-light">
                    <div><p>${ritual.discente}</p></div>
                    <div><p>${ritual.verdadeiro}</p></div>
                    </div>
                </div>
                 <label class="checkbox-label" for="checkbox-${ritual.nome}">
                    <img src="./assets/img/${rituaisAprendidos.includes(ritual.nome) ? 'MarcadorSelecionado' : 'Marcador'}.png" 
                         alt="Seleção do Ritual" 
                         class="checkbox-imagem">
                    <input type="checkbox" id="checkbox-${ritual.nome}" class="selecionar-checkbox" ${rituaisAprendidos.includes(ritual.nome) ? 'checked' : ''}>
                </label>
            </div>
        `;

       const selecionarCheckbox = ritualItem.querySelector('.selecionar-checkbox');
       selecionarCheckbox.addEventListener('change', (event) => {
        ritualAprendido(ritual.nome);
    
        // Encontrar a imagem associada a essa checkbox
        const imagemCheckbox = ritualItem.querySelector('.checkbox-imagem');
        if (event.target.checked) {
            imagemCheckbox.src = "./assets/img/MarcadorSelecionado.png";
        } else {
            imagemCheckbox.src = "./assets/img/Marcador.png";
        }
    });
        

        listaRituais.appendChild(ritualItem);
    });
}

function ritualAprendido(nomeRitual) {
    if (rituaisAprendidos.includes(nomeRitual)) {
        rituaisAprendidos = rituaisAprendidos.filter(nome => nome !== nomeRitual);
    } else {
        rituaisAprendidos.push(nomeRitual);
    }
}

function mostrarRituaisAprendidos() {
    const rituaisFiltrados = rituaisData.filter(ritual => rituaisAprendidos.includes(ritual.nome));
    mostraRitual(rituaisFiltrados);
}

function getElementoClass(elementos) {
    if (elementos.length > 1) {
        return 'elemento-medo';
    } else if (elementos.includes('energia')) {
        return 'elemento-energia';
    } else if (elementos.includes('conhecimento')) {
        return 'elemento-conhecimento';
    } else if (elementos.includes('morte')) {
        return 'elemento-morte';
    } else if (elementos.includes('sangue')) {
        return 'elemento-sangue';
    } else if (elementos.includes('medo')){
        return 'elemento-medo';
    } 

    return ''; // Caso não haja correspondência
}


function ritualFiltrado() {
    const elementoSelecionado = filtroElemento.value;
    const circuloSelecionado = filtroCirculo.value;

    let ritualFiltrado = rituaisData;

    if (elementoSelecionado !== 'todas') {
        ritualFiltrado = ritualFiltrado.filter(ritual => ritual.elementos.includes(elementoSelecionado));
    }

    if (circuloSelecionado !== 'todos') {
        ritualFiltrado = ritualFiltrado.filter(ritual => ritual.circulo === circuloSelecionado);
    }

    mostraRitual(ritualFiltrado);
}

filtroElemento.addEventListener('change', () => {
    mostrandoAprendidos = false; 
    mostrarSelecionadosBtn.textContent = 'Aprendidos';
    inputPesquisa.value = ''; // Limpar o campo de pesquisa
    ritualFiltrado();
});
filtroCirculo.addEventListener('change', () => {
    mostrandoAprendidos = false; 
    mostrarSelecionadosBtn.textContent = 'Aprendidos';
    inputPesquisa.value = ''; // Limpar o campo de pesquisa
    ritualFiltrado();
});

// Carregar os rituais a partir do arquivo JSON usando fetch
fetch('rituais.json')
    .then(response => response.json())
    .then(data => {
        rituaisData = data;
        mostraRitual(rituaisData);
    })
    .catch(error => console.error('Erro ao carregar os rituais:', error));

inputPesquisa.addEventListener('input', () => {
        const termoPesquisa = inputPesquisa.value.toLowerCase();
    
        // Resetar filtros
        filtroElemento.value = 'todas';
        filtroCirculo.value = 'todos';
        mostrandoAprendidos = false;
        mostrarSelecionadosBtn.textContent = 'Aprendidos';
    
        filtrarRituaisPorNome(termoPesquisa);
    });

    function filtrarRituaisPorNome(termoPesquisa) {
        const ritualFiltrado = rituaisData.filter(ritual => 
            ritual.nome.toLowerCase().includes(termoPesquisa)
        );
        mostraRitual(ritualFiltrado);
    }
    