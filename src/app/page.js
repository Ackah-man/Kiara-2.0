"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { ScrollArea } from "../components/ui/scroll-area"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasSentMessage, setHasSentMessage] = useState(false)
  const chatRef = useRef(null)

  const sendMessage = async () => {
    if (!input.trim()) return

    if (!hasSentMessage) setHasSentMessage(true)

    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, msg: input }),
      })

      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      let receivedText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        receivedText += new TextDecoder().decode(value)
        setMessages([
          ...newMessages,
          { role: "assistant", content: receivedText },
        ])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
      chatRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-10 p-5 text-white bg-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-xl font-semibold text-center mb-4">KIARA 2.0</h1>

      {hasSentMessage && (
        <ScrollArea className="h-70 overflow-y-auto p-4 rounded-lg">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              className={`p-3 my-2 rounded-lg max-w-[80%] ${
                msg.role === "user"
                  ? "bg-red-600 self-end ml-auto rounded-xl"
                  : "bg-gray-700 self-start rounded-xl"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-sm prose prose-sm prose-code:text-slate-50 prose-ul:text-slate-50">
                {msg.content}
              </ReactMarkdown>
            </motion.div>
          ))}
          <div ref={chatRef} />
        </ScrollArea>
      )}

      <Card
        className={`${
          hasSentMessage ? "mt-80" : "mt-40"
        } bg-white-800 transition-all duration-300`}
      >
        <CardContent className="p-4 flex gap-3 border-none">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Whatsup, how can I help?..."
            className="flex-5 text-black bg-white-900 border-none focus:ring-0"
          />
          <Button
            onClick={sendMessage}
            disabled={loading}
            className="bg-red-500 hover:bg-blue-600 rounded-xxl"
          >
            {loading ? "..." : "Send"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
