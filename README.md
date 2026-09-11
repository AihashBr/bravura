# Bravura

Jogo tático multiplayer, estilo Valorant/CS, 100% open source, com visual low-poly
(referência: Untuned, porém mais polido e menos "quadrado").

> Este documento reúne as decisões de design tomadas até agora. Muitos pontos
> ainda estão em aberto e serão refinados conforme o projeto avança — está
> marcado explicitamente onde falta decisão.

## Sumário

- [Visão geral](#visão-geral)
- [Stack técnica](#stack-técnica)
- [Arquitetura de rede](#arquitetura-de-rede)
- [Modo de jogo](#modo-de-jogo)
- [Economia do projeto](#economia-do-projeto)
- [Programa de criadores de conteúdo](#programa-de-criadores-de-conteúdo)
- [Perguntas em aberto](#perguntas-em-aberto)

## Visão geral

- Jogo tático multiplayer 4v4, inspirado em Valorant/CS.
- Cliente roda no navegador (Angular + TypeScript + Three.js).
- Open source, com contribuidores remunerados em criptomoeda própria do projeto.
- Modelo de monetização sem pay-to-win: cosméticos (skins) comprados com cripto;
  personagens/agentes só são desbloqueados com a moeda interna ganha jogando.
- Sem loot box paga com dinheiro real. Caixas de recompensa, se existirem, virão
  de missões semanais completadas jogando, nunca de compra direta.

## Stack técnica

- **Frontend/cliente**: Angular + TypeScript
- **Renderização 3D**: Three.js
- **Rede**: WebRTC (P2P) + servidor de sinalização

## Arquitetura de rede

- Conexão entre jogadores via **WebRTC**, com um **servidor de sinalização**
  responsável apenas por intermediar a troca inicial de SDP/ICE (não fica no
  meio da partida).
- Topologia da partida (full mesh vs. peer host-autoritativo) e uso de
  servidor **TURN** de fallback para NAT restritivo ainda estão em definição
  — ver [Perguntas em aberto](#perguntas-em-aberto).

## Modo de jogo

Modo único no lançamento: **Bomb**, 4 jogadores por equipe.

- **Diferente do CS/Valorant tradicional: as duas equipes podem plantar a bomba**,
  não existe papel fixo de "atacante"/"defensor".
- Mapas são **espelhados**, já que ambos os lados podem atacar.
- Quem planta primeiro recebe bônus de dinheiro no round seguinte.
- Depois de plantada, a equipe adversária (a que não plantou) pode **defusar**
  para evitar perder o round.
- Se ninguém plantar até o tempo acabar, vence o round quem tiver **mais
  jogadores vivos**.
- Se houver empate na contagem de vivos, o ponto do round fica pendente e é
  concedido a quem vencer o **próximo** round.
- Empates consecutivos acumulam pontos pendentes, que são todos entregues de
  uma vez para quem finalmente vencer um round.
- Vence a partida quem chegar a **10 pontos** primeiro.

## Economia do projeto

### Moedas

- **Moeda interna (soft currency)**: ganha jogando. Usada para desbloquear
  personagens/agentes. Não pode ser comprada com dinheiro real.
- **Criptomoeda do projeto** (rede a definir, cogitado ETH): usada
  exclusivamente para comprar skins/cosméticos. Detalhes de implementação da
  rede, contrato e infraestrutura on-chain ficam para uma fase futura — o que
  já está definido é o modelo de distribuição e regras de uso, abaixo.

### Suprimento e distribuição da cripto

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

### Pagamento do criador do projeto

- O criador recebe desde o início do projeto.
- Valor: a **média do que os 5 melhores contribuidores receberam**.
- Enquanto não houver contribuidores, o valor é fixo em **1.000 moedas/mês**.
- O pagamento **não é uma transferência automática/direta** da carteira do
  projeto para a carteira pessoal do criador — ele precisa seguir as mesmas
  regras de *claim* que qualquer contribuidor, de forma auditável e
  transparente.
- O criador tem acesso à carteira do projeto, mas **somente para pagar
  despesas do projeto** (infraestrutura, ferramentas, etc.) — não para uso
  pessoal.

### Fomento ao cenário competitivo

- Parte dos valores arrecadados também será destinada a promover o cenário
  competitivo do jogo (torneios, premiações, etc.). Detalhes de percentual e
  operacionalização ainda a definir.

## Programa de criadores de conteúdo

Está prevista uma recompensa para criadores de conteúdo do jogo (streamers,
YouTubers, etc.), financiada pela tesouraria do projeto. Critérios de
elegibilidade, mecanismo de repasse (ex: código de criador vinculado a compras
de skin) e percentual ainda **não foram definidos**.

## Perguntas em aberto

Itens discutidos, mas ainda sem decisão fechada:

- **Topologia de rede da partida**: full mesh (todos os 8 jogadores
  conectados entre si) vs. um peer atuando como host-autoritativo da partida
  (reduz superfície de cheat e tráfego, mais fácil de validar hits).
- **Servidor TURN de fallback**: necessário para jogadores atrás de NAT
  restritivo/CGNAT que não conseguem estabelecer conexão P2P direta.
- **Estratégia de anti-cheat**: dado o modelo P2P, mitigar wallhack/aimbot é
  mais difícil do que em arquitetura servidor-autoritativa; decidir se isso é
  resolvido já na primeira versão (ex: adotando o modelo host-autoritativo)
  ou tratado em fase posterior.
- **Fórmula de decaimento do valor por issue.**
- **Divisão percentual/prioridade da tesouraria** entre: recompensa de
  issues, pagamento do criador, fomento ao cenário competitivo, despesas
  operacionais e programa de criadores de conteúdo.
- **Rede/infraestrutura da criptomoeda** (ex: ETH mainnet vs. L2), se as
  skins serão NFTs individuais ou desbloqueios simples pagos com cripto, e se
  haverá controle de volatilidade (ex: preço fixo em vez de atrelado ao valor
  de mercado do token).
- **Governança da carteira do projeto**: considerar carteira multisig em vez
  de chave única, para maior transparência sobre despesas.
- **Detalhes do programa de criadores de conteúdo** (elegibilidade,
  mecanismo de repasse, origem do valor).
- **Escopo do MVP**: quantos mapas, quantos agentes/habilidades no
  lançamento inicial.
