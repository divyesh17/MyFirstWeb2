
function updateCart() {
	var curButton = document.getElementsByClassName("bookPage-product-btn-ctBtn")[0].getElementsByTagName('strong')[0];	
	if(curButton.innerHTML == "Added to Cart")
		return;
	var cart = document.getElementsByClassName("cartAndSearch-cart")[0].getElementsByTagName('span')[0];
	var str = cart.innerHTML;
	str = str.substring(6);
	var numItem = parseInt(str);
	numItem++;
	cart.innerHTML = "Cart (" + numItem + ")";
	curButton.innerHTML = "Added to Cart";
	addItem();
}

function addItem() {
	var itemDet={};
	itemDet.id 		= document.getElementById("bookID").innerHTML; 
	itemDet.image 	= document.getElementsByClassName("bookPage-product-img")[0].getElementsByTagName("img")[0].src;
	itemDet.name  	= document.getElementsByClassName("bookPage-info")[0].getElementsByTagName("span")[0].innerHTML;
	itemDet.price	= document.getElementsByClassName("bookPage-info-priceAndSeller-price")[0].innerHTML;
	itemDet.seller	= document.getElementsByClassName("bookPage-info-priceAndSeller")[0].getElementsByTagName("strong")[0].innerHTML;
	
	const locStor = window.localStorage;

	var itemArray=[];

	if(locStor.getItem("cart") !== null)
	{
		itemArray = JSON.parse(locStor.getItem("cart"));
	}
	for(let ind = 0; ind < itemArray.length; ind++)	
	{
		if(itemArray[ind].id === itemDet.id)
			return;
	}
	//alert(itemArray.length);
	itemArray.push(itemDet);
	locStor.setItem("cart", JSON.stringify(itemArray));
}