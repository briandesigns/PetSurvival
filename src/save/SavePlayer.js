var savePlayer = function (playerLayer) {
    var dict = cc.sys.localStorage;
    dict.setItem("hello", "hi");
    cc.log(dict.getItem("hello"));
};

var loadPlayer = function () {
    var dict = cc.sys.localStorage;
    cc.log(dict.getItem("hello"));
}