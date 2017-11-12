/**
 * Created by Alex on 12/11/2017.
 */

function calculateMean(stock) {
    let mean = 0;

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

function calculateVol(secondsElapsed, stocks) {
    //ToDo: Why hinge on 200 secs?
    let vol = 0.25;
    if (secondsElapsed > 200) {
        let maxStock = stocks.reduce(function (a, b) {
            return Math.max(a, b)
        });
        let minStock = stocks.reduce(function (a, b) {
            return Math.min(a, b)
        });
        if (maxStock - minStock < 0.55) {
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