let current = rnorm(0,0.1);
const gap = 100;
let currentCollection = [];
for(let i = 0; i < gap; i++) {
    currentCollection.push(rnorm(0,.01));
}
let secondCount = 0;
let mean = 0;
let newsIndex = 2;
let vol = 0.25;

initNews();

d3.timer(generateValues);

function initNews() {
    let newsSVG = d3.select("#news-container").append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

    newsSVG.append('text')
        .attr('x', '10%')
        .attr('y', '20%')
        .style('font-family', 'sans-serif')
        .style('font-size', '2vw')
        .text('Latest News');

    newsSVG.append('text')
        .attr('x', '40%')
        .attr('y', '20%')
        .style('font-family', 'sans-serif')
        .style('font-size', '2vw')
        .text('Time Until Price Updates');

    newsSVG.append('text')
        .attr('x', '5%')
        .attr('y', '70%')
        .attr('id', 'news-phrase')
        .style('font-family', 'sans-serif')
        .style('font-size', '2vw')
        .text('');

    newsSVG.append('text')
        .attr('x', '60%')
        .attr('y', '70%')
        .attr('id', 'news-time')
        .style('font-family', 'sans-serif')
        .style('font-size', '4vw')
        .text('0');
}

function generateValues(timeElapsed) {
    let secondsElapsed = Math.floor(timeElapsed/1000);

    const secondsInHour = 360;
    const hours = 4;
    const maxTime = hours * secondsInHour;
    if(secondsElapsed >= maxTime) {
        // terminate value generation
        return true;
    }

    if(secondsElapsed > secondCount) {
        secondCount = secondsElapsed;

        updateNews();
        updatePrices();

        current += rnorm(mean, vol);
        console.log(current);
        currentCollection.push(current);
        updateMean();

        // ToDo: update charts here

        updateVol();

    }
}

function updateNews() {
    let news = [
        {phrase: "World Alcohol Shortage", reaction: "Market Goes Down!", value: -1, probability: 0.1},
        {phrase: "Alcohol is Healthy!", reaction: "Market Goes Up!", value: 1, probability: 0.1},
        {phrase: "No Alcohol News", reaction: "", value: 0, probability: 0.7},
        {phrase: "Beers in Great Demand", reaction: "Market Goes Up!", value: 1, probability: 0.1}
    ];

    // Update current value based on news
    if (news[newsIndex].value == -1) {
        current -= 1;
    } else if (news[newsIndex].value == 1) {
        current += 1;
    }

    // Update news
    const newsUpdate = 7;
    d3.select('#news-time').text(newsUpdate - (secondCount-1)%newsUpdate - 1);
    if (secondCount % newsUpdate == 0) {
        // Work around to select different news items based on given probability
        let temp = Math.random();
        for (let i = 0; i < news.length; i++) {
            if (temp < news[i].probability) {
                newsIndex = i;
                break;
            } else {
                temp -= news[i].probability;
            }
        }
        d3.select('#news-phrase').text(news[newsIndex].phrase);
    }
}

function updatePrices() {
    const priceUpdate = 3;
    if (secondCount % priceUpdate == 0) {
        updateBeer();
        updateSpirits();
    }
}

function updateBeer() {
    let beer = [
        {drink: "Apple Cider", priceCurrent: 3, priceOriginal: 3},
        {drink: "Pear Cider", priceCurrent: 3, priceOriginal: 3},
        {drink: "Corona", priceCurrent: 3.5, priceOriginal: 3.5},
        {drink: "Asahi", priceCurrent: 3, priceOriginal: 3},
        {drink: "Stella", priceCurrent: 3, priceOriginal: 3},
        {drink: "Peroni", priceCurrent: 3, priceOriginal: 3},
        {drink: "VB", priceCurrent: 2, priceOriginal: 2},
    ];

    for (let i = 0; i < beer.length; i++) {
        beer[i].priceCurrent = beer[i].priceOriginal - rnorm(beer.length, current / 5, .2);
        if (beer[i].priceCurrent < 1) {
            beer[i].priceCurrent = 1
        }
    }
}

function updateSpirits() {
    let spirit = [
        {drink: "Vodka", priceCurrent: 2.5, priceOriginal: 3},
        {drink: "Jack Daniels", priceCurrent: 3, priceOriginal: 3},
        {drink: "Gin", priceCurrent: 3, priceOriginal: 3},
        {drink: "Tequila", priceCurrent: 3, priceOriginal: 3},
        {drink: "Jim Beam", priceCurrent: 2.7, priceOriginal: 2.7},
        {drink: "Rum", priceCurrent: 3, priceOriginal: 3},
        {drink: "Chambord", priceCurrent: 3.5, priceOriginal: 3.5},
        {drink: "Baileys", priceCurrent: 2.7, priceOriginal: 2.7},
        {drink: "Malibu", priceCurrent: 3, priceOriginal: 3},
        {drink: "Jaegar", priceCurrent: 3, priceOriginal: 3}
    ];

    for (let i = 0; i < spirit.length; i++) {
        spirit[i].priceCurrent = spirit[i].priceOriginal - rnorm(spirit.length, current / 5, .2);
        if (spirit[i].priceCurrent < 1) {
            spirit[i].priceCurrent = 1
        }
    }
}

function updateMean() {
    const tooLow = -4.5;
    const tooHigh = 6;
    const adjustment = 0.2;
    if (current < tooLow) {
        mean = adjustment;
    } else if (current > tooHigh) {
        mean = -adjustment;
    } else {
        mean = 0;
    }
}

function updateVol(){
    if (secondCount > 200) {
        let current100 = currentCollection.slice(currentCollection.length - 1, currentCollection.length);
        let maxCurrent = current100.reduce(function (a, b) {
            return Math.max(a, b)
        });
        let minCurrent = current100.reduce(function (a, b) {
            return Math.min(a, b)
        });
        if (maxCurrent - minCurrent < 0.55) {
            vol = 0.75;
        } else {
            vol = 0.25;
        }
    }
}

/** Taken from the RandGen library */
/** Important: None of the following is mine */
function rnorm(mean, stdev) {
    var u1, u2, v1, v2, s;
    if (mean === undefined) {
        mean = 0.0;
    }
    if (stdev === undefined) {
        stdev = 1.0;
    }

    do {
        u1 = Math.random();
        u2 = Math.random();

        v1 = 2 * u1 - 1;
        v2 = 2 * u2 - 1;
        s = v1 * v1 + v2 * v2;
    } while (s === 0 || s >= 1);
    rnorm.v2 = v2 * Math.sqrt(-2 * Math.log(s) / s);
    return stdev * v1 * Math.sqrt(-2 * Math.log(s) / s) + mean;
}