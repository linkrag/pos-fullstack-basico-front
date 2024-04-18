const obsTextArea = document.getElementById('obs');

obsTextArea.addEventListener('input', function () {
    this.style.height = 'auto'; // Redefine a altura para automático
    this.style.height = this.scrollHeight + 'px'; // Define a altura baseada no conteúdo
});

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
        cell1.classList.add('td_text')
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
            document.getElementById('numOrdem').value = data.id
            produtos = [];
            atualizarListaProdutos();
            consultarOrdem()
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao criar ordem de produção');
        });
}

function consultarOrdem() {
    let url = 'http://localhost:5000/ordem'
    const numOrdem = document.getElementById('numOrdem').value;

    if (numOrdem != 0 && numOrdem != undefined) {
        url += '/' + numOrdem;
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
            atualizarTabelaObs(data);
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

function inserirObservacao() {
    const numOrdem = document.getElementById('numOrdem').value;
    const obs = document.getElementById('obs').value;

    if (numOrdem.value != 0 && numOrdem.value != undefined) {
        alert('Nenhum número de ordem foi inserido.');
        return;
    }

    if (obs.value != '' && obs.value != undefined) {
        alert('Nenhum texto foi inserido.');
        return;
    }

    const data = {
        ordem_id: numOrdem,
        texto: obs
    };

    console.log(data)

    fetch('http://localhost:5000/obs', {
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
            alert('Observação inserida com sucesso');
            document.getElementById('numOrdem').value = numOrdem
            produtos = [];
            atualizarListaProdutos();
            consultarOrdem()
            document.getElementById('obs').value = '';
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao criar ordem de produção');
        });
}

function deleteObs(id) {

    fetch('http://localhost:5000/obs/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao deletar observação');
        })
        .then(data => {
            alert('Observação deletada com sucesso');
            produtos = [];
            atualizarListaProdutos();
            consultarOrdem()
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao deletar observação');
        });
}


function deleteOrdem() {

    const id = document.getElementById('numOrdem').value

    fetch('http://localhost:5000/ordem/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            console.log(response)
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao deletar observação');
        })
        .then(data => {
            alert('Observação deletada com sucesso');
            produtos = [];
            document.getElementById('numOrdem').value = '';
            consultarOrdem();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao deletar observação');
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

function atualizarTabelaObs(dados) {
    const obsListTbody = document.getElementById('obsList');
    obsListTbody.innerHTML = '';

    dados.ordens.forEach(ordem => {
        ordem.obs.forEach(obs => {
            const row = obsListTbody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);

            cell1.textContent = ordem.id;
            cell2.textContent = obs.id;
            cell2.hidden = true;
            cell3.textContent = obs.texto;
            cell3.classList.add('td_text')

            const consultarButton = document.createElement('button');
            consultarButton.textContent = 'Deletar';
            consultarButton.classList.add('delete-btn');
            consultarButton.addEventListener('click', () => deleteObs(obs.id));
            cell4.appendChild(consultarButton);
        });
    });
}

function consultarOrdemPorId(id) {
    document.getElementById('numOrdem').value = id
    consultarOrdem();
}
