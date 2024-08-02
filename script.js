/*
 - crea un marketplace di libri
 - homepage che mostra tutti i libri con card
 - card con pulsante per aggiungere al carrello e uno per saltare il prodotto
 - sezione carrello
 - ricerca libri con filter (almeno 3 caratteri)
 - API: https://striveschool-api.herokuapp.com/books
 - cambia lo stile della card quando viene aggiunta al carrello

 EXTRA
 - cancellazione item carrello
 - conta elementi carrello e mostra risultato
 - pulsante per svuotare il carrello
 */

const apiUrl = `https://striveschool-api.herokuapp.com/books`;
const cartBtn = document.getElementById("cartBtn");
const resultsContainer = document.getElementById("results-container");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cart = [];

const fetchData = async () => {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayResults(data);
        searchInput.addEventListener("input", () => enableSearch(data));
        searchBtn.addEventListener("click", () => searchBooks(data));
    } catch (error) {
        console.log(error);
    }
}

fetchData()

const displayResults = (data) => {
    resultsContainer.replaceChildren();
    data.forEach(element => createCard(element))
}

const createCard = (data) => {
    const col = document.createElement("div");
    col.setAttribute("class", "col");

    const card = document.createElement("div");
    card.setAttribute("class", "card h-100");

    const row = document.createElement("div");
    row.setAttribute("class", "row g-0 h-100");

    const imgCol = document.createElement("div");
    imgCol.setAttribute("class", "col-4");

    const img = document.createElement("img");
    img.setAttribute("class", "card-img img-fluid h-100 object-fit-contain");
    img.src = data.img;
    img.alt = data.title;

    const bodyCol = document.createElement("div");
    bodyCol.setAttribute("class", "col-8");

    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body h-100 d-flex flex-column justify-content-between");

    const title = document.createElement("h5");
    title.setAttribute("class", "card-title");
    title.innerText = data.title;

    const category = document.createElement("p");
    category.setAttribute("class", "card-subtitle");
    category.innerText = data.category;

    const price = document.createElement("p");
    price.setAttribute("class", "card-text text-end");
    price.innerText = `${data.price.toFixed(2)} €`;

    const addToCart = document.createElement("button");
    addToCart.setAttribute("class", "btn btn-secondary w-100 d-flex align-items-center justify-content-between");
    addToCart.setAttribute("type", "button");

    const buttonSpan = document.createElement("span");
    buttonSpan.innerText = `Add to cart`;

    const cartIcon = document.createElement("i");
    cartIcon.setAttribute("class", "bi bi-cart-plus");

    addToCart.append(buttonSpan, cartIcon);
    cardBody.append(title, category, price, addToCart);
    bodyCol.appendChild(cardBody);
    imgCol.appendChild(img);
    row.append(imgCol, bodyCol);
    card.appendChild(row);
    col.appendChild(card);
    resultsContainer.appendChild(col);

    addToCart.addEventListener("click", () => addItemToCart(data, card))
}

const addItemToCart = (data, card) => {
    if (cart.find(item => item.Item === data)) {
        cart.find(item => item.Item === data).Qty ++
    } else {
        cart.push({Item: data, Qty: 1})
    }
    card.classList.add("bg-secondary-subtle");
}

cartBtn.addEventListener("click", () => {
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
    const cartBody = document.querySelector("#cartModal .modal-body");
    cartBody.replaceChildren();
    cart.forEach((item, index) => createCartItem(item, cartBody, index));
    document.querySelector("#cartCount").innerText = countCartItems()

})

const countCartItems = () => {
    return cart.reduce((acc, cur) => acc + cur.Qty, 0);
}


const createCartItem = (item, container, index) => {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "d-flex justify-content-between align-items-center");

    const title = document.createElement("p");
    title.innerText = item.Item.title;

    const rightSide = document.createElement("div");
    rightSide.setAttribute("class", "d-flex align-items-center gap-2");

    const qty = document.createElement("p");
    qty.innerText = `Quantity: ${item.Qty}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("class", "btn btn-primary");

    const deleteIcon = document.createElement("i");
    deleteIcon.setAttribute("class", "bi bi-trash");

    deleteBtn.appendChild(deleteIcon);
    rightSide.append(qty, deleteBtn);
    wrapper.append(title, rightSide);
    container.appendChild(wrapper);

    deleteBtn.addEventListener("click", () => removeCartItem(index));
}

const removeCartItem = (index) => {
    cart.splice(index, 1);
    const cartBody = document.querySelector("#cartModal .modal-body");
    cartBody.replaceChildren();
    cart.forEach((item, index) => createCartItem(item, cartBody, index))
    document.querySelector("#cartCount").innerText = countCartItems();
}

const emptyCart = () => {
    cart.splice(0);
    const cartBody = document.querySelector("#cartModal .modal-body");
    cartBody.replaceChildren();
    document.querySelector("#cartCount").innerText = countCartItems();
}

const enableSearch = (data) => {
    searchInput.value.length >= 3 ? searchBtn.disabled = false : searchBtn.disabled = true;
}

const searchBooks = (data) => {
    const results = data.filter(item => item.title.toLowerCase().includes(searchInput.value.toLowerCase()));
    console.log(results);
    displayResults(results);
    searchInput.value = "";
    enableSearch();
}