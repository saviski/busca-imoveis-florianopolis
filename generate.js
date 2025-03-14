// Check if filteredListings is defined and is an array
if (!filteredListings || !Array.isArray(filteredListings)) {
  console.error('filteredListings is not defined or is not an array');
} else {
  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Generate HTML for all listings
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
      <div class="listing" data-description="${description.toLowerCase()}" data-index="${index}">
        <img src="${primaryImageUrl}" alt="${result.title || 'Propriedade ' + index}" class="listing-img" loading="lazy" data-index="${index}">
        <h2>${result.title || 'Propriedade Sem Título'}</h2>
        <p><strong>Localização:</strong> ${location}</p>
        <p><strong>Preço:</strong> R$ ${priceFormatted}</p>
        <p><strong>Quartos:</strong> ${bedrooms}</p>
        <p><strong>Banheiros:</strong> ${bathrooms}</p>
        <p><strong>Área:</strong> ${area}</p>
        <p class="description">${highlightedDescription}</p>
        <a href="${fullLink}" target="_blank" class="${result.link ? '' : 'disabled'}">Ver Imóvel</a>
        <dialog id="gallery-${index}" class="gallery-dialog"></dialog>
      </div>
    `);
  });
  const listingsHtml = listingsArray.join('');

  // Full HTML content with embedded CSS and JS
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Listagem de Imóveis Filtrados</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(to bottom, #e0f7fa, #ffffff);
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .search-bar {
            width: 100%;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .search-bar input {
            width: 80%;
            max-width: 500px;
            padding: 10px;
            font-size: 1em;
            border: 2px solid #007bff;
            border-radius: 5px;
            margin: 0 auto;
            display: block;
        }
        .tabs {
            display: flex;
            background-color: #f1f1f1;
            border-bottom: 1px solid #ccc;
        }
        .tab-button {
            flex: 1;
            padding: 15px;
            text-align: center;
            cursor: pointer;
            background-color: #f1f1f1;
            border: none;
            outline: none;
            transition: background-color 0.3s;
        }
        .tab-button:hover {
            background-color: #ddd;
        }
        .tab-button.active {
            background-color: #fff;
            border-bottom: 2px solid #007bff;
        }
        .tab-content {
            flex: 1;
            display: none;
            overflow-y: auto;
        }
        .tab-content.active {
            display: block;
        }
        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            padding: 20px;
        }
        .listing {
            width: 340px;
            margin: 20px;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
            text-align: center;
            background-color: #fff;
            transition: transform 0.3s ease;
        }
        .listing:hover {
            transform: translateY(-5px);
        }
        .listing-img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
            cursor: pointer;
        }
        .listing h2 {
            font-size: 1.4em;
            margin: 15px 0;
            color: #2c3e50;
        }
        .listing p {
            font-size: 1em;
            color: #7f8c8d;
            margin: 8px 0;
        }
        .description .highlight {
            background-color: #fff3cd;
            padding: 2px 5px;
            border-radius: 3px;
            color: #856404;
        }
        .listing a {
            display: inline-block;
            margin-top: 15px;
            padding: 12px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
        .listing a:hover {
            background-color: #0056b3;
        }
        .listing a.disabled {
            background-color: #ccc;
            pointer-events: none;
        }
        .gallery-dialog {
            border: none;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            padding: 20px;
            max-width: 80vw;
            max-height: 80vh;
            overflow-y: auto;
            background-color: #fff;
            text-align: left;
        }
        .gallery-content img, .gallery-content iframe {
            width: 100%;
            max-width: 600px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .gallery-content .youtube-placeholder {
            position: relative;
            width: 100%;
            max-width: 600px;
            height: 315px;
            margin: 10px 0;
            background: #000 url('https://img.youtube.com/vi/{videoId}/hqdefault.jpg') center/cover no-repeat;
            cursor: pointer;
            border-radius: 5px;
        }
        .gallery-content .youtube-placeholder::after {
            content: '▶';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 50px;
            color: #fff;
            text-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        .close-btn {
            position: sticky;
            top: 10px;
            right: 10px;
            padding: 10px 20px;
            background-color: #dc3545;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            float: right;
        }
        .close-btn:hover {
            background-color: #c82333;
        }
        #tab-map {
            height: 100%;
        }
    </style>
</head>
<body>
    <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Pesquisar na descrição...">
    </div>
    <nav class="tabs">
        <button class="tab-button active" data-tab="tab-listing">Listagem</button>
        <button class="tab-button" data-tab="tab-map">Mapa</button>
    </nav>
    <div id="tab-listing" class="tab-content active">
        <div class="container" id="listingContainer">${listingsHtml}</div>
    </div>
    <div id="tab-map" class="tab-content">
        <div id="map" style="height: 100%; width: 100%;"></div>
    </div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        const getYouTubeId = (url) => {
          const regex = /(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/i;
          const match = url.match(regex);
          return match ? match[1] : null;
        };

        const filteredListings = ${JSON.stringify(filteredListings)};

        const loadGallery = (index) => {
          const result = filteredListings[index];
          if (!result) {
            console.error('No result found for index:', index);
            return '<p>Erro: Imóvel não encontrado.</p>';
          }
          const allImages = result.imageUrls && result.imageUrls.length > 0
            ? result.imageUrls.map((url, idx) => {
                if (url.includes('youtube.com') || url.includes('youtu.be')) {
                  const videoId = getYouTubeId(url);
                  return videoId ? \`<div class="youtube-placeholder" data-video-id="\${videoId}" data-idx="\${idx}"></div>\` : '<p>Link de vídeo inválido.</p>';
                } else {
                  return \`<img src="\${url.replace('{action}/{width}x{height}', 'crop/614x297')}" alt="Imagem da propriedade" loading="lazy">\`;
                }
              }).join('')
            : '<p>Sem imagens disponíveis.</p>';
          const fullLink = result.link ? \`https://www.zapimoveis.com.br\${result.link}\` : '#';
          const bedrooms = result.bedrooms && result.bedrooms.length > 0 ? result.bedrooms[0] : 'N/A';
          const bathrooms = result.bathrooms && result.bathrooms.length > 0 ? result.bathrooms[0] : 'N/A';
          const area = result.usableAreas && result.usableAreas.length > 0 ? result.usableAreas[0] + ' m²' : 'N/A';
          const location = \`\${result.neighborhood || 'Bairro Desconhecido'}, \${result.city || 'Cidade Desconhecida'}\`;
          const priceFormatted = typeof result.price === 'number' ? result.price.toLocaleString('pt-BR') : (result.price || 'N/A');
          const description = result.description || 'Sem descrição disponível.';
          const highlightedDescription = description.replace(
            /(casa|quarto|vista|jardim|piscina|árvore|quintal|luz natural|janelas amplas|natureza|área verde|aconchegante|espaçoso|iluminado|ventilado|silencioso|privacidade|paisagem|sol)/gi,
            '<span class="highlight">$1</span>'
          );
          return \`
            <div class="gallery-content">
              <button class="close-btn" onclick="document.getElementById('gallery-\${index}').close()">Fechar</button>
              <h2>\${result.title || 'Propriedade Sem Título'}</h2>
              <p><strong>Localização:</strong> \${location}</p>
              <p><strong>Preço:</strong> R$ \${priceFormatted}</p>
              <p><strong>Quartos:</strong> \${bedrooms}</p>
              <p><strong>Banheiros:</strong> \${bathrooms}</p>
              <p><strong>Área:</strong> \${area}</p>
              <p class="description">\${highlightedDescription}</p>
              <a href="\${fullLink}" target="_blank" class="\${result.link ? '' : 'disabled'}">Ver Imóvel</a>
              \${allImages}
            </div>
          \`;
        };

        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        tabButtons.forEach(button => {
          button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(button.getAttribute('data-tab')).classList.add('active');
          });
        });

        // Initialize Leaflet map
        const map = L.map('map').setView([-23.5505, -46.6333], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Custom icons based on unitTypes
        const homeIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
        const penthouseIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
        const apartmentIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
        const defaultIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });

        const markers = [];
        filteredListings.forEach((result, index) => {
          const lat = result.lat || result.latitude;
          const lon = result.lon || result.longitude;
          if (lat && lon) {
            const unitType = result.unitTypes || 'unknown'; // Use unitTypes
            const icon = unitType === 'HOME' ? homeIcon :
                        unitType === 'PENTHOUSE' ? penthouseIcon :
                        unitType === 'APARTMENT' ? apartmentIcon :
                        defaultIcon;
            const marker = L.marker([lat, lon], { icon }).addTo(map);
            marker.index = index;
            marker.on('click', () => {
              const dialog = document.getElementById('gallery-' + index);
              if (!dialog) {
                console.error('Dialog not found for index:', index);
                return;
              }
              if (!dialog.innerHTML) {
                dialog.innerHTML = loadGallery(index);
              }
              dialog.showModal();
            });
            markers.push(marker);
          }
        });

        if (markers.length > 0) {
          const group = new L.featureGroup(markers);
          map.fitBounds(group.getBounds());
        }

        // Event delegation for image clicks
        document.getElementById('listingContainer').addEventListener('click', (e) => {
          if (e.target.classList.contains('listing-img')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            console.log('Clicked image with index:', index);
            const dialog = document.getElementById('gallery-' + index);
            if (!dialog) {
              console.error('Dialog not found for index:', index);
              return;
            }
            if (!dialog.innerHTML) {
              console.log('Loading gallery for index:', index);
              dialog.innerHTML = loadGallery(index);
            }
            dialog.showModal();
          }
        });

        // Handle YouTube iframe loading
        document.addEventListener('click', (e) => {
          if (e.target.classList.contains('youtube-placeholder')) {
            const videoId = e.target.getAttribute('data-video-id');
            const idx = e.target.getAttribute('data-idx');
            e.target.outerHTML = \`<iframe width="100%" height="315" src="https://www.youtube.com/embed/\${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>\`;
          }
        });

        // Search functionality with map filtering
        const searchInput = document.getElementById('searchInput');
        const container = document.getElementById('listingContainer');
        if (!searchInput || !container) {
          console.error('Search input or container not found');
          return;
        }
        console.log('Search input found, attaching listener');
        searchInput.addEventListener('input', () => {
          const query = searchInput.value.toLowerCase();
          console.log('Search query:', query);
          const listings = container.querySelectorAll('.listing');
          console.log('Found listings:', listings.length);

          const visibleIndexes = new Set();
          listings.forEach(listing => {
            const description = listing.getAttribute('data-description');
            const isVisible = description.includes(query);
            listing.style.display = isVisible ? '' : 'none';
            if (isVisible) {
              visibleIndexes.add(parseInt(listing.getAttribute('data-index')));
            }
          });

          markers.forEach(marker => {
            if (visibleIndexes.has(marker.index)) {
              marker.addTo(map);
            } else {
              marker.remove();
            }
          });

          const visibleMarkers = markers.filter(m => visibleIndexes.has(m.index));
          if (visibleMarkers.length > 0) {
            const group = new L.featureGroup(visibleMarkers);
            map.fitBounds(group.getBounds());
          }
        });
      });
    </script>
</body>
</html>
  `;

  // Create a Blob and generate a URL
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  // Open the URL in a new tab
  window.open(url, '_blank');
}