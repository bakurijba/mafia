import classNames from "classnames";
import { socket } from "../../socket";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { Button, Input } from "rsuite";

interface MessageReceive {
  userId: string;
  message: string;
}

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageReceive[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (message) {
      socket.emit("add-message", message);
    }
  };

  useEffect(() => {
    // adding new messages

    function onMessage({ userId, message }: MessageReceive) {
      setMessages((prev) => [...prev, { userId, message }]);

      setMessage("");
    }

    socket.on("receive-message", onMessage);

    return () => {
      socket.off("receive-message", onMessage);
    };
  }, []);

  useEffect(() => {
    // scrolling down when new messages appears

    function updateScrollPosition() {
      if (!containerRef.current) {
        return;
      }

      const { scrollHeight } = containerRef.current;

      containerRef.current.scrollTo({ top: scrollHeight });
    }

    updateScrollPosition();
  }, [messages]);

  return (
    <div className="h-full flex flex-col max-h-full">
      <div className="flex-1 max-h-full overflow-y-auto" ref={containerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={classNames("flex mb-1", {
              "bg-[#f0f0f0]": index % 2 === 0,
              "bg-[#e0e0e0]": index % 2 !== 0,
              "mb-0": messages.length - 1 === index,
            })}
          >
            <span className="username">{msg.userId}:</span> {msg.message}
          </div>
        ))}
      </div>

      <form className="flex gap-2" onSubmit={handleSendMessage}>
        <Input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(value) => setMessage(value)}
        />
        <Button appearance="primary" type="submit">
          Send
        </Button>
      </form>
    </div>
  );
};
