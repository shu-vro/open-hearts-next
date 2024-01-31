import { useGroup } from "@/contexts/GroupContext";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { changeGroupInformation } from "@/lib/helpers/firebase-helpers";
import { LoadingButton } from "@mui/lab";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    FormControl,
    InputAdornment,
    OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";

export default function GroupAdminAccordion({ loading }: { loading: boolean }) {
    const { group } = useGroup();
    const [groupname, setGroupname] = useState(group?.name || "");
    const { setMessage } = useToastAlert();
    return (
        <AccordionDetails>
            <FormControl
                variant="outlined"
                fullWidth
                sx={{
                    gridArea: "edit",
                }}
            >
                <OutlinedInput
                    fullWidth
                    defaultValue={group?.name}
                    // value={groupname}
                    onChange={(e) => {
                        setGroupname(e.target.value);
                    }}
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
                                    if (!group)
                                        return setMessage(
                                            "Warning: Group is not resolved"
                                        );
                                    if (groupname.length < 3) {
                                        return setMessage(
                                            "Error: cancelling operation. Name must be at least 3 characters long"
                                        );
                                    }
                                    if (groupname.length > 20) {
                                        return setMessage(
                                            "Error: cancelling operation. Name must be less than 20 characters long"
                                        );
                                    }
                                    if (groupname === group.name) {
                                        return setMessage(
                                            "Error: group name didn't change"
                                        );
                                    }

                                    changeGroupInformation(group.id, {
                                        name: groupname,
                                    });
                                }}
                            >
                                <span>set</span>
                            </LoadingButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </AccordionDetails>
    );
}
