import * as THREE from 'three';

export interface Cake3DConfig {
  shape: 'circle' | 'square' | 'heart';
  flour: 'maida' | 'wheat' | 'ragi';
  flavor:
    | 'vanilla'
    | 'carrot'
    | 'apple'
    | 'beetroot'
    | 'orange'
    | 'pomegranate'
    | 'guava';
  topping: 'none' | 'cashew' | 'almond' | 'drygrapes' | 'pista';
  layers: number;
  message?: string;
}

export class Cake3DService {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cakeMeshes: THREE.Mesh[] = [];
  private toppingsMesh: THREE.Group | null = null;
  private lights: THREE.Light[] = [];
  private animationId: number = 0;

  // Color mappings
  private flourColors: { [key: string]: string } = {
    maida: '#f5deb3', // Wheat/vanilla
    wheat: '#8b6914', // Brown
    ragi: '#a52a2a', // Dark red-brown
  };

  private flavorColors: { [key: string]: string } = {
    vanilla: '#f5deb3',
    carrot: '#ff8c00',
    apple: '#dc143c',
    beetroot: '#8b008b',
    orange: '#ff6400',
    pomegranate: '#dc143c',
    guava: '#ffb6c1',
  };

  constructor(canvas?: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1f3a);

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.set(0, 2, 4);
    this.camera.lookAt(0, 0, 0);

    if (canvas) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
      });
    } else {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    }
    this.renderer.setSize(300, 300);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    this.setupLights();
  }

  private setupLights() {
    // Remove existing lights
    this.lights.forEach((light) => this.scene.remove(light));
    this.lights = [];

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    this.lights.push(directionalLight);

    // Point light for detail
    const pointLight = new THREE.PointLight(0xd4af37, 0.4);
    pointLight.position.set(-5, 3, 5);
    this.scene.add(pointLight);
    this.lights.push(pointLight);
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  updateCake(config: Cake3DConfig) {
    // Remove existing cake meshes
    this.cakeMeshes.forEach((mesh) => this.scene.remove(mesh));
    this.cakeMeshes = [];

    if (this.toppingsMesh) {
      this.scene.remove(this.toppingsMesh);
      this.toppingsMesh = null;
    }

    // Create new cake with layers
    const layerSpacing = 0.6;
    for (let i = 0; i < config.layers; i++) {
      const yOffset =
        i * layerSpacing - ((config.layers - 1) * layerSpacing) / 2;
      const cakeMesh = this.createCakeLayer(config, yOffset);
      this.cakeMeshes.push(cakeMesh);
      this.scene.add(cakeMesh);
    }

    // Add toppings and message if selected (on top layer)
    if (config.topping !== 'none' || config.message) {
      const topLayerYOffset =
        (config.layers - 1) * layerSpacing -
        ((config.layers - 1) * layerSpacing) / 2;
      this.toppingsMesh = this.createToppingsAndMessage(
        config,
        topLayerYOffset
      );
      if (this.toppingsMesh) {
        this.scene.add(this.toppingsMesh);
      }
    }
  }

  private createCakeLayer(config: Cake3DConfig, yOffset: number): THREE.Mesh {
    let geometry: THREE.BufferGeometry;

    // Create geometry based on shape
    switch (config.shape) {
      case 'circle':
        geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
        break;
      case 'square':
        geometry = new THREE.BoxGeometry(2.2, 0.8, 2.2);
        break;
      case 'heart':
        geometry = this.createHeartShape();
        break;
      default:
        geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
    }

    // Determine color based on flour + flavor
    const baseColor = this.flourColors[config.flour] || '#f5deb3';
    const flavorColor = this.flavorColors[config.flavor] || '#f5deb3';

    // Blend colors (flavor takes 60% priority)
    const blendedColor = this.blendColors(baseColor, flavorColor, 0.6);

    // Create material
    const material = new THREE.MeshStandardMaterial({
      color: blendedColor,
      metalness: 0.1,
      roughness: 0.8,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = yOffset;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  private createHeartShape(): THREE.BufferGeometry {
    // Create heart shape that extrudes vertically like cylinder/box
    const shape = new THREE.Shape();
    const x = 0,
      y = 0;
    const scale = 0.6;

    // Start from the point at bottom
    shape.moveTo(x, y - 2 * scale);

    // Left side going up
    shape.quadraticCurveTo(
      x - 2.2 * scale,
      y - 1.5 * scale,
      x - 2.2 * scale,
      y + 0.5 * scale
    );

    // Left bump/lobe
    shape.quadraticCurveTo(
      x - 2.2 * scale,
      y + 1.5 * scale,
      x - 1 * scale,
      y + 1.5 * scale
    );

    // Left lobe top
    shape.quadraticCurveTo(
      x - 0.5 * scale,
      y + 1.5 * scale,
      x - 0.5 * scale,
      y + 0.8 * scale
    );

    // Center dip
    shape.quadraticCurveTo(x, y + 0.3 * scale, x, y + 0.3 * scale);

    // Right lobe top
    shape.quadraticCurveTo(
      x + 0.5 * scale,
      y + 0.8 * scale,
      x + 0.5 * scale,
      y + 1.5 * scale
    );

    // Right bump/lobe
    shape.quadraticCurveTo(
      x + 2.2 * scale,
      y + 1.5 * scale,
      x + 2.2 * scale,
      y + 0.5 * scale
    );

    // Right side going down
    shape.quadraticCurveTo(x + 2.2 * scale, y - 1.5 * scale, x, y - 2 * scale);

    shape.closePath();

    // Extrude vertically (along Y axis) like cylinder, not Z
    const extrudeSettings = {
      depth: 0.8,
      bevelEnabled: false,
      steps: 1,
    };

    // Create extruded geometry
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Rotate 90 degrees around X axis to lay it flat like cylinder
    geometry.rotateX(-Math.PI / 2);
    // Center the heart vertically so the top surface is at y=0.4 (same as cylinder height/2)
    geometry.translate(0, 0.4, 0);

    return geometry;
  }

  private heartCurve(): THREE.Curve<THREE.Vector2> {
    // Simple curved line for heart approximation
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 1; i += 0.01) {
      const x = 16 * Math.pow(Math.sin(i * Math.PI), 3);
      const y =
        13 * Math.cos(i * Math.PI) -
        5 * Math.cos(2 * i * Math.PI) -
        2 * Math.cos(3 * i * Math.PI) -
        Math.cos(4 * i * Math.PI);
      points.push(new THREE.Vector2(x / 16, y / 16));
    }

    // Return a simple line curve instead of extending THREE.Curve
    class PointsCurve extends THREE.LineCurve3 {
      constructor() {
        super(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 0));
      }
    }
    return new PointsCurve() as any;
  }

  private createToppingsAndMessage(
    config: Cake3DConfig,
    topLayerYOffset: number
  ): THREE.Group {
    const group = new THREE.Group();
    const hasMessage = config.message && config.message.trim();
    const hasToppings = config.topping !== 'none';

    console.log('createToppingsAndMessage - config:', config);
    console.log('hasMessage:', hasMessage);
    console.log('config.message:', config.message);
    console.log('topLayerYOffset:', topLayerYOffset);
    console.log('hasToppings:', hasToppings);

    // Always add full toppings coverage when topping is selected
    if (hasToppings) {
      console.log('Adding full topping coverage');
      this.addToppingsFull(
        group,
        config.topping,
        topLayerYOffset,
        config.shape
      );
    }

    // Add message as a separate layer
    // If toppings exist, place on top of toppings; otherwise, place on cake surface
    if (hasMessage && config.message) {
      console.log('Adding message text on separate layer:', config.message);
      this.addMessageText(
        group,
        config.message,
        topLayerYOffset,
        config.shape,
        hasToppings
      );
    } else {
      console.log(
        'NOT adding message - hasMessage:',
        hasMessage,
        'config.message:',
        config.message
      );
    }

    return group;
  }

  private addToppingsInCorners(
    group: THREE.Group,
    type: string,
    topLayerYOffset: number,
    shape: string = 'circle'
  ) {
    const colors = {
      cashew: 0xe6a961,
      almond: 0xd4a574,
      drygrapes: 0x6b3410,
      pista: 0x9acd32,
    };

    const color = colors[type as keyof typeof colors] || 0xd4af37;
    const toppingSize = 0.1;
    const spacing = 0.15;

    // Define 4 corner positions
    const corners = [
      { x: -0.7, z: -0.7 }, // Top-left
      { x: 0.7, z: -0.7 }, // Top-right
      { x: -0.7, z: 0.7 }, // Bottom-left
      { x: 0.7, z: 0.7 }, // Bottom-right
    ];

    const toppingsPerCorner = type === 'drygrapes' ? 4 : 3;

    // Add toppings in clusters at each corner
    corners.forEach((corner) => {
      for (let i = 0; i < toppingsPerCorner; i++) {
        for (let j = 0; j < toppingsPerCorner; j++) {
          const geometry = new THREE.SphereGeometry(toppingSize, 16, 16);
          const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.3,
            roughness: 0.6,
          });

          const mesh = new THREE.Mesh(geometry, material);
          const x = corner.x + (i - toppingsPerCorner / 2) * spacing;
          const z = corner.z + (j - toppingsPerCorner / 2) * spacing;
          // For circle/square: top surface at 0.4
          // For heart: top surface at 0.4 + 0.8 = 1.2
          const y =
            shape === 'heart' ? topLayerYOffset + 1.2 : topLayerYOffset + 0.4;

          mesh.position.set(x, y, z);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);
        }
      }
    });
  }

  private addToppingsFull(
    group: THREE.Group,
    type: string,
    topLayerYOffset: number,
    shape: string = 'circle'
  ) {
    const colors = {
      cashew: 0xe6a961,
      almond: 0xd4a574,
      drygrapes: 0x6b3410,
      pista: 0x9acd32,
    };

    // Parse comma-separated toppings into array of colors
    const toppingList = type
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && t !== 'none');

    // Get array of colors for selected toppings
    const toppingColors = toppingList
      .map((topping) => colors[topping as keyof typeof colors] || 0xd4af37)
      .filter((c) => c); // Filter out undefined

    console.log('addToppingsFull - parsed toppings:', toppingList);
    console.log(
      'addToppingsFull - topping colors:',
      toppingColors.map((c) => '0x' + c.toString(16).toUpperCase())
    );

    const toppingSize = 0.1;
    const spacing = 0.25;

    // Helper function to get random topping color
    const getRandomToppingColor = (): number => {
      if (toppingColors.length === 0) return 0xd4af37; // Default gold if no toppings
      if (toppingColors.length === 1) return toppingColors[0];
      return toppingColors[Math.floor(Math.random() * toppingColors.length)];
    };

    console.log('=== addToppingsFull DEBUG ===');
    console.log('Shape:', shape);
    console.log('topLayerYOffset:', topLayerYOffset);

    // Helper function to check if point is inside heart shape
    // The heart shape in the 3D scene has been rotated -90 degrees on X axis
    // So we need to check against the original heart shape coordinates
    const isInsideHeart = (x: number, z: number): boolean => {
      // After rotation, z maps to original Y coordinate of heart
      // The heart's original Y ranges from -1.2 to 0.9 (in units of scale=0.6)
      // After rotation and translation, these become z coordinates

      // In 3D space after rotation:
      // Heart bottom point (was y=-1.2) → z ≈ -0.4 (after translate 0.4)
      // Heart top point (was y=0.9) → z ≈ 1.3 (after translate 0.4)

      const absX = Math.abs(x);

      // Map z back to original heart Y coordinate
      // z ranges from -0.4 to 1.3 in world space
      // We want to check against original shape which uses scale = 0.6
      const heartY = z - 0.4; // Reverse the translation
      const scale = 0.6;

      console.log(
        `Heart boundary check: x=${x.toFixed(2)}, z=${z.toFixed(
          2
        )}, heartY=${heartY.toFixed(2)}`
      );

      // Bottom point of heart (narrow)
      if (heartY < -1.1 * scale) {
        const dist = Math.sqrt(absX * absX + (heartY + 1.2 * scale) ** 2);
        const isInside = dist <= 0.15;
        console.log(
          `  Bottom point: dist=${dist.toFixed(3)}, isInside=${isInside}`
        );
        return isInside;
      }

      // Upper lobes area
      if (heartY >= -0.3 * scale) {
        // Left lobe
        if (x < -0.5 * scale) {
          let isInside = absX <= 1.1 * scale && heartY <= 0.9 * scale;

          // Row 3 adjustment (z=0.25, heartY≈-0.15): expand to 7 dots
          if (heartY > -0.2 && heartY < 0.0) {
            isInside = absX <= 0.8 && heartY <= 0.9 * scale; // Allow wider range
            console.log(`  Left lobe Row 3 adjusted: isInside=${isInside}`);
          }
          // Row 5 adjustment (z=0.75, heartY≈0.35): restrict to 3 center dots
          else if (heartY >= 0.3 && heartY < 0.5) {
            isInside = absX <= 0.25 && heartY <= 0.9 * scale; // Restrict to center
            console.log(`  Left lobe Row 5 adjusted: isInside=${isInside}`);
          } else {
            console.log(`  Left lobe: isInside=${isInside}`);
          }
          return isInside;
        }
        // Right lobe
        if (x > 0.5 * scale) {
          let isInside = absX <= 1.1 * scale && heartY <= 0.9 * scale;

          // Row 3 adjustment (z=0.25, heartY≈-0.15): expand to 7 dots
          if (heartY > -0.2 && heartY < 0.0) {
            isInside = absX <= 0.8 && heartY <= 0.9 * scale; // Allow wider range
            console.log(`  Right lobe Row 3 adjusted: isInside=${isInside}`);
          }
          // Row 5 adjustment (z=0.75, heartY≈0.35): restrict to 3 center dots
          else if (heartY >= 0.3 && heartY < 0.5) {
            isInside = absX <= 0.25 && heartY <= 0.9 * scale; // Restrict to center
            console.log(`  Right lobe Row 5 adjusted: isInside=${isInside}`);
          } else {
            console.log(`  Right lobe: isInside=${isInside}`);
          }
          return isInside;
        }
        // Center between lobes
        let isInside = absX <= 0.5 * scale && heartY <= 0.9 * scale;

        // Row 3 adjustment (z=0.25, heartY≈-0.15): expand to 7 dots
        if (heartY > -0.2 && heartY < 0.0) {
          isInside = absX <= 0.8 && heartY <= 0.9 * scale; // Allow wider range
          console.log(`  Center Row 3 adjusted: isInside=${isInside}`);
        }
        // Row 5 adjustment (z=0.75, heartY≈0.35): restrict to 3 center dots
        else if (heartY >= 0.3 && heartY < 0.5) {
          isInside = absX <= 0.25 && heartY <= 0.9 * scale; // Restrict to center
          console.log(`  Center Row 5 adjusted: isInside=${isInside}`);
        } else {
          console.log(`  Center: isInside=${isInside}`);
        }
        return isInside;
      }

      // Middle section
      // For row 3 (z=0.25, heartY≈-0.15): expand width to add 2 more dots (9→7 or 5→7)
      // For row 5 (z=0.75, heartY≈0.35): restrict width to show only 3 center dots
      let maxWidth = 1.1 * scale * (1 - (heartY + 0.3 * scale) / (1.2 * scale));

      console.log(
        `  Before adjustments: heartY=${heartY.toFixed(
          3
        )}, maxWidth=${maxWidth.toFixed(3)}`
      );

      // Row 3 adjustment (z≈0.25, heartY around -0.15): expand to 7 dots
      // Need to allow x from -0.75 to 0.75 (absX <= 0.75)
      if (heartY > -0.2 && heartY < 0.0) {
        maxWidth = 0.8; // Allow x range [-0.75, 0.75] to get 7 dots
        console.log(
          `  Row 3 (z=0.25) adjusted: heartY=${heartY.toFixed(
            3
          )}, maxWidth=${maxWidth.toFixed(3)}`
        );
      }

      // Row 5 adjustment (z≈0.75, heartY around 0.35): restrict to only 3 center dots
      // This means allowing x in range [-0.25, 0.25] approximately (absX <= 0.25)
      if (heartY >= 0.3 && heartY < 0.5) {
        maxWidth = 0.25; // Only allow center 3 dots at x=-0.25, 0.00, 0.25
        console.log(
          `  Row 5 (z=0.75) adjusted: heartY=${heartY.toFixed(
            3
          )}, maxWidth=${maxWidth.toFixed(3)}`
        );
      }

      const isInside = absX <= maxWidth;
      console.log(
        `  Middle: maxWidth=${maxWidth.toFixed(3)}, isInside=${isInside}`
      );
      return isInside;
    };

    // Fill entire top surface in a grid pattern
    const gridCount = 5;
    let toppingCount = 0;
    const toppingsByRow: { [key: string]: number[] } = {};

    for (let i = -gridCount; i <= gridCount; i++) {
      for (let j = -gridCount; j <= gridCount; j++) {
        const x = i * spacing;
        const z = j * spacing;
        const distance = Math.sqrt(x * x + z * z);

        // Check if point should have topping based on shape
        let shouldAdd = false;

        if (shape === 'heart') {
          shouldAdd = isInsideHeart(x, z);
        } else if (shape === 'square') {
          // Square: check if within bounds
          shouldAdd = Math.abs(x) <= 1.1 && Math.abs(z) <= 1.1;
        } else {
          // Circle: use distance
          shouldAdd = distance <= 1.1;
        }

        if (shouldAdd) {
          toppingCount++;
          const geometry = new THREE.SphereGeometry(toppingSize, 16, 16);
          // Each dot gets randomly assigned one of the selected toppings' colors
          const dotColor = getRandomToppingColor();
          const material = new THREE.MeshStandardMaterial({
            color: dotColor,
            metalness: 0.3,
            roughness: 0.6,
          });

          const mesh = new THREE.Mesh(geometry, material);
          // For circle/square: top surface at 0.4
          // For heart: top surface at 0.4 + 0.8 = 1.2
          const y =
            shape === 'heart' ? topLayerYOffset + 1.2 : topLayerYOffset + 0.4;

          mesh.position.set(x, y, z);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);

          // Track toppings by z-row for debugging
          if (shape === 'heart') {
            const rowKey = `z=${z.toFixed(2)}`;
            if (!toppingsByRow[rowKey]) {
              toppingsByRow[rowKey] = [];
            }
            toppingsByRow[rowKey].push(x);
          }
        }
      }
    }

    if (shape === 'heart') {
      console.log('=== HEART SHAPE TOPPINGS BY ROW ===');
      const sortedRows = Object.keys(toppingsByRow).sort((a, b) => {
        const zA = parseFloat(a.split('=')[1]);
        const zB = parseFloat(b.split('=')[1]);
        return zA - zB;
      });
      sortedRows.forEach((row, idx) => {
        console.log(
          `Row ${idx + 1} (${row}): ${
            toppingsByRow[row].length
          } dots at x=${toppingsByRow[row].map((x) => x.toFixed(2)).join(', ')}`
        );
      });
      console.log(`Total toppings: ${toppingCount}`);
    }

    console.log(`Total toppings added: ${toppingCount}`);
    console.log('=== END DEBUG ===');
  }

  private addMessageText(
    group: THREE.Group,
    message: string,
    topLayerYOffset: number,
    shape: string = 'circle',
    hasToppings: boolean = false
  ) {
    console.log(
      'addMessageText called with message:',
      message,
      'shape:',
      shape
    );
    console.log('topLayerYOffset:', topLayerYOffset);

    // Create a canvas texture for the text
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      console.log('Canvas context created');

      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set font properties
      ctx.font = 'bold 100px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxWidth = 900; // Maximum width for text
      const lineHeight = 120; // Height between lines

      // Wrap text by words - don't break words, bring entire word to next line
      const words = message.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      console.log('Wrapped text lines:', lines);

      // Calculate starting Y position to center the text vertically
      const totalHeight = (lines.length - 1) * lineHeight;
      let startY = centerY - totalHeight / 2;

      // Draw each line
      lines.forEach((line, index) => {
        const yPos = startY + index * lineHeight;

        // Layer 1: Dark outline for depth
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 8;
        ctx.font = 'bold 100px Arial';
        ctx.strokeText(line, centerX, yPos);

        // Layer 2: Main dark text with gold shadow
        ctx.fillStyle = '#1a1a1a';
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.font = 'bold 100px Arial';
        ctx.fillText(line, centerX, yPos);

        // Layer 3: Gold highlight for glitter effect
        ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = -2;
        ctx.font = 'bold 95px Arial'; // Slightly smaller for highlight effect
        ctx.fillText(line, centerX - 2, yPos - 2);
      });

      console.log('Drawing text on canvas with wrapped lines');
    } else {
      console.error('Failed to get canvas context');
    }

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    console.log('Texture created');

    // Create a plane geometry for the text - positioned horizontally on cake top
    // Increase height to accommodate multiple lines
    const geometry = new THREE.PlaneGeometry(2.5, 1.5);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      emissive: 0xffd700,
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.2,
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Position message based on whether toppings are present
    // If NO toppings: place message on cake surface (where toppings would be)
    // If toppings exist: place message above toppings (0.4 units higher)
    let messageY: number;
    const zFightOffset = 0.01; // Small offset to prevent z-fighting with cake surface

    if (hasToppings) {
      // Place on top of toppings (0.4 units above toppings)
      // Toppings are at: circle/square = 0.4, heart = 1.2
      messageY =
        shape === 'heart'
          ? topLayerYOffset + 1.6 + zFightOffset
          : topLayerYOffset + 0.8 + zFightOffset;
    } else {
      // Place on cake surface (where toppings would be)
      // Surface is at: circle/square = 0.4, heart = 1.2
      // Add small offset above surface to prevent z-fighting
      messageY =
        shape === 'heart'
          ? topLayerYOffset + 1.2 + zFightOffset
          : topLayerYOffset + 0.4 + zFightOffset;
    }

    console.log('Message mesh positioning:');
    console.log('  Shape:', shape);
    console.log('  hasToppings:', hasToppings);
    console.log('  topLayerYOffset:', topLayerYOffset);
    console.log('  Message Y position:', messageY);
    console.log('  Z-fight offset applied:', zFightOffset);
    console.log('  Rotation: x = -Math.PI/2 (horizontal facing up)');

    mesh.position.set(0, messageY, 0);
    mesh.rotation.x = -Math.PI / 2; // Face up

    console.log('Message mesh created at position:', mesh.position);
    console.log('Group children before add:', group.children.length);

    group.add(mesh);

    console.log('Group children after add:', group.children.length);
  }

  private blendColors(color1: string, color2: string, blend: number): string {
    const c1 = parseInt(color1.replace('#', ''), 16);
    const c2 = parseInt(color2.replace('#', ''), 16);

    const r1 = (c1 >> 16) & 255;
    const g1 = (c1 >> 8) & 255;
    const b1 = c1 & 255;

    const r2 = (c2 >> 16) & 255;
    const g2 = (c2 >> 8) & 255;
    const b2 = c2 & 255;

    const r = Math.round(r1 * (1 - blend) + r2 * blend);
    const g = Math.round(g1 * (1 - blend) + g2 * blend);
    const b = Math.round(b1 * (1 - blend) + b2 * blend);

    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  private blendMultipleColors(colors: number[]): number {
    // Average multiple hex colors together
    if (colors.length === 0) return 0xd4af37;
    if (colors.length === 1) return colors[0];

    let sumR = 0;
    let sumG = 0;
    let sumB = 0;

    colors.forEach((color) => {
      sumR += (color >> 16) & 255;
      sumG += (color >> 8) & 255;
      sumB += color & 255;
    });

    const count = colors.length;
    const avgR = Math.round(sumR / count);
    const avgG = Math.round(sumG / count);
    const avgB = Math.round(sumB / count);

    return (avgR << 16) | (avgG << 8) | avgB;
  }

  private initialRotationX = 0.3; // Store initial rotation for default view
  private initialRotationY = 0;

  animate(isAutoRotateEnabled?: () => boolean, onFrame?: () => void) {
    this.animationId = requestAnimationFrame(() =>
      this.animate(isAutoRotateEnabled, onFrame)
    );

    // Only auto-rotate if enabled
    const shouldAutoRotate = isAutoRotateEnabled ? isAutoRotateEnabled() : true;
    if (shouldAutoRotate) {
      // Rotate cake slowly
      this.cakeMeshes.forEach((mesh) => {
        mesh.rotation.y += 0.005;
      });

      if (this.toppingsMesh) {
        this.toppingsMesh.rotation.y += 0.005;
      }
    }

    if (onFrame) onFrame();
    this.renderer.render(this.scene, this.camera);
  }

  resetToDefaultView() {
    // Reset rotation to initial state
    this.cakeMeshes.forEach((mesh) => {
      mesh.rotation.x = this.initialRotationX;
      mesh.rotation.y = this.initialRotationY;
      mesh.rotation.z = 0;
    });

    if (this.toppingsMesh) {
      this.toppingsMesh.rotation.x = this.initialRotationX;
      this.toppingsMesh.rotation.y = this.initialRotationY;
      this.toppingsMesh.rotation.z = 0;
    }
  }

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  setCanvasSize(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    this.stopAnimation();
    this.cakeMeshes.forEach((mesh) => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    this.renderer.dispose();
  }
}
