#!/bin/bash

# Este script se debe ejecutar después de una instalación con Bun para asegurar
# que todas las dependencias están configuradas correctamente.

echo "🧹 Limpiando instalación previa..."
rm -rf node_modules
rm -f bun.lockb

echo "📦 Instalando dependencias con Bun..."
bun install

echo "✅ Instalación completada!"
echo "👉 Para ejecutar el servidor de desarrollo, usa: bun run dev" 