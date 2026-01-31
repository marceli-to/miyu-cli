# miyu-cli 🐱

A simple, stylish CLI for chatting with local [Ollama](https://ollama.ai) models.

![miyu](https://img.shields.io/npm/v/miyu-cli?color=ff6b6b&label=npm)

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/marceli-to/miyu-cli/main/install.sh | bash
```

Or via npm:
```bash
npm install -g github:marceli-to/miyu-cli
```

Make sure [Ollama](https://ollama.ai) is running locally.

## Usage

### Quick ask
```bash
miyu "what is the meaning of life"
```

### Interactive chat
```bash
miyu chat
```

### List available models
```bash
miyu models
```

### Pull a model
```bash
miyu pull llama3.1:8b
```

### Use a specific model
```bash
miyu -m mistral "explain quantum physics"
miyu chat -m codellama
```

### With system prompt
```bash
miyu chat -s "You are a helpful pirate. Respond in pirate speak."
```

## Commands

| Command | Description |
|---------|-------------|
| `miyu <prompt>` | Quick one-shot prompt |
| `miyu ask <prompt>` | Same as above, explicit |
| `miyu chat` | Interactive chat session |
| `miyu models` | List installed models |
| `miyu pull <model>` | Download a model |

## Options

- `-m, --model <model>` — Model to use (default: `llama3.1:8b`)
- `-s, --system <prompt>` — System prompt for context

## License

MIT
