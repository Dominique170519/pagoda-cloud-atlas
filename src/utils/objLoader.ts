export interface ParsedOBJ {
  vertices: Float32Array;
  vertexCount: number;
  bounds: {
    minX: number; maxX: number;
    minY: number; maxY: number;
    minZ: number; maxZ: number;
  };
}

export function parseOBJ(text: string): ParsedOBJ {
  const positions: number[] = [];

  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('v ')) {
      const parts = trimmed.split(/\s+/);
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);
      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        positions.push(x, y, z);
      }
    }
  }

  const vertices = new Float32Array(positions);
  const vertexCount = positions.length / 3;

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  return {
    vertices,
    vertexCount,
    bounds: { minX, maxX, minY, maxY, minZ, maxZ },
  };
}

export function normalizeVertices(obj: ParsedOBJ): Float32Array {
  const { bounds, vertices, vertexCount } = obj;
  const cx = (bounds.maxX + bounds.minX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  const cz = (bounds.maxZ + bounds.minZ) / 2;
  const range = Math.max(
    bounds.maxX - bounds.minX,
    bounds.maxY - bounds.minY,
    bounds.maxZ - bounds.minZ,
  ) / 2 || 1;

  const result = new Float32Array(vertices.length);
  for (let i = 0; i < vertexCount; i++) {
    const idx = i * 3;
    result[idx] = (vertices[idx] - cx) / range;
    result[idx + 1] = (vertices[idx + 1] - cy) / range;
    result[idx + 2] = (vertices[idx + 2] - cz) / range;
  }

  return result;
}

export interface LayerGroup {
  layerIndex: number;
  startY: number;
  endY: number;
  centroids: { x: number; y: number; z: number };
  vertexIndices: number[];
  color: [number, number, number];
}

export function groupByLayers(
  vertices: Float32Array,
  numLayers: number,
): LayerGroup[] {
  const vertexCount = vertices.length / 3;

  let minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < vertexCount; i++) {
    const y = vertices[i * 3 + 1];
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const range = maxY - minY;
  const layerHeight = range / numLayers;

  const groups: LayerGroup[] = [];
  const defaultColors: [number, number, number][] = [
    [0.0, 0.83, 1.0],   // cyan
    [0.2, 0.78, 1.0],
    [0.4, 0.73, 0.98],
    [0.5, 0.68, 0.95],
    [0.6, 0.55, 0.9],
    [0.7, 0.45, 0.85],
    [0.78, 0.35, 0.8],
    [0.85, 0.28, 0.72],
    [0.9, 0.2, 0.65],
  ];

  for (let l = 0; l < numLayers; l++) {
    const startY = minY + l * layerHeight;
    const endY = startY + layerHeight;
    const indices: number[] = [];
    let sx = 0, sy = 0, sz = 0;
    let count = 0;

    for (let i = 0; i < vertexCount; i++) {
      const y = vertices[i * 3 + 1];
      if (y >= startY && y < endY) {
        indices.push(i);
        sx += vertices[i * 3];
        sy += y;
        sz += vertices[i * 3 + 2];
        count++;
      }
    }

    // Also include last layer's exact max
    if (l === numLayers - 1) {
      for (let i = 0; i < vertexCount; i++) {
        const y = vertices[i * 3 + 1];
        if (y >= endY - 0.0001) {
          if (!indices.includes(i)) {
            indices.push(i);
            sx += vertices[i * 3];
            sy += y;
            sz += vertices[i * 3 + 2];
            count++;
          }
        }
      }
    }

    groups.push({
      layerIndex: l,
      startY,
      endY: l === numLayers - 1 ? maxY + 0.001 : endY,
      centroids: count > 0
        ? { x: sx / count, y: sy / count, z: sz / count }
        : { x: 0, y: (startY + endY) / 2, z: 0 },
      vertexIndices: indices,
      color: defaultColors[l] || [1, 1, 1],
    });
  }

  return groups;
}
