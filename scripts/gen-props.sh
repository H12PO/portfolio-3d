#!/bin/bash
# Genere un composant par .glb, dans un sous-dossier miroir de celui du
# modele. Applique les quatre corrections que gltfjsx ne fait pas :
# chemin reel, export par defaut nomme, ombres, FrontSide contre l'acne
# d'auto-ombrage. Un composant deja present n'est jamais ecrase.
cd ~/dev/portfolio-3d

pascal() {
  echo "$1" | awk -F'_' '{for(i=1;i<=NF;i++) printf toupper(substr($i,1,1)) substr($i,2); print ""}'
}

ok=0; skip=0; ko=0
for f in public/models/*/*.glb; do
  rel=${f#public/}
  dir=$(basename "$(dirname "$f")")
  base=$(basename "$f" .glb)
  name=$(pascal "$base")
  out="src/components/props/$dir/$name.jsx"

  if [ -f "$out" ]; then echo "SKIP  $name"; skip=$((skip+1)); continue; fi
  mkdir -p "src/components/props/$dir"

  if ! npx gltfjsx@6.5.3 "$f" -o "$out" >/dev/null 2>&1; then
    echo "ECHEC $name"; ko=$((ko+1)); continue
  fi

  sed -i "s|useGLTF('[^']*')|useGLTF(URL)|g; s|useGLTF.preload('[^']*')|useGLTF.preload(URL)|g" "$out"
  sed -i "s|^import React from 'react'\$|import { useEffect } from 'react'\nimport * as THREE from 'three'|" "$out"
  sed -i "s|^export function Model(props) {|const URL = '/$rel'\n\nexport default function $name(props) {|" "$out"
  sed -i "s|<mesh geometry=|<mesh castShadow receiveShadow geometry=|g" "$out"
  sed -i "0,/^  return (\$/s||  useEffect(() => {\n    Object.values(materials).forEach((m) => {\n      if (m.name !== 'M_Vitre') m.side = THREE.FrontSide\n    })\n  }, [materials])\n\n  return (|" "$out"

  echo "OK    $dir/$name"
  ok=$((ok+1))
done
echo "---"
echo "$ok generes, $skip ignores, $ko echecs"
