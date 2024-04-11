let produtos = [];

function adicionarProduto() {
    const nomeProduto = document.getElementById('nome_produto').value;
    const quantidade = document.getElementById('quantidade').value;

    if (nomeProduto.trim() === '' || quantidade.trim() === '') {
        alert('Por favor, preencha todos os campos');
        return;
    }

    const produto = {
        nome: nomeProduto,
        quantidade: parseInt(quantidade)
    };

    produtos.push(produto);

    atualizarListaProdutos();
    limparCampos();
}

function atualizarListaProdutos() {
    const listaProdutosTbody = document.getElementById('produtoList');
    listaProdutosTbody.innerHTML = '';

    produtos.forEach(produto => {
        const row = listaProdutosTbody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.textContent = produto.nome;
        cell2.textContent = produto.quantidade;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remover';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => removerProduto(produto));
        cell3.appendChild(deleteButton);
    });
}

function removerProduto(produto) {
    const index = produtos.indexOf(produto);
    if (index !== -1) {
        produtos.splice(index, 1);
        atualizarListaProdutos();
    }
}

function limparCampos() {
    document.getElementById('nome_produto').value = '';
    document.getElementById('quantidade').value = '';
}

function criarOrdem() {
    if (produtos.length === 0) {
        alert('Nenhum produto adicionado à lista');
        return;
    }

    const data = {
        produtos: produtos
    };

    fetch('http://localhost:5000/ordem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao criar ordem de produção');
        })
        .then(data => {
            alert('Ordem de produção criada com sucesso! ID da ordem: ' + data.id);
            produtos = [];
            atualizarListaProdutos();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao criar ordem de produção');
        });
}

function consultarOrdem() {
    let url = 'http://localhost:5000/ordem'

    if (document.getElementById('id_ordem').value != 0 && document.getElementById('id_ordem').value != undefined) {
        url += '/' + document.getElementById('id_ordem').value;
    } else {
        url += '/0';
    }

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao consultar ordens de produção');
        })
        .then(data => {
            atualizarTabelaOrdens(data);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao consultar ordens de produção');
        });
}

function atualizarTabelaOrdens(dados) {
    const ordensListTbody = document.getElementById('ordensList');
    ordensListTbody.innerHTML = '';

    dados.ordens.forEach(ordem => {
        ordem.produtos.forEach(produto => {
            const row = ordensListTbody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);

            cell1.textContent = ordem.id;
            cell2.textContent = produto.nome;
            cell3.textContent = produto.quantidade;
            cell4.textContent = ordem.data_criacao;

            const consultarButton = document.createElement('button');
            consultarButton.textContent = 'Consultar';
            consultarButton.classList.add('consultar-btn');
            consultarButton.addEventListener('click', () => consultarOrdemPorId(ordem.id));
            cell5.appendChild(consultarButton);
        });
    });
}

function consultarOrdemPorId(id) {
    // Implemente a lógica para consultar uma ordem específica por ID, se necessário
    // Pode ser feita uma nova solicitação HTTP GET ou manipulação dos dados existentes
}
