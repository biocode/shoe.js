/**
 * Creates a ``Deck`` object that models a deck (or shoe) of playing cards.
 * 
 * Copyright 2012 Gortek Consulting, LLC (http://www.gortek.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function($) { 
    window.Deck = function(number_of_decks_in_shoe, aces_high) {
	    var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'],
        	suits = _.shuffle(['hearts', 'diamonds', 'spades', 'clubs']),
        	deck = {},
        	shoe = [],
        	shoesize = number_of_decks_in_shoe || 1,
        	aces = aces_high || false,
        	dealt = [],
        	red = {"hearts":"hearts", "diamonds":"diamonds"};
        
        if(aces === true) {
        	ranks.push('ace');
        } else {
        	ranks.unshift('ace');
        }

    	function init() {
            //init the master deck
    		var cardname, ranklen=ranks.length;
    		
	    	$.each(suits, function(suit_idx, suit){
	    		$.each(ranks, function(rank_idx, rank){
	    			cardname = rank + "_" + suit;
	        		deck[cardname] = {
		    			"name": cardname,
		    			"rank": rank,
		    			"suit": suit,
		    			"color": (suit in red) ? "red" : "black",
		    			"next": (rank_idx + 1 === ranklen) ? null : ranks[ rank_idx + 1 ],
		    			"prev": (rank_idx === 0) ? null : ranks[ rank_idx - 1 ]
                    }
                });
            });
            
            //create the shoe
    		shuffle();
		}

	    function hit() {
	    	if(shoe.length === 0) {
	    		throw "Shoe empty."
	    	}
	    	
	    	var card = shoe.pop();
	    	dealt.push(card);
	    	return card;
	    }
	    
	    function deal(number_players, hand_size) {
	    	if( ! number_players || ! hand_size) {
	    		return null;
	    	}
	    	
	    	if ( number_players * hand_size > shoe.length) {
	    		throw "Not enough cards left to deal."
	    	}
	    	
	    	var round, player, dealarry = [];
	    	
	    	//make 2D array
	    	for( player = 0; player < number_players; player++) {
	    		dealarry[player] = [];
	    	}
	    	
	    	for(round = 0; round < hand_size; round++) {
		    	for( player = 0; player < number_players; player++) {
		    		dealarry[player][round] = hit();
		    	}
	    	}
	    	
	    	return dealarry;
	    }
	    
	    function shuffle() {
	    	dealt.splice(0);
	    	shoe.splice(0);
	        for(var i=0; i < shoesize; i++) {
			    $.each(deck, function(cardname, card){
			    	shoe.push(card);
                });
			    shoe = _.shuffle(shoe);
		    }
	    	shoe = cut_and_flutter(shoe);
	    }
	    
	    function cut_and_flutter(a) {
	    	var len = a.length,
	    		half = len / 2,
	    		tmp = [],
	    		tmp2 = [],
	    		i;
	    	//cut the deck in half
	    	for(i=0; i<half; i++) {
	    		tmp.push( a.pop() );
	    	}
	    	
	    	//shuffle both halves
	    	a = _.shuffle(a.reverse());
	    	tmp = _.shuffle(tmp);
	    	len = tmp.length;
	    	
	    	//"bridge" the halves back together
	    	//with more shuffling for good measure
	    	tmp2 = _.zip(a, tmp);
	    	tmp2 = _.flatten(tmp2);
	    	tmp2 = _.compact(tmp2);
	    	return _.shuffle(tmp2);
	    }
	    
	    function get_shoesize() {
	    	return shoesize;
	    }
	    
	    function set_shoesize(size) {
	    	shoesize = size || 1;
	    	shuffle();
	    }
	    
	    function get_deck() {
	    	return deck;
	    }
	    
	    function show_deck() {
	    	console.log( _.pluck(shoe, 'name') );
	    }
	    
	    function print_css() {
	    	
	    	var compiled = _.template("<%= name %> {background: url( tg.url('/games/cards/img/<%= name %>.png') )}");
	    	
	    	$.each(_.keys(deck).sort(), function(idx, cardname){

		    	console.log( compiled({name : cardname}) );		    	
		    	
	    	}); 
	    }

	    init();
	    
	    return {
	    	"hit": hit,
	    	"deal": deal,
	    	"shuffle": shuffle,
	    	"get_shoesize": get_shoesize,
	    	"set_shoesize": set_shoesize,
	    	"get_deck": get_deck,
	    	"show_deck": show_deck,
	    	"print_css": print_css
	    }
	    
	}//END CONSTRUCTOR
})(jQuery);
