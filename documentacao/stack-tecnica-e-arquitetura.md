# Stack técnica e arquitetura de rede

## Stack técnica

- **Frontend/cliente**: Angular + TypeScript
- **Renderização 3D**: Three.js
- **Rede**: WebRTC (P2P) + servidor de sinalização

## Arquitetura de rede

- Conexão entre jogadores via **WebRTC**, com um **servidor de sinalização**
  responsável apenas por intermediar a troca inicial de SDP/ICE (não fica no
  meio da partida).
- A topologia da partida e a estratégia de anti-cheat ainda não foram
  fechadas — ver [Perguntas em aberto](./perguntas-em-aberto.md) para o
  detalhamento das opções em avaliação (full mesh vs. peer
  host-autoritativo, necessidade de servidor TURN de fallback).

## Considerações levantadas até agora

- P2P puro (sem autoridade central durante a partida) é a arquitetura mais
  simples de implementar, mas expõe o jogo a wallhack (cliente tem o estado
  completo do jogo) e adulteração de mensagens de dano/hit, já que não há um
  "juiz" validando os acertos. É o motivo de jogos como CS/Valorant serem
  servidor-autoritativos.
- Um modelo de **peer host-autoritativo** (um dos 8 jogadores da partida
  valida hits e replica o estado para os demais) reduz essa superfície de
  ataque sem exigir um servidor dedicado, mantendo o espírito P2P + servidor
  de sinalização.
- Full mesh WebRTC com 8 jogadores significa até 28 conexões diretas na
  partida — funciona, mas tem custo de banda e de estabilidade maior que uma
  topologia em estrela.
- P2P direto falha para uma fatia real de usuários atrás de NAT
  simétrico/CGNAT sem um servidor **TURN** de fallback — isso precisa
  existir desde o MVP, não é algo para resolver depois.
