import { cn } from "@/lib/utils";
import { useTheme } from "@mui/material/styles";

interface ChipsProps extends React.HTMLAttributes<HTMLDivElement> {
    icon: React.JSX.Element | string;
    text: string;
    selected?: boolean;
}
export default function Chips({
    icon,
    text,
    selected = false,
    ...rest
}: ChipsProps) {
    const {
        palette: {
            primary: { main },
        },
    } = useTheme();
    let Icon: React.JSX.Element | string = <div>{icon}</div>;
    if (typeof icon !== "string") {
        Icon = icon;
    }
    return (
        <div
            className={cn(
                `flex justify-center items-center flex-row rounded-full border-2 border-solid w-fit p-1 text-xs gap-1 cursor-pointer`
            )}
            style={{
                background: main + "33",
                borderColor: selected ? main : "rgb(107 114 128 / 1)",
            }}
            {...rest}
        >
            {Icon}
            {text && <div>{text}</div>}
        </div>
    );
}
