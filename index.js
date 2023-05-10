const telegramApi = require('node-telegram-bot-api');
const token = '6234227095:AAH_UY4GFoDoeae-TiheJCo_L75wj06xXXo';

const bot = new telegramApi(token, {polling:true})

bot.setMyCommands([
    {command: `/start`, description:`Начальное приветствие`},
    {command: `/info`, description:`Твоё имя на языке бравл старс`},
    {command: `/game`, description:`Игра с отчимами`}
])

const chats = {}

const {gameOptions, againOptions} = require('./options')

const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, `Отгадай сколько у меня отчимов!`);
    const randomNumber = Math.floor(Math.random()*10);
    console.log(randomNumber);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId,'Отгадывай',gameOptions);
}

const start = ()=>{
    bot.on('message', async msg=>{
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text==='/start'){
            await bot.sendSticker(chatId, 'CAACAgIAAxkBAAEI7XdkWr55d7B1ptZgizmkZuZoJ0WdlwACZSQAAr3MiUuValq3ttKxGS8E');
            return  bot.sendMessage(chatId, `Бот с отчимами`);
        }
        if (text === '/info'){
            await bot.sendSticker(chatId, 'CAACAgIAAxkBAAEI7XdkWr55d7B1ptZgizmkZuZoJ0WdlwACZSQAAr3MiUuValq3ttKxGS8E');
            return  bot.sendMessage(chatId, `Твоё имя на языке бравл старс ${msg.from.first_name}`);
        }
        if (text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, `Команды '${text}' не существует`);
    })

    bot.on('callback_query', async  msg =>{
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
            return startGame(chatId);
        }
        if (data == chats[chatId]){
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${data}`);
            return bot.sendSticker(chatId, 'CAACAgIAAxkBAAEI7hRkW0brx2z4laYzOXSjjct4DWcu_wACfxwAAiHA0UqIwO2AdQ9WvC8E',againOptions);
        } else{
            await bot.sendMessage(chatId, `Ты не отгадал. Загаданное число: ${chats[chatId] }`);
            return bot.sendSticker(chatId,'CAACAgIAAxkBAAEI7hZkW0bwZim289zBc3I8Bq2QN1BLEwACHBsAAsbY0EpGyB-Wk8Ibwi8E',againOptions)
        }

    })
}
start();