// Test simple pour Vercel
module.exports = function handler(req, res) {
  res.status(200).json({
    message: 'API route test fonctionne !',
    timestamp: new Date().toISOString(),
    method: req.method
  });
};
