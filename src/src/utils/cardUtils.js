/**
 * Shuffles an array in place using the Fisher-Yates (aka Knuth) shuffle algorithm.
 * @param {Array} array - The array to shuffle.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

/**
 * Loads and shuffles cards based on the selected categories.
 * @param {string[]} selectedCategories - An array of category keys (e.g., ['b', 'e'], or ['b', 'e', 'k']).
 * @returns {Promise<Array>} - A promise that resolves to the shuffled array of card objects.
 */
export async function getShuffledCards(selectedCategories) {
  const basePath = '/graphics/buttons/'; // Path from the 'public' directory
  
  const fetchPromises = selectedCategories.map(category => {
    const filePath = `${basePath}${category}_cards.json`;
    return fetch(filePath)
      .then(response => {
        if (!response.ok) {
          console.warn(`File not found: ${filePath}. Skipping.`);
          return []; 
        }
        return response.json();
      })
      .catch(error => {
        console.error(`Error fetching or parsing ${filePath}:`, error);
        return [];
      });
  });

  try {
    const results = await Promise.all(fetchPromises);
    const allCards = results.flat();
    shuffleArray(allCards);
    return allCards;
  } catch (error) {
    console.error("A critical error occurred in the card loading process:", error);
    return [];
  }
}
