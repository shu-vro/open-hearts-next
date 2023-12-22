import { cn } from "@/lib/utils";

type Props = {
    children: React.ReactNode;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
};
export default function AuthForm({ children, onSubmit }: Props) {
    return (
        <form
            autoComplete="off"
            spellCheck={false}
            className={cn(
                "max-w-full w-[380px] shadow-lg",
                `bg-slate-300 text-black dark:text-slate-50 dark:bg-[#252525] mt-8`,
                "relative rounded-lg flex justify-center items-center px-5 py-10 flex-col overflow-hidden"
            )}
            onSubmit={onSubmit}
        >
            {children}
        </form>
    );
}
