document.addEventListener("DOMContentLoaded", function () {
  // 🔹 FUNCȚIA SEARCH
  document.getElementById('search-icon').addEventListener('click', function () {
    document.querySelector('.navbar').classList.toggle('showInput');
  });

  const inputBox = document.querySelector(".search-box .input-box input");

  inputBox.addEventListener("input", () => {
    const query = inputBox.value.toLowerCase().trim();
    const products = document.querySelectorAll(".mitem");
    let found = false;

    products.forEach(product => {
      const productNameElement = product.querySelector(".mdet .name");

      if (!productNameElement) return;

      const productName = productNameElement.textContent.toLowerCase();
      product.style.display = productName.includes(query) ? "block" : "none";
      found = found || productName.includes(query);
    });

    let noProductMessage = document.getElementById("no-product-message");
    if (!noProductMessage) {
      noProductMessage = document.createElement("div");
      noProductMessage.id = "no-product-message";
      noProductMessage.style.position = "fixed";
      noProductMessage.style.bottom = "20px";
      noProductMessage.style.right = "20px";
      noProductMessage.style.background = "#ffcccc";
      noProductMessage.style.color = "#990000";
      noProductMessage.style.padding = "10px";
      noProductMessage.style.borderRadius = "5px";
      noProductMessage.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
      noProductMessage.style.zIndex = "1000";
      document.body.appendChild(noProductMessage);
    }

    noProductMessage.style.display = found || query === "" ? "none" : "block";
    noProductMessage.textContent = "Produsul nu a fost găsit!";
  });

  // 🔹 FUNCȚIA PENTRU HAMBURGER MENU
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".navbar .links");

  menuToggle.addEventListener("change", function () {
    navLinks.classList.toggle("menu-open", menuToggle.checked);
  });

  // 🔹 ÎNCHIDEREA MENIULUI LA CLICK PE LINK (EXCEPȚIE: SUBMENIU)
  const menuItems = document.querySelectorAll('.navbar .links li a');
  menuItems.forEach(item => {
    item.addEventListener('click', function (event) {
      // Verificăm dacă este un dropdown și nu închidem meniul
      if (this.parentElement.classList.contains("dropdown")) {
        event.preventDefault(); // Nu închide meniul dacă e un dropdown
      } else {
        menuToggle.checked = false;
        navLinks.classList.remove("menu-open");
      }
    });
  });

  // 🔹 FUNCȚIA PENTRU MODUL ÎNTUNECAT (DARK MODE)
  const themeToggleBtn = document.getElementById("theme-toggle");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
  }

  themeToggleBtn.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
    localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
  });

  // 🔹 BUTON SCROLL TO TOP
  let scrollToTopBtn = document.getElementById("scrollToTop");

  window.addEventListener("scroll", function () {
    scrollToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Funcția pentru deschiderea și închiderea submeniurilor
document.addEventListener("DOMContentLoaded", function () {
  let dropdowns = document.querySelectorAll(".dropdown > a");

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", function (event) {
      event.preventDefault(); // Previne navigarea paginii

      let submenu = this.nextElementSibling; // Găsește submeniul corespunzător
      let parentDropdown = this.parentElement;

      // Verifică dacă submeniul este deja activ
      let isActive = submenu.classList.contains("active");

      // Dacă era activ, îl închidem și rotim săgeata în poziția inițială
      if (isActive) {
        submenu.classList.remove("active");
        parentDropdown.classList.remove("open");
      } else {
        // Dacă nu era activ, îl activăm acum și rotim săgeata
        submenu.classList.add("active");
        parentDropdown.classList.add("open");
      }
    });
  });
});

document.querySelector('.nrtf').style.display = 'block';

//Coșul
document.addEventListener("DOMContentLoaded", () => {
  const cartFab = document.getElementById("cart-fab");
  const cartSidebar = document.getElementById("cart-sidebar");
  const closeCart = document.getElementById("close-cart");
  const placeOrder = document.getElementById("place-order");
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const notification = document.getElementById("notification");
  const overlay = document.getElementById("cart-overlay");
  let cart = [];


  // Deschidere coș + overlay
  cartFab.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
  });

  // Închidere coș cu buton X
  closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
  });

  // Închidere la click în afara sidebarului
  overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
  });

  // Ascunde numărul de produse inițial
  cartCount.style.display = "none";

  // Deschide coșul
  cartFab.addEventListener("click", () => {
    cartSidebar.classList.add("active");
    overlay.classList.add("active");
  });

  // Închide coșul și overlay-ul
  function closeCartSidebar() {
    cartSidebar.classList.remove("active");
    overlay.classList.remove("active");
  }

  closeCart.addEventListener("click", closeCartSidebar);
  overlay.addEventListener("click", closeCartSidebar);

  // Adăugare produs în coș
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const mitem = this.closest(".mitem");
      const name = mitem.querySelector(".name").innerText;
      const priceText = mitem.querySelector("h4").innerText;
      const price = parseFloat(priceText.match(/\d+/)[0]);
      const imageSrc = mitem.querySelector("img").src;

      let existingProduct = cart.find((p) => p.name === name);
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.push({ name, price, quantity: 1, image: imageSrc });
      }

      updateCart();
      showNotification(`"${name}" a fost adăugat în coș`);
    });
  });

  // Actualizare coș 
  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    let itemCount = 0;

    cart.forEach((product, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${product.image}" class="cart-image">
        <div class="cart-info">
          <span>${product.name}</span>
          <div class="cart-quantity">
            <button class="quantity-btn decrease" data-index="${index}">-</button>
            <span>${product.quantity}</span>
            <button class="quantity-btn increase" data-index="${index}">+</button>
          </div>
          <span>${product.price * product.quantity} lei</span>
          <button class="remove-btn" onclick="removeItem(${index})">✕</button>
        </div>
      `;
      cartItems.appendChild(li);
      total += product.price * product.quantity;
      itemCount += product.quantity;
    });

    cartTotal.textContent = total;

    // Actualizează numărul de produse de pe iconița coșului
    if (itemCount > 0) {
      cartCount.textContent = itemCount;
      cartCount.style.display = "flex";
      cartCount.classList.add("fade-in");
      setTimeout(() => cartCount.classList.remove("fade-in"), 300);
    } else {
      cartCount.style.display = "none";
    }

    attachQuantityButtons();
  }

  function attachQuantityButtons() {
    document.querySelectorAll(".increase").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.dataset.index;
        cart[index].quantity++;
        updateCart();
      });
    });

    document.querySelectorAll(".decrease").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else {
          cart.splice(index, 1);
        }
        updateCart();
      });
    });
  }

  // Plasează comanda
  placeOrder.addEventListener("click", () => {
    if (cart.length > 0) {
      showNotification("Comanda a fost plasată!");
      cart = [];
      updateCart();
      closeCartSidebar();
    } else {
      showNotification("Coșul este gol!");
    }
  });

  // Notificări
  function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 2000);
  }

  // Ștergere produs complet 
  window.removeItem = function (index) {
    const removed = cart.splice(index, 1)[0];
    updateCart();
    showNotification(`"${removed.name}" (${removed.quantity}x) a fost șters din coș`);
  };
});


//FeedBack
document.getElementById('feedbackForm').addEventListener('submit', function (event) {
  event.preventDefault();

  let formURL = "https://docs.google.com/forms/d/e/1FAIpQLSfvUYBxmWUCgDRc5d0w1vF7SCz3PbSzoLdt4ksYO6XjSS4PnQ/formResponse"; 
  let formData = new FormData();

  // Obține datele din formular
  formData.append("entry.1391475918", document.getElementById('nume').value); 
  formData.append("entry.777614839", document.getElementById('prenume').value); 
  formData.append("entry.1850669950", document.getElementById('comentariu').value); 

  // Trimite formularul la Google Forms
  fetch(formURL, {
    method: "POST",
    mode: "no-cors", 
    body: formData
  }).then(() => {
    showMessage("Feedback trimis cu succes!", "success");
    document.getElementById('feedbackForm').reset(); 
  }).catch((error) => {
    showMessage("Eroare la trimiterea feedback-ului. Încercați din nou.", "error");
  });
  // Funcția pentru a arăta mesajele de succes/eroare
  function showMessage(message, type) {
    let messageBox = document.getElementById('message');
    messageBox.textContent = message;

    // Dacă este succes, folosește culoare verde, dacă este eroare, culoare roșie
    if (type === "success") {
      messageBox.style.backgroundColor = "rgba(0, 128, 0, 0.7)"; 
    } else if (type === "error") {
      messageBox.style.backgroundColor = "rgba(255, 0, 0, 0.7)";  
    }

    // Arată mesajul
    messageBox.style.display = "block";
    messageBox.style.opacity = "1"; 

    // Îl face invizibil după 4 secunde
    setTimeout(() => {
      messageBox.style.opacity = "0"; 
      messageBox.style.bottom = "50px"; 
    }, 3000);  // Dispare după 3 secunde

    // După ce mesajul dispare, îl ascunde complet
    setTimeout(() => {
      messageBox.style.display = "none";
      messageBox.style.bottom = "30px";  // Îl readuce în poziția inițială
    }, 4000);  // După 4 secunde
  };

});

