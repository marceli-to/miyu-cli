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

# Check for Ollama
if ! command -v ollama &> /dev/null; then
    echo ""
    echo -e "  ${YELLOW}Ollama not found. Installing...${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install ollama
        else
            echo -e "  ${RED}✗ Homebrew not found${NC}"
            echo "    Install Ollama manually: https://ollama.ai"
            echo ""
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://ollama.com/install.sh | sh
    else
        echo -e "  ${YELLOW}Please install Ollama manually: https://ollama.ai${NC}"
    fi
    
    if command -v ollama &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Ollama installed"
    fi
else
    echo -e "  ${GREEN}✓${NC} Ollama found"
fi

# Install miyu-cli
echo ""
echo -e "  ${YELLOW}Installing miyu-cli from GitHub...${NC}"
npm install -g github:marceli-to/miyu-cli --silent

echo ""
echo -e "  ${GREEN}✓ miyu-cli installed!${NC}"
echo ""
echo -e "  Get started:"
echo -e "    ${CYAN}ollama pull llama3.2${NC}    # download a model"
echo -e "    ${CYAN}miyu chat${NC}               # start chatting"
echo ""
