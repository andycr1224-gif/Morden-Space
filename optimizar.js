const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Logos que NO se tocan
const excluir = ['letras blancas', 'letras negras', 'logo'];

function buscarPNGs(dir, lista = []) {
  fs.readdirSync(dir).forEach(file => {
    const ruta = path.join(dir, file);
    if (fs.statSync(ruta).isDirectory() && !ruta.includes('node_modules')) {
      buscarPNGs(ruta, lista);
    } else if (file.toLowerCase().endsWith('.webp')) {
      const esLogo = excluir.some(e => file.toLowerCase().includes(e));
      if (!esLogo) lista.push(ruta);
    }
  });
  return lista;
}

const fotos = buscarPNGs('.');
console.log(`\nEncontradas ${fotos.length} fotos para optimizar:\n`);

const promesas = fotos.map(ruta => {
  const salida = ruta.replace(/\.webp$/i, '.webp');
  return sharp(ruta)
    .webp({ quality: 78 })
    .toFile(salida)
    .then(info => {
      const antes = Math.round(fs.statSync(ruta).size / 1024);
      const despues = Math.round(info.size / 1024);
      const ahorro = Math.round((1 - info.size / fs.statSync(ruta).size) * 100);
      console.log(`✓ ${path.basename(ruta)} → ${path.basename(salida)}`);
      console.log(`  ${antes} KB → ${despues} KB (${ahorro}% menos)\n`);
    })
    .catch(err => console.log(`✗ Error en ${path.basename(ruta)}: ${err.message}`));
});

Promise.all(promesas).then(() => console.log('✅ Optimización completa.'));
