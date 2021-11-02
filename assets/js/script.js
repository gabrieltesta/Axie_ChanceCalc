var intCurrentEnergy = 2;

var gameData = localStorage.getItem('gameData');

var defaultGameData = {
    'qtd': {
        0: [0, 0, 0, 0],
        1: [0, 0, 0, 0],
        2: [0, 0, 0, 0],
    },
    'img_src': {
        0: ['https://storage.googleapis.com/axie-cdn/game/cards/base/aquatic-tail-12.png', 'https://storage.googleapis.com/axie-cdn/game/cards/base/aquatic-mouth-02.png', 'https://storage.googleapis.com/axie-cdn/game/cards/base/aquatic-horn-12.png', 'https://storage.googleapis.com/axie-cdn/game/cards/base/aquatic-back-10.png'],
        1: ['https://storage.googleapis.com/axie-cdn/game/cards/base/beast-back-02.png', 'https://storage.googleapis.com/axie-cdn/game/cards/base/beast-horn-04.png', 'https://storage.googleapis.com/axie-cdn/game/cards/base/beast-mouth-02.png', 'https://storage.googleapis.com/axie-cdn/game/cards/base/bug-tail-06.png'],
        2: ['https://storage.googleapis.com/axie-cdn/game/cards/base/plant-back-12.png', 'https://storage.googleapis.com/axie-cdn/game/cards/base/plant-horn-10.png', 'https://storage.googleapis.com/axie-cdn/game/cards/base/plant-tail-02.png', 'https://storage.googleapis.com/axie-cdn/game/cards/base/reptile-mouth-04.png'],
    }
};

if (gameData == null)
    gameData = defaultGameData;
else
    gameData = JSON.parse(gameData);

$('img').on('dragstart', function(event) { event.preventDefault(); });


function changeAllImages() {
    let animalItems = $('.animal-container-content-column').each(() => { return $(this); });
    for (i = 0; i < animalItems.length; i++) {
        let animal = $(animalItems[i]).attr('animal');
        let card = $(animalItems[i]).attr('card');

        $('.animal-container-content-column[card="' + card + '"][animal="' + animal + '"] .animal-card img').attr('src', gameData.img_src[animal][card]);
    }
}

changeAllImages();

function changeEnergy(value) {
    if (intCurrentEnergy == 0 && value == -1)
        return false;
    if (intCurrentEnergy == 10 && value == 1)
        return false;

    intCurrentEnergy += value;
    $('.energy-counter').text(intCurrentEnergy);
}

$('.energy-plus').on('click', () => {
    changeEnergy(1);
});

$('.energy-minus').on('click', () => {
    changeEnergy(-1);
});

$('.energy-counter').on('mousewheel', (evt) => {
    if (evt.originalEvent.wheelDelta >= 0)
        changeEnergy(1);
    else
        changeEnergy(-1);
});

function changeCardQuantity(animal, card, value) {
    let intCurrentQuantity = parseInt($('.animal-container-content-column[animal="' + animal + '"][card="' + card + '"] .animal-card-quantity').text());
    if (intCurrentQuantity == 0 && value == -1)
        return false;
    if (intCurrentQuantity == 2 && value == 1)
        return false;

    intCurrentQuantity += value;
    $('.animal-container-content-column[animal="' + animal + '"][card="' + card + '"] .animal-card-quantity').text(intCurrentQuantity);
    gameData.qtd[animal][card] = intCurrentQuantity;
    localStorage.setItem('gameData', JSON.stringify(gameData));
    updateProbability();
}

$('.animal-plus').on('click', (evt) => {
    let animal = $(evt.target).parent().parent().attr('animal');
    let card = $(evt.target).parent().parent().attr('card');

    changeCardQuantity(animal, card, 1);
});

$('.animal-minus').on('click', (evt) => {
    let animal = $(evt.target).parent().parent().attr('animal');
    let card = $(evt.target).parent().parent().attr('card');

    changeCardQuantity(animal, card, -1);
});

$('.animal-card-quantity').on('mousewheel', (evt) => {
    let animal = $(evt.target).parent().parent().attr('animal');
    let card = $(evt.target).parent().parent().attr('card');
    if (evt.originalEvent.wheelDelta >= 0)
        changeCardQuantity(animal, card, 1);
    else
        changeCardQuantity(animal, card, -1);
});

function updateProbability() {
    let animalItems = $('.animal-container-content-column').each(() => { return $(this); });
    let qtdTotalCartas = 12;

    for (i = 0; i < animalItems.length; i++) {
        if ($(animalItems[i]).attr('disabled') == true) {
            qtdTotalCartas -= 1;
            continue;
        }

        let animal = $(animalItems[i]).attr('animal');
        let card = $(animalItems[i]).attr('card');
        let qtd = parseInt($('.animal-container-content-column[animal="' + animal + '"][card="' + card + '"] .animal-card-quantity').text());
        if (qtd == 2)
            qtdTotalCartas -= 1;
    }


    for (i = 0; i < animalItems.length; i++) {
        let animal = $(animalItems[i]).attr('animal');
        let card = $(animalItems[i]).attr('card');
        let qtd = parseInt($('.animal-container-content-column[animal="' + animal + '"][card="' + card + '"] .animal-card-quantity').text());

        if ($(animalItems[i]).attr('disabled') == true || qtd == 2)
            $('.animal-container-content-column[animal="' + animal + '"][card="' + card + '"] .animal-card-probability span').text(0);
        else
            $('.animal-container-content-column[animal="' + animal + '"][card="' + card + '"] .animal-card-probability span').text((1 / qtdTotalCartas * 100).toFixed(2));
    }
}

updateProbability();