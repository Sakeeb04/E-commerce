const fs = require('fs');
const path = require('path');

const mockDataContent = fs.readFileSync(path.join(__dirname, 'js', 'mockData.js'), 'utf-8')
  .replace(/export\s+const\s+/g, 'const ')
  .replace(/\/\/# sourceMappingURL=.*$/gm, '');

const apiContent = fs.readFileSync(path.join(__dirname, 'js', 'api.js'), 'utf-8')
  .replace(/import\s+.*?;/g, '')
  .replace(/export\s+const\s+api\s*=/g, 'const api =')
  .replace(/\/\/# sourceMappingURL=.*$/gm, '');

const storeContent = fs.readFileSync(path.join(__dirname, 'js', 'store.js'), 'utf-8')
  .replace(/import\s+.*?;/g, '')
  .replace(/export\s+const\s+store\s*=/g, 'const store =')
  .replace(/\/\/# sourceMappingURL=.*$/gm, '');

const appContent = fs.readFileSync(path.join(__dirname, 'js', 'app.js'), 'utf-8')
  .replace(/import\s+.*?;/g, '')
  .replace(/\/\/# sourceMappingURL=.*$/gm, '');

const bundle = `/**
 * LuminaCommerce All-in-One Standalone Bundle
 * Works directly in Chrome/Edge via file:/// protocol without CORS errors!
 */
(function() {
  'use strict';

  // --- MOCK DATA ---
  ${mockDataContent}

  // --- API SERVICE ---
  ${apiContent}

  // --- STATE STORE ---
  ${storeContent}

  // --- APP CONTROLLER ---
  ${appContent}

})();
`;

fs.writeFileSync(path.join(__dirname, 'js', 'bundle.js'), bundle, 'utf-8');
console.log('Successfully generated js/bundle.js (Zero-CORS standalone bundle)!');

