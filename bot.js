const mineflayer = require('mineflayer');
const Movements = require('mineflayer-pathfinder').Movements;
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const { GoalBlock, GoalXZ, GoalNear, GoalGetToBlock } = require('mineflayer-pathfinder').goals;
const autoeat = require('mineflayer-auto-eat').plugin;
const armorManager = require('mineflayer-armor-manager');
const webinventory = require('mineflayer-web-inventory');
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const config = require('./settings.json');

const { error } = require('console');

function createBot() {
   let server = config.server.ip
   let ip = server.split(':')

   const bot = mineflayer.createBot({
      username: config['bot-account']['username'],
      password: config['bot-account']['password'],
      auth: config['bot-account']['type'],
      host: ip[0],
      port: ip[1],
      version: config.server.version,
   });

   bot.loadPlugin(pathfinder);
   const mcData = require('minecraft-data')(bot.version);
   const defaultMove = new Movements(bot, mcData);
   bot.settings.colorsEnabled = false;
   bot.pathfinder.setMovements(defaultMove);

   bot.on('login', () => {
      log("Bot joined to the server");
      process.title = `${bot.username} @ ${server}`

      if (config.utils['auto-auth'].enabled) {
         log('Started auto-auth module');

         let password = config.utils['auto-auth'].password;
         setTimeout(() => {
            bot.chat(`/register ${password} ${password}`);
            bot.chat(`/login ${password}`);
         }, 500);

         log(`Authentication commands executed`);
      }

      if (config.utils['chat-messages'].enabled) {
         log('Started chat-messages module');

         let messages = config.utils['chat-messages']['messages'];

         if (config.utils['chat-messages'].repeat) {
            let delay = config.utils['chat-messages']['repeat-delay'];
            let i = 0;

            setInterval(() => {
               bot.chat(`${messages[i]}`);

               if (i + 1 === messages.length) {
                  i = 0;
               } else i++;
            }, delay * 1000);
         } else {
            messages.forEach((msg) => {
               bot.chat(msg);
            });
         }
      }

      const pos = config.position;

      if (config.position.enabled) {
         log(`Starting moving to target location (${pos.x}, ${pos.y}, ${pos.z})`);
         bot.pathfinder.setGoal(new GoalBlock(pos.x, pos.y, pos.z));
      }

      if (config.utils['anti-afk'].enabled) {
         if (config.utils['anti-afk'].sneak) {
            bot.setControlState('sneak', true);
         }

         if (config.utils['anti-afk'].jump) {
            bot.setControlState('jump', true);
         }

         if (config.utils['anti-afk']['hit'].enabled) {
            let delay = config.utils['anti-afk']['hit']['delay'];
            let attackMobs = config.utils['anti-afk']['hit']['attack-mobs']

            setInterval(() => {
               if(attackMobs) {
                     let entity = bot.nearestEntity(e => e.type !== 'object' && e.type !== 'player'
                         && e.type !== 'global' && e.type !== 'orb' && e.type !== 'other');

                     if(entity) {
                        bot.attack(entity);
                        return
                     }
               }

               bot.swingArm("right", true);
            }, delay);
         }

         if (config.utils['anti-afk'].rotate) {
            setInterval(() => {
               bot.look(bot.entity.yaw + 1, bot.entity.pitch, true);
            }, 100);
         }

         if (config.utils['anti-afk']['circle-walk'].enabled) {
            let radius = config.utils['anti-afk']['circle-walk']['radius']
            circleWalk(bot, radius);
         }
      }

      if (config.utils['auto-eat'].enabled) {
         bot.loadPlugin(autoeat)
         bot.autoEat.options.priority = 'foodPoints';
         bot.autoEat.options.startAt = config.utils['auto-eat']['eat-at'];
         bot.autoEat.options.bannedFood.push(...config.utils['auto-eat']['no-eat']);
      }

      if (config.utils['auto-armor']) {
         bot.loadPlugin(armorManager)
         bot.armorManager.equipAll()
      }

      if (config.utils.webinv.enabled) {
         let invoptions = {
            port: config.utils.webinv.port
         }
        
         webinventory(bot, invoptions)
      }

      if (config.utils['auto-sleep']) {
         bot.on('rain', () => {
            log('Trời đang mưa')
            sleep()
         })

         bot.on('time', () => {
            const isNight = bot.time.timeOfDay > 13000
            if (isNight) {
               log('Trời đang tối')
               sleep()
            }
         })
      }
      
      if (config.utils['auto-gamemode'].enabled) {
         let gamemode = config.utils['auto-gamemode'].gamemode
         bot.on('physicTick', () => {
            if (bot.game.gameMode !== gamemode) {
               bot.chat(`/gamemode ${gamemode}`)
               log(bot.game.gameMode)
            }
         }) 
      }

   });

   function sleep () {
      if (bot.isSleeping) return
      const bed = bot.findBlock({
         matching: block => bot.isABed(block)
      })
      if (!bed) {
         log(`I can't see any bed`)
         return
      }
      bot.pathfinder.setGoal(new GoalGetToBlock(bed.position.x, bed.position.y, bed.position.z))
      bot.once('goal_reached', () => {
         bot.sleep(bed, (err) => {
            if (err) {
               log(`Bot can't sleep because ${err.message}`)
            } else {
               log('Bot sleep')
            }
         })
      })
   }
   
   rl.on('line', (input) => {
      if (config.utils['console-chat']) {
         bot.chat(input)
      }
   });

   bot.on('autoeat_error', (error) => {
      berror(error)
   });

   bot.on('autoeat_finished', (item, offhand) => {
      log(`[AutoEat] Finished eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
   });

   bot.on('message', (message, position) => {
      if (position == 'game_info') return
      if (config.utils['mes-log']) {
         log(message.toAnsi());
      }
   });

   bot.on('goal_reached', () => {
      if(config.positiion.enabled) {
         log(`Bot arrived to target location. ${bot.entity.position}`);
      }
   });

   bot.on('death', () => {
      warn(`Bot has been died and was respawned at ${bot.entity.position}`);
      bot.once('spawn', () => {
         const chat = config.utils['respawn-chat'].chat;
         const delay = config.utils['respawn-chat'].delay;

         for (let i = 0; i < chat.length; i++) {
         setTimeout(() => {
            bot.chat(chat[i]);
         }, i * delay * 1000);
         }
      });
   })
    

   if (config.utils['auto-reconnect']) {
      bot.on('end', () => {
         setTimeout(() => {
            createBot();
         }, config.utils['auto-reconnect-delay']);
      });
   }

   bot.on('kicked', (reason) => {
      let reasonText = JSON.parse(reason).text;
      if(reasonText === '') {
         reasonText = JSON.parse(reason).extra[0].text
      }
      reasonText = reasonText.replace(/§./g, '');

      warn(`Bot was kicked from the server. Reason: ${reasonText}`)
   }
   );

   bot.on('error', (err) =>
      berror(`${err.message}`)
   );
}

function circleWalk(bot, radius) {
   return new Promise(() => {
      const pos = bot.entity.position;
      const x = pos.x;
      const y = pos.y;
      const z = pos.z;

      const points = [
         [x + radius, y, z],
         [x, y, z + radius],
         [x - radius, y, z],
         [x, y, z - radius],
      ];

      let i = 0;
      setInterval(() => {
         if(i === points.length) i = 0;
         bot.pathfinder.setGoal(new GoalXZ(points[i][0], points[i][2]));
         i++;
      }, 1000);
   });
}

createBot();

const now = new Date()
const time = now.toLocaleString().replace("," , "-").replace(" " , "")

function log(input) {
   console.log(`\r\x1b[38;2;11;252;3m [${config.server.ip}] [${time}] [INFO] >>>\x1b[0m ${input.padEnd(50, ` `)}`)
   rl.prompt(true)
}

function warn(input) {
   console.warn(`\r\x1b[38;2;255;238;5m [${config.server.ip}] [${time}] [WARN] >>> ${input.padEnd(50, ` `)}\x1b[0m`)
   rl.prompt(true)
}

function berror(input) {
   berror(`\r\x1b[38;2;255;5;5m [${config.server.ip}] [${time}] [ERROR] >>> ${input.padEnd(50, ` `)}\x1b[0m`)
   rl.prompt(true)
}



