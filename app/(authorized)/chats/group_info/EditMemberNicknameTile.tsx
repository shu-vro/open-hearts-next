"use client";
import {
    Avatar,
    Box,
    FormControl,
    InputAdornment,
    OutlinedInput,
    Typography,
} from "@mui/material";
import HoverWrapper from "../../HoverWrapper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";
import { TGroupMembersBasicDetails, UserType } from "@/app";
import Link from "next/link";
import { useState } from "react";
import { SITEMAP } from "@/lib/variables";
import { useGroup } from "@/contexts/GroupContext";
import { changeGroupInformation } from "@/lib/helpers/firebase-helpers";
import { useParams } from "next/navigation";
import { LoadingButton } from "@mui/lab";

dayjs.extend(relativeTime);

export default function EditMemberTile({
    member,
    user,
}: {
    member: TGroupMembersBasicDetails | null;
    user?: UserType;
}) {
    const params = useParams() as { group: string };
    const { group } = useGroup();
    const [nickname, setNickname] = useState(member?.nickname || "");
    const [loading, setLoading] = useState(false);

    if (!user) return "";

    return member ? (
        <HoverWrapper className="mb-2 mx-1 w-[calc(100%-1rem)]">
            <Box
                className="grid p-2 text-inherit hover:no-underline"
                sx={{
                    gridTemplateAreas: `
                            'avatar ${"edit ".repeat(50)}'
                            '.      ${"name ".repeat(50)}'
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
                    className={"self-center mr-2"}
                />
                <FormControl
                    variant="outlined"
                    fullWidth
                    sx={{
                        gridArea: "edit",
                    }}
                >
                    <OutlinedInput
                        fullWidth
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                        }}
                        name={"change_nickname__" + member.id}
                        endAdornment={
                            <InputAdornment position="end">
                                <LoadingButton
                                    size="small"
                                    variant="contained"
                                    loading={loading}
                                    sx={{
                                        fontSize: ".70rem",
                                    }}
                                    onClick={async () => {
                                        if (!params || !params?.group || !group)
                                            return;
                                        setLoading(true);
                                        let n = { ...group };
                                        if (nickname === "") {
                                            if (!user) return;
                                            n.groupMembersBasicDetails =
                                                n.groupMembersBasicDetails?.map(
                                                    (mbr) => {
                                                        if (
                                                            mbr.id === member.id
                                                        ) {
                                                            mbr = {
                                                                ...mbr,
                                                                nickname:
                                                                    user.name,
                                                            };
                                                        }
                                                        return mbr;
                                                    }
                                                );
                                        } else {
                                            n.groupMembersBasicDetails =
                                                n.groupMembersBasicDetails?.map(
                                                    (mbr) => {
                                                        if (
                                                            mbr.id === member.id
                                                        ) {
                                                            mbr = {
                                                                ...mbr,
                                                                nickname,
                                                            };
                                                        }
                                                        return mbr;
                                                    }
                                                );
                                        }
                                        await changeGroupInformation(
                                            params.group,
                                            n
                                        );
                                        setLoading(false);
                                    }}
                                >
                                    <span>set</span>
                                </LoadingButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <Typography
                    noWrap
                    className="name text-xl font-bold ml-4"
                    sx={{
                        gridArea: "name",
                    }}
                >
                    {user.name || ""}
                </Typography>
            </Box>
        </HoverWrapper>
    ) : null;
}
