import Notification from './Notification'

export default async function Notifications() {
    return (
        <div className="w-full h-full flex flex-col justify-start items-start gap-4">
            {
                Array(15).fill("").map((e,i)=> (
                    <Notification data={e} key={i} />
                ))
            }
        </div>
    )
}