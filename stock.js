/**
 * Created by Alex on 12/11/2017.
 */
const yBound = {'min': -2, 'max': 2};
let y;
let x;
let stockLine;

function initStockGraph(stocks, maxStocksRecorded) {
    let margin = {top: 45, right: 20, bottom: 30, left: 50};

    let svg = d3.select('#market-container').append('svg')
        .attr('height', '100%')
        .attr('width', '100%');

    svg.append('text')
        .attr('x', margin.left)
        .attr('y', margin.top - 10)
        .attr('class', 'title')
        .text('Financial Market');

    let w = svg.style('width');
    let width = w.substr(0,w.length-2) - margin.left - margin.right;
    let h = svg.style('height');
    let height = h.substr(0,h.length-2) - margin.top - margin.bottom;

    let g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('id', 'stock-graph');

    x = d3.scaleLinear()
        .domain([0, maxStocksRecorded])
        .range([0, width]);
    y = d3.scaleLinear()
        .domain([yBound.min, yBound.max])
        .range([height, 0]);

    // define the line
    stockLine = d3.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d); });

    // add the stock line
    g.append("path")
        .data([stocks])
        .attr("class", "line")
        .attr("d", stockLine);

    // add the X Axis
    g.append('g')
        .attr('transform', 'translate(0,' + y(0) + ')')
        .attr('id', 'x-axis')
        .call(d3.axisBottom(x));

    // add the Y Axis
    g.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y));

    g.append('circle')
        .attr('r', 4)
        .attr('cx',x(stocks.length))
        .attr('cy',0)
        .attr('id','stock-circle');
}

function updateStockGraph(stocks) {
    let g = d3.select('#stock-graph');

    y.domain([Math.min(yBound.min,d3.min(stocks, function(d) {return d; })),
        Math.max(yBound.max,d3.max(stocks, function(d) {return d; }))]);

    let duration = 50;

    g.select('#stock-circle').transition()
        .duration(duration)
        .attr('cx', x(stocks.length)-4)
        .attr('cy', y(stocks[stocks.length-1]));

    g.select('.line').transition()
        .duration(duration)
        .attr('d', stockLine(stocks));

    g.select('#x-axis').transition()
        .duration(duration)
        .attr('transform', 'translate(0,' + y(0) + ')');

    g.select('.y-axis').transition()
        .duration(duration)
        .call(d3.axisLeft(y));



}