document.getElementById('findBtn').addEventListener('click', async () => {
  const userId = document.getElementById('userId').value.trim();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '🔄 Buscando...';

  try {
    // 1. Buscar nome do usuário
    const userRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);
    const userData = await userRes.json();
    const username = userData.name;

    // 2. Buscar presença
    const presenceRes = await fetch('https://presence.roblox.com/v1/presence/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: [parseInt(userId)] })
    });
    const presenceData = await presenceRes.json();
    const presence = presenceData.userPresences[0];

    if (presence.userPresenceType === 2) { // 2 = In-game
      const placeId = presence.placeId;
      const gameId = presence.gameId;
      const joinUrl = `roblox://experiences/start?placeId=${placeId}&gameInstanceId=${gameId}`;

      resultDiv.innerHTML = `
        <p>👤 <strong>${username}</strong> está em jogo!</p>
        <p>🆔 Servidor: <code>${gameId}</code></p>
        <a href="${joinUrl}" style="color: #00ff88;">🔗 Entrar no servidor</a>
      `;
    } else {
      resultDiv.innerHTML = `<p>👤 <strong>${username}</strong> não está em jogo no momento.</p>`;
    }
  } catch (err) {
    resultDiv.innerHTML = '❌ Erro ao buscar dados. Verifique o ID.';
    console.error(err);
  }
});
