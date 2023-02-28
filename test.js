import { ChatGPTAPI } from 'chatgpt'

async function example() {
  const api = new ChatGPTAPI({
    apiKey: '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',
  })

  const res = await api.sendMessage('Hello World!')
  console.log(res.text)
}

example()