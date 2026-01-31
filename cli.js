#!/usr/bin/env node

import { Command } from 'commander';
import { Ollama } from 'ollama';
import * as readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import gradient from 'gradient-string';

const ollama = new Ollama();
const program = new Command();

const DEFAULT_MODEL = 'llama3.1:8b';

const miyuBold = gradient(['#ff6b6b', '#feca57', '#48dbfb']).multiline(`
 ███╗   ███╗██╗██╗   ██╗██╗   ██╗
 ████╗ ████║██║╚██╗ ██╔╝██║   ██║
 ██╔████╔██║██║ ╚████╔╝ ██║   ██║
 ██║╚██╔╝██║██║  ╚██╔╝  ██║   ██║
 ██║ ╚═╝ ██║██║   ██║   ╚██████╔╝
 ╚═╝     ╚═╝╚═╝   ╚═╝    ╚═════╝ 
`);

// Helper to ask a question
function question(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

program
  .name('miyu')
  .description('Chat with your local Ollama models')
  .version('1.0.0');

// One-shot prompt
program
  .command('ask <prompt...>')
  .description('Ask a single question')
  .option('-m, --model <model>', 'Model to use', DEFAULT_MODEL)
  .option('-s, --system <prompt>', 'System prompt')
  .action(async (promptParts, options) => {
    const prompt = promptParts.join(' ');
    const messages = [];
    
    if (options.system) {
      messages.push({ role: 'system', content: options.system });
    }
    messages.push({ role: 'user', content: prompt });
    
    const spinner = ora({ text: chalk.dim('Thinking...'), color: 'cyan' }).start();
    
    try {
      const response = await ollama.chat({ model: options.model, messages, stream: true });
      spinner.stop();
      process.stdout.write('\n' + chalk.cyan('❯ '));
      
      for await (const chunk of response) {
        process.stdout.write(chunk.message.content);
      }
      console.log('\n');
    } catch (err) {
      spinner.fail(chalk.red('Error: ' + err.message));
      process.exit(1);
    }
  });

// Interactive chat
program
  .command('chat')
  .description('Start an interactive chat session')
  .option('-m, --model <model>', 'Model to use', DEFAULT_MODEL)
  .option('-s, --system <prompt>', 'System prompt')
  .action(async (options) => {
    const messages = [];
    
    if (options.system) {
      messages.push({ role: 'system', content: options.system });
    }
    
    console.log('\n' + miyuBold);
    console.log(boxen(
      chalk.dim(`Model: ${chalk.white(options.model)}\nType ${chalk.yellow('exit')} to quit`),
      { padding: 1, margin: { top: 0, bottom: 1 }, borderStyle: 'round', borderColor: 'gray' }
    ));
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Main chat loop
    while (true) {
      const input = await question(rl, chalk.green('❯ '));
      
      if (!input || input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
        console.log(chalk.dim('\n👋 Bye!\n'));
        rl.close();
        break;
      }
      
      if (!input.trim()) continue;
      
      messages.push({ role: 'user', content: input });
      
      process.stdout.write(chalk.dim('  ...thinking\n'));
      
      try {
        let fullResponse = '';
        const response = await ollama.chat({ model: options.model, messages, stream: true });
        
        process.stdout.write(chalk.cyan('  ❯ '));
        
        for await (const chunk of response) {
          process.stdout.write(chunk.message.content);
          fullResponse += chunk.message.content;
        }
        console.log('\n');
        
        messages.push({ role: 'assistant', content: fullResponse });
      } catch (err) {
        console.log(chalk.red('  Error: ' + err.message));
      }
    }
  });

// List models
program
  .command('models')
  .description('List available models')
  .action(async () => {
    const spinner = ora('Loading models...').start();
    
    try {
      const response = await ollama.list();
      spinner.stop();
      
      console.log('\n' + chalk.bold('  Available Models\n'));
      
      response.models.forEach(m => {
        const size = (m.size / 1e9).toFixed(1);
        console.log(`  ${chalk.cyan(m.name.padEnd(28))} ${chalk.dim(size + ' GB')}`);
      });
      console.log();
    } catch (err) {
      spinner.fail(chalk.red('Error: ' + err.message));
      console.log(chalk.dim('\n  Is Ollama running? Try: brew services start ollama\n'));
    }
  });

// Pull model
program
  .command('pull <model>')
  .description('Pull a model from Ollama registry')
  .action(async (model) => {
    const spinner = ora(`Pulling ${chalk.cyan(model)}...`).start();
    
    try {
      const response = await ollama.pull({ model, stream: true });
      
      for await (const chunk of response) {
        if (chunk.status) {
          let text = chunk.status;
          if (chunk.completed && chunk.total) {
            const pct = ((chunk.completed / chunk.total) * 100).toFixed(0);
            text += ` ${chalk.yellow(pct + '%')}`;
          }
          spinner.text = text;
        }
      }
      spinner.succeed(chalk.green(`${model} ready!`));
    } catch (err) {
      spinner.fail(chalk.red('Error: ' + err.message));
    }
  });

// Default: quick ask
program
  .argument('[prompt...]', 'Quick prompt')
  .option('-m, --model <model>', 'Model to use', DEFAULT_MODEL)
  .action(async (promptParts, options) => {
    if (promptParts.length === 0) {
      console.log('\n' + miyuBold);
      program.help();
      return;
    }
    
    const prompt = promptParts.join(' ');
    const spinner = ora({ text: chalk.dim('Thinking...'), color: 'cyan' }).start();
    
    try {
      const response = await ollama.chat({
        model: options.model,
        messages: [{ role: 'user', content: prompt }],
        stream: true
      });
      
      spinner.stop();
      process.stdout.write('\n' + chalk.cyan('❯ '));
      
      for await (const chunk of response) {
        process.stdout.write(chunk.message.content);
      }
      console.log('\n');
    } catch (err) {
      spinner.fail(chalk.red('Error: ' + err.message));
      process.exit(1);
    }
  });

program.parse();
