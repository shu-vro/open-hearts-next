"use client";

import useFetchGroups from "@/lib/hooks/useFetchGroups";
import { GroupList } from "../GroupList";
import { useState } from "react";
import SearchGroup from "../SearchGroup";
import { Box, Button, ButtonGroup } from "@mui/material";
import { AlertDialog } from "../AlertDialog";

export default function LeftSideBar() {
    const groups = useFetchGroups();
    const [searching, setSearching] = useState(false);
    const [searchGroup, setSearchGroup] = useState(/.*/g);

    return (
        <div className="w-1/4 max-[962px]:hidden flex justify-start items-start flex-col h-full relative">
            <TopBarAllMessage setSearching={setSearching} />
            <SearchGroup
                searching={searching}
                setSearching={setSearching}
                setSearchGroup={setSearchGroup}
            />
            <div className="w-full overflow-y-auto h-full mt-3">
                {groups
                    .filter((e) => e.name.search(searchGroup) > -1)
                    .map((group) => (
                        <GroupList key={group.id} group={group} />
                    ))}
                {!groups.length && <NoGroupBanner />}
            </div>
        </div>
    );
}

export function NoGroupBanner() {
    return (
        <div className="w-full h-full flex justify-center items-center flex-col">
            <div className="text-[max(3vw,3vh)] text-center">
                ¯\_( ͡° ͜ʖ ͡°)_/¯ T
            </div>
            <span className="text-center capitalize">
                Groups you are added will appear here
            </span>
        </div>
    );
}

function TopBarAllMessage({
    setSearching,
}: {
    setSearching: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);

    return (
        <Box position="sticky" className="top-0 w-full mx-0">
            <ButtonGroup
                variant="outlined"
                aria-label="outlined primary button group"
                fullWidth
            >
                <Button
                    onClick={() => {
                        setOpenCreateGroupDialog(true);
                    }}
                >
                    Create Group
                </Button>
                <Button
                    onClick={() => {
                        setSearching((prev) => !prev);
                    }}
                >
                    Search
                </Button>
            </ButtonGroup>
            <AlertDialog
                open={openCreateGroupDialog}
                setOpen={setOpenCreateGroupDialog}
            />
        </Box>
    );
}
