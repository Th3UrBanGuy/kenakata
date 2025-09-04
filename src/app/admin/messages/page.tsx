
'use client';

import { useState } from 'react';
import { useData } from '@/context/DataProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MessagesPage() {
  const { supportTickets, addSupportReply } = useData();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (selectedTicketId && replyText.trim()) {
      addSupportReply(selectedTicketId, replyText.trim());
      setReplyText('');
    }
  };

  const selectedTicket = supportTickets.find(t => t.id === selectedTicketId);
  const unreadTickets = supportTickets.filter(t => t.status === 'open').length;

  return (
    <div className="grid h-[calc(100vh-120px)] md:grid-cols-[300px_1fr] gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center justify-between">
            Inbox 
            {unreadTickets > 0 && <span className="text-sm bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">{unreadTickets}</span>}
          </CardTitle>
          <CardDescription>All active support tickets.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2">
              {supportTickets.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors",
                    selectedTicketId === ticket.id ? 'bg-muted' : 'hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold truncate">User {ticket.id.slice(0, 6)}</p>
                    {ticket.status === 'open' && <span className="h-2 w-2 rounded-full bg-primary"></span>}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{ticket.messages.at(-1)?.text}</p>
                </button>
              ))}
              {supportTickets.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                  <MessageSquare className="mx-auto h-12 w-12" />
                  <p className="mt-4">No messages yet.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Conversation</CardTitle>
          {selectedTicket && <CardDescription>Replying to User {selectedTicket.id.slice(0, 6)}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <ScrollArea className="flex-grow h-[calc(100vh-350px)] pr-4">
            <div className="space-y-6">
              {selectedTicket ? selectedTicket.messages.map((message, index) => (
                <div key={index} className={cn("flex items-end gap-3", message.sender === 'admin' ? 'flex-row-reverse' : 'flex-row')}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{message.sender === 'user' ? 'U' : 'A'}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "max-w-xs md:max-w-md p-3 rounded-lg",
                    message.sender === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    <p>{message.text}</p>
                  </div>
                </div>
              )) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Select a ticket to view the conversation.</p>
                </div>
              )}
            </div>
          </ScrollArea>
          {selectedTicket && (
            <div className="mt-auto flex items-center gap-2 border-t pt-4">
              <Textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); }}}
                className="min-h-[40px]"
              />
              <Button onClick={handleReply} disabled={!replyText.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
