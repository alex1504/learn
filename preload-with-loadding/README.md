# preload-with-loadding
Preload your website img with loadding or progress for better interaction.

First, including the file below to your html file.
```javascript
<link rel="stylesheet" type="text/css" href="./preload.css">
<script type="text/javascript" src="./preload.js"></script>
```

## Init with loadding callback
```javascript
var arr = ['./imgs/test.jpg'];

// If here you not pass arr， then arr will be Array of img element src of body
var preloader = new Preloader(arr);

// You can pass just a callback param, it runs when img arr is all loaded.
preloader.load(function(){
	console.log('all img is loaded')
});

```
## Load img in order
```javascript
var arr = ['./imgs/test1.jpg','./imgs/test2.jpg','./imgs/test3.jpg'];
var preloader = new Preloader(arr);

// Pass param order:true
preloader.load({
    order: true,
    each: function(obj){
        console.log(obj.src);   
        // output: './imgs/test1.jpg','./imgs/test2.jpg','./imgs/test3.jpg'  
        // only when the previous img has loaded does the next img start loadding.
    }
});

```

## Init with loadding animation
```javascript
// ============== Show loadding Animation, there are two built in animation name, 'cssload-thecube', 'windows8', you can find them in preload.css.
var arr = ['./imgs/test.jpg'];

// If here you not pass arr， then arr will be Array of img element src of body
var preloader = new Preloader(arr);

// you can pass just a callback param, it runs when img arr is all loaded.
preloader.load({
	loadding: 'cssload-thecube'
});

// To change the bgColor you can add parem loaddingBg(default is '#333'), if you want to have a subtile change to loaddingicon, just edit preload.css file
preloader.load({
	loadding: 'cssload-thecube',
	loaddingBg: '#fff'
});
```
Notice that if you put init function before the end of 'body' tag but not inside 'head' tag, you have to add display：'none' to your body style, so that the body content will not display until all images are loadded well.

## Show loadding progress
### Use your own progressbar
```javascript
var arr = ['./imgs/test.jpg'];

// if here you not pass arr， then arr will be Array of img element src of body
var preloader = new Preloader(arr);

preloader.load({
	each: function(obj){
		console.log(obj.percent) // from 0 - 100
		console.log(obj.src)     // img src which is just done
	}
});
```
### Use automatically generated progressbar
```javascript
// If you pass progress param, it will automatically generate a progressbar dom which will be append at the end of body
// By the way you will get an extra key obj.bar which is point to progressbar dom element
preloader.load({
	each: function(obj){
		console.log(obj.bar)     // point to progressbar dom element
	},
	progress: {
		color: '#666'             // here you can config progressbar's backgroundColor
	}
});
```

## Add animation to the progressbar, rewrite your callback
```javascript
preloader.load({
	each: function(obj){
		obj.bar.style.transform = 'translateX(-'+ (100 - obj.percent)+'%)';     
	},
	progress: {
		color: '#666'  
	}
});
```
