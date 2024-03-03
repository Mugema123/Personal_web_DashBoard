// component
import SvgColor from "../../../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1, background: "#0891B2" }}
  />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
    itemRole: "all"
  },
  {
    title: 'users',
    path: '/dashboard/users',
    icon: icon('ic_user'),
    itemRole: "all"
  },
  {
    title: 'projects',
    path: '/dashboard/projects',
    icon: icon('ic_cart'),
    itemRole: "all"
  },
  {
    title: 'skills',
    path: '/dashboard/skills',
    icon: icon('ic_application'),
    itemRole: "all"
  },
  {
    title: 'services',
    path: '/dashboard/services',
    icon: icon('ic_service'),
    itemRole: "all"
  },
  {
    title: 'blogs',
    path: '/dashboard/blogs',
    icon: icon('ic_blog'),
    itemRole: "all"
  },

];

export default navConfig;
