# RetroFlow 

## Sketch Diagrams in Retro Style, Share as Code or Pixels

---

## Overview
RetroFlow is a **cross-platform flowchart maker** with a *retro-computer aesthetic*. It allows users to quickly sketch diagrams using a drag-and-drop interface and export them as **ASCII art, pixel-art PNGs, or SVGs**. Ideal for developers, documenters, and retro computing fans, RetroFlow keeps things lightweight, fun, and practical.

---

## ✨ Features

- **Drag-and-Drop Flowcharts** 📌  
  - Simple node-based editor with retro-styled boxes and arrows.  
  - Customizable arrowheads and connectors.

- **Export Options** 🔄  
  - ✏️ *ASCII Art:* Share diagrams in plain text for code comments.
  - 🖼️ *Pixel Art PNG:* Generate pixelated images with optional CRT effects.
  - 📄 *SVG:* High-res scalable diagrams.

- **Retro Customization** 🎨  
  - Choose between monochrome, amber, or green-screen themes.
  - Optional "CRT glare" overlay for old-school aesthetics.

- **Quick Share** 🔗  
  - Generate a shareable URL using compressed diagram data.
  
---

## 🚀 Tech Stack

- **Frontend:** [Preact](https://preactjs.com/) + [react-flow](https://reactflow.dev/) for lightweight interactivity.
- **ASCII Conversion:** [figlet.js](https://github.com/patorjk/figlet.js/) or custom text mapping.
- **Pixel Art Export:** Canvas API for downscaled rendering.
- **Styling:** CSS grid layout + pixel-style box shadows.
- **State Persistence:** LocalStorage for saving diagrams.
- **Cross-Platform:** [Tauri](https://tauri.app/) for building native applications.

---

## 📌 Installation & Setup

1. **Clone the repository:**  
   ```sh
   git clone https://github.com/yourusername/retroflow.git
   cd retroflow
   ```

2. **Install dependencies:**  
   ```sh
   npm install
   ```

3. **Run the development server:**  
   ```sh
   npm run dev
   ```

4. **Open in browser:**  
   - Visit `http://localhost:3000`

5. **Build Cross-Platform App (Optional):**
   ```sh
   npm run tauri build
   ```

---

## 🤝 Contributing
Pull requests and feature suggestions are welcome! 🚀 

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-new-idea`
3. Commit your changes: `git commit -m "Added new feature"`
4. Push to the branch: `git push origin feature-new-idea`
5. Open a PR!

---

## 📜 License
[Apache2.0 License](LICENSE)

---

## 🌐 Live Demo
🚀 Try it out: 
