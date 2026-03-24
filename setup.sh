#!/bin/bash
set -e

echo "🎬 Setting up YouTube video editing environment..."
echo ""

# Check macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  This setup script is designed for macOS."
    echo "   Some steps may not work on other platforms."
    echo ""
fi

# Install Homebrew
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "✅ Homebrew already installed"
fi

# Install FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "📦 Installing FFmpeg..."
    brew install ffmpeg
else
    echo "✅ FFmpeg already installed"
fi

# Install Node.js (for Remotion / 3D transitions)
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    brew install node
else
    echo "✅ Node.js already installed"
fi

# Install Python dependencies
echo ""
echo "📦 Installing Python dependencies..."
pip3 install anthropic faster-whisper python-dotenv requests torch

# Create .tmp directory
mkdir -p .tmp
echo "✅ Created .tmp/ directory"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "🔑 Creating .env file..."
    cat > .env << 'EOF'
ANTHROPIC_API_KEY=sk-ant-...
AUPHONIC_API_KEY=...
EOF
    echo "✅ Created .env — edit it with your API keys before running scripts"
else
    echo "✅ .env already exists"
fi

# Verify installation
echo ""
echo "🔍 Verifying installation..."
ffmpeg -version | head -1
python3 -c "import anthropic; print('✅ anthropic OK')"
python3 -c "import faster_whisper; print('✅ faster-whisper OK')"
python3 -c "import torch; print('✅ torch OK')"
node --version | xargs -I{} echo "✅ node {}"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your API keys"
echo "  2. Copy your video to .tmp/"
echo "  3. Run:"
echo "     python3 execution/jump_cut_vad_parallel.py .tmp/recording.mp4 .tmp/edited.mp4 --enhance-audio"
echo "     python3 execution/insert_3d_transition.py .tmp/edited.mp4 output.mp4 --bg-image .tmp/bg.png"
