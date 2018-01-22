
const locStor = window.localStorage;

window.onload = function () {
	//locStor.removeItem("cart");
	var itemArray;
	if(locStor.getItem("cart") === null)
		return;
	itemArray = JSON.parse(locStor.getItem("cart"));
	var len = itemArray.length;
	for (let ind = 0; ind < len; ind++)
	{
		var itemDet = itemArray[ind];
		let id = itemDet.id;

		var cartBox_item = document.createElement("div");
			var cartBox_item_detail = document.createElement("div");
				var cartBox_item_detail_img = document.createElement("div");
					var img = document.createElement("img");
					img.setAttribute("src", itemDet.image);
					cartBox_item_detail_img.appendChild(img);
				cartBox_item_detail_img.setAttribute("class", "cartBox-item-detail-img");	
				cartBox_item_detail.appendChild(cartBox_item_detail_img);

				var cartBox_item_detail_nameAndPrice = document.createElement("div");
					var cartBox_item_detail_nameAndPrice_name = document.createElement("div");
						var span = document.createElement("span");
						span.innerHTML = itemDet.name;
						cartBox_item_detail_nameAndPrice_name.appendChild(span);
					cartBox_item_detail_nameAndPrice_name.setAttribute("class","cartBox-item-detail-nameAndPrice-name");
					cartBox_item_detail_nameAndPrice.appendChild(cartBox_item_detail_nameAndPrice_name);

					var cartBox_item_detail_nameAndPrice_price = document.createElement("div");
						span = document.createElement("span");
						span.innerHTML = itemDet.price;
						cartBox_item_detail_nameAndPrice_price.appendChild(span);

						var p = document.createElement("p");
						p.innerHTML = "sold by ";
							var anchor = document.createElement("a");
								var strong = document.createElement("strong");
								strong.innerHTML = itemDet.seller;	
								anchor.appendChild(strong);
							anchor.setAttribute("href","#");
							p.appendChild(anchor);
						cartBox_item_detail_nameAndPrice_price.appendChild(p);
					cartBox_item_detail_nameAndPrice_price.setAttribute("class", "cartBox-item-detail-nameAndPrice-price");
					cartBox_item_detail_nameAndPrice.appendChild(cartBox_item_detail_nameAndPrice_price);

					var cartBox_item_detail_nameAndPrice_addAndRemove = document.createElement("div");
						var cartBox_item_detail_nameAndPrice_addAndRemove_add = document.createElement("div");
							var cartBox_item_detail_nameAndPrice_addAndRemove_add_minus = document.createElement("button");
							cartBox_item_detail_nameAndPrice_addAndRemove_add_minus.innerHTML = "-";
							cartBox_item_detail_nameAndPrice_addAndRemove_add_minus.disabled = true;
							cartBox_item_detail_nameAndPrice_addAndRemove_add_minus.onclick = function() {decreaseQuantity(id)};
							cartBox_item_detail_nameAndPrice_addAndRemove_add_minus.setAttribute("class", "cartBox-item-detail-nameAndPrice-addAndRemove-add-minus");
							cartBox_item_detail_nameAndPrice_addAndRemove_add.appendChild(cartBox_item_detail_nameAndPrice_addAndRemove_add_minus);
						
							var input = document.createElement("input");
							input.setAttribute("type", "text");
							input.setAttribute("value","1");
							cartBox_item_detail_nameAndPrice_addAndRemove_add.appendChild(input);

							var cartBox_item_detail_nameAndPrice_addAndRemove_add_plus = document.createElement("button");
							cartBox_item_detail_nameAndPrice_addAndRemove_add_plus.innerHTML = "+";
							cartBox_item_detail_nameAndPrice_addAndRemove_add_plus.onclick = function() {increaseQuantity(id)};
							cartBox_item_detail_nameAndPrice_addAndRemove_add_plus.setAttribute("class", "cartBox-item-detail-nameAndPrice-addAndRemove-add-plus");
							cartBox_item_detail_nameAndPrice_addAndRemove_add.appendChild(cartBox_item_detail_nameAndPrice_addAndRemove_add_plus);
						cartBox_item_detail_nameAndPrice_addAndRemove_add.setAttribute("class", "cartBox-item-detail-nameAndPrice-addAndRemove-add");
						cartBox_item_detail_nameAndPrice_addAndRemove.appendChild(cartBox_item_detail_nameAndPrice_addAndRemove_add);

						var cartBox_item_detail_nameAndPrice_addAndRemove_remove = document.createElement("div");
							var button = document.createElement("button");
							button.innerHTML = "REMOVE";
							button.onclick = function() {removeCart(id)};
							cartBox_item_detail_nameAndPrice_addAndRemove_remove.appendChild(button);
						cartBox_item_detail_nameAndPrice_addAndRemove_remove.setAttribute("class","cartBox-item-detail-nameAndPrice-addAndRemove-remove");
						cartBox_item_detail_nameAndPrice_addAndRemove.appendChild(cartBox_item_detail_nameAndPrice_addAndRemove_remove);
					cartBox_item_detail_nameAndPrice_addAndRemove.setAttribute("class", "cartBox-item-detail-nameAndPrice-addAndRemove");
					cartBox_item_detail_nameAndPrice.appendChild(cartBox_item_detail_nameAndPrice_addAndRemove);
				cartBox_item_detail_nameAndPrice.setAttribute("class","cartBox-item-detail-nameAndPrice");
				cartBox_item_detail.appendChild(cartBox_item_detail_nameAndPrice);
				cartBox_item_detail.setAttribute("class", "cartBox-item-detail");
				cartBox_item.appendChild(cartBox_item_detail);
		cartBox_item.setAttribute("class", "cartBox-item");
		cartBox_item.setAttribute("id", itemDet.id);
		document.getElementsByClassName("cartBox-cartItm")[0].appendChild(cartBox_item);
		updatePrice(parseInt(itemDet.price.substring(1)));
	}

	updateQuantity(len);
}

function updateQuantity(len)
{
	var myCart = document.getElementsByClassName("cartBox-cartItm-myCart")[0].getElementsByTagName("span")[0];
	myCart.innerHTML = "MY CART (" + len + ")";
	var price = document.getElementsByClassName("priceAndCheckout-qntWisePrice-qntAndPrice")[0].getElementsByTagName("div")[0];
	price.innerHTML = "Price (" + len + " items)";
}

function removeCart(id) {
	var itemArray = JSON.parse(locStor.getItem("cart"));
	var price;
	for(let ind = 0; ind < itemArray.length; ind++)
	{
		if(itemArray[ind].id === id)
		{
			price = parseInt(itemArray[ind].price.substring(1));
			itemArray.splice(ind,1);
			locStor.setItem("cart", JSON.stringify(itemArray));
			break;
		}
	}
	var str = "cartBox-item-detail-nameAndPrice-addAndRemove-add";
	var inputElement = document.getElementById(id).getElementsByClassName(str)[0].getElementsByTagName("input")[0];
	var inputValue = parseInt(inputElement.value);
	updatePrice(-price*inputValue);
	updateQuantity(itemArray.length);
	document.getElementById(id).remove();
}

function increaseQuantity(id) {
	
	var str = "cartBox-item-detail-nameAndPrice-addAndRemove-add";
	var inputElement = document.getElementById(id).getElementsByClassName(str)[0].getElementsByTagName("input")[0];
	var inputValue = parseInt(inputElement.value);
	inputValue++;
	inputElement.value = inputValue;

	var price = document.getElementById(id).getElementsByClassName("cartBox-item-detail-nameAndPrice-price")[0].getElementsByTagName("span")[0];
	var oldPrice = parseInt(price.innerHTML.substring(1));
	var newPrice = (oldPrice/(inputValue-1))*inputValue;
	price.innerHTML = "₹"+newPrice;

	updatePrice(newPrice-oldPrice);
	document.getElementById(id).getElementsByClassName(str)[0].getElementsByTagName("button")[0].disabled = false;
}

function decreaseQuantity(id) {
	var str = "cartBox-item-detail-nameAndPrice-addAndRemove-add";
	var inputElement = document.getElementById(id).getElementsByClassName(str)[0].getElementsByTagName("input")[0];
	var inputValue = parseInt(inputElement.value);
	inputValue--;
	inputElement.value = inputValue;

	var price = document.getElementById(id).getElementsByClassName("cartBox-item-detail-nameAndPrice-price")[0].getElementsByTagName("span")[0];
	var oldPrice = parseInt(price.innerHTML.substring(1));
	var newPrice = (oldPrice/(inputValue+1))*inputValue;
	price.innerHTML = "₹"+newPrice;

	updatePrice(newPrice-oldPrice);
	if(inputValue==1)
		document.getElementById(id).getElementsByClassName(str)[0].getElementsByTagName("button")[0].disabled = true;
}

function updatePrice(inc)
{
	var priceElement = document.getElementsByClassName("priceAndCheckout-qntWisePrice-qntAndPrice");

	var totPrice = priceElement[0].getElementsByTagName("div")[1];
	var newTotPrice = parseInt(totPrice.innerHTML.substring(1)) + inc;
	totPrice.innerHTML = "₹"+newTotPrice;
	
	var totPay = priceElement[2].getElementsByTagName("div")[1];
	var newTotPay = parseInt(totPay.innerHTML.substring(1)) + inc;
	totPay.innerHTML = "₹"+newTotPay;
}