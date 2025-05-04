/**
 * Generador de fondos aleatorios con degradados y texturas para usarse
 * como fallback cuando las imágenes no pueden cargarse
 */

import crypto from 'crypto';

// Colores de base inspirados en la paleta de la aplicación
const baseColors = [
  { h: 140, s: 60, l: 60 }, // Verde (minipay-green)
  { h: 160, s: 65, l: 55 }, // Verde azulado
  { h: 180, s: 55, l: 50 }, // Turquesa
  { h: 200, s: 70, l: 55 }, // Azul claro
  { h: 220, s: 65, l: 60 }, // Azul
];

const COLORS = [
  '#FF3A5E', '#FF5C5C', '#FFA15C', '#FFC55C', '#FFEA5C',
  '#8FFF5C', '#5CFFA7', '#5CE0FF', '#5C8FFF', '#C55CFF',
];

/**
 * Genera un color HSL aleatorio basado en los colores de base con variación
 */
function generateRandomColor(baseIndex?: number) {
  // Si se proporciona un índice, usar ese color base, de lo contrario elegir uno aleatorio
  const baseColor = baseIndex !== undefined 
    ? baseColors[baseIndex] 
    : baseColors[Math.floor(Math.random() * baseColors.length)];
  
  // Añadir variación al color base
  const h = (baseColor.h + Math.floor(Math.random() * 20) - 10) % 360;
  const s = Math.max(30, Math.min(90, baseColor.s + Math.floor(Math.random() * 20) - 10));
  const l = Math.max(40, Math.min(70, baseColor.l + Math.floor(Math.random() * 20) - 10));
  
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Genera un patrón SVG aleatorio para usar como textura
 */
function generateRandomPattern() {
  const patterns = [
    // Patrón de puntos
    () => {
      const size = 20 + Math.floor(Math.random() * 30);
      const radius = 1 + Math.random() * 2;
      const dotColor = `rgba(255,255,255,${0.1 + Math.random() * 0.3})`;
      return `
        <pattern id="dots" x="0" y="0" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="${dotColor}" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
      `;
    },
    
    // Patrón de líneas
    () => {
      const size = 20 + Math.floor(Math.random() * 30);
      const strokeWidth = 1 + Math.random() * 2;
      const lineColor = `rgba(255,255,255,${0.1 + Math.random() * 0.2})`;
      const angle = Math.floor(Math.random() * 180);
      return `
        <pattern id="lines" x="0" y="0" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <line x1="0" y1="${size/2}" x2="${size}" y2="${size/2}" stroke="${lineColor}" stroke-width="${strokeWidth}" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#lines)" />
      `;
    },
    
    // Patrón de cuadrícula
    () => {
      const size = 30 + Math.floor(Math.random() * 40);
      const strokeWidth = 1 + Math.random() * 1.5;
      const gridColor = `rgba(255,255,255,${0.05 + Math.random() * 0.15})`;
      return `
        <pattern id="grid" x="0" y="0" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="${size}" height="${size}" fill="none" stroke="${gridColor}" stroke-width="${strokeWidth}" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
      `;
    },
    
    // Patrón de círculos concéntricos
    () => {
      const centerX = 100 + Math.random() * 600;
      const centerY = 100 + Math.random() * 300;
      const circleColor = `rgba(255,255,255,${0.05 + Math.random() * 0.15})`;
      return `
        <circle cx="${centerX}" cy="${centerY}" r="100" stroke="${circleColor}" stroke-width="1" fill="none" />
        <circle cx="${centerX}" cy="${centerY}" r="150" stroke="${circleColor}" stroke-width="0.8" fill="none" />
        <circle cx="${centerX}" cy="${centerY}" r="200" stroke="${circleColor}" stroke-width="0.6" fill="none" />
      `;
    }
  ];
  
  // Elegir un patrón aleatorio
  const patternFunc = patterns[Math.floor(Math.random() * patterns.length)];
  return patternFunc();
}

/**
 * Genera un SVG con un degradado y textura aleatorios
 * @returns URL de datos SVG
 */
export function generatePlaceholderImage(): string {
  // Generar un ID único para evitar conflictos
  const uniqueId = Math.random().toString(36).substring(2, 11);
  
  const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <linearGradient id="grad-${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${generateRandomColor()};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${generateRandomColor()};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#grad-${uniqueId})" />
    ${generateRandomPattern()}
  </svg>
  `;
  
  // Codificar el SVG como URL de datos
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
}

/**
 * Genera un conjunto de placeholders para un array de elementos
 * @param count Número de placeholders a generar
 * @returns Array de URLs de datos SVG
 */
export function generatePlaceholders(count: number): string[] {
  return Array.from({ length: count }, () => generatePlaceholderImage());
}

/**
 * Función para generar un placeholder de imagen basado en el ID del proyecto
 * Este enfoque genera un SVG con un gradiente único y consistente para cada ID
 */
export function getConsistentPlaceholder(id: string): string {
  // Generar un hash basado en el ID para tener colores consistentes
  const hash = crypto.createHash('md5').update(id).digest('hex');
  
  // Extraer valores del hash para determinar colores y patrón
  const colorIndex1 = parseInt(hash.substring(0, 2), 16) % COLORS.length;
  const colorIndex2 = parseInt(hash.substring(2, 4), 16) % COLORS.length;
  const patternType = parseInt(hash.substring(4, 6), 16) % 5; // 5 tipos de patrones
  const patternDensity = 10 + (parseInt(hash.substring(6, 8), 16) % 40); // Densidad del patrón
  const angle = parseInt(hash.substring(8, 10), 16) % 360; // Ángulo del gradiente
  
  // Obtener colores para el gradiente
  const color1 = COLORS[colorIndex1];
  const color2 = COLORS[colorIndex2];
  
  // Generar el patrón basado en el tipo seleccionado
  let pattern;
  switch (patternType) {
    case 0: // Líneas horizontales (estilo VHS)
      pattern = generateHorizontalStripes(color1, color2, patternDensity);
      break;
    case 1: // Puntos
      pattern = generateDots(color1, color2, patternDensity);
      break;
    case 2: // Líneas diagonales
      pattern = generateDiagonalLines(color1, color2, patternDensity, angle);
      break;
    case 3: // Cuadrícula
      pattern = generateGrid(color1, color2, patternDensity);
      break;
    case 4: // Círculos concéntricos
      pattern = generateConcentricCircles(color1, color2, patternDensity);
      break;
    default:
      pattern = generateHorizontalStripes(color1, color2, patternDensity);
  }
  
  // Construir el SVG completo
  return `data:image/svg+xml;utf8,${encodeURIComponent(pattern)}`;
}

/**
 * Genera un patrón de rayas horizontales con degradados duros (estilo VHS)
 */
function generateHorizontalStripes(color1: string, color2: string, density: number): string {
  const stripeHeight = 100 / density;
  const stripes = [];
  
  // Crear rayas con paradas duras en el gradiente para un efecto más retro
  for (let i = 0; i < density; i++) {
    const y = i * stripeHeight;
    const color = i % 2 === 0 ? color1 : color2;
    const stripeOpacity = 0.7 + (i % 3) * 0.1; // Variación sutil en la opacidad
    
    stripes.push(`<rect x="0" y="${y}%" width="100%" height="${stripeHeight}%" fill="${color}" opacity="${stripeOpacity}" />`);
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
    <defs>
      <linearGradient id="overlay" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="${color1}" />
    ${stripes.join('')}
    <rect width="100%" height="100%" fill="url(#overlay)" />
    <rect width="100%" height="100%" fill="none" stroke="#000000" stroke-opacity="0.1" stroke-width="0.5" />
  </svg>`;
}

/**
 * Genera un patrón de puntos
 */
function generateDots(color1: string, color2: string, density: number): string {
  const dotSize = 100 / (density * 2);
  const dots = [];
  
  for (let i = 0; i < density; i++) {
    for (let j = 0; j < density; j++) {
      const x = (i * 100) / density + dotSize;
      const y = (j * 100) / density + dotSize;
      const color = (i + j) % 2 === 0 ? color1 : color2;
      const dotOpacity = 0.5 + ((i + j) % 3) * 0.15;
      
      dots.push(`<circle cx="${x}%" cy="${y}%" r="${dotSize}%" fill="${color}" opacity="${dotOpacity}" />`);
    }
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect width="100%" height="100%" fill="${color2}" opacity="0.7" />
    ${dots.join('')}
    <rect width="100%" height="100%" fill="none" stroke="#000000" stroke-opacity="0.1" stroke-width="0.5" />
  </svg>`;
}

/**
 * Genera un patrón de líneas diagonales
 */
function generateDiagonalLines(color1: string, color2: string, density: number, angle: number): string {
  const lineWidth = 100 / (density * 2);
  const lines = [];
  
  for (let i = 0; i < density * 2; i++) {
    const offset = (i * 100) / density - 100;
    const lineOpacity = 0.6 + (i % 3) * 0.15;
    const color = i % 2 === 0 ? color1 : color2;
    
    lines.push(`
      <line 
        x1="${offset}%" 
        y1="0%" 
        x2="${offset + 100}%" 
        y2="100%" 
        stroke="${color}" 
        stroke-width="${lineWidth}%" 
        stroke-opacity="${lineOpacity}" 
      />
    `);
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect width="100%" height="100%" fill="${color2}" opacity="0.4" />
    <g transform="rotate(${angle}, 50, 50)">
      ${lines.join('')}
    </g>
    <rect width="100%" height="100%" fill="none" stroke="#000000" stroke-opacity="0.1" stroke-width="0.5" />
  </svg>`;
}

/**
 * Genera un patrón de cuadrícula
 */
function generateGrid(color1: string, color2: string, density: number): string {
  const gridSize = 100 / density;
  const lineWidth = gridSize / 10;
  const lines = [];
  
  // Líneas horizontales
  for (let i = 0; i <= density; i++) {
    const y = (i * 100) / density;
    lines.push(`<line x1="0%" y1="${y}%" x2="100%" y2="${y}%" stroke="${color1}" stroke-width="${lineWidth}%" stroke-opacity="0.7" />`);
  }
  
  // Líneas verticales
  for (let i = 0; i <= density; i++) {
    const x = (i * 100) / density;
    lines.push(`<line x1="${x}%" y1="0%" x2="${x}%" y2="100%" stroke="${color1}" stroke-width="${lineWidth}%" stroke-opacity="0.7" />`);
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect width="100%" height="100%" fill="${color2}" opacity="0.5" />
    ${lines.join('')}
    <rect width="100%" height="100%" fill="none" stroke="#000000" stroke-opacity="0.1" stroke-width="0.5" />
  </svg>`;
}

/**
 * Genera un patrón de círculos concéntricos
 */
function generateConcentricCircles(color1: string, color2: string, density: number): string {
  const circles = [];
  
  for (let i = density; i > 0; i--) {
    const radius = (i * 100) / density;
    const color = i % 2 === 0 ? color1 : color2;
    const circleOpacity = 0.4 + (i % 3) * 0.2;
    
    circles.push(`<circle cx="50%" cy="50%" r="${radius}%" fill="${color}" opacity="${circleOpacity}" />`);
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect width="100%" height="100%" fill="${color2}" opacity="0.3" />
    ${circles.join('')}
    <rect width="100%" height="100%" fill="none" stroke="#000000" stroke-opacity="0.1" stroke-width="0.5" />
  </svg>`;
} 