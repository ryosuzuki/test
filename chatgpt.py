import json, sys
from chatgpt_wrapper import ChatGPT

bot = ChatGPT()

while True:
  inp = input()
  response = bot.ask(inp)
  print(response)

main()