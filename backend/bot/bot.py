import os
import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes
from .utils import move_to_handled_chat, move_to_sent_chat

# Логування
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Перевірка змінних оточення
def getenv_int(name: str) -> int:
    value = os.getenv(name)
    if value is None:
        raise RuntimeError(f"Environment variable {name} is not set")
    return int(value)

CHAT_MAIN = getenv_int("TELEGRAM_CHAT_ID")
THREAD_HANDLED = getenv_int("THREAD_HANDLED")
THREAD_SENT = getenv_int("THREAD_SENT")
TOKEN = os.getenv("TELEGRAM_TOKEN")
if not TOKEN:
    raise RuntimeError("TELEGRAM_TOKEN is not set")


async def handle_reply(update, context):
    msg = update.message
    if not msg or not msg.reply_to_message:
        return

    chat_id = msg.chat.id
    text = msg.text.strip().lower()

    if chat_id != CHAT_MAIN:
        return

    # Переміщення у Оброблені
    if "оброблено" in text:
        await move_to_handled_chat(msg.reply_to_message, context)
        await context.bot.send_message(
            chat_id=CHAT_MAIN,
            message_thread_id=THREAD_HANDLED,
            text="Оброблено ✅"
        )
        return

    # Переміщення у Відправлені
    if "відправлено" in text:
        await move_to_sent_chat(msg.reply_to_message, context)
        await context.bot.send_message(
            chat_id=CHAT_MAIN,
            message_thread_id=THREAD_SENT,
            text="Відправлено ✅"
        )
        return



def run_bot():
    """Запуск бота"""
    application = ApplicationBuilder().token(TOKEN).build()

    # Обробник всіх відповідей
    application.add_handler(MessageHandler(filters.REPLY, handle_reply))

    logger.info("Bot started...")
    application.run_polling()
