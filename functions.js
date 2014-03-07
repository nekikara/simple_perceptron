"use strict";

// NumPyのnp.c_[]メソッドを実装する
// ブログで掲載
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
// ブログで掲載
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

// np.vstack
function vstack(array) {
    console.log("call vstack");
    var stack = array.shift();
    if (stack instanceof Array) {
        stack = math.matrix([ stack ]);
    } else {
        var dimension = stack.size().length;
        if (dimension == 1) {
            stack.resize([1, dimension[0]]);
        }
    }
    for(var i in array) {
        stack["_data"].push(array[i]);
    }
    return stack;
}

// ここからは行列操作ではなく
// 機械学習の部分

// 識別関数の本体
function predict(wvec, xvec) {
    var out = math.multiply(wvec, xvec);
    if (out >= 0) {
        return 1;
    } else {
        return -1;
    }
}

// 学習部
function train(wvec, xvec, label) {
    var y = predict(wvec, xvec);
    var c = 0.5;
    if (y * label < 0) {
        return math.add(wvec, math.multiply(math.multiply(c, label), xvec));
    } else {
        return wvec;
    }
}
