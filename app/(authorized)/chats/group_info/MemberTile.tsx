"use client";
import { Avatar, Box, Typography } from "@mui/material";
import HoverWrapper from "../../HoverWrapper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";
import { TGroupMembersBasicDetails, UserType } from "@/app";
import Link from "next/link";
import { SITEMAP } from "@/lib/variables";
import AdminControlMember from "./AdminControlMember";
import { ROLE } from "@/lib/variables";

dayjs.extend(relativeTime);

export function MemberTile({
    member,
    user,
    addedBy,
    myRole,
}: {
    member: TGroupMembersBasicDetails | null;
    user?: UserType;
    addedBy: TGroupMembersBasicDetails | undefined;
    myRole?: ROLE | undefined;
}) {
    const isActive = true;
    if (!user) return "";
    return member ? (
        <HoverWrapper className="mb-2 mx-1 w-[calc(100%-1rem)]">
            <Box
                className="grid p-2 text-inherit hover:no-underline"
                sx={{
                    gridTemplateAreas: `
                            'avatar ${"name ".repeat(50)} more'
                            'avatar ${"nickname ".repeat(50)} more'
                            'avatar ${"addedBy ".repeat(51)}'
                        `,
                }}
            >
                <Avatar
                    component={Link}
                    href={SITEMAP.profile + `/${member.id}`}
                    src={user.photoURL || ""}
                    alt={user.name || "Friend's name"}
                    sx={{
                        gridArea: "avatar",
                    }}
                    className={cn(
                        "self-center mr-2 border-3 border-solid w-14 h-14",
                        isActive ? "border-green-600" : "border-red-500"
                    )}
                />
                <Typography
                    noWrap
                    className="name text-lg"
                    sx={{
                        gridArea: "name",
                    }}
                >
                    {user.name || ""}
                </Typography>
                {member?.nickname && (
                    <Typography
                        noWrap
                        className="name text-xs items-start opacity-70"
                        sx={{
                            transform: "translateY(-.25rem)",
                            gridArea: "nickname",
                        }}
                    >
                        {member.nickname} •{" "}
                        {member.role === 0
                            ? "owner"
                            : member.role === 1
                            ? "admin"
                            : "member"}
                    </Typography>
                )}
                <Typography
                    noWrap
                    variant="subtitle2"
                    className="capitalize"
                    sx={{
                        color: "primary.light",
                        gridArea: "addedBy",
                    }}
                >
                    added by {addedBy?.nickname || "owner"}
                </Typography>
                {typeof myRole === "number" &&
                myRole < ROLE.admin &&
                member.role > myRole ? (
                    <AdminControlMember member={member} />
                ) : (
                    typeof myRole === "number" &&
                    myRole < ROLE.member &&
                    member.role > myRole && (
                        <AdminControlMember member={member} />
                    )
                )}
            </Box>
        </HoverWrapper>
    ) : null;
}
