function initStock(stockCollection) {
    let svg = d3.select('#market-container').append('svg')
        .attr('height', '100%')
        .attr('width', '100%');

    // set the dimensions and margins of the graph
    let margin = {top: 20, right: 20, bottom: 30, left: 50};
    let w = svg.style('width');
    let width = w.substr(0,w.length-2) - margin.left - margin.right;
    let h = svg.style('height');
    let height = h.substr(0,h.length-2) - margin.top - margin.bottom;


    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueLine = d3.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d); });


    let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x.domain([0, 100]);
    y.domain([-5, 5]);

    // Add the valueLine path.
    g.append("path")
        .data([stockCollection])
        .attr("class", "line")
        .attr("d", valueLine)
        .style('fill', 'none')
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5);

    // Add the X Axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // Add the Y Axis
    g.append("g")
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y));

    let settings = {'svg': svg, 'valueLine': valueLine, 'y': y};
    return settings;
}

function updateStock(stockCollection, settings) {
    let svg = settings.svg;
    let valueLine = settings.valueLine;
    let y = settings.y;

    y.domain([Math.min(-5,d3.min(stockCollection, function(d) {return d; })),
    Math.max(5,d3.max(stockCollection, function(d) {return d; }))]);

    svg.select('.line').transition()
        .duration(100)
        .attr('d', valueLine(stockCollection));

    svg.select('.y-axis').transition()
        .duration(100)
        .call(d3.axisLeft(y));
}


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

function updateNews(secondCount, stock) {
    let news = [
        {phrase: "World Alcohol Shortage", reaction: "Market Goes Down!", value: -1, probability: 0.2},
        {phrase: "Alcohol is Healthy!", reaction: "Market Goes Up!", value: 1, probability: 0.1},
        {phrase: "No Alcohol News", reaction: "", value: 0, probability: 0.6},
        {phrase: "Beers in Great Demand", reaction: "Market Goes Up!", value: 1, probability: 0.1}
    ];

    // Update news
    const newsUpdate = 4;
    let newsIndex = 0;
    d3.select('#news-time').text(Math.round(newsUpdate - (secondCount-0.5)%newsUpdate - 1));
    if (secondCount % newsUpdate == 0) {
        // Work around to select different news items based on given probability
        let temp = Math.random();
        console.log(temp);
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

    let tempText = d3.select('#news-phrase').text();
    for(let i = 0; i < news.length; i++) {
        if(tempText === news[i].phrase) {
            if(news[i].value == -1) {
                stock -= .5;
            } else if(news[i].value == 1) {
                stock += .5;
            }
            break;
        }
    }

    return stock;
}


function initDrink(idTag) {
    //Set size of svg element and chart
    let svg = d3.select(idTag).append('svg')
        .attr('width', '100%')
        .attr('height', '100%');
    let margin = {top: 10, right: 10, bottom: 10, left: 10};
    let w = svg.style('width');
    let width = w.substr(0,w.length-2) - margin.left - margin.right;
    let h = svg.style('height');
    let height = h.substr(0,h.length-2) - margin.top - margin.bottom;
    let categoryIndent = width/10;
    let defaultBarWidth = width*2;

    //Set up scales
    var x = d3.scaleLinear()
        .domain([0,defaultBarWidth])
        .range([0,width]);
    var y = d3.scaleBand()
        .rangeRound([0, height]).padding(0.1);

    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Package and export settings
    let settings = {
        margin:margin, width:width, height:height, categoryIndent:categoryIndent,
        svg:svg, x:x, y:y
    };
    return settings;
}

function updatePrices(secondCount, stock, beerSettings, spiritSettings) {
    const priceUpdate = 5;
    if (secondCount % priceUpdate == 0 || secondCount < 1.5) {
        updateBeer(stock, beerSettings);
        updateSpirits(stock, spiritSettings);
    }
}

function updateBeer(stock, beerSettings) {
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
        beer[i].priceCurrent = beer[i].priceOriginal - rnorm(stock/5, .2);
        if (beer[i].priceCurrent < 1) {
            beer[i].priceCurrent = 1
        }
    }

    updateBarChart(beer, beerSettings);
}

function updateSpirits(stock, spiritSettings) {
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
        spirit[i].priceCurrent = spirit[i].priceOriginal - rnorm(stock / 5, .2);
        if (spirit[i].priceCurrent < 1) {
            spirit[i].priceCurrent = 1
        }
    }

    updateBarChart(spirit, spiritSettings);
}

function updateBarChart(drink, settings) {
    //Import settings
    let margin = settings.margin;
    let width = settings.width;
    let height = settings.height;
    let categoryIndent = settings.categoryIndent;
    let svg=settings.svg;
    let x=settings.x;
    let y=settings.y;

    //Reset domains
    y.domain(drink.sort(function(a,b){
        return b.priceCurrent - a.priceCurrent;
    })
        .map(function(d) { return d.name; }));

    let barMax = d3.max(drink, function(d) {
        return d.priceCurrent;
    });
    x.domain([0,barMax]);

    //Bind new data to chart rows

    //Create chart row and move to below the bottom of the chart
    let chartRow = svg.selectAll("g.chartRow")
        .data(drink, function(d){ return d.name});
    let newRow = chartRow
        .enter()
        .append("g")
        .attr("class", "chartRow")
        .attr("transform", "translate(0," + height + margin.top + margin.bottom + ")");

    //Add rectangles
    newRow.insert("rect")
        .attr("class","bar")
        .attr("x", 0)
        .attr("opacity",0)
        .attr("height", y.bandwidth())
        .attr("width", function(d) { return x(d.priceCurrent);});

    //Add value labels
    newRow.append("text")
        .attr("class","label")
        .attr("y", y.bandwidth()/2)
        .attr("x",0)
        .attr("opacity",0)
        .attr("dy",".35em")
        .attr("dx","0.5em")
        .text(function(d){return d.priceCurrent;});

    //Add Headlines
    newRow.append("text")
        .attr("class","category")
        .attr("text-overflow","ellipsis")
        .attr("y", y.bandwidth()/2)
        .attr("x",categoryIndent)
        .attr("opacity",0)
        .attr("dy",".35em")
        .attr("dx","0.5em")
        .text(function(d){return d.name});

    //Update bar widths
    chartRow.select(".bar").transition()
        .duration(300)
        .attr("width", function(d) { return x(d.priceCurrent);})
        .attr("opacity",1);

    //Update data labels
    chartRow.select(".label").transition()
        .duration(300)
        .attr("opacity",1)
        .text(function(d) {return "$" + Math.round(d.priceCurrent*10)/10; });

    //Fade in categories
    chartRow.select(".category").transition()
        .duration(300)
        .attr("opacity",1);

    chartRow.exit().transition()
        .style("opacity","0")
        .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
        .remove();

    let delay = function(d, i) { return 200 + i * 30; };

    chartRow.transition()
        .delay(delay)
        .duration(900)
        .attr("transform", function(d){ return "translate(0," + y(d.name) + ")"; });
}


function updateMean(stock) {
    const tooLow = -4.5;
    const tooHigh = 6;
    const adjustment = 0.2;
    if (stock < tooLow) {
        mean = adjustment;
    } else if (stock > tooHigh) {
        mean = -adjustment;
    } else {
        mean = 0;
    }
    return mean;
}

function updateVol(secondCount, stockCollection){
    if (secondCount > 200) {
        let current100 = stockCollection.slice(stockCollection.length - 1, stockCollection.length);
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
