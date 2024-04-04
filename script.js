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
    const listaProdutosDiv = document.getElementById('lista_produtos');
    listaProdutosDiv.innerHTML = '';

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.textContent = `Nome: ${produto.nome}, Quantidade: ${produto.quantidade}`;
        listaProdutosDiv.appendChild(produtoDiv);
    });
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
        alert('Ordem de produção criada com sucesso! ID da ordem: ' + data.ordem_id);
        produtos = [];
        atualizarListaProdutos();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao criar ordem de produção');
    });
}
