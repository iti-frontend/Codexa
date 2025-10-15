import { Bell, BellRing, BookOpen, ChartArea, DollarSign, Star, Users, Video } from "lucide-react"
import { FaRing } from "react-icons/fa"


export const Performances=[
    { text:"Total Student",number:"1,250",icon:Users},
    { text:"Active Courses",number:"5",icon:BookOpen},
    { text:"Rating",number:"4.8",icon:Star},
    { text:"Revenue",number:"$12,450",icon:DollarSign},
]


export const ActiveCourses=[
    { imgSrc:"",TextContent:{
        title:"Intoduction to Next.Js",
        num:'125 Students'
    }},
    { imgSrc:"",TextContent:{
        title:"Advanced Machine Learning",
        num:'89 Students'
    }},
    { imgSrc:"",TextContent:{
        title:"Web Development Fundamentals",
        num:'233 Students'
    }},
]

export const quickLinks=[
    { text:"Create New Courses",icon:Video},
    { text:"New Announcement",icon:BellRing},
    { text:"View Analytics",icon:ChartArea},
]

export const recentActivity=[
    { name:'Abdullah Omar',text:"just enrolled in 'Next.Js'. ",time:'2 mintues ago',imgSrc:''},
    { name:'Zein Mohamed',text:"completed 'Web Development Fundamentals'. ",time:'1 hour ago',imgSrc:''},
    { name:'Lina Ahmed',text:"asked question in 'Advanced Machine Learning'. ",time:'3 hours ago',imgSrc:''},

]



