# Perguntas em aberto

Itens já discutidos, mas ainda sem decisão fechada.

## Rede e arquitetura

- **Topologia de rede da partida**: full mesh (todos os 8 jogadores
  conectados entre si) vs. um peer atuando como host-autoritativo da
  partida (reduz superfície de cheat e tráfego, mais fácil de validar
  hits).
- **Servidor TURN de fallback**: necessário para jogadores atrás de NAT
  restritivo/CGNAT que não conseguem estabelecer conexão P2P direta.
- **Estratégia de anti-cheat**: dado o modelo P2P, mitigar wallhack/aimbot é
  mais difícil do que em arquitetura servidor-autoritativa; decidir se isso
  é resolvido já na primeira versão (ex: adotando o modelo
  host-autoritativo) ou tratado em fase posterior.

## Escopo do jogo

- Escopo do MVP: quantos mapas e quantos agentes/habilidades no lançamento
  inicial.

## Economia

- **Fórmula de decaimento do valor por issue.**
- **Divisão percentual/prioridade da tesouraria** entre: recompensa de
  issues, pagamento do criador, fomento ao cenário competitivo, despesas
  operacionais e programa de criadores de conteúdo.
- **Rede/infraestrutura da criptomoeda** (ex: ETH mainnet vs. L2), se as
  skins serão NFTs individuais ou desbloqueios simples pagos com cripto, e
  se haverá controle de volatilidade (ex: preço fixo em vez de atrelado ao
  valor de mercado do token).
- **Governança da carteira do projeto**: considerar carteira multisig em
  vez de chave única, para maior transparência sobre despesas.
- **Detalhes do programa de criadores de conteúdo** (elegibilidade,
  mecanismo de repasse, origem do valor) — ver
  [Programa de criadores de conteúdo](./criadores-de-conteudo.md).
