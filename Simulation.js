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

function updateNews(secondCount, current) {
    let news = [
        {phrase: "World Alcohol Shortage", reaction: "Market Goes Down!", value: -1, probability: 0.1},
        {phrase: "Alcohol is Healthy!", reaction: "Market Goes Up!", value: 1, probability: 0.1},
        {phrase: "No Alcohol News", reaction: "", value: 0, probability: 0.7},
        {phrase: "Beers in Great Demand", reaction: "Market Goes Up!", value: 1, probability: 0.1}
    ];

    for(let i = 0; i < news.length; i++) {
        if(news[i].phrase.localeCompare(d3.select('#news-phrase').text())) {
            if(news[i].value == -1) {
                current -= 1;
            } else if(news[i].value == 1) {
                current += 1;
            }
            break;
        }
    }

    // Update news
    const newsUpdate = 7;
    let newsIndex = 0;
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
    return current;
}

function updatePrices(secondCount) {
    const priceUpdate = 3;
    if (secondCount % priceUpdate == 0) {
        updateBeer(current);
        updateSpirits(current);
    }
}

function initBeer() {
    let beer = [
        {name: "Apple Cider", priceCurrent: 3, priceOriginal: 3},
        {name: "Pear Cider", priceCurrent: 3, priceOriginal: 3},
        {name: "Corona", priceCurrent: 3.5, priceOriginal: 3.5},
        {name: "Asahi", priceCurrent: 3, priceOriginal: 3},
        {name: "Stella", priceCurrent: 3, priceOriginal: 3},
        {name: "Peroni", priceCurrent: 3, priceOriginal: 3},
        {name: "VB", priceCurrent: 2, priceOriginal: 2},
    ];

    let svg = d3.select("#beer-container").append("svg")
            .attr('width', '100%')
            .attr('height', '100%');

    let margin = {top: 20, right: 20, bottom: 30, left: 40};
    let w = svg.style('width');
    let width = w.substr(0,w.length-2) - margin.left - margin.right;
    let h = svg.style('height');
    let height = h.substr(0,h.length-2)  - margin.top - margin.bottom;

    let x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    let y = d3.scaleLinear().rangeRound([height, 0]);

    let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(beer.map(function(d) { return d.name; }));
    y.domain([0, d3.max(beer, function(d) { return d.priceCurrent; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(d3.max(beer, function(d) { return d.priceCurrent; })))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price");

    g.selectAll(".bar")
        .data(beer)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.priceCurrent); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.priceCurrent); });
}

function updateBeer(current) {
    let beer = [
        {name: "Apple Cider", priceCurrent: 3, priceOriginal: 3},
        {name: "Pear Cider", priceCurrent: 3, priceOriginal: 3},
        {name: "Corona", priceCurrent: 3.5, priceOriginal: 3.5},
        {name: "Asahi", priceCurrent: 3, priceOriginal: 3},
        {name: "Stella", priceCurrent: 3, priceOriginal: 3},
        {name: "Peroni", priceCurrent: 3, priceOriginal: 3},
        {name: "VB", priceCurrent: 2, priceOriginal: 2},
    ];

    for (let i = 0; i < beer.length; i++) {
        beer[i].priceCurrent = beer[i].priceOriginal - rnorm(beer.length, current / 5, .2);
        if (beer[i].priceCurrent < 1) {
            beer[i].priceCurrent = 1
        }
    }

}

function updateSpirits(current) {
    let spirit = [
        {name: "Vodka", priceCurrent: 2.5, priceOriginal: 3},
        {name: "Jack Daniels", priceCurrent: 3, priceOriginal: 3},
        {name: "Gin", priceCurrent: 3, priceOriginal: 3},
        {name: "Tequila", priceCurrent: 3, priceOriginal: 3},
        {name: "Jim Beam", priceCurrent: 2.7, priceOriginal: 2.7},
        {name: "Rum", priceCurrent: 3, priceOriginal: 3},
        {name: "Chambord", priceCurrent: 3.5, priceOriginal: 3.5},
        {name: "Baileys", priceCurrent: 2.7, priceOriginal: 2.7},
        {name: "Malibu", priceCurrent: 3, priceOriginal: 3},
        {name: "Jaegar", priceCurrent: 3, priceOriginal: 3}
    ];

    for (let i = 0; i < spirit.length; i++) {
        spirit[i].priceCurrent = spirit[i].priceOriginal - rnorm(spirit.length, current / 5, .2);
        if (spirit[i].priceCurrent < 1) {
            spirit[i].priceCurrent = 1
        }
    }
}

function updateMean(current) {
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
    return mean;
}

function updateVol(secondCount, currentCollection){
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
    return vol;
}
