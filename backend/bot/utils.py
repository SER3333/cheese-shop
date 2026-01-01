import os
from telegram.ext import ContextTypes

CHAT_NEW = int(os.getenv("TELEGRAM_CHAT_ID"))        # Нові замовлення
CHAT_HANDLED = int(os.getenv("THREAD_HANDLED"))      # Оброблені
CHAT_SENT = int(os.getenv("THREAD_SENT"))            # Відправлені

async def move_to_handled_chat(message, context: ContextTypes.DEFAULT_TYPE):
    """Переміщує повідомлення в тему 'Оброблені'"""
    await context.bot.copy_message(
        chat_id=CHAT_NEW,  # головний чат
        from_chat_id=message.chat.id,
        message_id=message.message_id,
        message_thread_id=CHAT_HANDLED  # тема Оброблені
    )
    await context.bot.delete_message(
        chat_id=message.chat.id,
        message_id=message.message_id
    )

async def move_to_sent_chat(message, context: ContextTypes.DEFAULT_TYPE):
    """Переміщує повідомлення в тему 'Відправлені'"""
    await context.bot.copy_message(
        chat_id=CHAT_NEW,
        from_chat_id=message.chat.id,
        message_id=message.message_id,
        message_thread_id=CHAT_SENT  # тема Відправлені
    )
    await context.bot.delete_message(
        chat_id=message.chat.id,
        message_id=message.message_id
    )

