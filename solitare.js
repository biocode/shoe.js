
$(document).ready(function(){
	var i, card, card_el, cards = [],
		deck = Deck(1, false),
		$stacks = {}, stackname, stacksize,
		numnames = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'],
		suits = ['hearts', 'diamonds', 'clubs', 'spades'];
	
	//construct cards in DOM elements
	$.each(_.range(52), function(idx, value){
		card = deck.hit();
		//console.log(idx + ": " + card.name);
		card_el = $("<div/>")
			.addClass('card_' + card.name)
			.addClass('card')
			.data('card', card);
		cards.push(card_el);
	});

	$.each(numnames, function(idx, name) {
		$stacks[name] = $("#" + name);
	});
	
	stacksize = _.range(7);
	
	//deal the stacks of cards
	$.each(_.range(7), function(idx, number){
		var _size = stacksize.unshift(),
			stackname = numnames[idx],
			cardname;
		
		for(i=0; i < _size; i++) {
			if(i > idx) {
				break;
			}
			
			card = cards.pop();
			
			if(i < idx) {
				card.addClass('facedown');
			} else {
				card.addClass('in-play').droppable({
					"accept": function(draggable, ui) {
						var card = $(draggable), 
							d = card.data('card'),
							dropdata = $(this).data('card');
						
						//if color is not same as mine
						if(d.color !== dropdata.color && d.rank === dropdata.prev) {
							
							return true;							
						} else {
							
							return false; }
					},
					"hoverClass": "ui-hover-class",
					"drop": function(event, ui){
						//append/prepend card to my parent (stack) so it
						//show up on top of me
					}
				});
			}
			$stacks[stackname].append(card);
			//cardname = $(card).data('card').name;
			//console.log("idx: " + idx + ", i: " + i + ", card: " + cardname);
		}
		
	});
	
	//deal the rest of the cards face down as the deck.
	for(i=0; i<23; i++) {
		card = cards.pop();
		card.addClass('facedown')
			.addClass('pilefix')
		 	.appendTo("#deck")
			.click(function(){
				//move top card to bone pile
				$(this).appendTo($("#bones"))
					.removeClass('facedown')
					.addClass('in-play');
				$('.in-play').draggable({"revert": "invalid"});
			});		
	}
	
	//deal last card face up to bone pile
	card = cards.pop();
	card.addClass('in-play').appendTo("#bones");
	
	
	$('.in-play').draggable({"revert": "invalid"});
	
	$.each(numnames, function(idx, name) {
		$("#" + name + " .card:gt(0)").addClass('stackfix');
	});
	
	//set up drop-logic for suit-piles.
	$.each(suits, function(idx, suit) {
		$("#" + suit + "_stack").droppable({
			"accept": function(draggable, ui) {
				var card = $(draggable), 
					d = card.data('card'),
					lastchild, lastchild_d,
					_size;
				
				console.log("card is: " + d.rank + " of " + d.suit);
				
				//fail fast if wrong suit.
				if(d.suit !== suit) {
					return false;
				}
				
				//this will be the first card in the pile
				_size = $("#" + suit + "_stack").size();
				
				console.log("Number of children of droppable: " + _size);
				
				if(_size === 1) { //we have one text element that shows as a child
					if( d.rank === "ace") {
						return true;
					}
					return false;
				}
				
				//already other cards, ensure correct rank				
//				lastchild = $("#" + suit + "_stack:last-child");
//				if(lastchild !== undefined) {
//					lastchild_d = lastchild.data('card');
//					
//					console.dir(lastchild_d)
//					if(lastchild_d.next === d.rank) {
//						return true;
//					}					
//				}
				
				return false;
			},
			
			"hoverClass": "ui-state-hover",
			
			"drop": function(event, ui){
				ui.draggable.addClass('pilefix')
					.appendTo($(this));
			}
		});
	});
	
		
	
});


(function() { 
	Array.prototype.cycle = function() {
		
		var copy = _.clone(this),
			_next = 0,
			len = copy.length;
		
		function next() {
			var element = copy[_next];
			_next++;
			if(_next === len) {
				_next = 0;
			}
			return element;
		}
		
		return {
			"next": next
		};
		
	};
})();