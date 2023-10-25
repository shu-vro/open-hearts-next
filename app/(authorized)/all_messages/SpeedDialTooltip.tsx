"use client";
import {
    Autocomplete,
    Box,
    Checkbox,
    Slide,
    SpeedDial,
    TextField,
} from "@mui/material";
import React, { useState } from "react";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { IoIosCreate } from "react-icons/io";
import { BsSearch } from "react-icons/bs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FirstTimeOpeningGroup } from "@/lib/helpers/firebase-helpers";
import { TransitionProps } from "@mui/material/transitions";
import { useGroup } from "@/contexts/GroupContext";

const actions = [
    {
        icon: <BsSearch />,
        name: "Search",
        onClick: () => {
            return true;
        },
    },
];

export default function SpeedDialTooltip() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);

    return (
        <Box>
            <SpeedDial
                ariaLabel="LeftSideBar SpeedDial"
                className="absolute bottom-4 left-4"
                sx={{
                    "& > button": {
                        bgcolor: "secondary.main",

                        "&:hover": {
                            bgcolor: "secondary.dark",
                        },
                    },
                }}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
            >
                <SpeedDialAction
                    icon={<IoIosCreate />}
                    tooltipTitle="Create Group"
                    tooltipOpen
                    tooltipPlacement="right"
                    onClick={() => {
                        setOpenCreateGroupDialog(true);
                    }}
                    sx={{
                        "& > span": {
                            bgcolor: "primary.main",
                        },
                        "& button": {
                            bgcolor: "primary.main",

                            "&:hover": {
                                bgcolor: "primary.dark",
                            },
                        },
                    }}
                />
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        tooltipPlacement="right"
                        onClick={action.onClick}
                        sx={{
                            "& > span": {
                                bgcolor: "primary.main",
                            },
                            "& button": {
                                bgcolor: "primary.main",

                                "&:hover": {
                                    bgcolor: "primary.dark",
                                },
                            },
                        }}
                    />
                ))}
            </SpeedDial>
            <AlertDialog
                open={openCreateGroupDialog}
                setOpen={setOpenCreateGroupDialog}
            />
        </Box>
    );
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function AlertDialog({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [name, setName] = useState("");
    const [value, setValue] = useState<string[]>([]);
    const { setGroup } = useGroup();

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen
            TransitionComponent={Transition}
            component="form"
            onSubmit={(e) => {
                e.preventDefault();
            }}
        >
            <DialogTitle id="alert-dialog-title">Create a group</DialogTitle>
            <DialogContent>
                <TextField
                    className="w-[500px] max-w-full mt-4"
                    label="Pick a name"
                    required
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <Autocomplete
                    value={value}
                    onChange={(event: any, newValue: string[]) => {
                        setValue(newValue);
                        console.log(newValue);
                    }}
                    disablePortal
                    className="w-[500px] max-w-full mt-4"
                    options={["shirshen", `shuvro`, "purabi", "taposh"]}
                    multiple
                    autoHighlight
                    disableCloseOnSelect
                    renderInput={(params) => (
                        <TextField {...params} label="Pick members" />
                    )}
                    renderOption={(props, option, { selected }) => (
                        <li {...props} key={option}>
                            <Checkbox
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option}
                        </li>
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="error">
                    Close
                </Button>
                <Button
                    onClick={async () => {
                        try {
                            const groupDetails = await FirstTimeOpeningGroup(
                                false,
                                {
                                    name,
                                    invited: value,
                                }
                            );
                            if (groupDetails) {
                                setGroup(groupDetails);
                                handleClose();
                            }
                        } catch (e) {
                            alert("Error! \ncheck console");
                        }
                        // handleClose();
                    }}
                    autoFocus
                    variant="contained"
                    type="submit"
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}
