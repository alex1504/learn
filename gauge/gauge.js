;
(function() {
    function extend() {
        // Variables
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // Check if a deep merge
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function(obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    // If deep merge and property is an object, merge properties
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };
        // Loop through each object and conduct a merge
        for (; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }
        return extended;
    };

    function formatNumber(number) {
        return number.length === 1 ? '0' + number : number
    }

    function formatDate(aDate) {
        var year = aDate.getFullYear();
        var month = formatNumber(aDate.getMonth() + 1);
        var date = formatNumber(aDate.getDate());
        return year + '.' + month + '.' + date
    }

    function Gauge(canvas, options) {
        this.canvas = canvas
        this.options = extend(true, {
            radius: 150,
            dotSpeed: 0.03,
            progress: {
                color: 'rgba(255, 255, 255, .5)',
                bgColor: 'rgba(255, 255, 255, .4)',
                dotColor: 'rgba(255, 255, 255, .7)'
            },
            division: {
                lineColor: 'rgba(255, 255, 255, .2)',
                smallerLineColor: 'rgba(255, 255, 255, .3)',
                smallestLineColor: 'rgba(255, 255, 255, .1)',
                scoreColor: 'rgba(255, 255, 255, .4)',
                scoreFontsize: 10,
                socreBoundColor: 'rgba(255, 255, 255, .4)',
                scoreBoundFontsize: 10
            },
            title: {
                show: true,
                text: '信用分',
                fontsize: 14,
                color: '#7ec5f9'
            },
            score: {
                min: 400,
                max: 1000,
                show: true,
                value: 800,
                fontsize: 80,
                color: '#fff'
            },
            commentText: {
                show: true,
                top: 50,
                color: '#fff',
                fontsize: 28
            },
            time: {
                show: true,
                value: formatDate(new Date()),
                top: 80,
                fontsize: 14,
                color: '#80cbfa'
            },
            stage: {
                tags: ['信用较差', '信用中等', '信用良好', '信用优秀', '信用极好'],
                bound: [500, 600, 700, 800, 1000],
                boundColors: ['red', 'red', 'red', 'green', 'blue']
            }
        }, options)
        if (!this.canvas) {
            throw Error('First Argument must be canvas element')
        }
        this.init()
    }
    Gauge.prototype.init = function() {
        var instance = this,
            canvas = this.canvas || document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            cWidth = canvas.width,
            cHeight = canvas.height,
            score = this.options.score.value,
            scoreMin = this.options.score.min,
            scoreMax = this.options.score.max,
            stage = this.options.stage.tags,
            stageBound = this.options.stage.bound,
            stageColors = this.options.stage.boundColors,
            radius = this.options.radius,
            deg0 = Math.PI / 9,
            deg1 = Math.PI * 11 / 9 / 5;


        if (false) {
            alert('信用分数区间：' + scoreMin + '~' + scoreMax);
        } else {
            score = score < scoreMin ? scoreMin : score > scoreMax ? scoreMax : score
            var dot = new Dot(),
                dotSpeed = this.options.dotSpeed,
                textSpeed = Math.round(dotSpeed * 100 / deg1),
                angle = 0,
                credit = scoreMin;

            (function drawFrame() {
                ctx.save();
                ctx.clearRect(0, 0, cWidth, cHeight);
                ctx.translate(cWidth / 2, cHeight / 2);
                ctx.rotate(8 * deg0);

                dot.x = radius * Math.cos(angle / 2);
                dot.y = radius * Math.sin(angle / 2);

                var aim = (score - scoreMin) * deg1 / 100;
                if (angle < aim) {
                    angle += dotSpeed;
                }

                if (credit < stageBound[0]) {
                    dot.draw(ctx, stageColors[0]);
                } else if (credit < stageBound[1] && credit >= stageBound[0]) {
                    dot.draw(ctx, stageColors[1]);
                } else if (credit < stageBound[2] && credit >= stageBound[1]) {
                    dot.draw(ctx, stageColors[2]);
                } else if (credit < stageBound[3] && credit >= stageBound[2]) {
                    dot.draw(ctx, stageColors[3]);
                } else if (credit <= stageBound[4] && credit >= stageBound[3]) {
                    dot.draw(ctx, stageColors[4]);
                }


                if (credit < score - textSpeed) {
                    credit += textSpeed;
                } else if (credit >= score - textSpeed && credit < score) {
                    credit += 1;
                }


                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = 3;


                if (credit < stageBound[0]) {
                    text(credit, stageColors[0]);
                    ctx.strokeStyle = stageColors[0];
                } else if (credit < stageBound[1] && credit >= stageBound[0]) {
                    text(credit, stageColors[1]);
                    ctx.strokeStyle = stageColors[1];
                } else if (credit < stageBound[2] && credit >= stageBound[1]) {
                    text(credit, stageColors[2]);
                    ctx.strokeStyle = stageColors[2];
                } else if (credit < stageBound[3] && credit >= stageBound[2]) {
                    text(credit, stageColors[3]);
                    ctx.strokeStyle = stageColors[3];
                } else if (credit <= stageBound[4] && credit >= stageBound[3]) {
                    text(credit, stageColors[4]);
                    ctx.strokeStyle = stageColors[4];
                }


                ctx.arc(0, 0, radius, 0, angle / 2, false);
                ctx.stroke();
                ctx.restore();

                window.requestAnimationFrame(drawFrame);

                ctx.save(); //中间刻度层
                ctx.beginPath();
                ctx.strokeStyle = instance.options.division.lineColor;
                ctx.lineWidth = 10;
                ctx.arc(0, 0, 135, 0, 11 * deg0, false);
                ctx.stroke();
                ctx.restore();

                ctx.save(); // 刻度线
                for (var i = 0; i < 6; i++) {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = instance.options.division.smallerLineColor;
                    ctx.moveTo(140, 0);
                    ctx.lineTo(130, 0);
                    ctx.stroke();
                    ctx.rotate(deg1);
                }
                ctx.restore();

                ctx.save(); // 细分刻度线
                for (i = 0; i < 25; i++) {
                    if (i % 5 !== 0) {
                        ctx.beginPath();
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = instance.options.division.smallestLineColor;
                        ctx.moveTo(140, 0);
                        ctx.lineTo(133, 0);
                        ctx.stroke();
                    }
                    ctx.rotate(deg1 / 5);
                }
                ctx.restore();

                ctx.save(); //信用分数
                ctx.rotate(Math.PI / 2);
                for (i = 0; i < 6; i++) {
                    ctx.fillStyle = instance.options.division.scoreColor;
                    ctx.font = instance.options.division.scoreFontsize + 'px Microsoft yahei';
                    ctx.textAlign = 'center';
                    ctx.fillText(scoreMin + 200 * i, 0, -115);
                    ctx.rotate(deg1);
                }
                ctx.restore();

                ctx.save(); //分数段
                ctx.rotate(Math.PI / 2 + deg0);
                for (i = 0; i < 5; i++) {
                    ctx.fillStyle = instance.options.division.socreBoundColor;
                    ctx.font = instance.options.division.scoreBoundFontsize + 'px Microsoft yahei';
                    ctx.textAlign = 'center';
                    ctx.fillText(stage[i], 5, -115);
                    ctx.rotate(deg1);
                }
                ctx.restore();

                ctx.save(); //信用阶段及评估时间文字
                ctx.rotate(10 * deg0);
                ctx.fillStyle = instance.options.commentText.color;
                ctx.font = instance.options.commentText.fontsize + 'px Microsoft yahei';
                ctx.textAlign = 'center';
                if (instance.options.commentText.show) {
                    if (credit < stageBound[0]) {
                        ctx.fillStyle = stageColors[0];
                        ctx.fillText(stage[0], 0, instance.options.commentText.top);
                    } else if (credit < stageBound[1] && credit >= stageBound[0]) {
                        ctx.fillStyle = stageColors[1];
                        ctx.fillText(stage[1], 0, instance.options.commentText.top);
                    } else if (credit < stageBound[2] && credit >= stageBound[1]) {
                        ctx.fillStyle = stageColors[2];
                        ctx.fillText(stage[2], 0, instance.options.commentText.top);
                    } else if (credit < stageBound[3] && credit >= stageBound[2]) {
                        ctx.fillStyle = stageColors[3];
                        ctx.fillText(stage[3], 0, instance.options.commentText.top);
                    } else if (credit <= stageBound[4] && credit >= stageBound[3]) {
                        ctx.fillStyle = stageColors[4];
                        ctx.fillText(stage[4], 0, instance.options.commentText.top);
                    }
                }


                ctx.font = instance.options.time.fontsize + 'px Microsoft yahei';
                if (instance.options.time.show) {
                    ctx.fillText('评估时间：' + instance.options.time.value, 0, instance.options.time.top);
                }

                ctx.font = instance.options.title.fontsize + 'px Microsoft yahei';
                if (instance.options.title.show) {
                    ctx.fillText(instance.options.title.text, 0, -60);
                }
                ctx.restore();


                // ctx.save(); //最外层轨道
                ctx.beginPath();
                ctx.strokeStyle = instance.options.progress.bgColor;
                ctx.lineWidth = 3;
                ctx.arc(0, 0, radius, 0, 11 * deg0, false);
                ctx.stroke();
                ctx.restore();

            })();
        }

        function Dot() {
            this.x = 0;
            this.y = 0;
            this.draw = function(ctx, dotColor) {
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = dotColor || instance.options.progress.dotColor;
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.restore();
            };
        }

        function text(process, color) {
            ctx.save();
            ctx.rotate(10 * deg0);
            ctx.fillStyle = color || instance.options.score.color;
            ctx.font = instance.options.score.fontsize + 'px Microsoft yahei';
            ctx.textAlign = 'center';
            ctx.textBaseLine = 'top';
            if (instance.options.score.show) {
                ctx.fillText(process, 0, 10);
            }
            ctx.restore();
        }
    }



    typeof window.Gauge === 'undefined' && (window.Gauge = Gauge)

})()