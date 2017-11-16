/**
 * Created by Alex on 12/11/2017.
 */
function initNews() {
    let newsSVG = d3.select("#news-container").append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

    newsSVG.append('text')
        .attr('x', '5%')
        .attr('y', '20%')
        .attr('class', 'news')
        .attr('id', 'news-time')
        .text('');

    newsSVG.append('text')
        .attr('x', '5%')
        .attr('y', '50%')
        .attr('class', 'news')
        .attr('id', 'news-phrase')
        .text('');

    newsSVG.append('text')
        .attr('x', '5%')
        .attr('y', '85%')
        .attr('class', 'news')
        .attr('id', 'news-reaction')
        .text('');
}

function updateNews(stock) {
    let news = [
        {phrase: "World Alcohol Shortage", reaction: "Market Goes Down!", value: -1, probability: 0.1},
        {phrase: "The Whole World is Hungover", reaction: "Market Goes Down!", value: -1, probability: 0.1},
        {phrase: "North Korea Stockpiles Drinks", reaction: "Market Goes Down!", value: -1, probability: 0.1},
        {phrase: "Beers in Great Demand", reaction: "Market Goes Up!", value: 1, probability: 0.1},
        {phrase: "Alcohol is Healthy!", reaction: "Market Goes Up!", value: 1, probability: 0.1},
        {phrase: "The Yes Vote Wins!", reaction: "Market Goes Up!", value: 1, probability: 0.1},
        {phrase: "Exams are Finished!", reaction: "Market Goes Up!", value: 1, probability: 0.1},
        {phrase: "Vodka Cures Diabetes!", reaction: "Market Goes Up!", value: 1, probability: 0.1},
        {phrase: "The Cricket Season Starts!", reaction: "Market Goes Up!", value: 1, probability: 0.1},
        {phrase: "Drinking Games Allowed Again!", reaction: "Market Goes Up!", value: 1, probability: 0.1}
    ];

    // Update news

    let newsIndex = 0;
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
    d3.select('#news-reaction').text(news[newsIndex].reaction);

    const shift = 2;
    if(news[newsIndex].value < 0) {
        stock -= shift;
    } else if(news[newsIndex].value > 0) {
        stock += shift;
    }


    return stock;
}