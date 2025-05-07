import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function TooltipWrapper({
  children,
  content,
  ...props
}: React.ComponentPropsWithoutRef<typeof Tooltip> & {
  content: React.ReactNode;
}) {
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="bg-foreground">{content}</TooltipContent>
    </Tooltip>
  );
}
