import SearchBar from '../SearchBar'
import LeftSideBar from './LeftSideBar'
import RightSideBar from './RightSideBar'

export default function Chats() {
    return (
        <div className="w-full h-full flex flex-row">
            <LeftSideBar />
            <main className="grow bg-green-600">
                Hello from chat. 
            </main>
            <RightSideBar />
        </div>
    )
}