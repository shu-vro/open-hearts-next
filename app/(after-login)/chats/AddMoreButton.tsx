"use client";

import {
    AppBar,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Tooltip,
    useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsCheck2All, BsFileImage, BsFillPlusCircleFill } from "react-icons/bs";
import { IoCloseCircle } from "react-icons/io5";
import { MdDelete, MdKeyboardVoice } from "react-icons/md";
import numeral from "numeral";
import { cn } from "@/lib/utils";
import { defaultMessage, useMessage } from "@/contexts/MessageContext";

interface DisplayRowProps {
    file: File;
    setFiles: React.Dispatch<
        React.SetStateAction<{ file: File; id: number }[]>
    >;
    k: number;
    setImageLink: React.Dispatch<React.SetStateAction<string[]>>;
}

function DisplayRow({ file, setFiles, k, setImageLink }: DisplayRowProps) {
    const url = URL.createObjectURL(file);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setImageLink((prev) => {
            prev[k] = url;
            return prev;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <TableRow
            className={cn(deleting ? "animate-[slideOff_.5s_forwards]" : "")}
        >
            <TableCell
                align="left"
                padding="none"
                className="cursor-pointer hover:underline hover:text-neutral-400"
                onClick={() => {
                    window.open(url, "_blank");
                }}
            >
                <Tooltip title="click to see preview" arrow>
                    <span>{file.name}</span>
                </Tooltip>
            </TableCell>
            <TableCell align="right" padding="normal">
                {numeral(file.size).format("0.0b")}
            </TableCell>
            <TableCell align="right" padding="normal">
                <Tooltip
                    title={
                        url === ""
                            ? "Not loaded yet"
                            : "Loaded to browser. Note: it hasn't uploaded to server yet. "
                    }
                >
                    <CircularProgress
                        variant={`${url === "" ? "in" : ""}determinate`}
                        value={100}
                        size={30}
                    />
                </Tooltip>
            </TableCell>
            <TableCell align="right" padding="normal">
                <IconButton
                    onClick={() => {
                        setDeleting(true);
                        setTimeout(() => {
                            setFiles((prev) => {
                                return prev.filter((el) => k !== el.id);
                            });
                        }, 500);
                    }}
                >
                    <MdDelete />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

function ImageFileSelect() {
    const { setMessage } = useMessage();
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState<{ file: File; id: number }[]>([]);
    const [imageLink, setImageLink] = useState<string[]>([]);
    const matches649 = useMediaQuery("(max-width: 649px)");
    const selectFiles = () => {
        let inputs = document.createElement("input");
        inputs.type = "file";
        inputs.multiple = true;
        inputs.accept = "image/*";
        inputs.click();
        inputs.oninput = () => {
            let selectedFiles = Array.from(
                inputs.files as unknown as Array<File>
            )
                .filter((file) => file.type.startsWith("image/"))
                .map((file, i) => ({ file, id: i }));
            let prevFileLength = 0;
            setFiles((prev) => {
                prevFileLength = prev?.length!;
                return prev?.length === 0 || selectedFiles.length !== 0
                    ? selectedFiles
                    : prev;
            });
            setOpen(Boolean(selectedFiles?.length) || Boolean(prevFileLength));
        };
        inputs.remove();
    };
    return (
        <>
            <Dialog
                open={open}
                fullWidth
                maxWidth="md"
                onClose={() => {
                    setOpen(false);
                }}
            >
                <AppBar
                    className="flex justify-between items-center flex-row"
                    position="sticky"
                >
                    <h3 className="grow capitalize ml-3">select images</h3>
                    <Button
                        onClick={() => {
                            setOpen(false);
                        }}
                        startIcon={<IoCloseCircle />}
                        variant="contained"
                        color="error"
                        className="mr-2"
                        size={matches649 ? "small" : "medium"}
                    >
                        Close
                    </Button>
                    {Boolean(files.length) && (
                        <Button
                            onClick={() => {
                                // TODO: on the backend, this will be the url of the images. for now, it will just be the dataUrl.
                                setMessage((prev) => {
                                    return {
                                        ...prev,
                                        imageLink: imageLink.filter((e) => e),
                                    };
                                });
                                setOpen(false);
                            }}
                            startIcon={<BsCheck2All />}
                            variant="contained"
                            color="success"
                            size={matches649 ? "small" : "medium"}
                        >
                            Save
                        </Button>
                    )}
                </AppBar>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    component="th"
                                    align="left"
                                    padding="none"
                                >
                                    Name
                                </TableCell>
                                <TableCell
                                    component="th"
                                    align="right"
                                    padding="normal"
                                >
                                    Size
                                </TableCell>
                                <TableCell
                                    component="th"
                                    align="right"
                                    padding="normal"
                                >
                                    Completed
                                </TableCell>
                                <TableCell
                                    component="th"
                                    align="right"
                                    padding="normal"
                                >
                                    Delete
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.map((file, i) => {
                                return (
                                    <DisplayRow
                                        file={file.file}
                                        key={i}
                                        setFiles={setFiles}
                                        k={i}
                                        setImageLink={setImageLink}
                                    />
                                );
                            })}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
            <MenuItem onClick={selectFiles}>
                <IconButton>
                    <BsFileImage />
                </IconButton>
                <p>Image</p>
            </MenuItem>
        </>
    );
}
interface VoiceInputProps extends Props {
    setMenuOpen: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}
function VoiceInput({ form, setMenuOpen }: VoiceInputProps) {
    const { setMessage } = useMessage();
    const [open, setOpen] = useState(false);
    const [recordStart, setRecordStart] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const navigator = globalThis?.navigator || null;
    async function handleVoiceInput(el: HTMLButtonElement) {
        try {
            if (el.dataset.open === "true") {
                // Request access to the user's microphone
                if (!navigator) return;
                let tempMediaStream = await navigator.mediaDevices.getUserMedia(
                    {
                        video: false,
                        audio: true,
                    }
                );
                setMediaStream(tempMediaStream);

                const chunks: BlobEvent["data"][] = [];
                let tempMediaRecorder = new MediaRecorder(tempMediaStream);
                setMediaRecorder(tempMediaRecorder);
                tempMediaRecorder.start();

                tempMediaRecorder.ondataavailable = (e) => {
                    chunks.push(e.data);
                };
                tempMediaRecorder.onstop = () => {
                    setAudioBlob(
                        new Blob(chunks, {
                            type: "audio/ogg; codecs=opus",
                        })
                    );

                    chunks.length = 0;
                };
            } else {
                if (mediaRecorder) {
                    mediaRecorder.stop();
                }
                if (mediaStream) {
                    mediaStream.getTracks().forEach((track) => {
                        track.stop();
                    });
                }
            }
            setRecordStart(RegExp("true").test(el.dataset.open!));
        } catch (e) {
            console.log(e);
            alert(JSON.stringify(e, null, 4));
        }
    }

    return (
        <>
            <Dialog
                open={open}
                fullWidth
                maxWidth="xs"
                onClose={() => {
                    setOpen(false);
                    setRecordStart(false);
                    if (mediaRecorder) {
                        mediaRecorder.stop();
                    }
                    if (mediaStream) {
                        mediaStream.getTracks().forEach((track) => {
                            track.stop();
                        });
                    }
                }}
            >
                <AppBar
                    className="flex justify-between items-center flex-row"
                    position="sticky"
                >
                    <h3 className="grow capitalize ml-3">select images</h3>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            setRecordStart(false);
                            if (mediaRecorder) {
                                mediaRecorder.stop();
                            }
                            if (mediaStream) {
                                mediaStream.getTracks().forEach((track) => {
                                    track.stop();
                                });
                            }
                            setMenuOpen(null);
                        }}
                        startIcon={<IoCloseCircle />}
                        variant="contained"
                        color="error"
                        className="mr-2"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            setRecordStart(false);
                            // send to server using uploadBytes of firebase.
                            setMessage(() => {
                                return {
                                    ...defaultMessage,
                                    voice: URL.createObjectURL(audioBlob!),
                                };
                            });
                            setTimeout(() => {
                                form?.dispatchEvent(
                                    new Event("submit", {
                                        bubbles: true,
                                    })
                                );
                            }, 100);
                            setMenuOpen(null);
                        }}
                        disabled={recordStart || !audioBlob}
                        startIcon={<BsCheck2All />}
                        variant="contained"
                        color="success"
                    >
                        Save
                    </Button>
                </AppBar>
                <DialogContent>
                    <IconButton
                        className="block m-auto mb-9 mt-5"
                        onClick={(e) => {
                            if (
                                !RegExp("true").test(
                                    e.currentTarget.dataset.open!
                                )
                            ) {
                                e.currentTarget.dataset.open = "true";
                            } else e.currentTarget.dataset.open = "false";
                            handleVoiceInput(e.currentTarget);
                        }}
                    >
                        <svg
                            className="w-[200px] p-5"
                            strokeWidth="0"
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill={
                                    recordStart ? "dodgerblue" : "currentColor"
                                }
                                d="M510.88 704h7.6C607.44 704 672 638.4 672 548.032V166.624C672 73.184 604.56 0 518.466 0h-7.584C423.264 0 352 74.752 352 166.624v381.408C352 636.944 420.304 704 510.88 704z"
                            ></path>
                            <path
                                fill={recordStart ? "cyan" : "currentColor"}
                                d="M416 166.624C416 110.032 458.56 64 510.88 64h7.6C569.504 64 608 108.128 608 166.624v381.408C608 603.024 572.032 640 518.464 640h-7.584c-55.872 0-94.88-37.808-94.88-91.968z"
                            ></path>
                            <path
                                fill={
                                    recordStart ? "orangered" : "currentColor"
                                }
                                d="M800 352c-17.68 0-32 14.336-32 32v133.072c0 190.4-67.968 282.929-207.744 282.929H465.12c-182.8 0-209.12-153.84-209.12-282.928V384.001c0-17.664-14.336-32-32-32s-32 14.336-32 32v133.072c0 220.496 91.888 346.928 273.12 346.928H480v96H320c-17.664 0-32 14.336-32 32s14.336 32 32 32h384c17.664 0 32-14.336 32-32s-14.336-32-32-32H544v-96h16.256C684.224 864.001 832 803.809 832 517.072V384c0-17.664-14.32-32-32-32z"
                            ></path>
                        </svg>
                    </IconButton>
                    <div className="text-center">Click On The Microphone</div>
                    {audioBlob && (
                        <Button
                            className="block mx-auto"
                            variant="outlined"
                            color="warning"
                            onClick={() => {
                                setAudioBlob(null);
                            }}
                        >
                            Discard
                        </Button>
                    )}
                </DialogContent>
            </Dialog>
            <MenuItem
                onClick={() => {
                    setOpen(true);
                }}
            >
                <IconButton>
                    <MdKeyboardVoice />
                </IconButton>
                <p>Voice</p>
            </MenuItem>
        </>
    );
}

interface Props {
    form: HTMLFormElement;
}

export default function AddMoreButton({ form }: Props) {
    const [MenuOpen, setMenuOpen] = useState<HTMLButtonElement | null>(null);
    return (
        <>
            <Menu
                open={Boolean(MenuOpen)}
                anchorEl={MenuOpen}
                onClose={() => {
                    setMenuOpen(null);
                }}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <VoiceInput form={form} setMenuOpen={setMenuOpen} />
                <ImageFileSelect />
            </Menu>
            <IconButton
                size="large"
                type="submit"
                onClick={(e) => {
                    setMenuOpen(e.currentTarget);
                }}
            >
                <BsFillPlusCircleFill />
            </IconButton>
        </>
    );
}
