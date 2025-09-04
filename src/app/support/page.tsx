
'use client';

import { useState, useEffect, useRef } from 'react';
import { useData } from '@/context/DataProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SupportPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const { supportTickets, addSupportMessage } = useData();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let id = sessionStorage.getItem('supportSessionId');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem('supportSessionId', id);
    }
    setSessionId(id);
  }, []);

  const currentTicket = supportTickets.find(t => t.id === sessionId);

  const handleSendMessage = () => {
    if (sessionId && messageText.trim()) {
      addSupportMessage(sessionId, messageText.trim());
      setMessageText('');
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentTicket?.messages]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <div className="mx-auto max-w-2xl">
          <Card className="h-[70vh] flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <MessageSquare /> Support Chat
              </CardTitle>
              <CardDescription>We're here to help. Send us a message!</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                <ScrollArea className="flex-grow h-[40vh] pr-4" ref={scrollAreaRef}>
                  <div className="space-y-6">
                    {currentTicket ? currentTicket.messages.map((message, index) => (
                      <div key={index} className={cn("flex items-end gap-3", message.sender === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{message.sender === 'user' ? 'Y' : 'A'}</AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "max-w-xs md:max-w-md p-3 rounded-lg",
                          message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}>
                          <p>{message.text}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-muted-foreground pt-10">
                        <p>No messages yet. Type below to start a conversation.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="mt-auto flex items-center gap-2 border-t pt-4">
                  <Textarea
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                    className="min-h-[40px]"
                  />
                  <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
