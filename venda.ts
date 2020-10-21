import { Loja } from "./loja";
import { Produto } from "./produto";
import { Item } from "./item";
import { Pagamento } from "./pagamento";


export class Venda {

    constructor(

        private loja: Loja,
        private dataHora : string,
        private ccf : number,
        private coo : number,
        private itens : Array<Item> = [],
        private pagamento : Pagamento = new Pagamento("", 0, 0)) { }

    public valida_dados_obrigatorios(): void {

        if (!this.dataHora){
            throw new Error (`Data e hora da venda são obrigatórias`)            
        }

        if (!this.ccf){
            throw new Error (`O campo ccf é obrigatório`)
        }

        if (!this.coo){
            throw new Error (`O campo coo é obrigatório`)
        }

        if (this.itens.length <= 0) {
            throw new Error (`A lista de itens da venda está vazia`)
        }
    }


    public checarItens (item: number, produto: Produto, quantidade: number): void {

        this.itens.forEach(i => {
            if (i.getItem() != item && i.getProduto().getCodigo() == produto.getCodigo()){
                throw new Error ("Dois itens não podem conter o mesmo produto");
            }
        })

        if (quantidade <= 0){
            throw new Error ("Quantidade de itens inválida");
        }

        if (produto.getValorUnitario() <= 0) {
            throw new Error ("Valor do produto inválido");
        }
    }


    public montarCompra (item: number, produto: Produto, quantidade: number) {
        this.checarItens(item, produto, quantidade);
        let itemCompra : Item = new Item (this, item, produto, quantidade);
        this.itens.push(itemCompra);
    }


    public dadosCompra(){
        let cabecalho = `ITEM CODIGO DESCRICAO QTD UN VL UNIT(R$) ST VL ITEM(R$)\n`
        this.itens.forEach(i => {
            cabecalho = cabecalho + i.dados_item();
        })
        return cabecalho;
    }


    public totalCompra() : number {
        let prejuizo = 0;
        this.itens.forEach(i => {
            prejuizo += i.valor_final_item();
        })
        return prejuizo;
    } 


    public dados_venda() : string {

        this.valida_dados_obrigatorios()

        let datahora : string = "25/11/2020 10:30:40V"

        let _ccf : string = "CCF:" + this.ccf

        let _coo : string = "COO: " + this.coo

        return `${datahora} ${_ccf} ${_coo}`
    }

    public montarPagamento(metodoPagamento: string, valorRecebido: number) {

        let valorCompra = this.totalCompra()
        this.pagamento = new Pagamento(metodoPagamento, valorRecebido, valorCompra)
    }

    public imprimeCupom(): string {
        this.valida_dados_obrigatorios();
        let infoLoja = this.loja.dados_loja();
        let infoVenda = this.dados_venda();
        let conta = this.totalCompra().toFixed(2);
        let infoFormaPag = this.pagamento.formaPagamento()
        let infoValorRecebido = this.pagamento.getValorRecebido().toFixed(2);
        let infoTroco = this.pagamento.calculaTroco().toFixed(2);
        let trace = "-".repeat(30)
        
        return `${infoLoja}${trace}
${infoVenda}
   CUPOM FISCAL   
${this.dadosCompra()}${trace}
TOTAL R$ ${conta}
${infoFormaPag} ${infoValorRecebido}
Troco R$ ${infoTroco}`;
    }

}  