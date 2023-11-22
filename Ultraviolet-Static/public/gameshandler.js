function openGames() {
    gamesSidebar.style.display = 'block';

    fetch('games.json')
        .then(response => response.json())
        .then(games => displayGames(games))
        .catch(error => console.error('Error fetching games:', error));
}

function displayGames(games) {
    gamesSidebar.innerHTML = '<h2>Games</h2>';
    games.forEach((game, index) => {
        const gameElement = document.createElement('img');
        const displayName = game.displayName || game.name;
        gameElement.src = game.image;
        gameElement.alt = displayName;
        gameElement.className = 'game-icon';
        gameElement.onclick = () => openGame(index, displayName, game.url);
        gamesSidebar.appendChild(gameElement);
    });
}

function openGame(index, windowName, gameUrl) {
    if (windowObjectReference == null || windowObjectReference.closed) {
        windowObjectReference = window.open(gameUrl, windowName, 'resizable,scrollbars,status,windowFeatures');
    } else {
        windowObjectReference.location.href = gameUrl;
        windowObjectReference.focus();
    }
}