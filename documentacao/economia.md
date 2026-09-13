# Economia do projeto

> A implementação técnica da criptomoeda (rede, contrato, infraestrutura
> on-chain) fica para uma fase futura. O que já está definido é o modelo de
> distribuição e as regras de uso, abaixo.

## Moedas

- **Moeda interna (soft currency)**: ganha jogando. Usada para desbloquear
  personagens/agentes. Não pode ser comprada com dinheiro real.
- **Criptomoeda do projeto** (rede a definir, cogitado ETH): usada
  exclusivamente para comprar skins/cosméticos.

## Suprimento e distribuição da cripto

- Suprimento inicial fixo: **10.000.000 de moedas**.
- Cada *issue* aberta no repositório tem um valor fixo em cripto, definido no
  momento da criação da issue.
- O valor pago por issue **diminui progressivamente** conforme o suprimento
  inicial vai sendo consumido (fórmula exata ainda a definir).
- Para reivindicar o pagamento de uma issue resolvida, o contribuidor deve
  incluir sua carteira na descrição da Pull Request que a resolve.
- Quando o suprimento inicial de 10M se esgotar, novas issues passam a ser
  pagas com receita das compras de skins, que retorna para uma **carteira do
  projeto** (tesouraria) e é liberada gradualmente conforme novas issues são
  abertas (não de uma vez).

## Pagamento do criador do projeto

- O criador recebe desde o início do projeto.
- Valor: a **média do que os 5 melhores contribuidores receberam**.
- Enquanto não houver contribuidores, o valor é fixo em **1.000
  moedas/mês**.
- O pagamento **não é uma transferência automática/direta** da carteira do
  projeto para a carteira pessoal do criador — ele precisa seguir as mesmas
  regras de *claim* que qualquer contribuidor, de forma auditável e
  transparente.
- O criador tem acesso à carteira do projeto, mas **somente para pagar
  despesas do projeto** (infraestrutura, ferramentas, etc.) — não para uso
  pessoal.

## Fomento ao cenário competitivo

- Parte dos valores arrecadados também será destinada a promover o cenário
  competitivo do jogo (torneios, premiações, etc.). Detalhes de percentual e
  operacionalização ainda a definir.

## Perguntas em aberto relacionadas

Ver [Perguntas em aberto](./perguntas-em-aberto.md) para os pontos ainda sem
decisão fechada (fórmula de decaimento, divisão da tesouraria, rede da
cripto, governança da carteira, etc.).
