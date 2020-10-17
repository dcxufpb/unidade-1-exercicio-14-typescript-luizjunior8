import { Venda } from './venda';
import { Loja } from './loja';
import { Endereco } from './endereco';
import { Produto } from './produto';
import { Item } from './item';


function verificaCampoObrigatorio(mensagemEsperada: string, venda: Venda) {
    try {
        venda.dados_venda();
    } catch (e) {
        expect(e.message).toBe(mensagemEsperada);
    }
}

function verificaCampoObrigatorioVenda(mensagemEsperada: string, venda: Venda, item: number, produto: Produto, quantidade: number) {
    try {
        venda.montarCompra(item, produto, quantidade);
    } catch (e) {
        expect(e.message).toBe(mensagemEsperada);
    }
}

let NOME_LOJA = "Loja 1"
let LOGRADOURO = "Log 1"
let NUMERO = 10
let COMPLEMENTO = "C1"
let BAIRRO = "Bai 1"
let MUNICIPIO = "Mun 1"
let ESTADO = "E1"
let CEP = "11111-111"
let TELEFONE = "(11) 1111-1111"
let OBSERVACAO = "Obs 1"
let CNPJ = "11.111.111/1111-11"
let INSCRICAO_ESTADUAL = "123456789"
let DATA_HORA = "25/11/2020 10:30:40V"
let CCF = 123456
let COO = 654321


let enderecoMod : Endereco = new Endereco (LOGRADOURO, NUMERO, COMPLEMENTO, BAIRRO,
  MUNICIPIO, ESTADO, CEP)

let lojaMod : Loja = new Loja (NOME_LOJA, enderecoMod, TELEFONE, OBSERVACAO, CNPJ,
  INSCRICAO_ESTADUAL)

test('data_hora_vazio', () => {
    let data_hora_vazio: Venda = new Venda (lojaMod, "", CCF, COO);
    verificaCampoObrigatorio(`Data e hora da venda são obrigatórias`, data_hora_vazio)
});

test('ccf_vazio', () => {
    let ccf_vazio: Venda = new Venda (lojaMod, DATA_HORA, 0, COO);
    verificaCampoObrigatorio(`O campo ccf é obrigatório`, ccf_vazio)
});

test('coo_vazio', () => {
    let coo_vazio: Venda = new Venda (lojaMod, DATA_HORA, CCF, 0);
    verificaCampoObrigatorio(`O campo coo é obrigatório`, coo_vazio)
}); 

let exProd1 : Produto = new Produto(10, "Banana", "cx", 7.45, "ST");
let exProd2 : Produto = new Produto(20, "Laranja", "cx", 3.32, "ST");
let exProd3 : Produto = new Produto(30, "Chocolate", "un", 0, ""); 

test ('Venda_valor_item_0', () => {
    let venda = lojaMod.makeVenda(DATA_HORA, CCF, COO);
    verificaCampoObrigatorioVenda("Valor do produto inválido", venda, 1, exProd3, 3)
})

test ('Venda_vazia', () => {
    let venda = lojaMod.makeVenda(DATA_HORA, CCF, COO);
    verificaCampoObrigatorioVenda("A lista de itens da venda está vazia", venda, 0, exProd2, 3)
})

test ('Venda_item_duplo', () => {
    let venda = lojaMod.makeVenda(DATA_HORA, CCF, COO);
    venda.montarCompra(1, exProd1, 10);
    verificaCampoObrigatorioVenda("Dois itens não podem conter o mesmo produto", venda, 2, exProd1, 3)
})

test ('Venda_quantidade_0', () => {
    let venda = lojaMod.makeVenda(DATA_HORA, CCF,COO);
    verificaCampoObrigatorioVenda("Quantidade de itens inválida", venda, 1, exProd2, 0)
})