// Define token1, token2, and api_key variables for easy modification
const token1 = ''; //Token you are long
const token2 = ''; //Token you are short 
const api_key = ''; //CoinGecko API Key

// API URL for tokens using the provided CoinGecko endpoint
const url = `https://api.coingecko.com/api/v3/simple/price?ids=${token1}%2C${token2}&vs_currencies=usd`;
const headers = { accept: 'application/json', 'x-cg-demo-api-key': api_key };

// Capitalize first letter of token name
const formatTokenName = name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

// Fetch token prices
const fetchTokenPrices = async () => {
  try {
    const request = new Request(url);
    request.headers = headers;
    return await request.loadJSON();
  } catch (err) {
    console.error('Error fetching token prices:', err);
    return {};
  }
};

// Create and configure widget
const createWidget = async tokenData => {
  const widget = new ListWidget();
  widget.backgroundColor = new Color("#000000");

  const title = widget.addText("Token Prices");
  title.font = Font.boldSystemFont(12);
  title.textColor = Color.white();
  title.centerAlignText();

  [token1, token2].forEach(token => {
    if (tokenData[token]) {
      const priceText = widget.addText(`${formatTokenName(token)}: $${tokenData[token].usd.toFixed(2)}`);
      priceText.font = Font.systemFont(14);
      priceText.textColor = Color.white();
      priceText.centerAlignText();
    }
  });

  if (tokenData[token1] && tokenData[token2]) {
    const ratio = (tokenData[token1].usd / tokenData[token2].usd).toFixed(2);
    const ratioText = widget.addText(`Ratio: ${ratio}`);
    ratioText.font = Font.systemFont(14);
    ratioText.textColor = Color.white();
    ratioText.centerAlignText();
  }

  return widget;
};

// Main function
const main = async () => {
  const tokenData = await fetchTokenPrices();
  const widget = await createWidget(tokenData);

  if (config.runsInWidget) {
    Script.setWidget(widget);
    Script.complete();
  } else {
    widget.presentSmall();
  }
};

await main();
