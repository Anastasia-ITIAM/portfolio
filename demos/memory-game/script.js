const cards = [
    'https://picsum.photos/id/237/100/100', 
    'https://picsum.photos/id/238/100/100',
    'https://picsum.photos/id/239/100/100',
    'https://picsum.photos/id/240/100/100',
    'https://picsum.photos/id/241/100/100',
    'https://picsum.photos/id/242/100/100',
    'https://picsum.photos/id/243/100/100',
    'https://picsum.photos/id/244/100/100'
];

const gameBoard = document.getElementById('game-board');
let selectedCards = [];
let canClick = true;

function createCard(cardUrl) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = cardUrl;

    const cardContent = document.createElement('img');
    cardContent.classList.add('card-content');
    cardContent.src = cardUrl;

    card.appendChild(cardContent);

    card.addEventListener('click', onCardClick);
    return card;
}

function duplicateArray(array) {
    return [...array, ...array];
}

function shuffleArray(array) {
    return array.sort(() => 0.5 - Math.random());
}

function onCardClick(e) {
    const card = e.currentTarget;

    if (!canClick || card.classList.contains('flip') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flip');
    selectedCards.push(card);

    if (selectedCards.length === 2) {
        canClick = false;
        setTimeout(() => {
            const [first, second] = selectedCards;

            if (first.dataset.value === second.dataset.value) {
                first.classList.add('matched');
                second.classList.add('matched');
                first.removeEventListener('click', onCardClick);
                second.removeEventListener('click', onCardClick);
            } else {
                first.classList.remove('flip');
                second.classList.remove('flip');
            }

            selectedCards = [];
            canClick = true;

            const unmatchedCards = document.querySelectorAll('.card:not(.matched)');
            if (unmatchedCards.length === 0) {
                setTimeout(() => alert("🎉 Bravo, you made it!"), 300);
            }
        }, 800);
    }
}

let allCards = shuffleArray(duplicateArray(cards));
allCards.forEach(cardUrl => {
    const cardEl = createCard(cardUrl);
    gameBoard.appendChild(cardEl);
});
