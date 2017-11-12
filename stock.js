/**
 * Created by Alex on 12/11/2017.
 */
let y;
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

    // define the line
    stockLine = d3.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d); });

    // add the stock line
    g.append("path")
        .data([stocks])
        .attr("class", "line")
        .attr("d", stockLine);

    let x = d3.scaleLinear()
        .domain([0, maxStocksRecorded])
        .range([0, width]);
    y = d3.scaleLinear().range([height, 0]);

    // add the X Axis
    g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    // add the Y Axis
    g.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y));
}

function updateStockGraph(stocks) {
    let g = d3.select('#stock-graph');

    const yBound = {'min': -2, 'max': 2};
    y.domain([Math.min(yBound.min,d3.min(stocks, function(d) {return d; })),
        Math.max(yBound.max,d3.max(stocks, function(d) {return d; }))]);

    g.select('.line').transition()
        .duration(100)
        .attr('d', stockLine(stocks));

    g.select('.y-axis').transition()
        .duration(100)
        .call(d3.axisLeft(y));

}