export default async function handler(req, res) {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected response from ZenQuotes');
    }

    res.status(200).json({
      quote: data[0].q,
      author: data[0].a,
    });
  } catch (error) {
    console.error('Error fetching quote:', error.message);
    res.status(500).json({ quote: 'Be calm, even the storm passes.', author: 'Glitchy Cutie' });
  }
}
