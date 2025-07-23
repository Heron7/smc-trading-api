const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: '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'
});

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { images } = req.body;
    
    if (!images || images.length !== 4) {
      res.status(400).json({ error: 'Please provide exactly 4 chart images' });
      return;
    }
    
    const response = await anthropic.messages.create({
      model: "claude-4-sonnet-20250522",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze these 4 cryptocurrency trading charts using Smart Money Concepts (SMC) and ICT principles.
            
            Charts provided in order: 5-minute, 15-minute, 1-hour, 4-hour timeframes.
            
            Return analysis in this exact JSON format:
            {
              "marketStructure": {
                "4h": {"trend": "BULLISH/BEARISH/NEUTRAL", "structure": "CHoCH/BOS/Consolidation", "keyLevel": "price level"},
                "1h": {"trend": "BULLISH/BEARISH/NEUTRAL", "structure": "CHoCH/BOS/Consolidation", "keyLevel": "price level"},
                "15m": {"trend": "BULLISH/BEARISH/NEUTRAL", "structure": "CHoCH/BOS/Consolidation", "keyLevel": "price level"},
                "5m": {"trend": "BULLISH/BEARISH/NEUTRAL", "structure": "CHoCH/BOS/Consolidation", "keyLevel": "price level"}
              },
              "smcLevels": [
                {"type": "Order Block/Fair Value Gap/Liquidity Zone", "price": "exact price", "status": "Active/Pending/Swept", "significance": "High/Medium/Low"}
              ],
              "tradeSetup": {
                "direction": "LONG/SHORT",
                "entryZone": "price range",
                "stopLoss": "price",
                "takeProfit1": "price",
                "takeProfit2": "price", 
                "takeProfit3": "price",
                "rationale": "detailed explanation"
              },
              "riskManagement": {
                "rrRatio1": "1:X format",
                "rrRatio2": "1:X format",
                "rrRatio3": "1:X format"
              },
              "confirmationChecklist": [
                {"item": "HTF Trend Alignment", "status": "Confirmed/Pending", "priority": "High"},
                {"item": "Order Block Retest", "status": "Confirmed/Pending", "priority": "High"},
                {"item": "Break of Structure", "status": "Confirmed/Pending", "priority": "High"},
                {"item": "Volume Confirmation", "status": "Confirmed/Pending", "priority": "Medium"},
                {"item": "Fair Value Gap", "status": "Confirmed/Pending", "priority": "Medium"}
              ]
            }`
          },
          ...images.map(img => ({
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: img
            }
          }))
        ]
      }]
    });

    const analysis = JSON.parse(response.content[0].text);
    
    res.status(200).json({ 
      success: true, 
      analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Analysis failed. Please try again.',
      details: error.message
    });
  }
};
