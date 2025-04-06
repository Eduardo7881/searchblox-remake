document.getElementById('findBtn').addEventListener('click', async () => {
  const userId = document.getElementById('userId').value.trim();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '🔄 Searching...';

  try {
    const userRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);
    const userData = await userRes.json();
    const username = userData.name;

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
        <p><strong>${username}</strong> is in game!</p>
        <p>Server ID: <code>${gameId}</code></p>
        <a href="${joinUrl}" style="color: #00ff88;">🔗 Join Server</a>
      `;
    } else {
      resultDiv.innerHTML = `<p><strong>${username}</strong> is not in game.</p>`;
    }
  } catch (err) {
    resultDiv.innerHTML = '❌ Error when fetching data. Verify the ID.';
    console.error(err);
  }
});
