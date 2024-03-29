"use client";

import InputField from "@/app/(auth)/InputField";
import { auth, firestoreDb, storage } from "@/firebase";
import {
    Alert,
    Autocomplete,
    Avatar,
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    OutlinedInputProps,
    TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { DATABASE_PATH } from "@/lib/variables";
import { UserType } from "@/app";
import { VscChromeClose } from "react-icons/vsc";
import { updateProfile } from "firebase/auth";
import { isEqual } from "lodash";
import { useToastAlert } from "@/contexts/ToastAlertContext";
import { LoadingButton } from "@mui/lab";

export default function General() {
    const [file, setFile] = useState<string | null | undefined>(
        auth.currentUser?.photoURL
    );
    const { setMessage: setSnackbarMessage } = useToastAlert();
    const form = useRef<HTMLFormElement | null>(null);
    const [userInfo, setUserInfo] = useState<Partial<UserType>>({});
    const [userInfoConst, setUserInfoConst] = useState<Partial<UserType>>({});
    const [loading, setLoading] = useState(false);

    const handleFileChange = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setFile(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (!auth.currentUser) {
            return;
        }
        setLoading(true);
        try {
            e.preventDefault();
            if (file && file !== auth.currentUser?.photoURL) {
                // downscale image
                const canvas = document.createElement("canvas")!;
                const image = new Image();
                image.src = file;
                const RATIO = image.naturalHeight / image.naturalWidth;
                const SIZE =
                    image.naturalWidth > 300 ? 300 : image.naturalWidth;
                canvas.width = SIZE;
                canvas.height = SIZE * RATIO;
                const ctx = canvas.getContext("2d")!;

                image.onload = async () => {
                    try {
                        if (!auth.currentUser) {
                            return;
                        }
                        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                        const storageRef = ref(
                            storage,
                            "users/" + auth.currentUser.uid
                        );
                        const result = await uploadString(
                            storageRef,
                            canvas.toDataURL(),
                            "data_url"
                        );
                        let photoURL = await getDownloadURL(result.ref);
                        setFile(photoURL);

                        setUserInfo((prev) => {
                            let now = { ...prev };
                            now.photoURL = photoURL;
                            return now;
                        });
                        await setDoc(
                            doc(
                                firestoreDb,
                                DATABASE_PATH.users,
                                auth.currentUser?.uid!
                            ),
                            { ...userInfo, photoURL }
                        );

                        await updateProfile(auth.currentUser!, {
                            photoURL,
                        });
                        if (process.env.NODE_ENV !== "production") {
                            console.log("photo changed!", photoURL);
                        }
                    } catch (e) {
                        setSnackbarMessage("error uploading image");
                        console.log(
                            `%c${JSON.stringify(e, null, 2)}`,
                            "color: white;background: dodgerblue;border-radius: 5px;padding: 7px;font-size: 1em;"
                        );
                    }
                    canvas.remove();
                    image.remove();
                };
            }

            if (userInfo.name !== auth.currentUser?.displayName) {
                await updateProfile(auth.currentUser!, {
                    displayName: userInfo.name,
                });

                if (process.env.NODE_ENV !== "production") {
                    console.log(
                        `%cnew name: ${userInfo.name} and photo: ${userInfo.photoURL}`,
                        "color: white;background: dodgerblue;border-radius: 5px;padding: 7px;font-size: 2em;"
                    );
                }
            }
            purifyUserInfo(setUserInfo);
            if (!isEqual(userInfoConst, userInfo)) {
                console.log("not equal", userInfoConst, userInfo);
                await setDoc(
                    doc(
                        firestoreDb,
                        DATABASE_PATH.users,
                        auth.currentUser?.uid!
                    ),
                    userInfo
                );
            }
            setSnackbarMessage("User Updated Successfully!");
        } catch (e) {
            setSnackbarMessage(`error: Something went wrong.
${JSON.stringify(e, null, 2)}`);
            console.log(
                `%c${JSON.stringify(e, null, 2)}`,
                "color: white;background: dodgerblue;border-radius: 5px;padding: 7px;font-size: 1.2em;"
            );
        }
        auth.currentUser.reload();
        setLoading(false);
    };
    useEffect(() => {
        (async () => {
            const snapshot = await getDoc(
                doc(
                    firestoreDb,
                    DATABASE_PATH.users,
                    auth.currentUser?.uid || ""
                )
            );
            if (snapshot.exists()) {
                setUserInfo(snapshot.data());
                setUserInfoConst(snapshot.data());
            }
        })();
    }, []);

    return (
        <form ref={form} onSubmit={handleSubmit}>
            <h1>General</h1>
            <FileUploader
                multiple={false}
                handleChange={handleFileChange}
                name="file"
                types={["jpeg", "jpg", "png"]}
                // className="bg-white bg-opacity-20"
                classes="h-36 cursor-pointer flex justify-start items-center flex-row bg-green-600 bg-opacity-20 w-[460px] max-w-full mb-4"
            >
                <Avatar
                    src={file || auth.currentUser?.photoURL || ""}
                    alt="your uploaded"
                    className="rounded-none object-contain"
                    sx={{
                        width: "9rem",
                        height: "9rem",
                        borderRadius: "0px",
                    }}
                />
                <Box className="pl-4">
                    Click <br />
                    or <br />
                    Drag and drop
                </Box>
            </FileUploader>
            <InputField
                label="Your Name"
                value={userInfo?.name || ""}
                className="w-[460px] max-w-full mb-4 block"
                onChange={(e) => {
                    setUserInfo((prev) => {
                        let n = { ...prev };
                        n.name = e.target.value;
                        return n;
                    });
                }}
            />
            <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                maxRows={4}
                className="w-[460px] max-w-full mb-4"
                name="description"
                value={userInfo?.description || ""}
                onChange={(e) => {
                    setUserInfo((prev) => {
                        let n = { ...prev };
                        n.description = e.target.value;
                        return n;
                    });
                }}
            />
            <InputField
                label="Home Town"
                className="w-[460px] max-w-full mb-4 block"
                required={false}
                name="home_town"
                value={userInfo?.hometown || ""}
                onChange={(e) => {
                    setUserInfo((prev) => {
                        let n = { ...prev };
                        n.hometown = e.target.value;
                        return n;
                    });
                }}
            />
            <h2>About You</h2>
            <div className="ml-3">
                <h3>Works</h3>
                {userInfo.works?.map((str, i) => (
                    <AdornmentInput
                        key={i}
                        name={"works_" + i}
                        value={str}
                        onChange={(e) => {
                            setUserInfo((prev) => {
                                let n = { ...prev };
                                if (!n?.works?.length) return n;
                                n.works[i] = e.target.value;
                                return n;
                            });
                        }}
                        setUserInfo={setUserInfo}
                        path="works"
                        label="Works at"
                    />
                ))}
                <Button
                    type="button"
                    variant="contained"
                    onClick={() => {
                        setUserInfo((prev) => {
                            let n = { ...prev };
                            if (n.works?.findIndex((e) => e === "") === -1) {
                                n.works?.push("");
                            }
                            return n;
                        });
                    }}
                >
                    Add field
                </Button>
            </div>
            <div className="ml-3">
                <h3>Studies From</h3>
                {userInfo.studies?.map((str, i) => (
                    <AdornmentInput
                        key={i}
                        name={"studies:" + i}
                        value={str}
                        label="Studies From"
                        onChange={(e) => {
                            setUserInfo((prev) => {
                                let n = { ...prev };
                                if (!n?.studies?.length) return n;
                                n.studies[i] = e.target.value;
                                return n;
                            });
                        }}
                        setUserInfo={setUserInfo}
                        path="studies"
                    />
                ))}
                <Button
                    type="button"
                    variant="contained"
                    onClick={() => {
                        setUserInfo((prev) => {
                            let n = { ...prev };
                            if (n.studies?.findIndex((e) => e === "") === -1) {
                                n.studies?.push("");
                            }
                            return n;
                        });
                    }}
                >
                    Add field
                </Button>
            </div>
            <div className="ml-3">
                <h3>Contacts</h3>
                {Object.entries(userInfo.contacts! || {})?.map(
                    ([key, value], i) => (
                        <div
                            key={i}
                            className="flex justify-start items-start flex-row max-[640px]:flex-col"
                        >
                            <Autocomplete
                                disablePortal
                                freeSolo
                                className="w-[430px] max-w-full mb-4 ml-3 block max-[480px]:ml-0"
                                options={[
                                    "phone number",
                                    "facebook",
                                    "linkedin",
                                    "twitter",
                                    "github",
                                ]}
                                defaultValue={key}
                                sx={{ width: 300 }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Label"
                                        required
                                    />
                                )}
                                inputValue={key}
                                onInputChange={(e, newKey) => {
                                    setUserInfo((prev) => {
                                        let n = { ...prev };
                                        if (n.contacts) {
                                            n.contacts[newKey] = value;
                                            delete n.contacts[key];
                                        }
                                        return n;
                                    });
                                }}
                            />
                            <FormControl
                                variant="outlined"
                                className="w-[430px] max-w-[calc(100%-2rem)] mb-4 ml-8 block"
                            >
                                <InputLabel>How to reach</InputLabel>
                                <OutlinedInput
                                    value={value}
                                    label="How to reach"
                                    onChange={(e) => {
                                        setUserInfo((prev) => {
                                            let n = { ...prev };
                                            if (n.contacts) {
                                                n.contacts[key] =
                                                    e.target.value;
                                            }
                                            return n;
                                        });
                                    }}
                                    fullWidth
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                size="small"
                                                onClick={() => {
                                                    setUserInfo((prev) => {
                                                        let n = { ...prev };
                                                        if (n.contacts) {
                                                            delete n.contacts[
                                                                key
                                                            ];
                                                        }
                                                        return n;
                                                    });
                                                }}
                                            >
                                                <VscChromeClose />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </div>
                    )
                )}
                <Button
                    type="button"
                    variant="contained"
                    onClick={() => {
                        setUserInfo((prev) => {
                            let n = { ...prev };
                            if (n.contacts) {
                                n.contacts[""] = "";
                            }
                            return n;
                        });
                    }}
                >
                    Add field
                </Button>
            </div>
            <LoadingButton
                type="submit"
                size="large"
                sx={{
                    display: "block",
                    mx: "auto",
                }}
                variant="contained"
                loading={loading}
            >
                <span>Submit</span>
            </LoadingButton>
        </form>
    );
}

function AdornmentInput({
    setUserInfo,
    path,
    ...rest
}: Partial<OutlinedInputProps> & {
    setUserInfo: React.Dispatch<React.SetStateAction<Partial<UserType>>>;
    path: "works" | "studies";
}) {
    const removeField = (p: typeof path) => {
        setUserInfo((prev) => {
            let n = { ...prev };
            if (!n[p]) return n;
            let index = n[p]!.findIndex((e) => e === rest.value);
            if (index !== -1) {
                n[p]?.splice(index, 1);
            }
            return n;
        });
    };
    return (
        <FormControl
            variant="outlined"
            className="w-[430px] max-w-full max-[480px]:ml-0"
            sx={{
                display: "block",
                mb: "1rem",
                ml: ".75rem",
            }}
        >
            <InputLabel>{rest["label"]}</InputLabel>
            <OutlinedInput
                fullWidth
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            edge="end"
                            size="small"
                            onClick={() => {
                                removeField(path);
                            }}
                        >
                            <VscChromeClose />
                        </IconButton>
                    </InputAdornment>
                }
                {...rest}
            />
        </FormControl>
    );
}

function purifyUserInfo(
    setUserInfo: React.Dispatch<React.SetStateAction<Partial<UserType>>>
) {
    setUserInfo((prev) => {
        let n = prev;
        n.name = n.name?.trim();
        n.photoURL = n.photoURL?.trim();
        n.works = n.works?.filter((e) => e);
        n.studies = n.studies?.filter((e) => e);

        return n;
    });
}
