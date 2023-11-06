function redirectAndRefresh() {
	
	location.reload();
  }

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');


		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	




		









		if ($sidebar.length > 0) {

			var $sidebar_a = $sidebar.find('a');

			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

			
						if ($this.attr('href').charAt(0) != '#')
							return;

				
						$sidebar_a.removeClass('active');

				
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

				
						if ($section.length < 1)
							return;

					
						$section.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							initialize: function() {

								
									$section.addClass('inactive');

							},
							enter: function() {

								
									$section.removeClass('inactive');

								
									if ($sidebar_a.filter('.active-locked').length == 0) {

										$sidebar_a.removeClass('active');
										$this.addClass('active');

									}

									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		}


		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				
					if (breakpoints.active('<=large')
					&&	!breakpoints.active('<=small')
					&&	$sidebar.length > 0)
						return $sidebar.height();

				return 0;

			}
		});



		

		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					
						$(this).addClass('inactive');

				},
				enter: function() {

				
						$(this).removeClass('inactive');

				}
			})
			.each(function() {

				var	$this = $(this),
					$image = $this.find('.image'),
					$img = $image.find('img'),
					x;

				
					$image.css('background-image', 'url(' + $img.attr('src') + ')');

				
					if (x = $img.data('position'))
						$image.css('background-position', x);

				
					$img.hide();

			});


















			

	
		$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

				
						$(this).addClass('inactive');

				},
				enter: function() {

					
						$(this).removeClass('inactive');

				}
			});

})(jQuery);


const secondFrameStart = 3000;
const timeOnFrame = 3000;
const startDeg = -90;  
const degRange = 180;
let tickArray = [];
let guageFrame = 0;
let rgbRedValue = 255;


function easeInOutCubic(t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
}

function spawnColor(iter){
    this.goFrames = 0;
    this.color = rgbRedValue;
    this.iteration = iter;
    this.fillColor = function(){
		if ( this.goFrames <= 20 ) {
			var $el = document.querySelector('.js-guage-svg > path:nth-child('+String(this.iteration)+')');
      document.querySelector('.js-guage-svg > path:nth-child('+String(this.iteration)+')').style.fill = 'rgb('+rgbRedValue+','+this.color+','+this.color+')';
			this.color = this.color - (rgbRedValue / 20);
			this.goFrames = this.goFrames + 1;
		    this.reqAnim = requestAnimationFrame( this.fillColor.bind(this) );
		} else {
			this.goFrames = 0;
			this.color = rgbRedValue;
			cancelAnimationFrame(this.reqAnim);
		}
	};
}

function engageGuage() {
	let totalFrames = 100;
	let currChild = 0;
	let reqGuage;

  if ( guageFrame < totalFrames ) {
		var deg = startDeg+easeInOutCubic(guageFrame, 0, degRange, totalFrames );
		var iteration = Math.floor( easeInOutCubic(guageFrame, 0, document.querySelectorAll('.js-guage-svg > path').length+1, totalFrames ) );
		document.querySelector('.js-needle').style.transform = 'rotateZ('+deg+'deg)';
		if ( currChild != iteration ) {
			tickArray[iteration] = new spawnColor(iteration);
			tickArray[iteration].fillColor();
			currChild = iteration;
		}
		guageFrame++;
		reqGuage = requestAnimationFrame(engageGuage);
	} else {
		guageFrame = 0;
		cancelAnimationFrame(reqGuage);
    setTimeout( reset, 1000 );
	}
}

function reset() {
  Array.prototype.forEach.call( document.querySelectorAll('.js-guage-svg > path'), function(el, i){
    el.style.fill = '';
  });
	document.querySelector('.js-needle').style.transform = 'rotateZ('+startDeg+'deg)';
	tickArray = [];
  setTimeout( engageGuage, 100 );
}

reset();

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');


let mouseMoved = false;

const pointer = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
}
const params = {
    pointsNumber: 40,
    widthFactor: .3,
    mouseThreshold: .6,
    spring: .4,
    friction: .5
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    }
}

window.addEventListener("click", e => {
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("mousemove", e => {
    mouseMoved = true;
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("touchmove", e => {
    mouseMoved = true;
    updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

setupCanvas();
update(0);
window.addEventListener("resize", setupCanvas);


function update(t) {


    if (!mouseMoved) {
        pointer.x = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
        pointer.y = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? .4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });

    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
        const xc = .5 * (trail[i].x + trail[i + 1].x);
        const yc = .5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
    }
    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();
    
    window.requestAnimationFrame(update);
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}