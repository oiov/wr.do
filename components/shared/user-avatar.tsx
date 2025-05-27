import { User } from "@prisma/client";
import { AvatarProps } from "@radix-ui/react-avatar";

import { generateGradientClasses } from "@/lib/enums";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name" | "email">;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage
          alt="Picture"
          src={user.image}
          referrerPolicy="no-referrer"
        />
      ) : (
        <RandomAvatar text={user.name || user.email || ""} />
      )}
    </Avatar>
  );
}

export function RandomAvatar({ text }: { text?: string }) {
  return (
    <div
      className={`flex size-full shrink-0 items-center justify-center rounded-full text-white ${generateGradientClasses(text || "wr.do")}`}
    ></div>
  );
}
