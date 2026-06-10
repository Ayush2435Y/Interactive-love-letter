let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // --- Core Drag Logic ---
    const startDrag = (x, y) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.mouseTouchX = x;
      this.mouseTouchY = y;
      this.prevMouseX = x;
      this.prevMouseY = y;
    };

    const doDrag = (x, y) => {
      if (!this.holdingPaper) return;
      
      this.mouseX = x;
      this.mouseY = y;
      
      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
      
      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
      
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
      
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    const stopDrag = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // --- 💻 Mouse Events (Desktop) ---
    paper.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // Left click
        startDrag(e.clientX, e.clientY);
      }
      if (e.button === 2) { // Right click
        this.rotating = true;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (this.holdingPaper && !this.rotating) {
         doDrag(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', stopDrag);

    // --- 📱 Touch Events (Mobile) ---
    paper.addEventListener('touchstart', (e) => {
      // Get the coordinates of the first finger touching the screen
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (this.holdingPaper) {
        e.preventDefault(); // 🛑 CRUCIAL: Stops the phone screen from scrolling down when dragging
        doDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    window.addEventListener('touchend', stopDrag);

    // Stops the right-click menu from appearing when rotating on desktop
    paper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
