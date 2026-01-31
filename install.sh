#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}  ███╗   ███╗██╗██╗   ██╗██╗   ██╗${NC}"
echo -e "${CYAN}  ████╗ ████║██║╚██╗ ██╔╝██║   ██║${NC}"
echo -e "${CYAN}  ██╔████╔██║██║ ╚████╔╝ ██║   ██║${NC}"
echo -e "${CYAN}  ██║╚██╔╝██║██║  ╚██╔╝  ██║   ██║${NC}"
echo -e "${CYAN}  ██║ ╚═╝ ██║██║   ██║   ╚██████╔╝${NC}"
echo -e "${CYAN}  ╚═╝     ╚═╝╚═╝   ╚═╝    ╚═════╝ ${NC}"
echo ""
echo -e "  ${YELLOW}Installing miyu-cli...${NC}"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo ""
    echo "  Install Node.js first:"
    echo "    brew install node"
    echo "    # or visit https://nodejs.org"
    echo ""
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "  ${GREEN}✓${NC} Node.js ${NODE_VERSION} found"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi

echo -e "  ${GREEN}✓${NC} npm found"

# Install miyu-cli
echo ""
echo -e "  ${YELLOW}Installing from GitHub...${NC}"
npm install -g github:marceli-to/miyu-cli --silent

echo ""
echo -e "  ${GREEN}✓ miyu-cli installed!${NC}"
echo ""
echo -e "  Run ${CYAN}miyu${NC} to get started."
echo ""

# Check for Ollama
if ! command -v ollama &> /dev/null; then
    echo -e "  ${YELLOW}Note:${NC} Ollama not found. Install it from https://ollama.ai"
    echo ""
fi
