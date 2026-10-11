// ApexPlanet Internship Task 4: Portfolio + Notes App + Product Listing
// Notes are stored in this browser using localStorage. No backend is required.

const STORAGE_KEY = "kkStudioTask4Notes";
const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");
const noteSearch = document.getElementById("noteSearch");
const notesList = document.getElementById("notesList");
const notesEmpty = document.getElementById("notesEmpty");
const noteCount = document.getElementById("noteCount");
const toast = document.getElementById("toast");

function readNotes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Could not read saved notes:", error);
    return [];
  }
}

let notes = readNotes();

function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error("Could not save notes:", error);
    showToast("Browser storage is unavailable. Try another browser window.");
    return false;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderNotes() {
  const query = noteSearch.value.trim().toLowerCase();
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(query) ||
    note.body.toLowerCase().includes(query)
  );

  notesList.replaceChildren();
  noteCount.textContent = String(notes.length);
  notesEmpty.classList.toggle("visible", filteredNotes.length === 0);

  if (filteredNotes.length === 0) {
    const heading = notesEmpty.querySelector("h3");
    const description = notesEmpty.querySelector("p");
    if (query) {
      heading.textContent = "No matching notes";
      description.textContent = "Try another search word.";
    } else {
      heading.textContent = "No notes yet";
      description.textContent = "Create your first note using the form.";
    }
  }

  filteredNotes.forEach(note => {
    const card = document.createElement("article");
    card.className = "note-card";

    const title = document.createElement("h4");
    title.textContent = note.title;

    const body = document.createElement("p");
    body.textContent = note.body;

    const footer = document.createElement("div");
    footer.className = "note-card-bottom";

    const date = document.createElement("span");
    date.textContent = note.createdAt;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-note";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete note: ${note.title}`);
    deleteButton.addEventListener("click", () => deleteNote(note.id));

    footer.append(date, deleteButton);
    card.append(title, body, footer);
    notesList.append(card);
  });
}

function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  if (saveNotes()) {
    renderNotes();
    showToast("Note deleted.");
  }
}

noteForm.addEventListener("submit", event => {
  event.preventDefault();
  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();

  if (!title || !body) {
    showToast("Please fill in both the title and note.");
    return;
  }

  notes.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    body,
    createdAt: new Date().toLocaleDateString()
  });

  if (saveNotes()) {
    noteForm.reset();
    renderNotes();
    showToast("Your note was saved in this browser.");
  }
});

noteSearch.addEventListener("input", renderNotes);

// Contact form: demonstrates browser-side required-field and email validation.
// This demo does not send data to a server.
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }
  const name = document.getElementById("contactName").value.trim();
  contactStatus.textContent = `Thanks, ${name}! The demo form validation worked. No message was sent to a server.`;
  contactForm.reset();
});

// Product listing: category filter, maximum-price filter, and sorting.
const products = [
  { id: 1, name: "Pulse Wireless Headphones", category: "Audio", price: 3499, rating: 4.8, icon: "🎧", description: "Comfortable wireless audio for focus sessions.", featured: 1 },
  { id: 2, name: "Studio Desk Lamp", category: "Workspace", price: 1899, rating: 4.5, icon: "💡", description: "A warm, adjustable glow for your desk.", featured: 2 },
  { id: 3, name: "Mechanical Keyboard", category: "Accessories", price: 4299, rating: 4.9, icon: "⌨️", description: "Tactile keys for a satisfying typing feel.", featured: 3 },
  { id: 4, name: "Compact Bluetooth Speaker", category: "Audio", price: 2499, rating: 4.4, icon: "🔊", description: "Small speaker, room-filling everyday sound.", featured: 4 },
  { id: 5, name: "Ergonomic Mouse", category: "Accessories", price: 1299, rating: 4.6, icon: "🖱️", description: "A comfortable companion for long work sessions.", featured: 5 },
  { id: 6, name: "Monitor Light Bar", category: "Workspace", price: 2999, rating: 4.7, icon: "🔆", description: "Focused desk lighting with a clean footprint.", featured: 6 }
];

const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const priceValue = document.getElementById("priceValue");
const sortFilter = document.getElementById("sortFilter");
const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");
const productsEmpty = document.getElementById("productsEmpty");

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(price);
}

function renderProducts() {
  const category = categoryFilter.value;
  const maxPrice = Number(priceFilter.value);
  const sort = sortFilter.value;

  let visibleProducts = products.filter(product =>
    (category === "all" || product.category === category) &&
    product.price <= maxPrice
  );

  if (sort === "rating-desc") visibleProducts.sort((a, b) => b.rating - a.rating);
  if (sort === "price-asc") visibleProducts.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") visibleProducts.sort((a, b) => b.price - a.price);
  if (sort === "featured") visibleProducts.sort((a, b) => a.featured - b.featured);

  productGrid.replaceChildren();
  productCount.textContent = `Showing ${visibleProducts.length} of ${products.length} products`;
  productsEmpty.classList.toggle("visible", visibleProducts.length === 0);

  visibleProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const art = document.createElement("div");
    art.className = "product-art";
    const categoryBadge = document.createElement("span");
    categoryBadge.className = "product-category";
    categoryBadge.textContent = product.category;
    const emoji = document.createElement("span");
    emoji.className = "product-emoji";
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = product.icon;
    art.append(categoryBadge, emoji);

    const info = document.createElement("div");
    info.className = "product-info";
    const name = document.createElement("h3");
    name.textContent = product.name;
    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;

    const meta = document.createElement("div");
    meta.className = "product-meta";
    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);
    const rating = document.createElement("span");
    rating.className = "product-rating";
    rating.textContent = `★ ${product.rating.toFixed(1)}`;
    meta.append(price, rating);

    const foot = document.createElement("div");
    foot.className = "product-foot";
    const stock = document.createElement("span");
    stock.textContent = "Sample listing";
    const available = document.createElement("span");
    available.textContent = "● Available";
    foot.append(stock, available);

    info.append(name, description, meta, foot);
    card.append(art, info);
    productGrid.append(card);
  });
}

categoryFilter.addEventListener("change", renderProducts);
priceFilter.addEventListener("input", () => {
  priceValue.textContent = formatPrice(Number(priceFilter.value));
  renderProducts();
});
sortFilter.addEventListener("change", renderProducts);
document.getElementById("resetFilters").addEventListener("click", () => {
  categoryFilter.value = "all";
  priceFilter.value = "10000";
  priceValue.textContent = formatPrice(10000);
  sortFilter.value = "featured";
  renderProducts();
  showToast("Product filters reset.");
});

// Highlight the current navigation link while moving between sections.
const navLinks = [...document.querySelectorAll(".nav-link")];
const observedSections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  observedSections.forEach(section => observer.observe(section));
}

renderNotes();
renderProducts();
