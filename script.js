const pokemonList = document.getElementById('pokemonList');
const cart = document.getElementById('cart');
const cartItems = [];

listPokemonWithDetails = async () => {
  try{
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
    if(response.ok) {
      const data = await response.json();
      const pokemonUrls = data.results;
  
      pokemonList.innerHTML = '';

      for(const pokemonUrl of pokemonUrls) {
        const pokemonResponse = await fetch(pokemonUrl.url);
        if(pokemonResponse.ok) {
          const pokemonData = await pokemonResponse.json();
          
          const price = Math.floor(Math.random() * 100) + 1;
          const listItem = createPokemonListItem(pokemonData, price);
          pokemonList.appendChild(listItem);
        }
      }
    } else {
      console.error('Erro ao buscar Pokémon.');
    }
  } catch (error) {
    console.log('Erro ao buscar Pokémon: ' + error);
  }
}

createPokemonListItem = (pokemonData, price) => {
  const listItem = document.createElement('li');

  const nameElement = document.createElement('h2');
  nameElement.innerText = pokemonData.name;

  const idElement = document.createElement('p');
  idElement.innerText = `ID: ${pokemonData.id}`;

  const typesElement = document.createElement('p');
  const types = pokemonData.types.map(type => type.type.name).join(', ');
  typesElement.innerText = `Tipos: ${types}`;

  const imageElement = document.createElement('img');
  imageElement.src = pokemonData.sprites.front_default;
  imageElement.alt = pokemonData.name;

  const priceElement = document.createElement('p');
  priceElement.innerText = `Preço: R${price}`;

  const addButton = document.createElement('button');
  addButton.innerText = 'Adicionar ao carrinho';
  addButton.addEventListener('click', () => {
    addToCart(pokemonData.name, price);
  });

  listItem.appendChild(nameElement);
  listItem.appendChild(idElement);
  listItem.appendChild(typesElement);
  listItem.appendChild(imageElement);
  listItem.appendChild(priceElement);
  listItem.appendChild(addButton);

  return listItem;
}

addToCart = (pokemonName, price) => {
  const existingItem = cartItems.find(item => item.name === pokemonName);
  if(existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({name: pokemonName, price, quantity: 1});
  }
  upDateCart();
}

upDateCart = () => {
  cart.innerHTML = 'Carrinho de Compras';
  if(cartItems.length === 0) {
    cart.innerHTML += ' - O carrinho está vazio.'
  } else {
    const cartList = document.createElement('ul');
    let total = 0;

    for(const item of cartItems) {
      const cartItem = document.createElement('li');

      const removeButton = document.createElement('button');
      removeButton.innerText = 'Remover';
      removeButton.classList.add('remove-button');
      removeButton.addEventListener('click', () => {
        removeFromCart(item.name);
      });

      const itemInfo = document.createElement('p')
      const name = item.name;
      const price = item.price;
      const quantity = item.quantity;
      const itemTotal = price * quantity;
      itemInfo.innerText = `${name} - R${price} x ${quantity} = R$${itemTotal}`;

      cartItem.appendChild(removeButton);
      cartItem.appendChild(itemInfo);

      cartList.appendChild(cartItem);
      total += itemTotal;
    }

    cart.appendChild(cartList);

    const totalElement = document.createElement('p');
    totalElement.innerText = `Total R$${total}`;
    cart.appendChild(totalElement);

    const clearButton = document.createElement('button');
    clearButton.innerText = 'Limpar Carrinho';
    clearButton.addEventListener('click', clearCart);
    cart.appendChild(clearButton);

    const checkoutButton = document.createElement('button');
    checkoutButton.innerText = 'Finalizar Compra';
    checkoutButton.addEventListener('click', () => {
      finalizePurchase();
      clearCart();
    });
    cart.appendChild(checkoutButton);
  }
}

listPokemonWithDetails();

removeFromCart = (pokemonName) => {
  const existingItem = cartItems.find(item => item.name === pokemonName);
  if(existingItem) {
    existingItem.quantity--;
    if(existingItem.quantity === 0) {
      const index = cartItems.indexOf(existingItem);
      if(index > -1) {
        cartItems.splice(index, 1);
      }
    }
    upDateCart();
  }
}

clearCart = () => {
  cartItems.length = 0;
  upDateCart();
}

finalizePurchase = () => {
  const endMessage = document.createElement('p')
  endMessage.innerText = 'Compra realizada';
  cart.appendChild(endMessage);
};
