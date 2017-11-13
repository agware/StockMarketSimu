/**
 * Created by Alex on 12/11/2017.
 */
let drinkMargin = {top: 40, right: 10, bottom: 10, left:10};

function updateBeer(tag, stock) {
    let beer = [
        {name: "Apple Cider", price: 3},
        {name: "Pear Cider", price: 3},
        {name: "Corona", price: 3.5},
        {name: "Asahi", price: 3},
        {name: "Stella", price: 3},
        {name: "Peroni", price: 3},
        {name: "VB", price: 2},
    ];

    for (let i = 0; i < beer.length; i++) {
        beer[i].price = beer[i].price - rnorm(stock/5, .2);
        beer[i].price = Math.round(beer[i].price*10)/10;
        if (beer[i].price < 1) {
            beer[i].price = 1
        }
    }

    updateDrinkChart(tag, beer);
}

function updateSpirits(tag, stock) {
    let spirit = [
        {name: "Vodka", price: 2.5},
        {name: "Jack Daniels", price: 3},
        {name: "Gin", price: 3},
        {name: "Tequila", price: 3},
        {name: "Jim Beam", price: 2.7},
        {name: "Rum", price: 3},
        {name: "Chambord", price: 3.5},
        {name: "Baileys", price: 2.7},
        {name: "Malibu", price: 3},
        {name: "Jaegar", price: 3}
    ];

    for (let i = 0; i < spirit.length; i++) {
        spirit[i].price = spirit[i].price - rnorm(stock / 5, .2);
        spirit[i].price = Math.round(spirit[i].price*10)/10;
        if (spirit[i].price < 1) {
            spirit[i].price = 1;
        }
    }

    updateDrinkChart(tag, spirit);
}

function initDrinkChart(tag) {

    let svg = d3.selectAll('#' + tag + '-container').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('id', tag + '-svg');

    svg.append('g')
        .attr('transform', 'translate(' + drinkMargin.left + ',' + drinkMargin.top + ')')
        .attr('id', tag + '-g');


    let title = '';
    if(tag === 'beer') {
        title = 'Beer Prices';
    } else if (tag == 'spirits') {
        title = 'Spirits Prices';
    }
    svg.append('text')
        .attr('x', drinkMargin.left)
        .attr('y', drinkMargin.top - 5)
        .attr('class', 'title')
        .text(title);
}

function updateDrinkChart(tag, drink) {

    let svg = d3.select('#' + tag + '-svg');
    let g = d3.select('#' + tag + '-g');

    let h = svg.style('height');
    let height = h.substr(0,h.length-2) - drinkMargin.top - drinkMargin.bottom;
    let w = svg.style('width');
    let width = w.substr(0,w.length-2) - drinkMargin.left - drinkMargin.right;


    // Set up scales
    let barMax = d3.max(drink, function(d) { return d.price;}) + 0.2;
    let x = d3.scaleLinear()
        .domain([0,barMax])
        .range([0,width]);

    let y = d3.scaleBand()
        .domain(drink.sort(function(a,b) { return b.price - a.price}).map(function(d) { return d.name;}))
        .rangeRound([0, height]).padding(0.1);

    // Bind the new data to the chart rows
    let chartRow = g.selectAll('g.chartRow')
        .data(drink, function(d) { return d.name; });

    let newRow = chartRow.enter()
        .append('g')
        .attr('transform', 'translate(0,' + height + drinkMargin.top + drinkMargin.bottom + ')')
        .attr('class', 'chartRow');


    // ----- Add ----- //

    // Add the bar
    newRow.insert('rect')
        .attr('x', 0)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('height', y.bandwidth())
        .attr('width', function(d) { return x(d.price);})
        .attr('opacity', 0)
        .attr('class', 'bar');

    // Add the prices
    newRow.append('text')
        .attr('y', y.bandwidth()/2)
        .attr('x', 0)
        .attr('opacity', 0)
        .attr('dy', '.35em')
        .attr('dx', '0.5em')
        .attr('class', 'price');

    // Add the drink name
    newRow.append('text')
        .attr('y', y.bandwidth()/2)
        .attr('x', width/8)
        .attr('opacity', 0)
        .attr('dy', '.35em')
        .attr('dx', '0.5em')
        .attr('class', 'name')
        .text(function(d) { return d.name; });


    //---- Update ----//

    let duration = 300;

    // Update the bar widths
    chartRow.select('.bar').transition()
        .duration(duration)
        .attr('width', function(d) { return x(d.price); })
        .attr('opacity', 1);

    // Update prices
    chartRow.select('.price').transition()
        .duration(duration)
        .attr('opacity', 1)
        .text(function(d) {return '$' + d.price; });

    // Update names
    chartRow.select('.name').transition()
        .duration(duration)
        .attr('opacity', 1);

    chartRow.exit().transition()
        .style("opacity","0")
        .attr("transform", "translate(0," + (height + drinkMargin.top + drinkMargin.bottom) + ")")
        .remove();

    let delay = function(d, i) { return 200 + i * 30; };
    chartRow.transition()
        .delay(delay)
        .duration(900)
        .attr("transform", function(d){ return "translate(0," + y(d.name) + ")"; });
}