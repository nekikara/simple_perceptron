"use strict";
var item_num = 100,
    half_item_num = parseInt(item_num/2),
    loop = 1000,
    init_wvec = [1,-1,1],
    math = mathjs(), // mathjsを初期化
    x1_1,
    x1_2,
    x2_1,
    x2_2,
    z;

// ランダムの数を行列に格納
for (var i=0; i < 4; i++) {
    // 要素が1の行列-dimension=1
    var ones = math.ones(half_item_num);
    // ランダム行列-dimension=1
    var randoms = math.multiply(10, generate_random_matrix(half_item_num));
    switch(i) {
        case 0:
            // 第１象限のX座標
            x1_1 = math.add(ones, randoms);
            break;
        case 1:
            // 第１象限のY座標
            x1_2 = math.add(ones, randoms);
            break;
        case 2:
            // 第３象限のX座標
            x2_1 = math.multiply(-1, math.add(ones, randoms));
            break;
        case 3:
            // 第３象限のY座標
            x2_2 = math.multiply(-1, math.add(ones, randoms));
            break;
    }
}
z = math.ones(half_item_num);

// functions.jsを参照
// dimension=2の行列にしています
// 第１象限の行列
var x1 = c_(x1_1, x1_2, z);
// 第3象限の行列
var x2 = c_(x2_1, x2_2, z);
// class_xはx1とx2をまとめたもの
var class_x = math.concat(x1);
// np.r_[x1,x2]の代わり
for (var i=0; i < half_item_num; i++) {
    class_x["_data"].push(x2["_data"][i])
}

var label1 = math.ones(half_item_num);
var label2 = math.multiply(-1, math.ones(half_item_num));
// class_xの時の処理と同じ
var label_x = math.concat(label1);
for (var i=0; i < half_item_num; i++) {
    label_x["_data"].push(label2["_data"][i])
}

// functions.jsを参照
var wvec = vstack([init_wvec, init_wvec]);

// 学習部
for (var j=0; j < loop; j++) {
    for (var i=0; i < item_num; i++) {
        // train()関数はfunctions.jsを参照
        var wvec_new = train(wvec["_data"][wvec["_data"].length-1], class_x["_data"][i], label_x["_data"][i]);
        wvec = vstack([ wvec, wvec_new ]);
    }
}

// wvecの最後のベクトル要素を取得
var W = wvec["_data"][wvec["_data"].length-1];

// 分離直線をデータを作成
var x_fig = [];
for (var i=0; i < 21; i++) {
    x_fig[i] = i - 10;
}
var y_fig = [];
for (var i=0; i < x_fig.length; i++) {
    // pushの中身はax+by+c=0 => y=-(b/a)x-(c/a)としている
    y_fig.push(-(W[1]/W[0])*x_fig[i]-(W[2]/W[1]));
}
// functions.jsを参照
var lineset = c_(math.matrix(x_fig), math.matrix(y_fig));

// 第１象限の点の座標データ
var X_1 = x1.subset(math.index([ 0, x1.size()[0] ], [0,1]));
var Y_1 = x1.subset(math.index([ 0, x1.size()[0] ], [1,2]));
var dataset_1 = c_(X_1, Y_1)["_data"];

// 第３象限の点の座標データ
var X_3 = x2.subset(math.index([ 0, x2.size()[0] ], [0,1]));
var Y_3 = x2.subset(math.index([ 0, x2.size()[0] ], [1,2]));
var dataset_3 = c_(X_3, Y_3)["_data"];

// D3.jsのスケールを作成するデータ
var dataset = math.concat(dataset_3);
for (var i=0; i < dataset_1.length; i++) {
    dataset.push(dataset_1[i]);
}

// ↓↓↓↓↓ D3.jsの描画ゾーン ↓↓↓↓↓
// svgの設定値
var w = 600,
    h = 600,
    padding = 30;

// svgの初期設定
var svg = d3.select("div")
.append("svg")
.attr("class", "svg")
.attr("width", w)
.attr("height", h);

// 画面のスケールを設定
var xScale = d3.scale.linear()
.domain([d3.min(dataset, function(d) {return d[0]}), d3.max(dataset, function(d) { return d[0]; })])
.range([padding, w-padding]);
var yScale = d3.scale.linear()
.domain([d3.min(dataset, function(d) {return d[1]}), d3.max(dataset, function(d) { return d[1]; })])
.range([h-padding, padding]);

// 第１象限の描画
var dot_1 = svg.selectAll("circle.dot_1")
.data(dataset_1)
.enter()
.append("circle")
.attr("cx", function (d) {
    return xScale(d[0]);
})
.attr("cy", function (d) {
    return yScale(d[1]);
})
.attr("r", 4)
.attr("fill", "#ff5522")
.attr("class", "dot_1");

// 第３象限の描画
var dot_3 = svg.selectAll("circle.dot_3")
.data(dataset_3)
.enter()
.append("circle")
.attr("cx", function (d) {
    return xScale(d[0]);
})
.attr("cy", function (d) {
    return yScale(d[1]);
})
.attr("r", 4)
.attr("fill", "#55ff22")
.attr("class", "dot_3");

// 分離直線のデータを処理
var line = d3.svg.line()
.x(function (d) {
    return xScale(d[0]);
})
.y(function (d) {
    return yScale(d[1]);
})

// 分離直線を描画
var path = svg.append("path")
.attr("d", line(lineset["_data"]))
.attr("class", "path");

// 軸を設定
var xAxis = d3.svg.axis()
.scale(xScale)
.orient("bottom");
var yAxis = d3.svg.axis()
.scale(yScale)
.orient("left")
.ticks(5);

// 軸の描画
svg.append("g")
.attr("class", "axis")
.attr("transform", "translate(0," + (h - padding) + ")")
.call(xAxis);

svg.append("g")
.attr("class", "axis")
.attr("transform", "translate(" + padding + ",0)")
.call(yAxis);

