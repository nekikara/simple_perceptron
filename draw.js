"use strict";
var dataset,
    item_num = 100,
    loop = 1000,
    init_wvec = [1,-1,1],
    w = 600,
    h = 600,
    padding = 30;


// mathjsを初期化
var math = mathjs();
var x1_1,
    x1_2,
    x2_1,
    x2_2,
    z;

for (var i=0; i < 4; i++) {
    var ones = math.ones(parseInt(item_num / 2));
    var randoms = math.multiply(10, generate_random_matrix(parseInt(item_num/2)));
    switch(i) {
        case 0:
            x1_1 = math.add(ones, randoms);
            break;
        case 1:
            x1_2 = math.add(ones, randoms);
            break;
        case 2:
            x2_1 = math.multiply(-1, math.add(ones, randoms));
            break;
        case 3:
            x2_2 = math.multiply(-1, math.add(ones, randoms));
            break;
    }
}
var z = math.ones(parseInt(item_num / 2));

var x1 = c_(x1_1, x1_2, z);
var x2 = c_(x2_2, x2_2, z);
console.log(x1);
console.log(x2);

var svg = d3.select("body")
.append("svg")
.attr("class", "svg")
.attr("width", w)
.attr("height", h);

var xScale = d3.scale.linear()
.domain([d3.min(dataset, function(d) {return d[0]}), d3.max(dataset, function(d) { return d[0]; })])
.range([padding, w-padding]);
var yScale = d3.scale.linear()
.domain([d3.min(dataset, function(d) {return d[1]}), d3.max(dataset, function(d) { return d[1]; })])
.range([h-padding, padding]);

var dot = svg.selectAll("circle")
.data(dataset)
.enter()
.append("circle")
.attr("cx", function (d) {
    return xScale(d[0]);
})
.attr("cy", function (d) {
    return yScale(d[1]);
})
.attr("r", 4)
.attr("fill", "#ff5522");

var line = d3.svg.line()
.x(function (d) {
    return xScale(d[0])
})
.y(function (d) {
    return yScale(d[1])
});
var path = svg.append("path")
.attr("d", line(dataset))
.attr("class", "path")

var xAxis = d3.svg.axis()
.scale(xScale)
.orient("bottom");
var yAxis = d3.svg.axis()
.scale(yScale)
.orient("left")
.ticks(5);
svg.append("g")
.attr("class", "axis")
.attr("transform", "translate(0," + (h - padding) + ")")
.call(xAxis);

svg.append("g")
.attr("class", "axis")
.attr("transform", "translate(" + padding + ",0)")
.call(yAxis);

