import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'


export default function Notification({data}: {data: object}) {
    console.log(data)
    return (
        <Card sx={{
            width: '100%', 
            minHeight: "3rem",
            color: "#dcdcdc",
            margin: ".5rem",
            background: 'linear-gradient(to right, rgba(30, 144, 255, .3), #23262f 50%)',
        }}>
            <CardContent sx={{
              display: "flex",
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
              padding: '20px !important',
              gap: "15px",
            }}>
                <Avatar alt="Cindy Baker" src="https://mui.com/static/images/avatar/3.jpg" />
                <div className="grow-1">
                    <h4 className="m-0 p-0">Cindy Baker</h4>
                    <span className="truncate w-[300px] overflow-hidden">some cool text that needs attention. some cool text that needs attention. some cool text that needs attention. some cool text that needs attention.</span>
                </div>
                <Button varient="secondary">Mark as read</Button>
            </CardContent>
        </Card>

    )
}