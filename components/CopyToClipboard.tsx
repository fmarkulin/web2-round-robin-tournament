"use client";

import { ClipboardCopy } from "lucide-react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function CopyToClipboard() {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.toString());
    toast("Copied to clipboard!", {
      icon: "📋",
    });
  };

  return (
    <TooltipProvider delayDuration={350}>
      <Tooltip>
        <TooltipTrigger>
          <Button
            size={"icon"}
            asChild
            variant={"outline"}
            className="hover:cursor-pointer"
            onClick={copyToClipboard}
          >
            <ClipboardCopy className="p-2" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy path to clipboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
