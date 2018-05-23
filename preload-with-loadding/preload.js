(function() {
    // 默认配置
    var defaults = {
        each: null,
        all: null,
        progress: null,
        loadding: null,
        loaddingBg: '#333',
        order: false
    };
    var counter = 0;
    var errorCounter = 0;
    var percent;
    var Preloader;
    //存放加载完成图片的数组
    var loaded = [];

    var progressBar;
    var loaddingDom;
    var Util;

    Util = {
        extend: function(defaults, options) {
            var extended = {};
            var prop;
            for (prop in defaults) {
                if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                    extended[prop] = defaults[prop];
                }
            }
            for (prop in options) {
                if (Object.prototype.hasOwnProperty.call(options, prop)) {
                    extended[prop] = options[prop];
                }
            }
            return extended;
        }
    };

    window.Preloader = function(arr) {
        if (typeof arr === 'undefined') {
            arr = [];
            Array.prototype.forEach.call(document.querySelectorAll('img'), function(ele) {
                arr.push(ele.getAttribute('src') || ele.style.backgroundImage.replace(/url\(['"]?|['"]\)/g, ""));
            });
        }
        if (typeof arr === 'string') arr = [arr];
        return new Loader(arr);
    };

    Loader = function(arr) {
        this.imgList = arr;
    };

    Loader.prototype = {
        load: function(options) {
            document.querySelector('body').style.opacity = '1';
            var imgList = this.imgList;
            options = Util.extend(defaults, options);
            if (typeof options === 'function') {
                defaults.all = options;
                options = defaults;
            }

            if (options.progress) {
                progressBar = this.addProgress(options.progress);
            }

            if (options.loadding) {
                loaddingDom = this.addLoadding(options);
            }

            options.order ? this.loadOrder(options, imgList) : this.loadUnorder(options, imgList);

        },
        // 有序加载
        loadOrder: function(options, imgList) {
            var _this = this;
            var arg = arguments;
            var img = new Image();
            var i = counter + errorCounter;
            if (i == imgList.length) {
                options.all && options.all.call(loaded);
                return;
            }
            img.addEventListener('load', function() {
                counter += 1;
                percent = parseInt((counter + errorCounter) / imgList.length * 100);
                loaded.push(this.src);
                // 每加载完一张图片调用
                options.each && options.each({
                    src: this.src,
                    percent: percent,
                    bar: progressBar
                });
                if (counter === imgList.length) {
                    if (options.progress && options.progress.autoHide) {
                        document.getElementById(progressBar.id).style.display = 'none';
                        document.getElementsByTagName('body')[0].removeChild(document.getElementById(progressBar.id));
                    }
                    if (options.loadding) {
                        document.getElementById(loaddingDom.id).style.display = 'none';
                    }
                    //加载完所有图片后调用
                    options.all && options.all.call(loaded);
                }
                _this.loadOrder.apply(_this, arg);
            });
            img.addEventListener('error', function() {
                errorCounter += 1;
                percent = parseInt((counter + errorCounter) / imgList.length * 100);
                // 成功加载+失败加载的图片数为总图片数的时候执行
                if (counter + errorCounter == imgList.length) {
                    if (options.progress && options.progress.autoHide) {
                        document.getElementById(progressBar.id).style.display = 'none';
                        document.getElementsByTagName('body')[0].removeChild(document.getElementById(progressBar.id));
                    }
                    if (options.loadding) {
                        document.getElementById(loaddingDom.id).style.display = 'none';
                    }
                    //加载完所有图片后调用
                    options.all && options.all.call(loaded);
                }
                _this.loadOrder.apply(_this, arg);
            });
            img.src = imgList[i];
        },
        // 无序加载
        loadUnorder: function(options, imgList) {
            for (var i = 0; i < imgList.length; i++) {
                var img = new Image();
                img.addEventListener("load", function() {
                    counter += 1;
                    percent = parseInt((counter + errorCounter) / imgList.length * 100);
                    loaded.push(this.src);
                    // 每加载完一张图片调用
                    options.each && options.each({
                        src: this.src,
                        percent: percent,
                        bar: progressBar
                    });
                    if (counter === imgList.length) {
                        if (options.progress && options.progress.autoHide) {
                            document.getElementById(progressBar.id).style.display = 'none';
                            document.getElementsByTagName('body')[0].removeChild(document.getElementById(progressBar.id));
                        }
                        if (options.loadding) {
                            document.getElementById(loaddingDom.id).style.display = 'none';
                        }
                        //加载完所有图片后调用
                        options.all && options.all.call(loaded);
                    }
                });
                img.addEventListener("error", function(err) {
                    percent = parseInt((counter + errorCounter) / imgList.length * 100);
                    errorCounter += 1;
                    // 成功加载+失败加载的图片数为总图片数的时候执行
                    if (counter + errorCounter == imgList.length) {
                        if (options.progress && options.progress.autoHide) {
                            document.getElementById(progressBar.id).style.display = 'none';
                            document.getElementsByTagName('body')[0].removeChild(document.getElementById(progressBar.id));
                        }
                        if (options.loadding) {
                            document.getElementById(loaddingDom.id).style.display = 'none';
                        }
                        //加载完所有图片后调用
                        options.all && options.all.call(loaded);
                    }
                });
                img.src = imgList[i];
            }
        },
        addProgress: function(settings) {
            var div = document.createElement('div');
            div.id = 'progress_' + parseInt(Math.random() * 1000000);
            div.style.position = 'fixed';
            div.style.left = 0;
            div.style.top = 0;
            div.style.width = '100%';
            div.style.height = '4px';
            div.style.backgroundColor = settings.color || '#333';
            div.style.transform = 'translateX(-100%)';
            div.style.transition = 'all .3s';
            div.style.zIndex = 9999;
            document.querySelector('body').appendChild(div);
            return div;
        },
        addLoadding: function(options) {
            // 生成加载动画元素的容器
            function DivBox() {
                var div = document.createElement('div');
                div.id = 'progress_' + parseInt(Math.random() * 1000000);
                div.style.position = 'fixed';
                div.style.left = 0;
                div.style.top = 0;
                div.style.width = '100%';
                div.style.height = '100%';
                div.style.backgroundColor = options.loaddingBg || defaults.loaddingBg;
                div.style.color = '#fff';
                div.style.display = 'flex';
                div.style.justifyContent = 'center';
                div.style.alignItems = 'center';
                div.style.zIndex = 9999;
                return div;
            }
            // 拼接生成完整的容器并添加到body尾部
            var tmpMap = {
                'cssload-thecube': function() {
                    var divBox = new DivBox();
                    var innerDiv = document.createElement('div');
                    innerDiv.className = 'cssload-thecube';
                    for (var i = 0; i < 4; i++) {
                        var index = i + 1;
                        var divEle = document.createElement('div');
                        divEle.className = 'cssload-cube cssload-c' + index;
                        innerDiv.appendChild(divEle);
                    }

                    divBox.appendChild(innerDiv);
                    document.querySelector('body').appendChild(divBox);
                    return divBox;
                },
                'windows8': function() {
                    var divBox = new DivBox();
                    var divEle1 = document.createElement('div');
                    divEle1.className = 'windows8';
                    for (var i = 0; i < 5; i++) {
                        var index = i + 1;
                        var divEle2 = document.createElement('div');
                        divEle2.className = 'wBall';
                        divEle2.id = 'wBall_' + index;
                        var divEle3 = document.createElement('div');
                        divEle3.className = 'wInnerBall';
                        divEle2.appendChild(divEle3);
                        divEle1.appendChild(divEle2);
                    }
                    divBox.appendChild(divEle1);
                    document.querySelector('body').appendChild(divBox);
                    return divBox;
                }
            };
            return typeof tmpMap[options.loadding] === 'function' ? tmpMap[options.loadding]() : '';

        }

    };

})();