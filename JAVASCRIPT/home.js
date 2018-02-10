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
			octopus.storeBookId(itemDetailDiv.dataset.id);
	},

	clickEventOnCategoryNav: function(event) {
		if(event.target.closest(".category__name"))
			octopus.filterCategory(event.target.innerHTML);
	},

	filterCategory: function(categoryName) {
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
		this.bookSection = document.getElementsByClassName("items-box")[0];
		this.enableFilteredCategory("All");
	},

	addEventListener: function() {
		this.bookSection.addEventListener("click",function(event) {
			octopus.clickEventOnBook(event);
		});
	},

	enableFilteredCategory: function(categoryName) {
		//console.log(categoryName);
        this.bookSection.innerHTML = '';

        books.forEach(function(bookObj) {
            if(categoryName.toLowerCase() === "all")
                bookView.render(bookObj);
            else if(bookObj.category[0].toLowerCase() === categoryName.toLowerCase())
                bookView.render(bookObj);
        });
	},

	render: function(bookObj) {
        var bookDetailsBlock = document.createElement("div");
        bookDetailsBlock.className = "item-details";
        bookDetailsBlock.dataset.id = bookObj.id;
        bookDetailsBlock.dataset.category = bookObj.category;
        bookDetailsBlock.innerHTML =
            `<a class="item-details__anchor" href="commonBookLayout.html">
  			    <div class="item-details__image-block">
  				    <img src="${bookObj.imgSrc}"/>
  				</div>
  				<div class="item-details__name-price">
  					<span class="item-details__name" title="${bookObj.name}">${bookObj.name}</span>
  					<span class="item-details__price">₹${bookObj.price}</span>
  				</div>
  			</a>`;
        bookView.bookSection.appendChild(bookDetailsBlock);

		//add event listener using event delegation
		this.addEventListener();
	},
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