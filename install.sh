
#!/bin/bash

# Local File Organizer - One-Click Install Script
# Supports: Linux, macOS
# Note: Windows users should use WSL or install npm directly

set -e

echo "============================================="
echo "  Local File Organizer - One-Click Install"
echo "============================================="
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    echo ""
    echo "Please install Node.js and npm first:"
    echo "  - Linux: Use your package manager (e.g., sudo apt install nodejs npm)"
    echo "  - macOS: Use Homebrew (brew install node) or download from https://nodejs.org/"
    echo "  - Windows: Download from https://nodejs.org/ or use WSL"
    echo ""
    exit 1
fi

echo "✅ npm is installed (version: $(npm --version))"
echo ""

# Install the package
echo "📦 Installing Local File Organizer..."
npm install -g local-file-organizer

echo ""
echo "============================================="
echo "  ✅ Installation Complete!"
echo "============================================="
echo ""
echo "To get started, run:"
echo "  lfo --help"
echo ""
echo "Quick examples:"
echo "  lfo organize --type ~/Downloads    # Organize by file type"
echo "  lfo organize --date ~/Desktop      # Organize by date"
echo "  lfo organize --type --preview ~/Downloads  # Preview without making changes"
echo ""
echo "For more information, visit:"
echo "  https://github.com/luachuan/local-file-organization"
echo ""
