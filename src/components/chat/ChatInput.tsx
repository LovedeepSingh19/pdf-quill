import React from "react";
import { Textarea } from "../ui/textarea";
import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";

type ChatInputProps = {
  isDisabled?: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({ isDisabled }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                rows={4}
                maxRows={4}
                autoFocus
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                placeholder="Enter your question..."
              />
              <Button className='absolute bottom-1.5 right-[8px]'>
                <SendIcon className="h-4 w-4" aria-label="send message"/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatInput;