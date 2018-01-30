import {books} from "./data/allBooks.js";
/* ============================ MODEL ==================================== */

var model = {
	bookId: null,
	bookDetailObj: null,
	cartValue: 0,
	itemIdArray: []
};

/* ============================= OCTOPUS ================================== */

var octopus = {

	init: function() {
		this.initItemIdArray();
		this.updateCartValue();
		this.initBookId();
		this.initBookDetailObj();

		cartView.init();
		bookView.init();
	},

	addBookIdToLocalStorage: function() {
		if(this.isBookAlreadyInCart())
			return;
		model.itemIdArray.push(model.bookId);
		window.localStorage.setItem("cart",JSON.stringify(model.itemIdArray));
	},

	clickFunction: function(event) {
		if(event.target.closest(".cart-button-block__button") 
			|| event.target.closest(".buy-button-block__button"))
		{
			octopus.addBookIdToLocalStorage();
			octopus.updateCartValue();
			cartView.render();
		}
	},

	getbookDetailObj: function() {
		return model.bookDetailObj;
	},

	getBookIndex: function() {
		return parseInt(model.bookId.substr(1))-1;
	},

	getBookId: function() {
		return model.bookId;
	},

	getCartValue: function() {
		return model.cartValue;
	},

	getItemIdArray: function() {
		return model.itemIdArray;
	},

	initBookDetailObj: function() {
		//get required book index for imported books array
		var bookIndex = this.getBookIndex();

		//get required book details object from books array
		model.bookDetailObj = books[bookIndex];
	},

	initBookId: function() {
		//get bookId from local storage
		model.bookId = window.localStorage.getItem("bookId");
	},

	initItemIdArray: function() {
		var itemIdArray = JSON.parse(window.localStorage.getItem("cart"));
		if(itemIdArray !== null)
			model.itemIdArray = itemIdArray;
	},

	isBookAlreadyInCart: function() {
		var matchedElemInd = model.itemIdArray.indexOf(model.bookId);
		return (matchedElemInd === -1)?false:true;
	},

	updateCartValue: function() {
		model.cartValue = model.itemIdArray.length;
	}
};

/* ============================= VIEW ================================== */

var bookView = {

	init: function() {
		//get DOM elements of book details
		this.imgElem = document.getElementsByClassName("book-img-block__img")[0];
		this.nameElem = document.getElementsByClassName("book-name")[0];
		this.priceElem = document.getElementsByClassName("price-and-seller__price")[0];
		this.sellerElem = document.getElementsByClassName("price-and-seller__seller")[0];
		this.langElem = document.getElementsByClassName("book-specifications__value")[0];
		this.authorElem = document.getElementsByClassName("book-specifications__value")[1];
		this.bindingElem = document.getElementsByClassName("book-specifications__value")[2];
		this.publisherElem = document.getElementsByClassName("book-specifications__value")[3];
		this.genreElem = document.getElementsByClassName("book-specifications__value")[4];	
		this.ISBNElem = document.getElementsByClassName("book-specifications__value")[5];
		this.widthElem = document.getElementsByClassName("book-specifications__value")[6];
		this.heightElem = document.getElementsByClassName("book-specifications__value")[7];
		this.lengthElem = document.getElementsByClassName("book-specifications__value")[8];
		this.weightElem = document.getElementsByClassName("book-specifications__value")[9];

		//render this view
		this.render();
	},

	render: function() {
		//get book details object from model
		var bookDetailObj = octopus.getbookDetailObj();

		//update DOM elements with the values of the book details
		this.imgElem.src = bookDetailObj.imgSrc;
		this.nameElem.textContent = bookDetailObj.name;
		this.priceElem.textContent = `₹${bookDetailObj.price}`;
		this.sellerElem.textContent = bookDetailObj.seller;
		this.langElem.textContent = bookDetailObj.language;
		this.authorElem.textContent = bookDetailObj.author;
		this.bindingElem.textContent = bookDetailObj.binding;
		this.publisherElem.textContent = bookDetailObj.publisher;
		this.genreElem.textContent = bookDetailObj.genre;	
		this.ISBNElem.textContent = bookDetailObj.ISBN;
		this.widthElem.textContent = bookDetailObj.width;
		this.heightElem.textContent = bookDetailObj.height;
		this.lengthElem.textContent = bookDetailObj.length;
		this.weightElem.textContent = bookDetailObj.weight;
	}
};

var cartView = {
	init: function() {
		//get DOM element that contains number of items in cart
		this.cartValueElem = document.getElementsByClassName("cart__cart-value")[0];

		var buttonsBlock = document.getElementsByClassName("buttons-block")[0];
		//get add to cart and buy now button element
		this.cartButton = document.getElementsByClassName("cart-button-block__button")[0];

		//add onclick event listener
		buttonsBlock.addEventListener("click", function(event) {
			octopus.clickFunction(event);
		});

		this.render();
	},

	render: function() {
		this.cartValueElem.innerHTML = octopus.getCartValue();
		if(octopus.isBookAlreadyInCart())
		{
			this.updateCartButtonContent();	
		}
	},

	updateCartButtonContent: function() {
		this.cartButton.textContent = "Added to Cart";
	}
};

octopus.init();