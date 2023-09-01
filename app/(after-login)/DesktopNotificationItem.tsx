import { Badge, IconButton, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { MdOutlineNotifications } from "react-icons/md";

export default function DesktopNotificationItem() {
    const [anchorElForMessagesPopover, setAnchorElForMessagesPopover] =
        useState<null | HTMLElement>(null);
    return (
        <>
            <Popover
                id="messages-popover"
                open={Boolean(anchorElForMessagesPopover)}
                anchorEl={anchorElForMessagesPopover}
                onClose={() => setAnchorElForMessagesPopover(null)}
                sx={{ height: 300 }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia
                odit, dicta a enim animi quasi! Incidunt perferendis
                perspiciatis corrupti earum cupiditate laboriosam harum
                voluptates quos nisi ratione mollitia a qui minus nam velit
                aspernatur, delectus minima eum modi ad soluta. A, officia nemo
                accusantium obcaecati quasi incidunt delectus, culpa est rerum
                maiores repellendus eligendi similique rem exercitationem
                deserunt doloribus modi autem recusandae! Minima accusantium
                temporibus deleniti laborum. Asperiores molestias ab quisquam
                nisi at consectetur dolor eum, non dicta? Rerum, veniam magnam?
                Adipisci eius praesentium beatae ducimus aperiam vero ipsa
                magnam dolore, quis explicabo natus vel accusantium maxime
                dolorem earum rem voluptatibus corporis quod fugit ipsam error!
                Molestiae mollitia libero nemo inventore, dolores voluptatem
                beatae. Rem quae debitis, beatae, sunt quia necessitatibus ea
                dolorum voluptates saepe assumenda deleniti? Impedit nostrum
                tempora nam repudiandae ea ipsam maiores facilis. Esse
                temporibus, quae asperiores veniam ullam delectus sit alias
                libero dolor dolore, voluptas ipsum dicta cumque in corporis
                magni explicabo totam deserunt eius qui veritatis. Ducimus
                assumenda unde possimus itaque distinctio temporibus dignissimos
                vel porro optio totam veritatis iusto quos impedit delectus,
                neque nobis architecto, omnis id at similique blanditiis
                voluptatem necessitatibus deleniti a. Culpa blanditiis vero
                minima! Ad repellendus, totam eaque libero harum voluptates iste
                earum nisi? Veniam magni deserunt fuga adipisci reiciendis est
                vel vero minima dolores ex perspiciatis reprehenderit quibusdam,
                facere, dolorem quae minus! Vitae eveniet quia deleniti
                voluptates architecto doloribus dicta aliquid est nesciunt
                itaque, cum velit odit recusandae esse minima veritatis nam
                incidunt porro quisquam quasi, mollitia voluptatum non omnis
                quod? Beatae dicta dolorum voluptatibus repellat aperiam ducimus
                vitae quasi. In deleniti doloribus quo harum molestiae, sequi
                mollitia voluptatem error ratione ex explicabo deserunt suscipit
                commodi labore distinctio sunt ut esse omnis expedita provident?
                Assumenda tenetur quidem at saepe perspiciatis. Iste, quia!
                Itaque dignissimos atque corporis doloremque adipisci eos?
            </Popover>
            <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={(e) => setAnchorElForMessagesPopover(e.currentTarget)}
            >
                <Badge badgeContent={17} color="error">
                    <MdOutlineNotifications />
                </Badge>
            </IconButton>
        </>
    );
}
