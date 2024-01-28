import { TGroupMembersBasicDetails } from "@/app";
import { useGroup } from "@/contexts/GroupContext";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { changeGroupInformation } from "@/lib/helpers/firebase-helpers";
import { ROLE } from "@/lib/variables";
import { IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

type Props = { member: TGroupMembersBasicDetails };

export default function AdminControlMember({ member }: Props) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { group } = useGroup();
    const { setMessage } = useToastAlert();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                sx={{
                    gridArea: "more",
                }}
                onClick={handleClick}
            >
                <BsThreeDotsVertical />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        elevation: 10,
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                {member.role === ROLE.member && (
                    <MenuItem
                        onClick={async () => {
                            try {
                                if (!group)
                                    return setMessage(
                                        "error: group is not resolved"
                                    );

                                let groupMembersBasicDetails =
                                    group.groupMembersBasicDetails.map(
                                        (mbr) => {
                                            if (mbr.id === member.id) {
                                                mbr.role = ROLE.admin;
                                            }
                                            return mbr;
                                        }
                                    );
                                await changeGroupInformation(group.id || "", {
                                    groupMembersBasicDetails,
                                });
                                setMessage(
                                    `${member.nickname} was promoted to admin`
                                );
                            } catch (e) {
                                setMessage("Error: check console");
                                console.log(e);
                            }
                            handleClose();
                        }}
                    >
                        Promote to admin
                    </MenuItem>
                )}
                {member.role === ROLE.admin && (
                    <MenuItem
                        onClick={async () => {
                            try {
                                if (!group)
                                    return setMessage(
                                        "error: group is not resolved"
                                    );

                                let groupMembersBasicDetails =
                                    group.groupMembersBasicDetails.map(
                                        (mbr) => {
                                            if (mbr.id === member.id) {
                                                mbr.role = ROLE.member;
                                            }
                                            return mbr;
                                        }
                                    );
                                await changeGroupInformation(group.id || "", {
                                    groupMembersBasicDetails,
                                });
                                setMessage(
                                    `${member.nickname} was demoted to member`
                                );
                            } catch (e) {
                                setMessage("Error: check console");
                                console.log(e);
                            }
                            handleClose();
                        }}
                    >
                        Demote to member
                    </MenuItem>
                )}
                <MenuItem
                    onClick={async () => {
                        try {
                            if (!group)
                                return setMessage(
                                    "error: group is not resolved"
                                );

                            let groupMembers = group.groupMembers.filter(
                                (mbr) => mbr !== member.id
                            );
                            await changeGroupInformation(group?.id || "", {
                                groupMembers,
                            });
                            setMessage(`${member.nickname} was removed.`);
                        } catch (e) {
                            setMessage("Error: check console");
                            console.log(e);
                        }
                        handleClose();
                    }}
                >
                    Remove from group
                </MenuItem>
            </Menu>
        </>
    );
}
