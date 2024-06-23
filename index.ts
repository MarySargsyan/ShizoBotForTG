import { config } from 'dotenv';
import { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } from "grammy";

config();

const myId = process.env.MY_ID;
const dId = process.env.D_ID;

const BOT_API_KEY = process.env.BOT_API_KEY;
if (!BOT_API_KEY) {
    throw new Error('Missing BOT_API_KEY environment variable');
  }

const bot = new Bot(BOT_API_KEY); 

bot.api.setMyCommands([
    {
        command: 'start', description: 'Запуск бота'
    },
    {
        command: 'mood', description: 'Настроение'
    },
    // {
    //     command: 'location', description: 'Поделиться геолокацией'
    // },
    // {
    //     command: 'numbers', description: 'Цифры'
    // }
    // ,
    {
        command: 'chanals', description: 'Каналы'
    }
])

bot.hears("Хорошо",
    (ctx) => ctx.react("🎉")
)

//пример фильтрации по айди
bot.command("start").filter((ctx) => {
    return ctx.from?.id === myId;
}, 
async(ctx)=>{
    await ctx.react("🍓")
    await ctx.reply(`<span class="tg-spoiler">Здравствуйте, хозяин~~</span> ${myId}`, {
        reply_parameters:{message_id:ctx.msgId},     //ответ на сообщение
        parse_mode: 'HTML' //подключение HTML к ответу
    })}
)

bot.command("start", (ctx) => ctx.reply(`Привет!${myId}`));

//Keyboard
bot.command('mood', async(ctx) =>{
    const moodLables = ['Хорошо','Норм','Плохо']
    const rows = moodLables.map((lable) => {
        return[
            Keyboard.text(lable)
        ]
    })
    const moodKeyboard = Keyboard.from(rows).resized().oneTime()
    await ctx.reply("Как настроение?", {
        reply_markup: moodKeyboard
    })
})

//InineKeyboard
bot.command('chanals', async(ctx) =>{
    // const inlineKeyboard = new InlineKeyboard()
    // .text('1', 'button-1')
    // .text('2', 'button-2')
    // .text('3', 'button-3');
    const inlineKeyboard = new InlineKeyboard()
    .url('КАПИТАЛЬНАЯ ШИЗА', 'https://t.me/capitalshiza')
    .url('Чебурашная', 'https://t.me/+AsQ7EmEAOcphOTNi')

    await ctx.reply("Топ-2 лучших ТГК", {
        reply_markup: inlineKeyboard
    })
})

//принимаем конкретную кнопку
bot.callbackQuery(/button-[1-3]/, async(ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply(`Вы выбрали цифру ${ctx.callbackQuery.data}`)
}
)

//можем обращаться к обьекту кнопки, не принимаем конкретную кнопку
// bot.on('callback_query:data', 
//     async(ctx) => {
//         await ctx.answerCallbackQuery()
//         await ctx.reply(`Вы выбрали цифру ${ctx.callbackQuery.data}`)
//     }
// )

bot.hears([/Шиз/,/Шизик/, /шиз/,/шизик/,/Шизобот/, /шизобот/],
    (ctx) => ctx.reply("О, я!")
)

bot.command('location', async(ctx) => {
    const shareKeyBoard = new Keyboard().requestLocation("Поделиться геолокацией").resized().oneTime()
    await ctx.reply('нажми, чтобы поделиться', {
        reply_markup: shareKeyBoard
    })
})


// errors catches
bot.catch((err)=> {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError){
        console.error("Error in erquest:", e.description)
    }else if (e instanceof HttpError){
        console.error("Could not contact Telegram:", e)
    }else{
        console.error("Unknown error:", e)
    }
}
)

bot.start();