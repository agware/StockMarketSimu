/**
 * Created by Alex on 11/11/2017.
 */

function graphSimu() {
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

    let beer = [
        {drink: "Apple Cider", priceCurrent: 3, priceOriginal: 3},
        {drink: "Pear Cider", priceCurrent: 3, priceOriginal: 3},
        {drink: "Corona", priceCurrent: 3.5, priceOriginal: 3.5},
        {drink: "Asahi", priceCurrent: 3, priceOriginal: 3},
        {drink: "Stella", priceCurrent: 3, priceOriginal: 3},
        {drink: "Peroni", priceCurrent: 3, priceOriginal: 3},
        {drink: "VB", priceCurrent: 2, priceOriginal: 2},
    ];

//ToDo: Rename this?
    const secondsConverter = 5;
    const speed = 100;
    const priceUpdate = 300*secondsConverter/speed;
    const newsUpdate = 700*secondsConverter/speed;

    const max = 4 * 3600 * secondsConverter;

    const time = 100;
    const gap = 100;
}

