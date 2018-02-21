import {books} from "./data/allBooks.js";
/* ============================ MODEL ==================================== */

const model = {
	bookId: null,
	bookDetailObj: null,
	cartValue: 0,
	itemIdArray: []
};

/* ============================= OCTOPUS ================================== */

const octopus = {

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
		model.itemIdArray.push({bookId: model.bookId, quantity: 1});
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

	getBookDetailObj: function() {
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
		let bookIndex = this.getBookIndex();

		//get required book details object from books array
		model.bookDetailObj = books[bookIndex];
	},

	initBookId: function() {
		//get bookId from local storage
        let urlParams = new URLSearchParams(window.location.search);
		model.bookId = urlParams.get('itemId');
	},

	initItemIdArray: function() {
		let itemIdArray = JSON.parse(window.localStorage.getItem("cart"));
		if(itemIdArray !== null)
			model.itemIdArray = itemIdArray;
	},

	isBookAlreadyInCart: function() {
		let matchedElemInd = model.itemIdArray.reduce((matchedInd,bookObj,curInd) => {
				if(bookObj.bookId === model.bookId)
					matchedInd = curInd;
				return matchedInd;
		},-1);
		return (matchedElemInd !== -1);
	},

	updateCartValue: function() {
		model.cartValue = model.itemIdArray.length;
	}
};

/* ============================= VIEW ================================== */

const bookView = {

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
		let bookDetailObj = octopus.getBookDetailObj();

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

const cartView = {
	init: function() {
		//get DOM element that contains number of items in cart
		this.cartValueElem = document.getElementsByClassName("cart__cart-value")[0];

		let buttonsBlock = document.getElementsByClassName("buttons-block")[0];
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