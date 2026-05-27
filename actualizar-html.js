const fs = require('fs');
const path = require('path');

// Archivos que NO se cambian (no fueron convertidos a webp)
const noTocar = ['letras blancas', 'letras negras', 'favicon', 'apple-touch', 'android-chrome'];

function esExcluido(texto) {
  return noTocar.some(e => texto.toLowerCase().includes(e));
}

function actualizarArchivo(ruta) {
  let contenido = fs.readFileSync(ruta, 'utf8');
  let cambios = 0;

  // Reemplaza .webp por .webp en src, href y background-image, excepto los excluidos
  const nuevo = contenido.replace(/(['"\s(])([^'")\s]*\.png)/gi, (match, prefijo, archivo) => {
    if (esExcluido(archivo)) return match;
    cambios++;
    return prefijo + archivo.replace(/\.webp$/i, '.webp');
  });

  if (cambios > 0) {
    fs.writeFileSync(ruta, nuevo, 'utf8');
    console.log(`✓ ${path.basename(ruta)} — ${cambios} referencia(s) actualizada(s)`);
  }
}

// Buscar todos los HTML y CSS
function buscarArchivos(dir, exts, lista = []) {
  fs.readdirSync(dir).forEach(file => {
    const ruta = path.join(dir, file);
    if (fs.statSync(ruta).isDirectory() && !ruta.includes('node_modules')) {
      buscarArchivos(ruta, exts, lista);
    } else if (exts.some(e => file.endsWith(e))) {
      lista.push(ruta);
    }
  });
  return lista;
}

const archivos = buscarArchivos('.', ['.html', '.css', '.js']);
console.log(`\nActualizando ${archivos.length} archivos...\n`);
archivos.forEach(actualizarArchivo);
console.log('\n✅ HTML y CSS actualizados. Listo para commit.');
