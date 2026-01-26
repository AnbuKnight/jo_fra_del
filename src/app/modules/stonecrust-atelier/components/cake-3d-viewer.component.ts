import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { Cake3DService, Cake3DConfig } from '../services/cake-3d.service';

@Component({
  selector: 'app-cake-3d-viewer',
  template: `
    <div class="cake-3d-container">
      <div class="cake-canvas-wrapper">
        <canvas #cakeCanvas width="300" height="300"></canvas>
        <button
          class="fullscreen-btn"
          (click)="openModal()"
          title="View in fullscreen"
        >
          🔍
        </button>
      </div>
      <div class="cake-controls">
        <button
          class="rotate-btn"
          (click)="toggleAutoRotate()"
          [class.active]="autoRotate"
        >
          {{ autoRotate ? '⏸️ Pause' : '▶️ Rotate' }}
        </button>
        <button
          class="rotate-btn default-view-btn"
          (click)="resetToDefault()"
          title="Reset to default view"
        >
          🏠 Default View
        </button>
      </div>
    </div>

    <!-- Modal Popup -->
    <div class="cake-modal-overlay" *ngIf="isModalOpen" (click)="closeModal()">
      <div class="cake-modal-content" (click)="$event.stopPropagation()">
        <button class="modal-close-btn" (click)="closeModal()">✕</button>

        <div class="modal-body">
          <div class="modal-cake-section">
            <canvas #modalCakeCanvas width="600" height="600"></canvas>
            <div class="modal-cake-controls">
              <button
                class="rotate-btn"
                (click)="toggleAutoRotate()"
                [class.active]="autoRotate"
              >
                {{ autoRotate ? '⏸️ Pause' : '▶️ Rotate' }}
              </button>
              <button
                class="rotate-btn default-view-btn"
                (click)="resetToDefault()"
                title="Reset to default view"
              >
                🏠 Default View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .cake-3d-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        position: relative;
      }

      .cake-canvas-wrapper {
        position: relative;
        width: 300px;
        height: 300px;
        border: 2px solid #d4af37;
        border-radius: 20px;
        background: linear-gradient(
          135deg,
          rgba(26, 31, 58, 0.95),
          rgba(10, 14, 39, 0.95)
        );
        overflow: hidden;
        box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
          cursor: grabbing;
        }
      }

      .fullscreen-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(212, 175, 55, 0.9);
        border: 2px solid #d4af37;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 10;

        &:hover {
          background: #d4af37;
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.8);
        }
      }

      canvas {
        display: block;
        width: 100%;
        height: 100%;
      }

      .cake-controls {
        display: flex;
        gap: 1rem;
      }

      .rotate-btn {
        padding: 0.8rem 1.5rem;
        background: linear-gradient(135deg, #d4af37, #f4d03f);
        color: #1a1f3a;
        border: none;
        border-radius: 10px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.95rem;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
        }

        &.active {
          background: linear-gradient(135deg, #f4d03f, #d4af37);
        }

        &.default-view-btn {
          background: linear-gradient(135deg, #d4af37, #d4af37);
          opacity: 0.9;

          &:hover {
            opacity: 1;
          }
        }
      }

      /* Modal Styles */
      .cake-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
        padding: 1rem;
        overflow: auto;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .cake-modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(
          135deg,
          rgba(26, 31, 58, 0.98),
          rgba(10, 14, 39, 0.98)
        );
        border: 2px solid #d4af37;
        border-radius: 20px;
        box-shadow: 0 0 50px rgba(212, 175, 55, 0.5);
        width: 80vw;
        height: 80vh;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        animation: slideUp 0.3s ease;
        display: flex;
        flex-direction: column;
        margin: auto;
      }

      @keyframes slideUp {
        from {
          transform: translateY(50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .modal-close-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(212, 175, 55, 0.9);
        border: 2px solid #d4af37;
        cursor: pointer;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 1001;
        color: #1a1f3a;

        &:hover {
          background: #d4af37;
          transform: scale(1.1);
        }
      }

      .modal-body {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3rem;
        padding: 2rem;
        flex-wrap: wrap;
        flex: 1;
      }

      .modal-cake-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        flex-shrink: 0;
      }

      .modal-cake-section canvas {
        width: 600px;
        height: 600px;
        border: 2px solid #d4af37;
        border-radius: 20px;
        background: linear-gradient(
          135deg,
          rgba(26, 31, 58, 0.95),
          rgba(10, 14, 39, 0.95)
        );
      }

      .modal-cake-controls {
        display: flex;
        gap: 1rem;
      }

      @media (max-width: 1024px) {
        .modal-body {
          flex-direction: column;
          gap: 2rem;
        }

        .modal-cake-section canvas {
          width: 500px;
          height: 500px;
        }

        .cake-modal-content {
          width: 90vw;
          height: 90vh;
        }
      }

      @media (max-width: 768px) {
        .cake-canvas-wrapper {
          width: 250px;
          height: 250px;
        }

        .modal-body {
          flex-direction: column;
          gap: 2rem;
          padding: 1.5rem;
        }

        .modal-cake-section canvas {
          width: 400px;
          height: 400px;
        }

        .cake-modal-content {
          width: 95vw;
          height: 95vh;
        }
      }

      /* Dynamic Modal Styles */
      ::ng-deep .cake-modal-overlay-dynamic {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
      }

      ::ng-deep .cake-modal-content-dynamic {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(
          135deg,
          rgba(26, 31, 58, 0.98),
          rgba(10, 14, 39, 0.98)
        );
        border: 2px solid #d4af37;
        border-radius: 20px;
        box-shadow: 0 0 50px rgba(212, 175, 55, 0.5);
        width: 80vw;
        height: 80vh;
        max-width: 90vw;
        max-height: 90vh;
        overflow: hidden;
        animation: slideUp 0.3s ease;
        display: flex;
        flex-direction: column;
        z-index: 10000;
        padding: 0;
      }

      ::ng-deep .modal-close-btn-dynamic {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(212, 175, 55, 0.9);
        border: 2px solid #d4af37;
        cursor: pointer;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 10001;
        color: #1a1f3a;
      }

      ::ng-deep .modal-close-btn-dynamic:hover {
        background: #d4af37;
        transform: scale(1.1);
      }

      ::ng-deep .modal-body-dynamic {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
        padding: 0;
        flex: 1;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      ::ng-deep .modal-cake-section-dynamic {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
        gap: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        flex: 1;
        min-height: 0;
      }

      ::ng-deep .modal-cake-section-dynamic canvas {
        width: 100% !important;
        height: 100% !important;
        border: none !important;
        border-radius: 0 !important;
        background: linear-gradient(
          135deg,
          rgba(26, 31, 58, 0.95),
          rgba(10, 14, 39, 0.95)
        ) !important;
        display: block !important;
        flex: 1 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      ::ng-deep .modal-cake-controls-dynamic {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        width: 100%;
        height: 60px;
        justify-content: center;
        background: rgba(0, 0, 0, 0.3);
        border-top: 1px solid rgba(212, 175, 55, 0.3);
        flex-shrink: 0;
      }
    `,
  ],
})
export class Cake3DViewerComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  @ViewChild('cakeCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('modalCakeCanvas', { static: false })
  modalCanvasRef?: ElementRef<HTMLCanvasElement>;

  @Input() cakeConfig!: Cake3DConfig;

  autoRotate = true;
  isModalOpen = false;
  private cakeService: Cake3DService | null = null;
  private modalCakeService: Cake3DService | null = null;
  private mouseDown = false;
  private mouseX = 0;
  private mouseY = 0;
  private rotationX = 0.3;
  private rotationY = 0;
  private modalElement: HTMLElement | null = null;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // Initialization will happen in ngAfterViewInit
  }

  ngAfterViewInit() {
    if (this.canvasRef && this.canvasRef.nativeElement) {
      this.initializeCanvas();
    }
  }

  private initializeCanvas() {
    try {
      const canvas = this.canvasRef.nativeElement;

      // Create Three.js service with the canvas element
      this.cakeService = new Cake3DService(canvas);

      // Add mouse controls
      canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
      canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
      canvas.addEventListener('mouseup', () => this.onMouseUp());
      canvas.addEventListener('mouseleave', () => this.onMouseUp());

      // Touch controls
      canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
      canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
      canvas.addEventListener('touchend', () => this.onMouseUp());

      // Update cake with initial config
      if (this.cakeConfig) {
        console.log('Initializing cake with config:', this.cakeConfig);
        this.cakeService.updateCake(this.cakeConfig);
      } else {
        console.log('No cakeConfig available on init');
      }

      // Start animation with autoRotate state callback
      this.cakeService.animate(() => this.autoRotate);
    } catch (error) {
      console.error('Failed to initialize 3D cake viewer:', error);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Cake3DViewerComponent - ngOnChanges called');
    console.log('cakeConfig:', this.cakeConfig);
    console.log('changes:', changes);

    if (
      changes['cakeConfig'] &&
      !changes['cakeConfig'].firstChange &&
      this.cakeService
    ) {
      console.log('Updating cake with config:', this.cakeConfig);
      this.cakeService.updateCake(this.cakeConfig);
    }
  }

  ngOnDestroy() {
    if (this.cakeService) {
      this.cakeService.dispose();
    }
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
  }

  resetToDefault() {
    if (this.cakeService) {
      this.cakeService.resetToDefaultView();
    }
    if (this.modalCakeService) {
      this.modalCakeService.resetToDefaultView();
    }
  }

  openModal() {
    this.isModalOpen = true;

    // Create modal overlay
    this.modalElement = this.renderer.createElement('div');
    this.renderer.addClass(this.modalElement, 'cake-modal-overlay-dynamic');

    // Create modal content
    const modalContent = this.renderer.createElement('div');
    this.renderer.addClass(modalContent, 'cake-modal-content-dynamic');

    // Create close button
    const closeBtn = this.renderer.createElement('button');
    this.renderer.addClass(closeBtn, 'modal-close-btn-dynamic');
    this.renderer.setProperty(closeBtn, 'innerHTML', '✕');
    this.renderer.listen(closeBtn, 'click', () => this.closeModal());

    // Create modal body
    const modalBody = this.renderer.createElement('div');
    this.renderer.addClass(modalBody, 'modal-body-dynamic');

    // Create canvas container
    const canvasContainer = this.renderer.createElement('div');
    this.renderer.addClass(canvasContainer, 'modal-cake-section-dynamic');

    // Create canvas
    const canvas = this.renderer.createElement('canvas');
    // Don't set fixed width/height - let CSS and container handle it
    this.renderer.setAttribute(canvas, 'id', 'modalCakeCanvas');
    this.renderer.appendChild(canvasContainer, canvas);

    // Create controls
    const controls = this.renderer.createElement('div');
    this.renderer.addClass(controls, 'modal-cake-controls-dynamic');

    const rotateBtn = this.renderer.createElement('button');
    this.renderer.addClass(rotateBtn, 'rotate-btn');
    this.renderer.setProperty(
      rotateBtn,
      'innerHTML',
      this.autoRotate ? '⏸️ Pause' : '▶️ Rotate'
    );
    this.renderer.listen(rotateBtn, 'click', () => {
      this.toggleAutoRotate();
      this.renderer.setProperty(
        rotateBtn,
        'innerHTML',
        this.autoRotate ? '⏸️ Pause' : '▶️ Rotate'
      );
    });
    this.renderer.appendChild(controls, rotateBtn);

    // Add default view button
    const defaultViewBtn = this.renderer.createElement('button');
    this.renderer.addClass(defaultViewBtn, 'rotate-btn');
    this.renderer.addClass(defaultViewBtn, 'default-view-btn');
    this.renderer.setProperty(defaultViewBtn, 'innerHTML', '🏠 Default View');
    this.renderer.setProperty(defaultViewBtn, 'title', 'Reset to default view');
    this.renderer.listen(defaultViewBtn, 'click', () => this.resetToDefault());
    this.renderer.appendChild(controls, defaultViewBtn);

    this.renderer.appendChild(canvasContainer, controls);

    // Append elements
    this.renderer.appendChild(modalBody, canvasContainer);
    this.renderer.appendChild(modalContent, closeBtn);
    this.renderer.appendChild(modalContent, modalBody);
    this.renderer.appendChild(this.modalElement, modalContent);

    // Add to body
    this.renderer.appendChild(document.body, this.modalElement);

    // Prevent body scroll
    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    // Close on overlay click
    this.renderer.listen(this.modalElement, 'click', (event) => {
      if (event.target === this.modalElement) {
        this.closeModal();
      }
    });

    // Wait for modal to render before initializing canvas
    setTimeout(() => {
      const canvasEl = document.getElementById(
        'modalCakeCanvas'
      ) as HTMLCanvasElement;
      if (canvasEl) {
        this.initializeModalCanvas(canvasEl);
      }
    }, 0);
  }

  closeModal() {
    this.isModalOpen = false;

    // Remove modal from DOM
    if (this.modalElement && this.modalElement.parentNode) {
      this.renderer.removeChild(document.body, this.modalElement);
      this.modalElement = null;
    }

    // Restore body scroll
    this.renderer.setStyle(document.body, 'overflow', 'auto');

    // Dispose modal cake service
    if (this.modalCakeService) {
      this.modalCakeService.dispose();
      this.modalCakeService = null;
    }
  }

  private initializeModalCanvas(canvas: HTMLCanvasElement) {
    try {
      if (!canvas) return;

      // Get parent container dimensions
      const container = canvas.parentElement;
      if (!container) return;

      // Set canvas to fill the container
      const resizeCanvas = () => {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Set canvas resolution to match container
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        // Update camera aspect ratio if service exists
        if (this.modalCakeService) {
          this.modalCakeService.setCanvasSize(containerWidth, containerHeight);
        }
      };

      // Initial resize
      resizeCanvas();

      // Create Three.js service with the modal canvas
      this.modalCakeService = new Cake3DService(canvas);

      // Resize after service creation
      setTimeout(() => {
        resizeCanvas();
      }, 0);

      // Add mouse controls
      canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
      canvas.addEventListener('mousemove', (e) => this.onMouseMove(e, true));
      canvas.addEventListener('mouseup', () => this.onMouseUp());
      canvas.addEventListener('mouseleave', () => this.onMouseUp());

      // Touch controls
      canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
      canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
      canvas.addEventListener('touchend', () => this.onMouseUp());

      // Update cake with current config
      if (this.cakeConfig) {
        this.modalCakeService.updateCake(this.cakeConfig);
      }

      // Start animation
      this.modalCakeService.animate();

      // Add resize observer to handle modal resizing
      if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => {
          resizeCanvas();
        });
        resizeObserver.observe(container);
      }
    } catch (error) {
      console.error('Failed to initialize modal 3D cake viewer:', error);
    }
  }

  private onMouseMove(e: MouseEvent, isModal: boolean = false) {
    if (!this.mouseDown) return;

    const service = isModal ? this.modalCakeService : this.cakeService;
    if (!service) return;

    const deltaX = e.clientX - this.mouseX;
    const deltaY = e.clientY - this.mouseY;

    if (this.autoRotate) {
      this.rotationY += deltaX * 0.01;
      this.rotationX += deltaY * 0.01;

      const camera = service.getCamera();
      camera.position.x = Math.sin(this.rotationY) * 5;
      camera.position.z = Math.cos(this.rotationY) * 5;
      camera.position.y = Math.sin(this.rotationX) * 3 + 2;
      camera.lookAt(0, 0, 0);
    }

    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  private onMouseDown(e: MouseEvent) {
    this.mouseDown = true;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  private onMouseUp() {
    this.mouseDown = false;
  }

  private onTouchStart(e: TouchEvent) {
    if (e.touches.length > 0) {
      this.onMouseDown(e.touches[0] as any);
    }
  }

  private onTouchMove(e: TouchEvent) {
    if (e.touches.length > 0) {
      this.onMouseMove(e.touches[0] as any);
    }
  }
}
