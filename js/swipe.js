'use strict';


var labels = [
	["eher<br><b>un</b>typisch", "eher<br>typisch"],
	["ziemlich<br><b>un</b>typisch", "etwas<br><b>un</b>typisch"], //ziemlich
	["etwas<br>typisch", "ziemlich<br>typisch"],
	["am<br><b>un</b>typischsten", "sehr<br><b>un</b>typisch"],
	["&uuml;berwiegend<br><b>un</b>typisch", "halbwegs<br><b>un</b>typisch"],
	["halbwegs<br>typisch", "&uuml;berwiegend<br>typisch"],
	["sehr<br>typisch", "am<br>typischsten"]
];



var items = [
	[3, 'a_affil', './img/a_affil.png', 'Dazugeh&ouml;ren'],
      [4, 'a_auton', './img/a_auton.png', 'Selbstbestimmen'],
      [5, 'a_contr', './img/a_contr.png', 'Kontrolle haben'],
      [6, 'a_intim', './img/a_intim.png', 'Intimit&auml;t'],
      [7, 'v_depen', './img/v_depen.png', 'Abh&auml;ngigsein'],
      [8, 'v_disd', './img/v_disd.png', 'Geringsch&auml;tzung'],
      [9, 'v_sep', './img/v_sep.png', 'Getrenntsein'],
      [10, 'v_weekn', './img/v_weekn.png', 'Schw&auml;chezeigen'],
	[0, 'rejection', './img/1.jpg', ''],
      [1, 'autonomy', './img/2.jpg', ''],
      [2, 'affiliation', './img/3.jpg', '']
/*	[3, 'Arousal_1', './img/Arousal_1.jpg'],
      [4, 'Arousal_2', './img/Arousal_2.jpg'],
      [5, 'Arousal_3', './img/Arousal_3.jpg'],
      [6, 'Arousal_4', './img/Arousal_4.jpg'],
      [7, 'Arousal_5', './img/Arousal_5.jpg'],
	[8, 'Valence_1', './img/Valence_1.jpg'],
      [9, 'Valence_2', './img/Valence_2.jpg'],
      [10, 'Valence_3', './img/Valence_3.jpg'],
      [11, 'Valence_4', './img/Valence_4.jpg'],
      [12, 'Valence_5', './img/Valence_5.jpg'],*/
];





var nextstack = [
	[1,2],//0
      [3,4],//1
      [5,6],//2
      [7,8],//3
      [9,10],//4
      [11,12],//5
      [13,14]//6
];



// Init qsort

var trajectory = []; // TODO

var nope = document.getElementById('nope');
var nope_caption = nope.children[0];
var love = document.getElementById('love');
var love_caption = love.children[0];
var deck = document.getElementById('tindercardsdiv');
var tinderContainer = document.querySelector('.tinder');

var segments, tinderCards, allCards;

function initCards(card, index)
{
  var newCards = document.querySelectorAll('.tinder--card:not(.removed)');

  newCards.forEach(function (card, index) {
  card.style.zIndex = allCards.length - index;
    card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
    card.style.opacity = (10 - index) / 10;
  });


  if(newCards.length == 0)
  {
      
	onQsortFinished();

  }

 


  tinderContainer.classList.add('loaded');

}


function createButtonListener(love)
{
  return function (event) {
    	var cards = document.querySelectorAll('.tinder--card:not(.removed)');
    	var moveOutWidth = document.body.clientWidth * 1.5;

    	if (!cards.length)
	{
		return false;
	}

    	var card = cards[0];

    	card.classList.add('removed');

    	if (love) {
      	card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
    	} else {
	      card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
    	}

    	initCards();

    	event.preventDefault();
  };
}

var nopeListener = createButtonListener(false);
var loveListener = createButtonListener(true);

nope.addEventListener('click', nopeListener);
love.addEventListener('click', loveListener);

var sorting = [];

function qsort(cards)
{
	// set the labels
      love_caption.innerHTML = labels[stack][1];
	nope_caption.innerHTML = labels[stack][0];

	

	// put the cards into the deck
      deck.innerHTML = '';
	cards.forEach(function(item, index)
	{
		deck.innerHTML = deck.innerHTML + '<div class="tinder--card" id="' + item[1] + '"><img src="' + item[2] + '">'+item[3]+'</div>';
	});

	segments = Array(document.querySelectorAll('.tinder--card').length).fill(0);
	tinderCards = document.querySelector('.tinder--cards');

	allCards = document.querySelectorAll('.tinder--card');
	allCards.forEach(function (card, index)
	{
		card["number"] = cards[index][0];
	});

      initCards();

      allCards.forEach(function (el) {
	  var hammertime = new Hammer(el);

	  hammertime.on('pan', function (event) {
	    el.classList.add('moving');

	  });

	  hammertime.on('pan', function (event) {
	    if (event.deltaX === 0) return;
	    if (event.center.x === 0 && event.center.y === 0) return;

		trajectory.push(Date.now().toString() + " " + event.target.id + " " + segments[event.target.number] + " " + event.center.x.toString() + " " + event.center.y.toString());

	    tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
	    tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

	    var xMulti = event.deltaX * 0.03;
	    var yMulti = event.deltaY / 80;
	    var rotate = xMulti * yMulti;

	    event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
	  });

	  hammertime.on('panend', function (event) {
	    el.classList.remove('moving');
	    segments[event.target.number] = segments[event.target.number] + 1;
	    tinderContainer.classList.remove('tinder_love');
	    tinderContainer.classList.remove('tinder_nope');

	    var moveOutWidth = document.body.clientWidth;
	    var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

	    event.target.classList.toggle('removed', !keep);

	    if (keep) {
	      event.target.style.transform = '';
	    } else {
	      var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
	      var toX = event.deltaX > 0 ? endX : -endX;
	      var endY = Math.abs(event.velocityY) * moveOutWidth;
	      var toY = event.deltaY > 0 ? endY : -endY;
	      var xMulti = event.deltaX * 0.03;
	      var yMulti = event.deltaY / 80;
	      var rotate = xMulti * yMulti;

            sorting[event.target.number] = Number(event.deltaX > 0);
		
	      event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
	      initCards();
	    }
	  });
	});
	

	var test1 = document.getElementById('nopediv');
	test1.classList.remove("fade-in-first");
	void test1.offsetWidth;
	test1.classList.add("fade-in-first");
	var test1 = document.getElementById('lovediv');
	test1.classList.remove("fade-in-second");
	void test1.offsetWidth;
	test1.classList.add("fade-in-second");
	var test1 = document.getElementById('tindercardsdiv');
	test1.classList.remove("fade-in-third");
	void test1.offsetWidth;
	test1.classList.add("fade-in-third");
}


// Init main program

var stacks = Array(15);
// intialize first stack
stacks[0] = items;
for(var i = 1; i < 15; i++)
	stacks[i] = [];

var stack = 0;

function onQsortFinished()
{
	// Karten in neue Stacks sortieren
	var cards = stacks[stack];
      cards.forEach(function(card, index)
	{
		if(nextstack.length > stack)
		{
                  
			var next = nextstack[stack][sorting[cards[index][0]]];
			console.log("The card "+ card[1] +" goes to stack " + next);
			stacks[next].push(card);
		}
	});

	// Weiter gehts...
	stack = stack + 1;

	if(stack <= 6)
	{
		console.log("Stack: " + stack + "\n");
            qsort(stacks[stack]);
		
		
	}
	else
	{
		var results = [];
		for(i = 7; i <= 14; i++)
			stacks[i].forEach(function(card, index)
			{
				results.push(card[1] + "\t" + (i - 7));
			});
		var output = results.join("\n");
		console.log("FERTIG\n");
		console.log(output);
		if(typeof cordova !== 'undefined')
		{
			//cordova.plugins.clipboard.copy(trajectory.join("\n"));
			
                  cordova.plugins.clipboard.copy(output);
			window.plugins.intentShim.sendResult(
			    {
			        extras: {
			            'value': output
			        }
			    },
			    function() { }
			);
		}
	}
}

console.log("Stack: " + stack + "\n");
qsort(stacks[stack]);

