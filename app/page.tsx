import { redirect } from "next/navigation";

function Home() {
    redirect("/chats");
    return null;
}
export default Home;
