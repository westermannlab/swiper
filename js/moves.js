'use strict';


// initialize moves set
var positions = ['care', 'autonomy'];
var instructions = [
	'Kennen Sie solche Situationen?',
	'Durch wen kam die Situation zustande?',
	'Finden Sie sich in der hervorgehobenen Figur wieder?'
];


var labels = [
	["eher nicht", "eher ja"],
	["durch<br>den anderen", "durch<br>mich"],
	["eher nicht", "eher ja"]
];



var items_motifs = [];
var items_origin = [];
var items_ident  = [];

for(var i = 0; i < positions.length; i++)
{

	items.push(i, positions[i], './img/' + positions[i] + '.png', positions[i]);
}





var items = []; // [3, 'a_affil', './img/a_affil.png', 'Dazugeh&ouml;ren'],


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

