function* characterDataGenerator(start, end) {
    for (let i = start; i <= end; i++) {
      yield fetch(`https://swapi.dev/api/people/${i}/`)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    }
  }

  // Function to create character card
  function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';
    
    const name = document.createElement('div');
    name.className = 'character-name';
    name.textContent = character.name;
    
    const info = document.createElement('div');
    info.className = 'character-info';
    info.innerHTML = `
      Altura: ${character.height} cm<br>
      Peso: ${character.mass} kg
    `;
    
    card.appendChild(name);
    card.appendChild(info);
    return card;
  }

  // Function to handle mouse enter events
  async function handleMouseEnter(e) {
    const timelineItem = e.target.closest('.timeline-item');
    if (!timelineItem) return;

    const range = timelineItem.dataset.range;
    const [start, end] = range.split('-').map(Number);
    const containerId = `container-${range}`;
    const container = document.getElementById(containerId);

    // If container is already visible, don't fetch again
    if (container.style.display === 'flex') return;

    // Clear previous content and show loading
    container.innerHTML = '<div class="loading">Cargando personajes...</div>';
    container.style.display = 'block';

    // Create and use generator
    const generator = characterDataGenerator(start, end);
    for (let i = start; i <= end; i++) {
      try {
        const characterPromise = generator.next().value;
        const character = await characterPromise;
        
        // Remove loading message if it's the first character
        if (i === start) {
          container.innerHTML = '';
          container.style.display = 'flex';
        }

        const card = createCharacterCard(character);
        container.appendChild(card);
      } catch (error) {
        console.error('Error fetching character:', error);
      }
    }
  }

  // Add event listeners to timeline items
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('mouseenter', handleMouseEnter);
  });