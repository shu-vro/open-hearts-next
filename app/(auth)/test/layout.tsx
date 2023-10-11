export default function RootLayout({
    children,
}: {
    children: React.ReactElement;
}) {
    return <div className="w-full min-h-[100vh]">{children}</div>;
}
