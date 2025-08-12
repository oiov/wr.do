import { User } from "@prisma/client";
import { AvatarProps } from "@radix-ui/react-avatar";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name" | "email">;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage
        alt="Picture"
        src={
          user.image ??
          `https://api.dicebear.com/9.x/initials/svg?seed=${user.name || user.email}`
        }
        referrerPolicy="no-referrer"
      />
    </Avatar>
  );
}
