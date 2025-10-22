// ===================================================================
// TEMPORARY RESTAURANT USER SETUP FOR LOCAL STORAGE
// ===================================================================
// 
// HOW TO USE:
// 1. Open http://localhost:4200 in your browser
// 2. Open Browser Console (F12 → Console tab)
// 3. Copy and paste this entire file into the console
// 4. Press Enter
// 
// This will:
// - Set a mock JWT token for a restaurant user
// - Reload the page
// - Allow you to access /restaurant routes
// ===================================================================

(function() {
  console.log('🔧 Setting up temporary restaurant user...');
  
  // Create a mock JWT token
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  
  const payload = {
    sub: "restaurant_user",
    userId: "rest123",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // Expires in 1 year
  };
  
  // Base64 encode (browser-safe)
  const base64UrlEncode = (obj) => {
    return btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };
  
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const mockSignature = "mock_signature_for_testing_only";
  
  const mockToken = `${encodedHeader}.${encodedPayload}.${mockSignature}`;
  
  // Save to localStorage
  localStorage.setItem('auth-token', mockToken);
  
  console.log('✅ Token saved to localStorage!');
  console.log('📝 Token:', mockToken);
  console.log('👤 User ID: rest123');
  console.log('🏪 Role: ROLE_RESTAURANT (requires backend API)');
  console.log('⏰ Expires:', new Date(payload.exp * 1000).toLocaleString());
  console.log('');
  console.log('🔄 Reloading page in 2 seconds...');
  
  setTimeout(() => {
    location.reload();
  }, 2000);
})();
