(function () {
  let allProducts = [];
  const grid = document.getElementById('catalogGrid');
  const colorBox = document.getElementById('colorFilters');
  const finishBox = document.getElementById('finishFilters');

  function renderCatalog(products) {
    grid.innerHTML = products.map(p => `
            <div class="product-card">
                <div class="card-image-box">
                    <img src="${p.image}" alt="${p.name}">
                </div>
                <div class="card-info">
                    <h2>${p.name}</h2>
                    <div class="card-meta">
                        <span>${p.sku}</span>
                        <span>${p.finishColor} • ${p.finish}</span>
                    </div>
                    <a href="laminate.html?slug=${p.slug}" class="view-details">Explore Details</a>
                </div>
            </div>
        `).join('') || '<p style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 5rem 0;">No products match your filters.</p>';
  }

  function setupFilters(products) {
    const colors = [...new Set(products.map(p => p.finishColor))];
    const finishes = [...new Set(products.map(p => p.finish))];

    colors.forEach(col => {
      const btn = document.createElement('a');
      btn.className = 'filter-link';
      btn.href = '#';
      btn.innerText = col;
      btn.dataset.filter = 'color';
      btn.dataset.value = col;
      colorBox.appendChild(btn);
    });

    finishes.forEach(fin => {
      const btn = document.createElement('a');
      btn.className = 'filter-link';
      btn.href = '#';
      btn.innerText = fin;
      btn.dataset.filter = 'finish';
      btn.dataset.value = fin;
      finishBox.appendChild(btn);
    });

    document.querySelectorAll('.filter-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Toggle active class in its group
        const group = link.parentElement;
        group.querySelectorAll('.filter-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        applyFilters();
      });
    });
  }

  function applyFilters() {
    const activeColor = colorBox.querySelector('.active').dataset.value;
    const activeFinish = finishBox.querySelector('.active').dataset.value;

    let filtered = allProducts;

    if (activeColor !== 'all') {
      filtered = filtered.filter(p => p.finishColor === activeColor);
    }

    if (activeFinish !== 'all') {
      filtered = filtered.filter(p => p.finish === activeFinish);
    }

    renderCatalog(filtered);
  }

  fetch("products.json")
    .then(r => r.json())
    .then(products => {
      allProducts = products;
      setupFilters(products);
      renderCatalog(products);
    })
    .catch(err => console.error("Filter Error:", err));
})();
