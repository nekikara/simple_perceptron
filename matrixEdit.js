"use strict";

// NumPyのnp.c_[]メソッドを実装する
function c_() {
    var dimension = arguments[0].size().length,
        n = arguments.length;

    if (dimension == 1) {
        var m = arguments[0].size()[0],
            concat_matrix = math.matrix([m, n]);

        for(var i=0; i < n; i++) {
            for (var j=0; j < m; j++) {
                var replacement = arguments[i].subset(math.index(j));
                concat_matrix.subset(math.index(j,i), replacement);
            }
        }

        return concat_matrix;

    } else {
        var concat_state = "math.concat(";

        for(var i=0; i < n; i++) {
            if (i == n-1) {
                concat_state += arguments[i];
                continue;
            }
            concat_state += arguments[i]+",";
        }

        concat_state += ")";

        return math.matrix( eval(concat_state) );
    }
}

// ランダムな行列を返す
function generate_random_matrix(size) {
    // sizeをArrayにしておく
    if (typeof size == "number") {
        size = [size];
    }
    
    if (size == null || size.length == 0) {
        return Math.random(size);
    } else {
        var matrix = [],
            use_size = size.concat(), // sizeをコピーしておく、値が変更されないように
            value = use_size[0];

        use_size.shift();             // 配列の最初の要素を削除
        for(var i = 0; i < value; i++) {
            // 再帰部分
            matrix.push(generate_random_matrix(use_size));
        }
        return math.matrix(matrix);
    }
}
