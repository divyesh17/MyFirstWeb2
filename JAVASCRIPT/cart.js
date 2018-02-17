import {books} from "./data/allBooks.js";
/* ============================ MODEL ==================================== */

const model = {
    cartValue: 0,
    clickedItemOldQuantity: 0,
    deliveryCharge: 0,
    itemIdArray: [],
    totalQuantity: 0,
    totalItemPrice: 0
};

/* ============================= OCTOPUS ================================== */

const octopus = {

    init: function () {
        this.initItemIdArray();
        this.updateCartValue();

        priceView.init();
        cartView.init();
    },

    changeEvent: function (event) {
        let newQuantity = event.target.value;
        let oldQuantity = octopus.getOldQuantity();

        if (octopus.isCorrectValue(newQuantity, event) === false)
            return;

        let parentNode = event.target.closest(".quantity-update");
        //update disabled value of minus button
        cartView.changeDisabledValue(parentNode);
        let quantityDiff = parseInt(newQuantity) - oldQuantity;
        let selectedItemPrice = octopus.getCurrentItemPrice(event);
        octopus.updateItemPriceAndQuantity(selectedItemPrice * quantityDiff, quantityDiff);
        this.updateValueInItemArray(this.getBookId(event),quantityDiff);
    },

    clickEvent: function (event) {
        let selectedItemPrice = octopus.getCurrentItemPrice(event);
        let bookId = octopus.getBookId(event);
        let parentNode = event.target.closest(".quantity-update");

        if (event.target.closest(".quantity-update--plus")) {
            //increase quantity in value attribute of input element
            this.updateValueInInput(event, 1);
            this.updateValueInItemArray(bookId,1);
            //update disabled value of minus button
            cartView.changeDisabledValue(parentNode);
            octopus.updateItemPriceAndQuantity(selectedItemPrice, 1);
        }
        else if (event.target.closest(".quantity-update--minus")) {
            //increase quantity in value attribute of input element
            this.updateValueInInput(event, -1);
            this.updateValueInItemArray(bookId,-1);
            //update disabled value of minus button
            cartView.changeDisabledValue(parentNode);
            octopus.updateItemPriceAndQuantity(-selectedItemPrice, -1);
        }
        else if (event.target.closest(".quantity-remove__button")) {
            let itemDivBlock = event.target.closest(".cart-items-list");
            // remove id from local storage
            octopus.removeFromLocalStorage(bookId);
            let selectedItemQuantity = octopus.getCurrentItemQuantity(event);
            // update total price and quantity
            octopus.updateItemPriceAndQuantity(-selectedItemPrice * selectedItemQuantity, -selectedItemQuantity);
            // remove item from cart
            itemDivBlock.remove();
            // update items quantity in cart
            cartView.updateCartValue(octopus.getCartValue());
        }
        else if (event.target.closest(".name-block__name")) {
            octopus.storeIdToLocalStorage(bookId);
        }
    },

    focusEvent: function (event) {
        octopus.setOldQuantity(event.target.value);
    },

    getBookId: function (event) {
        if(typeof event === 'undefined')
            return -1;
        // get dom element that has id of book
        let itemDivBlock = event.target.closest(".cart-items-list");
        return itemDivBlock.dataset.id;
    },

    getBookIndex: function (bookId) {
        return parseInt(bookId.substr(1)) - 1;
    },

    getCartValue: function () {
        return model.cartValue;
    },

    getCurrentItemPrice: function (event) {
        if(typeof event === 'undefined')
            return 0;
        let bookId = this.getBookId(event);
        let bookInd = this.getBookIndex(bookId);
        let itemPrice = books[bookInd].price;
        return parseInt(itemPrice);
    },

    getCurrentItemQuantity: function (event) {
        let ancestorNode = event.target.closest(".name-and-price");
        let itemQuantity = ancestorNode.getElementsByClassName("quantity-update__input")[0].value;
        return parseInt(itemQuantity);
    },

    getDeliveryCharge: function () {
        return model.deliveryCharge;
    },

    getItemIdArray: function () {
        return model.itemIdArray;
    },

    getOldQuantity: function () {
        return model.clickedItemOldQuantity;
    },

    getPayableAmount: function () {
        return (model.totalItemPrice + model.deliveryCharge);
    },

    getTotalQuantity: function () {
        return model.totalQuantity;
    },

    getTotalItemPrice: function () {
        return model.totalItemPrice;
    },

    initItemIdArray: function () {
        let itemIdArray = JSON.parse(window.localStorage.getItem("cart"));
        //alert(window.localStorage.getItem("cart"));
        if (itemIdArray !== null)
            model.itemIdArray = itemIdArray;
    },

    isCorrectValue: function (newQuantity, event) {
        if (isNaN(newQuantity) || parseInt(newQuantity) <= 0) {
            alert("Please Enter Correct Quantity.");
            event.target.value = model.clickedItemOldQuantity;
            return false;
        }
        return true;
    },

    removeFromLocalStorage: function (bookId) {
        let itemInd = model.itemIdArray.reduce((itemInd,itemObj,curInd) => {
            if(itemObj.bookId === bookId)
                itemInd = curInd;
        },0);
        model.itemIdArray.splice(itemInd, 1);
        window.localStorage.setItem("cart", JSON.stringify(model.itemIdArray));
        octopus.updateCartValue();
    },

    setOldQuantity: function (quantity) {
        model.clickedItemOldQuantity = parseInt(quantity);
    },

    storeIdToLocalStorage: function (bookId) {
        window.localStorage.setItem("bookId", bookId);
    },

    updateCartValue: function () {
        model.cartValue = model.itemIdArray.length;
    },

    updateItemPriceAndQuantity: function (price, quantity) {
        model.totalItemPrice += parseInt(price);
        model.totalQuantity += parseInt(quantity);
        priceView.render();
    },

    updateValueInInput: function (event, updateValue) {
        let parentElem = event.target.closest(".quantity-update");
        let itemQuantityElem = parentElem.getElementsByClassName("quantity-update__input")[0];
        itemQuantityElem.value = parseInt(itemQuantityElem.value) + updateValue;
    },

    updateValueInItemArray: function (bookId, value) {
        let itemInd = model.itemIdArray.reduce((itemInd,itemObj,curInd) => {
            if(itemObj.bookId === bookId) {
                itemInd = curInd;
            }
            return itemInd;
        },0);
        model.itemIdArray[itemInd].quantity += value;
        window.localStorage.setItem("cart", JSON.stringify(model.itemIdArray));
    }
};

/* ============================= VIEW ================================== */

const cartView = {
	init: function() {
		//get DOM element that contains number of items in cart
		this.cartValueElem = document.getElementsByClassName("cart-value")[0];
		//get DOM element of cart box
		this.cartTable = document.getElementsByClassName("cart-items-table")[0];

		this.render();
	},

	addEventListener: function() {

		let inputElemArray = document.getElementsByClassName("quantity-update__input");

		for(let i=0; i<inputElemArray.length; i++) {
			inputElemArray[i].addEventListener("focus",function(event) {
				octopus.focusEvent(event);
			});

			inputElemArray[i].addEventListener("change",function(event) {
				octopus.changeEvent(event);
			});
		}

		this.cartTable.addEventListener("click", function(event) {
			octopus.clickEvent(event);
		});
	},

	changeDisabledValue: function(parentNode) {
		let inputElem = parentNode.getElementsByClassName("quantity-update__input")[0];
		let minusButton = parentNode.getElementsByClassName("quantity-update__button")[0];

		if(inputElem.value === "1")
			minusButton.disabled = true;
		else minusButton.disabled = false;
	},

	render: function() {
		this.updateCartValue(octopus.getCartValue());

		let itemIdArray = octopus.getItemIdArray();

		itemIdArray.forEach(function(cartBookObj) {
			//get book detial object from books array using its index
            let bookId = cartBookObj.bookId;
			let bookIndex = parseInt(bookId.substr(1))-1;
			let bookObj = books[bookIndex];

			let itemListElem = document.createElement("div");
			itemListElem.className = "cart-items-list";
			itemListElem.dataset.id = bookObj.id;
			itemListElem.innerHTML = 
				    `<div class="img-block">
              			<img class="img-block__img" src="${bookObj.imgSrc}"/>
            		</div>
            		<div class="name-and-price">
              			<div class="name-block">
                			<a href="../commonBookLayout.html" class="name-block__name">${bookObj.name}</a>    
              			</div>
              			<div class="price-and-seller">
                			<span class="price-and-seller__price">₹</span>
                			<span class="price-and-seller__price">${bookObj.price}</span>
                			<p>sold by <a href=""><strong>${bookObj.seller}</strong></a></p>
              			</div>

              			<div class="quantity-update-or-remove">
                			<div class="quantity-update">
                  				<button class="quantity-update__button quantity-update--minus">-</button>
                  				<input class="quantity-update__input" type="text" value="${cartBookObj.quantity}"/>
                  				<button class="quantity-update__button quantity-update--plus">+</button>
                			</div>

                			<div class="quantity-remove">
                  				<button class="quantity-remove__button">REMOVE</button>
                			</div>
              			</div>
            		</div>`;

			let price = bookObj.price;
			let quantity = cartBookObj.quantity;

			cartView.changeDisabledValue(itemListElem.getElementsByClassName('quantity-update')[0]);
          	octopus.updateItemPriceAndQuantity(price*quantity,quantity);
          	cartView.cartTable.appendChild(itemListElem);
		});
		cartView.addEventListener();
	},

	updateCartValue: function(cartValue) {
		this.cartValueElem.textContent = cartValue;
	}
};

const priceView = {
	init: function() {
		this.totalQuantityElem = document.getElementsByClassName("items-quantity")[0];
		this.totalItemPriceElem = document.getElementsByClassName("total-items-price")[0];
		this.deliveryChargeElem = document.getElementsByClassName("delivery-charge")[0];
		this.payableAmountElem = document.getElementsByClassName("amount-payable")[0];

		this.render();
	},

	render: function() {
		this.totalQuantityElem.textContent = octopus.getTotalQuantity();
		this.totalItemPriceElem.textContent = octopus.getTotalItemPrice();
		this.deliveryChargeElem.textContent = octopus.getDeliveryCharge();
		this.payableAmountElem.textContent = octopus.getPayableAmount();
	}
};

octopus.init();