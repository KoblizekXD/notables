import { SidebarSettingsForm } from "@/components/sidebar-settings-form";
import { ThemeSettingsForm } from "@/components/theme-settings-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserSettings } from "@/components/user-settings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Settings() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return (
    <div className="m-3 sm:m-4 md:m-5">
      <div className="flex flex-col w-full lg:max-w-4xl xl:max-w-7xl mx-auto gap-8">
        <Accordion
          type="single"
          collapsible
          className="space-y-4"
          defaultValue="theme-settings">
          <AccordionItem value="theme-settings">
            <AccordionTrigger className="text-lg font-semibold text-muted-foreground">
              Theme Settings
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Customize the appearance of the application. Changes are applied
                immediately and cached locally.
              </p>
              <ThemeSettingsForm />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sidebar-settings-new">
            <AccordionTrigger className="text-lg font-semibold text-muted-foreground">
              Sidebar Settings
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure the sidebar position and behavior. Changes are applied
                immediately and cached locally.
              </p>
              <SidebarSettingsForm />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="avatar-upload">
            <AccordionTrigger className="text-lg font-semibold text-muted-foreground">
              User settings
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose a profile picture and adjust the crop area to your
                liking. A square aspect ratio is recommended for optimal
                display.
              </p>
              <UserSettings
                userId={session.user.id}
                currentImagePath={session.user.image}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
