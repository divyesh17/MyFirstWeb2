import {books} from "./data/allBooks.js";
/* ============================ MODEL ==================================== */

var model = {
	cartValue: 0,
	totalCategory: 0
};

/* ============================= OCTOPUS ================================== */

var octopus = {

	init: function() {
		this.updateCartValue();
		this.updateTotalCategory();
		cartView.init();
		categoryView.init();
		bookView.init();
	},

	filterCategory: function(categoryIndex) {
		for(let i=0;i<model.totalCategory;i++) {
			if(i!=categoryIndex)
			{	
				bookView.disableCategory(i);
			}
		}
		bookView.enableFilteredCategory(categoryIndex);
	},

	getCartValue: function() {
		return model.cartValue;
	},

	storeBookId: function(bookId) {
		window.localStorage.setItem("bookId", bookId);
	},

	updateTotalCategory: function() {
		model.totalCategory = 4;
	},

	updateCartValue: function() {
		var itemIdArray = JSON.parse(window.localStorage.getItem("cart"));
		model.cartValue = (itemIdArray==null)?0:itemIdArray.length;
	}
};

/* ============================= VIEW ================================== */

var bookView = {

	init: function() {
		//render this view
		this.render();
	},

	disableCategory: function(categoryIndex) {
		var categorySection = document.getElementsByClassName("items-box")[categoryIndex];
		categorySection.style.display = "none";
	},

	enableFilteredCategory: function(categoryIndex) {
		//console.log(screen.height);
		var categorySection = document.getElementsByClassName("items-box")[categoryIndex];
		categorySection.style.height = (screen.height-120) + "px";
		categorySection.style.display = "flex";
		var itemBlock = categorySection.getElementsByClassName("items-list")[0];
		itemBlock.style.flexWrap = "wrap";
	},

	getDivNumOfCategory: function(elem) {
		//alert(elem.category[0]);
		switch(elem.category[0])
		{
			case "fiction" :
						return 0;
			case "self-help" :
						return 1;	
			case "religion" :
						return 2;
			case "business" :
						return 3;
		}
	},

	render: function() {
		//update DOM elements with the values from the current cat
		books.forEach(function(elem) {
			var divNumOfCategary = bookView.getDivNumOfCategory(elem);
			var itemsListElem = document.getElementsByClassName("items-list")[divNumOfCategary];

			var bookDetailsBlock = document.createElement("div");
			bookDetailsBlock.className = "item-details";
			bookDetailsBlock.innerHTML = 
					`<a class="item-details__anchor" href="commonBookLayout.html">
  						<div class="item-details__image-block">
  							<img src="${elem.imgSrc}"/>
  						</div>
  						<div class="item-details__name-price">
  							<span class="item-details__name">${elem.name}</span>
  							<span class="item-details__price">₹${elem.price}</span>
  						</div>
  					</a>`
  			var anchorElem = bookDetailsBlock.getElementsByClassName("item-details__anchor")[0];
  			anchorElem.addEventListener("click",function(){
  				octopus.storeBookId(elem.id);
  			});
  			itemsListElem.appendChild(bookDetailsBlock);
		});
	}
};

var cartView = {
	init: function() {
		this.cartValueElem = document.getElementsByClassName("cart__cart-value")[0];
		this.render();
	},

	render: function() {
		this.cartValueElem.innerHTML = octopus.getCartValue();
	}
};

var categoryView = {
	init: function() {
		this.categoryArray = document.getElementsByClassName("category__choose");
		this.addEventListener();
	},

	addEventListener: function() {
		for(let i=0;i<this.categoryArray.length;i++){
			this.categoryArray[i].addEventListener("click", (function(categoryIndex) {
				return function() {
					octopus.filterCategory(categoryIndex);
				}
			})(i));
		}
	}
};

octopus.init();