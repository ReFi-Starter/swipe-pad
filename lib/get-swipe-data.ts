export async function getAllSwipeData() {
  const SOURCES = [
    'https://raw.githubusercontent.com/ReFi-Starter/swipe-pad/main/graphics/buttons/k_cards.json',
    'https://raw.githubusercontent.com/ReFi-Starter/swipe-pad/main/graphics/buttons/b_cards.json',
    'https://raw.githubusercontent.com/ReFi-Starter/swipe-pad/main/graphics/buttons/e_cards.json'
  ];
  try {
    const [k, b, e] = await Promise.all(SOURCES.map(u => fetch(u).then(r => r.json())));
    const safely = (arr: any) => Array.isArray(arr) ? arr : [];
    return { cards: [...safely(k), ...safely(b), ...safely(e)] };
  } catch (e) { console.error(e); return { cards: [] }; }
}
