"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import type { Personality } from "../../../lib/personalities";
import type { Message } from "../../../hooks/use-chat-history";
import { User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../lib/utils";

interface ChatMessageProps {
  message: Message;
  personality: Personality;
  isGrouped?: boolean;
}

const colorVariants = {
  blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  green: "from-green-500/20 to-green-600/10 border-green-500/30",
  purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  teal: "from-teal-500/20 to-teal-600/10 border-teal-500/30",
  red: "from-red-500/20 to-red-600/10 border-red-500/30",
};

export function ChatMessage({
  message,
  personality,
  isGrouped = false,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 0.0000001);
  };

  const formatContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const code = part.slice(3, -3).trim();
        const lines = code.split("\n");
        const language = lines[0].match(/^\w+$/) ? lines.shift() : "";
        const codeContent = lines.join("\n");

        return (
          <div
            key={index}
            className="my-3 rounded-xl bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 border border-border/50 overflow-hidden shadow-md"
          >
            {language && (
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-gradient-to-r from-muted/80 to-muted/60 border-b border-border/50">
                {language}
              </div>
            )}
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-foreground font-mono leading-relaxed">
                {codeContent}
              </code>
            </pre>
          </div>
        );
      } else if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="px-2 py-1 text-sm bg-gradient-to-r from-muted to-muted/80 rounded-md font-mono shadow-sm border border-border/30"
          >
            {part.slice(1, -1)}
          </code>
        );
      } else {
        return (
          <span key={index} className="whitespace-pre-wrap leading-relaxed">
            {part
              .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
              .map((textPart, textIndex) => {
                if (textPart.startsWith("**") && textPart.endsWith("**")) {
                  return (
                    <strong
                      key={textIndex}
                      className="font-bold text-foreground"
                    >
                      {textPart.slice(2, -2)}
                    </strong>
                  );
                } else if (textPart.startsWith("*") && textPart.endsWith("*")) {
                  return (
                    <em key={textIndex} className="italic text-foreground/90">
                      {textPart.slice(1, -1)}
                    </em>
                  );
                }
                return textPart;
              })}
          </span>
        );
      }
    });
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-500",
        isUser ? "flex-row-reverse" : "",
        isGrouped ? "mt-2" : "mt-6"
      )}
    >
      {!isGrouped && (
        <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-primary/20 shadow-md transition-all duration-200 hover:ring-primary/40">
          {isUser ? (
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
              <User className="h-4 w-4" />
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage
                src={personality.avatar || "/placeholder.svg"}
                alt={personality.title}
              />
              <AvatarFallback
                className={`bg-gradient-to-br ${
                  colorVariants[personality.color as keyof typeof colorVariants]
                } text-foreground font-semibold`}
              >
                {personality.title
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </>
          )}
        </Avatar>
      )}

      {isGrouped && <div className="w-8 flex-shrink-0" />}

      <div
        className={cn("max-w-[85%] md:max-w-[70%]", isUser ? "text-right" : "")}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl relative group/message transform hover:scale-[1.02]",
            isUser
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-auto rounded-br-md shadow-primary/20"
              : `bg-gradient-to-br ${
                  colorVariants[personality.color as keyof typeof colorVariants]
                } border text-card-foreground rounded-bl-md hover:shadow-lg`
          )}
        >
          <div className="text-sm leading-relaxed font-medium">
            {formatContent(message.content)}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={cn(
              "absolute -top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover/message:opacity-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110",
              isUser
                ? "bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border border-primary-foreground/20"
                : "bg-card/80 hover:bg-card border border-border/50 backdrop-blur-sm"
            )}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>

        {!isGrouped && (
          <p className="text-xs text-muted-foreground mt-2 px-2 font-medium">
            {message.timestamp
              ? new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </p>
        )}
      </div>
    </div>
  );
}
