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

	clickEventOnBook: function(event) {
		var itemDetailDiv = event.target.closest(".item-details");
		if(itemDetailDiv !== null)
			octopus.storeBookId(itemDetailDiv.id);
	},

	clickEventOnCategoryNav: function(event) {
		if(event.target.closest(".category__name"))
			octopus.filterCategory(event.target.innerHTML);
	},

	filterCategory: function(categoryName) {
		//console.log(categoryName);
		bookView.changeCategoryName(categoryName);
		bookView.enableFilteredCategory(categoryName);
	},

	getCartValue: function() {
		return model.cartValue;
	},

	storeBookId: function(bookId) {
		window.localStorage.setItem("bookId", bookId);
	},

	updateTotalCategory: function() {
		model.totalCategory = 5;
	},

	updateCartValue: function() {
		var itemIdArray = JSON.parse(window.localStorage.getItem("cart"));
		model.cartValue = (itemIdArray==null)?0:itemIdArray.length;
	}
};

/* ============================= VIEW ================================== */

var bookView = {

	init: function() {
		this.bookSection = document.getElementsByClassName("items-list")[0];
		this.enableFilteredCategory("All");
		//render this view
		this.render();
	},

	addEventListener: function() {
		this.bookSection.addEventListener("click",function(event) {
			octopus.clickEventOnBook(event);
		});
	},

	changeCategoryName: function(categoryName) {
		var categoryNameElem = document.getElementsByClassName("items-category__name")[0];
		categoryNameElem.innerHTML = categoryName;
	},

	changeCategoryStyle: function() {
		var categorySection = document.getElementsByClassName("items-box")[0];
		categorySection.style.height = (screen.height-120) + "px";
		categorySection.style.display = "flex";
		var itemBlock = categorySection.getElementsByClassName("items-list")[0];
		itemBlock.style.flexWrap = "wrap";
	},

	enableFilteredCategory: function(categoryName) {
		//console.log(screen.height);
		this.changeCategoryStyle();
		var allBooksArray = document.getElementsByClassName("item-details");

		for(let i=0; i<allBooksArray.length; i++) {
			var curCategoryName = allBooksArray[i].getElementsByClassName("item-details__category")[0].innerHTML;
			if(categoryName == "All" || categoryName.toLowerCase() === curCategoryName.toLowerCase())
				allBooksArray[i].style.display = "flex";
			else allBooksArray[i].style.display = "none";
		}
	},

	render: function() {
		//update DOM elements with the values from the current cat
		books.forEach(function(bookObj) {

			var bookDetailsBlock = document.createElement("div");
			bookDetailsBlock.className = "item-details";
			bookDetailsBlock.id = bookObj.id;
			bookDetailsBlock.innerHTML = 
					`<a class="item-details__anchor" href="commonBookLayout.html">
  						<div class="item-details__image-block">
  							<img src="${bookObj.imgSrc}"/>
  						</div>
  						<div class="item-details__name-price">
  							<span class="item-details__name">${bookObj.name}</span>
  							<span class="item-details__price">₹${bookObj.price}</span>
  							<span class="item-details__category">${bookObj.category}</span>
  						</div>
  					</a>`;
  			bookView.bookSection.appendChild(bookDetailsBlock);
		});

		//add event listener using event delegation
		this.addEventListener();
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
		this.categoryNavElem = document.getElementsByClassName("category__nav")[0];
		this.addEventListener();
	},

	addEventListener: function() {
		this.categoryNavElem.addEventListener("click", function(event) {
				octopus.clickEventOnCategoryNav(event);
		});
	}
};

octopus.init();