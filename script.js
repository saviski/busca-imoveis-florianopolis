// Função para remover HTML e obter apenas o texto
function stripHtml(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}

fetch('sorted.json', {
  method: 'GET',
  mode: 'cors',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(filteredListings => {
    const getYouTubeId = (url) => {
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const dialog = document.getElementById('galleryDialog');

    // Função para carregar galeria de imagens no dialog
    const loadImageGallery = (index) => {
      const result = filteredListings[index];
      if (!result) {
        console.error('No result found for index:', index);
        return '<p>Erro: Imóvel não encontrado.</p>';
      }
      const allImages = result.imageUrls && result.imageUrls.length > 0
        ? result.imageUrls.map((url, idx) => {
          if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = getYouTubeId(url);
            return videoId ? `<div class="youtube-placeholder" data-video-id="${videoId}" data-idx="${idx}"></div>` : '<p>Link de vídeo inválido.</p>';
          } else {
            return `<img src="${url.replace('{action}/{width}x{height}', 'crop/614x297')}" alt="Imagem da propriedade" loading="lazy">`;
          }
        }).join('')
        : '<p>Sem imagens disponíveis.</p>';
      return `
            <div class="gallery-content">
                <button class="close-btn" onclick="document.getElementById('galleryDialog').close()">Fechar</button>
                ${allImages}
            </div>
        `;
    };

    // Função para carregar galeria completa no dialog
    const loadFullGallery = (index) => {
      const result = filteredListings[index];
      if (!result) {
        console.error('No result found for index:', index);
        return '<p>Erro: Imóvel não encontrado.</p>';
      }
      const allImages = result.imageUrls && result.imageUrls.length > 0
        ? result.imageUrls.map((url, idx) => {
          if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = getYouTubeId(url);
            return videoId ? `<div class="youtube-placeholder" data-video-id="${videoId}" data-idx="${idx}"></div>` : '<p>Link de vídeo inválido.</p>';
          } else {
            return `<img src="${url.replace('{action}/{width}x{height}', 'crop/614x297')}" alt="Imagem da propriedade" loading="lazy">`;
          }
        }).join('')
        : '<p>Sem imagens disponíveis.</p>';
      const fullLink = result.link ? `https://www.zapimoveis.com.br${result.link}` : '#';
      const bedrooms = result.bedrooms && result.bedrooms.length > 0 ? result.bedrooms[0] : 'N/A';
      const bathrooms = result.bathrooms && result.bathrooms.length > 0 ? result.bathrooms[0] : 'N/A';
      const area = result.usableAreas && result.usableAreas.length > 0 ? result.usableAreas[0] + ' m²' : 'N/A';
      const location = `${result.neighborhood || 'Bairro Desconhecido'}, ${result.city || 'Cidade Desconhecida'}`;
      const priceFormatted = typeof result.price === 'number' ? result.price.toLocaleString('pt-BR') : (result.price || 'N/A');
      const description = result.description || 'Sem descrição disponível.';
      const highlightedDescription = description.replace(
        /(casa|quarto|vista|jardim|piscina|árvore|quintal|luz natural|janelas amplas|natureza|área verde|aconchegante|espaçoso|iluminado|ventilado|silencioso|privacidade|paisagem|sol)/gi,
        '<span class="highlight">$1</span>'
      );
      return `
            <div class="gallery-content">
                <button class="close-btn" onclick="document.getElementById('galleryDialog').close()">Fechar</button>
                <h2>${result.title || 'Propriedade Sem Título'}</h2>
                <p><strong>Localização:</strong> ${location}</p>
                <p><strong>Preço:</strong> R$ ${priceFormatted}</p>
                <p><strong>Quartos:</strong> ${bedrooms}</p>
                <p><strong>Banheiros:</strong> ${bathrooms}</p>
                <p><strong>Área:</strong> ${area}</p>
                <p class="description">${highlightedDescription}</p>
                <a href="${fullLink}" target="_blank" class="${result.link ? '' : 'disabled'}">Ver Imóvel</a><br>
                ${allImages}
            </div>
        `;
    };

    // Gerar conteúdo da aba Listagem
    const listingContainer = document.getElementById('listingContainer');
    const listingsArray = [];
    filteredListings.forEach((result, index) => {
      let primaryImageUrl = '';
      const imageUrls = result.imageUrls || [];
      const isFirstYouTube = imageUrls.length > 0 && (imageUrls[0].includes('youtube.com') || imageUrls[0].includes('youtu.be'));
      if (imageUrls.length > 0) {
        if (isFirstYouTube) {
          primaryImageUrl = imageUrls.find(url => !url.includes('youtube.com') && !url.includes('youtu.be')) || '';
          if (!primaryImageUrl) {
            const videoId = getYouTubeId(imageUrls[0]);
            primaryImageUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://via.placeholder.com/614x297?text=Sem+Imagem';
          } else {
            primaryImageUrl = primaryImageUrl.replace('{action}/{width}x{height}', 'crop/614x297');
          }
        } else {
          primaryImageUrl = imageUrls[0].replace('{action}/{width}x{height}', 'crop/614x297');
        }
      } else {
        primaryImageUrl = 'https://via.placeholder.com/614x297?text=Sem+Imagem';
      }

      const fullLink = result.link ? `https://www.zapimoveis.com.br${result.link}` : '#';
      const bedrooms = result.bedrooms && result.bedrooms.length > 0 ? result.bedrooms[0] : 'N/A';
      const bathrooms = result.bathrooms && result.bathrooms.length > 0 ? result.bathrooms[0] : 'N/A';
      const area = result.usableAreas && result.usableAreas.length > 0 ? result.usableAreas[0] + ' m²' : 'N/A';
      const location = `${result.neighborhood || 'Bairro Desconhecido'}, ${result.city || 'Cidade Desconhecida'}`;
      const priceFormatted = typeof result.price === 'number' ? result.price.toLocaleString('pt-BR') : (result.price || 'N/A');
      const description = result.description || 'Sem descrição disponível.';
      const highlightedDescription = description.replace(
        /(casa|quarto|vista|jardim|piscina|árvore|quintal|luz natural|janelas amplas|natureza|área verde|aconchegante|espaçoso|iluminado|ventilado|silencioso|privacidade|paisagem|sol)/gi,
        '<span class="highlight">$1</span>'
      );

      listingsArray.push(`
            <div class="listing" data-index="${index}">
                <img src="${primaryImageUrl}" alt="${result.title || 'Propriedade ' + index}" class="listing-img" loading="lazy" data-index="${index}">
                <h2>${result.title || 'Propriedade Sem Título'}</h2>
                <p><strong>Localização:</strong> ${location}</p>
                <p><strong>Preço:</strong> R$ ${priceFormatted}</p>
                <p><strong>Quartos:</strong> ${bedrooms}</p>
                <p><strong>Banheiros:</strong> ${bathrooms}</p>
                <p><strong>Área:</strong> ${area}</p>
                <p class="description">${highlightedDescription}</p>
                <a href="${fullLink}" target="_blank" class="${result.link ? '' : 'disabled'}">Ver Imóvel</a>
            </div>
        `);
    });
    listingContainer.innerHTML = listingsArray.join('');

    // Gerar conteúdo da aba Imagens
    const imagesContainer = document.getElementById('imagesContainer');
    const imagesArray = filteredListings.map((result, index) => {
      const fullLink = result.link ? `https://www.zapimoveis.com.br${result.link}` : '#';
      const title = result.title || `Propriedade ${index + 1}`;
      const description = result.description || 'Sem descrição disponível.';
      const imageUrls = (result.imageUrls || []).filter(url =>
        !url.includes('youtube.com') && !url.includes('youtu.be')
      );
      const thumbnails = imageUrls.length > 0
        ? imageUrls.map(url => `
                <img src="${url.replace('{action}/{width}x{height}', 'crop/614x297')}" 
                     alt="${title}" 
                     class="thumbnail" 
                     loading="lazy" 
                     onclick="window.open('${fullLink}', '_blank')">
            `).join('')
        : '<span>Sem imagens</span>';

      return `
            <div class="listing-images" data-description="${stripHtml(description).toLowerCase()}" data-index="${index}">
                <h2 class="listing-title" onclick="window.open('${fullLink}', '_blank')">${title}</h2>
                <div class="image-container">${thumbnails}</div>
            </div>
        `;
    });
    imagesContainer.innerHTML = imagesArray.join('');

    // Gerenciar abas
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        const targetTab = document.getElementById(button.getAttribute('data-tab'));
        targetTab.classList.add('active');
        if (button.getAttribute('data-tab') === 'tab-map' && window.mapInstance) {
          window.mapInstance.invalidateSize();
          updateMapZoom();
        }
      });
    });

    // Configurar mapa
    const map = L.map('map', {
      center: [-23.5505, -46.6333],
      zoom: 10,
      zoomControl: true
    });
    window.mapInstance = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const icons = {
      HOME: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      }),
      PENTHOUSE: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      }),
      APARTMENT: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      }),
      default: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      })
    };

    const markerLayer = L.layerGroup().addTo(map);
    const markers = [];

    filteredListings.forEach((result, index) => {
      const lat = result.lat || result.latitude;
      const lon = result.lon || result.longitude;
      if (lat && lon) {
        const unitType = result.unitTypes || 'unknown';
        const icon = icons[unitType] || icons.default;
        const marker = L.marker([lat, lon], { icon });
        marker.index = index;
        marker.on('click', () => {
          console.log('Marker clicked, index:', index);
          dialog.innerHTML = loadFullGallery(index);
          dialog.showModal();
        });
        markers.push(marker);
        markerLayer.addLayer(marker);
      }
    });

    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
      map.fitBounds(bounds);
    }

    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend');
      div.innerHTML = [
        '<div class="legend-item"><span class="legend-color" style="background-color: blue;"></span> Home</div>',
        '<div class="legend-item"><span class="legend-color" style="background-color: red;"></span> Penthouse</div>',
        '<div class="legend-item"><span class="legend-color" style="background-color: green;"></span> Apartment</div>',
        '<div class="legend-item"><span class="legend-color" style="background-color: grey;"></span> Outros</div>'
      ].join('');
      return div;
    };
    legend.addTo(map);

    function updateMapZoom() {
      const visibleMarkers = markers.filter(m => map.hasLayer(m));
      if (visibleMarkers.length > 0) {
        const bounds = L.latLngBounds(visibleMarkers.map(m => m.getLatLng()));
        map.fitBounds(bounds);
      } else {
        map.setView([-23.5505, -46.6333], 10);
      }
    }

    // Sticky title para aba Imagens
    const listingsImages = document.querySelectorAll('.listing-images');
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: [0, 0.1, 1]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const title = entry.target.querySelector('.listing-title');
        if (entry.isIntersecting) {
          title.classList.remove('hidden');
        } else if (entry.boundingClientRect.top < 0) {
          title.classList.add('hidden');
        }
      });
    }, observerOptions);

    listingsImages.forEach(listing => observer.observe(listing));

    // Eventos de clique
    document.getElementById('listingContainer').addEventListener('click', (e) => {
      if (e.target.classList.contains('listing-img')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        dialog.innerHTML = loadImageGallery(index);
        dialog.showModal();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('youtube-placeholder')) {
        const videoId = e.target.getAttribute('data-video-id');
        const idx = e.target.getAttribute('data-idx');
        e.target.outerHTML = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
      }
    });

    // Busca unificada para todas as abas
    const searchInput = document.getElementById('searchInput');
    if (!searchInput || !listingContainer || !imagesContainer) {
      console.error('Search input or containers not found');
      return;
    }
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      console.log('Search query:', query);

      // Filtrar Listagem
      const listings = listingContainer.querySelectorAll('.listing');
      const visibleIndexes = new Set();
      listings.forEach(listing => {
        const descriptionElement = listing.querySelector('.description');
        const description = descriptionElement ? stripHtml(descriptionElement.innerHTML).toLowerCase() : '';
        const isVisible = description.includes(query);
        listing.style.display = isVisible ? '' : 'none';
        if (isVisible) {
          visibleIndexes.add(parseInt(listing.getAttribute('data-index')));
        }
      });

      // Filtrar Imagens
      const imageListings = imagesContainer.querySelectorAll('.listing-images');
      imageListings.forEach(listing => {
        const description = listing.getAttribute('data-description');
        const isVisible = description.includes(query);
        listing.style.display = isVisible ? '' : 'none';
        if (isVisible) {
          visibleIndexes.add(parseInt(listing.getAttribute('data-index')));
        }
      });

      // Filtrar Mapa
      markers.forEach(marker => {
        if (visibleIndexes.has(marker.index)) {
          if (!map.hasLayer(marker)) markerLayer.addLayer(marker);
        } else {
          if (map.hasLayer(marker)) markerLayer.removeLayer(marker);
        }
      });

      updateMapZoom();
    });
  })
  .catch(error => console.error('Error fetching data:', error));