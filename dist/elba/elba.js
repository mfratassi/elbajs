/*! elba - v0.1.1 - 2014-11-12
* https://github.com/dedalodesign/elbajs
* Copyright (c) 2014 ; Licensed  */
;(function(elba) {

	'use strict';
	
	if (typeof define === 'function' && define.amd) {
        	// Register elba as an AMD module
        	define(elba);
	} else {
        	// Register elba on window
        	window.Elba = elba();
	}
})
(function () {

'use strict';

/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};


  window.classie = classie;



/*
 * Wrap an HTMLElement around each element in an HTMLElement array.
 */


HTMLElement.prototype.wrap = function (elms) {
	// Convert `elms` to an array, if necessary.
	if (!elms.length) elms = [elms];
 
	// Loops backwards to prevent having to clone the wrapper on the
	// first element (see `child` below).
	for (var i = elms.length - 1; i >= 0; i--) {
		var child = (i > 0) ? this.cloneNode(true) : this;
		var el = elms[i];
 
		// Cache the current parent and sibling.
		var parent = el.parentNode;
		var sibling = el.nextSibling;
 
		// Wrap the element (is automatically removed from its current
		// parent).
		child.appendChild(el);
 
		// If the element had a sibling, insert the wrapper before
		// the sibling to maintain the HTML structure; otherwise, just
		// append it to the parent.
		if (sibling) {
			parent.insertBefore(child, sibling);
		} else {
			parent.appendChild(child);
		}
	}
};

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};

NodeList.prototype.remove = window.HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

/*
 * Set function scope's trick
 */

Function.prototype.setScope = function(scope) {
  var f = this;
  return function() {
    f.apply(scope);
  };
};



//var classie = window.classie;
var isRetina = window.devicePixelRatio > 1;

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                      window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

//from http://easings.net/
var easingObj = {
	easeInSine : [0.47, 0, 0.745, 0.715],
	easeOutSine : [0.39, 0.575, 0.565, 1],
	easeInOutSine : [0.445, 0.05, 0.55, 0.95],
	easeInQuad : [0.55, 0.085, 0.68, 0.53],
	easeOutQuad : [0.25, 0.46, 0.45, 0.94],
	easeInOutQuad : [0.455, 0.03, 0.515, 0.955],
	easeInCubic : [0.55, 0.055, 0.675, 0.19],
	easeOutCubic : [0.215, 0.61, 0.355, 1],
	easeInOutCubic : [0.645, 0.045, 0.355, 1],
	easeInQuart : [0.895, 0.03, 0.685, 0.22],
	easeOutQuart : [0.165, 0.84, 0.44, 1],
	easeInOutQuart : [0.77, 0, 0.175, 1],
	easeInQuint : [0.755, 0.05, 0.855, 0.06],
	easeOutQuint : [0.23, 1, 0.32, 1],
	easeInOutQuint : [0.86, 0, 0.07, 1],
	easeInExpo : [0.95, 0.05, 0.795, 0.035],
	easeOutExpo : [0.19, 1, 0.22, 1],
	easeInOutExpo : [1, 0, 0, 1],
	easeInCirc : [0.6, 0.04, 0.98, 0.335],
	easeOutCirc : [0.075, 0.82, 0.165, 1],
	easeInOutCirc : [0.785, 0.135, 0.15, 0.86],
	easeInBack : [0.6, -0.28, 0.735, 0.045],
	easeOutBack  : [0.175, 0.885, 0.32, 1.275],
	easeInOutBack  : [0.68, -0.55, 0.265, 1.55],
};

//Elba constructor
function Elba( el, settings ) {

	//Declare an object holding the main parts of the gallery
	this.base = {
		el : el,
		container : null,
		slides : [],
		wrapper : null,
		count : 0,
		source : 0,
		navigation : {
			left : null,
			right : null,
			dots : null
		},
		//Init the pointer to the visible slide
		pointer : 0,
		//Init pointer for loading slides
		loaderPointer : 0,
		//Hint for the direction to load
		directionHint : 'right',
		resizeTimout : null,
		animated : false
	};

	//Overwrite the default options
	this.options = extend( this.defaults, settings );
	
/**
* Store the slides into _base.slides array
* @param {Object} _base
*/
var _createSlideArray = function(_base,_options){
	var parent = _base.el || document;
	var nodelist = parent.querySelectorAll(_options.selector);
	_base.count 	= nodelist.length;
	//converting nodelist to array
	for(var i = _base.count; i--; _base.slides.unshift(nodelist[i])){}
};

/**
* Wrap the carousel into the elba-wrapper class div
* @param {Object} _base
*/
var _setupWrapper = function(_base){
	_base.wrapper = document.createElement( 'div' );
	_base.wrapper.className = 'elba-wrapper';
	_base.wrapper.wrap(_base.el);
};

/**
* Clone head and tail of the gallery to make the sliding show circular
* and attach empty images to each slide
* @param {Object} _base
* @param {Object} _options
*/
var _cloneHeadAndTail = function(_base){
	if(_base.count > 1){
		//Update the pointer and loaderPointer
		_base.pointer = 1;
		_base.loaderPointer = 1;

		var cloneTail = _base.slides[_base.count - 1].cloneNode(true);
		_base.el.insertBefore(cloneTail, _base.el.firstChild);
		_base.slides.unshift(cloneTail);

		var cloneHead = _base.slides[1].cloneNode(true);
		_base.el.appendChild(cloneHead);
		_base.slides.push(cloneHead);
		_base.count += 2;
	}

	//Append an empty image tag to each slide
	_base.slides.forEach(function(el){
		var elbaIsland = document.createElement( 'img' );
		elbaIsland.className = 'elba-island';
		el.appendChild(elbaIsland);
	});	
};

/**
* Set up arrows for the navigation
* @param {Object} _base
* @param {String} direction
*/
var _setupNavigation = function(_base, direction){
	_base.navigation[direction] = document.createElement( 'a' );
	_base.navigation[direction].className = 'elba-' + direction + '-nav';
	_base.navigation[direction].innerHtml = direction;
	_base.wrapper.appendChild(_base.navigation[direction]);
};

/**
* Set up the navigation dots
* @param {Object} _base
* @param {String} the container's ID which holds the dots
*/
var _setupDots = function(_base, dotsContainer){

	_base.navigation.dots = [];

	var actualContainer;

	if(dotsContainer){
		actualContainer = document.getElementById(dotsContainer);
	}else{
		actualContainer = document.createElement('div');
		actualContainer.className = 'elba-dots-ctr';
		_base.wrapper.appendChild(actualContainer);
	}

	for(var i = 1; i < _base.count - 1; i++){
		_base.navigation.dots[i]  = document.createElement('a');
		_base.navigation.dots[i].className  = 'elba-dot';
		actualContainer.appendChild(_base.navigation.dots[i]);
	}

};


/**
* Pick the source among the possible sources declared in the <figure> elements
* @param {Object} _base
* @param {Object} _options
*/
var _setSource = function(_base, _options){
	//IMPORTANT : Always re-init the _base.source to 0
	_base.source = 0;

	var mediaQueryMin = 0;
	var screenWidth = getContainerWidth(_base.container);

	//handle multi-served image src
	each(_options.breakpoints, function(object){
		if(object.width <= screenWidth && Math.abs(screenWidth - object.width) < Math.abs(screenWidth - mediaQueryMin)){
			mediaQueryMin = object.width;
			_base.source = object.src;
			return true;
		}
	});
};


/**
* Set the width of each slide
* @param {Object} _base
*/
var _setSlidesWidth = function(_base){
	var containerWidth = getContainerWidth(_base.container);
	var carouselWidth = 0;

	_base.slides.forEach(function(el){
		carouselWidth += containerWidth;
		el.style.width = containerWidth + 'px';
	});

	_base.el.style.width = carouselWidth + 'px';
};


/**
* Set the right size of the freshly loaded img
* @param {Object} _base
* @param {HTMLElement} image
*/
var _setImageSize = function(_base, img){

	var imgRatio = img.naturalHeight / img.naturalWidth;
	
    var containerWidth = getContainerWidth(_base.container);
    var containerHeight = getContainerHeight(_base.container);
    var containerRatio = containerHeight / containerWidth;

    var newHeight, newWidth;

    if (containerRatio >= imgRatio){
    	img.height = newHeight = Math.ceil(containerHeight);
    	img.width = newWidth = Math.ceil(containerHeight / imgRatio);
    }else{
    	img.height = newHeight = Math.ceil(containerWidth * imgRatio);
    	img.width = newWidth = Math.ceil(containerWidth);
    }

    var centerX = (containerWidth - newWidth) / 2;
	var centerY = (containerHeight - newHeight) / 2;

	img.style.left = Math.ceil(centerX) + 'px';
	img.style.top = Math.ceil(centerY) + 'px';
};


/**
* Lazy load the images
* @param {Object} _base
* @param {Object} _options
* [@param {Number} the slide to be loaded]
*/
var _lazyLoadImages = function(_base, _options, loadIndex){

	var loaderPointer = loadIndex || _base.loaderPointer;
	var ele = _base.slides[loaderPointer];
	var count = _base.slides.length;

	if(isElementLoaded(ele, _options.successClass)){
		if(count > 1 && ((loaderPointer + 1) < (count - 1))){
				loaderPointer++;
				_lazyLoadImages(_base, _options, loaderPointer);
			}
	}

	var dataSrc = ele.getAttribute(_base.source || _options.src); // fallback to default data-src
	
	//We get the <img class="elba-island"> element 
	var elbaIsland = ele.querySelector('.elba-island');

	if(dataSrc){

		var dataSrcSplitted = dataSrc.split(_options.separator);
		var src = dataSrcSplitted[isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
		var img = new Image();
		
		img.onerror = function() {
			if(_options.error) _options.error(ele, "invalid");
			ele.className = ele.className + ' ' + _options.errorClass;

			if(count > 1 && loaderPointer + 1 < count - 1){
				loaderPointer++;
				_lazyLoadImages(_base, _options, loaderPointer);
			}
		}; 

		img.onload = function() {
			
			elbaIsland.src = src;

			_setImageSize(_base, elbaIsland);

			classie.add(ele, 'no-bg-img');
			classie.add(ele, _options.successClass);

			if(_options.success) _options.success(ele);

			//Update the Head and Tail clone
			if(count > 1 && (loaderPointer === 1 || loaderPointer === 0 || loaderPointer === (count - 1) || loaderPointer === (count - 2))){

				var parentClone,elbaClone;

				if(loaderPointer === 1){
					parentClone = _base.slides[count - 1];
				}else if(loaderPointer === (count - 1)){
					parentClone = _base.lides[1];
					}else if(loaderPointer === 0){
						parentClone = _base.slides[count - 2];
						}else{
							parentClone = _base.slides[0];
						}
				
				if(!isElementLoaded(parentClone, _options.successClass)){
					elbaClone = parentClone.querySelector('.elba-island');

					elbaClone.src = src;
					_setImageSize(_base, elbaClone);
					
					classie.add(parentClone,'no-bg-img');
					classie.add(parentClone,  _options.successClass);
				}
				
			}

			if(count > 1 && loaderPointer + 1 < count - 1){
				loaderPointer++;
				_lazyLoadImages(_base, _options, loaderPointer);
			}
			
		};
		img.src = src; //preload image

	} else {
		if(_options.error) _options.error(ele, "missing");
		ele.className = ele.className + ' ' + _options.errorClass;
	}	
};	 	 


/**
* Destroy some variables before reloading the right size images
* @param {Object} _base
* @param {Object} _options
*/
var _destroy = function(_base, _options){

	var count = _base.slides.length;
	if(count > 1){
		_base.loaderPointer   = 1;
	}else{
		_base.loaderPointer   = 0;
	}
	
	for(var i = 0; i < count; i++){
			var slide = _base.slides[i];
 			if(slide) {
				classie.remove(slide,'no-bg-img');
				classie.remove(slide,  _options.successClass);
 			} 
 		}
};


/**
* The function which actually takes care about resizing (and maybe loading new images)
* @param {Object} _base
* @param {Object} _options
*/
var _doResize = function(_base, _options){

	_setSlidesWidth(_base);
	
	//Fix the gallery offset since it's been resized
	_base.el.style.left = getLeftOffset(_base.container, _base.pointer) + 'px';

	var oldSource = _base.source;
	_setSource(_base,_options);

	//If the source changed, we re-init the gallery
	if(oldSource !== _base.source){
		_destroy(_base, _options);
		_lazyLoadImages(_base, _options);
	}else{
		//Otherwise we just resize the current images
		for(var i = 0; i < _base.slides.length; i++){
			var slide = _base.slides[i];
 			if(slide) {
				var elbaIsland = slide.querySelector('.elba-island');
				_setImageSize(_base, elbaIsland);
 			} 
 		}
	}
};

// taken from https://github.com/desandro/vanilla-masonry/blob/master/masonry.js by David DeSandro
// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

/**
* The function called in the callback after window resize event has been fired
* @param {Object} _base
* @param {Object} _options
*/
var _resizeHandler = function(_base, _options) {
	
	function delayed() {
		_doResize(_base, _options);
		_base.resizeTimeout = null;
	}

	if ( _base.resizeTimeout ) {
		clearTimeout( _base.resizeTimeout );
	}

	_base.resizeTimeout = setTimeout( delayed, 200 );
};








this.init = function(){

	var self = this;

	/**
	 * Store the slides into self.base.slides array
	 */
	_createSlideArray(self.base,self.options);

	/**
	 * Wrap the carousel into the elba-wrapper class div
	 */
	_setupWrapper(self.base);

	/**
	 * Clone head and tail of the gallery to make the sliding show circular
	 */
	_cloneHeadAndTail(self.base);

	//Find the gallery container to adapt the size to
	self.base.container = getContainer(self.base.el, self.options.container);
	
	//We move the first slide to the right because of the head clone
	if(self.base.count > 1){
		self.base.el.style.left = (- self.getContainerWidth()) + 'px';
	}

	//Setting up the navigation arrows
    if(self.options.navigation){
    	_setupNavigation(self.base,'left');
		_setupNavigation(self.base,'right');

		//Attach events to the navigation arrows
		bindEvent(self.base.navigation.left, 'click', function(ev) { 
			ev.preventDefault();
			self.goTo('left');
			if(self.options.slideshow){
				self.startSlideshow();
			}
			});

		bindEvent(self.base.navigation.right, 'click', function(ev) { 
			ev.preventDefault();
			self.goTo('right');
			if(self.options.slideshow){
				self.startSlideshow();
			}
			});
    }

    //Setting up the dots
    if(self.options.dots){
    	_setupDots(self.base, self.options.dotsContainer);

    	classie.add(self.base.navigation.dots[self.base.pointer], 'active-dot');

    	var dotHandler = function(i){

    		return function(){
    			self.dotTo(self.base.navigation.dots[i].getAttribute('data-target'));
	    		if(self.options.slideshow){
					self.startSlideshow();
				}

				return false;
    		};	
    	};

    	for(var i = 1; i < self.base.slides.length - 1; i++){
				self.base.navigation.dots[i].setAttribute('data-target', i);
				bindEvent(self.base.navigation.dots[i], 'click', dotHandler(i));
			}
    }

    //Set the width of each slide
    _setSlidesWidth(self.base);

	//Set images' src
	_setSource(self.base, self.options);

	//Starting lazy load 
	_lazyLoadImages(self.base, self.options);

	
	//Bind resize event
	bindEvent(window, 'resize', function(){
		_resizeHandler(self.base, self.options);
	});

	if(self.options.slideshow){
		self.startSlideshow();
	}
};


this.init();
//Closing Elba constructor
}
/* Extending Elba constructor
************************************/
Elba.prototype.defaults = {
	selector : '.elba',
	separator : '|',
	breakpoints : false,
	successClass : 'elba-loaded',
	errorClass : 'elba-error',
	container : 'elba-wrapper',
	src : 'data-src',
	error : false,
	success : false,
	duration : 1000,
	easing: 'easeInOutCubic',
	navigation : true,
	dots: true,
	dotsContainer: false, 
	slideshow : 5000
};
	
Elba.prototype.goTo = function(direction){
	var self = this;
	if(typeof direction === 'string' && isNaN(direction)){
		var count = self.base.slides.length;
		if(direction === 'right'){
			if(self.base.pointer + 1 >= count){
				return false;
			}
			self.base.pointer++;
			animate(self.base, self.options,'right');
		}else{
			if(self.base.pointer - 1 < 0 ){
				return false;
			}
			self.base.pointer--;
			animate(self.base, self.options,'left');
		}
	}else if(!isNaN(direction)){
		var oldPointer = self.base.pointer;
		self.base.pointer = parseInt(direction);
		if(self.base.pointer > oldPointer){
			animate(self.base, self.options, 'right');
		}else{
			animate(self.base, self.options, 'left');
		}	
	}
};

Elba.prototype.dotTo = function(index){
	var self = this;

	if(parseInt(index) === self.base.pointer){
		return false;
	}else{
		self.goTo(index);
	}

};

Elba.prototype.startSlideshow = function(){
	var self = this;
	if(self.base.slides.length > 1){
		if(self.slideshow){
		clearInterval(self.slideshow);
	}	
	self.slideshow = setInterval(function(){
		//TODO: animate only if it is in the viewport
		if(classie.has(self.base.slides[self.base.pointer + 1],'elba-loaded')){
			self.goTo('right');
		}
	},self.options.slideshow);

	}
};

Elba.prototype.clearSlideshow = function(){
	var self = this;	
	if(self.slideshow){
		clearInterval(self.slideshow);
	}
};



function animate(_base, _options,direction) {
  
  var ele = _base.el;

  var target = getLeftOffset(_base.container, _base.pointer);
  var count = _base.slides.length;

  if(_base.animated){
    return false;
  }

  _base.animated = true;

  var updateDots = function(){

    _base.navigation.dots.forEach(function(el){
    	classie.remove(el,'active-dot');
    });

    var index;

    if(_base.pointer === _base.slides.length - 1){
      index = 1;
      }else if(_base.pointer === 0){
        index = _base.slides.length - 2;
        }else{
          index = _base.pointer;
    }

    classie.add(_base.navigation.dots[index],'active-dot');
  };

  var startingOffset = intVal(ele.style.left);
  
  var deltaOffset = Math.abs(startingOffset - target);
  if(direction === 'right') deltaOffset = - deltaOffset;

  var duration = _options.duration; // duration of animation in milliseconds.
  var epsilon = (1000 / 60 / duration) / 4;

  var easeing = getBezier(easingObj[_options.easing],epsilon);

  var start = null, myReq;

   function animationStep(timestamp) {
      if (start === null) start = timestamp;

      var timePassed = (timestamp - start);
      var progress = timePassed / duration;

      if (progress > 1) progress = 1;

      var delta = easeing(progress).toFixed(6);
        step(ele, delta, startingOffset, deltaOffset);

      if (progress == 1){
        progress = 1;
        if(count > 1){
          if(_base.pointer === (count - 1)){
            _base.pointer = 1;
            ele.style.left = getLeftOffset(_base.container, _base.pointer) + 'px';
          }else if(_base.pointer === 0){
            _base.pointer = count - 2;
            ele.style.left = getLeftOffset(_base.container, _base.pointer) + 'px';
          }
        }
         _base.animated = false;
         start = null;
         cancelAnimationFrame(myReq);
         if(_options.dots){
            updateDots();
          }
      }else{
        requestAnimationFrame(animationStep);
      }

    }
  
  //Global variables                              
  if(requestAnimationFrame && cancelAnimationFrame){

  myReq = requestAnimationFrame(animationStep);

  }else{

      //TODO a bettert fallback if window.requestAnimationFrame is not supported
      var id = setInterval(function() {

      if (start === null) start = new Date();  

      var timePassed = new Date() - start;
      var progress = timePassed / duration;

      if (progress > 1) progress = 1;

      var delta = easeing(progress).toFixed(6);

      step(ele, delta, startingOffset, deltaOffset);
      
      if (progress == 1) {

        if(count > 1){
          if(self.pointer === (count - 1)){
            self.pointer = 1;
            ele.style.left = getLeftOffset(_base.container, _base.pointer) + 'px';
          }else if(self.pointer === 0){
            self.pointer = count - 2;
            ele.style.left = (_base.container, _base.pointer) + 'px';
          }
        }
         clearInterval(id);
         start = null;
         self.animated = false;
         if(_options.dots){
            updateDots();
          }
      }
    },25);
  }                             

}


function step(ele, delta, startingOffset, deltaOffset){
	var actualOffset = startingOffset + (deltaOffset * delta);
	ele.style.left = Math.ceil(actualOffset) + 'px'; 
}

function getBezier(easingArr, epsilon){
	return bezier(easingArr[0], easingArr[1], easingArr[2], easingArr[3], epsilon);
}

// from https://github.com/arian/cubic-bezier
function bezier(x1, y1, x2, y2, epsilon){

  	var curveX = function(t){
	    var v = 1 - t;
	    return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
    };

  	var curveY = function(t){
	    var v = 1 - t;
	    return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
    };

  	var derivativeCurveX = function(t){
	    var v = 1 - t;
	    return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
    };

  	return function(t){
    	var x = t, t0, t1, t2, x2, d2, i;

	    // First try a few iterations of Newton's method -- normally very fast.
	    for (t2 = x, i = 0; i < 8; i++){
	      x2 = curveX(t2) - x;
	      if (Math.abs(x2) < epsilon) return curveY(t2);
	      d2 = derivativeCurveX(t2);
	      if (Math.abs(d2) < 1e-6) break;
	      t2 = t2 - x2 / d2;
	    }

	    t0 = 0;
	    t1 = 1; 
	    t2 = x;

	    if (t2 < t0) return curveY(t0);
	    if (t2 > t1) return curveY(t1);
	    // Fallback to the bisection method for reliability.
	    while (t0 < t1){
	      x2 = curveX(t2);
	      if (Math.abs(x2 - x) < epsilon) return curveY(t2);
	      if (x > x2) t0 = t2;
	      else t1 = t2;
	      t2 = (t1 - t0) * 0.5 + t0;
	    }
	    // Failure
	    return curveY(t2);
    };
}








function extend( a, b ) {
	for( var key in b ) { 
		if( b.hasOwnProperty( key ) ) {
			a[key] = b[key];
		}
	}
	return a;
}

function getContainerWidth(container){
    if(typeof container !== 'undefined' && container){
        return container.offsetWidth;
    }else{
        return window.innerWidth || document.documentElement.clientWidth;
    }
}	 	

function getContainerHeight(container){
    if(typeof container !== 'undefined' && container){
        return container.offsetHeight;
    }else{
        return window.innerHeight || document.documentElement.clientHeight;
    }
}   

function each(object, fn){
	if(object && fn) {
		var l = object.length;
		for(var i = 0; i<l && fn(object[i], i) !== false; i++){}
	}
}

function intVal(x){
	if(x){
		return parseInt(x, 10);
	}else{
		return 0;
	}
}

function getLeftOffset(element , multiplier){
	return intVal(- (getContainerWidth(element) * multiplier));
}

function bindEvent(ele, type, fn) {
    ele.addEventListener(type, fn, false);
}

function getContainer(el, parentClass){

	while (el && el.parentNode) {
		el = el.parentNode;
		if (el.className === parentClass) {
	  		return el;
		}
	}

	// Many DOM methods return null if they don't 
	// find the element they are searching for
	// It would be OK to omit the following and just
	// return undefined
	return null;
}

function isElementLoaded(ele, successClass) {
	return classie.has(ele, successClass);
}


return Elba;
});