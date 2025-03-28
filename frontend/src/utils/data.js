import {LuLayoutDashboard, LuVote, LuPenTool, LuBadgeCheck, LuBookmark, LuLogOut} from 'react-icons/lu'

export const SIDE_MENU_DATA = [
    {
        id : "01",
        label : "Dashboard",
        icon  : LuLayoutDashboard,
        path : "/dashboard"
    },
    {
        id : "02",
        label : "Create Poll",
        icon  : LuVote,
        path : "/create-poll"
    },
    {
        id : "03",
        label : "My Polls",
        icon  : LuPenTool,
        path : "/dashboard"
    },
    {
        id : "04",
        label : "Voted Polls",
        icon  : LuBadgeCheck,
        path : "/my-polls"
    },
    {
        id : "05",
        label : "Bookmarks",
        icon  : LuBookmark,
        path : "/bookmarked-polls"
    },
    {
        id : "06",
        label : "Logout",
        icon  : LuLogOut,
        path : "logout"
    }
]