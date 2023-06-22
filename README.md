# Q-bot-afk
<p align="center"> 
    <img src="https://img.shields.io/github/issues/quangei/Q-bot-afk">
    <img src="https://img.shields.io/github/forks/quangei/Q-bot-afk">
    <img src="https://img.shields.io/github/stars/quangei/Q-bot-afk">
    <img src="https://img.shields.io/github/license/quangei/Q-bot-afk">
</p>

<p align="center">
    Functional minecraft AFK bot for servers
</p>

## Installation

### Local Machine
  1. Download & install [Node.JS](https://nodejs.org/en/download/)
  2. Download & install [Git Bash](https://git-scm.com/downloads)
  3. Open cmd
  4. Go to the file you want to save it with the `cd` command
  5. Type the command `git clone https://github.com/quangei/Q-bot-afk.git`
  6. Type the command `npm íntall` or activated Install.bat

### Replit
  1. Click the plus sign in the upper right corner (Create a Repl)
  2. Choose Template as Node.js of replit
  3. Click "Import from GitHub"
  4. Paste "github.com/quangei/Q-bot-afk" into the GitHub URL section
  5. Click "Import from GitHub" and wait for it to import
  6. If there is a config run command section, just press done
  7. Type the command `npm íntall` into Shell

## Usage

### Local Machine
  1. Edit the bot's information and functions in settings.json
  2. Open cmd
  3. Type the command `node bot.js` or activated Start.bat
     
### Replit
  1. Edit the bot's information and functions in settings.json
  2. Click "Run"
  3. If you want to run it 24/7 you can use uptime robot

## Features

- Support Microsoft/Offline accounts
- Position
- Guard
- Auto-Totem
- Auto-Armor
- Auto-Auth
- Anti-Afk
- Chat-Message
- Respawn-Chat
- Auto-Eat
- Webinv
- Auto-Sleep
- Mes-Log
- Console-Chat
- Auto-Reconnect

## Config

```json
{
  "bot-account": {
    "username": "Bot",
    "password": "your_password",
    "type": "offline"
  },

  "server": {
    "ip": "localhost:25565",
    "version": "1.8.9"
  },

  "position": {
    "enabled": false,
    "x": 279,
    "y": 101,
    "z": -242
  },

  "guard": {
    "enabled": false,
    "position": {
      "x": 292,
      "y": 85,
      "z": -222
    }
  },

  "pvp": {
    "auto-totem":{
      "enabled": false
    },
    "auto-armor": false
  },

  "utils": {
    "auto-auth": {
      "enabled": false,
      "password": "12345678"
    },

    "anti-afk": {
      "enabled": false,
      "sneak": false,
      "jump": false,
      "rotate": false,

      "hit": {
        "enabled": false,
        "delay": 500,
        "attack-mobs": false
      },

      "walk": {
        "enabled": false,
        "mode": {
          "random":{
            "time": 1000
          },
          "circle":{
            "radius": 5
          },
          "square":{
            "radius": 5
          },
          "rhombus":{
            "radius": 5
          }},
        "selected": "random"
      }
    },

    "chat-messages": {
      "enabled": false,
      "repeat": true,
      "repeat-delay": 60,

      "messages": [
        "I'm a regular player ",
        "My owner is quangei ",
        "I want be alone "
      ]
    },

    "respawn-chat": {
      "enabled": false,
      "delay": 1000,
      "chat": ["Respawn", "text", "..."]
    },

    "auto-eat": {
      "enabled": false,
      "eat-at": 16,
      "no-eat": ["golden_apple", "enchanted_golden_apple"]
    },

    "webinv": {
      "enabled": false,
      "port": 4001
    },

    "auto-sleep": false,  
    "mes-log": false,
    "console-chat": true,
    "auto-reconnect": false,
    "auto-reconnect-delay": 5000
  }
}

```

## License
 [MIT](https://github.com/quangei/Q-bot-afk/blob/main/LICENSE)
